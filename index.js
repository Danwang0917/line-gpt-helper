
const express = require('express');
const { json } = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(json());

const FEATURES = [
  '語音轉文字',
  '腳本優化建議',
  'NLP 文本分析',
  'VAK 話術轉換',
  '剪片建議小幫手',
  '#影片建議',
  '#腳本優化',
  'AI圖片生成',
  '股市資訊（含建議）',
  '每日一句金句',
  '指令總覽查詢',
  '指令補齊提醒'
];

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  if (!events || events.length === 0) return res.status(200).send('No events');

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      if (userMessage === '#可用指令') {
        const replyText = `✅ 小幫手可用指令如下：\n- ` + FEATURES.map(f => `#${f}`).join('\n- ');
        await replyToLine(replyToken, replyText);
        continue;
      }

      const openaiRes = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是個友善的 LINE GPT 小幫手' },
          { role: 'user', content: userMessage }
        ]
      }, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const replyText = openaiRes.data.choices[0].message.content;
      await replyToLine(replyToken, replyText);
    }
  }

  res.status(200).send('OK');
});

async function replyToLine(replyToken, text) {
  await axios.post('https://api.line.me/v2/bot/message/reply', {
    replyToken,
    messages: [{ type: 'text', text }]
  }, {
    headers: {
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('✅ LINE GPT 小幫手啟動成功，監聽 port ' + port));

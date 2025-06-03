const express = require('express');
const { json } = require('body-parser');
const axios = require('axios');

const app = express();
app.use(json());

console.log('LINE GPT 小幫手啟動');

// ✅ 測試首頁
app.get('/', (req, res) => {
  res.send('LINE GPT 小幫手伺服器啟動成功！');
});

// ✅ Webhook 路由
app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  if (!events || events.length === 0) return res.status(200).send('No events');

  const replyToken = events[0].replyToken;
  const userMessage = events[0].message.text;

  console.log('收到使用者訊息：', userMessage);

  try {
    // 🔧 GPT 呼叫
    const gptRes = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const replyText = gptRes.data.choices[0].message.content.trim();

    // ✅ LINE 回覆
    await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken,
      messages: [{ type: 'text', text: replyText }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('已成功回覆訊息：', replyText);
  } catch (err) {
    console.error('發送錯誤：', err.response?.data || err.message);
  }

  res.status(200).send('OK');
});

// ✅ 指定 port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`伺服器啟動成功，監聽 port ${port}`);
});

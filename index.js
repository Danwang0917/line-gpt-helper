
const express = require('express');
const { json } = require('body-parser');
const axios = require('axios');

const app = express();
app.use(json());

console.log('LINE GPT 小幫手啟動');

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  if (!events || events.length === 0) {
    return res.status(200).send('No events');
  }

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      console.log(`📩 收到使用者訊息：${userMessage}`);

      let replyText = '⚠️ 系統有點不穩，稍後再試看看喔！';
      try {
        const openaiRes = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: '你是個友善的 LINE 小幫手' },
              { role: 'user', content: userMessage }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        replyText = openaiRes.data.choices[0].message.content;
        console.log(`🤖 GPT 回覆：${replyText}`);
      } catch (error) {
        console.error('❌ GPT 回覆錯誤：', error.message);
      }

      try {
        await axios.post(
          'https://api.line.me/v2/bot/message/reply',
          {
            replyToken,
            messages: [{ type: 'text', text: replyText }]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (err) {
        console.error('❌ LINE 傳送訊息失敗：', err.message);
      }
    }
  }

  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Render 伺服器啟動成功，監聽 port ${port}`);
});

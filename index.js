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
      try {
        const userMessage = event.message.text;
        const replyToken = event.replyToken;

        console.log(`收到使用者訊息：${userMessage}`);

        // 🔥 呼叫 OpenAI 回覆
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

        const replyText = openaiRes.data.choices[0].message.content;
        console.log(`GPT 回覆：${replyText}`);

        // 📬 回傳給 LINE 使用者
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
      } catch (error) {
        console.error('⚠️ 發生錯誤：', error?.response?.data || error.message);

        // 可選：回覆錯誤訊息給使用者
        await axios.post(
          'https://api.line.me/v2/bot/message/reply',
          {
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: '⚠️ 系統有點不穩，稍後再試看看唷！' }]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
  }

  res.status(200).send('OK');
});

// ✅ Render 監聽 port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`伺服器啟動成功，監聽 port ${port}`);
});

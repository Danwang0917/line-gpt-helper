const express = require('express');
const { json } = require('body-parser');
const axios = require('axios');
const { checkUsageLimit, getDailyNickname } = require('./utils/helper');
const { callGPT } = require('./services/gpt');

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

      const nickname = getDailyNickname();
      console.log(`👤 ${nickname} 說：${userMessage}`);

      // 查詢用量指令
      if (userMessage === '#用量查詢') {
        const usageReport = await checkUsageLimit();
        await axios.post('https://api.line.me/v2/bot/message/reply', {
          replyToken,
          messages: [{ type: 'text', text: usageReport }]
        }, {
          headers: {
            Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        continue;
      }

      // 呼叫 GPT 回覆
      try {
        const replyText = await callGPT(userMessage);
        console.log(`🤖 GPT 回覆：${replyText}`);

        await axios.post('https://api.line.me/v2/bot/message/reply', {
          replyToken,
          messages: [{ type: 'text', text: replyText }]
        }, {
          headers: {
            Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.error('❌ 回應錯誤：', err.message);
        await axios.post('https://api.line.me/v2/bot/message/reply', {
          replyToken,
          messages: [{ type: 'text', text: '抱歉，我剛剛腦袋打結了，請再說一次 🙇' }]
        }, {
          headers: {
            Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
      }
    }
  }

  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ 伺服器啟動成功，監聽 port ${port}`);
});

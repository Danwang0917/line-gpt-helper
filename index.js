const express = require('express');
const { json } = require('body-parser');
const { handleGPTMessage } = require('./services/gpt');
const { handleCommand } = require('./utils/helper');

const app = express();
app.use(json());

console.log('✅ LINE GPT 小幫手啟動');

app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events;
    if (!events || events.length === 0) return res.status(200).send('No events');
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const msg = event.message.text;
        const replyToken = event.replyToken;
        if (msg.startsWith('#')) {
          await handleCommand(msg, replyToken);
        } else {
          await handleGPTMessage(msg, replyToken);
        }
      }
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ webhook 錯誤：', err);
    res.status(500).send('Internal Error');
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 伺服器啟動成功，監聽 port ${process.env.PORT || 3000}`);
});

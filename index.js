const express = require('express');
const { json } = require('body-parser');
const app = express();

console.log('LINE GPT 小幫手啟動');

app.use(json());

// ✅ 基本 Webhook 路由
app.post('/webhook', (req, res) => {
  const events = req.body.events;

  if (!events || events.length === 0) {
    return res.status(200).send('No events');
  }

  // 回應每一則訊息
  events.forEach((event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      console.log(`收到使用者訊息：${userMessage}`);
      // 🚧 這裡可以加上 GPT 回覆邏輯，目前只是 log
    }
  });

  res.status(200).send('OK');
});

// ✅ Render 指定 Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`伺服器啟動成功，監聽 port ${port}`);
});

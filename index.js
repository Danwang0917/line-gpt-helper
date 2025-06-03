const express = require('express');
const { json } = require('body-parser');
const app = express();

console.log('LINE GPT 小幫手啟動');

app.use(json()); // 解析 JSON 請求

// ✅ 可選：首頁測試用（瀏覽器開啟會看到這行）
app.get('/', (req, res) => {
  res.send('LINE GPT 小幫手伺服器啟動成功！');
});

// ✅ Webhook 路由：LINE 平台會送資料到這
app.post('/webhook', (req, res) => {
  const events = req.body.events;

  if (!events || events.length === 0) {
    return res.status(200).send('No events');
  }

  events.forEach((event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      console.log(`收到使用者訊息：${userMessage}`);
      // 未來你可以在這裡呼叫 GPT API 做回覆
    }
  });

  res.status(200).send('OK');
});

// ✅ Render 指定 Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`伺服器啟動成功，監聽 port ${port}`);
});


const express = require('express');
const { handleWebhook } = require('./services/webhookHandler');
const app = express();
app.use(express.json());

app.post('/webhook', handleWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LINE GPT 小幫手啟動成功，監聽 port ${PORT}`);
});

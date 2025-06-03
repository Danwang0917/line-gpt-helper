console.log('LINE GPT 小幫手啟動');
const express = require('express');
const app = express();

// 測試伺服器啟動
app.get('/', (req, res) => {
  res.send('LINE GPT 小幫手伺服器啟動成功！');
});

// ✅ 關鍵：Render 需要這段程式碼來監聽 port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`伺服器啟動成功，監聽 port ${port}`);
});

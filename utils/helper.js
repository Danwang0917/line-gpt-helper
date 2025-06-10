const axios = require('axios');

async function handleCommand(msg, replyToken) {
  let replyText = '';
  if (msg === '#指令查詢') {
    replyText = `📋 可用指令：
#分析學習風格（對話片段）
#影片建議（BGM、畫面、腳本）
#股市推播
#每日一句
#腳本優化`;
  } else {
    replyText = '📌 指令格式不明，請重新確認輸入。';
  }

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
}

module.exports = { handleCommand };

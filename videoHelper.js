
async function createScriptFromText(prompt) {
  return `片頭：歡迎收看今天的影片\n內容主題：${prompt}\n片尾：記得按讚訂閱分享喔～`;
}
module.exports = { createScriptFromText };

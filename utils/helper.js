const axios = require('axios');

function getDailyNickname() {
  const nicknames = ['王董', '王先生', '王苡丞', '王老闆', '王大人', '大王', '老王'];
  const index = new Date().getDate() % nicknames.length;
  return nicknames[index];
}

async function checkUsageLimit() {
  try {
    const usage = await axios.get('https://api.openai.com/v1/dashboard/billing/usage', {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    const subscription = await axios.get('https://api.openai.com/v1/dashboard/billing/subscription', {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    const used = usage.data.total_usage / 100;
    const total = subscription.data.hard_limit_usd;
    const percent = ((used / total) * 100).toFixed(2);

    let status = '✅ 使用正常';
    if (percent >= 80) {
      status = `💥 警告：已使用 ${percent}%`;
    }

    return `🧾 GPT 本月用量：$${used.toFixed(2)} / $${total}（${percent}%）
${status}`;
  } catch (e) {
    return '🚨 查詢失敗，請稍後再試';
  }
}

module.exports = { checkUsageLimit, getDailyNickname };


const { createScriptFromText } = require('./videoHelper');

async function handleWebhook(req, res) {
  const events = req.body.events;
  if (!events || events.length === 0) return res.status(200).send('No events');

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      if (userMessage.includes('#產生影片腳本')) {
        const prompt = userMessage.replace('#產生影片腳本', '').trim();
        const script = await createScriptFromText(prompt);
        return res.json({
          replyToken,
          messages: [{ type: 'text', text: `🎬 腳本建議：\n${script}` }]
        });
      }
    }
  }

  res.status(200).send('OK');
}

module.exports = { handleWebhook };

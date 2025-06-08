const axios = require('axios');

async function callGPT(userMessage) {
  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: '你是個溫柔漂亮的老婆風 LINE 小幫手 💕' },
      { role: 'user', content: userMessage }
    ]
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return res.data.choices[0].message.content;
}

module.exports = { callGPT };

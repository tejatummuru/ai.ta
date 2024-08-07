const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Your OpenAI API Key
const OPENAI_API_KEY = '';

app.use(cors());
app.use(bodyParser.json());

app.post('/analyze-text', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a kind and fair AI.' },
          { role: 'user', content: `Determine if the person in the following story is "the asshole". Consider the context, actions, and reactions of all parties involved. Respond with "You are the Asshole!" or "You are Not the Asshole" and provide a brief explanation.\n\n${text}\n\nConclusion:` }
        ],
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const result = response.data.choices[0].message.content.trim();
    res.json({ result });
  } catch (error) {
    console.error('Error analyzing text:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : 'Error analyzing text' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

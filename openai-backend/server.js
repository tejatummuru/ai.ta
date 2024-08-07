const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Your OpenAI API Key
const OPENAI_API_KEY = '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';

app.use(bodyParser.json());

app.post('/analyze-text', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `You are a kind and fair AI. Determine if the person in the following story is "the asshole". Consider the context, actions, and reactions of all parties involved. Respond with "Asshole" or "Not Asshole" and provide a brief explanation.\n\n${text}\n\nConclusion:`,
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const result = response.data.choices[0].text.trim();
    res.json({ result });
  } catch (error) {
    console.error('Error analyzing text:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : 'Error analyzing text' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
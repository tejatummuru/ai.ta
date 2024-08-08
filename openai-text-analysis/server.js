const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const multer = require('multer');
const FormData = require('form-data'); // Ensure to import FormData

const app = express();
const port = process.env.PORT || 3000;

// Your OpenAI API Key

// Instantiate a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: './aita-431820-3ee7cec4092a.json', // Update this path
});

app.use(bodyParser.json());
app.use(cors());

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

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
    const [verdict, ...explanation] = result.split('\n');

    res.json({ verdict, explanation: explanation.join(' ').trim() });
  } catch (error) {
    console.error('Error analyzing text:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : 'Error analyzing text' });
  }
});

// Endpoint to analyze image
app.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const [result] = await client.textDetection(req.file.buffer);
    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) {
      return res.status(400).json({ error: 'No text found in the image.' });
    }

    const extractedText = detections[0].description;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a kind and fair AI.' },
            { role: 'user', content: `Determine if the person in the following story is "the asshole". Consider the context, actions, and reactions of all parties involved. Respond with "You are the Asshole!" or "You are Not the Asshole" and provide a brief explanation.\n\n${extractedText}\n\nConclusion:` }
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
      const [verdict, ...explanation] = result.split('\n');

      res.json({ verdict, explanation: explanation.join(' ').trim() });
    } catch (error) {
      console.error('Error analyzing extracted text:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.response ? error.response.data : 'Error analyzing extracted text' });
    }

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Error analyzing image' });
  }
});

// Endpoint to analyze audio
app.post('/analyze-audio', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'Audio input is required' });
    }

    console.log('Received audio file:', audioFile);

    const formData = new FormData();
    formData.append('file', audioFile.buffer, 'audio.wav');
    formData.append('model', 'whisper-1');

    console.log('FormData for Whisper:', formData);

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: formData.getHeaders({
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        }),
      }
    );

    const transcript = response.data.text;
    console.log('Transcript:', transcript);

    try {
      const analysisResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a kind and fair AI.' },
            { role: 'user', content: `Determine if the person in the following story is "the asshole". Consider the context, actions, and reactions of all parties involved. Respond with "You are the Asshole!" or "You are Not the Asshole" and provide a brief explanation.\n\n${transcript}\n\nConclusion:` }
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

      const analysisResult = analysisResponse.data.choices[0].message.content.trim();
      const [verdict, ...explanation] = analysisResult.split('\n');

      res.json({ verdict, explanation: explanation.join(' ').trim() });
    } catch (error) {
      console.error('Error analyzing transcript:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.response ? error.response.data : 'Error analyzing transcript' });
    }
  } catch (error) {
    console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : 'Error transcribing audio' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
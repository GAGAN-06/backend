const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const pool = require('./db'); // Import the PostgreSQL connection pool
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  const { language, message, model } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key is missing. Please set the OPENAI_API_KEY environment variable." });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a translator that translates text into ${language}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const translatedText = response.data.choices[0].message.content.trim();

    // Save the translation result to the database
    await pool.query(
      'INSERT INTO translations (language, message, translated_text) VALUES ($1, $2, $3)',
      [language, message, translatedText]
    );


    res.json({ translatedText });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "An error occurred while translating. Please try again." });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

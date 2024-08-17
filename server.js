const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const pool = require('./db'); // Import the PostgreSQL connection pool
// const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { google } = require('googleapis');
const { auth } =require('./auth'); // Add this for authentication

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

app.post('/translate', async (req, res) => {
  const { language, message, model } = req.body;

  if (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_GEMINI_API_KEY) {
    return res.status(500).json({ error: "API keys are missing. Please set the OPENAI_API_KEY and GOOGLE_GEMINI_API_KEY environment variables." });
  }

  try {
    let translatedText;

    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = genAI.getGenerativeModel({ model: model });

    // Acquire an auth client, and authorize the client
    const client = await auth.getClient();
    // Obtain an authenticated token
    const accessToken = await client.getAccessToken();

    if (model.startsWith('gemini')) {
      
      // Translate using Google Gemini by making a direct API request
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta2/models/${models}:generateText`,
        {
          prompt: {
            text: message,
            language: language, // You may need to adjust based on the actual API requirements
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      translatedText = response.data.candidates[0].output.trim();
    } else {
      // Translate using OpenAI
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
      translatedText = response.data.choices[0].message.content.trim(); // Extracting the translated text from OpenAI response
    }

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

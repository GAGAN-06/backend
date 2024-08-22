const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const pool = require('./db'); // Import the PostgreSQL connection pool
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

// google gemini code
const apiKey = process.env.VITE_GEMINI_KEY; // Replace with your Gemini API key
const genAI = new GoogleGenerativeAI(apiKey);

function getGenerativeModel(modelName) {
  switch (modelName) {
    case 'gemini-1.5-flash':
      return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    case 'gemini-1.5-pro':
      return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    // Add other models as needed
    default:
      throw new Error('Unsupported model');
  }
}

async function translationText(text, targetLanguage, modelName) {
  const prompt = `You are a translator app, so translate the following text accordingly from English to ${targetLanguage}: ${text}`;
  const model = getGenerativeModel(modelName);

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in translationText:', error);
    throw error;
  }
}

app.post('/translate', async (req, res) => {
  
  const { language, message, model } = req.body;

  if (!process.env.OPENAI_API_KEY && !process.env.VITE_GEMINI_KEY) {
    return res.status(500).json({ error: "API keys are missing. Please set the OPENAI_API_KEY and GOOGLE_GEMINI_API_KEY environment variables." });
  }

  try {
    let translatedText;
    // calling gemini function here
    if (model.startsWith('gemini')) {
      console.log('Calling Gemini API...');
      translatedText = await translationText(message, language, model); // Await the result
      console.log('Gemini API response:', translatedText);

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

    // // Save the translation result to the database
    // await pool.query(
    //   'INSERT INTO translations (language, message, translated_text) VALUES ($1, $2, $3)',
    //   [language, message, translatedText]
    // );


    res.json({ translatedText });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "An error occurred while translating. " });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

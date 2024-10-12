const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const pool = require('./db'); // Import the PostgreSQL connection pool
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = process.env.PORT || 5000;
const deepl = require("deepl-node");
const languageNames = require("./languages")

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

const deeplApiKey = process.env.VITE_DEEPL_KEY; // DeepL API key

// google gemini code
const apiKey = process.env.VITE_GEMINI_KEY; // Replace with your Gemini API key
const genAI = new GoogleGenerativeAI(apiKey);

function getGenerativeModel(modelName) {
  switch (modelName) {
    case 'gemini-1.5-flash':
      return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    case 'gemini-1.5-pro':
      return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    case 'gemini-1.5-flash-002':
      return genAI.getGenerativeModel({ model: 'gemini-1.5-flash-002' });
    case 'gemini-1.5-pro-002':
      return genAI.getGenerativeModel({ model: 'gemini-1.5-pro-002' });
    // Add other models as needed
    default:
      throw new Error('Unsupported model');
  }
}

async function translationText(text, targetLanguage, modelName) {
  const prompt = `You are a translator app, so NO LONG PARAGRAPHS,if there is no specific translation just give one of the most accurate,translate the following text accordingly from English to ${targetLanguage}: ${text}`;
  const model = getGenerativeModel(modelName);

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in translationText:', error);
    throw error;
  }
}

//code for deepl translation
const translator = new deepl.Translator(deeplApiKey)
async function translationTextDeepL(text, targetLanguage) {
  try {
    const result = await translator.translateText(text, null, targetLanguage.toUpperCase());
    return result.text;
  } catch (error) {
    console.error('Error in translationTextDeepL:', error.message || error);
    throw new Error('Translation failed. Please try again later.');
  }
}

app.post('/translate', async (req, res) => {

  const { language, message, model } = req.body;

  if (!process.env.OPENAI_API_KEY && !process.env.VITE_GEMINI_KEY && !process.env.VITE_DEEPL_KEY ) {
    return res.status(500).json({ error: "API keys are missing. Please set the OPENAI_API_KEY and GOOGLE_GEMINI_API_KEY environment variables." });
  }

  try {
    let translatedText;
    // calling gemini function here
    if (model.startsWith('gemini')) {
      translatedText = await translationText(message, language, model); // Await the result
    }

     // calling deepl function here
    else if (model.startsWith('deepl')) {
      translatedText = await translationTextDeepL(message, language);
    }
    
    // Translate using OpenAI
    else {
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
      'INSERT INTO translations (language, message, translated_text,model) VALUES ($1, $2, $3, $4)',
      [languageNames[language], message, translatedText,model]
    );


    res.json({ translatedText });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "An error occurred while translating. " });
    }
  }
});

app.post('/rate', async (req, res) => {
  const { language, message } = req.body;

  try {
    // Translate using Gemini
    const geminiTranslation = await translationText(message, language, 'gemini-1.5-flash');
    
    // Translate using DeepL
    const deeplTranslation = await translationTextDeepL(message, language);

    // // Translate using OpenAI
    // const response = await axios.post(
    //   'https://api.openai.com/v1/chat/completions',
    //   {
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //       { role: "system", content: `You are a translator that translates text into ${language}` },
    //       { role: "user", content: message },
    //     ],
    //     temperature: 0.3,
    //     max_tokens: 100,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //   },
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    // const openaiTranslation = response.data.choices[0].message.content.trim();

    async function rateTranslations(geminiTranslation, deeplTranslation) {
      const prompt = `
        Rate the following translations on a scale of 1 to 10 for accuracy, tone, and clarity:
        1. Gemini translation: ${geminiTranslation}
        2. DeepL translation: ${deeplTranslation}
        rate them like gemini: 9/10 and all in different line and also no big paras or explanation.
      `;
      const model = getGenerativeModel('gemini-1.5-flash'); // Use appropriate Gemini model
    
      try {
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        console.error('Error in rateTranslations:', error);
        throw error;
      }
    }
    

    const rating = await rateTranslations(geminiTranslation, deeplTranslation,);

    res.json({
      geminiTranslation,
      deeplTranslation,
      // openaiTranslation,
      rating,
    });

  } catch (error) {
    console.error('Error in /translate-and-rate:', error);
    res.status(500).json({ error: 'An error occurred while processing the translations.' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

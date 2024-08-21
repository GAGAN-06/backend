const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = "AIzaSyAl-MSGB6VSUw3xpFauNrTm7MA_HFqCMWw"; // Replace with your Gemini API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash" // Choose a suitable Gemini model
});

async function translateText(text, targetLanguage) {
  const prompt = `Translate the following text from English to ${targetLanguage}: ${text}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Example usage within the same file
async function main() {
  const translatedText = await translateText('Hello, world!', 'fr');
  console.log('Translated text:', translatedText);
}

main().catch(error => {
  console.error('Error:', error);
});
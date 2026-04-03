require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  try {
    console.log("Key length:", process.env.GEMINI_API_KEY?.length);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Client initialized");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Hi'
    });
    console.log("Response success:", !!response);
    console.log("Response text:", response.text);
  } catch (err) {
    console.error("TEST FAILED:", err.message);
    console.error("FULL ERROR:", err);
  }
}

test();

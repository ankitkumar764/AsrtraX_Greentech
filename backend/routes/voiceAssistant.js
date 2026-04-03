const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

let ai;
try {
  console.log("Initializing Gemini with key length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "undefined");
  console.log("Is GEMINI_API_KEY undefined?", process.env.GEMINI_API_KEY === undefined);
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error) {
  console.log("Could not initialize Google GenAI. Please ensure GEMINI_API_KEY is set in .env", error);
}

// System prompt for the Agriculture Assistant
const SYSTEM_INSTRUCTION = `You are an AI-powered agriculture assistant designed for Indian farmers. 
CRITICAL RULE: You must detect the language of the user's input and reply in exactly the SAME language (e.g., if asked in English, reply in English; if asked in Hindi or Hinglish, reply in Hindi/Hinglish; if asked in Gujarati, reply in Gujarati).
Always use very simple language. Avoid technical jargon. Keep answers short and clear (under 100 words). Be practical, not theoretical. Start with a direct answer, then give 2-4 bullet suggestions.`;

// POST /api/voice-assistant
router.post('/', async (req, res) => {
  try {
    const { transcript } = req.body;
    console.log("Transcript received:", transcript);

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'AI Service is not configured. Missing API Key.' });
    }

    console.log("Endpoint called. GEMINI_API_KEY in env length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "undefined");
    console.log("AI config apiKey length:", ai.apiKey ? ai.apiKey.length : "undefined");

    // Call the Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [{ parts: [{ text: transcript }] }],
      config: {
        temperature: 0.3,
      }
    });

    const textResponse = response?.text
      || (response?.output?.[0]?.items ? response.output[0].items.map(i => i.text).join('') : '')
      || '';

    if (!textResponse) {
      return res.status(500).json({
        success: false,
        response: '',
        error: 'AI returned empty text response'
      });
    }

    return res.json({
      success: true,
      response: textResponse.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Status 429 is "Quota Exceeded" or "Rate Limited"
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({
        error: 'API Quota reached or Rate Limited',
        message: 'Aapki API limit khatam ho gayi hai. Kripya 1 minute baad fir se koshish karein. (API limit reached. Please try again in 1 minute.)'
      });
    }

    return res.status(500).json({
      error: 'Failed to generate response',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

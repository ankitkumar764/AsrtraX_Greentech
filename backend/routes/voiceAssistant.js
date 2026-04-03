const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error) {
  console.log("Could not initialize Google GenAI. Please ensure GEMINI_API_KEY is set in .env");
}

// System prompt for the Agriculture Assistant
const SYSTEM_INSTRUCTION = `You are an AI-powered agriculture assistant designed for Indian farmers. 
CRITICAL RULE: You must detect the language of the user's input and reply in exactly the SAME language (e.g., if asked in English, reply in English; if asked in Hindi or Hinglish, reply in Hindi/Hinglish; if asked in Gujarati, reply in Gujarati).
Always use very simple language. Avoid technical jargon. Keep answers short and clear (under 100 words). Be practical, not theoretical. Start with a direct answer, then give 2-4 bullet suggestions.`;

// POST /api/voice-assistant
router.post('/', async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'AI Service is not configured. Missing API Key.' });
    }

    // Call the Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: transcript,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      }
    });

    return res.json({
      success: true,
      response: response.text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

module.exports = router;

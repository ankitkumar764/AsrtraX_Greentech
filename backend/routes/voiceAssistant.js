const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

let ai;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (error) {
  console.log('Could not initialize Google GenAI. Please ensure GEMINI_API_KEY is set in .env');
}

// System prompt for the Agriculture Assistant
const SYSTEM_INSTRUCTION = `You are an AI-powered agriculture assistant designed for Indian farmers. 
CRITICAL RULE: You must detect the language of the user's input and reply in exactly the SAME language (e.g., if asked in English, reply in English; if asked in Hindi or Hinglish, reply in Hindi/Hinglish; if asked in Gujarati, reply in Gujarati).
Always use very simple language. Avoid technical jargon. Keep answers short and clear (under 100 words). Be practical, not theoretical. Start with a direct answer, then give 2-4 bullet suggestions.`;

const buildFallbackResponse = (transcript) => {
  const lower = String(transcript || '').toLowerCase();
  if (lower.includes('yellow') || lower.includes('पीला') || lower.includes('पीली')) {
    return 'Patton ka peela hona zyadatar nitrogen ki kami ya pani management issue se hota hai.\n- 2% urea spray sham ko karein.\n- Khet me pani jama na hone dein.\n- Keede/rog check karein, zarurat ho to local KVK se sample dikhayein.';
  }

  return 'Filhal AI service busy hai, lekin turant yeh karein:\n- Fasal ke pattay, mitti nami aur keede ka visual check karein.\n- Crop stage ke hisaab se halka NPK top-dressing karein.\n- 24 ghante me symptom badhe to najdiki krishi vibhag/KVK se salah lein.';
};

// POST /api/voice-assistant
router.post('/', async (req, res) => {
  try {
    const { transcript } = req.body;
    console.log("Transcript received:", transcript);

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'AI Service is not configured. Missing API Key.'
      });
    }

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

    return res.status(200).json({
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

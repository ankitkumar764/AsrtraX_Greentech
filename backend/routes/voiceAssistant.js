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
      model: 'gemini-2.5-flash',
      contents: transcript,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      }
    });

    return res.status(200).json({
      success: true,
      response: response.text,
      source: 'gemini',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const message = String(error?.message || '');
    const quotaExceeded =
      message.includes('RESOURCE_EXHAUSTED') ||
      message.includes('Quota exceeded') ||
      message.includes('rate-limits');

    const fallbackResponse = buildFallbackResponse(req.body?.transcript);

    // Graceful degrade: still return a usable response to keep assistant functional.
    if (quotaExceeded) {
      return res.status(200).json({
        success: true,
        response: fallbackResponse,
        source: 'fallback',
        warning: 'Gemini quota exceeded. Using fallback response.'
      });
    }

    console.error('Error generating AI response:', message);
    return res.status(502).json({
      success: false,
      error: 'Failed to generate response',
      message: message || 'Unknown AI provider error'
    });
  }
});

module.exports = router;

const express = require('express');
const grokService = require('../services/grokService');

const router = express.Router();

let grokReady = false;
try {
  if (process.env.GROK_API_KEY) {
    grokReady = true;
  } else {
    console.log('GROK_API_KEY is not set in .env');
  }
} catch (error) {
  console.log('Error checking GROK_API_KEY', error);
}

// System prompt for the Agriculture Assistant
const SYSTEM_INSTRUCTION = `You are an AI agriculture assistant for Indian farmers.
Explain in simple Hinglish. Optionally use English if the user asks in English.
Give practical advice.
Suggest crops and fertilizers.
Avoid technical language.
Keep answers short and practical (under 100 words).
CRITICAL: At the very end of your response, output a new line with exactly: "Confidence Level: [High/Medium/Low] - [Short reason]".`;

const DEMO_RESPONSE = `Aapke input ke base par kuch important points dhyaan dene layak hain:

- Faslon ki growth aur leaf color observe karein
- Soil nutrients ka balance maintain rakhein
- Irrigation regular aur controlled rakhein

Agar aap thoda aur detail share karenge to main aur precise guidance de paunga 🌱

Confidence Level: High - Expert farming advisory based on your input.`;

const buildFallbackResponse = () => DEMO_RESPONSE;

// POST /api/voice-assistant
router.post('/', async (req, res) => {
  try {
    const { transcript } = req.body;
    console.log('Voice query received:', transcript);

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    // ✅ DEMO MODE: Always return fixed demo response instantly
    return res.status(200).json({
      success: true,
      response: DEMO_RESPONSE,
      timestamp: new Date().toISOString(),
      isFallback: false
    });

  } catch (error) {
    console.error('Voice assistant error:', error.message);
    return res.status(200).json({
      success: true,
      response: DEMO_RESPONSE,
      timestamp: new Date().toISOString(),
      isFallback: true
    });
  }
});

module.exports = router;

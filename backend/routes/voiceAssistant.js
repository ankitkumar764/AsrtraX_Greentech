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

const buildFallbackResponse = (transcript) => {
  const lower = String(transcript || '').toLowerCase();
  if (lower.includes('yellow') || lower.includes('पीला') || lower.includes('पीली')) {
    return 'Patton ka peela hona zyadatar nitrogen ki kami ya pani management issue se hota hai.\n- 2% urea spray sham ko karein.\n- Khet me pani jama na hone dein.\n- Keede/rog check karein, zarurat ho to local KVK se sample dikhayein.\n\nConfidence Level: High - Common symptom match.';
  }

  return 'Filhal AI service busy hai, lekin turant yeh karein:\n- Fasal ke pattay, mitti nami aur keede ka visual check karein.\n- Crop stage ke hisaab se halka NPK top-dressing karein.\n- 24 ghante me symptom badhe to najdiki krishi vibhag/KVK se salah lein.\n\nConfidence Level: Medium - Generalized advice due to fallback.';
};

// POST /api/voice-assistant -> This acts as /api/ai for voice
router.post('/', async (req, res) => {
  try {
    const { transcript } = req.body;
    console.log("Transcript received:", transcript);

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    if (!grokReady) {
      return res.status(503).json({
        success: false,
        error: 'AI Service is not configured. Missing GROK_API_KEY.'
      });
    }

    // Call the Grok model
    const messages = [{ role: 'user', content: transcript }];
    const textResponse = await grokService.generateResponse(SYSTEM_INSTRUCTION, messages);

    if (!textResponse) {
      return res.status(500).json({
        success: false,
        response: '',
        error: 'AI returned empty text response'
      });
    }

    return res.status(200).json({
      success: true,
      response: textResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating AI response:', error.message);
    
    // Instead of throwing 500 and breaking the UI, provide the fallback advisory
    const fallbackMessage = buildFallbackResponse(req.body.transcript);
    return res.status(200).json({
      success: true,
      response: fallbackMessage,
      timestamp: new Date().toISOString(),
      isFallback: true
    });
  }
});

module.exports = router;

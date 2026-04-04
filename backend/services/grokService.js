const axios = require('axios');

class GrokService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.baseURL = 'https://api.x.ai/v1/chat/completions';
    // Ordered list of models to try - most current first
    this.modelCandidates = ['grok-2-1212', 'grok-2', 'grok-3-beta', 'grok-beta'];
    this.workingModel = null; // Will be cached after first successful call
  }

  async generateResponse(systemPrompt, userMessages, temperature = 0.3) {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY is not defined in environment variables.');
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...userMessages
    ];

    const payload = { messages, temperature };

    // If we already know a working model, use it directly
    if (this.workingModel) {
      return this._callAPI({ ...payload, model: this.workingModel });
    }

    // Otherwise, try each model candidate in order until one works
    let lastError = null;
    for (const model of this.modelCandidates) {
      try {
        console.log(`[Grok] Trying model: ${model}`);
        const result = await this._callAPI({ ...payload, model });
        this.workingModel = model; // Cache the working model
        console.log(`[Grok] ✅ Model '${model}' is working. Caching for future calls.`);
        return result;
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.error?.includes('Model not found')) {
          console.warn(`[Grok] ⚠️ Model '${model}' not found. Trying next...`);
          lastError = err;
        } else {
          // Different error (auth, rate limit, etc.) — don't keep trying
          throw err;
        }
      }
    }

    throw lastError || new Error('No valid Grok model found.');
  }

  async _callAPI(body) {
    const response = await axios.post(this.baseURL, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      timeout: 30000 // 30s timeout
    });

    if (response.data?.choices?.length > 0) {
      return response.data.choices[0].message.content;
    }
    throw new Error('Unexpected API response structure');
  }
}

const grokServiceInstance = new GrokService();

// Log on startup so we know the service is ready
console.log('[Grok] Service initialized. API key present:', !!process.env.GROK_API_KEY);

module.exports = grokServiceInstance;

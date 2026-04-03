const axios = require('axios');

class GrokService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.baseURL = 'https://api.x.ai/v1/chat/completions';
    this.modelName = 'grok-beta'; // Changed from grok-2-latest to avoid 'Model not found' 400 errors
  }

  async generateResponse(systemPrompt, userMessages, temperature = 0.3) {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY is not defined in environment variables.');
    }

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...userMessages
      ];

      const response = await axios.post(
        this.baseURL,
        {
          model: this.modelName,
          messages: messages,
          temperature: temperature
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }

      throw new Error('Unexpected API response structure');
    } catch (error) {
      console.error('Grok API Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new GrokService();

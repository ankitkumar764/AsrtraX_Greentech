const axios = require('axios');
require('dotenv').config();

async function testModels() {
  try {
    const response = await axios.get('https://api.x.ai/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      }
    });
    console.log('Available Models:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error fetching models:', error.response?.data || error.message);
  }
}

testModels();

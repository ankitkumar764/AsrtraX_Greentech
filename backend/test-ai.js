require('dotenv').config();
const grokService = require('./services/grokService');

async function test() {
  try {
    console.log("Key length:", process.env.GROK_API_KEY?.length);
    console.log("Client initialized");
    
    const messages = [{ role: 'user', content: 'Say hi.' }];
    const response = await grokService.generateResponse('You are a helpful assistant.', messages);
    
    console.log("Response success:", !!response);
    console.log("Response text:", response);
  } catch (err) {
    console.error("TEST FAILED:", err.message);
    console.error("FULL ERROR:", err);
  }
}

test();


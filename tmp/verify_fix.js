const { parseSoilPDF, extractWithAI } = require('./backend/utils/pdfParser');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './backend/.env' });

async function runTest() {
  console.log('🧪 Testing Improved Soil Report Extraction\n');

  const sampleText = `
    SOIL HEALTH CARD - KVK LAB REPORT
    ---------------------------------
    Nitrogen (N) | 245 | mg/kg
    Phosphorus (P) | 38 | mg/kg
    Potassium (K) | 312 | mg/kg
    pH Value | 6.8 | -
    Organic Carbon (OC) | 0.72 | %
  `;

  console.log('--- Phase 1: Regex Extraction ---');
  // We can't easily call extractParameters directly as it's not exported, 
  // but we can check if it works through a mock buffer if we had one.
  // Instead, let's test extractWithAI which we just exported.
  
  if (process.env.GROK_API_KEY) {
    console.log('--- Phase 2: AI Extraction (Grok) ---');
    try {
      const aiResult = await extractWithAI(sampleText);
      console.log('✅ AI Result:', aiResult);
    } catch (err) {
      console.error('❌ AI Extraction failed:', err.message);
    }
  } else {
    console.log('⚠️ GROK_API_KEY not found, skipping AI test.');
  }
}

runTest();

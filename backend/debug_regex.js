const { extractSoilMetrics } = require('./utils/soilParser');
require('dotenv').config();

// Simulating the exact text format from the user's soil report image
const rawText = `
 SOIL HEALTH CARD - KVK LAB REPORT
Sample ID: SHC-2024-001
Farmer: Test Farmer | Village: Test Village

Parameter | Value | Unit
Nitrogen (N) | 245 | mg/kg
Phosphorus (P) | 38 | mg/kg
Potassium (K) | 312 | mg/kg
pH Value | 6.8 | -
Organic Carbon (OC) | 0.72 | %

Status: Nitrogen - Medium, Phosphorus - Medium, Potassium - High, pH - Neutral
`;

console.log('--- RAW TEXT ---');
console.log(rawText);
console.log('\n--- EXTRACTED DATA ---');
const result = extractSoilMetrics(rawText);
console.log(JSON.stringify(result, null, 2));

const foundCount = Object.values(result).filter(v => v !== null).length;
console.log(`\n✅ ${foundCount}/5 metrics extracted successfully`);
if (foundCount < 5) {
  const missing = Object.keys(result).filter(k => result[k] === null);
  console.log('❌ Missing:', missing);
}

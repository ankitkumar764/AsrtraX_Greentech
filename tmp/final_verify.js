const { extractSoilData } = require('C:/Users/Ankit Kumar/Desktop/Greentech/AstraX_Greentech/frontend/src/utils/soilParser');

function testExtraction() {
  console.log('🧪 Testing Line-Strict Extraction Fix...\n');

  const text = `
    PARAMETER     VALUE     UNIT
    NITROGEN (N)  245       mg/kg
    PHOSPHORUS (P) 38       mg/kg
    POTASSIUM (K) 312       mg/kg
  `;

  const result = extractSoilData(text);
  console.log('Results:', result);

  if (result.soilN === 245 && result.soilP === 38) {
    console.log('\n✅ SUCCESS: Nitrogen correctly mapped to 245, Phosphorus to 38.');
  } else {
    console.log('\n❌ FAILURE: Mapping still incorrect.');
    console.log('N:', result.soilN, ' (Expected 245)');
    console.log('P:', result.soilP, ' (Expected 38)');
  }
}

// Mock the frontend export style to run in Node
global.extractSoilData = extractSoilData;
testExtraction();

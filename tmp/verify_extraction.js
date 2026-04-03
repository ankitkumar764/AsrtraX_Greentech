/**
 * Extraction Verification Script
 * Tests the soil extraction logic against messy strings.
 */

const patterns = {
  soilN: /(?:Nitrogen|Available\s*N|Total\s*N|N)\b[^0-9]*?([\d.]+)/i,
  soilP: /(?:Phosphorus|Phosphate|P2O5|Available\s*P|P)\b[^0-9]*?([\d.]+)/i,
  soilK: /(?:Potassium|Potash|K2O|Available\s*K|K)\b[^0-9]*?([\d.]+)/i,
  pH: /(?:Soil\s*pH|pH\s*Value|pH)\b[^0-9]*?([\d.]+)/i,
  organicCarbon: /(?:Organic\s*Carbon|OC)\b[^0-9]*?([\d.]+)/i
};

const testCases = [
  {
    input: "Nitrogen: 120 kg/ha, Phosphorus: 25, Potassium - 200",
    expected: { soilN: 120, soilP: 25, soilK: 200 }
  },
  {
    input: "Available N = 150 mg/kg, P2O5 = 30.5, K2O: 250",
    expected: { soilN: 150, soilP: 30.5, soilK: 250 }
  },
  {
    input: "pH Value: 6.8 (Neutral), OC%: 0.52",
    expected: { pH: 6.8, organicCarbon: 0.52 }
  },
  {
    input: "Soil Metrics: N 230 | P 45 | K 310 | pH 7.1",
    expected: { soilN: 230, soilP: 45, soilK: 310, pH: 7.1 }
  }
];

function runTests() {
  console.log("🧪 Starting Soil Extraction Tests...\n");
  let passed = 0;

  testCases.forEach((tc, i) => {
    const results = {};
    Object.keys(patterns).forEach(key => {
      const match = tc.input.match(patterns[key]);
      if (match && match[1]) {
        results[key] = parseFloat(match[1]);
      }
    });

    const isMatch = Object.keys(tc.expected).every(key => results[key] === tc.expected[key]);
    
    if (isMatch) {
      console.log(`✅ Test ${i + 1} passed!`);
      passed++;
    } else {
      console.log(`❌ Test ${i + 1} FAILED!`);
      console.log(`   Input: "${tc.input}"`);
      console.log(`   Expected:`, tc.expected);
      console.log(`   Actual:  `, results);
    }
  });

  console.log(`\n📊 Result: ${passed}/${testCases.length} tests passed.`);
}

runTests();

const patterns = {
  soilN: /(?:Nitrogen|Available\s*N|Total\s*N)\s*(?:\([^)]*\))?\s*[:\s=|]+\s*([\d.]+)/i,
  soilP: /(?:Phosphorus|Phosphate|P2O5|Available\s*P)\s*(?:\([^)]*\))?\s*[:\s=|]+\s*([\d.]+)/i,
  soilK: /(?:Potassium|Potash|K2O|Available\s*K)\s*(?:\([^)]*\))?\s*[:\s=|]+\s*([\d.]+)/i,
  pH: /(?:Soil\s*pH|pH\s*Value|pH)\s*[:\s=|]+\s*([\d.]+)/i,
  organicCarbon: /(?:Organic\s*Carbon|OC)\s*(?:\([^)]*\))?\s*[:\s=|]+\s*([\d.]+)/i
};

const text = `
SOIL HEALTH CARD - KVK LAB REPORT
Sample ID: SHC-2024-001
Farmer: Test Farmer | Village: Test Village
Parameter | Value | Unit
Nitrogen (N) | 245 | mg/kg
Phosphorus (P) | 38 | mg/kg
Potassium (K) | 312 | mg/kg
pH Value | 6.8 | -
Organic Carbon (OC) | 0.72 | %
`;

const results = {};
Object.keys(patterns).forEach(key => {
  const match = text.match(patterns[key]);
  if (match && match[1]) {
    results[key] = parseFloat(match[1]);
  }
});

console.log('Original Regex with | added:', results);

// Current Regex test (without |)
const oldPatterns = {
  soilN: /(?:Nitrogen|Available\s*N|Total\s*N)\s*(?:\([^)]*\))?\s*[:\s=]+\s*([\d.]+)/i,
  soilP: /(?:Phosphorus|Phosphate|P2O5|Available\s*P)\s*(?:\([^)]*\))?\s*[:\s=]+\s*([\d.]+)/i,
  soilK: /(?:Potassium|Potash|K2O|Available\s*K)\s*(?:\([^)]*\))?\s*[:\s=]+\s*([\d.]+)/i,
  pH: /(?:Soil\s*pH|pH\s*Value|pH)\s*[:\s=]+\s*([\d.]+)/i,
  organicCarbon: /(?:Organic\s*Carbon|OC)\s*(?:\([^)]*\))?\s*[:\s=]+\s*([\d.]+)/i
};

const oldResults = {};
Object.keys(oldPatterns).forEach(key => {
  const match = text.match(oldPatterns[key]);
  if (match && match[1]) {
    oldResults[key] = parseFloat(match[1]);
  }
});

console.log('Current Regex (without |):', oldResults);

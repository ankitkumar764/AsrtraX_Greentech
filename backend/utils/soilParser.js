/**
 * Extracts soil parameters from raw text using robust regex patterns.
 * 
 * Strategy:
 * 1. Try specific label + value patterns (most accurate)
 * 2. Try multiline table format: Label on one line, value on next
 * 3. Avoid generic single-letter patterns (\bN\b etc.) to prevent false positives
 * 
 * @param {string} text - The raw text from OCR or PDF
 * @returns {object} Extracted parameters
 */
const extractSoilMetrics = (text) => {
  if (!text) return { nitrogen: null, phosphorus: null, potassium: null, ph: null, organicCarbon: null };

  // Normalize: collapse multiple spaces, keep newlines
  const normalizedText = text.replace(/[ \t]+/g, ' ').replace(/\r\n/g, '\n');

  const results = {
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    ph: null,
    organicCarbon: null
  };

  // ──────────────────────────────────────────────
  // STRATEGY 1: Pattern on SAME LINE as label
  // Handles: "Nitrogen (N) | 245 | mg/kg" and "Nitrogen: 245"
  // ──────────────────────────────────────────────
  const inlinePatterns = {
    nitrogen: [
      /\bNitrogen\b(?:\s*\(N\))?[^0-9\n]{0,20}?([\d.]+)/i,
      /\bAvailable\s*N\b[^0-9\n]{0,15}?([\d.]+)/i,
      /\bTotal\s*N\b[^0-9\n]{0,15}?([\d.]+)/i,
    ],
    phosphorus: [
      /\bPhosphorus\b(?:\s*\(P\))?[^0-9\n]{0,20}?([\d.]+)/i,
      /\bP\s*2\s*O\s*5\b[^0-9\n]{0,15}?([\d.]+)/i,
      /\bPhosphate\b[^0-9\n]{0,15}?([\d.]+)/i,
      /\bAvailable\s*P\b[^0-9\n]{0,15}?([\d.]+)/i,
    ],
    potassium: [
      /\bPotassium\b(?:\s*\(K\))?[^0-9\n]{0,20}?([\d.]+)/i,
      /\bK\s*2\s*O\b[^0-9\n]{0,15}?([\d.]+)/i,
      /\bPotash\b[^0-9\n]{0,15}?([\d.]+)/i,
      /\bAvailable\s*K\b[^0-9\n]{0,15}?([\d.]+)/i,
    ],
    ph: [
      /\bpH\s*Value\b[^0-9\n]{0,15}?([\d.]+)/i,
      /\bSoil\s*pH\b[^0-9\n]{0,15}?([\d.]+)/i,
      /\bpH\b[^0-9\n]{0,10}?([\d.]+)/,   // Use exact case for pH to avoid "pHosphorus" collisions
    ],
    organicCarbon: [
      /\bOrganic\s*Carbon\b(?:\s*\(OC\))?[^0-9\n]{0,20}?([\d.]+)/i,
      /\bOrganic\s*Matter\b[^0-9\n]{0,15}?([\d.]+)/i,
      /\b(?:OC|O\.C\.)\b[^0-9\n]{0,15}?([\d.]+)/i,
    ],
  };

  Object.keys(inlinePatterns).forEach(key => {
    for (const pattern of inlinePatterns[key]) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        const val = parseFloat(match[1]);
        if (!isNaN(val)) {
          results[key] = val;
          break; // stop trying patterns once we found one
        }
      }
    }
  });

  // ──────────────────────────────────────────────
  // STRATEGY 2: Multiline table format
  // e.g.:
  //   Nitrogen (N)
  //   245
  //   mg/kg
  // ──────────────────────────────────────────────
  const multilinePatterns = {
    nitrogen:      /\bNitrogen\b.*?\n\s*([\d.]+)/i,
    phosphorus:    /\bPhosphorus\b.*?\n\s*([\d.]+)/i,
    potassium:     /\bPotassium\b.*?\n\s*([\d.]+)/i,
    ph:            /\bpH\b.*?\n\s*([\d.]+)/,
    organicCarbon: /\bOrganic\s*Carbon\b.*?\n\s*([\d.]+)/i,
  };

  Object.keys(multilinePatterns).forEach(key => {
    if (results[key] !== null) return; // already found in strategy 1

    const match = normalizedText.match(multilinePatterns[key]);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      if (!isNaN(val)) {
        results[key] = val;
      }
    }
  });

  console.log('🧪 [SOIL PARSER] Extraction results:', results);
  return results;
};

module.exports = {
  extractSoilMetrics
};

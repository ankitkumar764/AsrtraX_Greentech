/**
 * Universal Soil Report Parser
 * Handles messy text from both OCR (images) and PDF extraction.
 * 
 * @param {string} text - The raw text from the report
 * @returns {object} Structured soil data
 */
export const extractSoilData = (text) => {
  // Enhanced patterns to handle messy formatting, units, and symbols
  // IMPORTANT: We use [ \t]* instead of \s* to prevent jumping across multiple lines!
  const patterns = {
    // Nitrogen: matches 'Nitrogen (N): 245', 'N: 120', 'Available N | 245'
    soilN: /(?:Nitrogen|Available\s*N|Total\s*N|\bN\b)\s*(?:\([^)]*\))?[ \t]*[:\s=|]+[ \t]*([\d.]+)/i,
    
    // Phosphorus: matches 'Phosphorus (P): 38', 'P2O5: 30', 'Available P 38', 'P: 38'
    soilP: /(?:Phosphorus|Phosphate|P\s*2\s*O\s*5|Available\s*P|\bP\b)\s*(?:\([^)]*\))?[ \t]*[:\s=|]+[ \t]*([\d.]+)/i,
    
    // Potassium: matches 'Potassium (K): 312', 'K2O: 200', 'Available K 312', 'K: 312'
    soilK: /(?:Potassium|Potash|K\s*2\s*O|Available\s*K|\bK\b)\s*(?:\([^)]*\))?[ \t]*[:\s=|]+[ \t]*([\d.]+)/i,
    
    // pH: matches 'pH Value: 6.8', 'Soil pH: 6.8', 'pH: 6.8'
    pH: /(?:Soil\s*pH|pH\s*Value|\bpH\b)[ \t]*[:\s=|]+[ \t]*([\d.]+)/i,
    
    // Organic Carbon: matches 'Organic Carbon (OC): 0.72', 'OC: 0.72'
    organicCarbon: /(?:Organic\s*Carbon|\bOC\b)\s*(?:\([^)]*\))?[ \t]*[:\s=|]+[ \t]*([\d.]+)/i
  };

  const results = {
    soilN: null,
    soilP: null,
    soilK: null,
    pH: null,
    organicCarbon: null
  };

  // Process each indicator
  Object.keys(patterns).forEach(key => {
    const match = text.match(patterns[key]);
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      // Sanity check: ignore unrealistic values (e.g. pH > 14 or N < 0)
      if (key === 'pH' && (value < 0 || value > 14)) return;
      results[key] = value;
    }
  });

  return results;
};

// Also export a mapping for frontend form fields if they differ
export const mapToFormData = (extractedData, currentFormData) => {
  return {
    ...currentFormData,
    soilN: extractedData.nitrogen !== undefined && extractedData.nitrogen !== null ? extractedData.nitrogen : 
           (extractedData.soilN !== undefined && extractedData.soilN !== null ? extractedData.soilN : currentFormData.soilN),
    soilP: extractedData.phosphorus !== undefined && extractedData.phosphorus !== null ? extractedData.phosphorus : 
           (extractedData.soilP !== undefined && extractedData.soilP !== null ? extractedData.soilP : currentFormData.soilP),
    soilK: extractedData.potassium !== undefined && extractedData.potassium !== null ? extractedData.potassium : 
           (extractedData.soilK !== undefined && extractedData.soilK !== null ? extractedData.soilK : currentFormData.soilK),
    pH: extractedData.ph !== undefined && extractedData.ph !== null ? extractedData.ph : 
        (extractedData.pH !== undefined && extractedData.pH !== null ? extractedData.pH : currentFormData.pH),
    organicCarbon: extractedData.organicCarbon !== undefined && extractedData.organicCarbon !== null ? extractedData.organicCarbon : 
                   currentFormData.organicCarbon
  };
};

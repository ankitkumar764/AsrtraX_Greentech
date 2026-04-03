const pdf = require('pdf-parse');
const grokService = require('../services/grokService');

/**
 * Extracts soil parameters from raw PDF text using regex
 * @param {string} text - The raw text extracted from PDF
 * @returns {object} Extracted parameters
 */
const extractParameters = (text) => {
  // Enhanced patterns to handle messy formatting, units, and symbols
  // IMPORTANT: We use [ \t]* instead of \s* to prevent jumping across multiple lines!
  const patterns = {
    soilN: /(?:Nitrogen|Available\s*N|Total\s*N|\bN\b)\s*(?:\([^)]*\))?[ \t]*[:\s=|]+[ \t]*([\d.]+)/i,
    soilP: /(?:Phosphorus|Phosphate|P\s*2\s*O\s*5|Available\s*P|\bP\b)\s*(?:\([^)]*\))?[ \t]*[:\s=|]+[ \t]*([\d.]+)/i,
    soilK: /(?:Potassium|Potash|K\s*2\s*O|Available\s*K|\bK\b)\s*(?:\([^)]*\))?[ \t]*[:\s=|]+[ \t]*([\d.]+)/i,
    pH: /(?:Soil\s*pH|pH\s*Value|\bpH\b)[ \t]*[:\s=|]+[ \t]*([\d.]+)/i,
    organicCarbon: /(?:Organic\s*Carbon|\bOC)\s*(?:\([^)]*\))?[ \t]*[:\s=|]+[ \t]*([\d.]+)/i
  };

  const results = {};
  
  Object.keys(patterns).forEach(key => {
    const match = text.match(patterns[key]);
    if (match && match[1]) {
      results[key] = parseFloat(match[1]);
    }
  });

  return results;
};

/**
 * AI-powered fallback for extracting soil data from messy text
 * @param {string} text - The raw text from the report
 * @returns {object|null} Structured data or null if AI fails
 */
const extractWithAI = async (text) => {
  try {
    const systemPrompt = `You are a specialized Soil Science Data Extraction AI. 
Extract soil metrics from the provided text which is a result of OCR or PDF extraction.

CRITICAL RULES:
1. IDENTIFY TABLES: The text often represents a table. Look for "Parameter" followed by "Value".
2. SAME-LINE MATCHING: A value for Nitrogen (N) is typically on the SAME LINE or the absolute next line as the word "Nitrogen".
3. DO NOT SWAP: Do not give the Phosphorus (P) value to Nitrogen (N).
4. UNITS: Ignore values like "100%", "mg/kg", or "ppm" if they are column headers. Only extract the ACTUAL test result number.
5. KEYS: Return ONLY a JSON object with these keys: "soilN", "soilP", "soilK", "pH", "organicCarbon".
6. NULLS: Use null for missing values.

Example match: "Nitrogen (N) | 245 | mg/kg" -> soilN: 245
Example match: "Phosphorus (P) | 38 | mg/kg" -> soilP: 38`;

    const userMessage = [{ role: 'user', content: `Extract soil data from this raw text:\n\n${text}` }];
    
    console.log('🤖 AI Deep Scan: Attempting to resolve table structure...');
    const aiResponse = await grokService.generateResponse(systemPrompt, userMessage);
    
    const jsonString = aiResponse.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('⚠️ AI Extraction Failed:', error.message);
    return null;
  }
};

/**
 * Parses a PDF buffer and returns extracted soil data
 * @param {Buffer} dataBuffer - The PDF file buffer
 */
const parseSoilPDF = async (dataBuffer) => {
  let rawText = '';
  try {
    // Attempt standard PDF parse
    const data = await pdf(dataBuffer, { max: 1 });
    rawText = data.text;
  } catch (error) {
    console.warn('⚠️ Standard PDF Parse failed, attempting raw buffer recovery:', error.message);
    // Last resort: Just try to get anything that looks like text from the buffer
    rawText = dataBuffer.toString('utf8').replace(/[^\x20-\x7E\n\t]/g, ' ');
  }

  try {
    // Check for empty or near-empty text
    if (!rawText || rawText.trim().length < 5) {
      return {
        success: false,
        errorType: 'SCANNED_PDF',
        message: 'This document appears to be an image. Please use the Image Scanner instead.'
      };
    }

    // Phase 1: Regex Extraction
    let extractedData = extractParameters(rawText);
    let usedAI = false;

    // Phase 2: AI Fallback if critical metrics are missing or inconsistent
    const foundKeys = Object.keys(extractedData).filter(k => extractedData[k] !== null);
    const criticalKeys = ['soilN', 'soilP', 'soilK', 'pH'];
    const missingCritical = criticalKeys.some(key => !foundKeys.includes(key));

    if (missingCritical && process.env.GROK_API_KEY) {
      const aiData = await extractWithAI(rawText);
      if (aiData) {
        // Merge AI data, prioritizing AI for missing or potentially misread fields
        extractedData = { ...extractedData, ...aiData };
        usedAI = true;
      }
    }
    
    return {
      success: true,
      data: extractedData,
      usedAI,
      textPreview: rawText.substring(0, 150) + '...'
    };
  } catch (error) {
    console.error('❌ PDF Comprehensive failure:', error.message);
    return {
      success: false,
      errorType: 'INVALID_FORMAT',
      message: 'Failed to read PDF content.'
    };
  }
};

module.exports = {
  parseSoilPDF,
  extractWithAI
};

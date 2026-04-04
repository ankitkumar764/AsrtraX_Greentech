const diseaseData = require('../data/diseaseData.json');

/**
 * Predicts possible crop diseases based on input symptoms.
 * Uses a keyword-based scoring system for partial and exact matching.
 */
exports.predictDisease = async (req, res) => {
  try {
    const { symptoms, userText, crop } = req.body;
    
    if (!symptoms && !userText) {
      return res.status(400).json({ error: 'Please provide some symptoms or description.' });
    }

    // Prepare inputs: combine selected symptoms and user text
    const inputTerms = [];
    if (Array.isArray(symptoms)) inputTerms.push(...symptoms);
    if (userText) inputTerms.push(...userText.toLowerCase().split(/\s+/));
    
    const results = diseaseData.map(item => {
      let score = 0;
      const matchedSymptoms = [];

      // 1. Check for symptom matches
      item.symptoms.forEach(dbSymptom => {
        inputTerms.forEach(term => {
          const normalizedTerm = term.toLowerCase().trim();
          const normalizedDbSymptom = dbSymptom.toLowerCase().trim();

          // Exact Match
          if (normalizedTerm === normalizedDbSymptom) {
            score += 10;
            matchedSymptoms.push(dbSymptom);
          } 
          // Partial Match (e.g. "yellow" in "yellow leaves")
          else if (normalizedDbSymptom.includes(normalizedTerm) || normalizedTerm.includes(normalizedDbSymptom)) {
            score += 5;
            matchedSymptoms.push(dbSymptom);
          }
        });
      });

      // 2. Check for crop match (Bonus score)
      if (crop && item.crop.toLowerCase() === crop.toLowerCase()) {
        score += 3;
      } else if (item.crop === 'general') {
        score += 1; // General diseases apply to all
      }

      return {
        ...item,
        score,
        matchedSymptoms: [...new Set(matchedSymptoms)] // Unique matches only
      };
    });

    // 3. Filter and Rank
    const bestMatches = results
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3 results

    if (bestMatches.length === 0) {
      return res.json({
        success: false,
        message: 'No matching disease found. If symptoms are severe, please consult a local agriculture officer.',
        results: []
      });
    }

    res.json({
      success: true,
      results: bestMatches.map(({ score, ...rest }) => rest)
    });

  } catch (error) {
    console.error('Disease Prediction Error:', error);
    res.status(500).json({ error: 'Failed to process disease detection.' });
  }
};

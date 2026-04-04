import React, { useState } from 'react';
import axios from 'axios';
import '../styles/DiseaseDetector.css';

const DiseaseDetector = ({ t, language }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [userText, setUserText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const symptomsList = [
    { id: 'symptomYellowing', label: t.symptomYellowing },
    { id: 'symptomSpots', label: t.symptomSpots },
    { id: 'symptomPowder', label: t.symptomPowder },
    { id: 'symptomWilting', label: t.symptomWilting },
    { id: 'symptomStunted', label: t.symptomStunted },
    { id: 'symptomCurling', label: t.symptomCurling }
  ];

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0 && !userText.trim()) {
      setError(t.describeSymptoms);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Map IDs to English labels for backend matching (fallback database is English)
      const symptomsToMatch = selectedSymptoms.map(id => {
        const item = symptomsList.find(s => s.id === id);
        // We use the English label from the translation file if possible
        // For simplicity in this demo, we'll send the raw IDs which the controller can handle
        // or we map them to the values in our diseaseData.json
        switch(id) {
          case 'symptomYellowing': return 'yellow leaves';
          case 'symptomSpots': return 'brown spots';
          case 'symptomPowder': return 'white powder';
          case 'symptomWilting': return 'wilting';
          case 'symptomStunted': return 'stunted growth';
          case 'symptomCurling': return 'leaf curling';
          default: return id;
        }
      });

      const response = await axios.post('http://localhost:5000/api/disease/predict', {
        symptoms: symptomsToMatch,
        userText: userText
      });

      if (response.data.success) {
        setResults(response.data.results);
      } else {
        setResults([]);
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError(t.error + ': ' + t.tryAgain);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disease-detector-container">
      <div className="disease-hero">
        <div className="container">
          <div className="disease-hero-content">
            <h2>{t.diseaseDetectorTitle}</h2>
            <p>{t.diseaseDetectorDesc}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="disease-grid">
          {/* Input Section */}
          <div className="symptom-card-premium">
            <div className="symptom-section">
              <h3><span>📋</span> {t.selectSymptoms}</h3>
              <div className="symptom-selector">
                {symptomsList.map(symptom => (
                  <button
                    key={symptom.id}
                    className={`symptom-btn ${selectedSymptoms.includes(symptom.id) ? 'active' : ''}`}
                    onClick={() => toggleSymptom(symptom.id)}
                  >
                    {symptom.label}
                  </button>
                ))}
              </div>

              <h3><span>⌨️</span> {t.describeSymptoms}</h3>
              <textarea
                className="custom-text-area"
                placeholder={t.cropIssuesPlaceholder}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
              ></textarea>

              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? t.loading : t.predictDisease}
              </button>
              
              {error && (
                <p style={{ color: '#ef4444', marginTop: '15px', textAlign: 'center', fontWeight: '600' }}>
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="disease-result-container">
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="disease-result-card" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="result-header">
                    <h4>{result.disease}</h4>
                    <span className="disease-tag">{result.crop}</span>
                  </div>
                  
                  <div className="result-content">
                    <div className="result-info-box">
                      <h5><span>🔍</span> {t.matchingSymptoms}</h5>
                      <div className="matched-symptoms">
                        {result.matchedSymptoms.map((sm, i) => (
                          <span key={i} className="symptom-tag">{sm}</span>
                        ))}
                      </div>
                      <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{result.reason}</p>
                    </div>

                    <div className="result-info-box" style={{ borderLeft: '4px solid #10b981' }}>
                      <h5><span>✅</span> {t.solution}</h5>
                      <p>{result.solution}</p>
                    </div>

                    <div className="result-info-box" style={{ borderLeft: '4px solid #3b82f6' }}>
                      <h5><span>🛡️</span> {t.preventionTips}</h5>
                      <p>{result.prevention}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-premium">
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌾</div>
                <p>{t.demoLogicDesc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetector;

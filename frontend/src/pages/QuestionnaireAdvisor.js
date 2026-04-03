import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Forms.css';

function QuestionnaireAdvisor() {
  const [formData, setFormData] = useState({
    soilType: '',
    soilTexture: '',
    previousCrop: '',
    fertilizationHistory: '',
    waterAvailability: '',
    season: '',
    location: '',
    budget: '',
    cropIssues: ''
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Add default values for expected fields
      const payload = {
        ...formData,
        soilN: 200,
        soilP: 20,
        soilK: 150,
        pH: 6.8
      };
      
      const response = await api.post('/recommendations/get', payload);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisor-page">
      <div className="container">
        <div className="page-header">
          <h1>❓ Questionnaire Advisor</h1>
          <p>Answer simple questions to get crop and fertilizer recommendations</p>
        </div>

        <div className="advisor-grid">
          <div className="form-section">
            <form onSubmit={handleSubmit} className="advisor-form">
              <div className="form-group">
                <label>Soil Type *</label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select soil type</option>
                  <option value="sandy">Sandy</option>
                  <option value="clay">Clay</option>
                  <option value="loamy">Loamy</option>
                  <option value="black">Black Soil</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div className="form-group">
                <label>Soil Texture *</label>
                <select
                  name="soilTexture"
                  value={formData.soilTexture}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select texture</option>
                  <option value="dry">Dry</option>
                  <option value="sticky">Sticky/Wet</option>
                  <option value="medium">Medium/Balanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Previous Crop</label>
                <select
                  name="previousCrop"
                  value={formData.previousCrop}
                  onChange={handleChange}
                >
                  <option value="">Select previous crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="maize">Maize</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="pulses">Pulses</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fallow">Fallow/Unused</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fertilizer Usage History *</label>
                <select
                  name="fertilizationHistory"
                  value={formData.fertilizationHistory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select usage level</option>
                  <option value="low">Low (Minimal use)</option>
                  <option value="moderate">Moderate (Regular use)</option>
                  <option value="excessive">Excessive (Overused)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Water Availability *</label>
                <select
                  name="waterAvailability"
                  value={formData.waterAvailability}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select availability</option>
                  <option value="low">Low (Rain-fed)</option>
                  <option value="moderate">Moderate (Seasonal irrigation)</option>
                  <option value="high">High (Permanent irrigation)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Season *</label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select season</option>
                  <option value="kharif">Kharif (Monsoon)</option>
                  <option value="rabi">Rabi (Winter)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location/State</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="">Select state</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="uttar_pradesh">Uttar Pradesh</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="punjab">Punjab</option>
                  <option value="haryana">Haryana</option>
                </select>
              </div>

              <div className="form-group">
                <label>Budget (₹)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Any Crop Issues?</label>
                <textarea
                  name="cropIssues"
                  value={formData.cropIssues}
                  onChange={handleChange}
                  placeholder="e.g., Yellow leaves, pest damage, low yield"
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            </form>
          </div>

          <div className="results-section">
            {error && (
              <div className="alert alert-error">
                <strong>Error:</strong> {error}
              </div>
            )}

            {results && results.success && results.recommendations && (
              <div className="results">
                <h2>🎯 Crop Recommendations</h2>

                {results.recommendations.map((rec, idx) => (
                  <div key={idx} className="recommendation-card">
                    <div className="recommendation-header">
                      <h3>#{rec.rank} - {rec.cropName}</h3>
                      <span className="match-score">Match: {rec.matchScore.toFixed(0)}%</span>
                    </div>

                    <div className="recommendation-content">
                      <div className="section">
                        <h4>Why this crop?</h4>
                        <ul>
                          {rec.reasoning.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="section">
                        <h4>Estimated Yield</h4>
                        <p>{rec.estimatedYield.min} - {rec.estimatedYield.max} tons/hectare</p>
                      </div>

                      <div className="section">
                        <h4>💊 Fertilizer Requirements</h4>
                        <div className="npk-summary">
                          <p><strong>Nitrogen:</strong> {rec.npkRequirements.nitrogen.deficit} kg/ha needed</p>
                          <p><strong>Phosphorus:</strong> {rec.npkRequirements.phosphorus.deficit} kg/ha needed</p>
                          <p><strong>Potassium:</strong> {rec.npkRequirements.potassium.deficit} kg/ha needed</p>
                        </div>

                        <h5>Recommended Fertilizers:</h5>
                        {rec.fertilizerPlan.recommendations.map((fert, i) => (
                          <div key={i} className="fertilizer-summary">
                            <p><strong>{fert.name}</strong></p>
                            <p>Quantity: {fert.bags} bags | Timing: {fert.timing}</p>
                            <p>Cost: ₹{fert.cost.toFixed(0)}</p>
                          </div>
                        ))}

                        <div className="total-cost">
                          <strong>Total Fertilizer Cost: ₹{rec.fertilizerPlan.totalCost.toFixed(0)} / hectare</strong>
                        </div>
                      </div>

                      <div className="section">
                        <h4>💰 Cost Optimization Tips</h4>
                        <ul>
                          {rec.costOptimization.slice(0, 3).map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="general-advice">
                  <h3>📌 General Advice</h3>
                  {results.generalAdvice.map((advice, idx) => (
                    <p key={idx}>{advice}</p>
                  ))}
                </div>
              </div>
            )}

            {!results && !error && (
              <div className="placeholder">
                <p>Answer the questions to receive personalized crop and fertilizer recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnaireAdvisor;

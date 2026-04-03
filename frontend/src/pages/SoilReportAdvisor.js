import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Forms.css';

function SoilReportAdvisor() {
  const [formData, setFormData] = useState({
    soilN: '',
    soilP: '',
    soilK: '',
    pH: '',
    crop: '',
    budget: ''
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
      const response = await api.post('/recommendations/soil-report', formData);
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
          <h1>📊 Soil Report Advisor</h1>
          <p>Enter your soil test parameters for precise fertilizer recommendations</p>
        </div>

        <div className="advisor-grid">
          <div className="form-section">
            <form onSubmit={handleSubmit} className="advisor-form">
              <div className="form-group">
                <label>Soil Nitrogen (N) - mg/kg</label>
                <input
                  type="number"
                  name="soilN"
                  value={formData.soilN}
                  onChange={handleChange}
                  placeholder="e.g., 200"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Soil Phosphorus (P) - mg/kg</label>
                <input
                  type="number"
                  name="soilP"
                  value={formData.soilP}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Soil Potassium (K) - mg/kg</label>
                <input
                  type="number"
                  name="soilK"
                  value={formData.soilK}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Soil pH</label>
                <input
                  type="number"
                  name="pH"
                  value={formData.pH}
                  onChange={handleChange}
                  placeholder="e.g., 6.8"
                  required
                  min="4"
                  max="10"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>Crop Name *</label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="maize">Maize</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="pulses">Pulses</option>
                  <option value="vegetables">Vegetables</option>
                </select>
              </div>

              <div className="form-group">
                <label>Budget (₹) - Optional</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  min="0"
                />
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

            {results && (
              <div className="results">
                <h2>📋 Recommendations for {results.crop}</h2>

                <div className="soil-analysis">
                  <h3>Current Soil Status</h3>
                  <div className="info-grid">
                    <div className="info-box">
                      <span className="label">Nitrogen (N)</span>
                      <span className="value">{results.soilAnalysis.nitrogen} mg/kg</span>
                    </div>
                    <div className="info-box">
                      <span className="label">Phosphorus (P)</span>
                      <span className="value">{results.soilAnalysis.phosphorus} mg/kg</span>
                    </div>
                    <div className="info-box">
                      <span className="label">Potassium (K)</span>
                      <span className="value">{results.soilAnalysis.potassium} mg/kg</span>
                    </div>
                    <div className="info-box">
                      <span className="label">Soil pH</span>
                      <span className="value">{results.soilAnalysis.pH}</span>
                    </div>
                  </div>
                </div>

                <div className="npk-requirements">
                  <h3>NPK Requirements</h3>
                  <div className="npk-grid">
                    <div className="npk-item">
                      <h4>Nitrogen</h4>
                      <p className="required">Required: {results.npkRequirements.nitrogen.required} kg/ha</p>
                      <p className="deficit">Deficit: {results.npkRequirements.nitrogen.deficit} kg/ha</p>
                    </div>
                    <div className="npk-item">
                      <h4>Phosphorus</h4>
                      <p className="required">Required: {results.npkRequirements.phosphorus.required} kg/ha</p>
                      <p className="deficit">Deficit: {results.npkRequirements.phosphorus.deficit} kg/ha</p>
                    </div>
                    <div className="npk-item">
                      <h4>Potassium</h4>
                      <p className="required">Required: {results.npkRequirements.potassium.required} kg/ha</p>
                      <p className="deficit">Deficit: {results.npkRequirements.potassium.deficit} kg/ha</p>
                    </div>
                  </div>
                </div>

                <div className="fertilizer-plan">
                  <h3>💊 Recommended Fertilizer Schedule</h3>
                  <div className="cost-summary">
                    <span>Total Cost: <strong>₹{results.fertilizerPlan.totalCost.toFixed(0)}</strong> / hectare</span>
                  </div>
                  {results.fertilizerPlan.recommendations.map((rec, idx) => (
                    <div key={idx} className="fertilizer-item">
                      <h4>{rec.name}</h4>
                      <p className="bags">📦 Quantity: {rec.bags} bags (50kg each)</p>
                      <p className="timing">⏰ Timing: {rec.timing}</p>
                      <p className="reason">💡 {rec.reason}</p>
                      <p className="cost">💰 Cost: ₹{rec.cost.toFixed(0)}</p>
                    </div>
                  ))}

                  <div className="notes">
                    <h4>Important Notes:</h4>
                    {results.fertilizerPlan.notes.map((note, idx) => (
                      <p key={idx}>{note}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!results && !error && (
              <div className="placeholder">
                <p>Enter your soil test results to get personalized fertilizer recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoilReportAdvisor;

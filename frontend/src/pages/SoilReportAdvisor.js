import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/Forms.css';

function SoilReportAdvisor() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [formData, setFormData] = useState({
    soilN: '',
    soilP: '',
    soilK: '',
    pH: '',
    crop: '',
    budget: '',
    landArea: '1'
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
      setError(err.response?.data?.error || t.tryAgain);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisor-page">
      <div className="container">
        <div className="page-header">
          <h1>{t.soilReportTitle}</h1>
          <p>{t.soilReportDesc}</p>
        </div>

        <div className="advisor-grid">
          <div className="form-section">
            <form onSubmit={handleSubmit} className="advisor-form">
              <div className="form-group">
                <label>{t.soilNitrogen}</label>
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
                <label>{t.soilPhosphorus}</label>
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
                <label>{t.soilPotassium}</label>
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
                <label>{t.soilPH}</label>
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
                <label>{t.cropCurrent} *</label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a crop</option>
                  <option value="wheat">{t.wheat}</option>
                  <option value="rice">{t.rice}</option>
                  <option value="maize">{t.maize}</option>
                  <option value="cotton">{t.cotton}</option>
                  <option value="sugarcane">{t.sugarcane}</option>
                  <option value="pulses">{t.pulses}</option>
                  <option value="vegetables">{t.vegetables}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.budget} - {t.optional}</label>
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
                <label>{language === 'en' ? 'Land Area (Hectares) *' : 'भूमि क्षेत्र (हेक्टेयर) *'}</label>
                <input
                  type="number"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleChange}
                  required
                  min="0.1"
                  step="0.1"
                  placeholder="e.g., 2.5"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? t.loading : t.getRecommendations}
              </button>
            </form>
          </div>

          <div className="results-section">
            {error && (
              <div className="alert alert-error">
                <strong>{t.error}:</strong> {error}
              </div>
            )}

            {results && (
              <div className="results">
                <h2>📋 {t.recommendationsFor} {results.crop}</h2>

                {/* Financial Comparison Chart */}
                {results.financials && (
                  <div className="chart-container card-panel">
                    <h3>{language === 'en' ? 'Projected Financial Analysis' : 'प्रक्षेपित वित्तीय विश्लेषण'}</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart
                          data={[{
                            name: results.crop.charAt(0).toUpperCase() + results.crop.slice(1),
                            Investment: results.financials.investment,
                            Profit: results.financials.profit
                          }]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(val) => `₹${(val / 1000)}k`} />
                          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                          <Legend />
                          <Bar dataKey="Investment" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="soil-analysis">
                  <h3>{t.currentSoilStatus}</h3>
                  <div className="info-grid">
                    <div className="info-box">
                      <span className="label">{t.nitrogenNLabel}</span>
                      <span className="value">{results.soilAnalysis.nitrogen} mg/kg</span>
                    </div>
                    <div className="info-box">
                      <span className="label">{t.phosphorusLabel}</span>
                      <span className="value">{results.soilAnalysis.phosphorus} mg/kg</span>
                    </div>
                    <div className="info-box">
                      <span className="label">{t.potassiumLabel}</span>
                      <span className="value">{results.soilAnalysis.potassium} mg/kg</span>
                    </div>
                    <div className="info-box">
                      <span className="label">pH</span>
                      <span className="value">{results.soilAnalysis.pH}</span>
                    </div>
                  </div>
                </div>

                <div className="npk-requirements">
                  <h3>{t.npkRequirement}</h3>
                  <div className="npk-grid">
                    <div className="npk-item">
                      <h4>{t.nitrogen}</h4>
                      <p className="required">{t.requiredNPK}: {results.npkRequirements.nitrogen.required} kg/ha</p>
                      <p className="deficit">{t.deficitNPK}: {results.npkRequirements.nitrogen.deficit} kg/ha</p>
                    </div>
                    <div className="npk-item">
                      <h4>{t.phosphorus}</h4>
                      <p className="required">{t.requiredNPK}: {results.npkRequirements.phosphorus.required} kg/ha</p>
                      <p className="deficit">{t.deficitNPK}: {results.npkRequirements.phosphorus.deficit} kg/ha</p>
                    </div>
                    <div className="npk-item">
                      <h4>{t.potassium}</h4>
                      <p className="required">{t.requiredNPK}: {results.npkRequirements.potassium.required} kg/ha</p>
                      <p className="deficit">{t.deficitNPK}: {results.npkRequirements.potassium.deficit} kg/ha</p>
                    </div>
                  </div>
                </div>

                <div className="fertilizer-plan">
                  <h3>💊 {t.fertilizers}</h3>
                  <div className="cost-summary">
                    <span>{t.totalCostLabel}: <strong>₹{results.fertilizerPlan.totalCost.toFixed(0)}</strong> / hectare</span>
                  </div>
                  {results.fertilizerPlan.recommendations.map((rec, idx) => (
                    <div key={idx} className="fertilizer-item">
                      <h4>{rec.name}</h4>
                      <p className="bags">📦 {t.quantityLabel}: {rec.bags} bags (50kg each)</p>
                      <p className="timing">⏰ {t.timingLabel}: {rec.timing}</p>
                      <p className="reason">💡 {rec.reason}</p>
                      <p className="cost">💰 {t.costLabel}: ₹{rec.cost.toFixed(0)}</p>
                    </div>
                  ))}

                  <div className="notes">
                    <h4>{t.importantNotesLabel}</h4>
                    {results.fertilizerPlan.notes.map((note, idx) => (
                      <p key={idx}>{note}</p>
                    ))}
                  </div>
                </div>

                <p className="note-text">{t.note}</p>
              </div>
            )}

            {!results && !error && (
              <div className="placeholder">
                <p>{t.enterSoilTestResults}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoilReportAdvisor;

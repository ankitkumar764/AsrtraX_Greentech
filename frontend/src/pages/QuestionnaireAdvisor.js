import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/Forms.css';

function QuestionnaireAdvisor() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [formData, setFormData] = useState({
    soilType: '',
    soilTexture: '',
    previousCrop: '',
    fertilizationHistory: '',
    waterAvailability: '',
    season: '',
    location: '',
    budget: '',
    landArea: '1',
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
        soilN: 50,
        soilP: 10,
        soilK: 30,
        pH: 6.5
      };
      
      const response = await api.post('/recommendations/get', payload);
      // The backend returns { success: true, data: { recommendations: [...] }, ... }
      // So we need to set results to response.data.data
      setResults(response.data.data || response.data);
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
          <h1>{t.questionnaireTitle}</h1>
          <p>{t.questionnaireDesc}</p>
        </div>

        <div className="advisor-grid">
          <div className="form-section">
            <form onSubmit={handleSubmit} className="advisor-form">
              <div className="form-group">
                <label>{t.soilType} *</label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select soil type</option>
                  <option value="sandy">{t.sandy}</option>
                  <option value="clay">{t.clay}</option>
                  <option value="loamy">{t.loamy}</option>
                  <option value="black">{t.blackSoil}</option>
                  <option value="unknown">{t.unknown}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.soilTexture} *</label>
                <select
                  name="soilTexture"
                  value={formData.soilTexture}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select texture</option>
                  <option value="dry">{t.dry}</option>
                  <option value="sticky">{t.sticky}</option>
                  <option value="medium">{t.medium}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.previousCrop}</label>
                <select
                  name="previousCrop"
                  value={formData.previousCrop}
                  onChange={handleChange}
                >
                  <option value="">Select previous crop</option>
                  <option value="wheat">{t.wheat}</option>
                  <option value="rice">{t.rice}</option>
                  <option value="maize">{t.maize}</option>
                  <option value="cotton">{t.cotton}</option>
                  <option value="sugarcane">{t.sugarcane}</option>
                  <option value="pulses">{t.pulses}</option>
                  <option value="vegetables">{t.vegetables}</option>
                  <option value="fallow">{t.fallow}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.fertilizingHistoryLabel} *</label>
                <select
                  name="fertilizationHistory"
                  value={formData.fertilizationHistory}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t.selectUsageLevel}</option>
                  <option value="low">{t.lowMinimal}</option>
                  <option value="moderate">{t.moderateRegular}</option>
                  <option value="excessive">{t.excessiveOverused}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.waterAvailability} *</label>
                <select
                  name="waterAvailability"
                  value={formData.waterAvailability}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t.selectAvailability}</option>
                  <option value="low">{t.lowRainfed}</option>
                  <option value="moderate">{t.moderateSeasonal}</option>
                  <option value="high">{t.highPermanent}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.season} *</label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t.selectSeason}</option>
                  <option value="kharif">{t.kharifMonsoon}</option>
                  <option value="rabi">{t.rabiWinter}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.location}</label>
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
                  <option value="gujarat">Gujarat</option>
                  <option value="madhya_pradesh">Madhya Pradesh</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="tamil_nadu">Tamil Nadu</option>
                  <option value="andhra_pradesh">Andhra Pradesh</option>
                  <option value="west_bengal">West Bengal</option>
                </select>
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

              <div className="form-group">
                <label>{t.budget}</label>
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
                <label>{t.anyCropIssues}</label>
                <textarea
                  name="cropIssues"
                  value={formData.cropIssues}
                  onChange={handleChange}
                  placeholder={t.cropIssuesPlaceholder}
                  rows="3"
                ></textarea>
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

            {results && results.success && results.recommendations && (
              <div className="results">
                <h2>🎯 {t.recommendedCrops}</h2>

                {/* Financial Comparison Chart */}
                <div className="chart-container card-panel">
                  <h3>{language === 'en' ? 'Projected Financial Comparison' : 'प्रक्षेपित वित्तीय तुलना'}</h3>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={results.recommendations.map(rec => ({
                          name: rec.cropName,
                          Investment: rec.financials.investment,
                          Profit: rec.financials.profit
                        }))}
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

                {results.recommendations.map((rec, idx) => (
                  <div key={idx} className="recommendation-card">
                    <div className="recommendation-header">
                      <h3>#{rec.rank} - {rec.cropName}</h3>
                      <span className="match-score">{t.matchLabel}: {rec.matchScore.toFixed(0)}%</span>
                    </div>

                    <div className="recommendation-content">
                      <div className="section">
                        <h4>{t.whyThisCropQuestion}</h4>
                        <ul>
                          {rec.reasoning.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="section">
                        <h4>{t.estimatedYieldLabel}</h4>
                        <p>{rec.estimatedYield.min} - {rec.estimatedYield.max} tons/hectare</p>
                      </div>

                      <div className="section">
                        <h4>💊 {t.npkRequirement}</h4>
                        <div className="npk-summary">
                          <p><strong>{t.nitrogen}:</strong> {rec.npkRequirements.nitrogen.deficit} kg/ha {t.needed}</p>
                          <p><strong>{t.phosphorus}:</strong> {rec.npkRequirements.phosphorus.deficit} kg/ha {t.needed}</p>
                          <p><strong>{t.potassium}:</strong> {rec.npkRequirements.potassium.deficit} kg/ha {t.needed}</p>
                        </div>

                        <h5>{t.recommendedFertilizersLabel}</h5>
                        {rec.fertilizerPlan.recommendations.map((fert, i) => (
                          <div key={i} className="fertilizer-summary">
                            <p><strong>{fert.name}</strong></p>
                            <p>{t.quantityLabel}: {fert.bags} bags | {t.timingLabel}: {fert.timing}</p>
                            <p>{t.costLabel}: ₹{fert.cost.toFixed(0)}</p>
                          </div>
                        ))}

                        <div className="total-cost">
                          <strong>{t.totalFertilizerCost}: ₹{rec.fertilizerPlan.totalCost.toFixed(0)} ({formData.landArea} {language === 'en' ? 'Hectares' : 'हेक्टेयर'})</strong>
                        </div>
                      </div>

                      <div className="section">
                        <h4>💰 {language === 'en' ? 'Cost Optimization Tips' : 'लागत अनुकूलन सुझाव'}</h4>
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
                  <h3>📌 {t.generalAdviceLabel}</h3>
                  {results.generalAdvice.map((advice, idx) => (
                    <p key={idx}>{advice}</p>
                  ))}
                </div>
              </div>
            )}

            {!results && !error && (
              <div className="placeholder">
                <p>{language === 'en' ? 'Answer the questions to receive personalized crop and fertilizer recommendations' : 'व्यक्तिगत फसल और उर्वरक सिफारिशें प्राप्त करने के लिए प्रश्नों के उत्तर दें'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnaireAdvisor;

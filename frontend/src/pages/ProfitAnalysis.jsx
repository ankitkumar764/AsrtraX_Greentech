import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import '../styles/Forms.css';
import '../styles/ProfitAnalysis.css';

function ProfitAnalysis() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [formData, setFormData] = useState({
    budget: '',
    landSize: '',
    soilN: '',
    soilP: '',
    soilK: '',
    pH: '',
    season: '',
    waterAvailability: ''
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
      const response = await api.post('/profit-analysis/analyze', formData);
      setResults(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.error || t.tryAgain || 'Failed to fetch analysis.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data format
  const chartData = results?.analysis?.map(item => ({
    name: item.name,
    Cost: item.totalCost,
    Revenue: item.totalRevenue,
    Profit: item.expectedProfit
  })) || [];

  return (
    <div className="advisor-page profit-analysis">
      <div className="container">
        <div className="page-header">
          <h1>📈 Crop Profit Analysis</h1>
          <p>Estimate your farming costs, expected yields, and potential profits based on real-time soil and budget constraints.</p>
        </div>

        <div className="advisor-grid">
          {/* Input Form */}
          <div className="form-section">
            <form onSubmit={handleSubmit} className="advisor-form">
              
              <div className="form-group row-group">
                <div className="half">
                  <label>Total Budget (₹) *</label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} required min="1000" placeholder="e.g. 50000" />
                </div>
                <div className="half">
                  <label>Land Size (Acres) *</label>
                  <input type="number" name="landSize" value={formData.landSize} onChange={handleChange} required min="0.1" step="0.1" placeholder="e.g. 2.5" />
                </div>
              </div>

              <h4>Soil Parameters (Optional)</h4>
              <div className="form-group row-group">
                <div className="half">
                  <label>Nitrogen (mg/kg)</label>
                  <input type="number" name="soilN" value={formData.soilN} onChange={handleChange} min="0" placeholder="e.g. 150" />
                </div>
                <div className="half">
                  <label>Phosphorus (mg/kg)</label>
                  <input type="number" name="soilP" value={formData.soilP} onChange={handleChange} min="0" placeholder="e.g. 25" />
                </div>
              </div>
              <div className="form-group row-group">
                <div className="half">
                  <label>Potassium (mg/kg)</label>
                  <input type="number" name="soilK" value={formData.soilK} onChange={handleChange} min="0" placeholder="e.g. 120" />
                </div>
                <div className="half">
                  <label>pH Level</label>
                  <input type="number" name="pH" value={formData.pH} onChange={handleChange} min="4" max="10" step="0.1" placeholder="e.g. 6.5" />
                </div>
              </div>

              <h4>Environmental Factors</h4>
              <div className="form-group row-group">
                <div className="half">
                  <label>Season *</label>
                  <select name="season" value={formData.season} onChange={handleChange} required>
                    <option value="">Select Season</option>
                    <option value="kharif">Kharif (Monsoon)</option>
                    <option value="rabi">Rabi (Winter)</option>
                  </select>
                </div>
                <div className="half">
                  <label>Water Availability *</label>
                  <select name="waterAvailability" value={formData.waterAvailability} onChange={handleChange} required>
                    <option value="">Select Availability</option>
                    <option value="low">Low (Rainfed)</option>
                    <option value="moderate">Moderate (Seasonal)</option>
                    <option value="high">High (Permanent)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Analyzing...' : 'Calculate Profitability'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="results-section">
            {error && <div className="alert alert-error"><strong>Error:</strong> {error}</div>}

            {results && results.analysis && (
              <div className="profit-results">
                
                {/* Smart Insight Banner */}
                {results.insights && (
                  <div className="smart-insight-banner">
                    <div className="insight-icon">💡</div>
                    <div className="insight-content">
                      <h3>AI Recommendation: Top Pick is {results.insights.bestCrop}</h3>
                      <p>{results.insights.overview}</p>
                      <ul className="insight-tips">
                        {results.insights.costReductionTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Profit Chart */}
                <div className="chart-container card-panel">
                  <h3>Revenue & Cost Projections</h3>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(val) => `₹${(val / 1000)}k`} />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Crop Breakdown Cards */}
                <h3>Crop-by-Crop Analysis</h3>
                <div className="metric-cards-grid">
                  {results.analysis.map((item, idx) => (
                    <div className={`analysis-card ${item.profitabilityLabel.toLowerCase()}`} key={item.id}>
                      <div className="card-header">
                        <h4>#{idx + 1} {item.name}</h4>
                        <span className={`badge badge-${item.profitabilityLabel.toLowerCase()}`}>{item.profitabilityLabel} ROI</span>
                      </div>
                      
                      <div className="card-body">
                        <div className="stat-row">
                          <span>Total Investment:</span>
                          <strong>₹{item.totalCost.toLocaleString()}</strong>
                        </div>
                        <div className="stat-row">
                          <span>Expected Yield:</span>
                          <strong>{item.expectedYield} {item.unit}</strong>
                        </div>
                        <div className="stat-row">
                          <span>Est. Revenue:</span>
                          <strong className="text-success">₹{item.totalRevenue.toLocaleString()}</strong>
                        </div>
                        <div className="divider"></div>
                        <div className="stat-row highlight-row">
                          <span>Net Profit:</span>
                          <strong className={item.expectedProfit > 0 ? 'text-success' : 'text-danger'}>
                            ₹{item.expectedProfit.toLocaleString()} ({item.roi}%)
                          </strong>
                        </div>

                        {/* Risk Indicator */}
                        <div className={`risk-indicator risk-${item.risk.level.toLowerCase()}`}>
                          <strong>Risk: {item.risk.level}</strong>
                          <p className="risk-reason">{item.risk.reasons[0]}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Comparison Table */}
                <div className="table-container card-panel mt-4">
                  <h3>Cost Breakdown Comparison</h3>
                  <div className="responsive-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Crop</th>
                          <th>Seeds (₹)</th>
                          <th>Fertilizers (₹)</th>
                          <th>Irrigation (₹)</th>
                          <th>Labor (₹)</th>
                          <th>Total Cost (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.analysis.map(item => (
                          <tr key={item.id}>
                            <td><strong>{item.name}</strong></td>
                            <td>{item.costs.seeds.toLocaleString()}</td>
                            <td>{item.costs.fertilizer.toLocaleString()}</td>
                            <td>{item.costs.irrigation.toLocaleString()}</td>
                            <td>{item.costs.labor.toLocaleString()}</td>
                            <td><strong>{item.totalCost.toLocaleString()}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {!results && !error && (
              <div className="placeholder">
                <p>Enter your budget and farm details to reveal actionable financial insights.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAnalysis;

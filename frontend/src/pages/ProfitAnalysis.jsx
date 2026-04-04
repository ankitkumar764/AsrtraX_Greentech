import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  TrendingUp, CircleDollarSign, Calculator, LineChart, 
  ArrowRight, ShieldAlert, Sparkles, Info, ArrowLeft,
  PieChart, BarChart3, Wallet, LayoutGrid
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import '../styles/index.css';

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
    setResults(null);

    try {
      const response = await api.post('/profit-analysis/analyze', formData);
      setTimeout(() => {
        setResults(response.data.data || response.data);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });
      }, 400);
    } catch (err) {
      setError(err.response?.data?.error || t.tryAgain || 'Failed to fetch analysis.');
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  const chartData = results?.analysis?.map(item => ({
    name: item.name,
    Cost: item.totalCost,
    Revenue: item.totalRevenue,
    Profit: item.expectedProfit
  })) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="advisor-page">
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="page-header" style={{ marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '8px 20px', borderRadius: '40px', marginBottom: '20px' }}>
            <Calculator size={18} />
            <span style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase' }}>{t.financialYieldEngine || 'Financial Yield Engine'}</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--dark-color)' }}>{t.profitAnalysisTitle}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>{t.profitAnalysisDesc}</p>
        </div>

        <div className={`advisor-grid ${results ? 'has-results' : ''}`}>
          <div className={`form-section ${results ? 'hidden' : ''}`}>
            <form onSubmit={handleSubmit} className="advisor-form">
              <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Wallet className="text-primary" /> {t.budgetScale || 'Budget & Scale'}</h3>
              
              <div className="form-group">
                <label>{t.totalBudget || 'Total Budget (₹)'} *</label>
                <input type="number" name="budget" value={formData.budget} onChange={handleChange} required min="1000" placeholder="e.g. 50000" />
              </div>
              <div className="form-group">
                <label>{t.landSize || 'Land Size (Acres)'} *</label>
                <input type="number" name="landSize" value={formData.landSize} onChange={handleChange} required min="0.1" step="0.1" placeholder="e.g. 2.5" />
              </div>

              <h4 style={{ margin: '20px 0 15px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t.environmentalFactors || 'Environmental Factors'}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>{t.season || 'Season'} *</label>
                  <select name="season" value={formData.season} onChange={handleChange} required>
                    <option value="">{t.select || 'Select'}</option>
                    <option value="kharif">{t.kharifMonsoon}</option>
                    <option value="rabi">{t.rabiWinter}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t.waterAvailability || 'Water'} *</label>
                  <select name="waterAvailability" value={formData.waterAvailability} onChange={handleChange} required>
                    <option value="">{t.select || 'Select'}</option>
                    <option value="low">{t.lowRainfed}</option>
                    <option value="high">{t.highPermanent}</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-premium btn-large" disabled={loading} style={{ marginTop: '20px' }}>
                {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><LineChart /></motion.div> : (t.calculateProfitability || 'Calculate Profitability')}
              </button>
            </form>
          </div>

          <div className="results-section">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-error">
                  <ShieldAlert size={20} /> {error}
                </motion.div>
              )}

              {results && results.analysis && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="results-container">
                  <div className="sticker-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <TrendingUp size={24} />
                      <span>{t.financialProjections || 'FINANCIAL PROJECTIONS'}</span>
                    </div>
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: 'auto', margin: 0, padding: '8px 20px', fontSize: '14px', borderRadius: '30px' }}
                      onClick={() => setResults(null)}
                    >
                      ← {t.modifyInputs}
                    </button>
                  </div>

                  {/* Insight Banner */}
                  {results.insights && (
                    <motion.div variants={itemVariants} className="health-card" style={{ background: 'var(--primary-light)', padding: '30px', borderRadius: '24px', margin: '30px 0', border: '1px solid var(--primary-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                          <Sparkles size={22} />
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--primary-dark)' }}>{t.bestCropPick || 'Best Crop Pick'}: {t[results.insights.bestCrop] || results.insights.bestCrop}</h4>
                      </div>
                      <p style={{ color: 'var(--primary-dark)', opacity: 0.8, lineHeight: '1.6', fontSize: '1.1rem' }}>{t[results.insights.overview] || results.insights.overview}</p>
                    </motion.div>
                  )}

                  {/* Profit Chart */}
                  <motion.div variants={itemVariants} className="modern-card" style={{ padding: '30px', marginBottom: '30px' }}>
                    <h4 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><BarChart3 size={20} /> {t.revenueVsCost || 'Revenue vs Cost Projections'}</h4>
                    <div style={{ width: '100%', height: 350 }}>
                      <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val / 1000)}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                            formatter={(value) => `₹${value.toLocaleString()}`} 
                          />
                          <Legend verticalAlign="top" height={36}/>
                          <Bar name={t.cost} dataKey="Cost" fill="hsl(0, 72%, 60%)" radius={[6, 6, 0, 0]} />
                          <Bar name={t.profit} dataKey="Profit" fill="var(--primary-color)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Crop Analysis Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                    {results.analysis.map((item, idx) => (
                      <motion.div key={idx} variants={itemVariants} className="recommendation-card" style={{ margin: 0, padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                          <h4 style={{ margin: 0, fontSize: '1.4rem' }}>{item.name}</h4>
                          <span className="badge-health impact-badge" style={{ background: item.profitabilityLabel === 'High' ? 'var(--primary-light)' : 'hsl(38, 92%, 92%)' }}>
                            {item.roi}% ROI
                          </span>
                        </div>

                        <div className="impact-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '0 0 20px 0' }}>
                          <div className="impact-card" style={{ padding: '15px' }}>
                            <span className="label">{t.investment}</span>
                            <span className="value" style={{ fontSize: '1.2rem' }}>₹{item.totalCost.toLocaleString()}</span>
                          </div>
                          <div className="impact-card" style={{ padding: '15px' }}>
                            <span className="label">{t.netProfit}</span>
                            <span className="value" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>₹{item.expectedProfit.toLocaleString()}</span>
                          </div>
                        </div>

                        <div style={{ padding: '15px', background: 'var(--light-color)', borderRadius: '12px', fontSize: '14px' }}>
                          <strong>{t.riskProfile || 'Risk Profile'}: {t[item.risk.level] || item.risk.level}</strong>
                          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>{t[item.risk.reasons[0]] || item.risk.reasons[0]}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Cost Table */}
                  <motion.div variants={itemVariants} className="modern-card" style={{ padding: '30px' }}>
                    <h4 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><LayoutGrid size={20} /> {t.detailedCostBreakdown || 'Detailed Cost Breakdown'}</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--light-color)' }}>
                            <th style={{ padding: '15px' }}>{t.cropLabel || 'Crop'}</th>
                            <th style={{ padding: '15px' }}>{t.seeds || 'Seeds'}</th>
                            <th style={{ padding: '15px' }}>{t.fertilizers || 'Fertilizers'}</th>
                            <th style={{ padding: '15px' }}>{t.labor || 'Labor'}</th>
                            <th style={{ padding: '15px', fontWeight: '800' }}>{t.totalCost || 'Total Cost'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.analysis.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--light-color)' }}>
                              <td style={{ padding: '15px', fontWeight: '700' }}>{item.name}</td>
                              <td style={{ padding: '15px' }}>₹{item.costs.seeds.toLocaleString()}</td>
                              <td style={{ padding: '15px' }}>₹{item.costs.fertilizer.toLocaleString()}</td>
                              <td style={{ padding: '15px' }}>₹{item.costs.labor.toLocaleString()}</td>
                              <td style={{ padding: '15px', fontWeight: '800', color: 'var(--primary-color)' }}>₹{item.totalCost.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>

                </motion.div>
              )}

              {!results && !loading && (
                <div className="placeholder" style={{ padding: '100px 20px', textAlign: 'center' }}>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }}>
                    <Calculator size={80} style={{ opacity: 0.1, marginBottom: '20px' }} />
                  </motion.div>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{t.profitAnalysisPlaceholder || 'Enter your budget and farm details to reveal actionable financial insights.'}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAnalysis;

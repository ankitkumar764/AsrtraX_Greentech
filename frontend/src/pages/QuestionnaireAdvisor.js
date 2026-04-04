import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sprout, Leaf, CircleDollarSign, Lightbulb, CheckCircle, 
  Sparkles, ShieldCheck, AlertTriangle, TrendingUp, Info, 
  MapPin, Phone, Building2, Landmark, HelpCircle, Calendar, Droplets, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import '../styles/index.css';

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
    setResults(null);

    try {
      const response = await api.post('/recommendations/get', formData);
      setTimeout(() => {
        // The backend returns { success: true, data: { recommendations: [...] }, ... }
        setResults(response.data.data || response.data);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6'],
          zIndex: 9999
        });
      }, 400);
    } catch (err) {
      setError(err.response?.data?.error || t.tryAgain);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

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
            <HelpCircle size={18} />
            <span style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase' }}>{t.quickAssessment || 'Quick Smart Assessment'}</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--dark-color)' }}>{t.questionnaireTitle}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>{t.questionnaireDesc}</p>
        </div>

        <div className={`advisor-grid ${results ? 'has-results' : ''}`}>
          <div className={`form-section ${results ? 'hidden' : ''}`}>
            <form onSubmit={handleSubmit} className="advisor-form">
              <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Info className="text-primary" /> {t.basicInfo || 'Basic Information'}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>{t.soilType} *</label>
                  <select name="soilType" value={formData.soilType} onChange={handleChange} required>
                    <option value="">{t.select || 'Select'}</option>
                    <option value="black">{t.blackSoil}</option>
                    <option value="clay">{t.claySoil || t.clay}</option>
                    <option value="loamy">{t.loamySoil || t.loamy}</option>
                    <option value="sandy">{t.sandy}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t.season} *</label>
                  <select name="season" value={formData.season} onChange={handleChange} required>
                    <option value="">{t.select || 'Select'}</option>
                    <option value="kharif">{t.kharifMonsoon}</option>
                    <option value="rabi">{t.rabiWinter}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{t.waterAvailability} *</label>
                <select name="waterAvailability" value={formData.waterAvailability} onChange={handleChange} required>
                  <option value="">{t.selectAvailability}</option>
                  <option value="low">{t.lowRainfed}</option>
                  <option value="moderate">{t.moderateSeasonal}</option>
                  <option value="high">{t.highPermanent}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.previousCrop}</label>
                <select name="previousCrop" value={formData.previousCrop} onChange={handleChange}>
                  <option value="">{t.selectPreviousCrop}</option>
                  <option value="rice">{t.rice}</option>
                  <option value="wheat">{t.wheat}</option>
                  <option value="maize">{t.maize}</option>
                  <option value="fallow">{t.fallow}</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>{t.landArea || 'Land Area (Hectares)'} *</label>
                  <input type="number" name="landArea" value={formData.landArea} onChange={handleChange} required min="0.1" step="0.1" />
                </div>
                <div className="form-group">
                  <label>{t.budget} (₹)</label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder={t.optional} min="0" />
                </div>
              </div>

              <div className="form-group">
                <label>{t.anyCropIssues}</label>
                <textarea name="cropIssues" value={formData.cropIssues} onChange={handleChange} placeholder={t.cropIssuesPlaceholder} rows="2"></textarea>
              </div>

              <button type="submit" className="btn btn-premium btn-large" disabled={loading} style={{ marginTop: '20px' }}>
                {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sprout /></motion.div> : t.getRecommendations}
              </button>
            </form>
          </div>

          <div className="results-section">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-error">
                  <AlertTriangle size={20} /> {error}
                </motion.div>
              )}

              {results && results.success && results.recommendations && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="results-container">
                  <div className="sticker-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Sparkles size={24} />
                      <span style={{ textTransform: 'uppercase' }}>{t.latestRecommendations}</span>
                    </div>
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: 'auto', margin: 0, padding: '8px 20px', fontSize: '14px', borderRadius: '30px' }}
                      onClick={() => setResults(null)}
                    >
                      ← {t.modifyInputs}
                    </button>
                  </div>

                  {results.warning && (
                    <motion.div variants={itemVariants} className="alert alert-warning" style={{ background: 'hsl(38, 92%, 92%)', border: 'none', color: 'hsl(38, 92%, 22%)', padding: '20px', borderRadius: '16px', display: 'flex', gap: '15px', marginBottom: '30px' }}>
                      <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Attention:</strong> {t[results.warning] || results.warning}
                      </div>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="health-card" style={{ background: 'var(--primary-light)', padding: '30px', borderRadius: '24px', margin: '0 0 30px 0', border: '1px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', boxShadow: 'var(--shadow-sm)' }}>
                          <ShieldCheck size={28} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: '800', textTransform: 'uppercase' }}>{t.inferredSoilHealth}</div>
                          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary-dark)' }}>{t[results.soilHealth?.status] || results.soilHealth?.status}</div>
                        </div>
                      </div>
                      <div className="badge-health impact-badge">
                        {t[results.confidenceLevel] || results.confidenceLevel}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-dark)', opacity: 0.8, lineHeight: '1.6' }}>
                      {t[results.soilHealth?.notes] || results.soilHealth?.notes}
                    </p>
                  </motion.div>

                  {results.recommendations.map((rec, index) => (
                    <motion.div key={index} variants={itemVariants} className="recommendation-card">
                      <div className="recommendation-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{ fontSize: '3rem' }}>{rec.cropName.includes('Bajra') || rec.cropName.includes('cropBajra') ? '🌾' : (rec.cropName.includes('Wheat') ? '🍞' : '🌱')}</span>
                          <h3>{t[rec.cropName] || rec.cropName}</h3>
                        </div>
                        <div className="match-score">{t.matchLabel}: {rec.matchScore}%</div>
                      </div>

                      <div className="impact-grid">
                        <div className="impact-card">
                          <div className="icon">💰</div>
                          <span className="value">₹{rec.financials?.profit.toLocaleString()}</span>
                          <span className="label">{t.estProfit}</span>
                        </div>
                        <div className="impact-card">
                          <div className="icon">📦</div>
                          <span className="value">{rec.estimatedYield?.max} t/ha</span>
                          <span className="label">{t.maxYield}</span>
                        </div>
                        <div className="impact-card">
                          <div className="icon">💳</div>
                          <span className="value">₹{rec.financials?.investment.toLocaleString()}</span>
                          <span className="label">{t.investment}</span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '30px', padding: '20px', background: 'var(--light-color)', borderRadius: '16px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><Lightbulb size={18} className="text-primary" /> {t.whyThisCropQuestion}</h4>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {rec.reasoning.map((reason, idx) => (
                            <li key={idx} style={{ marginBottom: '8px', fontSize: '15px' }}>{t[reason] || reason}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginTop: '30px', padding: '25px', background: 'var(--dark-color)', color: 'white', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <h4 style={{ margin: 0 }}>{t.optimizationPlan}</h4>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-color)' }}>₹{rec.fertilizerPlan.totalCost.toFixed(0)} <small style={{ fontSize: '12px', opacity: 0.6 }}>/ {t.fertilizer || 'fertilizer'}</small></div>
                        </div>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {rec.fertilizerPlan.recommendations.map((fRec, idx) => (
                            <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: '700' }}>{fRec.name}</div>
                                <div style={{ fontSize: '13px', opacity: 0.6 }}>{fRec.bags} {t.bags || 'bags'} • {t[fRec.timing] || fRec.timing}</div>
                              </div>
                              <div style={{ fontWeight: '800' }}>₹{fRec.cost.toFixed(0)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {rec.costOptimization && rec.costOptimization.length > 0 && (
                        <div style={{ marginTop: '30px', padding: '20px', background: 'hsl(210, 20%, 96%)', borderRadius: '16px' }}>
                          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><TrendingUp size={18} className="text-secondary" /> {t.profitStrategy}</h4>
                          <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {rec.costOptimization.slice(0, 3).map((tip, idx) => (
                              <li key={idx} style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>{t[tip] || tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  <div className="placeholder" style={{ marginTop: '40px', padding: '30px', background: 'var(--primary-light)', borderRadius: '24px', textAlign: 'left', border: '1px dashed var(--primary-color)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-dark)', marginBottom: '15px' }}><Info size={20} /> {t.proTip}</h4>
                    <p style={{ margin: 0, color: 'var(--primary-dark)', opacity: 0.8, fontSize: '15px' }}>
                      {t.professionalTipDesc}
                    </p>
                    <button className="btn btn-primary" style={{ marginTop: '20px', padding: '10px 25px' }} onClick={() => window.location.href = '/soil-report'}>
                      {t.getSoilReportAdvisor} <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {!results && !loading && (
                <div className="placeholder" style={{ padding: '100px 20px', textAlign: 'center' }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                    <HelpCircle size={80} style={{ opacity: 0.1, marginBottom: '20px' }} />
                  </motion.div>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{t.answerQuestionsPlaceholder || t.answerQuestionsText}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnaireAdvisor;

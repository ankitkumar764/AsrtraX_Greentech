import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  TestTube, ArrowUpRight, ArrowDownRight, Leaf, 
  CircleDollarSign, IndianRupee, PackageOpen, 
  Clock, Lightbulb, CheckCircle, Sprout 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
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
    setResults(null); // Clear previous results to trigger re-animation

    try {
      const response = await api.post('/recommendations/soil-report', formData);
      // Simulating slight delay to make animation pop smoothly
      setTimeout(() => {
        setResults(response.data);
        // Crazy confetti celebration!
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

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Helper to render NPK progress bar
  const renderProgressBar = (required, deficit, label, color) => {
    const present = required - deficit;
    // Calculate percentage, capping at 100%
    const percentage = required > 0 ? Math.min((present / required) * 100, 100) : 0;
    
    return (
      <div className="npk-progress-container">
        <div className="npk-progress-header">
          <span style={{ fontWeight: 600 }}>{label}</span>
          <span className="npk-stats">{present} / {required} kg/ha</span>
        </div>
        <div className="progress-bar-bg">
          <motion.div 
            className="progress-bar-fill"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(percentage, 5)}%` }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          />
        </div>
        {deficit > 0 ? (
          <span className="deficit-text"><ArrowDownRight size={14} /> Deficit: {deficit} kg/ha</span>
        ) : (
          <span className="sufficient-text"><CheckCircle size={14} /> Sufficient</span>
        )}
      </div>
    );
  };

  return (
    <div className={`advisor-page ${results ? 'farm-bg-active' : ''}`}>
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
                {loading ? (
                  <span className="flex-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ marginRight: '8px', display: 'flex' }}>
                       <Sprout size={18} />
                    </motion.div>
                    {t.loading}
                  </span>
                ) : t.getRecommendations}
              </button>
            </form>
          </div>

          <div className="results-section">
            <AnimatePresence mode="wait">
              {error && (
                <div className="alert alert-error">
                  <strong>{t.error}:</strong> {error}
                </div>
              )}

              {results && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="results"
                >
                <h2>📋 {t.recommendationsFor} {results.crop}</h2>

                  <motion.div variants={itemVariants} className="soil-analysis modern-card">
                    <div className="card-header">
                      <TestTube className="card-icon" />
                      <h3>{t.currentSoilStatus}</h3>
                    </div>
                    <div className="info-grid">
                      <div className="info-box modern-info">
                        <span className="label">{t.nitrogenNLabel}</span>
                        <span className="value n-value">{results.soilAnalysis.nitrogen} <small>mg/kg</small></span>
                      </div>
                      <div className="info-box modern-info">
                        <span className="label">{t.phosphorusLabel}</span>
                        <span className="value p-value">{results.soilAnalysis.phosphorus} <small>mg/kg</small></span>
                      </div>
                      <div className="info-box modern-info">
                        <span className="label">{t.potassiumLabel}</span>
                        <span className="value k-value">{results.soilAnalysis.potassium} <small>mg/kg</small></span>
                      </div>
                      <div className="info-box modern-info">
                        <span className="label">pH Level</span>
                        <span className="value ph-value">{results.soilAnalysis.pH}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="npk-requirements modern-card">
                    <div className="card-header">
                      <ArrowUpRight className="card-icon" />
                      <h3>{t.npkRequirement}</h3>
                    </div>
                    <div className="npk-visual-grid">
                      {renderProgressBar(
                        results.npkRequirements.nitrogen.required, 
                        results.npkRequirements.nitrogen.deficit, 
                        t.nitrogen, 
                        "#3498db"
                      )}
                      {renderProgressBar(
                        results.npkRequirements.phosphorus.required, 
                        results.npkRequirements.phosphorus.deficit, 
                        t.phosphorus, 
                        "#e67e22"
                      )}
                      {renderProgressBar(
                        results.npkRequirements.potassium.required, 
                        results.npkRequirements.potassium.deficit, 
                        t.potassium, 
                        "#9b59b6"
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="fertilizer-plan modern-card">
                    <div className="card-header">
                       <Leaf className="card-icon" color="#2ecc71" />
                       <h3>{t.fertilizers}</h3>
                    </div>
                    
                    <motion.div 
                      className="cost-summary modern-cost"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="cost-flex">
                        <CircleDollarSign size={28} />
                        <span>{t.totalCostLabel}</span>
                      </div>
                      <strong>₹{results.fertilizerPlan.totalCost.toFixed(0)} <small>/ ha</small></strong>
                    </motion.div>

                    <div className="fertilizer-list">
                      {results.fertilizerPlan.recommendations.map((rec, idx) => (
                        <motion.div 
                          key={idx} 
                          className="fertilizer-item modern-item glowing-border-hover"
                          whileHover={{ 
                            scale: 1.05, 
                            rotate: (idx % 2 === 0 ? 1 : -1),
                            boxShadow: "0 20px 40px rgba(46, 204, 113, 0.4)",
                            y: -10,
                            zIndex: 10 
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <div className="item-header">
                            <h4>{rec.name}</h4>
                            <span className="cost-badge crazy-cost-badge"><IndianRupee size={12}/> {rec.cost.toFixed(0)}</span>
                          </div>
                          <div className="item-details">
                            <p className="bags"><PackageOpen size={16} className="spin-on-hover"/> {rec.bags} bags <span className="subtext">(50kg ea)</span></p>
                            <p className="timing"><Clock size={16} className="pulse-on-hover"/> {rec.timing}</p>
                          </div>
                          <p className="reason"><Lightbulb size={16} className="bounce-on-hover" color="#f1c40f"/> {rec.reason}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="notes modern-notes">
                      <h4><CheckCircle size={18} className="notes-icon" /> {t.importantNotesLabel}</h4>
                      <ul>
                        {results.fertilizerPlan.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.p variants={itemVariants} className="note-text bottom-note">
                    {t.note}
                  </motion.p>
                </motion.div>
              )}

              {!results && !error && !loading && (
                <motion.div 
                  key="placeholder"
                  className="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Leaf size={64} className="placeholder-icon" color="#e0e0e0" />
                  </motion.div>
                  <p>{t.enterSoilTestResults}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoilReportAdvisor;

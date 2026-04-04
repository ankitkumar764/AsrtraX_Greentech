import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  TestTube, ArrowUpRight, ArrowDownRight, Leaf, 
  CircleDollarSign, Lightbulb, CheckCircle, Sprout,
  MapPin, Phone, Building2, Landmark, ShieldCheck, Sparkles, AlertTriangle, TrendingUp,
  UploadCloud, FileText, CheckCircle2, Loader2, Info,
  Camera, ScanLine, Image as ImageIcon, Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import { mapToFormData } from '../utils/soilParser';
import '../styles/index.css';

function SoilReportAdvisor() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [formData, setFormData] = useState({
    soilN: '',
    soilP: '',
    soilK: '',
    pH: '',
    soilType: '',
    waterAvailability: '',
    previousCrop: '',
    soilTexture: '',
    fertilizationHistory: '',
    budget: '',
    landArea: '1'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [highlightedFields, setHighlightedFields] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSmartImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setUploadSuccess(false);
    setImagePreview(null);
    setScanProgress(0);

    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }

    if (isPDF || isImage) {
       await handleReportUpload(file);
    } else {
      setError('Please upload a PDF or Image (JPG/PNG)');
    }
  };

  const handleReportUpload = async (file) => {
    setIsUploading(true);
    setScanProgress(10);
    const formDataUpload = new FormData();
    formDataUpload.append('report', file);

    try {
      setScanProgress(40);
      const response = await api.post('/soil/upload-report', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setScanProgress(Math.min(pct, 80));
        }
      });

      setScanProgress(100);
      console.log('📦 Full backend response:', response.data);

      if (response.data && response.data.success && response.data.data) {
        applyExtractedData(response.data.data, response.data.usedAI);
      } else {
        const errType = response.data?.errorType;
        if (errType === 'SCANNED_PDF') {
          setError(t.errorScannedPdf || '📷 Ya PDF scan hai. Image (JPG/PNG) upload karein!');
        } else {
          setError(t.errorNoData || '❌ Report se data extract nahi hua. Values manually bharein.');
        }
      }
    } catch (err) {
      console.error('Upload Error:', err);
      const errData = err.response?.data;
      if (errData?.errorType === 'SCANNED_PDF') {
        setError(t.errorScannedPdf || '📷 Ya PDF scan hai. Image (JPG/PNG) upload karein!');
      } else {
        setError(t.errorServerConnect || '⚠️ Server se connect nahi ho paya. Backend check karein.');
      }
    } finally {
      setIsUploading(false);
      setScanProgress(0);
    }
  };


  const applyExtractedData = (data, wasAI = false) => {
    console.log('🌱 applyExtractedData called with:', data);

    // Map backend keys → frontend form keys
    const keyMap = {
      nitrogen:     'soilN',
      phosphorus:   'soilP',
      potassium:    'soilK',
      ph:           'pH',
      organicCarbon: 'organicCarbon',
      // Also handle if somehow old keys come through
      soilN: 'soilN',
      soilP: 'soilP',
      soilK: 'soilK',
      pH:    'pH',
    };

    // Build new form values only for non-null extracted fields
    const newValues = {};
    const highlightKeys = [];

    Object.keys(data).forEach(backendKey => {
      const val = data[backendKey];
      if (val !== null && val !== undefined) {
        const formKey = keyMap[backendKey];
        if (formKey) {
          newValues[formKey] = String(val);
          if (!highlightKeys.includes(formKey)) highlightKeys.push(formKey);
        }
      }
    });

    console.log('📋 Mapped form values:', newValues, '| Highlighted:', highlightKeys);

    if (highlightKeys.length > 0) {
      setFormData(prev => ({ ...prev, ...newValues }));
      setUploadSuccess(true);
      setHighlightedFields(highlightKeys);
      setError(null);

      // Clear highlight after 8 seconds (NOT the values!)
      setTimeout(() => {
        setUploadSuccess(false);
        setHighlightedFields([]);
      }, 8000);
    } else {
      setError(t.errorNoData || '❌ Could not find any soil metrics in this document. Please enter values manually.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await api.post('/recommendations/soil-report', formData);
      setTimeout(() => {
        setResults(response.data);
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

  const renderProgressBar = (required, deficit, label, color) => {
    const present = required - deficit;
    const percentage = required > 0 ? Math.min((present / required) * 100, 100) : 0;
    
    return (
      <div className="npk-progress-container" style={{ background: 'var(--light-color)', padding: '15px', borderRadius: '12px' }}>
        <div className="npk-progress-header" style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>{label}</span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{present} / {required} kg/ha</span>
        </div>
        <div className="progress-bar-bg" style={{ height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px' }}>
          <motion.div 
            className="progress-bar-fill"
            style={{ backgroundColor: color, height: '100%', borderRadius: '6px' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(percentage, 5)}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div style={{ marginTop: '8px' }}>
          {deficit > 0 ? (
            <span style={{ color: 'var(--danger-color)', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownRight size={14} /> Deficit: {deficit} kg/ha
            </span>
          ) : (
            <span style={{ color: 'var(--primary-color)', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} /> Sufficient
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="advisor-page">
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="page-header" style={{ marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '8px 20px', borderRadius: '40px', marginBottom: '20px' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase' }}>{t.expertDecisionSystem}</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--dark-color)' }}>{t.soilReportTitle}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>{t.soilReportDesc}</p>
        </div>

        <div className={`advisor-grid ${results ? 'has-results' : ''}`}>
          <div className={`form-section ${results ? 'hidden' : ''}`}>
            
            {/* Smart Scanner Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="modern-card"
              style={{ marginBottom: '30px', padding: '30px', border: '2px solid var(--primary-light)', background: 'hsl(145, 63%, 98%)', position: 'relative', overflow: 'hidden' }}
            >
              <div className="card-badge" style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary-color)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>{t.aiPowered}</div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ padding: '15px', background: 'white', border: '1px solid var(--primary-light)', color: 'var(--primary-color)', borderRadius: '15px', boxShadow: 'var(--shadow-sm)' }}>
                  <Zap size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>{t.smartScanner}</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>{t.smartScannerDesc}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: imagePreview ? '1fr 1fr' : '1fr', gap: '20px' }}>
                <div 
                  className="upload-dropzone"
                  onClick={() => document.getElementById('report-upload').click()}
                  style={{
                    border: '2px dashed rgba(46, 204, 113, 0.3)',
                    borderRadius: '20px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px'
                  }}
                >
                  <input 
                    type="file" 
                    id="report-upload" 
                    hidden 
                    accept=".pdf,image/*" 
                    onChange={handleSmartImport}
                    disabled={isUploading}
                  />
                  
                  {isUploading ? (
                    <div className="flex-col center gap-1">
                      {scanProgress > 0 ? (
                        <>
                          <div style={{ width: '60px', height: '60px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'rotate 1s linear infinite' }} />
                          <span style={{ marginTop: '15px', fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary-color)' }}>{scanProgress}%</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.analyzing}</span>
                        </>
                      ) : (
                        <>
                           <Loader2 size={40} className="text-primary" style={{ animation: 'rotate 1s linear infinite' }} />
                           <span style={{ marginTop: '15px', fontWeight: '700' }}>{t.thinking}</span>
                        </>
                      )}
                    </div>
                  ) : uploadSuccess ? (
                    <div className="flex-col center gap-2">
                       <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                        <CheckCircle2 size={32} />
                      </div>
                      <span style={{ fontWeight: '800', color: 'var(--primary-color)', fontSize: '1.1rem' }}>{t.dataIntegrated}</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ position: 'relative', marginBottom: '15px' }}>
                        <UploadCloud size={50} style={{ color: 'var(--primary-color)', opacity: 0.8 }} />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', top: -5, right: -5, background: 'var(--accent-color)', color: 'white', padding: '4px', borderRadius: '50%' }}>
                          <Camera size={12} />
                        </motion.div>
                      </div>
                      <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '5px' }}>{t.uploadReport}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.uploadDesc}</div>
                    </>
                  )}
                </div>

                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--primary-light)' }}
                  >
                    <img src={imagePreview} alt="Soil Report Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))', display: 'flex', alignItems: 'flex-end', padding: '15px' }}>
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ImageIcon size={14} /> {t.scanningPreview}
                      </span>
                    </div>
                    {isUploading && (
                      <motion.div 
                        initial={{ top: '-10%' }}
                        animate={{ top: '110%' }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        style={{ position: 'absolute', left: 0, width: '100%', height: '2px', background: 'var(--primary-color)', boxShadow: '0 0 15px var(--primary-color)', zIndex: 5 }}
                      />
                    )}
                  </motion.div>
                )}
              </div>

              {uploadSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '15px', borderLeft: '5px solid var(--primary-color)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-sm)' }}
                >
                  <Sparkles size={20} className="text-primary" />
                  <span style={{ fontWeight: '600' }}>AI scanner found Nitrogen, Phosphorus, Potash, and pH levels!</span>
                </motion.div>
              )}
            </motion.div>

            <form onSubmit={handleSubmit} className="advisor-form">
              <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><TestTube className="text-primary" /> Soil Metrics</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>{t.soilNitrogen} (N)</label>
                  <input 
                    type="number" 
                    name="soilN" 
                    value={formData.soilN} 
                    onChange={handleChange} 
                    placeholder="e.g., 200" 
                    required 
                    className={highlightedFields.includes('soilN') ? 'field-highlight' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>{t.soilPhosphorus} (P)</label>
                  <input 
                    type="number" 
                    name="soilP" 
                    value={formData.soilP} 
                    onChange={handleChange} 
                    placeholder="e.g., 20" 
                    required 
                    className={highlightedFields.includes('soilP') ? 'field-highlight' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>{t.soilPotassium} (K)</label>
                  <input 
                    type="number" 
                    name="soilK" 
                    value={formData.soilK} 
                    onChange={handleChange} 
                    placeholder="e.g., 150" 
                    required 
                    className={highlightedFields.includes('soilK') ? 'field-highlight' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>{t.pHLevel}</label>
                  <input 
                    type="number" 
                    name="pH" 
                    step="0.1" 
                    value={formData.pH} 
                    onChange={handleChange} 
                    placeholder="e.g., 6.8" 
                    required 
                    className={highlightedFields.includes('pH') ? 'field-highlight' : ''}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t.soilType} *</label>
                <select name="soilType" value={formData.soilType} onChange={handleChange} required>
                  <option value="">{t.selectSoilType}</option>
                  <option value="black">{t.blackSoil}</option>
                  <option value="clay">{t.claySoil}</option>
                  <option value="loamy">{t.loamySoil}</option>
                  <option value="sandy">{t.sandy}</option>
                  <option value="sandy loam">{t.sandyLoam}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.waterAvailability} *</label>
                <select name="waterAvailability" value={formData.waterAvailability} onChange={handleChange} required>
                  <option value="">{t.selectAvailability}</option>
                  <option value="low">{t.lowMinimal}</option>
                  <option value="moderate">{t.moderateRegular}</option>
                  <option value="high">{t.highPermanent}</option>
                </select>
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

              {results && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="results-container">
                  <div className="sticker-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Sprout size={24} />
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
                    <motion.div variants={itemVariants} className="alert alert-warning" style={{ background: 'hsl(38, 92%, 92%)', border: 'none', color: 'hsl(38, 92%, 22%)', padding: '20px', borderRadius: '16px', display: 'flex', gap: '15px' }}>
                      <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Attention:</strong> {t[results.warning] || results.warning}
                      </div>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="health-card" style={{ background: 'var(--primary-light)', padding: '30px', borderRadius: '24px', margin: '30px 0', border: '1px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', boxShadow: 'var(--shadow-sm)' }}>
                          <ShieldCheck size={28} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: '800', textTransform: 'uppercase' }}>{t.inferredSoilHealth}</div>
                          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary-dark)' }}>{t[results.soilHealth.status] || results.soilHealth.status}</div>
                        </div>
                      </div>
                      <div className="badge-health impact-badge">
                        {t[results.confidenceLevel] || results.confidenceLevel}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-dark)', opacity: 0.8, lineHeight: '1.6' }}>
                      {t[results.soilHealth.notes] || results.soilHealth.notes}
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="modern-card" style={{ padding: '30px' }}>
                    <h4 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><TestTube size={20} /> {t.parameterAnalysis || 'Parameter Analysis'}</h4>
                    <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                      <div className="impact-card" style={{ padding: '15px' }}>
                        <span className="label">{t.soilNitrogen}</span>
                        <span className="value" style={{ color: 'hsl(199, 89%, 48%)' }}>{results.soilAnalysis.nitrogen}</span>
                      </div>
                      <div className="impact-card" style={{ padding: '15px' }}>
                        <span className="label">{t.soilPhosphorus}</span>
                        <span className="value" style={{ color: 'hsl(38, 92%, 50%)' }}>{results.soilAnalysis.phosphorus}</span>
                      </div>
                      <div className="impact-card" style={{ padding: '15px' }}>
                        <span className="label">{t.soilPotassium}</span>
                        <span className="value" style={{ color: 'hsl(280, 60%, 60%)' }}>{results.soilAnalysis.potassium}</span>
                      </div>
                      <div className="impact-card" style={{ padding: '15px' }}>
                        <span className="label">pH</span>
                        <span className="value" style={{ color: 'var(--primary-color)' }}>{results.soilAnalysis.pH}</span>
                      </div>
                    </div>
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
                          <span className="value">₹{rec.impact.fertilizerSavings || rec.impact.costSavings}</span>
                          <span className="label">{t.savings || 'Total Savings'}</span>
                        </div>
                        <div className="impact-card">
                          <div className="icon">📈</div>
                          <span className="value">+{rec.impact.expectedYieldImprovement}%</span>
                          <span className="label">{t.estimatedYieldLabel || 'Yield Boost'}</span>
                        </div>
                        <div className="impact-card">
                          <div className="icon">🌿</div>
                          <span className="value">{rec.matchScore > 80 ? (t.optimal || 'Optimal') : (t.good || 'Good')}</span>
                          <span className="label">{t.soilRecovery || 'Soil Recovery'}</span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '30px', padding: '20px', background: 'var(--light-color)', borderRadius: '16px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><Lightbulb size={18} className="text-primary" /> {t.logicApplied || 'Logic Applied'}</h4>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {rec.reasoning.map((reason, idx) => (
                            <li key={idx} style={{ marginBottom: '8px', fontSize: '15px' }}>{t[reason] || reason}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginTop: '30px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><TrendingUp size={20} /> {t.optimizationPlan}</h4>
                        <div className="npk-visual-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                          {renderProgressBar(rec.npkRequirements.nitrogen.required, rec.npkRequirements.nitrogen.deficit, `${t.soilNitrogen} (N)`, "hsl(199, 89%, 48%)")}
                          {renderProgressBar(rec.npkRequirements.phosphorus.required, rec.npkRequirements.phosphorus.deficit, `${t.soilPhosphorus} (P)`, "hsl(38, 92%, 50%)")}
                          {renderProgressBar(rec.npkRequirements.potassium.required, rec.npkRequirements.potassium.deficit, `${t.soilPotassium} (K)`, "hsl(280, 60%, 60%)")}
                        </div>
                      </div>

                      <div style={{ marginTop: '30px', padding: '25px', background: 'var(--dark-color)', color: 'white', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <h4 style={{ margin: 0 }}>{t.fertilizerSchedule || 'Fertilizer Schedule'}</h4>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-color)' }}>₹{rec.fertilizerPlan.totalCost.toFixed(0)} <small style={{ fontSize: '12px', opacity: 0.6 }}>/ {t.total || 'total'}</small></div>
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
                        {rec.fertilizerPlan.notes && rec.fertilizerPlan.notes.length > 0 && (
                          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
                            <div style={{ fontWeight: '700', marginBottom: '10px', fontSize: '14px' }}>{t.additionalGuidance || 'Additional Guidance'}:</div>
                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', opacity: 0.8 }}>
                              {rec.fertilizerPlan.notes.map((note, idx) => (
                                <li key={idx} style={{ marginBottom: '5px' }}>{t[note] || note}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Labs and Schemes */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                    <div style={{ padding: '25px', background: 'hsl(210, 20%, 96%)', borderRadius: '24px', border: '1px solid var(--primary-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Building2 size={24} className="text-secondary" style={{ color: 'var(--secondary-color)' }} />
                        <h4 style={{ margin: 0 }}>{t.soilLabsTitle}</h4>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '15px' }}>{t.soilLabsDesc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
                        <Phone size={14} /> 1800-180-1551 (Kisan Call)
                      </div>
                    </div>
                    <div style={{ padding: '25px', background: 'hsl(38, 92%, 96%)', borderRadius: '24px', border: '1px solid var(--warning-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Landmark size={24} style={{ color: 'var(--warning-color)' }} />
                        <h4 style={{ margin: 0 }}>{t.schemesTitle}</h4>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '15px' }}>{t.schemesDesc}</p>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--warning-color)' }}>Learn more at pmkisan.gov.in</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!results && !loading && (
                <div className="placeholder" style={{ padding: '100px 20px', textAlign: 'center' }}>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                    <TestTube size={80} style={{ opacity: 0.1, marginBottom: '20px' }} />
                  </motion.div>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{t.enterSoilTestResults}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoilReportAdvisor;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  CircleDollarSign, Lightbulb, CheckCircle, Sprout,
  MapPin, Phone, Building2, Landmark, ShieldCheck, Sparkles, AlertTriangle, TrendingUp,
  Globe, ChevronDown, Menu, X, 
  Leaf, FlaskConical, ScrollText, LineChart, Mic, Home as HomeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import SoilReportAdvisor from './pages/SoilReportAdvisor';
import QuestionnaireAdvisor from './pages/QuestionnaireAdvisor';
import SoilTestingLabs from './pages/SoilTestingLabs';
import GovernmentSchemes from './pages/GovernmentSchemes';
import VoiceAssistant from './pages/VoiceAssistant';
import ProfitAnalysis from './pages/ProfitAnalysis';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import translations from './locales/translations';
import './styles/App.css';

function AppContent() {
  const { language, changeLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = translations[language] || translations['en'];
  const location = useLocation();

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLangOpen && !event.target.closest('.lang-selector-premium')) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper component to sync active nav with URL
  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    
    return (
      <li className={isActive ? 'active' : ''}>
        <Link to={to} onClick={() => setIsMenuOpen(false)}>
          {Icon && <Icon size={18} className="nav-icon" />}
          <span>{children}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className={`app ${isMenuOpen ? 'menu-open' : ''}`}>
      <header className="header-premium">
        <div className="container header-container">
          <div className="logo-section-premium" onClick={() => setIsMenuOpen(false)}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '20px', textDecoration: 'none' }}>
              <div className="logo-glass">
                <Sprout size={32} className="logo-icon-spark" />
                <div className="logo-glow"></div>
              </div>
              <div className="brand-info">
                <h1 className="brand-name">
                  <span className="weight-900">Krishi</span>
                  <span className="weight-300">Saarthi</span>
                </h1>
                <p className="brand-tagline">
                  <Sparkles size={12} /> {t.tagline}
                </p>
              </div>
            </Link>
          </div>

          <div className="header-actions">
            <div className="lang-selector-premium">
              <button 
                className={`lang-trigger-premium ${isLangOpen ? 'open' : ''}`}
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <Globe size={18} className="globe-icon-static" />
                <span>{language === 'en' ? 'English' : (language === 'hi' ? 'हिंदी' : 'ગુજરાતી')}</span>
                <ChevronDown size={14} className={`chevron-icon ${isLangOpen ? 'rotate' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    className="lang-dropdown-menu"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <button 
                      className={`lang-option ${language === 'en' ? 'active' : ''}`}
                      onClick={() => { changeLanguage('en'); setIsLangOpen(false); }}
                    >
                      <span className="lang-text">English</span>
                      {language === 'en' && <div className="active-dot" />}
                    </button>
                    <button 
                      className={`lang-option ${language === 'hi' ? 'active' : ''}`}
                      onClick={() => { changeLanguage('hi'); setIsLangOpen(false); }}
                    >
                      <span className="lang-text">हिंदी</span>
                      {language === 'hi' && <div className="active-dot" />}
                    </button>
                    <button 
                      className={`lang-option ${language === 'gu' ? 'active' : ''}`}
                      onClick={() => { changeLanguage('gu'); setIsLangOpen(false); }}
                    >
                      <span className="lang-text">ગુજરાતી</span>
                      {language === 'gu' && <div className="active-dot" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      <nav className={`navbar-premium ${isMenuOpen ? 'show' : ''}`}>
        <div className="container">
          <ul className="nav-menu-premium">
            <NavLink to="/" icon={HomeIcon}>{t.navHome}</NavLink>
            <NavLink to="/soil-report" icon={FlaskConical}>{t.navSoilReport}</NavLink>
            <NavLink to="/questionnaire" icon={ScrollText}>{t.navQuestionnaire}</NavLink>
            <NavLink to="/soil-labs" icon={MapPin}>{t.navSoilLabs}</NavLink>
            <NavLink to="/schemes" icon={Landmark}>{t.navSchemes}</NavLink>
            <NavLink to="/profit-analysis" icon={LineChart}>Profit Analysis</NavLink>
            <NavLink to="/voice-assistant" icon={Mic}>Voice Assistant</NavLink>
          </ul>
        </div>
      </nav>

      <main className="main-content-premium">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/soil-report" element={<SoilReportAdvisor />} />
          <Route path="/questionnaire" element={<QuestionnaireAdvisor />} />
          <Route path="/soil-labs" element={<SoilTestingLabs />} />
          <Route path="/schemes" element={<GovernmentSchemes />} />
          <Route path="/voice-assistant" element={<VoiceAssistant />} />
          <Route path="/profit-analysis" element={<ProfitAnalysis />} />
        </Routes>
      </main>

      <footer className="footer-premium">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>KrishiSaarthi AI</h3>
              <p>{t.tagline}</p>
            </div>
            <div className="footer-copyright">
              <p>{t.footerCopyright}</p>
              <p className="footer-contact">{t.footerContact}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}

export default App;

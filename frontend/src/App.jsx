import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SoilReportAdvisor from './pages/SoilReportAdvisor';
import QuestionnaireAdvisor from './pages/QuestionnaireAdvisor';
import SoilTestingLabs from './pages/SoilTestingLabs';
import GovernmentSchemes from './pages/GovernmentSchemes';
import './styles/App.css';

function AppContent() {
  const [activeNav, setActiveNav] = useState('home');
  const { language, changeLanguage } = useLanguage();
  const t = translations[language] || translations['en'];

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <div className="logo-section">
              <h1 className="logo">🌾 {t.appTitle}</h1>
              <p className="tagline">{t.tagline}</p>
            </div>
            <div className="language-selector">
              <select 
                className="lang-dropdown"
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                title={t.language}
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="gu">🇮🇳 ગુજરાતી</option>
              </select>
            </div>
          </div>
        </header>

        <nav className="navbar">
          <div className="container">
            <ul className="nav-menu">
              <li>
                <Link to="/" onClick={() => setActiveNav('home')} className={activeNav === 'home' ? 'active' : ''}>
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link to="/soil-report" onClick={() => setActiveNav('soil')} className={activeNav === 'soil' ? 'active' : ''}>
                  {t.navSoilReport}
                </Link>
              </li>
              <li>
                <Link to="/questionnaire" onClick={() => setActiveNav('quest')} className={activeNav === 'quest' ? 'active' : ''}>
                  {t.navQuestionnaire}
                </Link>
              </li>
              <li>
                <Link to="/soil-labs" onClick={() => setActiveNav('labs')} className={activeNav === 'labs' ? 'active' : ''}>
                  {t.navSoilLabs}
                </Link>
              </li>
              <li>
                <Link to="/schemes" onClick={() => setActiveNav('schemes')} className={activeNav === 'schemes' ? 'active' : ''}>
                  {t.navSchemes}
                </Link>
              </li>
              <li>
                <Link to="/voice-assistant" onClick={() => setActiveNav('voice')} className={activeNav === 'voice' ? 'active' : ''}>
                  🎤 Voice Assistant
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/soil-report" element={<SoilReportAdvisor />} />
            <Route path="/questionnaire" element={<QuestionnaireAdvisor />} />
            <Route path="/soil-labs" element={<SoilTestingLabs />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />
            <Route path="/voice-assistant" element={<VoiceAssistant />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>{t.footerCopyright}</p>
            <p>{t.footerContact}</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

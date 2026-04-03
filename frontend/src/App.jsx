import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SoilReportAdvisor from './pages/SoilReportAdvisor';
import QuestionnaireAdvisor from './pages/QuestionnaireAdvisor';
import SoilTestingLabs from './pages/SoilTestingLabs';
import GovernmentSchemes from './pages/GovernmentSchemes';
import VoiceAssistant from './pages/VoiceAssistant';
import './styles/App.css';

function App() {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <div className="logo-section">
              <h1 className="logo">🌾 KrishiSaarthi AI</h1>
              <p className="tagline">Smart Farming Advisor</p>
            </div>
          </div>
        </header>

        <nav className="navbar">
          <div className="container">
            <ul className="nav-menu">
              <li>
                <Link to="/" onClick={() => setActiveNav('home')} className={activeNav === 'home' ? 'active' : ''}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/soil-report" onClick={() => setActiveNav('soil')} className={activeNav === 'soil' ? 'active' : ''}>
                  Soil Report
                </Link>
              </li>
              <li>
                <Link to="/questionnaire" onClick={() => setActiveNav('quest')} className={activeNav === 'quest' ? 'active' : ''}>
                  Questionnaire
                </Link>
              </li>
              <li>
                <Link to="/soil-labs" onClick={() => setActiveNav('labs')} className={activeNav === 'labs' ? 'active' : ''}>
                  Testing Labs
                </Link>
              </li>
              <li>
                <Link to="/schemes" onClick={() => setActiveNav('schemes')} className={activeNav === 'schemes' ? 'active' : ''}>
                  Schemes
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
            <p>&copy; 2024 KrishiSaarthi AI - Empowering Farmers with Smart Solutions</p>
            <p>For more information, contact your local agricultural officer</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

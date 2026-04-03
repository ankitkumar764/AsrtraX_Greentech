import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import '../styles/App.css';

function Home() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>{t.homeWelcome}</h1>
          <p>{t.homeSubtitle}</p>
          <p className="subtitle">{t.homeDescription}</p>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>{t.homeHowItWorks}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>{t.featureTwoInputs}</h3>
              <p>{t.featureTwoInputsDesc}</p>
              <ul>
                <li>{t.featureSoilTest}</li>
                <li>{t.featureQuestionnaire}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{t.featureSmart}</h3>
              <p>{t.featureSmartDesc}</p>
              <ul>
                <li>{t.featureTopCrops}</li>
                <li>{t.featureMatchScore}</li>
                <li>{t.featureTips}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>{t.featureFertilizer}</h3>
              <p>{t.featureFertilizerDesc}</p>
              <ul>
                <li>{t.featureNPK}</li>
                <li>{t.featureFertilizerSchedule}</li>
                <li>{t.featureCostSaving}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>{t.featureSoilTesting}</h3>
              <p>{t.featureSoilTestingDesc}</p>
              <ul>
                <li>{t.featureLabLocations}</li>
                <li>{t.featureTestingCosts}</li>
                <li>{t.featureTestingGuide}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📜</div>
              <h3>{t.featureSchemes}</h3>
              <p>{t.featureSchemesDesc}</p>
              <ul>
                <li>{t.featureCropInsurance}</li>
                <li>{t.featureDirectIncome}</li>
                <li>{t.featureSubsidy}</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>{t.featureBudget}</h3>
              <p>{t.featureBudgetDesc}</p>
              <ul>
                <li>{t.featureCostEffective}</li>
                <li>{t.featureSeasonalPricing}</li>
                <li>{t.featureSubsidyInfo}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>{t.homeGetStarted}</h2>
          <p>{t.homeChooseMethod}</p>
          <div className="cta-buttons">
            <a href="/soil-report" className="btn btn-primary">
              {t.homeUseSoilReport}
            </a>
            <a href="/questionnaire" className="btn btn-secondary">
              {t.homeAnswerQuestionnaire}
            </a>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <h2>{t.whyChoose}</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>{t.easyToUse}</h3>
              <p>{t.easyToUseDesc}</p>
            </div>
            <div className="info-item">
              <h3>{t.dataDriven}</h3>
              <p>{t.dataDrivenDesc}</p>
            </div>
            <div className="info-item">
              <h3>{t.costEffective}</h3>
              <p>{t.costEffectiveDesc}</p>
            </div>
            <div className="info-item">
              <h3>{t.personalized}</h3>
              <p>{t.personalizedDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

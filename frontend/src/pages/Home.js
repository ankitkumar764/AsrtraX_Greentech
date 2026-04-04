import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import { Sprout, BarChart3, Droplets, FlaskConical, ScrollText, Wallet, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import '../styles/App.css';

function Home() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  return (
    <div className="home-page">
      <section className="hero-premium" style={{ 
        padding: '100px 0', 
        background: 'linear-gradient(135deg, var(--dark-color) 0%, var(--primary-dark) 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(var(--primary-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '40px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles size={18} className="text-primary" style={{ color: 'var(--primary-color)' }} />
            <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.agriculturalIntelligence}</span>
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', color: 'white' }}>{t.homeWelcome}</h1>
          <p style={{ fontSize: '1.5rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto 40px auto', fontWeight: '400' }}>{t.homeDescription}</p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/soil-report" className="btn btn-premium btn-large">
              {t.homeUseSoilReport} <ArrowRight size={24} />
            </a>
            <a href="/questionnaire" className="btn btn-secondary btn-large">
              {t.homeAnswerQuestionnaire}
            </a>
          </div>
        </div>
      </section>

      <section className="features-premium" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--dark-color)' }}>{t.homeHowItWorks}</h2>
            <div style={{ width: '80px', height: '6px', background: 'var(--primary-color)', margin: '20px auto', borderRadius: '3px' }}></div>
          </div>
          
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {/* Feature 1 */}
            <div className="feature-card-premium" style={{ background: 'white', padding: '40px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--primary-light)', transition: 'var(--transition)' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: 'var(--primary-color)' }}>
                <FlaskConical size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{t.featureTwoInputs}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{t.featureTwoInputsDesc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}><CheckCircle2 size={16} color="var(--primary-color)" /> {t.featureSoilTest}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}><CheckCircle2 size={16} color="var(--primary-color)" /> {t.featureQuestionnaire}</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card-premium" style={{ background: 'white', padding: '40px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--primary-light)' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'hsl(199, 89%, 92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: 'var(--secondary-color)' }}>
                <BarChart3 size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{t.featureSmart}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{t.featureSmartDesc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}><CheckCircle2 size={16} color="var(--secondary-color)" /> {t.featureTopCrops}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}><CheckCircle2 size={16} color="var(--secondary-color)" /> {t.featureMatchScore}</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card-premium" style={{ background: 'white', padding: '40px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--primary-light)' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'hsl(38, 92%, 92%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: 'var(--accent-color)' }}>
                <Wallet size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{t.featureFertilizer}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{t.featureFertilizerDesc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}><CheckCircle2 size={16} color="var(--accent-color)" /> {t.featureNPK}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}><CheckCircle2 size={16} color="var(--accent-color)" /> {t.featureCostSaving}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-premium" style={{ backgroundColor: '#0f172a', padding: '100px 0', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white' }}>{t.seeAction}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
              {t.demoLogicDesc}
            </p>
          </div>

          <div style={{ 
            maxWidth: '1100px', 
            margin: '0 auto', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '32px', 
            overflow: 'hidden', 
            display: 'flex',
            flexWrap: 'wrap',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)'
          }}>
            {/* Input Side */}
            <div style={{ flex: '1', padding: '60px', borderRight: '1px solid rgba(255,255,255,0.1)', minWidth: '350px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <div style={{ background: 'var(--secondary-color)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>1</div>
                <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{t.farmScenario}</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '2rem' }}>🏜️</div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.soilType}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{t.sandy}</div>
                  </div>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '2rem' }}>💧</div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.waterAvailability}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'hsl(0, 72%, 71%)' }}>{t.lowRainfed}</div>
                  </div>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '2rem' }}>🍚</div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.previousCrop}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{t.rice}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Side */}
            <div style={{ flex: '1.3', padding: '60px', minWidth: '350px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: 'var(--primary-color)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>2</div>
                  <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{t.logicResult}</h3>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '8px 20px', borderRadius: '40px', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', fontWeight: '800' }}>
                  {t.matchLabel}: 96%
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ fontSize: '4rem' }}>🌾</div>
                  <div>
                    <h4 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-color)', margin: 0 }}>{t.cropBajra}</h4>
                    <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '5px 0 0 0' }}>{t.REASON_ROBUST_CHOICE}</p>
                  </div>
                </div>
              </div>

              <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '20px', border: '1px solid rgba(34, 197, 94, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#4ade80' }}>₹1,500</div>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>{t.savings}</div>
                </div>
                <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#60a5fa' }}>+20%</div>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>{t.estimatedYieldLabel}</div>
                </div>
              </div>

              <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.2)', display: 'flex', gap: '15px' }}>
                <ShieldCheck size={24} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#fbbf24', lineHeight: '1.5' }}>
                  <strong>{t.agriculturalIntelligence}:</strong> {t.OPTIMIZE_BAJRA}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-final" style={{ padding: '120px 0', textAlign: 'center', background: 'var(--primary-light)' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--dark-color)', marginBottom: '20px' }}>{t.homeGetStarted}</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginBottom: '50px' }}>{t.homeChooseMethod}</p>
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/soil-report" className="btn btn-premium btn-large" style={{ minWidth: '300px' }}>
              <FlaskConical /> {t.homeUseSoilReport}
            </a>
            <a href="/questionnaire" className="btn btn-dark btn-large" style={{ minWidth: '300px', backgroundColor: 'var(--dark-color)' }}>
              <ScrollText /> {t.homeAnswerQuestionnaire}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

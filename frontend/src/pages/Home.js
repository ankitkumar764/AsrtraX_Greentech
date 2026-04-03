import React from 'react';
import '../styles/App.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to KrishiSaarthi AI</h1>
          <p>Your Smart Farming Advisor</p>
          <p className="subtitle">Get expert crop and fertilizer recommendations tailored to your farm</p>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>How it works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Two Input Methods</h3>
              <p>Choose between detailed soil reports or simple questionnaire</p>
              <ul>
                <li>Soil Test Report: Upload your NPK, pH values</li>
                <li>Questionnaire: Answer simple questions about your farm</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Recommendations</h3>
              <p>Get personalized crop suggestions</p>
              <ul>
                <li>Top 2-3 suitable crops for your farm</li>
                <li>Detailed matchscore and reasoning</li>
                <li>Practical growing tips</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Fertilizer Planning</h3>
              <p>Optimize your fertilizer usage</p>
              <ul>
                <li>NPK requirement calculation</li>
                <li>Detailed fertilizer schedule</li>
                <li>Cost-saving suggestions</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Soil Testing Support</h3>
              <p>Find nearby soil testing labs</p>
              <ul>
                <li>Lab locations and contact info</li>
                <li>Testing costs and turnaround time</li>
                <li>Complete testing guide</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📜</div>
              <h3>Government Schemes</h3>
              <p>Explore available benefits</p>
              <ul>
                <li>Crop insurance information</li>
                <li>Direct income support schemes</li>
                <li>Subsidy details</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Budget Friendly</h3>
              <p>Optimize your farming costs</p>
              <ul>
                <li>Cost-effective fertilizer choices</li>
                <li>Seasonal pricing</li>
                <li>Subsidy information</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Get Started Today</h2>
          <p>Choose your preferred method to receive smart farming recommendations</p>
          <div className="cta-buttons">
            <a href="/soil-report" className="btn btn-primary">
              📊 Use Soil Report
            </a>
            <a href="/questionnaire" className="btn btn-secondary">
              ❓ Answer Questionnaire
            </a>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <h2>Why Choose KrishiSaarthi?</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Easy to Use</h3>
              <p>Simple interface designed for all farmers, no technical knowledge needed</p>
            </div>
            <div className="info-item">
              <h3>Data-Driven</h3>
              <p>Recommendations based on crop science and proven agricultural practices</p>
            </div>
            <div className="info-item">
              <h3>Cost-Effective</h3>
              <p>Maximize yield while minimizing input costs through smart planning</p>
            </div>
            <div className="info-item">
              <h3>Personalized</h3>
              <p>Recommendations tailored to your specific farm conditions and budget</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

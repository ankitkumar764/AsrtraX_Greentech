import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import '../styles/Utilities.css';

function SoilTestingLabs() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [selectedState, setSelectedState] = useState('');
  const [labs, setLabs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const states = ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Punjab', 'Haryana', 'Gujarat', 'Madhya Pradesh', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh', 'West Bengal'];

  const handleStateChange = async (state) => {
    setSelectedState(state);
    setLoading(true);
    setError(null);

    try {
      const stateParam = state.toLowerCase().replace(/\s+/g, '_');
      const response = await api.get(`/soil-labs/${stateParam}`);
      setLabs(response.data.data || []);
    } catch (err) {
      setError(language === 'en' ? 'Failed to fetch soil testing labs' : 'मिट्टी परीक्षण लैब लाने में विफल');
      setLabs(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="utility-page">
      <div className="container">
        <div className="page-header">
          <h1>{t.soilLabsTitle}</h1>
          <p>{t.soilLabsDesc}</p>
        </div>

        <div className="state-selector">
          <h3>{t.selectState}</h3>
          <div className="button-group">
            {states.map(state => (
              <button
                key={state}
                className={`state-btn ${selectedState === state ? 'active' : ''}`}
                onClick={() => handleStateChange(state)}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        <div className="results">
          {loading && <p className="loading">{t.loadingLabs}</p>}

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {labs && labs.length > 0 && (
            <div className="labs-grid">
              {labs.map(lab => (
                <div key={lab.id} className="lab-card">
                  <h3>{lab.name}</h3>
                  <div className="lab-info">
                    <p><strong>{t.labLocation}:</strong> {lab.location}</p>
                    <p><strong>{t.labAddress}:</strong> {lab.address}</p>
                    <p><strong>{t.labPhone}:</strong> {lab.phone}</p>
                    <p><strong>{t.labEmail}:</strong> {lab.email}</p>
                    <p><strong>{t.labDistance}:</strong> {lab.distance} {t.km}</p>
                    <p><strong>{t.labTestCost}:</strong> ₹{lab.testCost}</p>
                    <p><strong>{t.labTurnaround}:</strong> {lab.turnaround}</p>
                  </div>
                  <a href={`tel:${lab.phone}`} className="btn btn-small">{t.callLab}</a>
                </div>
              ))}
            </div>
          )}

          {labs && labs.length === 0 && !loading && (
            <p className="no-results">{t.noLabs}</p>
          )}

          {!selectedState && !error && (
            <div className="placeholder">
              <p>{t.selectStateText}</p>
            </div>
          )}
        </div>

        <div className="info-section">
          <h2>📋 {t.soilTestingGuide}</h2>
          <div className="guide-grid">
            <div className="guide-item">
              <h4>{t.collectSoilSamples}</h4>
              <ol>
                <li>{t.chooseRepresentativeArea}</li>
                <li>{t.takeSoilFrom}</li>
                <li>{t.mixSamplesThoroughly}</li>
                <li>{t.collectMixedSample}</li>
                <li>{t.allowToDry}</li>
              </ol>
            </div>

            <div className="guide-item">
              <h4>{t.whatIsTested}</h4>
              <ul>
                <li><strong>NPK:</strong> {t.nitrogenPhosphorusLevels}</li>
                <li><strong>pH:</strong> {t.soilAcidityPH}</li>
                <li><strong>{t.organicMatter}:</strong> {t.soilFertilityStatus}</li>
                <li><strong>{t.micronutrients}:</strong> Zinc, Iron, Manganese, etc.</li>
                <li><strong>{t.texture}:</strong> {t.sandSiltComposition}</li>
              </ul>
            </div>

            <div className="guide-item">
              <h4>{t.benefitsOfTesting}</h4>
              <ul>
                <li>{t.preciseFertilizerRecs}</li>
                <li>{t.costSavingsFertilizers}</li>
                <li>{t.improvedCropYield}</li>
                <li>{t.betterSoilHealth}</li>
                <li>{t.preventNutrientDeficiencies}</li>
              </ul>
            </div>

            <div className="guide-item">
              <h4>{t.frequencyOfTesting}</h4>
              <ul>
                <li><strong>{t.newFarms}:</strong> {t.every2YearsInitially}</li>
                <li><strong>{t.establishedFarms}:</strong> {t.every3Years}</li>
                <li><strong>{t.problemAreas}:</strong> {t.annually}</li>
                <li><strong>{t.organicFarms}:</strong> {t.every2Years}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoilTestingLabs;

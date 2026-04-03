import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Utilities.css';

function SoilTestingLabs() {
  const [selectedState, setSelectedState] = useState('');
  const [labs, setLabs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const states = ['Maharashtra', 'Uttar Pradesh', 'Karnataka'];

  const handleStateChange = async (state) => {
    setSelectedState(state);
    setLoading(true);
    setError(null);

    try {
      const stateParam = state.toLowerCase().replace(/\s+/g, '_');
      const response = await api.get(`/soil-labs/${stateParam}`);
      setLabs(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch soil testing labs');
      setLabs(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="utility-page">
      <div className="container">
        <div className="page-header">
          <h1>🔬 Soil Testing Labs</h1>
          <p>Find nearby soil testing labs for detailed soil analysis</p>
        </div>

        <div className="state-selector">
          <h3>Select Your State:</h3>
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
          {loading && <p className="loading">Loading labs...</p>}

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {labs && labs.length > 0 && (
            <div className="labs-grid">
              {labs.map(lab => (
                <div key={lab.id} className="lab-card">
                  <h3>{lab.name}</h3>
                  <div className="lab-info">
                    <p><strong>📍 Location:</strong> {lab.location}</p>
                    <p><strong>🏢 Address:</strong> {lab.address}</p>
                    <p><strong>📞 Phone:</strong> {lab.phone}</p>
                    <p><strong>📧 Email:</strong> {lab.email}</p>
                    <p><strong>📏 Distance:</strong> {lab.distance} km</p>
                    <p><strong>💰 Test Cost:</strong> ₹{lab.testCost}</p>
                    <p><strong>⏱️ Turnaround Time:</strong> {lab.turnaround}</p>
                  </div>
                  <a href={`tel:${lab.phone}`} className="btn btn-small">Call Lab</a>
                </div>
              ))}
            </div>
          )}

          {labs && labs.length === 0 && !loading && (
            <p className="no-results">No labs found for this state</p>
          )}

          {!selectedState && !error && (
            <div className="placeholder">
              <p>Select a state to view available soil testing labs</p>
            </div>
          )}
        </div>

        <div className="info-section">
          <h2>📋 Soil Testing Guide</h2>
          <div className="guide-grid">
            <div className="guide-item">
              <h4>How to Collect Soil Samples?</h4>
              <ol>
                <li>Choose a representative area of your field</li>
                <li>Take soil from 6-8 spots at 0-15 cm depth (6 inches)</li>
                <li>Mix samples thoroughly in a clean container</li>
                <li>Collect 500g-1kg of the mixed sample</li>
                <li>Allow to dry in shade before sending</li>
              </ol>
            </div>

            <div className="guide-item">
              <h4>What is Tested?</h4>
              <ul>
                <li><strong>NPK:</strong> Nitrogen, Phosphorus, Potassium levels</li>
                <li><strong>pH:</strong> Soil acidity/alkalinity</li>
                <li><strong>Organic Matter:</strong> Soil fertility status</li>
                <li><strong>Micronutrients:</strong> Zinc, Iron, Manganese, etc.</li>
                <li><strong>Texture:</strong> Sand, silt, clay composition</li>
              </ul>
            </div>

            <div className="guide-item">
              <h4>Benefits of Soil Testing</h4>
              <ul>
                <li>Precise fertilizer recommendations</li>
                <li>Cost savings on fertilizers</li>
                <li>Improved crop yield</li>
                <li>Better soil health management</li>
                <li>Prevent nutrient deficiencies</li>
              </ul>
            </div>

            <div className="guide-item">
              <h4>Frequency of Testing</h4>
              <ul>
                <li><strong>New farms:</strong> Every 2 years initially</li>
                <li><strong>Established farms:</strong> Every 3 years</li>
                <li><strong>Problem areas:</strong> Annually</li>
                <li><strong>Organic farms:</strong> Every 2 years</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoilTestingLabs;

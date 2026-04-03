import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Utilities.css';

function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'All',
    'Insurance',
    'Irrigation',
    'Testing',
    'Marketing',
    'Organic Farming',
    'Income Support'
  ];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/schemes/list');
      setSchemes(response.data.data || []);
      setFilteredSchemes(response.data.data || []);
    } catch (err) {
      console.error('Error fetching schemes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredSchemes(schemes);
    } else {
      setFilteredSchemes(schemes.filter(s => s.category === category));
    }
  };

  return (
    <div className="utility-page">
      <div className="container">
        <div className="page-header">
          <h1>📜 Government Schemes</h1>
          <p>Explore available schemes and benefits for farmers</p>
        </div>

        <div className="filter-section">
          <h3>Filter by Category:</h3>
          <div className="button-group">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${(selectedCategory === '' && category === 'All') || selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="results">
          {loading && <p className="loading">Loading schemes...</p>}

          {filteredSchemes.length > 0 && (
            <div className="schemes-grid">
              {filteredSchemes.map(scheme => (
                <div key={scheme.id} className="scheme-card">
                  <div className="scheme-badge">{scheme.category}</div>
                  <h3>{scheme.name}</h3>
                  <p className="description">{scheme.description}</p>

                  <div className="scheme-details">
                    <div className="detail-item">
                      <span className="label">Eligibility:</span>
                      <span className="value">{scheme.eligibility}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Premium/Cost:</span>
                      <span className="value">{scheme.premium}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Benefits:</span>
                      <span className="value">{scheme.benefits}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status:</span>
                      <span className="value">{scheme.state}</span>
                    </div>
                  </div>

                  {scheme.link && scheme.link !== '#' && (
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="btn btn-small">
                      Learn More
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {filteredSchemes.length === 0 && !loading && (
            <p className="no-results">No schemes found for this category</p>
          )}
        </div>

        <div className="info-section">
          <h2>Important Government Agricultural Schemes</h2>
          <div className="schemes-info">
            <div className="info-box">
              <h4>🛡️ PM Fasal Bima Yojana</h4>
              <p>
                One of India's most important crop insurance schemes that provides
                comprehensive coverage against crop losses due to natural disasters,
                pest attacks, and diseases. Participation is voluntary for individual
                farmers and mandatory for farm loan beneficiaries.
              </p>
            </div>

            <div className="info-box">
              <h4>💰 Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)</h4>
              <p>
                Provides direct income support of ₹6,000 per year to all farmers with
                cultivable land holdings. Payment is made in three equal installments
                of ₹2,000. This ensures financial stability for farming families.
              </p>
            </div>

            <div className="info-box">
              <h4>🌱 Soil Health Card Scheme</h4>
              <p>
                Offers free soil testing and provides health cards with recommendations
                for crop and nutrient management. Getting a soil health card is the
                first step towards scientific farming and better productivity.
              </p>
            </div>

            <div className="info-box">
              <h4>💧 Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)</h4>
              <p>
                Focuses on irrigation infrastructure development with subsidies up to
                55%. Helps farmers adopt water-saving techniques like drip and sprinkler
                irrigation for sustainable agriculture.
              </p>
            </div>

            <div className="info-box">
              <h4>📈 National Agriculture Market (eNAM)</h4>
              <p>
                An online trading platform that connects farmers with traders, eliminating
                middlemen and ensuring better prices. Farmers can sell their produce
                directly to buyers across states.
              </p>
            </div>

            <div className="info-box">
              <h4>🌿 Paramparagat Krishi Vikas Yojana</h4>
              <p>
                Promotes organic farming with subsidies of ₹50,000 per hectare for 3 years.
                Includes certification support and helps access premium markets for
                organic produce.
              </p>
            </div>
          </div>
        </div>

        <div className="action-section">
          <h2>How to Apply?</h2>
          <ol>
            <li>Check your eligibility for each scheme on the official website</li>
            <li>Visit your nearest agriculture office or bank</li>
            <li>Submit required documents (Aadhaar, land records, etc.)</li>
            <li>Complete the application process</li>
            <li>Keep tracking and collect benefits as per schedule</li>
          </ol>
          <p><strong>💡 Tip:</strong> Contact your local Gram Panchayat or Agriculture Department for guidance on scheme selection and application</p>
        </div>
      </div>
    </div>
  );
}

export default GovernmentSchemes;

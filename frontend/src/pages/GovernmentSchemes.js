import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import '../styles/Utilities.css';

function GovernmentSchemes() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [schemes, setSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: get localized field (handles both string and {en,hi,gu} object)
  const L = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field['en'] || '';
  };

  const categories = [
    { en: 'All',            hi: 'सभी',         gu: 'બધું'      },
    { en: 'Insurance',      hi: 'बीमा',         gu: 'વીમો'       },
    { en: 'Irrigation',     hi: 'सिंचाई',       gu: 'સિંચાઈ'    },
    { en: 'Testing',        hi: 'परीक्षण',      gu: 'પરીक્ષण'   },
    { en: 'Marketing',      hi: 'विपणन',        gu: 'વેચાણ'     },
    { en: 'Organic Farming',hi: 'जैव खेती',    gu: 'જૈવ ખetI'  },
    { en: 'Income Support', hi: 'आय समर्थन',   gu: 'આवak sahay'}
  ];

  const premiumLabel = {
    en: 'Premium/Cost',
    hi: 'प्रीमियम/लागत',
    gu: 'પ્રીમियम/ખર્ч'
  };

  const benefitsLabel = {
    en: 'Benefits',
    hi: 'लाभ',
    gu: 'ลाभ'
  };

  const statusLabel = {
    en: 'Status',
    hi: 'स्थिति',
    gu: 'સ્થिति'
  };

  const learnMoreLabel = {
    en: 'Learn More',
    hi: 'और जानें',
    gu: 'વdhudhu jANo'
  };

  const howToApplyLabel = {
    en: 'How to Apply?',
    hi: 'कैसे आवेदन करें?',
    gu: 'Kevi rIte aavedan karvu?'
  };

  const importantSchemesLabel = {
    en: 'Important Government Agricultural Schemes',
    hi: 'महत्वपूर्ण सरकारी कृषि योजनाएं',
    gu: 'Mahatvapurna sarkari krushi yojanaon'
  };

  const applySteps = {
    en: [
      'Check your eligibility for each scheme on the official website',
      'Visit your nearest agriculture office or bank',
      'Submit required documents (Aadhaar, land records, etc.)',
      'Complete the application process',
      'Keep tracking and collect benefits as per schedule'
    ],
    hi: [
      'आधिकारिक वेबसाइट पर प्रत्येक योजना की पात्रता जांचें',
      'अपने निकटतम कृषि कार्यालय या बैंक जाएं',
      'आवश्यक दस्तावेज जमा करें (आधार, भूमि रिकॉर्ड, आदि)',
      'आवेदन प्रक्रिया पूरी करें',
      'ट्रैकिंग रखें और कार्यक्रम के अनुसार लाभ प्राप्त करें'
    ],
    gu: [
      'Adhikrit website par darak yojnani patrata tapaso',
      'Tamara najIkna krushi karyalay ya bank ja',
      'JarUri dastaAvejo submit karo (Aadhaar, jamin records, etc.)',
      'Avedan prakriya purni karo',
      'Tracking rakho ane suchit rIte labh meLavo'
    ]
  };

  const tipLabel = { en: 'Tip', hi: 'सुझाव', gu: 'Suchna' };
  const tipText = {
    en: 'Contact your local Gram Panchayat or Agriculture Department for guidance on scheme selection and application',
    hi: 'योजना चयन और आवेदन पर मार्गदर्शन के लिए अपने स्थानीय ग्राम पंचायत या कृषि विभाग से संपर्क करें',
    gu: 'Yojna pasand ane avedan angena margdarshan mAtE tamari sthanik gram panchayat ya krushi vibhagno samparka karo'
  };

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
    setSelectedCategory(category.en);
    if (category.en === 'All') {
      setFilteredSchemes(schemes);
    } else {
      setFilteredSchemes(schemes.filter(s => s.category === category.en));
    }
  };

  return (
    <div className="utility-page">
      <div className="container">
        <div className="page-header">
          <h1>{t.schemesTitle}</h1>
          <p>{t.schemesDesc}</p>
        </div>

        <div className="filter-section">
          <h3>{t.filterCategory}</h3>
          <div className="button-group">
            {categories.map(cat => (
              <button
                key={cat.en}
                className={`filter-btn ${(selectedCategory === '' && cat.en === 'All') || selectedCategory === cat.en ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(cat)}
              >
                {cat[language] || cat.en}
              </button>
            ))}
          </div>
        </div>

        <div className="results">
          {loading && <p className="loading">{t.loadingSchemes}</p>}

          {filteredSchemes.length > 0 && (
            <div className="schemes-grid">
              {filteredSchemes.map(scheme => (
                <div key={scheme.id} className="scheme-card">
                  {/* Category badge - translated */}
                  <div className="scheme-badge">
                    {typeof scheme.categoryLabel === 'object'
                      ? (scheme.categoryLabel[language] || scheme.categoryLabel.en)
                      : scheme.category}
                  </div>

                  {/* Scheme name - translated */}
                  <h3>{L(scheme.name)}</h3>

                  {/* Description - translated */}
                  <p className="description">{L(scheme.description)}</p>

                  <div className="scheme-details">
                    <div className="detail-item">
                      <span className="label">{t.schemeEligibility}:</span>
                      <span className="value">{L(scheme.eligibility)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{premiumLabel[language] || premiumLabel.en}:</span>
                      <span className="value">{L(scheme.premium)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{benefitsLabel[language] || benefitsLabel.en}:</span>
                      <span className="value">{L(scheme.benefits)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{statusLabel[language] || statusLabel.en}:</span>
                      <span className="value">{L(scheme.state)}</span>
                    </div>
                  </div>

                  {scheme.link && scheme.link !== '#' && (
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="btn btn-small">
                      {learnMoreLabel[language] || learnMoreLabel.en}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {filteredSchemes.length === 0 && !loading && (
            <p className="no-results">{t.nativities} {t.filler}</p>
          )}
        </div>

        {/* How to Apply Section */}
        <div className="action-section">
          <h2>{howToApplyLabel[language] || howToApplyLabel.en}</h2>
          <ol>
            {(applySteps[language] || applySteps.en).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <p>
            <strong>💡 {tipLabel[language] || tipLabel.en}:</strong>{' '}
            {tipText[language] || tipText.en}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GovernmentSchemes;

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

  const categories = [
    { en: 'All', hi: 'सभी' },
    { en: 'Insurance', hi: 'बीमा' },
    { en: 'Irrigation', hi: 'सिंचाई' },
    { en: 'Testing', hi: 'परीक्षण' },
    { en: 'Marketing', hi: 'विपणन' },
    { en: 'Organic Farming', hi: 'जैव खेती' },
    { en: 'Income Support', hi: 'आय समर्थन' }
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
    const categoryValue = category.en;
    setSelectedCategory(categoryValue);
    if (categoryValue === 'All') {
      setFilteredSchemes(schemes);
    } else {
      setFilteredSchemes(schemes.filter(s => s.category === categoryValue));
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
                {language === 'en' ? cat.en : cat.hi}
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
                  <div className="scheme-badge">{scheme.category}</div>
                  <h3>{scheme.name}</h3>
                  <p className="description">{scheme.description}</p>

                  <div className="scheme-details">
                    <div className="detail-item">
                      <span className="label">{t.schemeEligibility}:</span>
                      <span className="value">{scheme.eligibility}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{language === 'en' ? 'Premium/Cost' : 'प्रीमियम/लागत'}:</span>
                      <span className="value">{scheme.premium}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{language === 'en' ? 'Benefits' : 'लाभ'}:</span>
                      <span className="value">{scheme.benefits}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">{language === 'en' ? 'Status' : 'स्थिति'}:</span>
                      <span className="value">{scheme.state}</span>
                    </div>
                  </div>

                  {scheme.link && scheme.link !== '#' && (
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="btn btn-small">
                      {language === 'en' ? 'Learn More' : 'और जानें'}
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

        <div className="info-section">
          <h2>{language === 'en' ? 'Important Government Agricultural Schemes' : 'महत्वपूर्ण सरकारी कृषि योजनाएं'}</h2>
          <div className="schemes-info">
            <div className="info-box">
              <h4>🛡️ {language === 'en' ? 'PM Fasal Bima Yojana' : 'पीएम फसल बीमा योजना'}</h4>
              <p>
                {language === 'en' 
                  ? 'One of India\'s most important crop insurance schemes that provides comprehensive coverage against crop losses due to natural disasters, pest attacks, and diseases. Participation is voluntary for individual farmers and mandatory for farm loan beneficiaries.'
                  : 'भारत की सबसे महत्वपूर्ण फसल बीमा योजनाओं में से एक जो प्राकृतिक आपदाओं, कीट आक्रमण और बीमारियों के कारण फसल के नुकसान के खिलाफ व्यापक कवरेज प्रदान करती है। व्यक्तिगत किसानों के लिए भागीदारी स्वैच्छिक है और खेत ऋण प्राप्तकर्ताओं के लिए अनिवार्य है।'
                }
              </p>
            </div>

            <div className="info-box">
              <h4>💰 {language === 'en' ? 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)' : 'प्रधान मंत्री किसान सम्मान निधि (PM-KISAN)'}</h4>
              <p>
                {language === 'en'
                  ? 'Provides direct income support of ₹6,000 per year to all farmers with cultivable land holdings. Payment is made in three equal installments of ₹2,000. This ensures financial stability for farming families.'
                  : 'कृषि योग्य भूमि वाले सभी किसानों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता प्रदान करता है। भुगतान ₹2,000 की तीन समान किस्तों में किया जाता है। यह कृषि परिवारों के लिए वित्तीय स्थिरता सुनिश्चित करता है।'
                }
              </p>
            </div>

            <div className="info-box">
              <h4>🌱 {language === 'en' ? 'Soil Health Card Scheme' : 'मिट्टी स्वास्थ्य कार्ड योजना'}</h4>
              <p>
                {language === 'en'
                  ? 'Offers free soil testing and provides health cards with recommendations for crop and nutrient management. Getting a soil health card is the first step towards scientific farming and better productivity.'
                  : 'मुफ्त मिट्टी परीक्षण प्रदान करता है और फसल और पोषक तत्व प्रबंधन के लिए सिफारिशों के साथ स्वास्थ्य कार्ड प्रदान करता है। मिट्टी स्वास्थ्य कार्ड प्राप्त करना वैज्ञानिक खेती की ओर पहला कदम है।'
                }
              </p>
            </div>

            <div className="info-box">
              <h4>💧 {language === 'en' ? 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)' : 'प्रधान मंत्री कृषि सिंचाई योजना (PMKSY)'}</h4>
              <p>
                {language === 'en'
                  ? 'Focuses on irrigation infrastructure development with subsidies up to 55%. Helps farmers adopt water-saving techniques like drip and sprinkler irrigation for sustainable agriculture.'
                  : '55% तक सब्सिडी के साथ सिंचाई बुनियादी ढांचे के विकास पर केंद्रित है। किसानों को बूंद-बूंद सिंचाई और स्प्रिंकलर सिंचाई जैसी जल-बचत तकनीकों को अपनाने में मदद करता है।'
                }
              </p>
            </div>

            <div className="info-box">
              <h4>📈 {language === 'en' ? 'National Agriculture Market (eNAM)' : 'राष्ट्रीय कृषि बाजार (eNAM)'}</h4>
              <p>
                {language === 'en'
                  ? 'An online trading platform that connects farmers with traders, eliminating middlemen and ensuring better prices. Farmers can sell their produce directly to buyers across states.'
                  : 'एक ऑनलाइन ट्रेडिंग प्लेटफॉर्म जो किसानों को व्यापारियों से जोड़ता है, बिचौलियों को समाप्त करता है और बेहतर कीमत सुनिश्चित करता है। किसान राज्यों में सीधे खरीदारों को अपनी उपज बेच सकते हैं।'
                }
              </p>
            </div>

            <div className="info-box">
              <h4>🌿 {language === 'en' ? 'Paramparagat Krishi Vikas Yojana' : 'परंपरागत कृषि विकास योजना'}</h4>
              <p>
                {language === 'en'
                  ? 'Promotes organic farming with subsidies of ₹50,000 per hectare for 3 years. Includes certification support and helps access premium markets for organic produce.'
                  : '3 साल के लिए 1 हेक्टेयर के लिए ₹50,000 की सब्सिडी के साथ जैविक खेती को बढ़ावा देता है। प्रमाणन समर्थन शामिल है और जैविक उपज के प्रीमियम बाजारों तक पहुंचने में मदद करता है।'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="action-section">
          <h2>{language === 'en' ? 'How to Apply?' : 'कैसे आवेदन करें?'}</h2>
          <ol>
            <li>{language === 'en' ? 'Check your eligibility for each scheme on the official website' : 'आधिकारिक वेबसाइट पर प्रत्येक योजना के लिए अपनी पात्रता जांचें'}</li>
            <li>{language === 'en' ? 'Visit your nearest agriculture office or bank' : 'अपने निकटतम कृषि कार्यालय या बैंक जाएं'}</li>
            <li>{language === 'en' ? 'Submit required documents (Aadhaar, land records, etc.)' : 'आवश्यक दस्तावेज जमा करें (आधार, भूमि रिकॉर्ड, आदि)'}</li>
            <li>{language === 'en' ? 'Complete the application process' : 'आवेदन प्रक्रिया पूरी करें'}</li>
            <li>{language === 'en' ? 'Keep tracking and collect benefits as per schedule' : 'ट्रैकिंग रखें और कार्यक्रम के अनुसार लाभ प्राप्त करें'}</li>
          </ol>
          <p><strong>💡 {language === 'en' ? 'Tip' : 'सुझाव'}:</strong> {language === 'en' ? 'Contact your local Gram Panchayat or Agriculture Department for guidance on scheme selection and application' : 'योजना चयन और आवेदन पर मार्गदर्शन के लिए अपने स्थानीय ग्राम पंचायत या कृषि विभाग से संपर्क करें'}</p>
        </div>
      </div>
    </div>
  );
}

export default GovernmentSchemes;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../locales/translations';
import api from '../services/api';
import { 
  User, 
  History as HistoryIcon, 
  Calendar, 
  FileText, 
  ChevronRight, 
  LogOut,
  MapPin,
  TrendingUp,
  FlaskConical,
  CheckCircle2,
  X,
  Info,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';
import '../styles/Utilities.css';

function Profile() {
  const { user, logout, isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/soil/history');
      setHistory(response.data.data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load your farming history.');
    } finally {
      setLoading(false);
    }
  };

  const closeReportModal = () => setSelectedReport(null);

  if (!isLoggedIn) {
    return (
      <div className="profile-container guest-view">
        <div className="auth-card-mini">
          <User size={64} className="guest-icon" />
          <h2>Welcome, Farmer!</h2>
          <p>Login to save your soil reports, track crop history, and get personalized financial analysis.</p>
          <a href="/auth" className="btn btn-primary">Login / Register</a>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <header className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-user-info">
          <div className="profile-avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-text">
            <h1>{user.name}</h1>
            <p className="user-email">{user.email}</p>
            <div className="user-badges">
              <span className="badge-premium"><TrendingUp size={14} /> Smart Farmer</span>
              <span className="badge-location"><MapPin size={14} /> {user.state || 'India'}</span>
            </div>
          </div>
          <button onClick={logout} className="btn-logout-alt">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="profile-content">
        <div className="history-section">
          <div className="section-title">
            <HistoryIcon size={24} />
            <h2>Your Agricultural History</h2>
          </div>

          {loading ? (
            <div className="history-loading">
              <div className="spinner"></div>
              <p>Loading your farm records...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : history.length === 0 ? (
            <div className="empty-history">
              <FileText size={48} />
              <h3>No Reports Found</h3>
              <p>You haven't saved any soil reports yet. Start by analyzing your soil!</p>
              <a href="/soil-report" className="btn">Analyze Soil Now</a>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div key={item._id || index} className="history-card">
                  <div className="history-icon">
                    <FlaskConical size={24} />
                  </div>
                  <div className="history-main">
                    <div className="history-header">
                      <h3>Soil Analysis Report</h3>
                      <span className="history-date">
                        <Calendar size={14} />
                        {new Date(item.timestamp).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="history-summary">
                      <div className="summary-pill">N: <strong>{item.metrics?.nitrogen}</strong></div>
                      <div className="summary-pill">P: <strong>{item.metrics?.phosphorus}</strong></div>
                      <div className="summary-pill">K: <strong>{item.metrics?.potassium}</strong></div>
                      <div className="summary-pill">pH: <strong>{item.metrics?.ph}</strong></div>
                    </div>

                    <div className="history-footer">
                      <span className="status-badge"><CheckCircle2 size={14} /> Analyzed</span>
                      <button className="btn-view-report" onClick={() => setSelectedReport(item)}>
                        View Details <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* REPORT DETAIL MODAL */}
      {selectedReport && (
        <div className="modal-overlay" onClick={closeReportModal}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="header-title">
                <FileText size={24} />
                <h2>Full Report Details</h2>
              </div>
              <button className="close-btn" onClick={closeReportModal}><X size={24} /></button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <section className="detail-section">
                  <h3><Info size={18} /> Identification</h3>
                  <div className="data-row">
                    <span className="label">Report ID:</span>
                    <span className="value">#{selectedReport._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="data-row">
                    <span className="label">Analysis Date:</span>
                    <span className="value">{new Date(selectedReport.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="data-row">
                    <span className="label">Input Source:</span>
                    <span className="value">{selectedReport.inputs?.file || 'Manual Entry / AI Text'}</span>
                  </div>
                </section>

                <section className="detail-section">
                  <h3><Layers size={18} /> Soil Metrics Extracted</h3>
                  <div className="metrics-grid">
                    <div className="m-card">
                      <span className="m-val">{selectedReport.metrics?.nitrogen}</span>
                      <span className="m-lab">Nitrogen (N)</span>
                    </div>
                    <div className="m-card">
                      <span className="m-val">{selectedReport.metrics?.phosphorus}</span>
                      <span className="m-lab">Phosphorus (P)</span>
                    </div>
                    <div className="m-card">
                      <span className="m-val">{selectedReport.metrics?.potassium}</span>
                      <span className="m-lab">Potassium (K)</span>
                    </div>
                    <div className="m-card">
                      <span className="m-val">{selectedReport.metrics?.ph}</span>
                      <span className="m-lab">Soil pH</span>
                    </div>
                    <div className="m-card">
                      <span className="m-val">{selectedReport.metrics?.organicCarbon || 'N/A'}</span>
                      <span className="m-lab">Org. Carbon</span>
                    </div>
                  </div>
                </section>

                <section className="detail-section full-width">
                  <h3><Activity size={18} /> AI Analysis & Advice</h3>
                  <div className="advice-box">
                    <p className="ai-message">"{selectedReport.advice || 'No specific advice recorded for this analysis.'}"</p>
                    {selectedReport.results?.message && (
                      <p className="ai-note"><ArrowRight size={14} /> {selectedReport.results.message}</p>
                    )}
                  </div>
                </section>

                {selectedReport.extractedFromText && (
                  <section className="detail-section full-width">
                    <h3>Raw Extracted Text</h3>
                    <div className="raw-text-box">
                      {selectedReport.extractedFromText}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => window.location.href='/soil-report'}>
                Re-Analyze with these values
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-page-container {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .profile-header {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 30px;
        }
        .profile-banner {
          height: 120px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        }
        .profile-user-info {
          display: flex;
          align-items: flex-end;
          padding: 0 40px 30px;
          margin-top: -50px;
          gap: 25px;
          position: relative;
        }
        .profile-avatar-large {
          width: 110px;
          height: 110px;
          background: var(--accent-color);
          border: 6px solid white;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary-color);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .profile-text h1 {
          margin: 0;
          font-size: 1.8rem;
          color: var(--dark-color);
        }
        .user-email {
          color: #666;
          margin: 5px 0 12px;
        }
        .user-badges {
          display: flex;
          gap: 10px;
        }
        .user-badges span {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge-premium { background: rgba(39, 174, 96, 0.1); color: #27ae60; }
        .badge-location { background: #f0f2f5; color: #5f6368; }
        
        .btn-logout-alt {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1.5px solid #ff4757;
          color: #ff4757;
          background: transparent;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-logout-alt:hover {
          background: #ff4757;
          color: white;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }
        .history-list { display: flex; flex-direction: column; gap: 15px; }
        .history-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          border: 1px solid #f0f2f5;
        }
        .summary-pill {
          background: #f8f9fa;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          border: 1px solid #eee;
        }
        .btn-view-report {
          background: transparent;
          border: none;
          color: var(--primary-color);
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* MODAL STYLES */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        .report-modal {
          background: white;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
          animation: slideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .modal-header {
          padding: 25px 30px;
          background: #f8f9fa;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-title { display: flex; align-items: center; gap: 15px; color: var(--primary-color); }
        .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee; font-size: 0.9rem; }
        .data-row .label { opacity: 0.6; }
        .data-row .value { font-weight: 600; color: var(--dark-color); }
        
        .modal-body { padding: 30px; overflow-y: auto; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .full-width { grid-column: span 2; }
        .detail-section h3 { font-size: 1.1rem; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; color: var(--dark-color); }
        
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; }
        .m-card { background: #f0f7f4; padding: 15px; border-radius: 15px; text-align: center; border: 1px solid rgba(39, 174, 96, 0.1); }
        .m-val { display: block; font-size: 1.5rem; font-weight: 800; color: var(--primary-color); }
        .m-lab { font-size: 0.75rem; opacity: 0.7; font-weight: 600; }
        
        .advice-box { background: #fff8e1; border-left: 5px solid #ffc107; padding: 20px; border-radius: 0 15px 15px 0; }
        .ai-message { font-size: 1.05rem; font-style: italic; color: #5d4037; margin-bottom: 10px; line-height: 1.6; }
        .ai-note { font-size: 0.85rem; display: flex; align-items: center; gap: 8px; font-weight: 600; color: #795548; }

        .raw-text-box { background: #f5f5f5; padding: 15px; border-radius: 12px; font-family: monospace; font-size: 0.8rem; color: #444; max-height: 150px; overflow-y: auto; }

        .modal-footer { padding: 20px 30px; border-top: 1px solid #eee; text-align: center; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media (max-width: 600px) {
          .detail-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
        }
      `}} />
    </div>
  );
}

export default Profile;

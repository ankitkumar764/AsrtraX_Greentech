import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const STATES = [
  'Andhra Pradesh', 'Gujarat', 'Haryana', 'Karnataka', 'Madhya Pradesh',
  'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Other'
];

export default function Auth() {
  const [mode, setMode]         = useState('login'); // 'login' | 'signup'
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirmPassword: '', state: '' });
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const change = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setSuccess('');
    setForm({ name: '', email: '', password: '', confirmPassword: '', state: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Name is required');
      if (form.name.trim().length < 2) return setError('Name must be at least 2 characters');
      if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      let msg;
      if (mode === 'login') {
        msg = await login(form.email, form.password);
      } else {
        msg = await register(form.name, form.email, form.password, form.state);
      }
      setSuccess(msg);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel — decorative */}
      <div className="auth-panel">
        <div className="auth-panel__orb auth-panel__orb--1" />
        <div className="auth-panel__orb auth-panel__orb--2" />
        <div className="auth-panel__content">
          <div className="auth-panel__logo">🌾</div>
          <h1 className="auth-panel__title">KrishiSaarthi AI</h1>
          <p className="auth-panel__sub">Smart Farming Advisor for every Indian Farmer</p>
          <div className="auth-panel__features">
            {['🌱 AI-powered crop recommendations', '📊 Soil health analysis', '🌦️ Real-time weather alerts', '💰 Profit & loss calculator', '🏛️ Government scheme guide'].map(f => (
              <div key={f} className="auth-panel__feature">{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-form-side">
        <div className="auth-card">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')}>
              Login
            </button>
            <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')}>
              Sign Up
            </button>
            <div className={`auth-tab-indicator ${mode === 'signup' ? 'right' : 'left'}`} />
          </div>

          <div className="auth-card__body">
            <h2 className="auth-card__title">
              {mode === 'login' ? 'Welcome Back 👋' : 'Join KrishiSaarthi 🌱'}
            </h2>
            <p className="auth-card__subtitle">
              {mode === 'login' ? 'Login to access your farming dashboard' : 'Create your free farmer account today'}
            </p>

            {error   && <div className="auth-alert auth-alert--error">❌ {error}</div>}
            {success && <div className="auth-alert auth-alert--success">✅ {success}</div>}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {mode === 'signup' && (
                <div className="auth-field">
                  <label className="auth-label">Full Name *</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">👤</span>
                    <input
                      className="auth-input"
                      type="text"
                      name="name"
                      placeholder="e.g. Ramesh Patel"
                      value={form.name}
                      onChange={change}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label className="auth-label">Email Address *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">📧</span>
                  <input
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={change}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    className="auth-input"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={change}
                    required
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div className="auth-field">
                    <label className="auth-label">Confirm Password *</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input
                        className="auth-input"
                        type={showPass ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={change}
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">State (optional)</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">📍</span>
                      <select className="auth-input auth-select" name="state" value={form.state} onChange={change}>
                        <option value="">-- Select your state --</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <><span className="auth-spinner" /> {mode === 'login' ? 'Logging in…' : 'Creating account…'}</>
                ) : (
                  mode === 'login' ? '🌾 Login to Dashboard' : '🌱 Create My Account'
                )}
              </button>
            </form>

            <p className="auth-switch">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button className="auth-switch-btn" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

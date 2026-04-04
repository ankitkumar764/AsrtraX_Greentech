import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const POPULAR_CITIES = ['Mumbai', 'Delhi', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Bhopal', 'Nagpur'];

function getAdviceBg(color) {
  const map = {
    red: 'weather-advice--red',
    blue: 'weather-advice--blue',
    yellow: 'weather-advice--yellow',
    gray: 'weather-advice--gray',
    lightblue: 'weather-advice--lightblue',
    teal: 'weather-advice--teal',
    green: 'weather-advice--green',
  };
  return map[color] || 'weather-advice--green';
}

export default function Weather() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    const target = (cityName || city).trim();
    if (!target) {
      setError('Please enter a city name.');
      return;
    }
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await axios.get(`/api/weather?city=${encodeURIComponent(target)}`);
      setData(res.data);
      setCity(target);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className="weather-page">
      {/* ── Hero Banner ── */}
      <div className="weather-hero">
        <div className="weather-hero__orb weather-hero__orb--1" />
        <div className="weather-hero__orb weather-hero__orb--2" />
        <div className="weather-hero__content">
          <div className="weather-hero__badge">🌦️ AI-Powered</div>
          <h1 className="weather-hero__title">Weather Insights</h1>
          <p className="weather-hero__subtitle">
            Get tomorrow's forecast &amp; personalised farming advisory for your city
          </p>
        </div>
      </div>

      <div className="weather-container">

        {/* ── Search Card ── */}
        <div className="weather-search-card">
          <div className="weather-search-card__inner">
            <div className="weather-input-wrapper">
              <span className="weather-input-icon">📍</span>
              <input
                className="weather-input"
                type="text"
                placeholder="Enter city name (e.g. Mumbai, Delhi…)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {city && (
                <button className="weather-input-clear" onClick={() => { setCity(''); setData(null); setError(''); }}>
                  ✕
                </button>
              )}
            </div>

            <button
              className="weather-btn"
              onClick={() => fetchWeather()}
              disabled={loading}
            >
              {loading ? (
                <><span className="weather-spinner" /> Fetching…</>
              ) : (
                <>☁️ Get Tomorrow's Weather</>
              )}
            </button>
          </div>

          {/* Quick city chips */}
          <div className="weather-chips">
            <span className="weather-chips__label">Quick pick:</span>
            {POPULAR_CITIES.map((c) => (
              <button key={c} className="weather-chip" onClick={() => { setCity(c); fetchWeather(c); }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="weather-error">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Results ── */}
        {data && (
          <div className="weather-results">

            {/* Main weather card */}
            <div className="weather-main-card">
              <div className="weather-main-card__left">
                <p className="weather-city-name">📍 {data.city}</p>
                <p className="weather-label">Tomorrow's Forecast</p>
                <div className="weather-temp-row">
                  <span className="weather-temp">{data.temp}°</span>
                  <span className="weather-temp-unit">C</span>
                </div>
                <p className="weather-description">{data.description}</p>
                <div className="weather-range">
                  <span>⬇ {data.tempMin}°</span>
                  <span className="weather-range-sep">·</span>
                  <span>⬆ {data.tempMax}°</span>
                </div>
              </div>

              <div className="weather-main-card__right">
                {data.iconUrl && (
                  <img src={data.iconUrl} alt={data.weather} className="weather-icon-img" />
                )}
                <p className="weather-condition-badge">{data.weather}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="weather-stats">
              {[
                { icon: '💧', label: 'Humidity',   value: `${data.humidity}%` },
                { icon: '💨', label: 'Wind Speed',  value: `${data.windSpeed} km/h` },
                { icon: '🌡️', label: 'Feels Like',  value: `${data.feelsLike}°C` },
              ].map(({ icon, label, value }) => (
                <div className="weather-stat-card" key={label}>
                  <span className="weather-stat-icon">{icon}</span>
                  <span className="weather-stat-value">{value}</span>
                  <span className="weather-stat-label">{label}</span>
                </div>
              ))}
            </div>

            {/* Farming advice */}
            <div className={`weather-advice ${getAdviceBg(data.adviceColor)}`}>
              <div className="weather-advice__header">
                <span className="weather-advice__emoji">{data.adviceIcon}</span>
                <span className="weather-advice__title">Farming Advisory</span>
              </div>
              <p className="weather-advice__text">{data.advice}</p>
            </div>

            {/* Hourly mini forecast */}
            {data.hourlyForecast && data.hourlyForecast.length > 0 && (
              <div className="weather-hourly">
                <h3 className="weather-hourly__title">Today's Hourly Snapshot</h3>
                <div className="weather-hourly__grid">
                  {data.hourlyForecast.map((h, i) => (
                    <div className="weather-hourly__item" key={i}>
                      <span className="weather-hourly__time">{h.time}</span>
                      <img src={h.icon} alt={h.desc} className="weather-hourly__icon" />
                      <span className="weather-hourly__temp">{h.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── Empty state ── */}
        {!data && !loading && !error && (
          <div className="weather-empty">
            <div className="weather-empty__animation">🌤️</div>
            <h3>Search any city to get started</h3>
            <p>We'll fetch tomorrow's weather and give you tailored crop management advice.</p>
          </div>
        )}

      </div>
    </div>
  );
}

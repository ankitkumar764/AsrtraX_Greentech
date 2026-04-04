const express = require('express');
const axios = require('axios');

const router = express.Router();

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

function getFarmingAdvice(conditionText, code) {
  const text = conditionText.toLowerCase();

  // Storm / Thunder
  if (code >= 1087 && code <= 1117) {
    return { advice: '⚠️ Storm alert! Protect crops, secure loose equipment, and avoid field work.', color: 'red', icon: '⛈️' };
  }
  // Rain / Drizzle
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower') || (code >= 1150 && code <= 1201)) {
    return { advice: '🌧️ Avoid fertilizer application — rain may wash nutrients away. Good time for transplanting seedlings.', color: 'blue', icon: '🌧️' };
  }
  // Snow / Sleet / Blizzard
  if (text.includes('snow') || text.includes('sleet') || text.includes('blizzard') || text.includes('ice') || (code >= 1204 && code <= 1282)) {
    return { advice: '❄️ Frost risk! Cover sensitive crops with mulch or poly-tunnels to prevent frost damage.', color: 'lightblue', icon: '❄️' };
  }
  // Fog / Mist / Haze
  if (text.includes('fog') || text.includes('mist') || text.includes('haze') || code === 1030 || code === 1135 || code === 1147) {
    return { advice: '🌫️ Foggy conditions increase disease risk. Monitor crops for fungal infections. Improve drainage.', color: 'gray', icon: '🌫️' };
  }
  // Sunny / Clear
  if (code === 1000) {
    return { advice: '☀️ Excellent day for irrigation, harvesting, and outdoor farm activities. Apply fertilizer in the evening.', color: 'yellow', icon: '☀️' };
  }
  // Partly cloudy / Overcast
  if (text.includes('cloud') || text.includes('overcast') || code === 1003 || code === 1006 || code === 1009) {
    return { advice: '⛅ Moderate conditions — ideal for spraying pesticides and transplanting. Soil stays moist longer.', color: 'gray', icon: '⛅' };
  }
  // Windy (no dedicated code in weatherapi but catch via text)
  if (text.includes('wind') || text.includes('squall')) {
    return { advice: '💨 High winds expected. Stake tall crops and delay spraying operations to avoid drift.', color: 'teal', icon: '💨' };
  }

  return { advice: '🌱 Monitor local conditions before starting field operations. Stay updated on weather changes.', color: 'green', icon: '🌱' };
}

// GET /api/weather?city=London
router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city || city.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide a valid city name' });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: city.trim(),
        aqi: 'no'
      },
      timeout: 10000
    });

    const { location, current } = response.data;

    const temp       = Math.round(current.temp_c);
    const feelsLike  = Math.round(current.feelslike_c);
    const humidity   = current.humidity;
    const windSpeed  = current.wind_kph.toFixed(1);
    const weather    = current.condition.text;
    const condCode   = current.condition.code;
    const iconUrl    = 'https:' + current.condition.icon.replace('64x64', '128x128');
    const isDay      = current.is_day === 1;

    const cityName   = location.name;
    const country    = location.country;
    const localTime  = location.localtime;

    // WeatherAPI current doesn't give min/max — derive ±3 estimate
    const tempMin    = temp - 3;
    const tempMax    = temp + 3;

    const { advice, color, icon: adviceIcon } = getFarmingAdvice(weather, condCode);

    return res.json({
      success: true,
      city: `${cityName}, ${country}`,
      localTime,
      isDay,
      temp,
      tempMin,
      tempMax,
      feelsLike,
      humidity,
      windSpeed,
      weather,
      description: weather,
      iconUrl,
      advice,
      adviceColor: color,
      adviceIcon,
      hourlyForecast: [],      // current.json has no hourly; kept for frontend compatibility
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('WeatherAPI Error:', error.response?.data || error.message);

    if (error.response?.status === 400) {
      const msg = error.response.data?.error?.message || 'City not found';
      return res.status(404).json({ error: msg });
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(401).json({ error: 'Invalid API key. Please check your configuration.' });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Weather service timed out. Please try again.' });
    }

    return res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
});

module.exports = router;


function getFarmingAdvice(weather, description) {
  const condition = (weather + ' ' + description).toLowerCase();

  if (condition.includes('thunderstorm') || condition.includes('storm')) {
    return {
      advice: '⚠️ Storm alert! Protect crops, secure loose equipment, and avoid field work.',
      color: 'red',
      icon: '⛈️'
    };
  }
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return {
      advice: '🌧️ Avoid fertilizer application — rain may wash nutrients away. Good time for transplanting seedlings.',
      color: 'blue',
      icon: '🌧️'
    };
  }
  if (condition.includes('clear') || condition.includes('sunny')) {
    return {
      advice: '☀️ Excellent day for irrigation, harvesting, and outdoor farm activities. Apply fertilizer in the evening.',
      color: 'yellow',
      icon: '☀️'
    };
  }
  if (condition.includes('cloud')) {
    return {
      advice: '⛅ Moderate conditions — ideal for spraying pesticides and transplanting. Soil stays moist longer.',
      color: 'gray',
      icon: '⛅'
    };
  }
  if (condition.includes('snow') || condition.includes('frost')) {
    return {
      advice: '❄️ Frost risk! Cover sensitive crops with mulch or poly-tunnels to prevent damage.',
      color: 'lightblue',
      icon: '❄️'
    };
  }
  if (condition.includes('fog') || condition.includes('haze') || condition.includes('mist')) {
    return {
      advice: '🌫️ Foggy conditions increase disease risk. Monitor crops for fungal infections. Improve drainage.',
      color: 'gray',
      icon: '🌫️'
    };
  }
  if (condition.includes('wind') || condition.includes('squall')) {
    return {
      advice: '💨 High winds expected. Stake tall crops and delay spraying operations to avoid drift.',
      color: 'teal',
      icon: '💨'
    };
  }
  return {
    advice: '🌱 Monitor local conditions before starting field operations. Stay updated on weather changes.',
    color: 'green',
    icon: '🌱'
  };
}

// GET /api/weather?city=Mumbai
router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city || city.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide a valid city name' });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city.trim(),
        appid: API_KEY,
        units: 'metric'
      },
      timeout: 10000
    });

    const forecastList = response.data.list;

    // Index 8 = ~24 hours ahead (3hr intervals × 8 = 24hrs = tomorrow)
    const tomorrowForecast = forecastList[8] || forecastList[forecastList.length - 1];

    const temp       = Math.round(tomorrowForecast.main.temp);
    const tempMin    = Math.round(tomorrowForecast.main.temp_min);
    const tempMax    = Math.round(tomorrowForecast.main.temp_max);
    const feelsLike  = Math.round(tomorrowForecast.main.feels_like);
    const humidity   = tomorrowForecast.main.humidity;
    const windSpeed  = (tomorrowForecast.wind.speed * 3.6).toFixed(1); // m/s → km/h
    const weather    = tomorrowForecast.weather[0].main;
    const description = tomorrowForecast.weather[0].description
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const iconCode   = tomorrowForecast.weather[0].icon;
    const iconUrl    = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const cityName   = response.data.city.name;
    const country    = response.data.city.country;

    const { advice, color, icon: adviceIcon } = getFarmingAdvice(weather, description);

    // Also send next 5 periods as mini forecast
    const hourlyForecast = forecastList.slice(0, 6).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(item.main.temp),
      icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
      desc: item.weather[0].main
    }));

    return res.json({
      success: true,
      city: `${cityName}, ${country}`,
      temp,
      tempMin,
      tempMax,
      feelsLike,
      humidity,
      windSpeed,
      weather,
      description,
      iconUrl,
      advice,
      adviceColor: color,
      adviceIcon,
      hourlyForecast,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Weather API Error:', error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({ error: `City "${city}" not found. Please check the spelling.` });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your configuration.' });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Weather service timed out. Please try again.' });
    }

    return res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
});

module.exports = router;

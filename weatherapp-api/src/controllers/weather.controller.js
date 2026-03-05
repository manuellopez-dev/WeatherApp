const axios        = require('axios');
const weatherConfig = require('../config/weather.config');

const { apiKey, baseUrl, units, lang } = weatherConfig;

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/weather/current?city=Guadalajara
// GET /api/weather/current?lat=20.67&lon=-103.35
// ─────────────────────────────────────────────────────────────────────────────
exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({ message: 'Debes proporcionar city o lat+lon.' });
    }

    const params = { appid: apiKey, units, lang };
    if (city)        params.q   = city;
    if (lat && lon)  { params.lat = lat; params.lon = lon; }

    const { data } = await axios.get(`${baseUrl}/weather`, { params });

    return res.json({
      city:        data.name,
      country:     data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike:   Math.round(data.main.feels_like),
      tempMin:     Math.round(data.main.temp_min),
      tempMax:     Math.round(data.main.temp_max),
      humidity:    data.main.humidity,
      pressure:    data.main.pressure,
      windSpeed:   data.wind.speed,
      windDeg:     data.wind.deg,
      visibility:  data.visibility,
      condition:   data.weather[0].main,
      description: data.weather[0].description,
      icon:        data.weather[0].icon,
      sunrise:     data.sys.sunrise,
      sunset:      data.sys.sunset,
      timezone:    data.timezone,
      coords: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      }
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Ciudad no encontrada.' });
    }
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/weather/forecast?city=Guadalajara
// GET /api/weather/forecast?lat=20.67&lon=-103.35
// Devuelve pronóstico de 5 días agrupado por día
// ─────────────────────────────────────────────────────────────────────────────
exports.getForecast = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({ message: 'Debes proporcionar city o lat+lon.' });
    }

    const params = { appid: apiKey, units, lang, cnt: 40 };
    if (city)       params.q   = city;
    if (lat && lon) { params.lat = lat; params.lon = lon; }

    const { data } = await axios.get(`${baseUrl}/forecast`, { params });

    // Agrupar por día — tomar el registro de mediodía (12:00) de cada día
    const grouped = {};

    data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      const hour = item.dt_txt.split(' ')[1];

      if (!grouped[date] || hour === '12:00:00') {
        grouped[date] = {
          date,
          tempMin:     Math.round(item.main.temp_min),
          tempMax:     Math.round(item.main.temp_max),
          temperature: Math.round(item.main.temp),
          humidity:    item.main.humidity,
          condition:   item.weather[0].main,
          description: item.weather[0].description,
          icon:        item.weather[0].icon,
          windSpeed:   item.wind.speed,
        };
      }
    });

    const forecast = Object.values(grouped).slice(0, 5);

    return res.json({
      city:     data.city.name,
      country:  data.city.country,
      forecast,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Ciudad no encontrada.' });
    }
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/weather/search?q=Guada
// Autocompletado de ciudades
// ─────────────────────────────────────────────────────────────────────────────
exports.searchCities = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Escribe al menos 2 caracteres.' });
    }

    const { data } = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
      params: { q, limit: 5, appid: apiKey }
    });

    const cities = data.map(c => ({
      name:    c.name,
      country: c.country,
      state:   c.state || null,
      lat:     c.lat,
      lon:     c.lon,
      label:   c.state ? `${c.name}, ${c.state}, ${c.country}` : `${c.name}, ${c.country}`,
    }));

    return res.json(cities);
  } catch (error) {
    next(error);
  }
};
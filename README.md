# WeatherApp 🌤️

Aplicación del clima desarrollada con Angular 16 y Node.js. Consume la API de OpenWeatherMap a través de un backend propio para proteger las credenciales.

![Angular](https://img.shields.io/badge/Angular-16-DD0031?style=flat&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=flat)

---

## Funcionalidades

- 🔍 Búsqueda de ciudades con autocompletado
- 📍 Geolocalización automática
- 🌡️ Clima actual — temperatura, humedad, viento, visibilidad, presión, amanecer/atardecer
- 📅 Pronóstico de 5 días
- 🎨 Fondos dinámicos según el clima (soleado, nublado, lluvia, tormenta, noche, nieve)
- 📱 Diseño responsive con glassmorphism

---

## Arquitectura
```
Angular (Client) → Node.js/Express (weatherapp-api) → OpenWeatherMap API
```

El backend actúa como proxy para que la API key nunca quede expuesta en el frontend.

---

## Instalación

### Backend
```bash
cd weatherapp-api
npm install
cp .env.examples .env
# Agregar tu API key de OpenWeatherMap en .env
npm run dev
```

### Frontend
```bash
cd Client
npm install
ng serve
```

### Variables de entorno
```env
PORT=3001
OPENWEATHER_API_KEY=tu_api_key
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
FRONTEND_URL=http://localhost:4200
```

---

## Stack

- **Frontend**: Angular 16, Angular Material, SCSS, glassmorphism
- **Backend**: Node.js, Express, Axios
- **API**: OpenWeatherMap (gratuita)

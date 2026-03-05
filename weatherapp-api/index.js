require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const weatherRoutes = require('./src/routes/weatherroutes');
const { notFound, errorHandler } = require('./src/middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/weather', weatherRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Servidor ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`API Key cargada: ${process.env.OPENWEATHER_API_KEY ? 'Sí' : 'No'}`);
})
const router        = require('express').Router();
const controller    = require('../controllers/weather.controller');

router.get('/current',  controller.getCurrentWeather);
router.get('/forecast', controller.getForecast);
router.get('/search',   controller.searchCities);

module.exports = router;
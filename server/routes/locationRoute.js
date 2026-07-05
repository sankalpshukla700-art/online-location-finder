const express = require('express');
const router = express.Router();
const { getRoute } = require('../controlers/locationControllers');


router.post('/route', getRoute);

module.exports = router;
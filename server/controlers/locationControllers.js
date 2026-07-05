const express = require('express');
const axios = require('axios');
const router = express.Router();

// Utility function for socket usage
const calculateDistanceAndEta = async (origin, destination) => {
  const apiKey = process.env.ORS_API_KEY;
  const url = `https://api.openrouteservice.org/v2/matrix/driving-car`;
  try {
    const locations = [
      [origin.lng, origin.lat],
      [destination.lng, destination.lat],
    ];
    const response = await axios.post(
      url,
      {
        locations,
        metrics: ['distance', 'duration'],
        units: 'km',
      },
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    const distanceKm = response.data.distances[0][1];
    const durationMin = response.data.durations[0][1] / 60;
    return {
      distance: `${distanceKm.toFixed(2)} km`,
      duration: `${Math.round(durationMin)} mins`,
    };
  } catch (error) {
    console.error('Error calculating distance and ETA:', error);
    throw error;
  }
};

// POST /api/locations/route
router.post('/route', async (req, res) => {
  const { start, end } = req.body;
  const apiKey = process.env.ORS_API_KEY;
  const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
  try {
    const response = await axios.post(
      url,
      {
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat],
        ],
      },
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

module.exports = router;
module.exports.calculateDistanceAndEta = calculateDistanceAndEta;

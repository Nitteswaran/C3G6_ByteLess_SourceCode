import express from 'express'
import { calculateSafetyScore } from '../utils/safetyScore.js'

const router = express.Router()

/**
 * Generate mock safety data based on coordinates
 * Uses coordinate values to create deterministic but varied responses
 */
const generateMockSafetyData = (lat, lng) => {
  // Use coordinates to create pseudo-random but deterministic values
  // This ensures same coordinates return same data, but different coordinates vary
  
  // Normalize coordinates to create seed values
  const latSeed = Math.abs(lat * 1000) % 100
  const lngSeed = Math.abs(lng * 1000) % 100
  const combinedSeed = (latSeed + lngSeed) % 100

  // Crowd Density (0-100): Percentage of typical crowd density
  // Higher in city centers, lower in suburbs
  const baseCrowdDensity = 30 + (latSeed % 70) // 30-100
  const crowdDensity = Math.round(baseCrowdDensity)

  // Lighting (0-100): Quality of lighting (0 = very dark, 100 = well-lit)
  // Better lighting in commercial areas
  const baseLighting = 40 + (lngSeed % 60) // 40-100
  const lighting = Math.round(baseLighting)

  // Incidents Nearby (0-10): Number of reported incidents in last 30 days
  // Lower in safer areas
  const maxIncidents = 10 - Math.floor((combinedSeed / 100) * 5) // Varies by location
  const incidentsNearby = Math.floor((combinedSeed / 100) * maxIncidents)

  // Weather Risk (0-100): Risk level from weather conditions
  // Varies by location and time
  const baseWeatherRisk = 20 + (latSeed % 50) // 20-70
  const weatherRisk = Math.round(baseWeatherRisk)

  // Calculate safety score using the utility function
  const safetyScore = calculateSafetyScore({
    crowdDensity,
    lighting,
    incidents: incidentsNearby,
    weatherRisk,
  })

  return {
    safetyScore,
    crowdDensity,
    lighting,
    incidentsNearby,
    weatherRisk,
  }
}

/**
 * GET /api/surroundings
 * Get safety analysis of surroundings based on coordinates
 * 
 * @query {number} lat - Latitude
 * @query {number} lng - Longitude
 * 
 * @returns {Object} Safety data with scores
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query

    // Validate required parameters
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      })
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values',
      })
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: 'Latitude must be between -90 and 90',
      })
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Longitude must be between -180 and 180',
      })
    }

    // Generate mock safety data based on coordinates
    const safetyData = generateMockSafetyData(latitude, longitude)

    res.json({
      success: true,
      data: {
        ...safetyData,
        location: {
          lat: latitude,
          lng: longitude,
        },
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching surroundings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surroundings data',
      error: error.message,
    })
  }
})

export default router

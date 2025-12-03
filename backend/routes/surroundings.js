import express from 'express'
import { calculateSafetyScore } from '../utils/safetyScore.js'

const router = express.Router()

// City-specific safety profiles for major Malaysian cities
// These provide baseline safety characteristics for different areas
const citySafetyProfiles = {
  // Kuala Lumpur - Urban center, generally safe but varies by area
  'kuala-lumpur': { baseCrowd: 70, baseLighting: 75, baseIncidents: 3, baseWeather: 25 },
  'kl': { baseCrowd: 70, baseLighting: 75, baseIncidents: 3, baseWeather: 25 },
  
  // Selangor - Suburban, generally safe
  'selangor': { baseCrowd: 60, baseLighting: 70, baseIncidents: 2, baseWeather: 20 },
  'shah-alam': { baseCrowd: 65, baseLighting: 72, baseIncidents: 2, baseWeather: 22 },
  
  // Penang - Tourist area, generally safe
  'penang': { baseCrowd: 75, baseLighting: 80, baseIncidents: 2, baseWeather: 30 },
  'george-town': { baseCrowd: 80, baseLighting: 85, baseIncidents: 1, baseWeather: 30 },
  
  // Johor - Border area, moderate safety
  'johor': { baseCrowd: 55, baseLighting: 65, baseIncidents: 4, baseWeather: 35 },
  'johor-bahru': { baseCrowd: 60, baseLighting: 70, baseIncidents: 3, baseWeather: 35 },
  'jb': { baseCrowd: 60, baseLighting: 70, baseIncidents: 3, baseWeather: 35 },
  
  // Melaka - Historical city, generally safe
  'melaka': { baseCrowd: 70, baseLighting: 75, baseIncidents: 2, baseWeather: 28 },
  'malacca': { baseCrowd: 70, baseLighting: 75, baseIncidents: 2, baseWeather: 28 },
  
  // Ipoh - Smaller city, moderate safety
  'ipoh': { baseCrowd: 50, baseLighting: 60, baseIncidents: 3, baseWeather: 25 },
  
  // Kuching - East Malaysia, generally safe
  'kuching': { baseCrowd: 55, baseLighting: 65, baseIncidents: 2, baseWeather: 30 },
  
  // Kota Kinabalu - East Malaysia, tourist area
  'kota-kinabalu': { baseCrowd: 70, baseLighting: 75, baseIncidents: 2, baseWeather: 32 },
  
  // Putrajaya - Administrative center, very safe
  'putrajaya': { baseCrowd: 40, baseLighting: 90, baseIncidents: 1, baseWeather: 20 },
}

/**
 * Get city profile based on coordinates
 * Checks if coordinates are within known city bounds
 */
const getCityProfile = (lat, lng) => {
  // Check if coordinates match known Malaysian cities
  // KL area: ~3.0-3.3 lat, 101.5-101.8 lng
  if (lat >= 3.0 && lat <= 3.3 && lng >= 101.5 && lng <= 101.8) {
    if (lat >= 3.15 && lat <= 3.17 && lng >= 101.68 && lng <= 101.72) {
      return citySafetyProfiles['kuala-lumpur']
    }
    if (lat >= 2.9 && lat <= 2.95 && lng >= 101.65 && lng <= 101.7) {
      return citySafetyProfiles['putrajaya']
    }
    return citySafetyProfiles['selangor']
  }
  
  // Penang: ~5.3-5.5 lat, 100.2-100.4 lng
  if (lat >= 5.3 && lat <= 5.5 && lng >= 100.2 && lng <= 100.4) {
    return citySafetyProfiles['penang']
  }
  
  // Johor: ~1.4-1.6 lat, 103.6-103.8 lng
  if (lat >= 1.4 && lat <= 1.6 && lng >= 103.6 && lng <= 103.8) {
    return citySafetyProfiles['johor-bahru']
  }
  
  // Melaka: ~2.1-2.3 lat, 102.2-102.3 lng
  if (lat >= 2.1 && lat <= 2.3 && lng >= 102.2 && lng <= 102.3) {
    return citySafetyProfiles['melaka']
  }
  
  // Ipoh: ~4.5-4.7 lat, 101.0-101.1 lng
  if (lat >= 4.5 && lat <= 4.7 && lng >= 101.0 && lng <= 101.1) {
    return citySafetyProfiles['ipoh']
  }
  
  // Kuching: ~1.5-1.6 lat, 110.3-110.4 lng
  if (lat >= 1.5 && lat <= 1.6 && lng >= 110.3 && lng <= 110.4) {
    return citySafetyProfiles['kuching']
  }
  
  // Kota Kinabalu: ~5.9-6.0 lat, 116.0-116.1 lng
  if (lat >= 5.9 && lat <= 6.0 && lng >= 116.0 && lng <= 116.1) {
    return citySafetyProfiles['kota-kinabalu']
  }
  
  return null
}

/**
 * Generate mock safety data based on coordinates
 * Uses coordinate values to create deterministic but varied responses
 * Improved algorithm for better variation between different locations
 */
const generateMockSafetyData = (lat, lng) => {
  // Use a more sophisticated hash function to create better variation
  // This ensures different coordinates produce significantly different values
  
  // Check for city-specific profile first
  const cityProfile = getCityProfile(lat, lng)
  
  // Create more complex seeds using multiple operations
  const latInt = Math.abs(Math.floor(lat * 10000))
  const lngInt = Math.abs(Math.floor(lng * 10000))
  
  // Use prime numbers for better distribution
  const latHash = (latInt * 73856093) % 1000
  const lngHash = (lngInt * 19349663) % 1000
  const combinedHash = ((latHash + lngHash) * 83492791) % 1000
  
  // Add time-based variation for more realistic data
  const now = new Date()
  const timeVariation = (now.getHours() * 60 + now.getMinutes()) % 100
  
  // Normalize to 0-100 range
  const latSeed = (latHash + timeVariation) % 100
  const lngSeed = (lngHash + timeVariation) % 100
  const combinedSeed = (combinedHash + timeVariation) % 100

  // Use city profile as base if available, otherwise use calculated values
  let baseCrowdDensity, baseLighting, baseIncidents, baseWeatherRisk
  
  if (cityProfile) {
    // Use city profile with more significant variation
    const variation1 = (latSeed % 30) - 15 // -15 to +15 variation
    const variation2 = (lngSeed % 25) - 12 // -12 to +13 variation
    const variation3 = (combinedSeed % 20) - 10 // -10 to +10 variation
    
    baseCrowdDensity = cityProfile.baseCrowd + variation1
    baseLighting = cityProfile.baseLighting + variation2
    baseIncidents = Math.max(0, Math.min(10, cityProfile.baseIncidents + Math.floor(variation3 / 4)))
    baseWeatherRisk = cityProfile.baseWeather + variation1
  } else {
    // Calculate from coordinates
    const crowdVariation = Math.sin(latHash / 100) * 35 + 35
    baseCrowdDensity = 25 + (crowdVariation + (latSeed % 50))
    
    const lightingVariation = Math.cos(lngHash / 100) * 30 + 30
    baseLighting = 30 + (lightingVariation + (lngSeed % 50))
    
    const incidentBase = Math.sin(combinedHash / 200) * 5 + 5
    baseIncidents = Math.max(0, Math.min(10, Math.round(incidentBase + (combinedSeed % 5))))
    
    const weatherVariation = Math.cos((latHash + lngHash) / 150) * 25 + 25
    baseWeatherRisk = 15 + (weatherVariation + (combinedSeed % 40))
  }

  // Apply final calculations with bounds
  const crowdDensity = Math.max(10, Math.min(100, Math.round(baseCrowdDensity)))
  const lighting = Math.max(20, Math.min(100, Math.round(baseLighting)))
  const incidentsNearby = Math.max(0, Math.min(10, Math.round(baseIncidents)))
  const weatherRisk = Math.max(10, Math.min(100, Math.round(baseWeatherRisk)))

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
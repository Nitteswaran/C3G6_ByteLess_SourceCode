import asyncHandler from '../utils/asyncHandler.js'

/**
 * Get weather data for a location
 * @route GET /api/weather
 * @query {number} lat - Latitude
 * @query {number} lng - Longitude
 */
export const getWeatherData = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query

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

  // Mock weather data based on coordinates
  // In production, integrate with a weather API like OpenWeatherMap
  const weatherData = generateMockWeatherData(latitude, longitude)

  res.json({
    success: true,
    data: weatherData,
  })
})

/**
 * Generate mock weather data based on coordinates
 * This simulates weather conditions for different locations
 */
function generateMockWeatherData(lat, lng) {
  // Malaysia coordinates range approximately:
  // Latitude: 0.85 to 7.36
  // Longitude: 99.64 to 119.27

  // Create a hash from coordinates for consistent results
  const hash = Math.floor((lat * 100 + lng) % 10)

  const weatherConditions = [
    {
      condition: 'Sunny',
      description: 'Clear sky',
      icon: '☀️',
      temperature: 32 + (hash % 5),
      feelsLike: 35 + (hash % 5),
      humidity: 65 + (hash % 10),
      windSpeed: 8 + (hash % 5),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][hash % 8],
      visibility: 10,
      uvIndex: 7 + (hash % 3),
      cloudCover: 10 + (hash % 10),
    },
    {
      condition: 'Partly Cloudy',
      description: 'Partly cloudy',
      icon: '⛅',
      temperature: 30 + (hash % 4),
      feelsLike: 33 + (hash % 4),
      humidity: 70 + (hash % 10),
      windSpeed: 10 + (hash % 5),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][hash % 8],
      visibility: 9,
      uvIndex: 6 + (hash % 3),
      cloudCover: 40 + (hash % 20),
    },
    {
      condition: 'Cloudy',
      description: 'Overcast',
      icon: '☁️',
      temperature: 28 + (hash % 3),
      feelsLike: 31 + (hash % 3),
      humidity: 75 + (hash % 10),
      windSpeed: 12 + (hash % 5),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][hash % 8],
      visibility: 8,
      uvIndex: 4 + (hash % 3),
      cloudCover: 70 + (hash % 20),
    },
    {
      condition: 'Rainy',
      description: 'Light rain',
      icon: '🌧️',
      temperature: 26 + (hash % 3),
      feelsLike: 29 + (hash % 3),
      humidity: 85 + (hash % 10),
      windSpeed: 15 + (hash % 5),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][hash % 8],
      visibility: 6,
      uvIndex: 2 + (hash % 2),
      cloudCover: 90 + (hash % 10),
      precipitation: 2.5 + (hash % 3),
    },
    {
      condition: 'Thunderstorm',
      description: 'Thunderstorms',
      icon: '⛈️',
      temperature: 25 + (hash % 3),
      feelsLike: 28 + (hash % 3),
      humidity: 90 + (hash % 8),
      windSpeed: 20 + (hash % 10),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][hash % 8],
      visibility: 4,
      uvIndex: 1,
      cloudCover: 95 + (hash % 5),
      precipitation: 5 + (hash % 5),
    },
  ]

  // Select weather condition based on hash
  const weather = weatherConditions[hash % weatherConditions.length]

  // Time-based variations (simulate day/night cycle)
  const now = new Date()
  const hour = now.getHours()
  const isDaytime = hour >= 6 && hour < 20

  // Adjust temperature for time of day
  const tempAdjustment = isDaytime ? 0 : -5
  weather.temperature += tempAdjustment
  weather.feelsLike += tempAdjustment

  // Add timestamp
  weather.timestamp = new Date().toISOString()
  weather.location = {
    lat: lat,
    lng: lng,
  }

  return weather
}


import express from 'express'
const router = express.Router()

// GET /api/route - Get route between origin and destination
router.get('/', async (req, res) => {
  try {
    const { origin, destination, userLat, userLng, useMapbox } = req.query

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required',
      })
    }

    // If Mapbox is requested and token is available, use Mapbox API
    if (useMapbox === 'true' && process.env.MAPBOX_TOKEN) {
      try {
        // Geocode addresses if needed
        let originCoords = origin
        let destCoords = destination

        // Geocode if addresses are strings
        if (typeof origin === 'string' && !origin.includes(',')) {
          const geoResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?` +
            `access_token=${process.env.MAPBOX_TOKEN}&limit=1`
          )
          const geoData = await geoResponse.json()
          if (geoData.features && geoData.features.length > 0) {
            originCoords = geoData.features[0].center.join(',')
          }
        }

        if (typeof destination === 'string' && !destination.includes(',')) {
          const geoResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?` +
            `access_token=${process.env.MAPBOX_TOKEN}&limit=1`
          )
          const geoData = await geoResponse.json()
          if (geoData.features && geoData.features.length > 0) {
            destCoords = geoData.features[0].center.join(',')
          }
        }

        // Get route from Mapbox Directions API
        const routeResponse = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${originCoords};${destCoords}?` +
          `access_token=${process.env.MAPBOX_TOKEN}&` +
          `geometries=geojson&overview=full&steps=true&annotations=duration,distance,congestion`
        )

        const routeData = await routeResponse.json()

        if (routeData.code === 'Ok' && routeData.routes && routeData.routes.length > 0) {
          const bestRoute = routeData.routes[0]
          const leg = bestRoute.legs[0]

          return res.json({
            success: true,
            data: {
              distance: bestRoute.distance / 1000, // km
              duration: Math.round(bestRoute.duration / 60), // minutes
              geometry: bestRoute.geometry,
              steps: leg.steps,
              congestion: leg.annotation?.congestion || [],
              start: {
                lat: leg.start_location[1],
                lng: leg.start_location[0],
                address: origin,
              },
              destination: {
                lat: leg.end_location[1],
                lng: leg.end_location[0],
                address: destination,
              },
            },
          })
        }
      } catch (mapboxError) {
        console.error('Mapbox API error:', mapboxError)
        // Fall through to mock data
      }
    }

    // Fallback to mock data
    // TODO: Implement actual route calculation logic
    // In production, you would:
    // 1. Geocode origin and destination addresses
    // 2. Calculate route using a routing service (OSRM, Google Maps, etc.)
    // 3. Analyze route for safety (crime data, lighting, etc.)
    // 4. Identify unsafe segments
    // 5. Return formatted route data

    // Mock route data structure
    const mockRoute = {
      start: {
        lat: parseFloat(userLat) || 51.505,
        lng: parseFloat(userLng) || -0.09,
        address: origin,
      },
      destination: {
        lat: 51.51,
        lng: -0.1,
        address: destination,
      },
      path: [
        { lat: parseFloat(userLat) || 51.505, lng: parseFloat(userLng) || -0.09 },
        { lat: 51.507, lng: -0.095 },
        { lat: 51.509, lng: -0.098 },
        { lat: 51.51, lng: -0.1 },
      ],
      unsafeSegments: [
        {
          path: [
            { lat: 51.507, lng: -0.095 },
            { lat: 51.509, lng: -0.098 },
          ],
          severity: 'high',
          reason: 'Poor lighting, low foot traffic',
        },
      ],
      distance: 12.5, // km
      duration: 25, // minutes
      safetyScore: 75,
      waypoints: [
        {
          name: 'Start Point',
          instruction: `Start at ${origin}`,
          lat: parseFloat(userLat) || 51.505,
          lng: parseFloat(userLng) || -0.09,
        },
        {
          name: 'City Center',
          instruction: 'Continue through city center',
          lat: 51.507,
          lng: -0.095,
        },
        {
          name: 'Destination',
          instruction: `Arrive at ${destination}`,
          lat: 51.51,
          lng: -0.1,
        },
      ],
    }

    res.json({
      success: true,
      data: mockRoute,
    })
  } catch (error) {
    console.error('Error calculating route:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to calculate route',
      error: error.message,
    })
  }
})

export default router


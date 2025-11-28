/**
 * Safe Spots Controller
 * Returns nearby safe locations (police stations, hospitals, 24-hour stores, well-lit areas)
 */

// Static mock data for safe spots in Malaysia (Kuala Lumpur area)
const MOCK_SAFE_SPOTS = [
  // Police Stations
  {
    id: 1,
    name: 'Dang Wangi Police Station',
    type: 'police_station',
    category: 'police',
    lat: 3.1525,
    lng: 101.6975,
    address: 'Jalan Dang Wangi, Kuala Lumpur',
    phone: '+60 3-2148 2222',
    is24Hours: true,
    description: 'Main police station in city center',
    distance: null, // Will be calculated
  },
  {
    id: 2,
    name: 'Brickfields Police Station',
    type: 'police_station',
    category: 'police',
    lat: 3.1289,
    lng: 101.6869,
    address: 'Jalan Tun Sambanthan, Brickfields',
    phone: '+60 3-2274 2222',
    is24Hours: true,
    description: 'Police station near KL Sentral',
    distance: null,
  },
  {
    id: 3,
    name: 'Sentul Police Station',
    type: 'police_station',
    category: 'police',
    lat: 3.1889,
    lng: 101.6944,
    address: 'Jalan Sentul, Kuala Lumpur',
    phone: '+60 3-4042 2222',
    is24Hours: true,
    description: 'Police station in Sentul area',
    distance: null,
  },

  // Clinics/Hospitals
  {
    id: 4,
    name: 'Kuala Lumpur General Hospital',
    type: 'hospital',
    category: 'medical',
    lat: 3.1478,
    lng: 101.6886,
    address: 'Jalan Pahang, Kuala Lumpur',
    phone: '+60 3-2615 5555',
    is24Hours: true,
    description: 'Public hospital with emergency services',
    distance: null,
  },
  {
    id: 5,
    name: 'Gleneagles Hospital Kuala Lumpur',
    type: 'hospital',
    category: 'medical',
    lat: 3.1578,
    lng: 101.7120,
    address: '282 Jalan Ampang, Kuala Lumpur',
    phone: '+60 3-4141 3000',
    is24Hours: true,
    description: 'Private hospital with 24-hour emergency',
    distance: null,
  },
  {
    id: 6,
    name: 'Pantai Hospital Kuala Lumpur',
    type: 'hospital',
    category: 'medical',
    lat: 3.1234,
    lng: 101.6789,
    address: '8 Jalan Bukit Pantai, Kuala Lumpur',
    phone: '+60 3-2296 0888',
    is24Hours: true,
    description: 'Private hospital with emergency department',
    distance: null,
  },
  {
    id: 7,
    name: 'KL City Medical Centre',
    type: 'clinic',
    category: 'medical',
    lat: 3.1390,
    lng: 101.6869,
    address: 'Lot 2.01, Level 2, Nu Sentral, KL Sentral',
    phone: '+60 3-2272 1000',
    is24Hours: false,
    description: 'Medical clinic in shopping mall',
    distance: null,
  },

  // 24-Hour Stores
  {
    id: 8,
    name: '7-Eleven KLCC',
    type: 'store',
    category: '24hour_store',
    lat: 3.1578,
    lng: 101.7120,
    address: 'Suria KLCC, Kuala Lumpur City Centre',
    phone: '+60 3-2382 2828',
    is24Hours: true,
    description: '24-hour convenience store',
    distance: null,
  },
  {
    id: 9,
    name: '7-Eleven Bukit Bintang',
    type: 'store',
    category: '24hour_store',
    lat: 3.1478,
    lng: 101.7020,
    address: 'Jalan Bukit Bintang, Kuala Lumpur',
    phone: '+60 3-2148 2828',
    is24Hours: true,
    description: '24-hour convenience store in shopping district',
    distance: null,
  },
  {
    id: 10,
    name: 'KK Super Mart KL Sentral',
    type: 'store',
    category: '24hour_store',
    lat: 3.1344,
    lng: 101.6869,
    address: 'KL Sentral Station, Kuala Lumpur',
    phone: '+60 3-2274 1000',
    is24Hours: true,
    description: '24-hour convenience store at train station',
    distance: null,
  },
  {
    id: 11,
    name: 'MyNews.com KLCC',
    type: 'store',
    category: '24hour_store',
    lat: 3.1578,
    lng: 101.7100,
    address: 'Avenue K, Kuala Lumpur',
    phone: '+60 3-2161 2828',
    is24Hours: true,
    description: '24-hour newsstand and convenience store',
    distance: null,
  },

  // Well-lit Public Areas
  {
    id: 12,
    name: 'KLCC Park',
    type: 'public_area',
    category: 'well_lit_area',
    lat: 3.1578,
    lng: 101.7120,
    address: 'Kuala Lumpur City Centre Park',
    phone: null,
    is24Hours: true,
    description: 'Well-lit public park with security',
    distance: null,
  },
  {
    id: 13,
    name: 'Merdeka Square',
    type: 'public_area',
    category: 'well_lit_area',
    lat: 3.1478,
    lng: 101.6944,
    address: 'Jalan Raja, Kuala Lumpur',
    phone: null,
    is24Hours: true,
    description: 'Historic square with good lighting and security',
    distance: null,
  },
  {
    id: 14,
    name: 'Taman Tasik Titiwangsa',
    type: 'public_area',
    category: 'well_lit_area',
    lat: 3.1725,
    lng: 101.7008,
    address: 'Titiwangsa, Kuala Lumpur',
    phone: null,
    is24Hours: true,
    description: 'Large public park with lake and good lighting',
    distance: null,
  },
  {
    id: 15,
    name: 'KL Sentral Station',
    type: 'public_area',
    category: 'well_lit_area',
    lat: 3.1344,
    lng: 101.6869,
    address: 'KL Sentral, Kuala Lumpur',
    phone: '+60 3-2274 1000',
    is24Hours: true,
    description: 'Major transportation hub with 24-hour security',
    distance: null,
  },
  {
    id: 16,
    name: 'Pavilion KL Shopping Mall',
    type: 'public_area',
    category: 'well_lit_area',
    lat: 3.1494,
    lng: 101.7120,
    address: '168 Jalan Bukit Bintang, Kuala Lumpur',
    phone: '+60 3-2118 8833',
    is24Hours: false,
    description: 'Shopping mall with good lighting and security',
    distance: null,
  },
]

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * GET /api/safe-spots
 * Get nearest safe spots based on coordinates
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSafeSpots = async (req, res) => {
  try {
    const { lat, lng, radius = 10, category } = req.query

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

    const radiusKm = parseFloat(radius) || 10

    // Calculate distances for all safe spots
    const safeSpotsWithDistance = MOCK_SAFE_SPOTS.map((spot) => {
      const distance = calculateDistance(latitude, longitude, spot.lat, spot.lng)
      return {
        ...spot,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
      }
    })

    // Filter by radius
    let filteredSpots = safeSpotsWithDistance.filter((spot) => spot.distance <= radiusKm)

    // Filter by category if provided
    if (category) {
      const validCategories = ['police', 'medical', '24hour_store', 'well_lit_area']
      if (validCategories.includes(category)) {
        filteredSpots = filteredSpots.filter((spot) => spot.category === category)
      }
    }

    // Sort by distance (nearest first)
    filteredSpots.sort((a, b) => a.distance - b.distance)

    // If no spots found within radius, return nearest 5 anyway
    if (filteredSpots.length === 0) {
      filteredSpots = safeSpotsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
    }

    // Group by category for better organization
    const groupedByCategory = {
      police: filteredSpots.filter((spot) => spot.category === 'police'),
      medical: filteredSpots.filter((spot) => spot.category === 'medical'),
      '24hour_store': filteredSpots.filter((spot) => spot.category === '24hour_store'),
      well_lit_area: filteredSpots.filter((spot) => spot.category === 'well_lit_area'),
    }

    res.json({
      success: true,
      data: filteredSpots,
      grouped: groupedByCategory,
      count: filteredSpots.length,
      location: {
        lat: latitude,
        lng: longitude,
      },
      radius: radiusKm,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching safe spots:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch safe spots',
      error: error.message,
    })
  }
}

export default {
  getSafeSpots,
}


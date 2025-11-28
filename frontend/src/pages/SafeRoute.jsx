import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import RouteSummaryCard from '../components/RouteSummaryCard'
import LoaderAnimation from '../components/LoaderAnimation'
import api from '../services/api'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons
const createCustomIcon = (color, iconText) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${iconText}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

const userLocationIcon = createCustomIcon('#3b82f6', '📍')
const startIcon = createCustomIcon('#10b981', 'S')
const destinationIcon = createCustomIcon('#ef4444', 'D')

// Component to fit bounds
const FitBounds = ({ bounds }) => {
  const map = useMap()
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      const latLngBounds = L.latLngBounds(bounds)
      map.fitBounds(latLngBounds, { padding: [50, 50] })
    }
  }, [bounds, map])
  
  return null
}

const SafeRoute = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [safetyData, setSafetyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [showAlternativeRoute, setShowAlternativeRoute] = useState(false)

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          fetchSafetyData(location.lat, location.lng)
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Unable to get your location. Please enable location services.')
          setLoading(false)
          // Use default location for development (Kuala Lumpur)
          const defaultLocation = { lat: 3.1390, lng: 101.6869 }
          setUserLocation(defaultLocation)
          fetchSafetyData(defaultLocation.lat, defaultLocation.lng)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      )
    } else {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
      const defaultLocation = { lat: 3.1390, lng: 101.6869 }
      setUserLocation(defaultLocation)
      fetchSafetyData(defaultLocation.lat, defaultLocation.lng)
    }
  }, [])

  const fetchSafetyData = async (lat, lng, originAddr = null, destAddr = null) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/surroundings', {
        params: {
          lat,
          lng,
          ...(originAddr && { origin: originAddr }),
          ...(destAddr && { destination: destAddr }),
        },
      })

      if (response.data && response.data.success) {
        setSafetyData(response.data.data)
        if (response.data.data.alternativeRoute) {
          setSelectedRoute(response.data.data.alternativeRoute)
        }
      } else {
        throw new Error(response.data?.message || 'Invalid response from server')
      }
    } catch (error) {
      console.error('Error fetching safety data:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch safety data. Please check if the backend server is running.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePlanRoute = () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination')
      return
    }

    if (userLocation) {
      fetchSafetyData(userLocation.lat, userLocation.lng, origin, destination)
    }
  }

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setOrigin(`${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`)
    } else {
      setError('Unable to get your current location')
    }
  }

  const getSafetyScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getSafetyScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-500'
    if (score >= 60) return 'bg-yellow-100 border-yellow-500'
    if (score >= 40) return 'bg-orange-100 border-orange-500'
    return 'bg-red-100 border-red-500'
  }

  // Prepare map bounds
  const mapBounds = userLocation && safetyData
    ? [
        [userLocation.lat, userLocation.lng],
        ...(safetyData.unsafeZones || []).flatMap((zone) => zone.bounds || []),
        ...(safetyData.safeZones || []).flatMap((zone) => zone.bounds || []),
      ]
    : userLocation
    ? [[userLocation.lat, userLocation.lng]]
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SafeRoute</h1>
        <p className="text-gray-600">
          Plan safe routes with real-time safety analysis and avoid unsafe zones
        </p>
      </div>

      {/* Route Input Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Plan Your Safe Route</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Origin</label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                disabled={!userLocation}
              >
                Use Current Location
              </button>
            </div>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting location or address"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination or address"
              className="input-field"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handlePlanRoute}
            disabled={!origin || !destination || loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing Route...' : 'Analyze Route Safety'}
          </button>
        </div>
      </div>

      {/* Safety Score Card */}
      {safetyData && (
        <div className={`card border-2 ${getSafetyScoreBg(safetyData.overallSafetyScore)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Safety Score</h3>
              <p className="text-sm text-gray-600">
                Based on analysis of your current location and route
              </p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getSafetyScoreColor(safetyData.overallSafetyScore)}`}>
                {safetyData.overallSafetyScore}
              </div>
              <div className="text-xs text-gray-600 mt-1">out of 100</div>
            </div>
          </div>
        </div>
      )}

      {/* Map and Route Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading && !userLocation ? (
            <div className="card">
              <LoaderAnimation text="Getting your location and analyzing safety..." />
            </div>
          ) : userLocation ? (
            <div className="card p-0 overflow-hidden">
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{ height: '500px', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location Marker */}
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                  <Popup>Your Location</Popup>
                </Marker>

                {/* Safe Zones - Green */}
                {safetyData?.safeZones?.map((zone) => (
                  <Polygon
                    key={`safe-${zone.id}`}
                    positions={zone.bounds}
                    pathOptions={{
                      color: '#10b981',
                      fillColor: '#10b981',
                      fillOpacity: 0.2,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div>
                        <strong className="text-green-700">{zone.name}</strong>
                        <br />
                        Safety Score: {zone.safetyScore}
                        <br />
                        <small className="text-gray-600">
                          {zone.reasons?.join(', ') || 'Safe area'}
                        </small>
                      </div>
                    </Popup>
                  </Polygon>
                ))}

                {/* Unsafe Zones - Red */}
                {safetyData?.unsafeZones?.map((zone) => (
                  <Polygon
                    key={`unsafe-${zone.id}`}
                    positions={zone.bounds}
                    pathOptions={{
                      color: '#ef4444',
                      fillColor: '#ef4444',
                      fillOpacity: 0.4,
                      weight: 3,
                    }}
                  >
                    <Popup>
                      <div>
                        <strong className="text-red-700">⚠️ {zone.name}</strong>
                        <br />
                        Safety Score: {zone.safetyScore}
                        <br />
                        Severity: {zone.severity}
                        <br />
                        <small className="text-gray-600">
                          {zone.reasons?.join(', ') || 'Unsafe area'}
                        </small>
                      </div>
                    </Popup>
                  </Polygon>
                ))}

                {/* Alternative Safe Route */}
                {showAlternativeRoute && selectedRoute && selectedRoute.path && (
                  <>
                    <Polyline
                      positions={selectedRoute.path}
                      pathOptions={{
                        color: '#10b981',
                        weight: 5,
                        opacity: 0.8,
                      }}
                    >
                      <Popup>
                        <div>
                          <strong>Safe Route Alternative</strong>
                          <br />
                          Distance: {selectedRoute.distance} km
                          <br />
                          Duration: {selectedRoute.duration} min
                          <br />
                          Safety Score: {selectedRoute.safetyScore}
                        </div>
                      </Popup>
                    </Polyline>
                    {selectedRoute.path[0] && (
                      <Marker position={selectedRoute.path[0]} icon={startIcon}>
                        <Popup>Start</Popup>
                      </Marker>
                    )}
                    {selectedRoute.path[selectedRoute.path.length - 1] && (
                      <Marker
                        position={selectedRoute.path[selectedRoute.path.length - 1]}
                        icon={destinationIcon}
                      >
                        <Popup>Destination</Popup>
                      </Marker>
                    )}
                  </>
                )}

                {/* Fit bounds to show all zones */}
                {mapBounds.length > 0 && <FitBounds bounds={mapBounds} />}
              </MapContainer>

              {/* Map Legend */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Safe Zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Unsafe Zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500 bg-transparent"></div>
                    <span>Safe Route</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <p className="text-gray-500 text-center py-8">
                Unable to load map. Please enable location services.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Route Summary */}
          {selectedRoute && (
            <RouteSummaryCard
              route={{
                distance: selectedRoute.distance,
                duration: selectedRoute.duration,
                safetyScore: selectedRoute.safetyScore,
              }}
            />
          )}

          {/* Alternative Route Card */}
          {safetyData?.alternativeRoute && (
            <div className="card bg-green-50 border-2 border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🛡️ Safe Route Available
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Safety Score:</span>
                  <span className="font-bold text-green-600">
                    {safetyData.alternativeRoute.safetyScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium text-gray-900">
                    {safetyData.alternativeRoute.distance} km
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">
                    {safetyData.alternativeRoute.duration} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avoids Unsafe Zones:</span>
                  <span className="font-medium text-gray-900">
                    {safetyData.alternativeRoute.avoidsUnsafeZones}
                  </span>
                </div>
                <button
                  onClick={() => setShowAlternativeRoute(!showAlternativeRoute)}
                  className="mt-4 w-full btn-primary"
                >
                  {showAlternativeRoute ? 'Hide Safe Route' : 'Show Safe Route on Map'}
                </button>
              </div>
            </div>
          )}

          {/* Safety Recommendations */}
          {safetyData?.recommendations && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {safetyData.recommendations.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unsafe Zones List */}
          {safetyData?.unsafeZones && safetyData.unsafeZones.length > 0 && (
            <div className="card bg-red-50 border-2 border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-3">
                ⚠️ Unsafe Zones Detected
              </h3>
              <div className="space-y-3">
                {safetyData.unsafeZones.map((zone) => (
                  <div key={zone.id} className="border-l-4 border-red-500 pl-3">
                    <div className="font-semibold text-red-900">{zone.name}</div>
                    <div className="text-xs text-red-700 mt-1">
                      Safety Score: {zone.safetyScore} | Severity: {zone.severity}
                    </div>
                    {zone.reasons && (
                      <div className="text-xs text-red-600 mt-1">
                        {zone.reasons.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SafeRoute

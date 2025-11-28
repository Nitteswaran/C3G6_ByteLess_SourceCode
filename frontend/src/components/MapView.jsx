import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons for start and destination
const createCustomIcon = (color, iconText) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${iconText}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

const startIcon = createCustomIcon('#10b981', 'S')
const destinationIcon = createCustomIcon('#ef4444', 'D')
const userLocationIcon = createCustomIcon('#3b82f6', '📍')
const aqiGoodIcon = createCustomIcon('#00e400', '🌿')

// Component to handle map updates
const MapUpdater = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, zoom, map])
  
  return null
}

// Component to fit bounds when route is available
const FitBounds = ({ route }) => {
  const map = useMap()
  
  useEffect(() => {
    if (route && route.path && route.path.length > 0) {
      const bounds = L.latLngBounds(route.path)
      if (route.start) bounds.extend(route.start)
      if (route.destination) bounds.extend(route.destination)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [route, map])
  
  return null
}

// Component to get user location
const LocationMarker = ({ onLocationFound, showUserLocation }) => {
  const [position, setPosition] = useState(null)
  const map = useMap()

  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const loc = [latitude, longitude]
          setPosition(loc)
          if (onLocationFound) {
            onLocationFound(loc)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )

      return () => {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [showUserLocation, onLocationFound])

  return position ? (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>Your Location</Popup>
    </Marker>
  ) : null
}

const MapView = ({ 
  center = [51.505, -0.09], 
  zoom = 13, 
  markers = [],
  route = null,
  height = '400px',
  className = '',
  showUserLocation = false,
  onLocationFound,
  onMapClick,
  showControls = true
}) => {
  const mapRef = useRef(null)

  // Convert route path to polyline coordinates
  const getRoutePath = () => {
    if (!route || !route.path) return []
    return route.path.map(point => [point.lat || point[0], point.lng || point[1]])
  }

  // Get unsafe segments from route
  const getUnsafeSegments = () => {
    if (!route || !route.unsafeSegments) return []
    return route.unsafeSegments.map(segment => ({
      path: segment.path.map(point => [point.lat || point[0], point.lng || point[1]]),
      severity: segment.severity || 'medium',
    }))
  }

  const routePath = getRoutePath()
  const unsafeSegments = getUnsafeSegments()

  // Determine map center - prefer route bounds, then route start, then provided center
  const mapCenter = route?.start 
    ? [route.start.lat || route.start[0], route.start.lng || route.start[1]]
    : center

  return (
    <div className={`w-full rounded-lg overflow-hidden shadow-md ${className}`} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={mapCenter} zoom={zoom} />
        <FitBounds route={route} />
        
        {/* User Location */}
        {showUserLocation && (
          <LocationMarker 
            onLocationFound={onLocationFound}
            showUserLocation={showUserLocation}
          />
        )}

        {/* Route Path - Safe segments in blue */}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#3b82f6',
              weight: 5,
              opacity: 0.7,
            }}
          />
        )}

        {/* Unsafe Segments - Highlighted in red */}
        {unsafeSegments.map((segment, index) => (
          <Polyline
            key={`unsafe-${index}`}
            positions={segment.path}
            pathOptions={{
              color: segment.severity === 'high' ? '#dc2626' : '#f97316',
              weight: 8,
              opacity: 0.9,
            }}
          />
        ))}

        {/* Start Marker */}
        {route?.start && (
          <Marker 
            position={[route.start.lat || route.start[0], route.start.lng || route.start[1]]}
            icon={startIcon}
          >
            <Popup>
              <div className="font-semibold">Start</div>
              {route.start.address && <div className="text-sm text-gray-600">{route.start.address}</div>}
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {route?.destination && (
          <Marker 
            position={[route.destination.lat || route.destination[0], route.destination.lng || route.destination[1]]}
            icon={destinationIcon}
          >
            <Popup>
              <div className="font-semibold">Destination</div>
              {route.destination.address && <div className="text-sm text-gray-600">{route.destination.address}</div>}
            </Popup>
          </Marker>
        )}

        {/* Additional Markers */}
        {markers.map((marker, index) => {
          // Use custom icon based on marker type
          let icon = null
          if (marker.type === 'user') {
            icon = userLocationIcon
          } else if (marker.type === 'aqi') {
            icon = aqiGoodIcon
          } else if (marker.type === 'start') {
            icon = startIcon
          } else if (marker.type === 'destination') {
            icon = destinationIcon
          }

          return (
            <Marker 
              key={index} 
              position={[marker.lat, marker.lng]}
              icon={icon || undefined}
            >
              {marker.popup && <Popup>{marker.popup}</Popup>}
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default MapView

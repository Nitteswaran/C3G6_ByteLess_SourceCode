import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const Tracking = () => {
  const mapRef = useRef(null)

  // Default location (you can update this with real coordinates)
  const defaultPosition = [51.505, -0.09] // London coordinates

  useEffect(() => {
    // Initialize Socket.IO connection for live tracking
    // This will be implemented when backend is ready
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
      
      <div className="card p-0 overflow-hidden">
        <div className="h-[400px] md:h-[600px] w-full">
          <MapContainer
            center={defaultPosition}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={defaultPosition}>
              <Popup>
                Current Location
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Route Information</h2>
          <p className="text-gray-600">No active route</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Status</h2>
          <p className="text-green-600 font-medium">Ready to track</p>
        </div>
      </div>
    </div>
  )
}

export default Tracking


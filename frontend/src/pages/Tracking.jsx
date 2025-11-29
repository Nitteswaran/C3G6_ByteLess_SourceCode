import { useEffect } from 'react'
import MapView from '../components/MapView'

const Tracking = () => {
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
        <MapView
          center={defaultPosition}
          zoom={13}
          height="600px"
          showUserLocation={true}
          markers={[
            {
              lat: defaultPosition[0],
              lng: defaultPosition[1],
              popup: 'Current Location',
            },
          ]}
        />
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


import { useState } from 'react'
import { Link } from 'react-router-dom'

const Emergency = () => {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emergency-red to-emergency-orange rounded-lg p-8 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Emergency Mode</h1>
        <p className="text-xl mb-6">Quick access to emergency services and alerts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card border-2 border-emergency-red">
          <h2 className="text-2xl font-bold text-emergency-red mb-4">Emergency Alert</h2>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`btn-emergency w-full mb-4 ${
              isActive ? 'bg-emergency-dark' : ''
            }`}
          >
            {isActive ? 'Deactivate Alert' : 'Activate Emergency Alert'}
          </button>
          {isActive && (
            <div className="bg-red-50 border border-emergency-red rounded-lg p-4">
              <p className="text-emergency-red font-semibold">
                ⚠️ Emergency alert is active. Authorities have been notified.
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              📞 Call Emergency Services
            </button>
            <button className="w-full btn-secondary text-left">
              📍 Share Location
            </button>
            <Link to="/tracking" className="block w-full btn-primary text-center">
              🗺️ View on Map
            </Link>
          </div>
        </div>
      </div>

      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notice</h3>
        <p className="text-yellow-700 text-sm">
          In case of a real emergency, please call your local emergency services immediately.
          This system is for tracking and coordination purposes only.
        </p>
      </div>
    </div>
  )
}

export default Emergency


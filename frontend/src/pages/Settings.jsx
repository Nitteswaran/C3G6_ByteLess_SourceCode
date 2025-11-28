import { useState } from 'react'

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    emergencyAutoCall: false,
    shareWithGuardians: true,
    darkMode: false,
  })

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your app preferences</p>
      </div>

      {/* Privacy Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Location Tracking</div>
              <div className="text-sm text-gray-600">
                Allow app to track your location
              </div>
            </div>
            <button
              onClick={() => handleToggle('locationTracking')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.locationTracking ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.locationTracking ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Share with Guardians</div>
              <div className="text-sm text-gray-600">
                Allow guardians to see your location
              </div>
            </div>
            <button
              onClick={() => handleToggle('shareWithGuardians')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.shareWithGuardians ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.shareWithGuardians ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Push Notifications</div>
              <div className="text-sm text-gray-600">
                Receive notifications about route updates
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Emergency</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto-call Emergency</div>
              <div className="text-sm text-gray-600">
                Automatically call emergency services when SOS is activated
              </div>
            </div>
            <button
              onClick={() => handleToggle('emergencyAutoCall')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emergencyAutoCall ? 'bg-emergency-red' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emergencyAutoCall ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Dark Mode</div>
              <div className="text-sm text-gray-600">
                Switch to dark theme
              </div>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="space-y-3">
          <button className="btn-primary w-full text-left">
            Edit Profile
          </button>
          <button className="btn-secondary w-full text-left">
            Change Password
          </button>
          <button className="text-red-600 hover:text-red-700 font-medium w-full text-left">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings


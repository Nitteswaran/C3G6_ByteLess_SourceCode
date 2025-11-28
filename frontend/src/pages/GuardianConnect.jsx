import { useState, useEffect } from 'react'
import MapView from '../components/MapView'
import LoaderAnimation from '../components/LoaderAnimation'
import api from '../services/api'

const GuardianConnect = () => {
  const [guardians, setGuardians] = useState([])
  const [loading, setLoading] = useState(true)
  const [sharingLocation, setSharingLocation] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'other',
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Fetch guardians on mount
  useEffect(() => {
    fetchGuardians()
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const fetchGuardians = async () => {
    setLoading(true)
    try {
      const response = await api.get('/guardians')
      if (response.data.success) {
        setGuardians(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching guardians:', error)
      // For development, use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        setGuardians([
          { _id: '1', name: 'Mom', phone: '+1234567890', email: '', relationship: 'family' },
          { _id: '2', name: 'Dad', phone: '+1234567891', email: '', relationship: 'family' },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!formData.phone && !formData.email) {
      errors.contact = 'Either phone or email is required'
    }
    
    if (formData.phone && formData.phone.trim()) {
      // More flexible phone validation - just check for minimum digits
      const digitsOnly = formData.phone.replace(/[^\d+]/g, '').replace(/\+/g, '')
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        errors.phone = 'Phone number must have 7-15 digits'
      }
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const response = await api.post('/guardians', formData)
      
      if (response.data.success) {
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          relationship: 'other',
        })
        setShowAddForm(false)
        // Refresh guardians list
        fetchGuardians()
      }
    } catch (error) {
      console.error('Error adding guardian:', error)
      console.error('Error response:', error.response)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      
      let errorMessage = 'Failed to add guardian'
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check if the backend server is running.'
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage
      }
      
      alert(errorMessage)
      setFormErrors({ submit: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this guardian?')) {
      return
    }

    try {
      const response = await api.delete(`/guardians/${id}`)
      
      if (response.data.success) {
        // Refresh guardians list
        fetchGuardians()
      }
    } catch (error) {
      console.error('Error deleting guardian:', error)
      alert('Failed to remove guardian. Please try again.')
    }
  }

  const handleTestAlert = async (id, name) => {
    try {
      const response = await api.post(`/guardians/${id}/test-alert`)
      
      if (response.data.success) {
        alert(`Test alert sent to ${name}!`)
        // Refresh to update lastNotified timestamp
        fetchGuardians()
      }
    } catch (error) {
      console.error('Error sending test alert:', error)
      alert('Failed to send test alert. Please try again.')
    }
  }

  const handleShareLocation = () => {
    setSharingLocation(!sharingLocation)
    // In real app, this would trigger location sharing via Socket.IO
  }

  const getRelationshipIcon = (relationship) => {
    const icons = {
      family: '👨‍👩‍👧‍👦',
      friend: '👫',
      colleague: '💼',
      other: '👤',
    }
    return icons[relationship] || icons.other
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guardian Connect</h1>
        <p className="text-gray-600">Stay connected with your trusted guardians</p>
      </div>

      {/* Location Sharing Toggle */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Location Sharing</h2>
            <p className="text-sm text-gray-600">
              {sharingLocation
                ? 'Your location is being shared with guardians'
                : 'Location sharing is off'}
            </p>
          </div>
          <button
            onClick={handleShareLocation}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              sharingLocation
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {sharingLocation ? 'Stop Sharing' : 'Start Sharing'}
          </button>
        </div>
      </div>

      {/* Add Guardian Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Add New Guardian</h2>
            <button
              onClick={() => {
                setShowAddForm(false)
                setFormData({ name: '', phone: '', email: '', relationship: 'other' })
                setFormErrors({})
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Guardian's name"
                className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                required
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className={`input-field ${formErrors.phone ? 'border-red-500' : ''}`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="guardian@example.com"
                  className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>

            {formErrors.contact && (
              <p className="text-sm text-red-600">{formErrors.contact}</p>
            )}
            {formErrors.submit && (
              <p className="text-sm text-red-600">{formErrors.submit}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="family">Family</option>
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Guardian'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setFormData({ name: '', phone: '', email: '', relationship: 'other' })
                  setFormErrors({})
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guardians List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Guardians</h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              + Add Guardian
            </button>
          )}
        </div>

        {loading ? (
          <LoaderAnimation text="Loading guardians..." />
        ) : guardians.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No guardians added yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add Your First Guardian
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {guardians.map((guardian) => (
              <div
                key={guardian._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">
                    {getRelationshipIcon(guardian.relationship)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{guardian.name}</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {guardian.phone && <div>📞 {guardian.phone}</div>}
                      {guardian.email && <div>✉️ {guardian.email}</div>}
                      {guardian.lastNotified && (
                        <div className="text-xs text-gray-500">
                          Last notified: {new Date(guardian.lastNotified).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestAlert(guardian._id, guardian.name)}
                    className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                    title="Send test alert"
                  >
                    Test Alert
                  </button>
                  <button
                    onClick={() => handleDelete(guardian._id)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    title="Remove guardian"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shared Location Map */}
      {sharingLocation && userLocation && (
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold">Shared Location</h3>
          </div>
          <MapView
            center={[userLocation.lat, userLocation.lng]}
            zoom={15}
            height="400px"
            showUserLocation={true}
            markers={[
              { lat: userLocation.lat, lng: userLocation.lng, popup: 'Your Location' },
            ]}
          />
        </div>
      )}

      {/* Emergency Contact */}
      <div className="card bg-red-50 border-2 border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Emergency Contact
        </h3>
        <p className="text-sm text-red-700 mb-4">
          In case of emergency, all guardians will be notified automatically.
        </p>
        <button 
          onClick={() => {
            // Navigate to AirSOS page
            window.location.href = '/air-sos?activate=true'
          }}
          className="btn-emergency w-full"
        >
          Activate Emergency Mode
        </button>
      </div>
    </div>
  )
}

export default GuardianConnect

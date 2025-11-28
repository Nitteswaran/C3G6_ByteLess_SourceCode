import { useState, useEffect } from 'react'
import api from '../services/api'
import LoaderAnimation from './LoaderAnimation'

const WeatherCard = ({ location, label, coordinates }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      fetchWeather(coordinates.lat, coordinates.lng)
    }
  }, [coordinates])

  const fetchWeather = async (lat, lng) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/weather', {
        params: { lat, lng },
      })

      if (response.data?.success) {
        setWeather(response.data.data)
      } else {
        throw new Error(response.data?.message || 'Failed to fetch weather')
      }
    } catch (error) {
      console.error('Error fetching weather:', error)
      setError('Unable to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="animate-pulse w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="card">
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            {label}: {error || 'Weather data unavailable'}
          </p>
        </div>
      </div>
    )
  }

  const getWeatherColor = (condition) => {
    const conditionLower = condition?.toLowerCase() || ''
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return 'bg-yellow-50 border-yellow-200'
    }
    if (conditionLower.includes('cloudy')) {
      return 'bg-gray-50 border-gray-200'
    }
    if (conditionLower.includes('rain') || conditionLower.includes('storm')) {
      return 'bg-blue-50 border-blue-200'
    }
    return 'bg-gray-50 border-gray-200'
  }

  return (
    <div className={`card border-2 ${getWeatherColor(weather.condition)}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{label}</h4>
          <p className="text-xs text-gray-500">{location || 'Location'}</p>
        </div>
        <div className="text-3xl">{weather.icon}</div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {weather.temperature}°
          </span>
          <span className="text-sm text-gray-600">
            Feels like {weather.feelsLike}°
          </span>
        </div>

        <div className="text-sm font-medium text-gray-700">
          {weather.condition}
        </div>
        <div className="text-xs text-gray-600">{weather.description}</div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-500">Humidity</div>
            <div className="text-sm font-semibold text-gray-900">
              {weather.humidity}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Wind</div>
            <div className="text-sm font-semibold text-gray-900">
              {weather.windSpeed} km/h {weather.windDirection}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">UV Index</div>
            <div className="text-sm font-semibold text-gray-900">
              {weather.uvIndex}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Visibility</div>
            <div className="text-sm font-semibold text-gray-900">
              {weather.visibility} km
            </div>
          </div>
        </div>

        {weather.precipitation && (
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">Precipitation</div>
            <div className="text-sm font-semibold text-gray-900">
              {weather.precipitation} mm
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherCard


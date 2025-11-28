import { useEffect, useRef, useState } from 'react'

// Google Maps API key - should be in environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const GoogleMapView = ({
  center = { lat: 3.1390, lng: 101.6869 }, // Default: Kuala Lumpur
  zoom = 13,
  height = '400px',
  className = '',
  route = null,
  origin = null,
  destination = null,
  onRouteLoad = null,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const directionsService = useRef(null)
  const directionsRenderer = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [error, setError] = useState(null)

  // Load Google Maps script
  useEffect(() => {
    if (scriptLoaded || !GOOGLE_MAPS_API_KEY) return

    // Check if script already exists
    if (window.google && window.google.maps) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,directions`
    script.async = true
    script.defer = true
    script.onload = () => {
      setScriptLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Google Maps script')
      setError('Failed to load Google Maps. Please check your API key and network connection.')
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [scriptLoaded])

  // Initialize map
  useEffect(() => {
    if (!scriptLoaded || !mapContainer.current || map.current) return

    try {
      const centerCoords = typeof center === 'object' && center.lat && center.lng
        ? center
        : { lat: 3.1390, lng: 101.6869 } // Default to Kuala Lumpur

      map.current = new window.google.maps.Map(mapContainer.current, {
        center: centerCoords,
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      })

      directionsService.current = new window.google.maps.DirectionsService()
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        map: map.current,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      })

      setMapLoaded(true)
      console.log('✅ Google Maps initialized successfully')
      console.log('API Key loaded:', GOOGLE_MAPS_API_KEY ? 'Yes' : 'No')
    } catch (error) {
      console.error('❌ Error initializing Google Maps:', error)
    }
  }, [scriptLoaded, center, zoom])

  // Load route
  useEffect(() => {
    if (!mapLoaded || !directionsService.current || !directionsRenderer.current) return
    if (!origin || !destination) {
      // Clear existing route if origin/destination is removed
      if (directionsRenderer.current) {
        directionsRenderer.current.setDirections({ routes: [] })
      }
      return
    }

    // Format origin and destination for Google Maps API
    let originFormatted = origin
    let destinationFormatted = destination

    // If it's an object with lat/lng, convert to string
    if (typeof origin === 'object' && origin.lat && origin.lng) {
      originFormatted = `${origin.lat},${origin.lng}`
    }
    if (typeof destination === 'object' && destination.lat && destination.lng) {
      destinationFormatted = `${destination.lat},${destination.lng}`
    }

    console.log('Requesting route from:', originFormatted, 'to:', destinationFormatted)

    const request = {
      origin: originFormatted,
      destination: destinationFormatted,
      travelMode: window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    }

    directionsService.current.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        console.log('Route loaded successfully:', result)
        directionsRenderer.current.setDirections(result)

        // Get route data
        const route = result.routes[0]
        const leg = route.legs[0]

        // Calculate total distance and duration
        let totalDistance = 0
        let totalDuration = 0

        route.legs.forEach((leg) => {
          totalDistance += leg.distance.value // meters
          totalDuration += leg.duration.value // seconds
        })

        // Extract steps
        const steps = leg.steps.map((step, index) => ({
          instruction: step.instructions,
          distance: step.distance.value, // meters
          duration: step.duration.value, // seconds
          start_location: {
            lat: step.start_location.lat(),
            lng: step.start_location.lng(),
          },
          end_location: {
            lat: step.end_location.lat(),
            lng: step.end_location.lng(),
          },
        }))

        // Callback with route data
        if (onRouteLoad) {
          onRouteLoad({
            distance: totalDistance / 1000, // km
            duration: Math.round(totalDuration / 60), // minutes
            steps: steps,
            start: {
              lat: leg.start_location.lat(),
              lng: leg.start_location.lng(),
              address: leg.start_address,
            },
            destination: {
              lat: leg.end_location.lat(),
              lng: leg.end_location.lng(),
              address: leg.end_address,
            },
            alternatives: result.routes.slice(1).map((altRoute) => ({
              distance: altRoute.legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000,
              duration: Math.round(
                altRoute.legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60
              ),
            })),
          })
        }
      } else {
        console.error('Directions request failed:', status)
        // Show user-friendly error messages
        let errorMessage = 'Failed to get directions'
        switch (status) {
          case window.google.maps.DirectionsStatus.ZERO_RESULTS:
            errorMessage = 'No route found between the selected locations'
            break
          case window.google.maps.DirectionsStatus.NOT_FOUND:
            errorMessage = 'One or both locations could not be found'
            break
          case window.google.maps.DirectionsStatus.REQUEST_DENIED:
            errorMessage = 'Directions request was denied. Please check your API key permissions'
            break
          case window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
            errorMessage = 'API quota exceeded. Please try again later'
            break
          default:
            errorMessage = `Directions request failed: ${status}`
        }
        console.error(errorMessage)
      }
    })
  }, [mapLoaded, origin, destination, onRouteLoad])

  // Show warning if no API key
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div
        className={`w-full rounded-lg overflow-hidden shadow-md relative bg-gray-100 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg text-sm max-w-md mx-4">
          <p className="font-semibold mb-2">⚠️ Google Maps API Key Required</p>
          <p className="text-xs mb-2">
            Add your Google Maps API key to{' '}
            <code className="bg-yellow-200 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in your{' '}
            <code className="bg-yellow-200 px-1 rounded">.env</code> file.
          </p>
          <p className="text-xs">
            Get a free API key at:{' '}
            <a
              href="https://console.cloud.google.com/google/maps-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-yellow-800"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full rounded-lg overflow-hidden shadow-md relative ${className}`} style={{ height }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
      {!scriptLoaded && GOOGLE_MAPS_API_KEY && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm z-10">
          <p className="font-semibold">⚠️ Error</p>
          <p>{error}</p>
        </div>
      )}
      {mapLoaded && (
        <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg text-xs z-10">
          ✓ Map Loaded
        </div>
      )}
    </div>
  )
}

export default GoogleMapView


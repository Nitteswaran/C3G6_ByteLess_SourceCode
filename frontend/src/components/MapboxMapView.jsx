import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Mapbox access token - should be in environment variable
// Get your free token at: https://account.mapbox.com/access-tokens/
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

const MapboxMapView = ({
  center = [101.6869, 3.1390], // Default: Kuala Lumpur
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
  const [mapLoaded, setMapLoaded] = useState(false)
  const [trafficData, setTrafficData] = useState(null)

  // Initialize map
  useEffect(() => {
    if (map.current || !MAPBOX_TOKEN) {
      if (!MAPBOX_TOKEN) {
        console.warn('Mapbox token not found. Map will not render.')
      }
      return
    }

    if (!mapContainer.current) {
      console.warn('Map container not available')
      return
    }

    mapboxgl.accessToken = MAPBOX_TOKEN

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      })

      map.current.on('load', () => {
        setMapLoaded(true)
        console.log('Mapbox map loaded successfully')
      })

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
      })

      return () => {
        if (map.current) {
          map.current.remove()
          map.current = null
        }
      }
    } catch (error) {
      console.error('Error initializing Mapbox map:', error)
    }
  }, [center, zoom])

  // Update map center
  useEffect(() => {
    if (map.current && center) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        duration: 1000,
      })
    }
  }, [center, zoom])

  // Load route using Mapbox Directions API
  useEffect(() => {
    if (!map.current || !mapLoaded || !origin || !destination || !MAPBOX_TOKEN) return

    const loadRoute = async () => {
      try {
        // Geocode addresses to coordinates if needed
        let originCoords = origin
        let destCoords = destination

        // If origin/destination are strings (addresses), geocode them
        if (typeof origin === 'string' && !origin.includes(',')) {
          const originGeo = await geocodeAddress(origin)
          if (originGeo) originCoords = originGeo
          else return // Failed to geocode
        } else if (typeof origin === 'string' && origin.includes(',')) {
          // Parse coordinate string "lat,lng" to [lng, lat]
          const [lat, lng] = origin.split(',').map(Number)
          originCoords = [lng, lat]
        }
        
        if (typeof destination === 'string' && !destination.includes(',')) {
          const destGeo = await geocodeAddress(destination)
          if (destGeo) destCoords = destGeo
          else return // Failed to geocode
        } else if (typeof destination === 'string' && destination.includes(',')) {
          // Parse coordinate string "lat,lng" to [lng, lat]
          const [lat, lng] = destination.split(',').map(Number)
          destCoords = [lng, lat]
        }

        // Format coordinates for Mapbox API (always [lng, lat])
        const originStr = Array.isArray(originCoords) 
          ? `${originCoords[0]},${originCoords[1]}` 
          : `${originCoords.lng || originCoords[1]},${originCoords.lat || originCoords[0]}`
        const destStr = Array.isArray(destCoords)
          ? `${destCoords[0]},${destCoords[1]}`
          : `${destCoords.lng || destCoords[1]},${destCoords.lat || destCoords[0]}`

        // Fetch route from Mapbox Directions API
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${originStr};${destStr}?` +
          `access_token=${MAPBOX_TOKEN}&` +
          `geometries=geojson&` +
          `overview=full&` +
          `steps=true&` +
          `annotations=duration,distance,congestion`
        )

        const data = await response.json()

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const routeData = data.routes[0]
          const geometry = routeData.geometry

          // Remove existing route layer if it exists
          if (map.current.getLayer('route')) {
            map.current.removeLayer('route')
          }
          if (map.current.getSource('route')) {
            map.current.removeSource('route')
          }

          // Add route to map
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: geometry,
            },
          })

          // Add route layer with traffic-based coloring
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 5,
              'line-opacity': 0.75,
            },
          })

          // Add traffic congestion visualization if available
          if (routeData.legs && routeData.legs[0].annotation?.congestion) {
            const congestion = routeData.legs[0].annotation.congestion
            addTrafficCongestion(geometry, congestion)
          }

          // Add markers for origin and destination
          addMarkers(originCoords, destCoords)

          // Fit map to route bounds
          const coordinates = geometry.coordinates
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord)
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))

          map.current.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
          })

          // Callback with route data
          if (onRouteLoad) {
            onRouteLoad({
              distance: routeData.distance / 1000, // Convert to km
              duration: Math.round(routeData.duration / 60), // Convert to minutes
              geometry: geometry,
              steps: routeData.legs[0].steps,
              congestion: routeData.legs[0].annotation?.congestion,
            })
          }
        }
      } catch (error) {
        console.error('Error loading route:', error)
      }
    }

    loadRoute()
  }, [mapLoaded, origin, destination, onRouteLoad])

  // Geocode address to coordinates
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `limit=1`
      )
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        return data.features[0].center // Returns [lng, lat]
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
    return null
  }

  // Add traffic congestion visualization with color-coded segments
  const addTrafficCongestion = (geometry, congestion) => {
    if (!congestion || !geometry.coordinates || congestion.length === 0) return

    // Remove existing congestion layers
    const congestionLayers = ['traffic-low', 'traffic-moderate', 'traffic-high']
    congestionLayers.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId)
      }
      if (map.current.getSource(layerId)) {
        map.current.removeSource(layerId)
      }
    })

    // Create segments grouped by congestion level
    const lowTraffic = { type: 'FeatureCollection', features: [] }
    const moderateTraffic = { type: 'FeatureCollection', features: [] }
    const highTraffic = { type: 'FeatureCollection', features: [] }

    // Group coordinates by congestion level
    let currentSegment = []
    let currentLevel = null

    geometry.coordinates.forEach((coord, index) => {
      const congestionValue = congestion[Math.min(index, congestion.length - 1)] || 0
      let level = 'low'
      if (congestionValue > 60) level = 'high'
      else if (congestionValue > 30) level = 'moderate'

      if (level !== currentLevel && currentSegment.length > 0) {
        // Save current segment
        const segment = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [...currentSegment],
          },
        }
        if (currentLevel === 'low') lowTraffic.features.push(segment)
        else if (currentLevel === 'moderate') moderateTraffic.features.push(segment)
        else if (currentLevel === 'high') highTraffic.features.push(segment)
        currentSegment = [coord]
      } else {
        currentSegment.push(coord)
      }
      currentLevel = level
    })

    // Add final segment
    if (currentSegment.length > 0) {
      const segment = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: currentSegment,
        },
      }
      if (currentLevel === 'low') lowTraffic.features.push(segment)
      else if (currentLevel === 'moderate') moderateTraffic.features.push(segment)
      else if (currentLevel === 'high') highTraffic.features.push(segment)
    }

    // Add layers for each congestion level
    if (lowTraffic.features.length > 0) {
      map.current.addSource('traffic-low', { type: 'geojson', data: lowTraffic })
      map.current.addLayer({
        id: 'traffic-low',
        type: 'line',
        source: 'traffic-low',
        paint: {
          'line-color': '#10b981', // Green
          'line-width': 6,
          'line-opacity': 0.8,
        },
      })
    }

    if (moderateTraffic.features.length > 0) {
      map.current.addSource('traffic-moderate', { type: 'geojson', data: moderateTraffic })
      map.current.addLayer({
        id: 'traffic-moderate',
        type: 'line',
        source: 'traffic-moderate',
        paint: {
          'line-color': '#f59e0b', // Yellow/Orange
          'line-width': 6,
          'line-opacity': 0.8,
        },
      })
    }

    if (highTraffic.features.length > 0) {
      map.current.addSource('traffic-high', { type: 'geojson', data: highTraffic })
      map.current.addLayer({
        id: 'traffic-high',
        type: 'line',
        source: 'traffic-high',
        paint: {
          'line-color': '#ef4444', // Red
          'line-width': 6,
          'line-opacity': 0.8,
        },
      })
    }
  }

  // Add markers
  const addMarkers = (originCoords, destCoords) => {
    // Remove existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker')
    markers.forEach(m => m.remove())

    // Origin marker
    const originLngLat = Array.isArray(originCoords)
      ? [originCoords[0], originCoords[1]]
      : [originCoords.lng || originCoords[1], originCoords.lat || originCoords[0]]

    new mapboxgl.Marker({ color: '#10b981' })
      .setLngLat(originLngLat)
      .setPopup(new mapboxgl.Popup().setHTML('<strong>Origin</strong>'))
      .addTo(map.current)

    // Destination marker
    const destLngLat = Array.isArray(destCoords)
      ? [destCoords[0], destCoords[1]]
      : [destCoords.lng || destCoords[1], destCoords.lat || destCoords[0]]

    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(destLngLat)
      .setPopup(new mapboxgl.Popup().setHTML('<strong>Destination</strong>'))
      .addTo(map.current)
  }

  return (
    <div className={`w-full rounded-lg overflow-hidden shadow-md relative ${className}`} style={{ height }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg text-sm max-w-md mx-4">
            <p className="font-semibold mb-2">⚠️ Mapbox Token Required</p>
            <p className="text-xs mb-2">
              Add your Mapbox access token to <code className="bg-yellow-200 px-1 rounded">VITE_MAPBOX_TOKEN</code> in your <code className="bg-yellow-200 px-1 rounded">.env</code> file.
            </p>
            <p className="text-xs">
              Get a free token at: <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="underline text-yellow-800">mapbox.com</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapboxMapView


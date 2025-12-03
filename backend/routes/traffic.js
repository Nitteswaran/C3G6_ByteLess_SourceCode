import express from 'express'
const router = express.Router()

// GET /api/traffic/patterns - Get real-time traffic patterns
router.get('/patterns', async (req, res) => {
  try {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Generate real-time traffic data based on current time
    // Traffic patterns vary throughout the day
    const generateTrafficData = () => {
      const times = ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM']
      const trafficData = []

      times.forEach((timeLabel, index) => {
        const hour = index * 2 + 6 // 6, 8, 10, 12, 14, 16, 18, 20
        let baseCongestion = 30
        let baseAccidents = 1

        // Peak hours: 7-9 AM and 5-7 PM
        if (hour >= 7 && hour <= 9) {
          baseCongestion = 80 + Math.floor(Math.random() * 15) // 80-95%
          baseAccidents = 4 + Math.floor(Math.random() * 3) // 4-6
        } else if (hour >= 17 && hour <= 19) {
          baseCongestion = 85 + Math.floor(Math.random() * 10) // 85-95%
          baseAccidents = 5 + Math.floor(Math.random() * 3) // 5-7
        } else if (hour >= 10 && hour <= 16) {
          baseCongestion = 45 + Math.floor(Math.random() * 20) // 45-65%
          baseAccidents = 1 + Math.floor(Math.random() * 3) // 1-3
        } else {
          // Off-peak hours
          baseCongestion = 20 + Math.floor(Math.random() * 25) // 20-45%
          baseAccidents = 0 + Math.floor(Math.random() * 2) // 0-1
        }

        // Add real-time variation based on current time
        const timeVariation = Math.abs(currentHour - hour)
        if (timeVariation === 0 || timeVariation === 1) {
          // Current or nearby hour - add more variation for realism
          baseCongestion += Math.floor(Math.random() * 10) - 5
          baseAccidents += Math.floor(Math.random() * 2) - 1
        }

        // Ensure values are within valid ranges
        const congestion = Math.max(0, Math.min(100, baseCongestion))
        const accidents = Math.max(0, Math.min(10, baseAccidents))

        trafficData.push({
          time: timeLabel,
          congestion: Math.round(congestion),
          accidents: Math.round(accidents),
        })
      })

      return trafficData
    }

    const trafficData = generateTrafficData()

    res.json({
      success: true,
      data: trafficData,
      timestamp: new Date().toISOString(),
      currentTime: {
        hour: currentHour,
        minute: currentMinute,
      },
    })
  } catch (error) {
    console.error('Error fetching traffic patterns:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch traffic data',
      error: error.message,
    })
  }
})

export default router


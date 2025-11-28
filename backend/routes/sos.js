import express from 'express'
import { notifyGuardians } from '../controllers/sosController.js'

const router = express.Router()

/**
 * @route   POST /api/sos/notify-guardians
 * @desc    Notify all active guardians of an emergency
 * @body    {Object} currentLocation - {lat: number, lng: number, address?: string}
 * @body    {string} timestamp - ISO timestamp (optional, defaults to now)
 * @body    {string} userId - User ID (optional, for testing)
 * @access  Public (should be protected in production)
 */
router.post('/notify-guardians', notifyGuardians)

// POST /api/sos/start-tracking - Start live tracking for emergency
router.post('/start-tracking', async (req, res) => {
  try {
    const { location, timestamp } = req.body
    const io = req.app.get('io')

    // Start tracking session
    const trackingSession = {
      sessionId: `sos-${Date.now()}`,
      location,
      startTime: timestamp || new Date().toISOString(),
      status: 'active',
    }

    // Broadcast tracking start via Socket.IO
    if (io) {
      io.emit('tracking-started', {
        sessionId: trackingSession.sessionId,
        location,
        timestamp: trackingSession.startTime,
      })
    }

    // TODO: In production, you would:
    // 1. Create tracking session in database
    // 2. Start periodic location updates
    // 3. Share location with guardians and emergency services
    // 4. Set up geofencing alerts

    res.json({
      success: true,
      message: 'Live tracking started',
      data: trackingSession,
    })
  } catch (error) {
    console.error('Error starting tracking:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to start tracking',
      error: error.message,
    })
  }
})

export default router

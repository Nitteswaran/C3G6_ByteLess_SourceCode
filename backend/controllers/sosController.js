import Guardian from '../models/Guardian.js'
import SOSAlert from '../models/SOSAlert.js'

/**
 * Mock SMS sending function
 * @param {string} phone - Phone number
 * @param {string} message - Message content
 * @returns {Promise<boolean>} Success status
 */
const sendMockSMS = async (phone, message) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Mock: Always succeeds for demo purposes
  console.log(`📱 [MOCK SMS] To: ${phone}`)
  console.log(`   Message: ${message}`)
  
  return true
}

/**
 * Mock Email sending function
 * @param {string} email - Email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {Promise<boolean>} Success status
 */
const sendMockEmail = async (email, subject, body) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 150))
  
  // Mock: Always succeeds for demo purposes
  console.log(`📧 [MOCK EMAIL] To: ${email}`)
  console.log(`   Subject: ${subject}`)
  console.log(`   Body: ${body.substring(0, 100)}...`)
  
  return true
}

/**
 * Generate emergency message content
 */
const generateEmergencyMessage = (guardianName, location, timestamp) => {
  const locationStr = location.address 
    ? `${location.address} (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
    : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
  
  const timeStr = new Date(timestamp).toLocaleString()
  
  return {
    sms: `🚨 EMERGENCY ALERT 🚨\n\n${guardianName}, I need help!\n\nLocation: ${locationStr}\nTime: ${timeStr}\n\nPlease check on me immediately.`,
    email: {
      subject: '🚨 Emergency Alert - Immediate Action Required',
      body: `
        <h2>Emergency Alert</h2>
        <p>Dear ${guardianName},</p>
        <p><strong>I need your help immediately!</strong></p>
        <p><strong>Location:</strong> ${locationStr}</p>
        <p><strong>Time:</strong> ${timeStr}</p>
        <p>Please check on me and take appropriate action.</p>
        <p>This is an automated emergency alert from Routely.</p>
      `,
    },
  }
}

/**
 * POST /api/sos/notify-guardians
 * Notify all active guardians of an emergency
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const notifyGuardians = async (req, res) => {
  try {
    const { currentLocation, timestamp } = req.body
    const io = req.app.get('io')

    // Validate required fields
    if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
      return res.status(400).json({
        success: false,
        message: 'currentLocation with lat and lng is required',
      })
    }

    // Validate location coordinates
    const lat = parseFloat(currentLocation.lat)
    const lng = parseFloat(currentLocation.lng)

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location coordinates',
      })
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates out of valid range',
      })
    }

    const alertTimestamp = timestamp ? new Date(timestamp) : new Date()

    // TODO: In production, get userId from authenticated session
    // For now, using a default userId or from request
    const userId = req.body.userId || req.user?.id || 'default-user-id'

    // Fetch all active guardians for the user
    const guardians = await Guardian.find({
      userId,
      isActive: true,
    })

    if (guardians.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active guardians found. Please add guardians first.',
      })
    }

    // Prepare location object
    const location = {
      lat,
      lng,
      address: currentLocation.address || '',
    }

    // Notify each guardian
    const notificationResults = []
    
    for (const guardian of guardians) {
      const messages = generateEmergencyMessage(
        guardian.name,
        location,
        alertTimestamp
      )

      let notificationMethod = 'none'
      let notificationStatus = 'pending'

      // Send SMS if phone is available
      if (guardian.phone) {
        try {
          const smsSent = await sendMockSMS(guardian.phone, messages.sms)
          if (smsSent) {
            notificationMethod = notificationMethod === 'none' ? 'sms' : 'both'
            notificationStatus = 'sent'
          }
        } catch (error) {
          console.error(`Failed to send SMS to ${guardian.phone}:`, error)
          notificationStatus = 'failed'
        }
      }

      // Send Email if email is available
      if (guardian.email) {
        try {
          const emailSent = await sendMockEmail(
            guardian.email,
            messages.email.subject,
            messages.email.body
          )
          if (emailSent) {
            notificationMethod = notificationMethod === 'none' ? 'email' : 'both'
            if (notificationStatus === 'pending') {
              notificationStatus = 'sent'
            }
          }
        } catch (error) {
          console.error(`Failed to send email to ${guardian.email}:`, error)
          if (notificationStatus === 'pending') {
            notificationStatus = 'failed'
          }
        }
      }

      // Record notification result
      notificationResults.push({
        guardianId: guardian._id,
        name: guardian.name,
        phone: guardian.phone || null,
        email: guardian.email || null,
        notificationMethod: notificationMethod === 'none' ? 'none' : notificationMethod,
        notificationStatus,
        notifiedAt: new Date(),
      })

      // Update guardian's lastNotified timestamp
      guardian.lastNotified = new Date()
      await guardian.save()
    }

    // Log alert in database
    const sosAlert = new SOSAlert({
      userId,
      currentLocation: location,
      timestamp: alertTimestamp,
      guardiansNotified: notificationResults,
      status: 'active',
    })

    await sosAlert.save()

    // Broadcast emergency alert via Socket.IO
    if (io) {
      io.emit('emergency-alert', {
        alertId: sosAlert._id,
        location,
        timestamp: alertTimestamp.toISOString(),
        type: 'guardian-notification',
        message: 'Emergency alert activated',
        guardiansNotified: guardians.length,
      })
    }

    res.json({
      success: true,
      message: `Emergency alert sent to ${guardians.length} guardian(s)`,
      data: {
        alertId: sosAlert._id,
        notifiedAt: new Date().toISOString(),
        location,
        timestamp: alertTimestamp.toISOString(),
        guardiansNotified: notificationResults,
        totalGuardians: guardians.length,
      },
    })
  } catch (error) {
    console.error('Error notifying guardians:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to notify guardians',
      error: error.message,
    })
  }
}

export default {
  notifyGuardians,
}


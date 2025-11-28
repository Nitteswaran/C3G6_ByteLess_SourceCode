import express from 'express'
const router = express.Router()

// POST /api/emergency/alert - Create emergency alert
router.post('/alert', (req, res) => {
  const io = req.app.get('io')
  
  // Broadcast emergency alert via Socket.IO
  if (io) {
    io.emit('emergency-alert', {
      ...req.body,
      timestamp: new Date().toISOString(),
    })
  }
  
  res.json({ 
    message: 'Emergency alert sent', 
    data: req.body 
  })
})

// GET /api/emergency/alerts - Get all emergency alerts
router.get('/alerts', (req, res) => {
  res.json({ message: 'Get all emergency alerts', data: [] })
})

export default router


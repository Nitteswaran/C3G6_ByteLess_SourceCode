import express from 'express'
import * as trackingController from '../controllers/trackingController.js'

const router = express.Router()

// GET /api/tracking - Get all tracking data
router.get('/', trackingController.getAllTracking)

// GET /api/tracking/:id - Get specific tracking data
router.get('/:id', trackingController.getTrackingById)

// POST /api/tracking - Create new tracking session
router.post('/', trackingController.createTracking)

// PUT /api/tracking/:id - Update tracking data
router.put('/:id', trackingController.updateTracking)

// DELETE /api/tracking/:id - Delete tracking data
router.delete('/:id', trackingController.deleteTracking)

export default router


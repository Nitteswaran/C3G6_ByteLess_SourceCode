import express from 'express'
import { getSafeSpots } from '../controllers/safeSpotsController.js'

const router = express.Router()

/**
 * @route   GET /api/safe-spots
 * @desc    Get nearest safe spots (police stations, hospitals, 24-hour stores, well-lit areas)
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 * @query   {number} radius - Search radius in kilometers (default: 10)
 * @query   {string} category - Filter by category: police, medical, 24hour_store, well_lit_area (optional)
 * @access  Public
 */
router.get('/', getSafeSpots)

export default router

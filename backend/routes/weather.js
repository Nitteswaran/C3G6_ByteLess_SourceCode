import express from 'express'
import asyncHandler from '../utils/asyncHandler.js'
import { getWeatherData } from '../controllers/weatherController.js'

const router = express.Router()

/**
 * GET /api/weather?lat=&lng=
 * Get weather data for a specific location
 */
router.get('/', asyncHandler(getWeatherData))

export default router


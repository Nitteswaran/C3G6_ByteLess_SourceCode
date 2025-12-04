import express from 'express'
import { chatWithAI } from '../controllers/aiController.js'

const router = express.Router()

/**
 * GET /api/ai/status
 * Check Gemini API configuration status
 */
router.get('/status', (req, res) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite'
  const GEMINI_API_VERSION = process.env.GEMINI_API_VERSION || 'v1beta'
  
  res.json({
    success: true,
    data: {
      configured: !!GEMINI_API_KEY,
      apiKeyPresent: !!GEMINI_API_KEY,
      apiKeyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
      model: GEMINI_MODEL,
      apiVersion: GEMINI_API_VERSION,
      environment: process.env.NODE_ENV || 'development',
      message: GEMINI_API_KEY 
        ? 'Gemini API is configured and ready' 
        : 'Gemini API key is not configured. Please set GEMINI_API_KEY in Render environment variables.',
    },
  })
})

/**
 * POST /api/ai/chat
 * Chat with AI using Gemini API
 */
router.post('/chat', chatWithAI)

export default router


import mongoose from 'mongoose'

/**
 * Health check controller
 * Returns server status and health information
 */

/**
 * GET /api/health
 * Health check endpoint
 */
export const getHealth = async (req, res) => {
  try {
    const healthData = {
      status: 'ok',
      message: 'Routely API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'disconnected',
        server: 'running',
      },
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthData.services.database = 'connected'
      healthData.services.databaseName = mongoose.connection.name
    } else {
      healthData.services.database = 'disconnected'
      healthData.status = 'degraded'
    }

    res.status(200).json({
      success: true,
      data: healthData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
    })
  }
}

export default {
  getHealth,
}


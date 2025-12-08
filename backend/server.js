import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connectDB } from './config/database.js'
import { env, validateEnv } from './config/env.js'
import { User } from './models/User.js'
import routes from './routes/index.js'
import stripeRoutes from './routes/stripe.routes.js'
import subscriptionRoutes from './routes/subscription.routes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { checkAIUsage, checkSubscription } from './middleware/checkAIUsage.js'

// Validate environment variables
validateEnv()

// Initialize Express app
const app = express()

// Create HTTP server
const httpServer = createServer(app)

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins temporarily for testing
    methods: ['GET', 'POST'],
    credentials: false, // Set to false when using origin: '*'
  },
})

// ==================== Middleware ====================

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://routely-eosin.vercel.app",
  "https://routely-h15i38j3v-nitteswarans-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        console.warn(`CORS blocked: ${origin}`);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Content-Type']
  })
);

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware (development only)
if (env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// ==================== Routes ====================

// Gemini route (direct access) with subscription check
app.post('/gemini', checkAIUsage, checkSubscription, async (req, res) => {
  try {
    const userPrompt = req.body.prompt

    if (!userPrompt || !userPrompt.trim()) {
      return res.status(400).json({ 
        error: 'Prompt is required' 
      })
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key is not configured' 
      })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: userPrompt }]
          }]
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Failed to get response from Gemini API' 
      })
    }

    const data = await response.json()
    
    // Increment AI usage after successful response
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        await user.incrementAIUsage();
      }
    } catch (error) {
      console.error('Error updating AI usage:', error);
    }
    
    res.json(data)
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    })
  }
})

// API routes
app.use('/api', routes)

// Stripe & Subscription routes
app.use('/api/stripe', stripeRoutes)
app.use('/api/subscription', subscriptionRoutes)

// Add convenience redirect from /api/ai to /api/ai/chat
app.post('/api/ai', (req, res, next) => {
  req.url = '/api/ai/chat';
  next();
}, routes);

// Log available routes
console.log('\n=== Available API Routes ===');
console.log('GET  /api/ai/status - Check AI service status');
console.log('POST /api/ai/chat   - Chat with AI');
console.log('AI service is ready and listening for requests\n');

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Routely API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      gemini: '/gemini (POST)',
      documentation: 'Coming soon',
    },
  })
})

// ==================== Error Handling ====================

// 404 handler (must be after all routes)
app.use(notFound)

// Error handler (must be last)
app.use(errorHandler)

// ==================== Socket.IO ====================

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id)

  // Join a room for tracking
  socket.on('join-tracking', (data) => {
    socket.join(data.roomId)
    console.log(`📍 Socket ${socket.id} joined room: ${data.roomId}`)
  })

  // Handle location updates
  socket.on('location-update', (data) => {
    // Broadcast to all clients in the room
    io.to(data.roomId).emit('location-update', data)
  })

  // Handle emergency alerts
  socket.on('emergency-alert', (data) => {
    // Broadcast emergency to all connected clients
    io.emit('emergency-alert', data)
    console.log('🚨 Emergency alert broadcasted:', data)
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
  })
})

// Make io available to routes
app.set('io', io)

// ==================== Database Connection ====================

// Connect to MongoDB
connectDB()

// ==================== Server Startup ====================

// Use PORT from environment (Render sets this automatically) or default to 5000
const PORT = process.env.PORT || env.PORT

httpServer.listen(PORT, () => {
  console.log('🚀 Server started successfully')
  console.log(`📍 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${env.NODE_ENV}`)
  if (env.NODE_ENV === 'development') {
    console.log(`🔗 API URL: http://localhost:${PORT}`)
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  httpServer.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

export { io }

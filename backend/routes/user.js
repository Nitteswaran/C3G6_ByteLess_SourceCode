import express from 'express'
const router = express.Router()

// GET /api/users - Get all users
router.get('/', (req, res) => {
  res.json({ message: 'Get all users', data: [] })
})

// GET /api/users/:id - Get specific user
router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id}` })
})

// POST /api/users - Create new user
router.post('/', (req, res) => {
  res.json({ message: 'Create new user', data: req.body })
})

export default router


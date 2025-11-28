import express from 'express'
const router = express.Router()

// In-memory storage for forum posts (in production, use MongoDB)
let forumPosts = [
  {
    _id: '1',
    title: 'Best Parks for Morning Jogging',
    content: 'I found that Taman Tasik Titiwangsa has excellent air quality in the mornings. The AQI is usually below 30!',
    author: 'Sarah M.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 12,
  },
  {
    _id: '2',
    title: 'Avoiding Peak Traffic Hours',
    content: 'Traffic congestion is worst between 7-9 AM and 5-7 PM. I plan my routes to avoid these times for better air quality exposure.',
    author: 'Ahmad K.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 8,
  },
  {
    _id: '3',
    title: 'Indoor Air Quality Tips',
    content: 'Using air purifiers and keeping windows closed during high pollution days really helps. Also, plants like peace lilies are great!',
    author: 'Lisa T.',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 15,
  },
]

// GET /api/forum/posts - Get all forum posts
router.get('/posts', async (req, res) => {
  try {
    // Sort by newest first
    const sortedPosts = [...forumPosts].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )

    res.json({
      success: true,
      data: sortedPosts,
      count: sortedPosts.length,
    })
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum posts',
      error: error.message,
    })
  }
})

// POST /api/forum/posts - Create a new forum post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      })
    }

    const newPost = {
      _id: Date.now().toString(),
      title,
      content,
      author: author || 'Anonymous',
      createdAt: new Date().toISOString(),
      likes: 0,
    }

    forumPosts.unshift(newPost) // Add to beginning

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost,
    })
  } catch (error) {
    console.error('Error creating forum post:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create forum post',
      error: error.message,
    })
  }
})

// POST /api/forum/posts/:id/like - Like a forum post
router.post('/posts/:id/like', async (req, res) => {
  try {
    const { id } = req.params
    const post = forumPosts.find(p => p._id === id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    post.likes = (post.likes || 0) + 1

    res.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error('Error liking forum post:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to like post',
      error: error.message,
    })
  }
})

export default router


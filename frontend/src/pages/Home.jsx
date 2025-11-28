import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import api from '../services/api'
import LoaderAnimation from '../components/LoaderAnimation'
import landingPageImage from '../assets/landingpage.png'

const Home = () => {
  const [airPollutionData, setAirPollutionData] = useState([])
  const [trafficData, setTrafficData] = useState([])
  const [forumPosts, setForumPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [visibleSections, setVisibleSections] = useState(new Set())
  
  const heroRef = useRef(null)
  const pollutionRef = useRef(null)
  const trafficRef = useRef(null)
  const forumRef = useRef(null)

  useEffect(() => {
    fetchData()
    fetchForumPosts()
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, entry.target.id]))
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = [heroRef, pollutionRef, trafficRef, forumRef]
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    // Make hero section visible immediately on load with a small delay for smooth animation
    setTimeout(() => {
      if (heroRef.current) {
        setVisibleSections((prev) => new Set([...prev, 'hero']))
      }
    }, 100)

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])


  const fetchData = async () => {
    setLoading(true)
    try {
      const mockAirPollution = [
        { month: 'Jan', KL: 45, Penang: 38, Johor: 42, Selangor: 48 },
        { month: 'Feb', KL: 52, Penang: 41, Selangor: 55, Johor: 49 },
        { month: 'Mar', KL: 48, Penang: 35, Selangor: 52, Johor: 44 },
        { month: 'Apr', KL: 58, Penang: 42, Selangor: 61, Johor: 55 },
        { month: 'May', KL: 62, Penang: 48, Selangor: 65, Johor: 58 },
        { month: 'Jun', KL: 55, Penang: 40, Selangor: 58, Johor: 52 },
      ]

      const mockTraffic = [
        { time: '6 AM', congestion: 15, accidents: 2 },
        { time: '8 AM', congestion: 85, accidents: 5 },
        { time: '10 AM', congestion: 45, accidents: 1 },
        { time: '12 PM', congestion: 60, accidents: 3 },
        { time: '2 PM', congestion: 55, accidents: 2 },
        { time: '4 PM', congestion: 75, accidents: 4 },
        { time: '6 PM', congestion: 90, accidents: 6 },
        { time: '8 PM', congestion: 40, accidents: 1 },
      ]

      setAirPollutionData(mockAirPollution)
      setTrafficData(mockTraffic)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchForumPosts = async () => {
    try {
      const response = await api.get('/forum/posts')
      if (response.data.success) {
        setForumPosts(response.data.data || [])
      } else {
        setForumPosts([
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
        ])
      }
    } catch (error) {
      console.error('Error fetching forum posts:', error)
      setForumPosts([
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
      ])
    }
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault()
    if (!newPost.title || !newPost.content) return

    setSubmitting(true)
    try {
      const response = await api.post('/forum/posts', {
        ...newPost,
        author: newPost.author || 'Anonymous',
      })

      if (response.data.success) {
        setNewPost({ title: '', content: '', author: '' })
        fetchForumPosts()
      }
    } catch (error) {
      console.error('Error submitting post:', error)
      const post = {
        _id: Date.now().toString(),
        ...newPost,
        author: newPost.author || 'Anonymous',
        createdAt: new Date().toISOString(),
        likes: 0,
      }
      setForumPosts([post, ...forumPosts])
      setNewPost({ title: '', content: '', author: '' })
    } finally {
      setSubmitting(false)
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        id="hero"
        className={`py-8 md:py-12 lg:py-16 transition-all duration-1000 ${
          visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-left">
              <h1 className="xl:-mt-32 text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Routely
              </h1>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                Smart, Safe, and Stress-Free Urban Travel
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 font-medium">
                Your city. Your route. Your safety – all in one app
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link 
                  to="/route-planner" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                >
                  Plan Route
                </Link>
                <Link 
                  to="/safe-route" 
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                >
                  Find Safe Route
                </Link>
              </div>
            </div>

            {/* Right Side - Landing Page Image */}
            <div className="flex justify-center lg:justify-end items-center">
              <div className="w-full max-w-md lg:max-w-lg">
                <img
                  src={landingPageImage}
                  alt="Routely - Smart, Safe, and Stress-Free Urban Travel"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Air Pollution Visualization */}
      <section 
        ref={pollutionRef}
        id="pollution"
        className={`card transition-all duration-1000 delay-200 ${
          visibleSections.has('pollution') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Air Pollution in Malaysia (AQI)</h2>
        <p className="text-gray-600 mb-6">Monthly average air quality index across major cities</p>
        {loading ? (
          <LoaderAnimation text="Loading air pollution data..." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={airPollutionData}>
              <defs>
                <linearGradient id="colorKL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorSelangor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPenang" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorJohor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <YAxis label={{ value: 'AQI', angle: -90, position: 'insideLeft' }} stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area type="monotone" dataKey="KL" stroke="#3b82f6" strokeWidth={2} fill="url(#colorKL)" name="Kuala Lumpur" />
              <Area type="monotone" dataKey="Selangor" stroke="#10b981" strokeWidth={2} fill="url(#colorSelangor)" name="Selangor" />
              <Area type="monotone" dataKey="Penang" stroke="#f59e0b" strokeWidth={2} fill="url(#colorPenang)" name="Penang" />
              <Area type="monotone" dataKey="Johor" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorJohor)" name="Johor" />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Note:</strong> AQI below 50 is considered good. Higher values indicate poorer air quality.</p>
        </div>
      </section>

      {/* Traffic Visualization */}
      <section 
        ref={trafficRef}
        id="traffic"
        className={`card transition-all duration-1000 delay-300 ${
          visibleSections.has('traffic') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Traffic Patterns in Malaysia</h2>
        <p className="text-gray-600 mb-6">Daily traffic congestion and accident patterns</p>
        {loading ? (
          <LoaderAnimation text="Loading traffic data..." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData}>
              <defs>
                <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <YAxis yAxisId="left" label={{ value: 'Congestion %', angle: -90, position: 'insideLeft' }} stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Accidents', angle: 90, position: 'insideRight' }} stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="congestion" fill="url(#colorCongestion)" name="Congestion %" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="accidents" fill="url(#colorAccidents)" name="Accidents" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Peak Hours:</strong> 7-9 AM and 5-7 PM show highest congestion and accident rates.</p>
        </div>
      </section>

      {/* Live Forum Section */}
      <section 
        ref={forumRef}
        id="forum"
        className={`card transition-all duration-1000 delay-400 ${
          visibleSections.has('forum') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Health & Wellbeing Forum</h2>
        <p className="text-gray-600 mb-6">Share your insights and tips for healthy living in Malaysia</p>

        {/* New Post Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Share Your Insight</h3>
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your name (optional)"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                className="input-field mb-3"
              />
              <input
                type="text"
                placeholder="Post title..."
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="input-field mb-3"
                required
              />
              <textarea
                placeholder="Share your health and wellbeing tips..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="input-field min-h-[100px]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Insight'}
            </button>
          </form>
        </div>

        {/* Forum Posts */}
        <div className="space-y-4">
          {forumPosts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No posts yet. Be the first to share!</p>
          ) : (
            forumPosts.map((post) => (
              <div key={post._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600">{post.likes || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

# Routely Backend API

Express.js backend server with MongoDB, Socket.IO, and organized folder structure.

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── env.js           # Environment variables
├── controllers/         # Route controllers
│   ├── healthController.js
│   └── ...
├── middleware/          # Express middleware
│   └── errorHandler.js
├── models/              # Mongoose models
│   ├── User.js
│   ├── Guardian.js
│   └── ...
├── routes/              # API routes
│   ├── index.js         # Route aggregator
│   ├── health.js
│   └── ...
├── utils/               # Utility functions
│   ├── asyncHandler.js
│   ├── logger.js
│   └── ...
├── server.js            # Main server file
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/routely
FRONTEND_URL=http://localhost:3000
MAPBOX_TOKEN=your_mapbox_token_here
JWT_SECRET=your-secret-key-change-in-production
```

4. Start the server:
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## 🚀 Deployment

### Render Deployment

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for detailed Render deployment instructions.

**Quick Deploy:**
1. Set up MongoDB Atlas
2. Push code to GitHub
3. Create Web Service on Render
4. Configure environment variables
5. Deploy

### MongoDB Atlas Setup

For production, use MongoDB Atlas:

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP addresses (or allow all for Render)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/routely?retryWrites=true&w=majority`

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Other Routes
- `/api/tracking` - Location tracking
- `/api/users` - User management
- `/api/route` - Route planning
- `/api/sos` - Emergency SOS
- `/api/guardians` - Guardian management
- `/api/aqi` - Air quality data
- `/api/forum` - Forum posts
- `/api/surroundings` - Safety analysis

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/routely` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `MAPBOX_TOKEN` | Mapbox API token (optional) | - |
| `JWT_SECRET` | JWT secret key (optional) | - |

## 🏗️ Architecture

### Controllers
Handle business logic and return responses. Use `asyncHandler` to catch errors automatically.

### Models
Mongoose schemas for database collections.

### Routes
Define API endpoints and connect to controllers.

### Middleware
Express middleware for error handling, authentication, etc.

### Utils
Reusable utility functions (async handler, logger, etc.).

## 📝 Code Style

- Use ES6 modules (`import`/`export`)
- Follow async/await pattern
- Use `asyncHandler` for async route handlers
- Use `logger` utility for logging

## 🔒 Security

- CORS enabled for frontend
- Environment variables for sensitive data
- Input validation (add as needed)
- Error handling middleware

## 🧪 Testing

Add your test files in a `tests/` directory (not included in boilerplate).

## 📚 Documentation

API documentation can be added using Swagger/OpenAPI (not included in boilerplate).


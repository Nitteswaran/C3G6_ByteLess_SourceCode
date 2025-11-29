# Routely – Smart, Safe, and Stress-Free Urban Travel

**Your city. Your route. Your safety – all in one app**

A full-stack application for real-time route tracking and management with live location updates, emergency alerts, interactive maps, and safety analysis.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Poppins** - Modern typography
- **React Router DOM** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Lottie-react** - Animation library
- **Leaflet** - Interactive maps
- **React-Leaflet** - React bindings for Leaflet
- **Mapbox GL JS** - Advanced mapping with traffic data
- **React-Map-GL** - React bindings for Mapbox
- **Recharts** - Data visualization
- **Google Map** - Map visualization

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Routely/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state management
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── ...
│   ├── public/              # Public assets
│   ├── vercel.json          # Vercel deployment config
│   └── package.json
│
├── backend/                 # Express backend server
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   ├── server.js            # Express server entry point
│   ├── render.yaml          # Render deployment config
│   └── package.json
│
└── README.md                # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (for production) or local MongoDB
- Mapbox account (for route planning) - [Get free token](https://account.mapbox.com/access-tokens/)

### Local Development

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

5. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/routely
FRONTEND_URL=http://localhost:3000
MAPBOX_TOKEN=your_mapbox_token_here
JWT_SECRET=your-secret-key-change-in-production
```

5. Start backend server:
```bash
npm run dev
```

Backend API will be available at `http://localhost:5000`

## 🚀 Deployment

### Frontend Deployment (Vercel)

See [frontend/DEPLOYMENT.md](./frontend/DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Required Environment Variables:**
- `VITE_API_BASE_URL` - Your backend API URL
- `VITE_SOCKET_URL` - Your Socket.IO server URL
- `VITE_MAPBOX_TOKEN` - Mapbox API token

### Backend Deployment (Render)

See [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Set up MongoDB Atlas cluster
2. Push code to GitHub/GitLab/Bitbucket
3. Create new Web Service on Render
4. Configure environment variables
5. Deploy

**Required Environment Variables:**
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB Atlas connection string
- `FRONTEND_URL` - Your frontend URL (for CORS)
- `MAPBOX_TOKEN` - Mapbox API token (optional)
- `JWT_SECRET` - JWT secret key (min 32 characters)

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Routes
- `GET /api/route` - Get route between origin and destination
- `GET /api/surroundings?lat=&lng=` - Get safety analysis
- `GET /api/safe-spots?lat=&lng=` - Get nearby safe spots

### SOS & Emergency
- `POST /api/sos/notify-guardians` - Notify guardians of emergency
- `POST /api/sos/start-tracking` - Start live tracking
- `GET /api/safe-spots` - Get nearby safe spots

### Guardians
- `GET /api/guardians` - Get all guardians
- `POST /api/guardians` - Add guardian
- `DELETE /api/guardians/:id` - Remove guardian

### AQI & Forum
- `GET /api/aqi/places` - Get places with good AQI
- `GET /api/forum/posts` - Get forum posts
- `POST /api/forum/posts` - Create forum post

## 🎨 Design System

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Color Theme
- **Primary**: Blue/Teal gradient
- **Emergency**: Red/Orange
- **Success**: Green
- **Warning**: Yellow

### UI Principles
- Mobile-first responsive design
- Clean, modern interface
- Smooth transitions and animations
- Accessible color contrasts

## 🗺️ Features

### Current Features
- ✅ Real-time route planning with Mapbox
- ✅ Traffic density visualization
- ✅ Safety score calculation (0-3 rating)
- ✅ Safe route alternatives
- ✅ Emergency SOS system
- ✅ Guardian notifications
- ✅ Air quality monitoring
- ✅ Safe spots finder
- ✅ Live health forum
- ✅ Interactive maps with Leaflet/Mapbox
- ✅ Real-time tracking with Socket.IO
- ✅ MongoDB data persistence

### Safety Features
- Safety score based on crowd density, lighting, incidents, weather
- Color-coded route segments (red/orange/yellow/green)
- Nearby safe spots (police, hospitals, 24-hour stores)
- Emergency alert system with guardian notifications

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/routely
FRONTEND_URL=http://localhost:3000
MAPBOX_TOKEN=your_mapbox_token_here
JWT_SECRET=your-secret-key-change-in-production
```

## 🧪 Development

### Run Both Frontend and Backend

From project root:
```bash
npm run dev
```

This uses `concurrently` to run both servers simultaneously.

### Frontend Only
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Only
```bash
cd backend
npm run dev      # Start with auto-reload
npm start        # Start production server
```

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets in production
- Enable HTTPS in production
- Configure CORS properly for production domains
- Use MongoDB Atlas IP whitelisting
- Rotate API keys regularly

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB Atlas cluster is running
- Check connection string format
- Verify IP whitelist includes your IP/Render IPs
- Check database user credentials

### CORS Errors
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check backend CORS configuration
- Ensure frontend uses correct API URL

### Mapbox Not Loading
- Verify `VITE_MAPBOX_TOKEN` is set correctly
- Check token permissions in Mapbox dashboard
- Verify token is not expired

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (v18+ required)
- Verify all dependencies are installed

## 📚 Documentation

- [Frontend Deployment Guide](./frontend/DEPLOYMENT.md)
- [Backend Deployment Guide](./backend/DEPLOYMENT.md)
- [Backend API Documentation](./backend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using React, Express, and modern web technologies.

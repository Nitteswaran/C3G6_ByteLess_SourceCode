# Installation and Deployment Instructions

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Prerequisites](#prerequisites)
3. [External Services Setup](#external-services-setup)
4. [Local Development Setup](#local-development-setup)
5. [Production Deployment](#production-deployment)
6. [Configuration Reference](#configuration-reference)
7. [Verification & Testing](#verification--testing)
8. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free disk space

### Recommended Requirements
- **Node.js**: Version 20.x LTS
- **RAM**: 8GB or more
- **Storage**: 2GB free disk space
- **Internet Connection**: Stable connection for API calls and deployment

---

## Prerequisites

### 1. Node.js Installation

**Windows:**
1. Download Node.js LTS from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. MongoDB Setup Options

You have two options:

**Option A: MongoDB Atlas (Cloud - Recommended)**
- Free tier available
- No local installation required
- See [MongoDB Atlas Setup](#mongodb-atlas-setup) section below

**Option B: Local MongoDB**
- Install MongoDB Community Edition
- Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Follow installation instructions for your OS
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # macOS/Linux
  sudo systemctl start mongod
  ```

### 3. Git (Optional but Recommended)
```bash
# Verify Git installation
git --version

# If not installed, download from git-scm.com
```

---

## External Services Setup

### MongoDB Atlas Setup

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose **FREE** (M0) tier
   - Select cloud provider and region (closest to your location)
   - Click "Create"

3. **Create Database User**
   - Go to **Database Access** → **Add New Database User**
   - Authentication method: **Password**
   - Create username and strong password (save these!)
   - User privileges: **Read and write to any database**
   - Click "Add User"

4. **Configure Network Access**
   - Go to **Network Access** → **Add IP Address**
   - For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production: Add specific IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Go to **Clusters** → Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `routely`
   - Example format:
     ```
     mongodb+srv://username:password@cluster.mongodb.net/routely?retryWrites=true&w=majority
     ```

### Mapbox API Key Setup

1. **Create Account**
   - Go to [Mapbox](https://account.mapbox.com/)
   - Sign up for a free account (50,000 free requests/month)

2. **Get Access Token**
   - After signup, go to [Access Tokens](https://account.mapbox.com/access-tokens/)
   - Copy your **Default public token** (starts with `pk.eyJ...`)
   - Save this token for configuration

### Google Gemini API Key Setup (Optional - for AI Advice feature)

1. **Create Account**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Generate API Key**
   - Click "Create API Key"
   - Copy your API key
   - Save this key for backend configuration

### Google Maps API Key Setup (Optional - for Google Maps integration)

1. **Create Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing

2. **Enable APIs**
   - Enable **Maps JavaScript API**
   - Enable **Places API**
   - Enable **Directions API**

3. **Create API Key**
   - Go to **Credentials** → **Create Credentials** → **API Key**
   - Copy your API key
   - (Optional) Restrict API key to specific APIs and domains

---

## Local Development Setup

### Step 1: Clone or Download Project

```bash
# If using Git
git clone <repository-url>
cd Routelyy

# Or extract the project ZIP file to your desired location
```

### Step 2: Install Dependencies

**Option A: Install All Dependencies at Once (Recommended)**

From the project root directory:
```bash
npm install
npm run install:all
```

**Option B: Install Separately**

Backend dependencies:
```bash
cd backend
npm install
```

Frontend dependencies:
```bash
cd frontend
npm install
```

### Step 3: Backend Configuration

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create `.env` file:**
   ```bash
   # Windows (PowerShell)
   New-Item .env
   
   # macOS/Linux
   touch .env
   ```

3. **Add environment variables to `backend/.env`:**
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/routely?retryWrites=true&w=majority
   # OR for local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/routely

   # Frontend Configuration (for CORS)
   FRONTEND_URL=http://localhost:3000

   # API Keys (Required)
   MAPBOX_TOKEN=pk.eyJ1Ijoibml0dGVzIiwiYSI6ImNtaWljdjh2NTBiamkzY29jczd5ZGZ6YjIifQ.WoEe6chtJ4m8zDACnXCZtg

   # API Keys (Optional)
   GEMINI_API_KEY=your_gemini_api_key_here

   # JWT Configuration
   JWT_SECRET=your-secret-key-change-in-production-min-32-characters
   JWT_EXPIRE=7d
   ```

   **Important:** Replace placeholder values:
   - `MONGODB_URI`: Use your MongoDB Atlas connection string or local MongoDB URI
   - `MAPBOX_TOKEN`: Use your Mapbox access token
   - `GEMINI_API_KEY`: Use your Google Gemini API key (optional)
   - `JWT_SECRET`: Generate a secure random string (minimum 32 characters)

### Step 4: Frontend Configuration

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Create `.env` or `.env.local` file:**
   ```bash
   # Windows (PowerShell)
   New-Item .env.local
   
   # macOS/Linux
   touch .env.local
   ```

3. **Add environment variables to `frontend/.env.local`:**
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000

   # Map Services (Required)
   VITE_MAPBOX_TOKEN=pk.eyJ1Ijoibml0dGVzIiwiYSI6ImNtaWljdjh2NTBiamkzY29jczd5ZGZ6YjIifQ.WoEe6chtJ4m8zDACnXCZtg

   # Optional Services
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

   **Important:** 
   - All frontend environment variables must be prefixed with `VITE_`
   - Replace placeholder values with your actual API keys
   - If not using Google Maps, you can omit that variable

### Step 5: Start Development Servers

**Option A: Run Both Servers Together (Recommended)**

From the project root directory:
```bash
npm run dev
```

This will start both frontend and backend servers simultaneously.

**Option B: Run Servers Separately**

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server started successfully
📍 Server running on port 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000
```

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x
  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 6: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the Routely homepage

---

## Production Deployment

### Deployment Overview

- **Frontend**: Deploy to Vercel (recommended) or Netlify
- **Backend**: Deploy to Render (recommended) or Railway, Heroku
- **Database**: MongoDB Atlas (cloud)

### Part 1: Deploy Backend to Render

1. **Prepare Repository**
   - Push your code to GitHub/GitLab/Bitbucket
   - Ensure `.env` files are NOT committed (already in `.gitignore`)

2. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up for a free account
   - Connect your GitHub account

3. **Create Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your Git repository
   - Select the repository containing your project

4. **Configure Service Settings**
   - **Name**: `routely-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

5. **Add Environment Variables**
   - Go to **Environment** tab in Render dashboard
   - Add the following variables:

   | Variable | Value | Required |
   |----------|-------|----------|
   | `NODE_ENV` | `production` | Yes |
   | `PORT` | `5000` | No (Render auto-assigns) |
   | `MONGODB_URI` | Your MongoDB Atlas connection string | Yes |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` | Yes (update after frontend deploy) |
   | `MAPBOX_TOKEN` | Your Mapbox API token | Yes |
   | `GEMINI_API_KEY` | Your Gemini API key | Optional |
   | `JWT_SECRET` | Strong random string (32+ chars) | Yes |

   **Generate JWT_SECRET:**
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Or use an online generator
   ```

6. **Deploy**
   - Click **"Create Web Service"**
   - Wait for build to complete (5-10 minutes)
   - Note your backend URL: `https://routely-backend.onrender.com`

7. **Verify Backend Deployment**
   ```bash
   curl https://routely-backend.onrender.com/api/health
   ```
   Should return: `{"success":true,"data":{...}}`

### Part 2: Deploy Frontend to Vercel

1. **Prepare Repository**
   - Ensure code is pushed to Git repository
   - Verify `.env` files are NOT committed

2. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up for a free account
   - Connect your GitHub account

3. **Import Project**
   - Click **"Add New Project"**
   - Select your Git repository
   - Click **"Import"**

4. **Configure Project Settings**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add the following variables for **Production**, **Preview**, and **Development**:

   | Variable | Value | Required |
   |----------|-------|----------|
   | `VITE_API_BASE_URL` | `https://routely-backend.onrender.com` | Yes |
   | `VITE_SOCKET_URL` | `https://routely-backend.onrender.com` | Yes |
   | `VITE_MAPBOX_TOKEN` | Your Mapbox API token | Yes |
   | `VITE_GOOGLE_MAPS_API_KEY` | Your Google Maps API key | Optional |

   **Important:** 
   - Make sure to add these for all environments (Production, Preview, Development)
   - Click **"Save"** after adding each variable

6. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete (2-5 minutes)
   - Your frontend will be available at: `https://your-project.vercel.app`

### Part 3: Update Configuration

1. **Update Backend CORS**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable to your Vercel URL:
     ```
     https://your-project.vercel.app
     ```
   - Save and redeploy backend (or it will auto-redeploy)

2. **Verify Frontend Environment Variables**
   - In Vercel dashboard, verify all environment variables are set correctly
   - Ensure `VITE_API_BASE_URL` points to your Render backend URL

### Part 4: Update MongoDB Atlas Network Access

1. **Allow Render IP Addresses**
   - Go to MongoDB Atlas → **Network Access**
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add Render's specific IP ranges (check Render documentation)

---

## Configuration Reference

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` | Yes |
| `PORT` | Server port number | `5000` | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `FRONTEND_URL` | Frontend URL for CORS configuration | `http://localhost:3000` | Yes |
| `MAPBOX_TOKEN` | Mapbox API access token | - | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | - | No |
| `JWT_SECRET` | Secret key for JWT token generation | - | Yes (production) |
| `JWT_EXPIRE` | JWT token expiration time | `7d` | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` | Yes |
| `VITE_SOCKET_URL` | Socket.IO server URL | `http://localhost:5000` | Yes |
| `VITE_MAPBOX_TOKEN` | Mapbox API access token | - | Yes |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | - | No |

**Note:** All frontend environment variables MUST be prefixed with `VITE_` to be accessible in the browser.

---

## Verification & Testing

### Backend Health Check

1. **Local Testing:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Production Testing:**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

   Expected response:
   ```json
   {
     "success": true,
     "data": {
       "status": "ok",
       "message": "Routely API is running",
       "timestamp": "2024-01-01T00:00:00.000Z"
     }
   }
   ```

### Frontend Testing Checklist

1. **Homepage loads** - Navigate to root URL
2. **API Connection** - Check browser console for API calls
3. **Mapbox Maps** - Verify maps load on Route Planner page
4. **Real-time Features** - Test Socket.IO connections
5. **Authentication** - Test login/registration functionality
6. **Route Planning** - Test route calculation functionality
7. **Mobile Responsiveness** - Test on different screen sizes

### Browser Console Checks

Open browser developer tools (F12) and verify:
- No API connection errors
- No missing environment variable warnings
- Maps loading correctly
- Socket.IO connection established

---

## Troubleshooting

### Common Installation Issues

**Issue: Node.js version mismatch**
```
Error: The engine "node" is incompatible
```
**Solution:**
- Install Node.js version 18 or higher
- Verify version: `node --version`
- Use `nvm` (Node Version Manager) to switch versions if needed

**Issue: npm install fails**
```
npm ERR! code ERESOLVE
```
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Issue: Port already in use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change `PORT` in `backend/.env` to a different port (e.g., 5001)
- Update `VITE_API_BASE_URL` in frontend `.env` accordingly
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:5000 | xargs kill
  ```

### Common Configuration Issues

**Issue: MongoDB connection fails**
```
❌ MongoDB connection failed: MongoServerError
```
**Solutions:**
1. Verify connection string format in `.env`
2. Check MongoDB Atlas Network Access (IP whitelist)
3. Verify database user credentials
4. Ensure cluster is running in MongoDB Atlas
5. Check internet connection

**Issue: Frontend can't connect to backend**
```
Network Error: Failed to fetch
```
**Solutions:**
1. Verify backend server is running
2. Check `VITE_API_BASE_URL` in frontend `.env`
3. Verify backend CORS settings allow frontend URL
4. Check browser console for specific error messages
5. Verify firewall/antivirus isn't blocking connections

**Issue: Mapbox maps not loading**
```
Mapbox token required
```
**Solutions:**
1. Verify `VITE_MAPBOX_TOKEN` is set in frontend `.env`
2. Restart frontend dev server after adding token
3. Check token is valid in Mapbox dashboard
4. Verify token hasn't exceeded usage limits
5. Check token permissions/restrictions

**Issue: Environment variables not working (Frontend)**
```
undefined or empty values
```
**Solutions:**
1. Ensure variables are prefixed with `VITE_`
2. Restart dev server after changing `.env` file
3. Clear browser cache
4. In production, verify variables are set in Vercel dashboard
5. Rebuild application after adding variables

### Common Deployment Issues

**Issue: Render deployment fails**
```
Build failed
```
**Solutions:**
1. Check build logs in Render dashboard
2. Verify `package.json` has correct scripts
3. Ensure Node.js version is compatible
4. Check for syntax errors in code
5. Verify all dependencies are listed in `package.json`

**Issue: Vercel build fails**
```
Build error: Cannot find module
```
**Solutions:**
1. Verify `package.json` dependencies
2. Check build logs for specific missing modules
3. Ensure `node_modules` is in `.gitignore`
4. Try clearing Vercel build cache
5. Verify root directory is set to `frontend`

**Issue: Backend shows as sleeping (Render free tier)**
```
Service is sleeping
```
**Solutions:**
1. Free tier services sleep after 15 minutes of inactivity
2. First request after sleep takes ~30 seconds
3. Upgrade to paid plan to avoid sleeping
4. Use external monitoring service to ping endpoint

**Issue: CORS errors in production**
```
Access to fetch blocked by CORS policy
```
**Solutions:**
1. Verify `FRONTEND_URL` in backend matches exact frontend domain
2. Check for trailing slashes in URLs
3. Verify CORS middleware is configured correctly
4. Check backend server logs for CORS-related errors

### Getting Help

If you encounter issues not covered here:

1. **Check Logs:**
   - Backend: Render dashboard → Logs tab
   - Frontend: Vercel dashboard → Deployments → View Function Logs
   - Local: Check terminal output

2. **Verify Configuration:**
   - Double-check all environment variables
   - Verify API keys are correct and not expired
   - Check service status pages (MongoDB Atlas, Mapbox, etc.)

3. **Review Documentation:**
   - [Render Documentation](https://render.com/docs)
   - [Vercel Documentation](https://vercel.com/docs)
   - [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
   - [Mapbox Documentation](https://docs.mapbox.com/)

4. **Common Error Codes:**
   - `401 Unauthorized`: Authentication/authorization issue
   - `404 Not Found`: Route or resource doesn't exist
   - `500 Internal Server Error`: Backend error, check server logs
   - `503 Service Unavailable`: Service is sleeping or down

---

## Additional Resources

### Project Documentation Files
- `README.md` - Project overview and quick start
- `DEPLOYMENT.md` - Detailed deployment guide
- `backend/MONGODB_SETUP.md` - MongoDB configuration details
- `backend/GEMINI_SETUP.md` - Gemini API setup
- `backend/SETUP_MAPBOX.md` - Mapbox configuration

### Useful Commands

**Development:**
```bash
# Install all dependencies
npm run install:all

# Run both servers
npm run dev

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

**Production Build:**
```bash
# Build frontend
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview

# Start backend production server
cd backend && npm start
```

**Database:**
```bash
# Connect to MongoDB (if local)
mongosh

# Connect to MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/routely"
```

---

## Security Checklist

Before deploying to production, ensure:

- [ ] All `.env` files are in `.gitignore`
- [ ] Strong `JWT_SECRET` (32+ random characters)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Strong database user password
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS configured for production domain only
- [ ] API keys secured and not exposed in client code
- [ ] Environment variables set in deployment platform
- [ ] Regular security updates for dependencies

---

## Support

For additional help:
1. Review the troubleshooting section above
2. Check project documentation files
3. Review platform-specific documentation
4. Open an issue on the project repository

---

**Last Updated:** 2024-01-01  
**Project Version:** 1.0.0


# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites Check
- ✅ Node.js installed (v18+)
- ✅ MongoDB running (local or cloud)

### Step 1: Install Dependencies

From the root directory:
```bash
npm run install:all
```

Or install separately:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Step 2: Configure Environment

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Backend port (default: 5000)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)

**Frontend (optional):**
Create `frontend/.env` if you need custom API URLs:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Step 3: Start MongoDB

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Just update MONGODB_URI in .env
```

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or npm run dev (if nodemon is installed)
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Open Your Browser

Navigate to: `http://localhost:3000`

## ✅ Verification

1. **Backend Health Check:**
   - Visit: `http://localhost:5000/health`
   - Should return: `{"status":"ok","message":"Routely API is running"}`

2. **Frontend:**
   - Should see the Routely homepage
   - Navigation should work
   - Maps should load on Tracking page

## 🐛 Troubleshooting

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `vite.config.js` proxy settings

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify `FRONTEND_URL` in backend `.env`

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the code structure
- Start building features!

---

Happy coding! 🎉


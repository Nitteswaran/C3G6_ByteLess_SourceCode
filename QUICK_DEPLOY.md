# Quick Deployment Reference

## 🚀 Fast Track Deployment

### 1. MongoDB Atlas (5 minutes)
```
1. Sign up at mongodb.com/cloud/atlas
2. Create FREE cluster
3. Create database user (save password!)
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Get connection string → Replace <password> and <dbname>
```

### 2. Deploy Backend to Render (10 minutes)
```
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: backend
   - Build: npm install
   - Start: npm start
4. Environment Variables:
   - NODE_ENV=production
   - MONGODB_URI=<your-atlas-connection-string>
   - FRONTEND_URL=<update-after-frontend-deploy>
   - MAPBOX_TOKEN=<your-token>
   - JWT_SECRET=<generate-32-char-string>
5. Deploy → Save backend URL
```

### 3. Deploy Frontend to Vercel (5 minutes)
```
1. Go to vercel.com → New Project
2. Connect GitHub repo
3. Settings:
   - Framework: Vite
   - Root Directory: frontend
4. Environment Variables:
   - VITE_API_BASE_URL=<your-render-backend-url>
   - VITE_SOCKET_URL=<your-render-backend-url>
   - VITE_MAPBOX_TOKEN=<your-token>
5. Deploy → Save frontend URL
```

### 4. Update CORS (2 minutes)
```
1. Render Dashboard → Update FRONTEND_URL
2. Redeploy backend
3. Done! ✅
```

## 📋 Environment Variables Cheat Sheet

### Backend (Render)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/routely?retryWrites=true&w=majority
FRONTEND_URL=https://your-app.vercel.app
MAPBOX_TOKEN=pk.eyJ1Ijoi...
JWT_SECRET=your-32-character-secret-key-here
```

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-backend.onrender.com
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoi...
```

## ✅ Test Your Deployment

```bash
# Test backend
curl https://your-backend.onrender.com/api/health

# Test frontend
# Visit https://your-app.vercel.app
```

## 🔗 URLs After Deployment

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Health Check: `https://your-backend.onrender.com/api/health`

---

**Total Time: ~20 minutes** ⚡


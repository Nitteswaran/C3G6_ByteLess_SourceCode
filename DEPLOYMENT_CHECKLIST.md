# Deployment Checklist

Use this checklist to ensure everything is configured correctly before deploying.

## ✅ Pre-Deployment Checklist

### MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Free cluster created and running
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (allow Render IPs or 0.0.0.0/0)
- [ ] Connection string copied and password replaced
- [ ] Connection string tested locally

### Environment Variables Prepared
- [ ] Backend `.env` values ready:
  - [ ] `MONGODB_URI` (MongoDB Atlas connection string)
  - [ ] `FRONTEND_URL` (will update after frontend deploy)
  - [ ] `MAPBOX_TOKEN`
  - [ ] `JWT_SECRET` (32+ characters, secure random string)
- [ ] Frontend environment variables ready:
  - [ ] `VITE_API_BASE_URL` (will update after backend deploy)
  - [ ] `VITE_SOCKET_URL` (will update after backend deploy)
  - [ ] `VITE_MAPBOX_TOKEN`

### Code Preparation
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] `.env` files in `.gitignore`
- [ ] No sensitive data in code
- [ ] Build scripts tested locally
- [ ] No console errors in browser

### Accounts Created
- [ ] Vercel account
- [ ] Render account
- [ ] MongoDB Atlas account
- [ ] Mapbox account

## 🚀 Deployment Steps

### Step 1: Deploy Backend
- [ ] Create Render Web Service
- [ ] Connect Git repository
- [ ] Configure build/start commands
- [ ] Add all environment variables
- [ ] Deploy and wait for success
- [ ] Test health endpoint: `https://your-backend.onrender.com/api/health`
- [ ] Save backend URL

### Step 2: Deploy Frontend
- [ ] Create Vercel project
- [ ] Connect Git repository
- [ ] Configure framework (Vite)
- [ ] Set root directory to `frontend`
- [ ] Add environment variables (use backend URL from Step 1)
- [ ] Deploy and wait for success
- [ ] Save frontend URL

### Step 3: Update CORS
- [ ] Update backend `FRONTEND_URL` with Vercel URL
- [ ] Redeploy backend
- [ ] Verify CORS works

### Step 4: Final Testing
- [ ] Frontend loads correctly
- [ ] API calls work
- [ ] Mapbox maps load
- [ ] Socket.IO connections work
- [ ] All features functional
- [ ] No console errors

## 🔍 Post-Deployment Verification

### Backend Health
```bash
curl https://your-backend.onrender.com/api/health
```
Expected: `{"success":true,"data":{...}}`

### Frontend
- [ ] Home page loads
- [ ] Navigation works
- [ ] Route planner works
- [ ] Maps display correctly
- [ ] API calls succeed
- [ ] No 404 errors

### Database
- [ ] Can create guardians
- [ ] Can create forum posts
- [ ] SOS alerts are logged
- [ ] Data persists correctly

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails | Check logs, verify dependencies |
| MongoDB connection fails | Check connection string, IP whitelist |
| CORS errors | Verify FRONTEND_URL matches exactly |
| Environment variables not working | Check prefixes (VITE_ for frontend) |
| Service sleeping | Normal on free tier, first request takes ~30s |

## 📞 Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mapbox Docs](https://docs.mapbox.com/)

---

**Ready?** Follow the checklist and deploy! 🚀


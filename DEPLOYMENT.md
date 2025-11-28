# Deployment Guide

Complete guide for deploying Routely to production.

## 🎯 Deployment Overview

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render
- **Database**: MongoDB Atlas

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] GitHub/GitLab/Bitbucket account
- [ ] Vercel account ([Sign up](https://vercel.com/signup))
- [ ] Render account ([Sign up](https://render.com))
- [ ] MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- [ ] Mapbox account ([Get token](https://account.mapbox.com/access-tokens/))

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new organization (optional)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose **FREE** (M0) tier
   - Select cloud provider and region (closest to your users)
   - Click "Create"

3. **Create Database User**
   - Go to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Create username and password (save these!)
   - Set privileges to **Read and write to any database**
   - Click "Add User"

4. **Configure Network Access**
   - Go to **Network Access** → **Add IP Address**
   - For Render deployment, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add specific Render IP ranges
   - Click "Confirm"

5. **Get Connection String**
   - Go to **Clusters** → Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `routely`
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/routely?retryWrites=true&w=majority`

## 🖥️ Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard

1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**
   - Connect your Git repository
   - Select your repository

2. **Configure Service**
   - **Name**: `routely-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (if repo has both frontend and backend)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

3. **Add Environment Variables**
   - Go to **Environment** tab
   - Add the following:

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` (update after frontend deploy) |
   | `MAPBOX_TOKEN` | Your Mapbox API token |
   | `JWT_SECRET` | Generate a secure random string (32+ characters) |

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for build to complete
   - Your backend will be at: `https://routely-backend.onrender.com`

### Option B: Using render.yaml

1. The `render.yaml` file is already configured
2. Go to Render → **New +** → **Blueprint**
3. Connect your repository
4. Render will auto-detect and configure from `render.yaml`
5. Add environment variables in dashboard
6. Deploy

## 🌐 Step 3: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard

1. **Create Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"Add New Project"**
   - Import your Git repository

2. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (if repo has both frontend and backend)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add the following:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_BASE_URL` | `https://routely-backend.onrender.com` |
   | `VITE_SOCKET_URL` | `https://routely-backend.onrender.com` |
   | `VITE_MAPBOX_TOKEN` | Your Mapbox API token |

   - Make sure to add for **Production**, **Preview**, and **Development**

4. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete
   - Your frontend will be at: `https://routely.vercel.app`

### Option B: Using Vercel CLI

```bash
cd frontend
npm i -g vercel
vercel login
vercel
vercel --prod
```

## 🔄 Step 4: Update Environment Variables

After both are deployed:

1. **Update Backend CORS**
   - In Render dashboard, update `FRONTEND_URL` to your Vercel URL
   - Redeploy backend

2. **Verify Frontend API URL**
   - In Vercel dashboard, verify `VITE_API_BASE_URL` points to Render backend
   - Redeploy frontend if needed

## ✅ Step 5: Verify Deployment

1. **Test Backend**
   ```bash
   curl https://routely-backend.onrender.com/api/health
   ```
   Should return: `{"success":true,"data":{...}}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Check browser console for errors
   - Test API connections
   - Verify Mapbox maps load

3. **Test Features**
   - Route planning
   - Emergency SOS
   - Safe spots
   - Forum posts

## 🔒 Security Checklist

- [ ] MongoDB Atlas IP whitelist configured
- [ ] Strong database user password
- [ ] JWT_SECRET is 32+ characters
- [ ] Environment variables not committed to Git
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS configured correctly
- [ ] API keys secured

## 📊 Monitoring

### Render
- View logs in Render dashboard
- Monitor service health
- Check build logs
- View metrics

### Vercel
- View deployment logs
- Monitor performance
- Check analytics
- View error logs

## 🔄 Continuous Deployment

Both platforms support automatic deployments:
- **Production**: Deploys from `main`/`master` branch
- **Preview**: Deploys from other branches and PRs

## 🐛 Troubleshooting

### Backend Issues

**Service won't start:**
- Check build logs in Render
- Verify all dependencies in `package.json`
- Check Node.js version compatibility

**MongoDB connection fails:**
- Verify connection string format
- Check IP whitelist includes Render IPs
- Verify database user credentials
- Check MongoDB Atlas cluster is running

**CORS errors:**
- Verify `FRONTEND_URL` matches frontend domain exactly
- Check backend CORS configuration
- Ensure no trailing slashes in URLs

### Frontend Issues

**Build fails:**
- Check build logs in Vercel
- Verify all dependencies installed
- Check for TypeScript/ESLint errors

**API not connecting:**
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings on backend
- Verify backend is deployed and accessible

**Mapbox not loading:**
- Verify `VITE_MAPBOX_TOKEN` is set
- Check token permissions
- Verify token is not expired

### Common Issues

**Environment variables not working:**
- Frontend: Must be prefixed with `VITE_`
- Backend: Must be set in Render dashboard
- Redeploy after adding/changing variables

**Service sleeping (Render free tier):**
- Free tier services sleep after 15 min inactivity
- First request after sleep takes ~30s
- Consider upgrading to paid plan

## 📈 Performance Optimization

### Frontend
- Vite automatically optimizes builds
- Code splitting configured
- Asset optimization enabled
- CDN caching on Vercel

### Backend
- Database connection pooling
- Add indexes to frequently queried fields
- Consider Redis caching (paid plan)
- Optimize API responses

## 🔗 Custom Domains

### Vercel
1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS as instructed
4. SSL certificate auto-generated

### Render
1. Go to **Settings** → **Custom Domains**
2. Add your domain
3. Configure DNS records
4. SSL certificate auto-generated

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mapbox Documentation](https://docs.mapbox.com/)

## 🆘 Support

For deployment issues:
1. Check platform documentation
2. Review build/deployment logs
3. Verify environment variables
4. Check service health status
5. Open issue on repository

---

**Ready to deploy?** Follow the steps above and your app will be live in minutes! 🚀


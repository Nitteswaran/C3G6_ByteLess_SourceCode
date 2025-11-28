# Backend Deployment Guide - Render

This guide will help you deploy the Routely backend to Render.

## Prerequisites

- A Render account ([Sign up here](https://render.com))
- MongoDB Atlas account ([Sign up here](https://www.mongodb.com/cloud/atlas))
- Your frontend URL (deployed on Vercel or another service)
- Mapbox API token

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in
2. Create a new cluster (Free tier is available)
3. Wait for cluster to be created (takes a few minutes)
4. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Create username and password (save these!)
   - Set user privileges to **Read and write to any database**
5. Whitelist IP addresses:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (for Render) or add Render's IP ranges
6. Get your connection string:
   - Go to **Clusters** → Click **Connect** on your cluster
   - Choose **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `routely` (or your preferred database name)
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/routely?retryWrites=true&w=majority`

## Step 2: Deploy to Render

### Option A: Deploy via Render Dashboard

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure the service:
   - **Name**: `routely-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (if your repo has both frontend and backend)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

### Option B: Deploy via render.yaml

1. Push your code with `render.yaml` to your repository
2. Go to Render dashboard → **New +** → **Blueprint**
3. Connect your repository
4. Render will automatically detect `render.yaml` and configure the service

## Step 3: Configure Environment Variables

In your Render service dashboard, go to **Environment** and add:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` (Render sets this automatically) |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/routely?retryWrites=true&w=majority` |
| `FRONTEND_URL` | Your frontend URL | `https://routely.vercel.app` |
| `MAPBOX_TOKEN` | Mapbox API token | `pk.eyJ1Ijoi...` |
| `JWT_SECRET` | JWT secret key (min 32 chars) | Generate a secure random string |

### Important Notes:

- **PORT**: Render automatically sets the PORT environment variable. Your code should use `process.env.PORT || 5000`
- **MONGODB_URI**: Use your MongoDB Atlas connection string from Step 1
- **FRONTEND_URL**: Update this to your deployed frontend URL for CORS
- **JWT_SECRET**: Generate a secure random string (32+ characters)

## Step 4: Deploy and Verify

1. Click **"Create Web Service"** (or **"Save Changes"** if updating)
2. Render will build and deploy your service
3. Wait for deployment to complete (check logs)
4. Your service will be available at: `https://routely-backend.onrender.com`
5. Test the health endpoint: `https://routely-backend.onrender.com/api/health`

## Step 5: Update Frontend Environment Variables

After backend is deployed, update your frontend environment variables:

1. Go to Vercel (or your frontend hosting)
2. Update `VITE_API_BASE_URL` to your Render backend URL
3. Update `VITE_SOCKET_URL` to your Render backend URL
4. Redeploy frontend

## Step 6: Custom Domain (Optional)

1. In Render dashboard, go to **Settings** → **Custom Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate to be issued

## Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (Render uses Node 18.x)

### MongoDB Connection Issues

- Verify MongoDB Atlas cluster is running
- Check IP whitelist includes Render's IPs (or allow all)
- Verify connection string is correct
- Check database user credentials

### Environment Variables Not Working

- Verify variables are set in Render dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding/changing variables

### CORS Errors

- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check backend CORS configuration
- Ensure frontend is using correct API URL

### Service Goes to Sleep (Free Tier)

- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid plan for always-on service

## Continuous Deployment

Render automatically deploys when you push to your main branch:
- **Production**: Deploys from `main` or `master` branch
- **Manual Deploy**: Can deploy specific branches or commits

## Health Checks

Render uses the `/api/health` endpoint for health checks:
- Service must return 200 status
- Health check runs every 10 seconds
- Service restarts if health check fails

## Performance Tips

1. **Database Indexing**: Add indexes to frequently queried fields
2. **Connection Pooling**: MongoDB connection is automatically pooled
3. **Caching**: Consider adding Redis for caching (paid plan)
4. **CDN**: Use Cloudflare or similar for static assets

## Monitoring

Render provides:
- Build logs
- Runtime logs
- Metrics dashboard
- Error tracking

## Support

For Render-specific issues, check:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)


# Frontend Deployment Guide - Vercel

This guide will help you deploy the Routely frontend to Vercel.

## Prerequisites

- A Vercel account ([Sign up here](https://vercel.com/signup))
- GitHub/GitLab/Bitbucket account (for connecting your repository)
- Your backend API URL (deployed on Render or another service)
- Mapbox API token

## Step 1: Prepare Your Repository

1. Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)

2. Ensure your `package.json` has the build script:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (if your repo has both frontend and backend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. For production deployment:
```bash
vercel --prod
```

## Step 3: Configure Environment Variables

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**

2. Add the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Your backend API URL | `https://routely-backend.onrender.com` |
| `VITE_SOCKET_URL` | Your Socket.IO server URL | `https://routely-backend.onrender.com` |
| `VITE_MAPBOX_TOKEN` | Mapbox API token | `pk.eyJ1Ijoi...` |

3. Make sure to add them for all environments (Production, Preview, Development)

4. After adding environment variables, **redeploy** your application

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL (e.g., `https://routely.vercel.app`)
2. Check that the app loads correctly
3. Test API connections
4. Verify Mapbox maps are working

## Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate to be issued

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18.x by default)
- Check build logs in Vercel dashboard

### Environment Variables Not Working

- Make sure variables are prefixed with `VITE_`
- Redeploy after adding environment variables
- Check that variables are added for the correct environment

### API Connection Issues

- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings on backend
- Ensure backend is deployed and accessible

### Mapbox Not Loading

- Verify `VITE_MAPBOX_TOKEN` is set correctly
- Check browser console for errors
- Ensure token has correct permissions

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:
- **Production**: Deploys from `main` or `master` branch
- **Preview**: Deploys from other branches and pull requests

## Performance Optimization

Vercel automatically:
- Optimizes images
- Enables CDN caching
- Minifies JavaScript and CSS
- Enables compression

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)


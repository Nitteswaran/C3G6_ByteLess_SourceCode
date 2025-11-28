# Routely Frontend

React frontend application for Routely - Smart, Safe, and Stress-Free Urban Travel.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🌐 Deployment

### Vercel Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## 📝 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

**Important:** All environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

## 🛠️ Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📚 Tech Stack

- React 18
- Vite
- TailwindCSS
- React Router DOM
- Mapbox GL JS
- Leaflet
- Recharts


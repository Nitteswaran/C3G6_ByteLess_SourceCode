# Mapbox API Key Setup

## Your Mapbox API Key
```
pk.eyJ1Ijoibml0dGVzIiwiYSI6ImNtaWljdjh2NTBiamkzY29jczd5ZGZ6YjIifQ.WoEe6chtJ4m8zDACnXCZtg
```

## Setup Instructions

### Backend Setup

1. Create or edit `backend/.env` file:
```env
MAPBOX_TOKEN=pk.eyJ1Ijoibml0dGVzIiwiYSI6ImNtaWljdjh2NTBiamkzY29jczd5ZGZ6YjIifQ.WoEe6chtJ4m8zDACnXCZtg
```

2. The backend will automatically use this token for Mapbox API calls in route planning.

### Frontend Setup

1. Create or edit `frontend/.env` file:
```env
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoibml0dGVzIiwiYSI6ImNtaWljdjh2NTBiamkzY29jczd5ZGZ6YjIifQ.WoEe6chtJ4m8zDACnXCZtg
```

2. Restart your frontend dev server after adding the token:
```bash
npm run dev
```

## Verification

After setup, you should see:
- ✅ Mapbox maps loading in Route Planner
- ✅ No "Mapbox Token Required" warnings
- ✅ Route planning with traffic data working

## Security Note

⚠️ **Never commit your `.env` files to git!** They are already in `.gitignore`.


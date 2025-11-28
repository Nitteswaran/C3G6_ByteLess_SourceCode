# PowerShell script to setup Mapbox API key
# Run this from the project root: .\setup-mapbox.ps1

$mapboxKey = "pk.eyJ1Ijoibml0dGVzIiwiYSI6ImNtaWljdjh2NTBiamkzY29jczd5ZGZ6YjIifQ.WoEe6chtJ4m8zDACnXCZtg"

Write-Host "🗺️  Setting up Mapbox API Key..." -ForegroundColor Cyan

# Backend .env
$backendEnvPath = "backend\.env"
if (Test-Path $backendEnvPath) {
    $content = Get-Content $backendEnvPath -Raw
    if ($content -match "MAPBOX_TOKEN=") {
        $content = $content -replace "MAPBOX_TOKEN=.*", "MAPBOX_TOKEN=$mapboxKey"
        Set-Content $backendEnvPath $content
        Write-Host "✅ Updated MAPBOX_TOKEN in backend/.env" -ForegroundColor Green
    } else {
        Add-Content $backendEnvPath "`nMAPBOX_TOKEN=$mapboxKey"
        Write-Host "✅ Added MAPBOX_TOKEN to backend/.env" -ForegroundColor Green
    }
} else {
    @"
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/routely
FRONTEND_URL=http://localhost:3000
MAPBOX_TOKEN=$mapboxKey
"@ | Out-File -FilePath $backendEnvPath -Encoding utf8
    Write-Host "✅ Created backend/.env with MAPBOX_TOKEN" -ForegroundColor Green
}

# Frontend .env
$frontendEnvPath = "frontend\.env"
if (Test-Path $frontendEnvPath) {
    $content = Get-Content $frontendEnvPath -Raw
    if ($content -match "VITE_MAPBOX_TOKEN=") {
        $content = $content -replace "VITE_MAPBOX_TOKEN=.*", "VITE_MAPBOX_TOKEN=$mapboxKey"
        Set-Content $frontendEnvPath $content
        Write-Host "✅ Updated VITE_MAPBOX_TOKEN in frontend/.env" -ForegroundColor Green
    } else {
        Add-Content $frontendEnvPath "`nVITE_MAPBOX_TOKEN=$mapboxKey"
        Write-Host "✅ Added VITE_MAPBOX_TOKEN to frontend/.env" -ForegroundColor Green
    }
} else {
    @"
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=$mapboxKey
"@ | Out-File -FilePath $frontendEnvPath -Encoding utf8
    Write-Host "✅ Created frontend/.env with VITE_MAPBOX_TOKEN" -ForegroundColor Green
}

Write-Host ""
Write-Host "Mapbox API key setup complete!" -ForegroundColor Green
Write-Host "Remember to restart your dev servers for changes to take effect." -ForegroundColor Yellow


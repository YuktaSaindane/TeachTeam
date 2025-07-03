#!/usr/bin/env pwsh
# Build script for TeachTeam Full-Stack Application
# This script builds all components of the application in sequence

Write-Host "Building TeachTeam Full-Stack Application..." -ForegroundColor Cyan
Write-Host ""

# Function to check if build was successful
function Check-BuildResult {
    param($ExitCode, $ComponentName)
    if ($ExitCode -eq 0) {
        Write-Host "[SUCCESS] $ComponentName built successfully!" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $ComponentName build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Build Main Frontend
Write-Host "Building Main Frontend (React + Vite)..." -ForegroundColor Yellow
npm run build
Check-BuildResult $LASTEXITCODE "Main Frontend"

# Build Main Backend
Write-Host "Building Main Backend (Node.js + TypeScript)..." -ForegroundColor Yellow
Set-Location Backend
npm run build
Check-BuildResult $LASTEXITCODE "Main Backend"
Set-Location ..

# Build Admin Backend
Write-Host "Building Admin Backend (GraphQL + TypeScript)..." -ForegroundColor Yellow
Set-Location teach-team-admin/admin-backend
npm run build
Check-BuildResult $LASTEXITCODE "Admin Backend"
Set-Location ../..

# Build Admin Frontend
Write-Host "Building Admin Frontend (React + Vite)..." -ForegroundColor Yellow
Set-Location teach-team-admin/admin-frontend
npm run build
Check-BuildResult $LASTEXITCODE "Admin Frontend"
Set-Location ../..

Write-Host "All builds completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Build outputs:" -ForegroundColor Cyan
Write-Host "  - Main Frontend: ./build/" -ForegroundColor Gray
Write-Host "  - Main Backend: ./Backend/dist/" -ForegroundColor Gray
Write-Host "  - Admin Backend: ./teach-team-admin/admin-backend/dist/" -ForegroundColor Gray
Write-Host "  - Admin Frontend: ./teach-team-admin/admin-frontend/dist/" -ForegroundColor Gray
Write-Host ""
Write-Host "Ready for production deployment!" -ForegroundColor Green 
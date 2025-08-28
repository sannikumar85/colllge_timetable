# 🚀 College Timetable Management System - Windows Deployment Script

Write-Host "🎓 College Timetable Management System - Deployment Helper" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not found. Initializing..." -ForegroundColor Red
    git init
    git add .
    git commit -m "Initial deployment commit"
}

Write-Host ""
Write-Host "Choose your deployment option:" -ForegroundColor Cyan
Write-Host "1. 🆓 FREE - Vercel (Frontend) + Railway (Backend)" -ForegroundColor White
Write-Host "2. 🐳 Docker - Local deployment with Docker" -ForegroundColor White  
Write-Host "3. 🔧 Environment setup only" -ForegroundColor White
Write-Host "4. 📤 Push to GitHub" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    1 {
        Write-Host "🚀 Setting up FREE deployment..." -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Steps to complete:" -ForegroundColor Yellow
        Write-Host "1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas"
        Write-Host "2. Get your MongoDB connection string"  
        Write-Host "3. Install Vercel CLI: npm install -g vercel"
        Write-Host "4. Install Railway CLI: npm install -g @railway/cli"
        Write-Host ""
        Write-Host "Frontend deployment (Vercel):" -ForegroundColor Cyan
        Write-Host "cd frontend && vercel --prod" -ForegroundColor White
        Write-Host ""
        Write-Host "Backend deployment (Railway):" -ForegroundColor Cyan  
        Write-Host "cd backend && railway login && railway project create && railway up" -ForegroundColor White
        Write-Host ""
        Write-Host "Don't forget to set environment variables!" -ForegroundColor Yellow
    }
    
    2 {
        Write-Host "🐳 Setting up Docker deployment..." -ForegroundColor Green
        
        # Check if Docker is installed
        $dockerExists = Get-Command docker -ErrorAction SilentlyContinue
        if (-not $dockerExists) {
            Write-Host "❌ Docker not found. Please install Docker first." -ForegroundColor Red
            Write-Host "Visit: https://www.docker.com/get-started"
            exit 1
        }
        
        Write-Host "✅ Docker found!" -ForegroundColor Green
        Write-Host "🔧 Building and starting containers..." -ForegroundColor Yellow
        
        # Build and start containers
        docker-compose up --build -d
        
        Write-Host ""
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "📱 Frontend: http://localhost" -ForegroundColor Cyan
        Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "🗄️ MongoDB: mongodb://admin:password123@localhost:27017/timetable" -ForegroundColor Cyan
    }
    
    3 {
        Write-Host "🔧 Setting up environment files..." -ForegroundColor Green
        
        # Create backend .env
        $backendEnv = @"
MONGODB_URI=mongodb://localhost:27017/timetable
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
"@
        $backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
        
        # Create frontend .env  
        $frontendEnv = @"
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
"@
        $frontendEnv | Out-File -FilePath "frontend\.env" -Encoding UTF8
        
        Write-Host "✅ Environment files created!" -ForegroundColor Green
        Write-Host "📝 Please update the values in:" -ForegroundColor Yellow
        Write-Host "   - backend\.env"
        Write-Host "   - frontend\.env"
    }
    
    4 {
        Write-Host "📤 Pushing to GitHub..." -ForegroundColor Green
        
        # Add all files
        git add .
        
        # Commit changes
        $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "Deployment ready - Added Docker, Railway, and Vercel configurations"
        }
        
        git commit -m $commitMsg
        
        # Push to GitHub
        Write-Host "🔄 Pushing to GitHub..." -ForegroundColor Yellow
        git push origin main
        
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    }
    
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📖 For detailed deployment instructions, check DEPLOYMENT-GUIDE.md" -ForegroundColor Cyan
Write-Host "🎉 Good luck with your deployment!" -ForegroundColor Green

#!/bin/bash

# 🚀 College Timetable Management System - Deployment Script
# This script helps you deploy your MERN stack application

echo "🎓 College Timetable Management System - Deployment Helper"
echo "=========================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial deployment commit"
fi

echo ""
echo "Choose your deployment option:"
echo "1. 🆓 FREE - Vercel (Frontend) + Railway (Backend)"
echo "2. 🐳 Docker - Local deployment with Docker"
echo "3. 🔧 Environment setup only"
echo "4. 📤 Push to GitHub"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Setting up FREE deployment..."
        echo ""
        echo "📋 Steps to complete:"
        echo "1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas"
        echo "2. Get your MongoDB connection string"
        echo "3. Install Vercel CLI: npm install -g vercel"
        echo "4. Install Railway CLI: npm install -g @railway/cli"
        echo ""
        echo "Frontend deployment (Vercel):"
        echo "cd frontend && vercel --prod"
        echo ""
        echo "Backend deployment (Railway):"
        echo "cd backend && railway login && railway project create && railway up"
        echo ""
        echo "Don't forget to set environment variables!"
        ;;
    
    2)
        echo "🐳 Setting up Docker deployment..."
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker not found. Please install Docker first."
            echo "Visit: https://www.docker.com/get-started"
            exit 1
        fi
        
        echo "✅ Docker found!"
        echo "🔧 Building and starting containers..."
        
        # Build and start containers
        docker-compose up --build -d
        
        echo ""
        echo "🎉 Deployment successful!"
        echo "📱 Frontend: http://localhost"
        echo "🔧 Backend: http://localhost:5000"
        echo "🗄️ MongoDB: mongodb://admin:password123@localhost:27017/timetable"
        ;;
        
    3)
        echo "🔧 Setting up environment files..."
        
        # Create backend .env
        cat > backend/.env << EOF
MONGODB_URI=mongodb://localhost:27017/timetable
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
        
        # Create frontend .env
        cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
EOF
        
        echo "✅ Environment files created!"
        echo "📝 Please update the values in:"
        echo "   - backend/.env"
        echo "   - frontend/.env"
        ;;
        
    4)
        echo "📤 Pushing to GitHub..."
        
        # Add all files
        git add .
        
        # Commit changes
        read -p "Enter commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Deployment ready - Added Docker, Railway, and Vercel configurations"
        fi
        
        git commit -m "$commit_msg"
        
        # Push to GitHub
        echo "🔄 Pushing to GitHub..."
        git push origin main
        
        echo "✅ Successfully pushed to GitHub!"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📖 For detailed deployment instructions, check DEPLOYMENT-GUIDE.md"
echo "🎉 Good luck with your deployment!"

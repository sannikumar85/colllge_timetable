# 🚀 Deployment Instructions

## Quick Start Commands

### Option 1: Using VS Code Tasks (Recommended)
1. Open VS Code in the project folder
2. Press `Ctrl+Shift+P` (Windows) 
3. Type "Tasks: Run Task"
4. Select "Start Full Application"

This will start both backend and frontend servers simultaneously.

### Option 2: Using NPM Scripts
```powershell
# Start both servers (requires concurrently)
npm run dev

# Or start individually:
npm run backend  # Starts backend only
npm run frontend # Starts frontend only
```

### Option 3: Manual Start
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

## Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/timetable

## First Time Setup
1. **Install MongoDB** and ensure it's running
2. **Update .env** file in backend folder with your MongoDB URI
3. **Create first college account** via registration page
4. **Add branches, teachers, and subjects** through the dashboard
5. **Generate your first timetable**

## Features Ready to Use ✅

### Authentication System
- College registration and login
- JWT-based authentication
- Protected routes

### Data Management  
- Branch management with classrooms
- Teacher management with availability slots
- Subject management with credits and types

### Timetable Generation
- Intelligent automatic scheduling
- Conflict resolution
- Teacher availability matching
- Downloadable PDF output

### Professional UI/UX
- Modern gradient design
- Responsive layout
- Interactive components
- Color-coded timetables

## Test Data Setup (Optional)

After registration, you can quickly test the system:

1. **Add a Branch**: "Computer Science Engineering" (CSE)
2. **Add Classrooms**: Room-101, Lab-A, etc.
3. **Add Teachers**: With their available time slots
4. **Add Subjects**: For different semesters
5. **Generate Timetable**: Select subjects and generate automatically

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is installed and running
- Check the connection string in `.env`
- Default: `mongodb://localhost:27017/timetable`

### Port Conflicts
- Backend default: Port 5000
- Frontend default: Port 3000  
- Change ports in respective package.json files if needed

### Node Version
- Requires Node.js 14+ 
- Some warnings about newer Node versions are expected

## Production Deployment

### Backend (Node.js/Express)
```bash
cd backend
npm run start
```

### Frontend (React Build)
```bash
cd frontend  
npm run build
# Serve the build folder with your web server
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/timetable
JWT_SECRET=your_super_secret_key_here
NODE_ENV=production
PORT=5000
```

### Frontend (Optional .env)
```env
REACT_APP_API_URL=http://your-backend-url.com/api
```

## Support & Contact

For issues or questions:
- Check the README.md for detailed documentation
- Review the code comments for implementation details
- Create GitHub issues for bugs or feature requests

---

**🎉 Your MERN Stack Timetable Management System is ready to use!**

Navigate to http://localhost:3000 and start by registering your college.

# 🎓 College Timetable Management System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://github.com/sannikumar85/colllge_timetable)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive **MERN Stack** web application for college timetable management with automated scheduling, enhanced teacher profiles, and professional UI.

## 🚀 **Live Demo**

Visit the application: [College Timetable System](https://github.com/sannikumar85/colllge_timetable)

**Demo Credentials:**
- College ID: `DEMO001`
- Password: `demo123`

## 📋 **Features**

### 🎯 **Core Functionality**
- ✅ **College Authentication** - Secure login/registration system
- ✅ **Automated Timetable Generation** - Smart scheduling algorithm  
- ✅ **Enhanced Teacher Database** - 50+ professional profiles with specializations
- ✅ **Complete CRUD Operations** - Manage teachers, subjects, branches
- ✅ **Professional PDF Export** - Download publication-ready timetables
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### 🧠 **Smart Features**
- ✅ **Intelligent Scheduling** - Prevents conflicts, optimizes teacher assignments
- ✅ **Teacher Specialization Matching** - AI/ML, VLSI, Thermal Engineering, etc.
- ✅ **Academic Designation System** - Professor, Associate Prof, Assistant Prof hierarchy
- ✅ **Research Integration** - Publications, research areas, academic projects
- ✅ **Comprehensive Seeding** - Demo data with 50+ enhanced teacher profiles

### 💻 **Technical Features**
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **MongoDB Integration** - Robust database with relationships
- ✅ **RESTful APIs** - Clean, documented API endpoints
- ✅ **Error Handling** - Comprehensive validation and error management
- ✅ **Modern UI/UX** - Clean, professional interface

## 🛠️ **Tech Stack**

### **Frontend**
- **React.js** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Modern styling
- **html2canvas & jsPDF** - PDF generation

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn
- Git

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sannikumar85/colllge_timetable.git
   cd colllge_timetable
   ```

2. **Install dependencies:**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup:**
   
   Create `.env` in backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/timetable
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   PORT=5000
   ```

4. **Start MongoDB:**
   ```bash
   # Windows
   mongod
   
   # Linux/Mac
   sudo service mongod start
   ```

5. **Start the application:**
   
   **Option 1: Using npm scripts (Recommended)**
   ```bash
   # From root directory
   npm run dev  # Starts both backend and frontend
   ```
   
   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   node server.js
   
   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

6. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 **Usage Guide**

### **Step 1: College Registration**
1. Open http://localhost:3000
2. Click "Register" 
3. Fill college details:
   - College ID: `DEMO001`
   - Name: `Demo Engineering College`
   - Email: `admin@demo.edu`
   - Password: `demo123`

### **Step 2: Seed Demo Data**
1. Login to dashboard
2. Scroll to "Seed Sample Data"
3. Click "Seed All Data"
4. Wait for success confirmation

### **Step 3: Generate Timetable**
1. Navigate to "Generate Timetable"
2. Select branch and semester
3. Choose subjects (or click "Select All")
4. Click "Generate Timetable"
5. View and download your professional timetable!

## 🏗️ **Project Structure**

```
colllge_timetable/
├── backend/                 # Node.js/Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication middleware
│   └── server.js          # Express server
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
├── docs/                  # Documentation files
└── README.md             # This file
```

## 📱 **Screenshots**

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Professional+Dashboard)

### Timetable Generation
![Timetable Generator](https://via.placeholder.com/800x400?text=Smart+Timetable+Generator)

### Generated Timetable
![Generated Timetable](https://via.placeholder.com/800x400?text=Professional+Timetable+Output)

## 🔧 **API Documentation**

### **Authentication**
```
POST /api/auth/register     # Register new college
POST /api/auth/login        # College login
```

### **Core Resources**
```
GET    /api/teachers         # Get all teachers
POST   /api/teachers         # Create new teacher
PUT    /api/teachers/:id     # Update teacher
DELETE /api/teachers/:id     # Delete teacher

GET    /api/subjects         # Get all subjects  
POST   /api/subjects         # Create new subject

GET    /api/branches         # Get all branches
POST   /api/branches         # Create new branch

POST   /api/timetables/generate  # Generate timetable
GET    /api/timetables/:branch/:semester  # Get timetable
```

### **Utilities**
```
POST   /api/seed/all         # Seed demo data
GET    /api/seed/status/:collegeId  # Check seed status
```

## 🧪 **Testing**

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests  
cd frontend
npm test
```

## 🚀 **Deployment**

### **Heroku Deployment**
1. Create Heroku app
2. Set environment variables
3. Push to Heroku:
   ```bash
   git push heroku main
   ```

### **Vercel/Netlify (Frontend)**
1. Connect GitHub repository
2. Set build commands:
   - Build: `cd frontend && npm run build`
   - Output: `frontend/build`

### **MongoDB Atlas**
1. Create cluster
2. Update `MONGODB_URI` in environment variables

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Sanni Kumar**
- GitHub: [@sannikumar85](https://github.com/sannikumar85)
- Email: [Contact](mailto:your-email@example.com)

## 🙏 **Acknowledgments**

- React.js team for the amazing frontend framework
- MongoDB team for the robust database solution
- Express.js team for the excellent web framework
- All contributors who helped improve this project

## 🐛 **Issues & Support**

If you encounter any issues or need support:

1. Check the [Issues](https://github.com/sannikumar85/colllge_timetable/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 📈 **Roadmap**

- [ ] Mobile application (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-college support
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Advanced conflict resolution
- [ ] Teacher workload optimization

---

⭐ **If this project helped you, please give it a star!** ⭐

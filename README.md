# College Timetable Management System

A comprehensive **MERN Stack** (MongoDB, Express.js, React, Node.js) web application for managing college timetables with intelligent automatic scheduling.

## 🌟 Features

### College Management
- **College Registration & Login** - Secure authentication system for colleges
- **College Profile Management** - Complete college information management

### Academic Structure
- **Branch Management** - Add and manage different academic branches (CSE, ECE, etc.)
- **Teacher Management** - Comprehensive teacher profiles with qualifications and availability
- **Subject Management** - Subject details with credits, type, and semester information
- **Classroom Management** - Manage classrooms, labs, and seminar halls
- **🌱 Sample Data Seeding** - One-click population with 50+ teachers, 15 branches, and 50+ subjects

### Intelligent Timetable Generation
- **Automatic Scheduling** - AI-powered timetable generation
- **Conflict Resolution** - Prevents teacher double-booking and room conflicts
- **Availability Matching** - Matches teachers with their available time slots
- **Lunch Break Management** - Configurable lunch breaks per branch
- **Subject Distribution** - Optimal distribution based on credits and requirements

### Professional Output
- **Interactive Timetable View** - Clean, color-coded timetable display
- **PDF Download** - High-quality downloadable timetables
- **Statistics Dashboard** - Comprehensive analytics and insights
- **Teacher-wise & Subject-wise Reports** - Detailed scheduling reports

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation

1. **Clone the repository**
   ```powershell
   git clone https://github.com/your-username/timetable-management.git
   cd timetable
   ```

2. **Setup Backend**
   ```powershell
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```powershell
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   Create `.env` file in backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/timetable
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

5. **Start the Application**
   ```powershell
   # Root directory - Start both servers
   npm run dev
   
   # OR start separately:
   # Backend: cd backend && npm start
   # Frontend: cd frontend && npm start
   ```

### 🌱 **NEW: Quick Setup with Sample Data**

1. **Register your college** at http://localhost:3000
2. **Login** with your credentials
3. **Go to Dashboard** and find the "🌱 Seed Sample Data" section
4. **Click "Seed All Data"** to instantly populate:
   - 15 Engineering Branches (CSE, ECE, Mechanical, etc.)
   - 50+ Qualified Teachers with availability schedules
   - 50+ Academic Subjects (Theory/Practical/Lab)
5. **Start generating timetables immediately!**

3. **Setup Frontend**
   ```powershell
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/timetable
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   PORT=5000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the Application**
   
   **Terminal 1 - Backend:**
   ```powershell
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```powershell
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 How to Use

### 1. College Setup
1. **Register** your college with basic details
2. **Login** using your College ID and password
3. View your **dashboard** with system overview

### 2. Academic Structure Setup
1. **Add Branches** - Create branches (CSE, ECE, Mechanical, etc.)
   - Configure periods per day
   - Set lunch break timings
   - Add classrooms and labs

2. **Add Teachers** - Register faculty members
   - Set teacher availability (day-wise periods)
   - Assign subjects they can teach
   - Add qualifications and experience

3. **Add Subjects** - Create subject database
   - Set credits and duration
   - Specify subject type (Theory/Practical/Lab)
   - Assign to specific branch and semester

### 3. Generate Timetables
1. Go to **Timetable Generator**
2. Select **Branch** and **Semester**
3. Choose **Subjects** to include
4. Click **Generate Timetable**
5. View the automatically created schedule
6. **Download** as PDF for printing

### 4. View & Manage
- **Dashboard** - Quick overview and statistics
- **Timetable View** - Interactive schedule display
- **Reports** - Teacher-wise and subject-wise analysis

## 🎨 Design Features

- **Modern UI/UX** - Clean, professional interface with gradient designs
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Color-coded Schedules** - Different colors for subjects, breaks, and free periods
- **Interactive Elements** - Hover effects and smooth transitions
- **Professional Typography** - Google Fonts (Poppins) for readability

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **html2canvas** - Screenshot capture
- **jsPDF** - PDF generation

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │    MongoDB      │
│                 │    │                 │    │                 │
│ • Components    │◄──►│ • REST APIs     │◄──►│ • Collections   │
│ • Pages         │    │ • Middleware    │    │ • Indexes       │
│ • Services      │    │ • Controllers   │    │ • Relationships │
│ • Utils         │    │ • Models        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Input Validation** - Comprehensive data validation
- **CORS Protection** - Controlled cross-origin requests
- **Route Protection** - Private routes with authentication middleware

## 📈 Key Algorithms

### Timetable Generation Algorithm
1. **Teacher Availability Analysis** - Check teacher free slots
2. **Subject Requirement Calculation** - Based on credits (credits × 2 = periods per week)
3. **Conflict Resolution** - Prevent double booking
4. **Optimal Distribution** - Spread subjects across the week
5. **Break Management** - Respect lunch and short breaks

### Features Implemented

✅ College registration and authentication  
✅ Branch management with classroom details  
✅ Teacher management with availability slots  
✅ Subject management with credits and types  
✅ Automatic timetable generation  
✅ Intelligent conflict resolution  
✅ Professional PDF download  
✅ Interactive timetable visualization  
✅ Comprehensive dashboard  
✅ Teacher and subject-wise reports  
✅ Responsive design  
✅ Professional UI/UX  

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

## 🎯 Future Enhancements

- [ ] Email notifications for timetable updates
- [ ] Mobile app version
- [ ] Advanced reporting and analytics
- [ ] Integration with attendance systems
- [ ] Multi-language support
- [ ] Bulk import/export functionality
- [ ] Real-time collaborative editing
- [ ] Advanced constraints and preferences

---

**Made with ❤️ for educational institutions worldwide**

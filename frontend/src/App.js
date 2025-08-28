import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BranchManagement from './pages/BranchManagement';
import TeacherManagement from './pages/TeacherManagement';
import SubjectManagement from './pages/SubjectManagement';
import TimetableGenerator from './pages/TimetableGenerator';
import TimetableView from './pages/TimetableView';

// Services
import { getToken, removeToken } from './utils/auth';
import api from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await api.get('/colleges/profile');
        setCollege(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        removeToken();
      }
    }
    setLoading(false);
  };

  const handleLogin = (collegeData) => {
    setCollege(collegeData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    setCollege(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar college={college} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? 
              <Register onLogin={handleLogin} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard college={college} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/branches" 
            element={
              isAuthenticated ? 
              <BranchManagement /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/teachers" 
            element={
              isAuthenticated ? 
              <TeacherManagement /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/subjects" 
            element={
              isAuthenticated ? 
              <SubjectManagement /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/timetable-generator" 
            element={
              isAuthenticated ? 
              <TimetableGenerator /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/timetable/:branchId/:semester" 
            element={
              isAuthenticated ? 
              <TimetableView /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { setToken, setCurrentCollege } from '../utils/auth';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    collegeId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { collegeId, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, college } = response.data;
      
      setToken(token);
      setCurrentCollege(college);
      onLogin(college);
      toast.success('Login successful!');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#667eea', marginBottom: '10px' }}>📚 Timetable Manager</h1>
          <h2>College Login</h2>
          <p style={{ color: '#666' }}>Sign in to manage your timetables</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="collegeId">College ID</label>
            <input
              type="text"
              className="form-control"
              id="collegeId"
              name="collegeId"
              value={collegeId}
              onChange={onChange}
              required
              placeholder="Enter your college ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

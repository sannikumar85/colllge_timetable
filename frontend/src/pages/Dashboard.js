import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SeedDataComponent from '../components/SeedDataComponent';

const Dashboard = ({ college }) => {
  const [stats, setStats] = useState({
    branches: 0,
    teachers: 0,
    subjects: 0,
    timetables: 0
  });
  const [recentTimetables, setRecentTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [branchesRes, teachersRes, subjectsRes] = await Promise.all([
        api.get('/branches'),
        api.get('/teachers'),
        api.get('/subjects')
      ]);

      setStats({
        branches: branchesRes.data.length,
        teachers: teachersRes.data.length,
        subjects: subjectsRes.data.length,
        timetables: branchesRes.data.length * 8 // Assuming max 8 semesters
      });

      // Get recent timetables (mock data for now)
      setRecentTimetables([]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="container">
        <div className="hero" style={{ padding: '60px 0', marginBottom: '50px' }}>
          <h1>Welcome, {college?.name}! 🎓</h1>
          <p>Manage your college timetables efficiently and professionally</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid">
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>📚 Total Branches</h3>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
              {stats.branches}
            </div>
            <p style={{ color: '#666' }}>Academic branches registered</p>
            <Link to="/branches" className="btn" style={{ marginTop: '15px' }}>
              Manage Branches
            </Link>
          </div>

          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>👨‍🏫 Total Teachers</h3>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
              {stats.teachers}
            </div>
            <p style={{ color: '#666' }}>Faculty members registered</p>
            <Link to="/teachers" className="btn" style={{ marginTop: '15px' }}>
              Manage Teachers
            </Link>
          </div>

          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>📖 Total Subjects</h3>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
              {stats.subjects}
            </div>
            <p style={{ color: '#666' }}>Subjects available</p>
            <Link to="/subjects" className="btn" style={{ marginTop: '15px' }}>
              Manage Subjects
            </Link>
          </div>

          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>🗓️ Generate Timetable</h3>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
              ⚡
            </div>
            <p style={{ color: '#666' }}>Create automated timetables</p>
            <Link to="/timetable-generator" className="btn btn-success" style={{ marginTop: '15px' }}>
              Generate Now
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '30px', color: '#333' }}>🚀 Quick Actions</h2>
          
          <div className="grid">
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>🏢 Setup College Structure</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Add branches, teachers, and subjects to get started
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Link to="/branches" className="btn">Add Branches</Link>
                <Link to="/teachers" className="btn btn-secondary">Add Teachers</Link>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>📅 Create Timetables</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Generate automatic timetables for your branches
              </p>
              <Link to="/timetable-generator" className="btn btn-success">
                Generate Timetable
              </Link>
            </div>
          </div>
        </div>

        {/* College Information */}
        <div className="card" style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>🏫 College Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <strong>College Name:</strong> {college?.name}
            </div>
            <div>
              <strong>College ID:</strong> {college?.collegeId}
            </div>
            <div>
              <strong>Email:</strong> {college?.email}
            </div>
            <div>
              <strong>Phone:</strong> {college?.phone}
            </div>
            {college?.address && (
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Address:</strong> {college.address}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seed Data Component */}
      <SeedDataComponent college={college} />
    </div>
  );
};

export default Dashboard;

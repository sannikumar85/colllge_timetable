import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const SeedDataComponent = ({ college }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const checkSeedStatus = React.useCallback(async () => {
    try {
      const response = await api.get(`/seed/status/${college.collegeId}`);
      setStatus(response.data.data);
    } catch (error) {
      console.error('Error checking seed status:', error);
    }
  }, [college?.collegeId]);

  const seedAllData = async () => {
    setLoading(true);
    try {
      const response = await api.post('/seed/all', {
        collegeId: college.collegeId
      });
      
      toast.success('🎉 Database seeded successfully!');
      toast.info(`✅ Added ${response.data.data.branches} branches, ${response.data.data.teachers} teachers, ${response.data.data.subjects} subjects`);
      
      // Refresh status
      await checkSeedStatus();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to seed database';
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const seedBranchesOnly = async () => {
    setLoading(true);
    try {
      const response = await api.post('/seed/branches', {
        collegeId: college.collegeId
      });
      
      toast.success(`🏢 Added ${response.data.count} branches successfully!`);
      await checkSeedStatus();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to seed branches';
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (college?.collegeId) {
      checkSeedStatus();
    }
  }, [college?.collegeId, checkSeedStatus]);

  return (
    <div className="card" style={{ marginTop: '30px' }}>
      <h3 style={{ marginBottom: '20px', color: '#667eea' }}>🌱 Seed Sample Data</h3>
      
      {status && (
        <div style={{ 
          backgroundColor: status.isSeeded ? '#e8f5e8' : '#fff3cd', 
          border: `1px solid ${status.isSeeded ? '#c3e6c3' : '#ffeaa7'}`,
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '20px' 
        }}>
          <h4>Current Database Status:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '10px' }}>
            <div>📚 Branches: <strong>{status.branches}</strong></div>
            <div>👨‍🏫 Teachers: <strong>{status.teachers}</strong></div>
            <div>📖 Subjects: <strong>{status.subjects}</strong></div>
          </div>
          {status.isSeeded && (
            <p style={{ color: '#28a745', marginTop: '10px', fontWeight: '500' }}>
              ✅ Your database is already populated with sample data!
            </p>
          )}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Quickly populate your database with realistic sample data to test the timetable system:
        </p>
        
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <h4>🏢 15 Branches</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              CSE, ECE, Mechanical, Civil, Electrical, IT, Chemical, Biotechnology, Aerospace, etc.
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <h4>👨‍🏫 50+ Teachers</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Complete faculty with qualifications, subjects, and availability schedules
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <h4>📚 50+ Subjects</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Theory, Practical, and Lab subjects for all semesters
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={seedAllData}
          disabled={loading}
          className="btn btn-success"
          style={{ minWidth: '200px', padding: '15px 30px', fontSize: '16px' }}
        >
          {loading ? (
            <>🔄 Seeding Data...</>
          ) : (
            <>🌱 Seed All Data</>
          )}
        </button>
        
        <button 
          onClick={seedBranchesOnly}
          disabled={loading}
          className="btn btn-secondary"
          style={{ minWidth: '150px', padding: '15px 20px' }}
        >
          🏢 Branches Only
        </button>
        
        <button 
          onClick={checkSeedStatus}
          disabled={loading}
          className="btn"
          style={{ minWidth: '120px', padding: '15px 20px' }}
        >
          🔍 Check Status
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9ff', 
        border: '1px solid #e3f2fd', 
        borderRadius: '8px', 
        padding: '15px', 
        marginTop: '20px' 
      }}>
        <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>💡 What happens when you seed data:</h4>
        <ul style={{ color: '#666', paddingLeft: '20px' }}>
          <li>✅ Creates 15 engineering branches with classrooms</li>
          <li>✅ Adds 50+ qualified teachers with availability schedules</li>
          <li>✅ Generates 50+ subjects across all branches and semesters</li>
          <li>✅ Automatically assigns subjects to appropriate teachers</li>
          <li>✅ Ready for immediate timetable generation</li>
        </ul>
        <p style={{ color: '#e74c3c', marginTop: '10px', fontWeight: '500' }}>
          ⚠️ Note: This will replace any existing data for your college.
        </p>
      </div>
    </div>
  );
};

export default SeedDataComponent;

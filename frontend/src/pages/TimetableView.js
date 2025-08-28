import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import TimetableGrid from '../components/TimetableGrid';

const TimetableView = () => {
  const { branchId, semester } = useParams();
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimetable();
  }, [branchId, semester]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/timetables/${branchId}/${semester}`);
      setTimetable(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('No timetable found for this branch and semester. Please generate one first.');
      } else {
        setError('Error loading timetable. Please try again.');
        toast.error('Error loading timetable');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading timetable...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px 0', minHeight: '100vh' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>❌ Timetable Not Found</h2>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>
              {error}
            </p>
            <div>
              <Link to="/timetable-generator" className="btn btn-success" style={{ marginRight: '15px' }}>
                Generate New Timetable
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '30px' }}>
          <Link to="/dashboard" className="btn btn-secondary" style={{ marginRight: '15px' }}>
            ← Back to Dashboard
          </Link>
          <Link to="/timetable-generator" className="btn btn-secondary">
            Generate New Timetable
          </Link>
        </div>

        <div className="card">
          <TimetableGrid timetable={timetable} showDownload={true} />
        </div>

        {/* Timetable Statistics */}
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#667eea' }}>📊 Timetable Statistics</h3>
          
          <div className="grid">
            <div style={{ textAlign: 'center' }}>
              <h4>Total Subjects</h4>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                {new Set(
                  timetable.schedule
                    .flatMap(day => day.periods)
                    .filter(period => period.subject)
                    .map(period => period.subject._id)
                ).size}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h4>Total Teachers</h4>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                {new Set(
                  timetable.schedule
                    .flatMap(day => day.periods)
                    .filter(period => period.teacher)
                    .map(period => period.teacher._id)
                ).size}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h4>Classes Per Week</h4>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                {timetable.schedule
                  .flatMap(day => day.periods)
                  .filter(period => period.subject && period.teacher).length}
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Schedule */}
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#667eea' }}>📚 Subject-wise Schedule</h3>
          
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Teacher</th>
                  <th>Classes per Week</th>
                  <th>Time Slots</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  new Set(
                    timetable.schedule
                      .flatMap(day => day.periods)
                      .filter(period => period.subject)
                      .map(period => period.subject._id)
                  )
                ).map(subjectId => {
                  const subjectPeriods = timetable.schedule
                    .flatMap(day => 
                      day.periods
                        .filter(period => period.subject && period.subject._id === subjectId)
                        .map(period => ({ ...period, day: day.day }))
                    );
                  
                  const subject = subjectPeriods[0].subject;
                  const teacher = subjectPeriods[0].teacher;
                  
                  return (
                    <tr key={subjectId}>
                      <td>{subject.name}</td>
                      <td>{subject.code}</td>
                      <td>{teacher?.name || 'Not assigned'}</td>
                      <td>{subjectPeriods.length}</td>
                      <td>
                        {subjectPeriods.map((period, index) => (
                          <span key={index} style={{ 
                            display: 'inline-block',
                            margin: '2px',
                            padding: '2px 6px',
                            backgroundColor: '#e3f2fd',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {period.day.slice(0, 3)} P{period.period}
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher-wise Schedule */}
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#667eea' }}>👨‍🏫 Teacher-wise Schedule</h3>
          
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Total Classes</th>
                  <th>Subjects</th>
                  <th>Schedule</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  new Set(
                    timetable.schedule
                      .flatMap(day => day.periods)
                      .filter(period => period.teacher)
                      .map(period => period.teacher._id)
                  )
                ).map(teacherId => {
                  const teacherPeriods = timetable.schedule
                    .flatMap(day => 
                      day.periods
                        .filter(period => period.teacher && period.teacher._id === teacherId)
                        .map(period => ({ ...period, day: day.day }))
                    );
                  
                  const teacher = teacherPeriods[0].teacher;
                  const subjects = Array.from(
                    new Set(teacherPeriods.map(p => p.subject.name))
                  );
                  
                  return (
                    <tr key={teacherId}>
                      <td>{teacher.name}</td>
                      <td>{teacherPeriods.length}</td>
                      <td>{subjects.join(', ')}</td>
                      <td>
                        {teacherPeriods.map((period, index) => (
                          <span key={index} style={{ 
                            display: 'inline-block',
                            margin: '2px',
                            padding: '2px 6px',
                            backgroundColor: '#f3e5f5',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {period.day.slice(0, 3)} P{period.period}
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableView;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const TimetableGenerator = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    branch: '',
    semester: 1,
    subjects: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.branch && formData.semester) {
      fetchSubjects();
    }
  }, [formData.branch, formData.semester]);

  const fetchData = async () => {
    try {
      const [branchesRes, teachersRes] = await Promise.all([
        api.get('/branches'),
        api.get('/teachers')
      ]);
      
      setBranches(branchesRes.data);
      setTeachers(teachersRes.data);
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get(`/subjects/branch/${formData.branch}/semester/${formData.semester}`);
      setSubjects(response.data);
      setFormData(prev => ({ ...prev, subjects: [] }));
    } catch (error) {
      toast.error('Error fetching subjects');
      setSubjects([]);
    }
  };

  const handleGenerateTimetable = async (e) => {
    e.preventDefault();
    
    if (formData.subjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    setGenerating(true);

    try {
      // Fix the payload structure for the API
      const payload = {
        branchId: formData.branch,
        semester: formData.semester,
        subjects: formData.subjects
      };
      
      const response = await api.post('/timetables/generate', payload);
      toast.success('Timetable generated successfully!');
      
      // Navigate to the generated timetable
      navigate(`/timetable/${formData.branch}/${formData.semester}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate timetable';
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubjectToggle = (subjectId) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(id => id !== subjectId)
        : [...prev.subjects, subjectId]
    }));
  };

  const selectAllSubjects = () => {
    setFormData(prev => ({
      ...prev,
      subjects: subjects.map(s => s._id)
    }));
  };

  const clearAllSubjects = () => {
    setFormData(prev => ({
      ...prev,
      subjects: []
    }));
  };

  const getAvailableTeachers = (subjectId) => {
    return teachers.filter(teacher => 
      teacher.branch === formData.branch &&  // Compare branch IDs directly
      teacher.subjects.some(s => s._id === subjectId)
    );
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="container">
        <div className="hero" style={{ padding: '60px 0', marginBottom: '50px' }}>
          <h1>🗓️ Automatic Timetable Generator</h1>
          <p>Generate professional timetables with intelligent scheduling</p>
        </div>

        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Configure Your Timetable</h2>
          
          <form onSubmit={handleGenerateTimetable}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div className="form-group">
                <label>Select Branch</label>
                <select
                  className="form-control"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value, semester: 1, subjects: [] })}
                  required
                >
                  <option value="">Choose a branch</option>
                  {branches.map(branch => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name} ({branch.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Semester</label>
                <select
                  className="form-control"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value), subjects: [] })}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject Selection */}
            {formData.branch && formData.semester && (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <label>Select Subjects for Timetable</label>
                  <div>
                    <button
                      type="button"
                      onClick={selectAllSubjects}
                      className="btn btn-secondary"
                      style={{ marginRight: '10px', padding: '8px 16px', fontSize: '14px' }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={clearAllSubjects}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {subjects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <h4>No subjects found</h4>
                    <p>Please add subjects for this branch and semester first.</p>
                  </div>
                ) : (
                  <div style={{ 
                    maxHeight: '400px', 
                    overflowY: 'auto', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px', 
                    padding: '20px' 
                  }}>
                    {subjects.map(subject => {
                      const availableTeachers = getAvailableTeachers(subject._id);
                      return (
                        <div 
                          key={subject._id} 
                          style={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '8px', 
                            padding: '15px', 
                            marginBottom: '15px',
                            backgroundColor: formData.subjects.includes(subject._id) ? '#f0f8ff' : '#fff'
                          }}
                        >
                          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.subjects.includes(subject._id)}
                              onChange={() => handleSubjectToggle(subject._id)}
                              style={{ marginRight: '15px' }}
                            />
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0, color: '#333' }}>{subject.name}</h4>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                Code: {subject.code} | Credits: {subject.credits} | Type: {subject.type}
                              </p>
                              <p style={{ margin: 0, fontSize: '14px', color: availableTeachers.length > 0 ? '#28a745' : '#dc3545' }}>
                                Available Teachers: {availableTeachers.length > 0 
                                  ? availableTeachers.map(t => t.name).join(', ')
                                  : 'No teachers available'
                                }
                              </p>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Generation Settings */}
            {formData.subjects.length > 0 && (
              <div style={{ 
                backgroundColor: '#f8f9ff', 
                borderRadius: '8px', 
                padding: '20px', 
                marginTop: '30px' 
              }}>
                <h3 style={{ marginBottom: '15px', color: '#667eea' }}>📋 Timetable Preview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>Selected Subjects:</strong> {formData.subjects.length}
                  </div>
                  <div>
                    <strong>Total Credits:</strong> {
                      subjects
                        .filter(s => formData.subjects.includes(s._id))
                        .reduce((total, s) => total + s.credits, 0)
                    }
                  </div>
                  <div>
                    <strong>Available Teachers:</strong> {
                      new Set(
                        teachers
                          .filter(t => t.branch._id === formData.branch)
                          .filter(t => t.subjects.some(s => formData.subjects.includes(s._id)))
                          .map(t => t._id)
                      ).size
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={generating || formData.subjects.length === 0}
                style={{ 
                  padding: '15px 40px', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  minWidth: '200px'
                }}
              >
                {generating ? (
                  <>
                    <span>🔄</span> Generating...
                  </>
                ) : (
                  <>
                    <span>⚡</span> Generate Timetable
                  </>
                )}
              </button>
              
              {generating && (
                <p style={{ color: '#666', marginTop: '15px' }}>
                  This may take a few moments while we optimize your schedule...
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="card" style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '20px', color: '#667eea' }}>💡 How It Works</h3>
          <div className="grid">
            <div style={{ textAlign: 'center' }}>
              <h4>1. Smart Scheduling</h4>
              <p style={{ color: '#666' }}>
                Our algorithm automatically assigns subjects based on teacher availability and subject requirements.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4>2. Conflict Resolution</h4>
              <p style={{ color: '#666' }}>
                Prevents double-booking of teachers and ensures optimal time distribution.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4>3. Professional Output</h4>
              <p style={{ color: '#666' }}>
                Generates clean, downloadable timetables with all necessary details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;

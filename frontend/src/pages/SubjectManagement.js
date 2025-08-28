import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    type: 'Theory',
    duration: 60,
    branch: '',
    semester: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, branchesRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/branches')
      ]);
      
      setSubjects(subjectsRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject._id}`, formData);
        toast.success('Subject updated successfully');
      } else {
        await api.post('/subjects', formData);
        toast.success('Subject created successfully');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/subjects/${id}`);
        toast.success('Subject deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Error deleting subject');
      }
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      credits: subject.credits,
      type: subject.type,
      duration: subject.duration,
      branch: subject.branch._id,
      semester: subject.semester
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      credits: 3,
      type: 'Theory',
      duration: 50,
      branch: '',
      semester: 1
    });
    setEditingSubject(null);
    setShowForm(false);
  };

  // Group subjects by branch
  const subjectsByBranch = subjects.reduce((acc, subject) => {
    const branchName = subject.branch.name;
    if (!acc[branchName]) {
      acc[branchName] = [];
    }
    acc[branchName].push(subject);
    return acc;
  }, {});

  if (loading) return <div className="loading">Loading subjects...</div>;

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>📖 Subject Management</h1>
          <button onClick={() => setShowForm(true)} className="btn">
            + Add New Subject
          </button>
        </div>

        {/* Subject List */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>All Subjects</h2>
          
          {subjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>No subjects found</h3>
              <p>Add your first subject to get started</p>
            </div>
          ) : (
            Object.entries(subjectsByBranch).map(([branchName, branchSubjects]) => (
              <div key={branchName} style={{ marginBottom: '30px' }}>
                <h3 style={{ 
                  color: '#667eea', 
                  marginBottom: '15px', 
                  borderBottom: '2px solid #e0e0e0', 
                  paddingBottom: '10px' 
                }}>
                  {branchName}
                </h3>
                
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Subject Name</th>
                        <th>Code</th>
                        <th>Credits</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Semester</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchSubjects
                        .sort((a, b) => a.semester - b.semester)
                        .map((subject) => (
                        <tr key={subject._id}>
                          <td>{subject.name}</td>
                          <td>{subject.code}</td>
                          <td>{subject.credits}</td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: subject.type === 'Theory' ? '#e3f2fd' : 
                                             subject.type === 'Practical' ? '#f3e5f5' : '#e8f5e8',
                              color: subject.type === 'Theory' ? '#1976d2' : 
                                     subject.type === 'Practical' ? '#7b1fa2' : '#388e3c'
                            }}>
                              {subject.type}
                            </span>
                          </td>
                          <td>{subject.duration} min</td>
                          <td>{subject.semester}</td>
                          <td>
                            <button 
                              onClick={() => handleEdit(subject)}
                              className="btn btn-secondary"
                              style={{ marginRight: '10px', padding: '8px 16px' }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(subject._id)}
                              className="btn btn-danger"
                              style={{ padding: '8px 16px' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="modal">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <h2>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Subject Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Data Structures and Algorithms"
                  />
                </div>

                <div className="form-group">
                  <label>Subject Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    placeholder="e.g., CS101"
                  />
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <select
                    className="form-control"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Credits</label>
                    <select
                      className="form-control"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    >
                      <option value={1}>1 Credit</option>
                      <option value={2}>2 Credits</option>
                      <option value={3}>3 Credits</option>
                      <option value={4}>4 Credits</option>
                      <option value={5}>5 Credits</option>
                      <option value={6}>6 Credits</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Subject Type</label>
                    <select
                      className="form-control"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Theory">Theory</option>
                      <option value="Practical">Practical</option>
                      <option value="Lab">Lab</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <select
                      className="form-control"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    >
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                      <option value={120}>120 minutes</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Semester</label>
                  <select
                    className="form-control"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    {editingSubject ? 'Update Subject' : 'Create Subject'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectManagement;

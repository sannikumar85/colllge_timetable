import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    totalSemesters: 8,
    periodsPerDay: 8,
    classrooms: [{ name: '', capacity: 60, type: 'Classroom', location: '' }],
    lunchBreak: { startPeriod: 5, endPeriod: 5 }
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await api.get('/branches');
      setBranches(response.data);
    } catch (error) {
      toast.error('Error fetching branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBranch) {
        await api.put(`/branches/${editingBranch._id}`, formData);
        toast.success('Branch updated successfully');
      } else {
        await api.post('/branches', formData);
        toast.success('Branch created successfully');
      }
      
      resetForm();
      fetchBranches();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await api.delete(`/branches/${id}`);
        toast.success('Branch deleted successfully');
        fetchBranches();
      } catch (error) {
        toast.error('Error deleting branch');
      }
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      totalSemesters: branch.totalSemesters,
      periodsPerDay: branch.periodsPerDay,
      classrooms: branch.classrooms.length > 0 ? branch.classrooms : [{ name: '', capacity: 60, type: 'Classroom', location: '' }],
      lunchBreak: branch.lunchBreak
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      totalSemesters: 8,
      periodsPerDay: 8,
      classrooms: [{ name: '', capacity: 60, type: 'Classroom', location: '' }],
      lunchBreak: { startPeriod: 5, endPeriod: 5 }
    });
    setEditingBranch(null);
    setShowForm(false);
  };

  const handleClassroomChange = (index, field, value) => {
    const newClassrooms = [...formData.classrooms];
    newClassrooms[index] = { ...newClassrooms[index], [field]: value };
    setFormData({ ...formData, classrooms: newClassrooms });
  };

  const addClassroom = () => {
    setFormData({
      ...formData,
      classrooms: [...formData.classrooms, { name: '', capacity: 60, type: 'Classroom', location: '' }]
    });
  };

  const removeClassroom = (index) => {
    if (formData.classrooms.length > 1) {
      const newClassrooms = formData.classrooms.filter((_, i) => i !== index);
      setFormData({ ...formData, classrooms: newClassrooms });
    }
  };

  if (loading) return <div className="loading">Loading branches...</div>;

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>🏢 Branch Management</h1>
          <button onClick={() => setShowForm(true)} className="btn">
            + Add New Branch
          </button>
        </div>

        {/* Branch List */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>All Branches</h2>
          
          {branches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>No branches found</h3>
              <p>Create your first branch to get started</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Branch Name</th>
                    <th>Code</th>
                    <th>Semesters</th>
                    <th>Periods/Day</th>
                    <th>Classrooms</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch._id}>
                      <td>{branch.name}</td>
                      <td>{branch.code}</td>
                      <td>{branch.totalSemesters}</td>
                      <td>{branch.periodsPerDay}</td>
                      <td>{branch.classrooms.length}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(branch)}
                          className="btn btn-secondary"
                          style={{ marginRight: '10px', padding: '8px 16px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(branch._id)}
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
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="modal">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <h2>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Branch Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Computer Science Engineering"
                  />
                </div>

                <div className="form-group">
                  <label>Branch Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    placeholder="e.g., CSE"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Total Semesters</label>
                    <select
                      className="form-control"
                      value={formData.totalSemesters}
                      onChange={(e) => setFormData({ ...formData, totalSemesters: parseInt(e.target.value) })}
                    >
                      <option value={6}>6 Semesters</option>
                      <option value={8}>8 Semesters</option>
                      <option value={10}>10 Semesters</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Periods Per Day</label>
                    <select
                      className="form-control"
                      value={formData.periodsPerDay}
                      onChange={(e) => setFormData({ ...formData, periodsPerDay: parseInt(e.target.value) })}
                    >
                      <option value={6}>6 Periods</option>
                      <option value={7}>7 Periods</option>
                      <option value={8}>8 Periods</option>
                    </select>
                  </div>
                </div>

                {/* Lunch Break Settings */}
                <div className="form-group">
                  <label>Lunch Break Period</label>
                  <select
                    className="form-control"
                    value={formData.lunchBreak.startPeriod}
                    onChange={(e) => setFormData({
                      ...formData,
                      lunchBreak: { startPeriod: parseInt(e.target.value), endPeriod: parseInt(e.target.value) }
                    })}
                  >
                    <option value={4}>Period 4</option>
                    <option value={5}>Period 5</option>
                    <option value={6}>Period 6</option>
                  </select>
                </div>

                {/* Classrooms */}
                <div className="form-group">
                  <label>Classrooms</label>
                  {formData.classrooms.map((classroom, index) => (
                    <div key={index} style={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px', 
                      padding: '15px', 
                      marginBottom: '10px' 
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Classroom Name"
                          value={classroom.name}
                          onChange={(e) => handleClassroomChange(index, 'name', e.target.value)}
                          required
                        />
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Capacity"
                          value={classroom.capacity}
                          onChange={(e) => handleClassroomChange(index, 'capacity', parseInt(e.target.value))}
                          required
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginTop: '10px' }}>
                        <select
                          className="form-control"
                          value={classroom.type}
                          onChange={(e) => handleClassroomChange(index, 'type', e.target.value)}
                        >
                          <option value="Classroom">Classroom</option>
                          <option value="Lab">Lab</option>
                          <option value="Seminar Hall">Seminar Hall</option>
                        </select>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Location (Optional)"
                          value={classroom.location}
                          onChange={(e) => handleClassroomChange(index, 'location', e.target.value)}
                        />
                        {formData.classrooms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeClassroom(index)}
                            className="btn btn-danger"
                            style={{ padding: '8px 12px' }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addClassroom}
                    className="btn btn-secondary"
                    style={{ marginTop: '10px' }}
                  >
                    + Add Classroom
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    {editingBranch ? 'Update Branch' : 'Create Branch'}
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

export default BranchManagement;

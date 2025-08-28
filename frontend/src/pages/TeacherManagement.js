import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    branch: '',
    subjects: [],
    qualifications: [''],
    experience: 0,
    availableSlots: [
      { day: 'Monday', periods: [] },
      { day: 'Tuesday', periods: [] },
      { day: 'Wednesday', periods: [] },
      { day: 'Thursday', periods: [] },
      { day: 'Friday', periods: [] },
      { day: 'Saturday', periods: [] }
    ]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersRes, branchesRes, subjectsRes] = await Promise.all([
        api.get('/teachers'),
        api.get('/branches'),
        api.get('/subjects')
      ]);
      
      setTeachers(teachersRes.data || []);
      setBranches(branchesRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTeacher) {
        await api.put(`/teachers/${editingTeacher._id}`, formData);
        toast.success('Teacher updated successfully');
      } else {
        await api.post('/teachers', formData);
        toast.success('Teacher created successfully');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/teachers/${id}`);
        toast.success('Teacher deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Error deleting teacher');
      }
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      employeeId: teacher.employeeId,
      branch: teacher.branch?._id || '',
      subjects: teacher.subjects?.map(s => s._id) || [],
      qualifications: teacher.qualifications?.length > 0 ? teacher.qualifications : [''],
      experience: teacher.experience,
      availableSlots: teacher.availableSlots?.length > 0 ? teacher.availableSlots : [
        { day: 'Monday', periods: [] },
        { day: 'Tuesday', periods: [] },
        { day: 'Wednesday', periods: [] },
        { day: 'Thursday', periods: [] },
        { day: 'Friday', periods: [] },
        { day: 'Saturday', periods: [] }
      ]
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      employeeId: '',
      branch: '',
      subjects: [],
      qualifications: [''],
      experience: 0,
      availableSlots: [
        { day: 'Monday', periods: [] },
        { day: 'Tuesday', periods: [] },
        { day: 'Wednesday', periods: [] },
        { day: 'Thursday', periods: [] },
        { day: 'Friday', periods: [] },
        { day: 'Saturday', periods: [] }
      ]
    });
    setEditingTeacher(null);
    setShowForm(false);
  };

  const handleQualificationChange = (index, value) => {
    const newQualifications = [...formData.qualifications];
    newQualifications[index] = value;
    setFormData({ ...formData, qualifications: newQualifications });
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, '']
    });
  };

  const removeQualification = (index) => {
    if (formData.qualifications.length > 1) {
      const newQualifications = formData.qualifications.filter((_, i) => i !== index);
      setFormData({ ...formData, qualifications: newQualifications });
    }
  };

  const handleAvailabilityChange = (dayIndex, period) => {
    const newAvailableSlots = [...formData.availableSlots];
    const periodIndex = newAvailableSlots[dayIndex].periods.indexOf(period);
    
    if (periodIndex > -1) {
      newAvailableSlots[dayIndex].periods.splice(periodIndex, 1);
    } else {
      newAvailableSlots[dayIndex].periods.push(period);
    }
    
    setFormData({ ...formData, availableSlots: newAvailableSlots });
  };

  const getFilteredSubjects = () => {
    return subjects.filter(subject => 
      subject && 
      subject.branch && 
      subject.branch._id === formData.branch
    );
  };

  if (loading) return <div className="loading">Loading teachers...</div>;

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>👨‍🏫 Teacher Management</h1>
          <button onClick={() => setShowForm(true)} className="btn">
            + Add New Teacher
          </button>
        </div>

        {/* Teacher List */}
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>All Teachers</h2>
          
          {teachers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>No teachers found</h3>
              <p>Add your first teacher to get started</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Employee ID</th>
                    <th>Email</th>
                    <th>Branch</th>
                    <th>Designation</th>
                    <th>Experience</th>
                    <th>Specialization</th>
                    <th>Publications</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td>
                        <strong>{teacher.name}</strong>
                        {teacher.qualifications?.length > 0 && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {teacher.qualifications.join(', ')}
                          </div>
                        )}
                      </td>
                      <td>{teacher.employeeId}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.branch?.name || 'No Branch Assigned'}</td>
                      <td>
                        <span style={{ 
                          backgroundColor: teacher.designation === 'Professor' ? '#e8f5e8' : 
                                         teacher.designation === 'Associate Professor' ? '#fff3cd' :
                                         teacher.designation === 'Assistant Professor' ? '#d4edda' : '#f8f9fa',
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {teacher.designation || 'Assistant Professor'}
                        </span>
                      </td>
                      <td>{teacher.experience} years</td>
                      <td>
                        <div style={{ maxWidth: '200px' }}>
                          {teacher.specialization || 'General Engineering'}
                          {teacher.researchAreas?.length > 0 && (
                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                              Research: {teacher.researchAreas.slice(0, 2).join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ textAlign: 'center' }}>
                          <strong>{teacher.publications || 0}</strong>
                          <div style={{ fontSize: '11px', color: '#666' }}>Papers</div>
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleEdit(teacher)}
                          className="btn btn-secondary"
                          style={{ marginRight: '10px', padding: '8px 16px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(teacher._id)}
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
            <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Teacher Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter teacher name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Employee ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      required
                      placeholder="Enter employee ID"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Branch</label>
                    <select
                      className="form-control"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value, subjects: [] })}
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

                  <div className="form-group">
                    <label>Experience (Years)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div className="form-group">
                  <label>Subjects</label>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px' }}>
                    {formData.branch ? (
                      getFilteredSubjects().length > 0 ? (
                        getFilteredSubjects().map(subject => (
                          <label key={subject._id} style={{ display: 'block', marginBottom: '8px' }}>
                            <input
                              type="checkbox"
                              checked={formData.subjects.includes(subject._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, subjects: [...formData.subjects, subject._id] });
                                } else {
                                  setFormData({ ...formData, subjects: formData.subjects.filter(id => id !== subject._id) });
                                }
                              }}
                              style={{ marginRight: '8px' }}
                            />
                            {subject.name} ({subject.code})
                          </label>
                        ))
                      ) : (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>
                          No subjects available for the selected branch. Please add subjects first.
                        </p>
                      )
                    ) : (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>
                        Please select a branch first to see available subjects.
                      </p>
                    )}
                  </div>
                </div>

                {/* Qualifications */}
                <div className="form-group">
                  <label>Qualifications</label>
                  {formData.qualifications.map((qualification, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        className="form-control"
                        value={qualification}
                        onChange={(e) => handleQualificationChange(index, e.target.value)}
                        placeholder="Enter qualification"
                        required
                      />
                      {formData.qualifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQualification(index)}
                          className="btn btn-danger"
                          style={{ padding: '8px 12px' }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQualification}
                    className="btn btn-secondary"
                  >
                    + Add Qualification
                  </button>
                </div>

                {/* Availability */}
                <div className="form-group">
                  <label>Available Time Slots</label>
                  <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px' }}>
                    {formData.availableSlots.map((daySlot, dayIndex) => (
                      <div key={daySlot.day} style={{ marginBottom: '15px' }}>
                        <strong>{daySlot.day}</strong>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(period => (
                            <label key={period} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <input
                                type="checkbox"
                                checked={daySlot.periods.includes(period)}
                                onChange={() => handleAvailabilityChange(dayIndex, period)}
                              />
                              P{period}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
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

export default TeacherManagement;

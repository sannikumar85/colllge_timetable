const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  availableSlots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    periods: [{
      type: Number,
      min: 1,
      max: 8
    }]
  }],
  qualifications: [String],
  experience: {
    type: Number,
    default: 0
  },
  specialization: {
    type: String,
    default: 'General Engineering'
  },
  designation: {
    type: String,
    enum: ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'],
    default: 'Assistant Professor'
  },
  researchAreas: [String],
  publications: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    default: 50000
  },
  projects: {
    type: Number,
    default: 0
  },
  awards: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);

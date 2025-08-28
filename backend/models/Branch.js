const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  totalSemesters: {
    type: Number,
    required: true,
    default: 8
  },
  classrooms: [{
    name: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['Classroom', 'Lab', 'Seminar Hall'],
      default: 'Classroom'
    },
    location: String
  }],
  periodsPerDay: {
    type: Number,
    default: 8
  },
  lunchBreak: {
    startPeriod: {
      type: Number,
      default: 4
    },
    endPeriod: {
      type: Number,
      default: 5
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Branch', branchSchema);

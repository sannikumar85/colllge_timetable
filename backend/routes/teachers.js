const express = require('express');
const Teacher = require('../models/Teacher');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/teachers
// @desc    Create a new teacher
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, employeeId, branch, subjects, availableSlots, qualifications, experience } = req.body;

    // Check if teacher already exists
    let teacher = await Teacher.findOne({ 
      $or: [{ email }, { employeeId }] 
    });

    if (teacher) {
      return res.status(400).json({ message: 'Teacher already exists with this email or employee ID' });
    }

    teacher = new Teacher({
      name,
      email,
      phone,
      employeeId,
      college: req.college.id,
      branch,
      subjects,
      availableSlots,
      qualifications,
      experience
    });

    await teacher.save();

    const populatedTeacher = await Teacher.findById(teacher._id)
      .populate('branch')
      .populate('subjects');

    res.json(populatedTeacher);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/teachers
// @desc    Get all teachers for a college
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const teachers = await Teacher.find({ college: req.college.id })
      .populate('branch')
      .populate('subjects');
    
    res.json(teachers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/teachers/branch/:branchId
// @desc    Get teachers by branch
// @access  Private
router.get('/branch/:branchId', auth, async (req, res) => {
  try {
    const teachers = await Teacher.find({ 
      college: req.college.id,
      branch: req.params.branchId
    })
      .populate('branch')
      .populate('subjects');
    
    res.json(teachers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/teachers/:id
// @desc    Get teacher by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.params.id,
      college: req.college.id
    })
      .populate('branch')
      .populate('subjects');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/teachers/:id
// @desc    Update teacher
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, phone, branch, subjects, availableSlots, qualifications, experience } = req.body;

    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, college: req.college.id },
      { name, email, phone, branch, subjects, availableSlots, qualifications, experience },
      { new: true }
    )
      .populate('branch')
      .populate('subjects');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/teachers/:id
// @desc    Delete teacher
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndDelete({
      _id: req.params.id,
      college: req.college.id
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/teachers/available/:branchId/:day/:period
// @desc    Get available teachers for a specific slot
// @access  Private
router.get('/available/:branchId/:day/:period', auth, async (req, res) => {
  try {
    const { branchId, day, period } = req.params;

    const teachers = await Teacher.find({
      college: req.college.id,
      branch: branchId,
      'availableSlots': {
        $elemMatch: {
          day: day,
          periods: { $in: [parseInt(period)] }
        }
      }
    })
      .populate('subjects');

    res.json(teachers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

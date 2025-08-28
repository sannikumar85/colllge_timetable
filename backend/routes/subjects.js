const express = require('express');
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/subjects
// @desc    Create a new subject
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, code, credits, type, duration, branch, semester } = req.body;

    // Check if subject already exists
    let subject = await Subject.findOne({ code, college: req.college.id });

    if (subject) {
      return res.status(400).json({ message: 'Subject with this code already exists' });
    }

    subject = new Subject({
      name,
      code,
      credits,
      type,
      duration,
      college: req.college.id,
      branch,
      semester
    });

    await subject.save();

    const populatedSubject = await Subject.findById(subject._id)
      .populate('branch');

    res.json(populatedSubject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/subjects
// @desc    Get all subjects for a college
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ college: req.college.id })
      .populate('branch');
    
    res.json(subjects);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/subjects/branch/:branchId
// @desc    Get subjects by branch
// @access  Private
router.get('/branch/:branchId', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      college: req.college.id,
      branch: req.params.branchId
    })
      .populate('branch');
    
    res.json(subjects);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/subjects/branch/:branchId/semester/:semester
// @desc    Get subjects by branch and semester
// @access  Private
router.get('/branch/:branchId/semester/:semester', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      college: req.college.id,
      branch: req.params.branchId,
      semester: req.params.semester
    })
      .populate('branch');
    
    res.json(subjects);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/subjects/:id
// @desc    Get subject by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      college: req.college.id
    })
      .populate('branch');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/subjects/:id
// @desc    Update subject
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, code, credits, type, duration, branch, semester } = req.body;

    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, college: req.college.id },
      { name, code, credits, type, duration, branch, semester },
      { new: true }
    )
      .populate('branch');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/subjects/:id
// @desc    Delete subject
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      college: req.college.id
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

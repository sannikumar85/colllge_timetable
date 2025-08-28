const express = require('express');
const Branch = require('../models/Branch');
const College = require('../models/College');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/branches
// @desc    Create a new branch
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, code, totalSemesters, classrooms, periodsPerDay, lunchBreak } = req.body;

    const branch = new Branch({
      name,
      code,
      college: req.college.id,
      totalSemesters,
      classrooms,
      periodsPerDay,
      lunchBreak
    });

    await branch.save();

    // Add branch to college
    await College.findByIdAndUpdate(
      req.college.id,
      { $push: { branches: branch._id } }
    );

    res.json(branch);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/branches
// @desc    Get all branches for a college
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const branches = await Branch.find({ college: req.college.id });
    res.json(branches);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/branches/:id
// @desc    Get branch by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const branch = await Branch.findOne({
      _id: req.params.id,
      college: req.college.id
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.json(branch);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/branches/:id
// @desc    Update branch
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, code, totalSemesters, classrooms, periodsPerDay, lunchBreak } = req.body;

    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id, college: req.college.id },
      { name, code, totalSemesters, classrooms, periodsPerDay, lunchBreak },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.json(branch);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/branches/:id
// @desc    Delete branch
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const branch = await Branch.findOneAndDelete({
      _id: req.params.id,
      college: req.college.id
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Remove branch from college
    await College.findByIdAndUpdate(
      req.college.id,
      { $pull: { branches: branch._id } }
    );

    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

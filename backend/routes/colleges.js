const express = require('express');
const College = require('../models/College');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET api/colleges/profile
// @desc    Get college profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const college = await College.findById(req.college.id)
      .select('-password')
      .populate('branches');
    
    res.json(college);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/colleges/profile
// @desc    Update college profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, address, email, phone } = req.body;

    const college = await College.findByIdAndUpdate(
      req.college.id,
      { name, address, email, phone },
      { new: true }
    ).select('-password');

    res.json(college);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const College = require('../models/College');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register college
// @access  Public
router.post('/register', [
  body('name').not().isEmpty().withMessage('College name is required'),
  body('collegeId').not().isEmpty().withMessage('College ID is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('address').not().isEmpty().withMessage('Address is required'),
  body('phone').not().isEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, collegeId, email, password, address, phone } = req.body;

    // Check if college already exists
    let college = await College.findOne({ 
      $or: [{ email }, { collegeId }] 
    });

    if (college) {
      return res.status(400).json({ message: 'College already exists' });
    }

    // Create new college
    college = new College({
      name,
      collegeId,
      email,
      password,
      address,
      phone
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    college.password = await bcrypt.hash(password, salt);

    await college.save();

    // Create JWT token
    const payload = {
      college: {
        id: college.id,
        collegeId: college.collegeId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          college: {
            id: college.id,
            name: college.name,
            collegeId: college.collegeId,
            email: college.email
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Login college
// @access  Public
router.post('/login', [
  body('collegeId').not().isEmpty().withMessage('College ID is required'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { collegeId, password } = req.body;

    // Check if college exists
    let college = await College.findOne({ collegeId });

    if (!college) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, college.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      college: {
        id: college.id,
        collegeId: college.collegeId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          college: {
            id: college.id,
            name: college.name,
            collegeId: college.collegeId,
            email: college.email
          }
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Increased from '1d' to '7d'
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login user and return token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

async function comparePassword(candidatePassword, hashedPassword) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
}

exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  //   Validation
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // check email if already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already used' });
    }

    // create user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    return res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error while registering user',
      error: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });

    // User validation
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    return res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

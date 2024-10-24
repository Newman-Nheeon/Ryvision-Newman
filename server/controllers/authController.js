const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const logger = require('../logger');
require('dotenv').config();
const axios = require('axios');

// Admin registration
exports.registerAdmin = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    // Check if the current admin is a super admin
    const currentAdmin = await Admin.findById(req.adminId);
    if (!currentAdmin || currentAdmin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only super admins can create new admins' });
    }

    const adminExists = await Admin.findOne({ $or: [{ username }, { email }] });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin with the given username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: role || 'admin' // Default role is 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    logger.error('Failed to register admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Admin login
exports.loginAdmin = async (req, res) => {
  const { login, password, captcha } = req.body;

  try {
    logger.info(`Login attempt: ${login}`);

    // Verify the reCAPTCHA token
    if (!captcha) {
      logger.warn('reCAPTCHA token missing');
      return res.status(400).json({ message: 'Please complete the reCAPTCHA' });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    const captchaResponse = await axios.post(verificationURL);
    const { success } = captchaResponse.data;

    if (!success) {
      logger.warn('reCAPTCHA verification failed');
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    const admin = await Admin.findOne({ $or: [{ username: login }, { email: login }] });
    if (!admin) {
      logger.warn('Admin not found');
      return res.status(404).json({ message: 'Admin not found' });
    }

    logger.info(`Admin found: ${admin.username}`);

    // Compare hashed password using the method defined in the schema
    const isMatch = await admin.comparePassword(password);
    logger.info(`Password comparison result: ${isMatch}`);

    if (!isMatch) {
      logger.warn('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true, // The cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV !== 'development', // Only transfer cookies over HTTPS
      maxAge: 3600000, // Cookie expiration set to match token expiration (1 hour)
    });

    logger.info('Login successful');

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    logger.error('Server error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Set New Password
exports.setNewPassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
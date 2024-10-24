const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Admin = require('../models/admin');
const logger = require('../logger');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_ACCOUNT, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email account password or app password
    },
  });

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info('Email sent successfully');
    } catch (error) {
        logger.error('Error sending email:', error);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate a random password
        const newPassword = crypto.randomBytes(6).toString('hex');
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the admin's password in the database
        admin.password = hashedPassword;
        await admin.save();

        // Send the new password to the admin's email
        await sendMail(
            email,
            'Password Reset',
            `Your new password is: ${newPassword}\nPlease change it upon login.`
        );

        res.json({ message: 'A new password has been sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during password reset process.' });
    }
};

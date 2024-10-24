const express = require('express');
const router = express.Router();
const userController = require('../controllers/participantController');
const { submitVote, showApprovedParticipants } = require('../controllers/votingController');
const upload = require('../utils/file');
const verifyJWT = require('../config/verifyJWT');
const { totalParticipant } = require('../controllers/adminController');

// Participant Routes
// ------------------

// Complete registration with file upload (profile image and entry image)
router.post(
  '/complete-registration',
  upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'entryImage', maxCount: 1 }]),
  userController.completeRegistration
);

// Email verification via token
router.get('/verify-email', userController.verifyEmail);

// Submit email for registration (includes captcha verification)
router.post('/submit-email', userController.submitEmail);

// Resend verification token if the email is not received
router.post('/resend-verification-token', userController.resendVerificationToken);

// Voting Routes
// -------------
// Submit a vote for a participant
router.post('/vote', submitVote);

// Show approved participants
router.get('/participant', showApprovedParticipants);

// Admin Routes
// ------------
// Retrieve the total number of participants (secure route)
router.get('/total-participant', verifyJWT, totalParticipant);

module.exports = router;

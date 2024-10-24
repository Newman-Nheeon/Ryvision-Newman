const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, setNewPassword } = require('../controllers/authController');
const { forgotPassword } = require('../controllers/forgetPasswordController');
const verifyJWT = require('../config/verifyJWT');
const { 
    approveParticipant, 
    declineParticipant, 
    totalParticipant, 
    countApprovedParticipants, 
    countDeclinedParticipants, 
    countPendingParticipants, 
    searchParticipants,
    endCompetition,
    startCompetition,
    getCompetitionState
} = require('../controllers/adminController');

// Admin registration - Only accessible by super admins
router.post('/register', verifyJWT, registerAdmin);

// Admin login
router.post('/login', loginAdmin);
router.post('/new-password', setNewPassword);
router.post('/forget-password', forgotPassword);

// Protect all admin routes
router.use(verifyJWT);

router.get('/dashboard', (req, res) => {
    // Replace with actual dashboard logic
    res.status(200).json({ message: 'Access to the admin dashboard', user: req.admin });
});
router.patch('/approve/:participantId', approveParticipant);
router.patch('/decline/:participantId', declineParticipant);
router.get('/count-approved', countApprovedParticipants);
router.get('/count-declined', countDeclinedParticipants);
router.get('/count-pending', countPendingParticipants);
router.get('/total-participant', totalParticipant);
router.get('/validate-token', (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.admin });
});
router.get('/search', searchParticipants);
router.patch('/end', endCompetition);
router.post('/start', startCompetition);
router.get('/competition-state', getCompetitionState);

module.exports = router;

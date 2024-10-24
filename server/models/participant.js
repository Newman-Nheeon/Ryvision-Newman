const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, required: false },
  isFullyRegistered: { type: Boolean, default: false },
  socialMediaHandle: String,
  socialMediaPlatform: String,
  entrySocialPost: String,
  stageName: String,
  firstName: String,
  lastName: String,
  profileImage: String, // Store the path or URL to the image
  entryImage: String, // Store the path or URL to the image
  comment: { type: String, required: false },
  termsAccepted: { type: Boolean, default: false },
  totalVotes: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'declined'], 
    default: 'pending' // By default, all new entries are pending approval
  }
});

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant; // Export the Participant model

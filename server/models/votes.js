const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voterHandle: { type: String, required: true },
  voterPlatform: { type: String, required: true, enum: ['instagram', 'facebook', 'ticktok'] },
  participant: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
  createdAt: { type: Date, default: Date.now } // To track when the vote was cast
});

module.exports = mongoose.model('Vote', voteSchema);

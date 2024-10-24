const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'tiktok'],
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;

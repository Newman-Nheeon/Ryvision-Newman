const mongoose = require('mongoose');
const Participant = require('../models/participant');
const Vote = require('../models/votes');
const checkSocialMediaHandle = require('../utils/checkSocialMedia');
const logger = require('../logger');

exports.submitVote = async (req, res) => {
  const { voterHandle, voterPlatform, participantId } = req.body;

  try {
    // Check if the social media handle exists for the given platform
    const handleExists = await checkSocialMediaHandle(voterHandle, voterPlatform);
    if (!handleExists) {
      return res.status(400).json({
        success: false,
        message: 'It looks like you are not currently following us on the selected social media platform.'
      });
    }

    // Check if the voter has already voted for this participant
    const existingVoteForParticipant = await Vote.findOne({ voterHandle, participant: mongoose.Types.ObjectId(participantId) });
    if (existingVoteForParticipant) {
      return res.status(400).send({ message: 'You have already voted for this participant.' });
    }

    // Check the total number of votes cast by this voter
    const totalVotesByVoter = await Vote.countDocuments({ voterHandle });
    if (totalVotesByVoter >= 3) {
      return res.status(400).send({ message: 'You have reached the maximum allowed vote count.' });
    }

    // Proceed with voting
    const vote = new Vote({ voterHandle, voterPlatform, participant: participantId });
    await vote.save();

    await Participant.findByIdAndUpdate(participantId, { $inc: { totalVotes: 1 } });

    res.send({ message: 'Your vote has been cast successfully.' });
  } catch (error) {
    logger.error('Error submitting vote:', error);
    res.status(500).send({ message: 'Failed to submit vote.' });
  }
};


// Show only Approved Participant
exports.showApprovedParticipants = async (req, res) => {
  try {
    // Find only participants whose status is 'approved'
    const approvedParticipants = await Participant.find({ status: 'approved' });
    res.json(approvedParticipants);
  } catch (error) {
    logger.error('Error retrieving approved participants:', error);
    res.status(500).send({ message: 'Failed to retrieve approved participants.' });
  }
};

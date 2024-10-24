const Participant = require('../models/participant');
const CompetitionState = require('../models/competitionState');
const logger = require('../logger');


// Show totalParticipant && count totalParticant
exports.totalParticipant = async (req, res) => {
  const status = req.query.status; // Retrieve the status from query parameters

  try {
      let queryOptions = {};
      if (status && status !== 'All') {
          queryOptions.status = status;  // Apply status filter if not 'All'
      }

      const participants = await Participant.find(queryOptions).select();
      const total = participants.length;

      res.json({participants, totalParticipants: total});
  } catch (error) {
      logger.error('Error fetching participants:', error);
      res.status(500).send({ message: 'Failed to retrieve participants.' });
  }
};


// Approve Participant
exports.approveParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;
    // Update the participant and return the new document
    const participant = await Participant.findByIdAndUpdate(
      participantId, 
      { status: 'approved' }, 
      { new: true, runValidators: true }
    );

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Return both the message and the updated participant data
    res.json({ 
      message: 'Participant approved successfully', 
      participant 
    });
  } catch (error) {
    logger.error('Failed to approve participant:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
};

// decline participant
exports.declineParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;
    // Update the participant and return the new document
    const participant = await Participant.findByIdAndUpdate(
      participantId, 
      { status: 'declined' }, 
      { new: true, runValidators: true }
    );

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Return both the message and the updated participant data
    res.json({ 
      message: 'Participant declined successfully', 
      participant 
    });
  } catch (error) {
    logger.error('Failed to decline participant:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
};

// Count approved participants
exports.countApprovedParticipants = async (req, res) => {
  try {
    const countApproved = await Participant.countDocuments({ status: 'approved' });
    res.json({ approvedParticipants: countApproved });
  } catch (error) {
    res.status(500).send({ message: 'Failed to count approved participants.', error: error.message });
  }
};

// Count declined participants
exports.countDeclinedParticipants = async (req, res) => {
  try {
    const countDeclined = await Participant.countDocuments({ status: 'declined' });
    res.json({ declinedParticipants: countDeclined });
  } catch (error) {
    res.status(500).send({ message: 'Failed to count declined participants.', error: error.message });
  }
};

// Count pending participants

exports.countPendingParticipants = async (req, res) => {
  try {
    const countPending = await Participant.countDocuments({ status: 'pending' });
    res.json({ pendingParticipants: countPending });
  } catch (error) {
    logger.error('Failed to count pending participants:', error);
    res.status(500).json({ message: 'Failed to count pending participants', error: error.message });
  }
};

// search participant
exports.searchParticipants = async (req, res) => {
    const searchTerm = req.query.term; //

    if (!searchTerm) {
        return res.status(400).json({ message: 'No search term provided' });
    }

    try {
        const regex = new RegExp(searchTerm, 'i'); // 'i' makes it case insensitive

        const results = await Participant.find({
            $or: [
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } },
                { stageName: { $regex: regex } },
                { socialMediaHandle: { $regex: regex } }
            ]
        });

        res.json(results);
    } catch (error) {
        logger.error('Search error:', error);
        res.status(500).json({ message: 'Error searching for participants' });
    }
};


// End competition
exports.endCompetition = async (req, res) => {
    try {
        const competitionState = await CompetitionState.findOne({});

        if (!competitionState) {
            return res.status(404).json({ message: 'No competition state found.' });
        }

        if (!competitionState.isActive) {
            return res.status(400).json({ message: 'Competition is already ended.' });
        }

        // End the competition by setting isActive to false and logging the end date
        competitionState.isActive = false;
        competitionState.endedAt = new Date();
        await competitionState.save();

        res.status(200).json({ message: 'Competition has been ended successfully.' });
    } catch (error) {
        logger.error('Failed to end competition:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// start competition
exports.startCompetition = async (req, res) => {
    try {
        let competitionState = await CompetitionState.findOne({});

        if (!competitionState) {
            // If no competition state exists, create one
            competitionState = new CompetitionState({ isActive: true });
        } else {
            // If it exists but is inactive, activate it
            competitionState.isActive = true;
            competitionState.endedAt = undefined; // Clear the end date
        }

        await competitionState.save();
        res.status(200).json({ message: 'Competition has been started successfully.' });
    } catch (error) {
        logger.error('Failed to start competition:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET Competition state
exports.getCompetitionState = async (req, res) => {
  try {
      const competitionState = await CompetitionState.findOne({});
      if (!competitionState) {
          return res.status(404).json({ isActive: false });
      }
      res.json({ isActive: competitionState.isActive });
  } catch (error) {
      logger.error('Error fetching competition state:', error);
      res.status(500).json({ message: 'Server error' });
  }
};





const mongoose = require('mongoose');

const competitionStateSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    endedAt: Date
});

const CompetitionState = mongoose.model('CompetitionState', competitionStateSchema);

module.exports = CompetitionState;

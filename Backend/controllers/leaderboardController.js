const leaderboardService = require("../services/leaderboardService");
const Competition = require("../models/Competition");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get live competition leaderboard
// @route   GET /api/leaderboard/:competitionId
// @access  Authenticated / Public
const getLeaderboard = async (req, res) => {
  try {
    const { competitionId } = req.params;

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    const leaderboard = await leaderboardService.getCompetitionLeaderboard(competitionId);

    return sendSuccess(res, `Leaderboard for ${competition.name} (${competition.year})`, {
      competition: {
        id: competition._id,
        name: competition.name,
        year: competition.year,
        status: competition.status
      },
      leaderboard
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve leaderboard", 500);
  }
};

module.exports = {
  getLeaderboard
};

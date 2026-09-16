const impactService = require("../services/impactService");
const Competition = require("../models/Competition");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get overall competition impact
// @route   GET /api/impact/:competitionId
// @access  Authenticated
const getCompetitionImpact = async (req, res) => {
  try {
    const { competitionId } = req.params;

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    const impact = await impactService.getCompetitionImpact(competitionId);

    return sendSuccess(res, `Impact metrics for ${competition.name} (${competition.year})`, {
      competition: {
        id: competition._id,
        name: competition.name,
        year: competition.year
      },
      impact
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve impact", 500);
  }
};

// @desc    Get competition impact grouped by college
// @route   GET /api/impact/:competitionId/by-college
// @access  Authenticated
const getImpactByCollege = async (req, res) => {
  try {
    const { competitionId } = req.params;

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    const byCollege = await impactService.getImpactByCollege(competitionId);

    return sendSuccess(res, "Impact grouped by college retrieved successfully", byCollege);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve impact by college", 500);
  }
};

// @desc    Get competition impact grouped by task
// @route   GET /api/impact/:competitionId/by-task
// @access  Authenticated
const getImpactByTask = async (req, res) => {
  try {
    const { competitionId } = req.params;

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    const byTask = await impactService.getImpactByTask(competitionId);

    return sendSuccess(res, "Impact grouped by task retrieved successfully", byTask);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve impact by task", 500);
  }
};

module.exports = {
  getCompetitionImpact,
  getImpactByCollege,
  getImpactByTask
};

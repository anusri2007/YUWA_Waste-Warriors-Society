const Competition = require("../models/Competition");
const Task = require("../models/Task");
const Team = require("../models/Team");
const Submission = require("../models/Submission");
const { COMPETITION_STATUS } = require("../utils/constants");
const { sendSuccess, sendPaginated, sendError } = require("../utils/apiResponse");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");
const leaderboardService = require("../services/leaderboardService");
const impactService = require("../services/impactService");

// @desc    Get all competitions
// @route   GET /api/competitions
// @access  Authenticated
const getCompetitions = async (req, res) => {
  try {
    const { status, year, search } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};
    if (status && Object.values(COMPETITION_STATUS).includes(status.toUpperCase())) {
      filter.status = status.toUpperCase();
    }
    if (year) {
      filter.year = parseInt(year, 10);
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const total = await Competition.countDocuments(filter);
    const competitions = await Competition.find(filter)
      .populate("createdBy", "name email")
      .sort({ year: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendPaginated(
      res,
      "Competitions retrieved successfully",
      competitions,
      getPaginationMeta(total, page, limit)
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve competitions", 500);
  }
};

// @desc    Create competition (Admin only)
// @route   POST /api/competitions
// @access  Admin only
const createCompetition = async (req, res) => {
  try {
    const { name, year, description, startDate, endDate, status } = req.body;

    if (!name || !year || !startDate || !endDate) {
      return sendError(
        res,
        "Name, year, startDate and endDate are required",
        400
      );
    }

    const competition = await Competition.create({
      name: name.trim(),
      year: parseInt(year, 10),
      description: description ? description.trim() : "",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status || COMPETITION_STATUS.DRAFT,
      createdBy: req.user.userId
    });

    return sendSuccess(res, "Competition created successfully", competition, 201);
  } catch (error) {
    return sendError(res, error.message || "Failed to create competition", 500);
  }
};

// @desc    Get single competition
// @route   GET /api/competitions/:id
// @access  Authenticated
const getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    return sendSuccess(res, "Competition retrieved successfully", competition);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve competition", 500);
  }
};

// @desc    Update competition (Admin only)
// @route   PUT /api/competitions/:id
// @access  Admin only
const updateCompetition = async (req, res) => {
  try {
    const { name, year, description, startDate, endDate, status } = req.body;
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    if (name) competition.name = name.trim();
    if (year) competition.year = parseInt(year, 10);
    if (description !== undefined) competition.description = description.trim();
    if (startDate) competition.startDate = new Date(startDate);
    if (endDate) competition.endDate = new Date(endDate);
    if (status && Object.values(COMPETITION_STATUS).includes(status.toUpperCase())) {
      competition.status = status.toUpperCase();
    }

    await competition.save();

    return sendSuccess(res, "Competition updated successfully", competition);
  } catch (error) {
    return sendError(res, error.message || "Failed to update competition", 500);
  }
};

// @desc    Update competition status (Admin only)
// @route   PUT /api/competitions/:id/status
// @access  Admin only
const updateCompetitionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !Object.values(COMPETITION_STATUS).includes(status.toUpperCase())) {
      return sendError(
        res,
        `Invalid status. Allowed: ${Object.values(COMPETITION_STATUS).join(", ")}`,
        400
      );
    }

    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    competition.status = status.toUpperCase();
    await competition.save();

    return sendSuccess(res, `Competition status updated to ${competition.status}`, competition);
  } catch (error) {
    return sendError(res, error.message || "Failed to update competition status", 500);
  }
};

// @desc    Get historical snapshot of past competition edition (Read-only)
// @route   GET /api/competitions/:id/history
// @access  Authenticated
const getCompetitionHistory = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    const [tasksCount, teamsCount, leaderboard, impact] = await Promise.all([
      Task.countDocuments({ competitionId: competition._id }),
      Team.countDocuments({ competitionId: competition._id }),
      leaderboardService.getCompetitionLeaderboard(competition._id),
      impactService.getCompetitionImpact(competition._id)
    ]);

    return sendSuccess(res, "Historical snapshot retrieved successfully", {
      competition,
      stats: {
        totalTasks: tasksCount,
        totalTeams: teamsCount,
        finalLeaderboardTop3: leaderboard.slice(0, 3),
        impact
      }
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve history", 500);
  }
};

// @desc    Get competition leaderboard
// @route   GET /api/competitions/:id/leaderboard
// @access  Authenticated
const getCompetitionLeaderboard = async (req, res) => {
  try {
    const leaderboard = await leaderboardService.getCompetitionLeaderboard(req.params.id);
    return sendSuccess(res, "Competition leaderboard retrieved successfully", leaderboard);
  } catch (error) {
    return sendError(res, error.message || "Failed to get leaderboard", 500);
  }
};

// @desc    Get competition impact
// @route   GET /api/competitions/:id/impact
// @access  Authenticated
const getCompetitionImpact = async (req, res) => {
  try {
    const impact = await impactService.getCompetitionImpact(req.params.id);
    return sendSuccess(res, "Competition impact retrieved successfully", impact);
  } catch (error) {
    return sendError(res, error.message || "Failed to get impact", 500);
  }
};

module.exports = {
  getCompetitions,
  createCompetition,
  getCompetitionById,
  updateCompetition,
  updateCompetitionStatus,
  getCompetitionHistory,
  getCompetitionLeaderboard,
  getCompetitionImpact
};

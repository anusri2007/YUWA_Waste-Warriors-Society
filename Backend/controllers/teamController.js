const Team = require("../models/Team");
const User = require("../models/User");
const Competition = require("../models/Competition");
const Submission = require("../models/Submission");
const generateId = require("../utils/generateId");
const { sendSuccess, sendPaginated, sendError } = require("../utils/apiResponse");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");
const { ROLES } = require("../utils/constants");

// @desc    Create a team (Coordinator only)
// @route   POST /api/teams
// @access  Coordinator
const createTeam = async (req, res) => {
  try {
    const { teamName, competitionId } = req.body;

    if (!teamName || !competitionId) {
      return sendError(res, "teamName and competitionId are required", 400);
    }

    // Security: derive collegeId and coordinatorId from req.user
    if (!req.user.collegeId) {
      return sendError(
        res,
        "You must be assigned to a college before creating teams",
        403
      );
    }

    // Verify competition exists
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    // Check duplicate team name in same competition for same college
    const existing = await Team.findOne({
      collegeId: req.user.collegeId,
      competitionId,
      teamName: { $regex: new RegExp(`^${teamName.trim()}$`, "i") }
    });

    if (existing) {
      return sendError(
        res,
        `A team named "${teamName.trim()}" already exists in your college for this competition`,
        409
      );
    }

    const teamId = await generateId("team", "TEAM");

    const team = await Team.create({
      teamId,
      teamName: teamName.trim(),
      competitionId,
      collegeId: req.user.collegeId,
      coordinatorId: req.user.userId,
      members: []
    });

    const populatedTeam = await Team.findById(team._id)
      .populate("collegeId", "collegeId name location")
      .populate("competitionId", "name year status")
      .populate("coordinatorId", "name email");

    return sendSuccess(res, "Team created successfully", populatedTeam, 201);
  } catch (error) {
    return sendError(res, error.message || "Failed to create team", 500);
  }
};

// @desc    Student joins a team
// @route   POST /api/teams/join
// @access  Student
const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return sendError(res, "teamId is required", 400);
    }

    // Lookup team by ObjectId or teamId code
    let team = null;
    if (teamId.match(/^[0-9a-fA-F]{24}$/)) {
      team = await Team.findById(teamId);
    }
    if (!team) {
      team = await Team.findOne({ teamId: teamId.toUpperCase() });
    }

    if (!team) {
      return sendError(res, "Team not found", 404);
    }

    if (team.status !== "ACTIVE") {
      return sendError(res, "Cannot join an inactive team", 400);
    }

    const studentId = req.user.userId;

    // Check if already in this team
    if (team.members.some((m) => m.toString() === studentId)) {
      return sendSuccess(res, "You are already a member of this team", team);
    }

    // Rule: Student cannot join multiple active teams in the same competition
    const existingTeamInComp = await Team.findOne({
      competitionId: team.competitionId,
      members: studentId,
      status: "ACTIVE"
    });

    if (existingTeamInComp) {
      return sendError(
        res,
        `You are already a member of active team "${existingTeamInComp.teamName}" (${existingTeamInComp.teamId}) in this competition`,
        400
      );
    }

    // Add student to team
    team.members.push(studentId);
    await team.save();

    // Associate student to this college if not already assigned
    await User.findByIdAndUpdate(studentId, { collegeId: team.collegeId });

    const populatedTeam = await Team.findById(team._id)
      .populate("collegeId", "collegeId name location")
      .populate("competitionId", "name year status")
      .populate("members", "name email");

    return sendSuccess(
      res,
      `Successfully joined team ${team.teamName}`,
      populatedTeam
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to join team", 500);
  }
};

// @desc    Get all teams (Admin only)
// @route   GET /api/teams
// @access  Admin
const getTeams = async (req, res) => {
  try {
    const { competitionId, collegeId, search } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};
    if (competitionId) filter.competitionId = competitionId;
    if (collegeId) filter.collegeId = collegeId;
    if (search) {
      filter.$or = [
        { teamName: { $regex: search, $options: "i" } },
        { teamId: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Team.countDocuments(filter);
    const teams = await Team.find(filter)
      .populate("collegeId", "collegeId name location")
      .populate("competitionId", "name year status")
      .populate("coordinatorId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendPaginated(
      res,
      "Teams retrieved successfully",
      teams,
      getPaginationMeta(total, page, limit)
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve teams", 500);
  }
};

// @desc    Get student's own team(s)
// @route   GET /api/teams/my
// @access  Student
const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user.userId })
      .populate("collegeId", "collegeId name location")
      .populate("competitionId", "name year status")
      .populate("members", "name email phoneNumber");

    return sendSuccess(res, "Your teams retrieved successfully", teams);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve your teams", 500);
  }
};

// @desc    Get coordinator's own college teams
// @route   GET /api/teams/college
// @access  Coordinator
const getCollegeTeams = async (req, res) => {
  try {
    if (!req.user.collegeId) {
      return sendError(
        res,
        "No college is currently assigned to your account",
        404
      );
    }

    const { competitionId } = req.query;
    const filter = { collegeId: req.user.collegeId };
    if (competitionId) filter.competitionId = competitionId;

    const teams = await Team.find(filter)
      .populate("competitionId", "name year status")
      .populate("coordinatorId", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    return sendSuccess(res, "College teams retrieved successfully", teams);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve college teams", 500);
  }
};

// @desc    Get single team by ID
// @route   GET /api/teams/:id
// @access  Authenticated
const getTeamById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let team = null;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      team = await Team.findById(identifier);
    }
    if (!team) {
      team = await Team.findOne({ teamId: identifier.toUpperCase() });
    }

    if (!team) {
      return sendError(res, "Team not found", 404);
    }

    await team.populate([
      { path: "collegeId", select: "collegeId name location" },
      { path: "competitionId", select: "name year status" },
      { path: "coordinatorId", select: "name email" },
      { path: "members", select: "name email" }
    ]);

    return sendSuccess(res, "Team retrieved successfully", team);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve team", 500);
  }
};

// @desc    Update team (Coordinator of that college or Admin)
// @route   PUT /api/teams/:id
// @access  Coordinator / Admin
const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return sendError(res, "Team not found", 404);
    }

    // Permission check
    if (
      req.user.role === ROLES.COORDINATOR &&
      team.collegeId.toString() !== req.user.collegeId
    ) {
      return sendError(res, "You can only edit teams from your own college", 403);
    }

    const { teamName, status } = req.body;
    if (teamName) team.teamName = teamName.trim();
    if (status && ["ACTIVE", "DISQUALIFIED", "WITHDRAWN"].includes(status)) {
      team.status = status;
    }

    await team.save();

    return sendSuccess(res, "Team updated successfully", team);
  } catch (error) {
    return sendError(res, error.message || "Failed to update team", 500);
  }
};

// @desc    Get team members
// @route   GET /api/teams/:id/members
// @access  Authenticated
const getTeamMembers = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      "members",
      "name email phoneNumber role status"
    );

    if (!team) {
      return sendError(res, "Team not found", 404);
    }

    return sendSuccess(res, "Team members retrieved successfully", {
      teamId: team.teamId,
      teamName: team.teamName,
      members: team.members
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve team members", 500);
  }
};

// @desc    Get team submissions
// @route   GET /api/teams/:id/submissions
// @access  Authenticated
const getTeamSubmissions = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return sendError(res, "Team not found", 404);
    }

    const submissions = await Submission.find({ teamId: team._id })
      .populate("taskId", "title taskType maxPoints deadline")
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });

    return sendSuccess(res, "Team submissions retrieved successfully", submissions);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve team submissions", 500);
  }
};

module.exports = {
  createTeam,
  joinTeam,
  getTeams,
  getMyTeams,
  getCollegeTeams,
  getTeamById,
  updateTeam,
  getTeamMembers,
  getTeamSubmissions
};

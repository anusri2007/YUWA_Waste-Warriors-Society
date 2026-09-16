const mongoose = require("mongoose");
const College = require("../models/College");
const Team = require("../models/Team");
const User = require("../models/User");
const Competition = require("../models/Competition");
const Task = require("../models/Task");
const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");
const leaderboardService = require("../services/leaderboardService");
const impactService = require("../services/impactService");
const {
  ROLES,
  SUBMISSION_STATUS,
  EVALUATION_DECISION,
  COMPETITION_STATUS
} = require("../utils/constants");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Coordinator College Dashboard
// @route   GET /api/dashboard/college
// @access  Coordinator only (strictly scoped to req.user.collegeId)
const getCoordinatorDashboard = async (req, res) => {
  try {
    if (!req.user.collegeId) {
      return sendError(
        res,
        "No college is assigned to your coordinator account",
        404
      );
    }

    const college = await College.findById(req.user.collegeId);
    if (!college) {
      return sendError(res, "Assigned college record not found", 404);
    }

    // Teams from this college
    const teams = await Team.find({ collegeId: college._id });
    const teamIds = teams.map((t) => t._id);

    // Students count across teams
    const studentIdsSet = new Set();
    teams.forEach((t) => {
      t.members.forEach((m) => studentIdsSet.add(m.toString()));
    });

    // Submissions from this college
    const submissions = await Submission.find({ teamId: { $in: teamIds } });
    const approvedSubmissions = submissions.filter(
      (s) => s.status === SUBMISSION_STATUS.EVALUATED
    );

    // Total impact of this college
    let wasteRecoveredKg = 0;
    let studentHours = 0;
    let awarenessCount = 0;
    let climateActionCount = 0;

    approvedSubmissions.forEach((sub) => {
      if (sub.impactData) {
        wasteRecoveredKg += sub.impactData.wasteRecoveredKg || 0;
        studentHours += sub.impactData.studentHours || 0;
        awarenessCount += sub.impactData.awarenessCount || 0;
        climateActionCount += sub.impactData.climateActionCount || 0;
      }
    });

    // Submissions breakdown
    const submissionStats = {
      draft: submissions.filter((s) => s.status === SUBMISSION_STATUS.DRAFT).length,
      submitted: submissions.filter((s) => s.status === SUBMISSION_STATUS.SUBMITTED).length,
      underReview: submissions.filter((s) => s.status === SUBMISSION_STATUS.UNDER_REVIEW).length,
      evaluated: approvedSubmissions.length,
      rejected: submissions.filter((s) => s.status === SUBMISSION_STATUS.REJECTED).length,
      flagged: submissions.filter((s) => s.status === SUBMISSION_STATUS.FLAGGED).length
    };

    return sendSuccess(res, "Coordinator college dashboard retrieved", {
      college: {
        id: college._id,
        collegeId: college.collegeId,
        name: college.name,
        location: college.location
      },
      metrics: {
        totalTeams: teams.length,
        totalStudents: studentIdsSet.size,
        totalSubmissions: submissions.length,
        approvedSubmissions: approvedSubmissions.length,
        submissionBreakdown: submissionStats
      },
      impact: {
        wasteRecoveredKg: Math.round(wasteRecoveredKg * 100) / 100,
        studentHours: Math.round(studentHours * 10) / 10,
        awarenessCount,
        climateActionCount
      }
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve coordinator dashboard", 500);
  }
};

// @desc    Coordinator College Teams Detailed Progress
// @route   GET /api/dashboard/college/teams
// @access  Coordinator only
const getCoordinatorTeams = async (req, res) => {
  try {
    if (!req.user.collegeId) {
      return sendError(res, "No college is assigned to your coordinator account", 404);
    }

    const teams = await Team.find({ collegeId: req.user.collegeId })
      .populate("competitionId", "name year status")
      .populate("members", "name email");

    const teamIds = teams.map((t) => t._id);

    // Fetch approved evaluations for these teams
    const submissions = await Submission.find({ teamId: { $in: teamIds } });
    const approvedSubmissions = submissions.filter(
      (s) => s.status === SUBMISSION_STATUS.EVALUATED
    );

    const approvedSubIds = approvedSubmissions.map((s) => s._id);
    const evaluations = await Evaluation.find({
      submissionId: { $in: approvedSubIds },
      decision: EVALUATION_DECISION.APPROVED
    });

    const evalMap = new Map();
    evaluations.forEach((ev) => evalMap.set(ev.submissionId.toString(), ev.totalScore));

    const teamsProgress = teams.map((t) => {
      const teamSubs = submissions.filter((s) => s.teamId.toString() === t._id.toString());
      const teamApproved = teamSubs.filter((s) => s.status === SUBMISSION_STATUS.EVALUATED);
      const teamScore = teamApproved.reduce(
        (sum, s) => sum + (evalMap.get(s._id.toString()) || 0),
        0
      );

      return {
        id: t._id,
        teamId: t.teamId,
        teamName: t.teamName,
        competition: t.competitionId,
        memberCount: t.members.length,
        members: t.members,
        totalSubmissions: teamSubs.length,
        approvedSubmissions: teamApproved.length,
        totalScore: Math.round(teamScore * 100) / 100,
        status: t.status
      };
    });

    return sendSuccess(res, "College teams progress retrieved successfully", teamsProgress);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve college teams", 500);
  }
};

// @desc    Coordinator Pending / Falling-behind teams
// @route   GET /api/dashboard/college/pending
// @access  Coordinator only
const getCoordinatorPending = async (req, res) => {
  try {
    if (!req.user.collegeId) {
      return sendError(res, "No college assigned", 404);
    }

    const teams = await Team.find({
      collegeId: req.user.collegeId,
      status: "ACTIVE"
    }).populate("competitionId", "name year status");

    const teamIds = teams.map((t) => t._id);

    const submissions = await Submission.find({ teamId: { $in: teamIds } });

    // Identify teams with 0 submissions or only drafts
    const fallingBehind = [];

    for (const team of teams) {
      const teamSubs = submissions.filter(
        (s) => s.teamId.toString() === team._id.toString()
      );
      const submittedOrEvaluated = teamSubs.filter(
        (s) => s.status !== SUBMISSION_STATUS.DRAFT
      );

      if (submittedOrEvaluated.length === 0) {
        fallingBehind.push({
          teamId: team.teamId,
          teamName: team.teamName,
          competitionName: team.competitionId?.name || "Competition",
          memberCount: team.members.length,
          reason: teamSubs.length === 0 ? "No submissions started" : "Has draft submissions not yet submitted",
          draftCount: teamSubs.length,
          lastActivity: team.updatedAt
        });
      }
    }

    return sendSuccess(res, "Falling-behind teams identified", {
      count: fallingBehind.length,
      teams: fallingBehind
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve falling-behind teams", 500);
  }
};

// @desc    Admin System-wide Dashboard
// @route   GET /api/dashboard/admin
// @access  Admin only
const getAdminDashboard = async (req, res) => {
  try {
    // 1. Role counts
    const [
      collegesCount,
      teamsCount,
      studentsCount,
      coordinatorsCount,
      evaluatorsCount
    ] = await Promise.all([
      College.countDocuments(),
      Team.countDocuments(),
      User.countDocuments({ role: ROLES.STUDENT }),
      User.countDocuments({ role: ROLES.COORDINATOR }),
      User.countDocuments({ role: ROLES.EVALUATOR })
    ]);

    // 2. Active or latest competition
    let activeCompetition = await Competition.findOne({
      status: COMPETITION_STATUS.ACTIVE
    });

    if (!activeCompetition) {
      activeCompetition = await Competition.findOne().sort({ year: -1, createdAt: -1 });
    }

    // 3. Submissions breakdown across system
    const [
      totalSubmissions,
      draftCount,
      submittedCount,
      underReviewCount,
      evaluatedCount,
      rejectedCount,
      flaggedCount
    ] = await Promise.all([
      Submission.countDocuments(),
      Submission.countDocuments({ status: SUBMISSION_STATUS.DRAFT }),
      Submission.countDocuments({ status: SUBMISSION_STATUS.SUBMITTED }),
      Submission.countDocuments({ status: SUBMISSION_STATUS.UNDER_REVIEW }),
      Submission.countDocuments({ status: SUBMISSION_STATUS.EVALUATED }),
      Submission.countDocuments({ status: SUBMISSION_STATUS.REJECTED }),
      Submission.countDocuments({ status: SUBMISSION_STATUS.FLAGGED })
    ]);

    // 4. Leaderboard snapshot & impact if active competition exists
    let leaderboardSnapshot = [];
    let impactSnapshot = null;

    if (activeCompetition) {
      const fullLeaderboard = await leaderboardService.getCompetitionLeaderboard(
        activeCompetition._id
      );
      leaderboardSnapshot = fullLeaderboard.slice(0, 5);
      impactSnapshot = await impactService.getCompetitionImpact(activeCompetition._id);
    }

    return sendSuccess(res, "Admin system dashboard overview", {
      counts: {
        colleges: collegesCount,
        teams: teamsCount,
        students: studentsCount,
        coordinators: coordinatorsCount,
        evaluators: evaluatorsCount
      },
      activeCompetition: activeCompetition
        ? {
            id: activeCompetition._id,
            name: activeCompetition.name,
            year: activeCompetition.year,
            status: activeCompetition.status,
            startDate: activeCompetition.startDate,
            endDate: activeCompetition.endDate
          }
        : null,
      submissionPipeline: {
        total: totalSubmissions,
        draft: draftCount,
        submitted: submittedCount,
        underReview: underReviewCount,
        evaluated: evaluatedCount,
        rejected: rejectedCount,
        flagged: flaggedCount
      },
      leaderboardTop5: leaderboardSnapshot,
      impact: impactSnapshot
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve admin dashboard", 500);
  }
};

module.exports = {
  getCoordinatorDashboard,
  getCoordinatorTeams,
  getCoordinatorPending,
  getAdminDashboard
};

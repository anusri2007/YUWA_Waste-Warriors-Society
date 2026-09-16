const Submission = require("../models/Submission");
const Team = require("../models/Team");
const { SUBMISSION_STATUS, COMMUNITY_VISIBILITY } = require("../utils/constants");
const { sendSuccess, sendPaginated, sendError } = require("../utils/apiResponse");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");
const impactService = require("../services/impactService");
const Competition = require("../models/Competition");

// @desc    Get public-safe community submissions feed
// @route   GET /api/community/submissions
// @access  Public / Authenticated
const getCommunitySubmissions = async (req, res) => {
  try {
    const { competitionId, taskType } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    // Filter: MUST be EVALUATED (approved) and PUBLIC (or COLLEGE if user belongs to same college)
    const filter = {
      status: SUBMISSION_STATUS.EVALUATED
    };

    if (competitionId) filter.competitionId = competitionId;

    if (req.user?.collegeId) {
      // User is logged in with a college: can see PUBLIC or COLLEGE from their college
      const collegeTeams = await Team.find({ collegeId: req.user.collegeId }).select("_id");
      const collegeTeamIds = collegeTeams.map((t) => t._id);

      filter.$or = [
        { visibility: COMMUNITY_VISIBILITY.PUBLIC },
        {
          visibility: COMMUNITY_VISIBILITY.COLLEGE,
          teamId: { $in: collegeTeamIds }
        }
      ];
    } else {
      // Public / unauthenticated user: strictly PUBLIC visibility
      filter.visibility = COMMUNITY_VISIBILITY.PUBLIC;
    }

    const total = await Submission.countDocuments(filter);
    const submissions = await Submission.find(filter)
      .populate("taskId", "title taskType")
      .populate({
        path: "teamId",
        select: "teamName collegeId",
        populate: { path: "collegeId", select: "name location" }
      })
      .select("taskId teamId reflection impactData evidence celebrationCount submittedAt")
      .sort({ celebrationCount: -1, submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Strict PII filter: Never expose phone numbers, emails, passwords, internal notes
    const sanitized = submissions.map((s) => ({
      id: s._id,
      task: s.taskId?.title || "Task",
      taskType: s.taskId?.taskType,
      teamName: s.teamId?.teamName || "Anonymous Team",
      collegeName: s.teamId?.collegeId?.name || "Ecolympics College",
      reflection: s.reflection,
      impact: s.impactData,
      evidence: s.evidence.map((e) => ({
        type: e.type,
        url: e.url,
        caption: e.caption
      })),
      celebrationCount: s.celebrationCount || 0,
      submittedAt: s.submittedAt
    }));

    return sendPaginated(
      res,
      "Community feed retrieved successfully",
      sanitized,
      getPaginationMeta(total, page, limit)
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve community feed", 500);
  }
};

// @desc    Get community milestones and highlights
// @route   GET /api/community/milestones
// @access  Public / Authenticated
const getCommunityMilestones = async (req, res) => {
  try {
    const competitions = await Competition.find().sort({ year: -1 });
    const latestComp = competitions[0];

    let overallImpact = {
      totalWasteRecoveredKg: 0,
      totalStudentHours: 0,
      totalAwarenessCount: 0,
      totalClimateActions: 0,
      approvedSubmissions: 0
    };

    if (latestComp) {
      overallImpact = await impactService.getCompetitionImpact(latestComp._id);
    }

    const milestones = [
      {
        title: "Waste Diverted from Landfills",
        value: `${overallImpact.totalWasteRecoveredKg} kg`,
        badge: "Eco Champion"
      },
      {
        title: "Student Climate Action Hours",
        value: `${overallImpact.totalStudentHours} hrs`,
        badge: "Community Power"
      },
      {
        title: "Awareness Interactions",
        value: `${overallImpact.totalAwarenessCount}`,
        badge: "Spreading Change"
      },
      {
        title: "Verified Climate Actions",
        value: `${overallImpact.totalClimateActions}`,
        badge: "Ground Impact"
      }
    ];

    return sendSuccess(res, "Community milestones retrieved", {
      competition: latestComp ? { name: latestComp.name, year: latestComp.year } : null,
      milestones
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve milestones", 500);
  }
};

// @desc    Celebrate / cheer an approved submission
// @route   POST /api/community/:id/celebrate
// @access  Authenticated / Public
const celebrateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { $inc: { celebrationCount: 1 } },
      { returnDocument: "after" }
    );

    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    return sendSuccess(res, "Celebration added! 🎉", {
      submissionId: submission._id,
      celebrationCount: submission.celebrationCount
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to celebrate submission", 500);
  }
};

module.exports = {
  getCommunitySubmissions,
  getCommunityMilestones,
  celebrateSubmission
};

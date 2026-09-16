const Submission = require("../models/Submission");
const Team = require("../models/Team");
const Task = require("../models/Task");
const storageService = require("../services/storageService");
const { SUBMISSION_STATUS, EVIDENCE_TYPES, ROLES } = require("../utils/constants");
const { sendSuccess, sendPaginated, sendError } = require("../utils/apiResponse");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");

// Helper to check if user has access to view/edit submission
const verifyTeamMembership = (team, userId) => {
  return team.members.some((m) => m.toString() === userId.toString());
};

// @desc    Create a draft submission
// @route   POST /api/submissions
// @access  Student (Team Member)
const createSubmission = async (req, res) => {
  try {
    const { teamId, taskId, reflection, impactData, visibility } = req.body;

    if (!teamId || !taskId) {
      return sendError(res, "teamId and taskId are required", 400);
    }

    // Verify team
    const team = await Team.findById(teamId);
    if (!team) {
      return sendError(res, "Team not found", 404);
    }

    // Security: verify user is in team
    if (!verifyTeamMembership(team, req.user.userId)) {
      return sendError(res, "Only team members can create submissions for this team", 403);
    }

    // Verify task
    const task = await Task.findById(taskId);
    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    // Security: Task must belong to team's competition
    if (task.competitionId.toString() !== team.competitionId.toString()) {
      return sendError(
        res,
        "Task does not belong to the competition this team is registered in",
        400
      );
    }

    // Duplicate check: Check for existing active submission
    const existing = await Submission.findOne({
      teamId: team._id,
      taskId: task._id,
      status: { $ne: SUBMISSION_STATUS.REJECTED }
    });

    if (existing) {
      if (existing.status === SUBMISSION_STATUS.DRAFT) {
        return sendSuccess(res, "Existing draft submission found", existing);
      }
      return sendError(
        res,
        `A submission for this task has already been ${existing.status.toLowerCase()}`,
        409
      );
    }

    const submission = await Submission.create({
      teamId: team._id,
      competitionId: team.competitionId,
      taskId: task._id,
      submittedBy: req.user.userId,
      status: SUBMISSION_STATUS.DRAFT,
      reflection: reflection ? reflection.trim() : "",
      impactData: {
        wasteRecoveredKg: impactData?.wasteRecoveredKg ? Number(impactData.wasteRecoveredKg) : 0,
        studentHours: impactData?.studentHours ? Number(impactData.studentHours) : 0,
        awarenessCount: impactData?.awarenessCount ? Number(impactData.awarenessCount) : 0,
        climateActionCount: impactData?.climateActionCount ? Number(impactData.climateActionCount) : 0
      },
      evidence: [],
      visibility: visibility || "COLLEGE"
    });

    return sendSuccess(res, "Draft submission created successfully", submission, 201);
  } catch (error) {
    return sendError(res, error.message || "Failed to create submission", 500);
  }
};

// @desc    Update a draft submission
// @route   PUT /api/submissions/:id
// @access  Student (Team Member) / Admin
const updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    // Strict Rule: Only DRAFT submissions can be edited
    if (submission.status !== SUBMISSION_STATUS.DRAFT && req.user.role !== ROLES.ADMIN) {
      return sendError(
        res,
        `Cannot modify submission in ${submission.status} status. Only DRAFT submissions can be edited.`,
        400
      );
    }

    const team = await Team.findById(submission.teamId);
    if (
      req.user.role !== ROLES.ADMIN &&
      (!team || !verifyTeamMembership(team, req.user.userId))
    ) {
      return sendError(res, "You can only edit submissions for your own team", 403);
    }

    const { reflection, impactData, visibility } = req.body;

    if (reflection !== undefined) submission.reflection = reflection.trim();
    if (visibility) submission.visibility = visibility;
    if (impactData) {
      if (impactData.wasteRecoveredKg !== undefined) {
        submission.impactData.wasteRecoveredKg = Number(impactData.wasteRecoveredKg);
      }
      if (impactData.studentHours !== undefined) {
        submission.impactData.studentHours = Number(impactData.studentHours);
      }
      if (impactData.awarenessCount !== undefined) {
        submission.impactData.awarenessCount = Number(impactData.awarenessCount);
      }
      if (impactData.climateActionCount !== undefined) {
        submission.impactData.climateActionCount = Number(impactData.climateActionCount);
      }
    }

    await submission.save();

    return sendSuccess(res, "Submission updated successfully", submission);
  } catch (error) {
    return sendError(res, error.message || "Failed to update submission", 500);
  }
};

// @desc    Add evidence to draft submission (File upload or direct URL)
// @route   POST /api/submissions/:id/evidence
// @access  Student (Team Member) / Admin
const addEvidence = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    if (submission.status !== SUBMISSION_STATUS.DRAFT && req.user.role !== ROLES.ADMIN) {
      return sendError(res, "Cannot add evidence to non-draft submissions", 400);
    }

    const team = await Team.findById(submission.teamId);
    if (
      req.user.role !== ROLES.ADMIN &&
      (!team || !verifyTeamMembership(team, req.user.userId))
    ) {
      return sendError(res, "Access denied: not a team member", 403);
    }

    let evidenceItem = null;

    // Case 1: Binary file uploaded via multipart
    if (req.file) {
      const uploadResult = await storageService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      let inferredType = EVIDENCE_TYPES.DOCUMENT;
      if (req.file.mimetype.startsWith("image/")) inferredType = EVIDENCE_TYPES.PHOTO;
      else if (req.file.mimetype.startsWith("video/")) inferredType = EVIDENCE_TYPES.VIDEO;

      evidenceItem = {
        type: req.body.type || inferredType,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        caption: req.body.caption ? req.body.caption.trim() : req.file.originalname
      };
    }
    // Case 2: Direct URL provided in JSON body
    else if (req.body.url && req.body.type) {
      if (!Object.values(EVIDENCE_TYPES).includes(req.body.type.toUpperCase())) {
        return sendError(
          res,
          `Invalid evidence type. Allowed: ${Object.values(EVIDENCE_TYPES).join(", ")}`,
          400
        );
      }

      evidenceItem = {
        type: req.body.type.toUpperCase(),
        url: req.body.url.trim(),
        caption: req.body.caption ? req.body.caption.trim() : ""
      };
    } else {
      return sendError(
        res,
        "Please provide an uploaded file or a valid evidence URL with type",
        400
      );
    }

    submission.evidence.push(evidenceItem);
    await submission.save();

    return sendSuccess(res, "Evidence added successfully", submission);
  } catch (error) {
    return sendError(res, error.message || "Failed to add evidence", 500);
  }
};

// @desc    Delete evidence from draft submission
// @route   DELETE /api/submissions/:id/evidence/:evidenceId
// @access  Student (Team Member) / Admin
const deleteEvidence = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    if (submission.status !== SUBMISSION_STATUS.DRAFT && req.user.role !== ROLES.ADMIN) {
      return sendError(res, "Cannot delete evidence from non-draft submissions", 400);
    }

    const team = await Team.findById(submission.teamId);
    if (
      req.user.role !== ROLES.ADMIN &&
      (!team || !verifyTeamMembership(team, req.user.userId))
    ) {
      return sendError(res, "Access denied: not a team member", 403);
    }

    const evidenceIndex = submission.evidence.findIndex(
      (e) => e._id.toString() === req.params.evidenceId
    );

    if (evidenceIndex === -1) {
      return sendError(res, "Evidence item not found", 404);
    }

    const [removed] = submission.evidence.splice(evidenceIndex, 1);
    if (removed.publicId) {
      await storageService.deleteFile(removed.publicId);
    }

    await submission.save();

    return sendSuccess(res, "Evidence removed successfully", submission);
  } catch (error) {
    return sendError(res, error.message || "Failed to remove evidence", 500);
  }
};

// @desc    Final submit (DRAFT -> SUBMITTED) with strict required evidence validation
// @route   PUT /api/submissions/:id/submit
// @access  Student (Team Member)
const submitSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    if (submission.status !== SUBMISSION_STATUS.DRAFT) {
      return sendError(
        res,
        `Submission is already in ${submission.status} status and cannot be resubmitted`,
        400
      );
    }

    const team = await Team.findById(submission.teamId);
    if (!team || !verifyTeamMembership(team, req.user.userId)) {
      return sendError(res, "Only team members can submit for this team", 403);
    }

    const task = await Task.findById(submission.taskId);
    if (!task) {
      return sendError(res, "Associated task not found", 404);
    }

    // Required evidence completeness validation checklist (Section 12 & 28)
    const missing = [];

    if (task.requiredEvidence?.photo) {
      const hasPhoto = submission.evidence.some((e) => e.type === EVIDENCE_TYPES.PHOTO);
      if (!hasPhoto) missing.push("At least one photo evidence");
    }

    if (task.requiredEvidence?.video) {
      const hasVideo = submission.evidence.some((e) => e.type === EVIDENCE_TYPES.VIDEO);
      if (!hasVideo) missing.push("At least one video evidence");
    }

    if (task.requiredEvidence?.reflection) {
      if (!submission.reflection || submission.reflection.trim().length < 10) {
        missing.push("A substantive reflection (at least 10 characters)");
      }
    }

    if (task.requiredEvidence?.wasteWeightKg) {
      if (!submission.impactData?.wasteRecoveredKg || submission.impactData.wasteRecoveredKg <= 0) {
        missing.push("Waste recovered weight (kg) greater than 0");
      }
    }

    if (missing.length > 0) {
      return sendError(
        res,
        `Submission cannot be finalized. Missing required evidence: ${missing.join("; ")}`,
        400
      );
    }

    submission.status = SUBMISSION_STATUS.SUBMITTED;
    submission.submittedAt = new Date();
    await submission.save();

    return sendSuccess(res, "Submission submitted successfully for evaluation", submission);
  } catch (error) {
    return sendError(res, error.message || "Failed to submit", 500);
  }
};

// @desc    Get current user's team submissions
// @route   GET /api/submissions/my
// @access  Student
const getMySubmissions = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user.userId }).select("_id");
    const teamIds = teams.map((t) => t._id);

    const submissions = await Submission.find({ teamId: { $in: teamIds } })
      .populate("taskId", "title taskType deadline maxPoints")
      .populate("teamId", "teamId teamName collegeId")
      .populate("competitionId", "name year status")
      .sort({ createdAt: -1 });

    return sendSuccess(res, "Your team submissions retrieved successfully", submissions);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve your submissions", 500);
  }
};

// @desc    Get all submissions (Admin / Evaluator / Coordinator scoped)
// @route   GET /api/submissions
// @access  Admin / Evaluator / Coordinator
const getSubmissions = async (req, res) => {
  try {
    const { competitionId, taskId, teamId, status } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};
    if (competitionId) filter.competitionId = competitionId;
    if (taskId) filter.taskId = taskId;
    if (teamId) filter.teamId = teamId;
    if (status && Object.values(SUBMISSION_STATUS).includes(status.toUpperCase())) {
      filter.status = status.toUpperCase();
    }

    // Security scoping: Coordinator can only see their own college's submissions
    if (req.user.role === ROLES.COORDINATOR) {
      const collegeTeams = await Team.find({ collegeId: req.user.collegeId }).select("_id");
      const collegeTeamIds = collegeTeams.map((t) => t._id);
      filter.teamId = { $in: collegeTeamIds };
    }

    const total = await Submission.countDocuments(filter);
    const submissions = await Submission.find(filter)
      .populate("taskId", "title taskType maxPoints deadline requiredEvidence")
      .populate("teamId", "teamId teamName collegeId")
      .populate("competitionId", "name year status")
      .populate("submittedBy", "name email")
      .sort({ submittedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendPaginated(
      res,
      "Submissions retrieved successfully",
      submissions,
      getPaginationMeta(total, page, limit)
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve submissions", 500);
  }
};

// @desc    Get single submission by ID
// @route   GET /api/submissions/:id
// @access  Authenticated
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("taskId")
      .populate({
        path: "teamId",
        populate: { path: "collegeId", select: "collegeId name location" }
      })
      .populate("competitionId", "name year status")
      .populate("submittedBy", "name email");

    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    // Access control: Coordinator can only see own college submission
    if (
      req.user.role === ROLES.COORDINATOR &&
      submission.teamId?.collegeId?._id?.toString() !== req.user.collegeId
    ) {
      return sendError(res, "Access denied: not from your college", 403);
    }

    return sendSuccess(res, "Submission details retrieved successfully", submission);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve submission", 500);
  }
};

// @desc    Update submission status (Admin / Evaluator)
// @route   PUT /api/submissions/:id/status
// @access  Admin / Evaluator
const updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !Object.values(SUBMISSION_STATUS).includes(status.toUpperCase())) {
      return sendError(
        res,
        `Invalid status. Allowed: ${Object.values(SUBMISSION_STATUS).join(", ")}`,
        400
      );
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    submission.status = status.toUpperCase();
    if (["EVALUATED", "REJECTED", "FLAGGED"].includes(submission.status)) {
      submission.reviewedAt = new Date();
    }

    await submission.save();

    return sendSuccess(res, `Submission status updated to ${submission.status}`, submission);
  } catch (error) {
    return sendError(res, error.message || "Failed to update submission status", 500);
  }
};

module.exports = {
  createSubmission,
  updateSubmission,
  addEvidence,
  deleteEvidence,
  submitSubmission,
  getMySubmissions,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus
};

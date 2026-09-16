const Evaluation = require("../models/Evaluation");
const EvaluationAssignment = require("../models/EvaluationAssignment");
const Submission = require("../models/Submission");
const Rubric = require("../models/Rubric");
const Task = require("../models/Task");
const User = require("../models/User");
const aiEvaluationService = require("../services/aiEvaluationService");
const {
  EVALUATION_DECISION,
  SUBMISSION_STATUS,
  ROLES,
  AI_REVIEW_STATUS
} = require("../utils/constants");
const { sendSuccess, sendPaginated, sendError } = require("../utils/apiResponse");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");

// @desc    Assign evaluator to submission (Admin only)
// @route   POST /api/evaluations/assign
// @access  Admin only
const assignEvaluator = async (req, res) => {
  try {
    const { submissionId, evaluatorId, notes } = req.body;

    if (!submissionId || !evaluatorId) {
      return sendError(res, "submissionId and evaluatorId are required", 400);
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    if (submission.status === SUBMISSION_STATUS.DRAFT) {
      return sendError(res, "Cannot assign evaluator to a draft submission", 400);
    }

    const evaluator = await User.findById(evaluatorId);
    if (!evaluator || evaluator.role !== ROLES.EVALUATOR) {
      return sendError(res, "Target user is not an evaluator", 400);
    }

    // Upsert or create assignment
    const assignment = await EvaluationAssignment.findOneAndUpdate(
      { submissionId, evaluatorId },
      {
        submissionId,
        evaluatorId,
        assignedBy: req.user.userId,
        status: "ASSIGNED",
        notes: notes ? notes.trim() : ""
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    // Update submission status to UNDER_REVIEW
    if (submission.status === SUBMISSION_STATUS.SUBMITTED) {
      submission.status = SUBMISSION_STATUS.UNDER_REVIEW;
      await submission.save();
    }

    const populated = await EvaluationAssignment.findById(assignment._id)
      .populate("evaluatorId", "name email")
      .populate("submissionId");

    return sendSuccess(res, "Evaluator assigned successfully", populated, 201);
  } catch (error) {
    return sendError(res, error.message || "Failed to assign evaluator", 500);
  }
};

// @desc    Get all assignments (Admin only)
// @route   GET /api/evaluations/assignments
// @access  Admin only
const getAssignments = async (req, res) => {
  try {
    const { evaluatorId, status } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};
    if (evaluatorId) filter.evaluatorId = evaluatorId;
    if (status) filter.status = status;

    const total = await EvaluationAssignment.countDocuments(filter);
    const assignments = await EvaluationAssignment.find(filter)
      .populate("evaluatorId", "name email")
      .populate("assignedBy", "name email")
      .populate({
        path: "submissionId",
        populate: [
          { path: "taskId", select: "title maxPoints taskType" },
          { path: "teamId", select: "teamId teamName" }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendPaginated(
      res,
      "Assignments retrieved successfully",
      assignments,
      getPaginationMeta(total, page, limit)
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve assignments", 500);
  }
};

// @desc    Update assignment (Admin only)
// @route   PUT /api/evaluations/assignments/:id
// @access  Admin only
const updateAssignment = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const assignment = await EvaluationAssignment.findById(req.params.id);

    if (!assignment) {
      return sendError(res, "Assignment not found", 404);
    }

    if (status) assignment.status = status;
    if (notes !== undefined) assignment.notes = notes.trim();

    await assignment.save();

    return sendSuccess(res, "Assignment updated successfully", assignment);
  } catch (error) {
    return sendError(res, error.message || "Failed to update assignment", 500);
  }
};

// @desc    Delete assignment (Admin only)
// @route   DELETE /api/evaluations/assignments/:id
// @access  Admin only
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await EvaluationAssignment.findById(req.params.id);
    if (!assignment) {
      return sendError(res, "Assignment not found", 404);
    }

    await EvaluationAssignment.findByIdAndDelete(req.params.id);

    return sendSuccess(res, "Assignment deleted successfully", {});
  } catch (error) {
    return sendError(res, error.message || "Failed to delete assignment", 500);
  }
};

// @desc    Get submissions assigned to current evaluator
// @route   GET /api/evaluations/assigned
// @access  Evaluator / Admin
const getAssignedSubmissions = async (req, res) => {
  try {
    let assignments;
    if (req.user.role === ROLES.ADMIN) {
      assignments = await EvaluationAssignment.find()
        .populate("evaluatorId", "name email")
        .populate({
          path: "submissionId",
          populate: [
            { path: "taskId", select: "title taskType instructions deadline maxPoints requiredEvidence" },
            { path: "teamId", select: "teamId teamName collegeId" },
            { path: "competitionId", select: "name year" }
          ]
        })
        .sort({ createdAt: -1 });
    } else {
      assignments = await EvaluationAssignment.find({
        evaluatorId: req.user.userId,
        status: { $ne: "COMPLETED" }
      })
        .populate({
          path: "submissionId",
          populate: [
            { path: "taskId", select: "title taskType instructions deadline maxPoints requiredEvidence" },
            { path: "teamId", select: "teamId teamName collegeId" },
            { path: "competitionId", select: "name year" }
          ]
        })
        .sort({ createdAt: -1 });
    }

    const assignedSubmissions = assignments
      .filter((a) => a.submissionId)
      .map((a) => ({
        assignmentId: a._id,
        assignmentStatus: a.status,
        notes: a.notes,
        submission: a.submissionId
      }));

    return sendSuccess(res, "Assigned submissions retrieved successfully", assignedSubmissions);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve assigned submissions", 500);
  }
};

// @desc    Get evaluations submitted by current evaluator
// @route   GET /api/evaluations/my
// @access  Evaluator / Admin
const getMyEvaluations = async (req, res) => {
  try {
    const filter = req.user.role === ROLES.ADMIN ? {} : { evaluatorId: req.user.userId };

    const evaluations = await Evaluation.find(filter)
      .populate({
        path: "submissionId",
        populate: [
          { path: "taskId", select: "title taskType maxPoints" },
          { path: "teamId", select: "teamId teamName" }
        ]
      })
      .populate("evaluatorId", "name email")
      .sort({ createdAt: -1 });

    return sendSuccess(res, "Evaluations retrieved successfully", evaluations);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve evaluations", 500);
  }
};

// @desc    Get single evaluation by ID
// @route   GET /api/evaluations/:id
// @access  Authenticated
const getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate({
        path: "submissionId",
        populate: [
          { path: "taskId", select: "title taskType maxPoints instructions" },
          { path: "teamId", select: "teamId teamName collegeId" },
          { path: "submittedBy", select: "name email" }
        ]
      })
      .populate("evaluatorId", "name email")
      .populate("rubricId");

    if (!evaluation) {
      return sendError(res, "Evaluation not found", 404);
    }

    return sendSuccess(res, "Evaluation retrieved successfully", evaluation);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve evaluation", 500);
  }
};

// @desc    Submit evaluation for a submission
// @route   POST /api/evaluations/:submissionId
// @access  Evaluator / Admin
const evaluateSubmission = async (req, res) => {
  try {
    const rawId = req.params.submissionId || req.params.id;
    const submissionId = rawId ? rawId.replace(/^:/, "").trim() : "";
    const { criteriaScores, feedback, decision } = req.body;

    if (!criteriaScores || !Array.isArray(criteriaScores) || criteriaScores.length === 0) {
      return sendError(res, "A non-empty criteriaScores array is required", 400);
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    if (submission.status === SUBMISSION_STATUS.DRAFT) {
      return sendError(res, "Cannot evaluate a draft submission", 400);
    }

    // Security check: Evaluators only ever see submissions assigned to them (unless ADMIN)
    if (req.user.role !== ROLES.ADMIN) {
      const assignment = await EvaluationAssignment.findOne({
        submissionId: submission._id,
        evaluatorId: req.user.userId
      });

      if (!assignment) {
        return sendError(res, "Access denied: you are not assigned to evaluate this submission", 403);
      }
    }

    // Fetch active rubric for the task
    const rubric = await Rubric.findOne({
      taskId: submission.taskId,
      active: true
    });

    if (!rubric) {
      return sendError(res, "No active rubric configured for this task", 400);
    }

    // Validate criteriaScores against active rubric criteria
    let calculatedTotalScore = 0;
    const formattedScores = [];

    for (const rubricCriterion of rubric.criteria) {
      const criterionScoreInput = criteriaScores.find(
        (cs) => cs.criterionId?.toString() === rubricCriterion._id.toString()
      );

      if (!criterionScoreInput) {
        return sendError(
          res,
          `Missing score for criterion: "${rubricCriterion.name}"`,
          400
        );
      }

      const scoreNum = Number(criterionScoreInput.score);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > rubricCriterion.maxPoints) {
        return sendError(
          res,
          `Invalid score for criterion "${rubricCriterion.name}". Score must be between 0 and ${rubricCriterion.maxPoints}. Received: ${criterionScoreInput.score}`,
          400
        );
      }

      calculatedTotalScore += scoreNum;
      formattedScores.push({
        criterionId: rubricCriterion._id,
        criterionName: rubricCriterion.name,
        score: scoreNum,
        maxPoints: rubricCriterion.maxPoints
      });
    }

    // Validate decision
    const evalDecision = decision && Object.values(EVALUATION_DECISION).includes(decision.toUpperCase())
      ? decision.toUpperCase()
      : EVALUATION_DECISION.APPROVED;

    // Check if an evaluation by this evaluator already exists for this submission
    let evaluation = await Evaluation.findOne({
      submissionId: submission._id,
      evaluatorId: req.user.userId
    });

    const { reviewAction } = req.body;
    let reviewStatus = AI_REVIEW_STATUS.MODIFIED;
    if (reviewAction && Object.values(AI_REVIEW_STATUS).includes(reviewAction.toUpperCase())) {
      reviewStatus = reviewAction.toUpperCase();
    } else if (evaluation?.aiSuggestedScore !== null && evaluation?.aiSuggestedScore !== undefined) {
      reviewStatus = (calculatedTotalScore === evaluation.aiSuggestedScore)
        ? AI_REVIEW_STATUS.ACCEPTED
        : AI_REVIEW_STATUS.MODIFIED;
    }

    if (evaluation) {
      evaluation.criteriaScores = formattedScores;
      evaluation.totalScore = calculatedTotalScore;
      evaluation.feedback = feedback ? feedback.trim() : "";
      evaluation.decision = evalDecision;
      evaluation.rubricId = rubric._id;
      evaluation.rubricVersion = rubric.version;
      evaluation.maxPossibleScore = rubric.totalPoints;
      evaluation.reviewStatus = reviewStatus;
      await evaluation.save();
    } else {
      evaluation = await Evaluation.create({
        submissionId: submission._id,
        evaluatorId: req.user.userId,
        rubricId: rubric._id,
        rubricVersion: rubric.version,
        criteriaScores: formattedScores,
        totalScore: calculatedTotalScore,
        maxPossibleScore: rubric.totalPoints,
        feedback: feedback ? feedback.trim() : "",
        decision: evalDecision,
        reviewStatus
      });
    }

    // Update submission status based on evaluation decision
    if (evalDecision === EVALUATION_DECISION.APPROVED) {
      submission.status = SUBMISSION_STATUS.EVALUATED;
    } else if (evalDecision === EVALUATION_DECISION.REJECTED) {
      submission.status = SUBMISSION_STATUS.REJECTED;
    } else if (evalDecision === EVALUATION_DECISION.FLAGGED) {
      submission.status = SUBMISSION_STATUS.FLAGGED;
    }
    submission.reviewedAt = new Date();
    await submission.save();

    // Mark assignment as completed
    await EvaluationAssignment.findOneAndUpdate(
      { submissionId: submission._id, evaluatorId: req.user.userId },
      { status: "COMPLETED" }
    );

    return sendSuccess(
      res,
      `Submission evaluated successfully with decision ${evalDecision}`,
      evaluation,
      201
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to evaluate submission", 500);
  }
};

// @desc    Trigger AI-assisted evaluation for a submission
// @route   POST /api/evaluations/:submissionId/ai-evaluate (or /api/ai-evaluations/:submissionId)
// @access  Evaluator / Admin
const triggerAiEvaluation = async (req, res) => {
  try {
    const rawId = req.params.submissionId || req.params.id;
    const submissionId = rawId ? rawId.replace(/^:/, "").trim() : "";

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    if (submission.status === SUBMISSION_STATUS.DRAFT) {
      return sendError(res, "Cannot run AI evaluation on a draft submission", 400);
    }

    // Security check: Evaluators can only run AI evaluation on assigned submissions (unless ADMIN)
    if (req.user.role !== ROLES.ADMIN) {
      const assignment = await EvaluationAssignment.findOne({
        submissionId: submission._id,
        evaluatorId: req.user.userId
      });

      if (!assignment) {
        return sendError(res, "Access denied: you are not assigned to evaluate this submission", 403);
      }
    }

    const task = await Task.findById(submission.taskId);
    if (!task) {
      return sendError(res, "Associated task not found", 404);
    }

    const rubric = await Rubric.findOne({
      taskId: submission.taskId,
      active: true
    });

    if (!rubric) {
      return sendError(res, "No active rubric configured for this task", 400);
    }

    // Invoke AI Evaluation Service
    const aiResult = await aiEvaluationService.evaluateSubmission({
      task,
      rubric,
      submission
    });

    // Check if an Evaluation record already exists for this submission and evaluator
    let evaluation = await Evaluation.findOne({
      submissionId: submission._id,
      evaluatorId: req.user.userId
    });

    const aiCriteriaPayload = aiResult.criteria.map((c) => ({
      criterionId: c.criterionId,
      criterionName: c.criterionName,
      score: c.score,
      maxPoints: c.maxPoints,
      reasoning: c.reasoning
    }));

    if (evaluation) {
      evaluation.aiSuggestedScore = aiResult.suggestedScore;
      evaluation.aiConfidence = aiResult.confidence;
      evaluation.aiReasoning = aiResult.overallReasoning;
      evaluation.aiEvidenceObservations = aiResult.evidenceObservations;
      evaluation.aiCriteriaScores = aiCriteriaPayload;
      evaluation.aiEvaluatedAt = new Date();
      evaluation.rubricId = rubric._id;
      evaluation.rubricVersion = rubric.version;
      evaluation.maxPossibleScore = aiResult.maxPossibleScore;
      evaluation.reviewStatus = AI_REVIEW_STATUS.PENDING_REVIEW;
      await evaluation.save();
    } else {
      evaluation = await Evaluation.create({
        submissionId: submission._id,
        evaluatorId: req.user.userId,
        rubricId: rubric._id,
        rubricVersion: rubric.version,
        totalScore: 0,
        maxPossibleScore: aiResult.maxPossibleScore,
        criteriaScores: [],
        feedback: "",
        decision: EVALUATION_DECISION.APPROVED,
        aiSuggestedScore: aiResult.suggestedScore,
        aiConfidence: aiResult.confidence,
        aiReasoning: aiResult.overallReasoning,
        aiEvidenceObservations: aiResult.evidenceObservations,
        aiCriteriaScores: aiCriteriaPayload,
        aiEvaluatedAt: new Date(),
        reviewStatus: AI_REVIEW_STATUS.PENDING_REVIEW
      });
    }

    return sendSuccess(
      res,
      "AI evaluation generated successfully. Suggested scores ready for human review.",
      {
        evaluationId: evaluation._id,
        submissionId: submission._id,
        taskId: task._id,
        rubricId: rubric._id,
        suggestedScore: aiResult.suggestedScore,
        maxPossibleScore: aiResult.maxPossibleScore,
        confidence: aiResult.confidence,
        overallReasoning: aiResult.overallReasoning,
        evidenceObservations: aiResult.evidenceObservations,
        criteria: aiResult.criteria,
        reviewStatus: evaluation.reviewStatus
      },
      200
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to generate AI evaluation", 500);
  }
};

// @desc    Get AI evaluation result for a submission
// @route   GET /api/evaluations/:submissionId/ai-evaluation (or /api/ai-evaluations/:submissionId)
// @access  Evaluator / Admin
const getAiEvaluation = async (req, res) => {
  try {
    const rawId = req.params.submissionId || req.params.id;
    const submissionId = rawId ? rawId.replace(/^:/, "").trim() : "";

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    if (req.user.role !== ROLES.ADMIN) {
      const assignment = await EvaluationAssignment.findOne({
        submissionId: submission._id,
        evaluatorId: req.user.userId
      });

      if (!assignment) {
        return sendError(res, "Access denied: you are not assigned to this submission", 403);
      }
    }

    const evaluation = await Evaluation.findOne({
      submissionId: submission._id,
      evaluatorId: req.user.userId
    }).populate("rubricId");

    if (!evaluation || evaluation.aiSuggestedScore === null) {
      return sendError(res, "AI evaluation has not been generated for this submission yet", 404);
    }

    return sendSuccess(res, "AI evaluation retrieved successfully", {
      evaluationId: evaluation._id,
      submissionId: evaluation.submissionId,
      aiSuggestedScore: evaluation.aiSuggestedScore,
      aiConfidence: evaluation.aiConfidence,
      aiReasoning: evaluation.aiReasoning,
      aiEvidenceObservations: evaluation.aiEvidenceObservations,
      aiCriteriaScores: evaluation.aiCriteriaScores,
      aiEvaluatedAt: evaluation.aiEvaluatedAt,
      reviewStatus: evaluation.reviewStatus,
      humanScore: evaluation.totalScore,
      humanFeedback: evaluation.feedback,
      decision: evaluation.decision
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve AI evaluation", 500);
  }
};

// @desc    Update evaluation
// @route   PUT /api/evaluations/:id
// @access  Evaluator / Admin
const updateEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return sendError(res, "Evaluation not found", 404);
    }

    if (
      req.user.role !== ROLES.ADMIN &&
      evaluation.evaluatorId.toString() !== req.user.userId
    ) {
      return sendError(res, "Access denied: you did not create this evaluation", 403);
    }

    const { feedback, decision } = req.body;
    if (feedback !== undefined) evaluation.feedback = feedback.trim();
    if (decision && Object.values(EVALUATION_DECISION).includes(decision.toUpperCase())) {
      evaluation.decision = decision.toUpperCase();
    }

    await evaluation.save();

    return sendSuccess(res, "Evaluation updated successfully", evaluation);
  } catch (error) {
    return sendError(res, error.message || "Failed to update evaluation", 500);
  }
};

module.exports = {
  assignEvaluator,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignedSubmissions,
  getMyEvaluations,
  getEvaluationById,
  evaluateSubmission,
  updateEvaluation,
  triggerAiEvaluation,
  getAiEvaluation
};


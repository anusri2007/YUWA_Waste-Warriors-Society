const Calibration = require("../models/Calibration");
const Task = require("../models/Task");
const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");
const Rubric = require("../models/Rubric");
const { CALIBRATION_STATUS, ROLES } = require("../utils/constants");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get tasks available for calibration with reference submissions
// @route   GET /api/calibration/tasks
// @access  Evaluator / Admin
const getCalibrationTasks = async (req, res) => {
  try {
    // Find submissions that have an existing evaluation (can serve as reference)
    const evaluatedSubmissions = await Evaluation.find().distinct("submissionId");

    const submissions = await Submission.find({
      _id: { $in: evaluatedSubmissions }
    })
      .populate("taskId", "title taskType maxPoints deadline instructions")
      .populate("competitionId", "name year");

    return sendSuccess(res, "Calibration benchmark tasks retrieved successfully", submissions);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve calibration tasks", 500);
  }
};

// @desc    Score a reference submission for calibration
// @route   POST /api/calibration/:taskId
// @access  Evaluator / Admin
const evaluateCalibrationTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { submissionId, criteriaScores, feedback } = req.body;

    if (!submissionId || !criteriaScores || !Array.isArray(criteriaScores)) {
      return sendError(res, "submissionId and criteriaScores are required", 400);
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return sendError(res, "Submission not found", 404);
    }

    // Find reference evaluation for this submission
    const referenceEvaluation = await Evaluation.findOne({ submissionId: submission._id });
    if (!referenceEvaluation) {
      return sendError(
        res,
        "This submission does not have an official reference evaluation score yet",
        400
      );
    }

    // Fetch rubric
    const rubric = await Rubric.findOne({ taskId: task._id, active: true });
    if (!rubric) {
      return sendError(res, "Active rubric not found for this task", 400);
    }

    // Calculate evaluator score
    let evaluatorScore = 0;
    for (const rubricCriterion of rubric.criteria) {
      const input = criteriaScores.find(
        (cs) => cs.criterionId?.toString() === rubricCriterion._id.toString()
      );
      if (!input) {
        return sendError(res, `Missing score for criterion "${rubricCriterion.name}"`, 400);
      }
      const score = Number(input.score);
      if (isNaN(score) || score < 0 || score > rubricCriterion.maxPoints) {
        return sendError(res, `Invalid score for criterion "${rubricCriterion.name}"`, 400);
      }
      evaluatorScore += score;
    }

    const referenceScore = referenceEvaluation.totalScore;
    const difference = Math.abs(referenceScore - evaluatorScore);

    // Tolerance: within 10% of task max points or 10 points
    const tolerance = Math.max(5, (task.maxPoints || 100) * 0.1);
    const status =
      difference <= tolerance
        ? CALIBRATION_STATUS.CALIBRATION_PASS
        : CALIBRATION_STATUS.CALIBRATION_REVIEW;

    const calibration = await Calibration.create({
      evaluatorId: req.user.userId,
      taskId: task._id,
      submissionId: submission._id,
      referenceScore,
      evaluatorScore,
      difference,
      status,
      feedback: feedback ? feedback.trim() : ""
    });

    return sendSuccess(
      res,
      `Calibration completed: ${status} (Difference: ${difference.toFixed(1)} pts)`,
      calibration,
      201
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to complete calibration", 500);
  }
};

// @desc    Get current evaluator's calibration results
// @route   GET /api/calibration/my
// @access  Evaluator / Admin
const getMyCalibrations = async (req, res) => {
  try {
    const filter = req.user.role === ROLES.ADMIN ? {} : { evaluatorId: req.user.userId };

    const calibrations = await Calibration.find(filter)
      .populate("taskId", "title taskType maxPoints")
      .populate("evaluatorId", "name email")
      .sort({ createdAt: -1 });

    return sendSuccess(res, "Calibration results retrieved successfully", calibrations);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve calibration results", 500);
  }
};

// @desc    Get single calibration by ID
// @route   GET /api/calibration/:id
// @access  Authenticated
const getCalibrationById = async (req, res) => {
  try {
    const calibration = await Calibration.findById(req.params.id)
      .populate("taskId")
      .populate("submissionId")
      .populate("evaluatorId", "name email");

    if (!calibration) {
      return sendError(res, "Calibration record not found", 404);
    }

    return sendSuccess(res, "Calibration details retrieved successfully", calibration);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve calibration", 500);
  }
};

module.exports = {
  getCalibrationTasks,
  evaluateCalibrationTask,
  getMyCalibrations,
  getCalibrationById
};

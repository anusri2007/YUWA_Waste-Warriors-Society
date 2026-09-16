const Task = require("../models/Task");
const Competition = require("../models/Competition");
const Rubric = require("../models/Rubric");
const { TASK_TYPES, TASK_STATUS } = require("../utils/constants");
const { sendSuccess, sendPaginated, sendError } = require("../utils/apiResponse");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");

// @desc    Get tasks (filterable by competitionId, taskType, status)
// @route   GET /api/tasks
// @access  Authenticated
const getTasks = async (req, res) => {
  try {
    const { competitionId, taskType, status, search } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};
    if (competitionId) filter.competitionId = competitionId;
    if (taskType && Object.values(TASK_TYPES).includes(taskType.toUpperCase())) {
      filter.taskType = taskType.toUpperCase();
    }
    if (status && Object.values(TASK_STATUS).includes(status.toUpperCase())) {
      filter.status = status.toUpperCase();
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate("competitionId", "name year status")
      .populate("createdBy", "name email")
      .sort({ deadline: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendPaginated(
      res,
      "Tasks retrieved successfully",
      tasks,
      getPaginationMeta(total, page, limit)
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve tasks", 500);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Authenticated
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("competitionId", "name year status")
      .populate("createdBy", "name email");

    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    // Also fetch active rubric for this task
    const rubric = await Rubric.findOne({ taskId: task._id, active: true });

    return sendSuccess(res, "Task details retrieved successfully", {
      task,
      rubric: rubric || null
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve task", 500);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Admin only
const createTask = async (req, res) => {
  try {
    const {
      competitionId,
      title,
      description,
      taskType,
      instructions,
      deadline,
      maxPoints,
      requiredEvidence,
      impactMetrics,
      status
    } = req.body;

    if (!competitionId || !title || !description || !deadline) {
      return sendError(
        res,
        "competitionId, title, description and deadline are required",
        400
      );
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    const task = await Task.create({
      competitionId,
      title: title.trim(),
      description: description.trim(),
      taskType: taskType || TASK_TYPES.CLEANUP,
      instructions: instructions ? instructions.trim() : "",
      deadline: new Date(deadline),
      maxPoints: maxPoints ? Number(maxPoints) : 100,
      status: status || TASK_STATUS.ACTIVE,
      requiredEvidence: {
        photo: Boolean(requiredEvidence?.photo),
        video: Boolean(requiredEvidence?.video),
        reflection: Boolean(requiredEvidence?.reflection),
        wasteWeightKg: Boolean(requiredEvidence?.wasteWeightKg)
      },
      impactMetrics: {
        wasteRecoveredKg: Boolean(impactMetrics?.wasteRecoveredKg),
        studentHours: Boolean(impactMetrics?.studentHours),
        awarenessCount: Boolean(impactMetrics?.awarenessCount),
        climateActionCount: Boolean(impactMetrics?.climateActionCount)
      },
      createdBy: req.user.userId
    });

    return sendSuccess(res, "Task created successfully", task, 201);
  } catch (error) {
    return sendError(res, error.message || "Failed to create task", 500);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Admin only
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    const {
      title,
      description,
      taskType,
      instructions,
      deadline,
      maxPoints,
      requiredEvidence,
      impactMetrics,
      status
    } = req.body;

    if (title) task.title = title.trim();
    if (description) task.description = description.trim();
    if (taskType && Object.values(TASK_TYPES).includes(taskType.toUpperCase())) {
      task.taskType = taskType.toUpperCase();
    }
    if (instructions !== undefined) task.instructions = instructions.trim();
    if (deadline) task.deadline = new Date(deadline);
    if (maxPoints !== undefined) task.maxPoints = Number(maxPoints);
    if (status && Object.values(TASK_STATUS).includes(status.toUpperCase())) {
      task.status = status.toUpperCase();
    }
    if (requiredEvidence) {
      task.requiredEvidence = {
        photo: requiredEvidence.photo !== undefined ? Boolean(requiredEvidence.photo) : task.requiredEvidence.photo,
        video: requiredEvidence.video !== undefined ? Boolean(requiredEvidence.video) : task.requiredEvidence.video,
        reflection: requiredEvidence.reflection !== undefined ? Boolean(requiredEvidence.reflection) : task.requiredEvidence.reflection,
        wasteWeightKg: requiredEvidence.wasteWeightKg !== undefined ? Boolean(requiredEvidence.wasteWeightKg) : task.requiredEvidence.wasteWeightKg
      };
    }
    if (impactMetrics) {
      task.impactMetrics = {
        wasteRecoveredKg: impactMetrics.wasteRecoveredKg !== undefined ? Boolean(impactMetrics.wasteRecoveredKg) : task.impactMetrics.wasteRecoveredKg,
        studentHours: impactMetrics.studentHours !== undefined ? Boolean(impactMetrics.studentHours) : task.impactMetrics.studentHours,
        awarenessCount: impactMetrics.awarenessCount !== undefined ? Boolean(impactMetrics.awarenessCount) : task.impactMetrics.awarenessCount,
        climateActionCount: impactMetrics.climateActionCount !== undefined ? Boolean(impactMetrics.climateActionCount) : task.impactMetrics.climateActionCount
      };
    }

    await task.save();

    return sendSuccess(res, "Task updated successfully", task);
  } catch (error) {
    return sendError(res, error.message || "Failed to update task", 500);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Admin only
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    await Task.findByIdAndDelete(req.params.id);

    return sendSuccess(res, "Task deleted successfully", {});
  } catch (error) {
    return sendError(res, error.message || "Failed to delete task", 500);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

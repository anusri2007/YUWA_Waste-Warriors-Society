const Rubric = require("../models/Rubric");
const Task = require("../models/Task");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get active and historical rubrics for a task
// @route   GET /api/rubrics/task/:taskId
// @access  Authenticated
const getRubricsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { activeOnly } = req.query;

    const filter = { taskId };
    if (activeOnly === "true") {
      filter.active = true;
    }

    const rubrics = await Rubric.find(filter)
      .populate("createdBy", "name email")
      .sort({ version: -1 });

    if (!rubrics || rubrics.length === 0) {
      return sendError(res, "No rubric found for this task", 404);
    }

    return sendSuccess(res, "Rubrics retrieved successfully", rubrics);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve rubrics", 500);
  }
};

// @desc    Create a new rubric (or new version of existing rubric)
// @route   POST /api/rubrics
// @access  Admin only
const createRubric = async (req, res) => {
  try {
    const { taskId, criteria } = req.body;

    if (!taskId || !criteria || !Array.isArray(criteria) || criteria.length === 0) {
      return sendError(res, "taskId and a non-empty criteria array are required", 400);
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return sendError(res, "Task not found", 404);
    }

    // Validate criteria
    let totalPoints = 0;
    for (const c of criteria) {
      if (!c.name || c.maxPoints === undefined || Number(c.maxPoints) < 1) {
        return sendError(
          res,
          "Each criterion must have a name and maxPoints of at least 1",
          400
        );
      }
      totalPoints += Number(c.maxPoints);
    }

    // Check existing rubrics for this task to compute version
    const latestRubric = await Rubric.findOne({ taskId }).sort({ version: -1 });
    const version = latestRubric ? latestRubric.version + 1 : 1;

    // Deactivate previous active rubrics for this task
    await Rubric.updateMany({ taskId, active: true }, { active: false });

    const rubric = await Rubric.create({
      taskId,
      criteria: criteria.map((c) => ({
        name: c.name.trim(),
        description: c.description ? c.description.trim() : "",
        maxPoints: Number(c.maxPoints)
      })),
      totalPoints,
      version,
      active: true,
      createdBy: req.user.userId
    });

    return sendSuccess(res, `Rubric version ${version} created successfully`, rubric, 201);
  } catch (error) {
    return sendError(res, error.message || "Failed to create rubric", 500);
  }
};

// @desc    Update an existing rubric
// @route   PUT /api/rubrics/:id
// @access  Admin only
const updateRubric = async (req, res) => {
  try {
    const rubric = await Rubric.findById(req.params.id);
    if (!rubric) {
      return sendError(res, "Rubric not found", 404);
    }

    const { criteria, active } = req.body;

    if (criteria && Array.isArray(criteria) && criteria.length > 0) {
      let totalPoints = 0;
      for (const c of criteria) {
        if (!c.name || c.maxPoints === undefined || Number(c.maxPoints) < 1) {
          return sendError(
            res,
            "Each criterion must have a name and maxPoints of at least 1",
            400
          );
        }
        totalPoints += Number(c.maxPoints);
      }

      rubric.criteria = criteria.map((c) => ({
        name: c.name.trim(),
        description: c.description ? c.description.trim() : "",
        maxPoints: Number(c.maxPoints)
      }));
      rubric.totalPoints = totalPoints;
    }

    if (active !== undefined) {
      rubric.active = Boolean(active);
    }

    await rubric.save();

    return sendSuccess(res, "Rubric updated successfully", rubric);
  } catch (error) {
    return sendError(res, error.message || "Failed to update rubric", 500);
  }
};

// @desc    Delete rubric
// @route   DELETE /api/rubrics/:id
// @access  Admin only
const deleteRubric = async (req, res) => {
  try {
    const rubric = await Rubric.findById(req.params.id);
    if (!rubric) {
      return sendError(res, "Rubric not found", 404);
    }

    await Rubric.findByIdAndDelete(req.params.id);

    return sendSuccess(res, "Rubric deleted successfully", {});
  } catch (error) {
    return sendError(res, error.message || "Failed to delete rubric", 500);
  }
};

module.exports = {
  getRubricsByTask,
  createRubric,
  updateRubric,
  deleteRubric
};

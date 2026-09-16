const College = require("../models/College");
const generateId = require("../utils/generateId");
const { sendSuccess, sendPaginated, sendError } = require("../utils/apiResponse");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");

// @desc    Get all colleges (paginated, searchable)
// @route   GET /api/colleges
// @access  Admin (or authenticated)
const getColleges = async (req, res) => {
  try {
    const { search } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { collegeId: { $regex: search, $options: "i" } }
      ];
    }

    const total = await College.countDocuments(filter);
    const colleges = await College.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendPaginated(
      res,
      "Colleges retrieved successfully",
      colleges,
      getPaginationMeta(total, page, limit)
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve colleges", 500);
  }
};

// @desc    Create a new college (Auto-generates collegeId COL-001...)
// @route   POST /api/colleges
// @access  Admin only
const createCollege = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return sendError(res, "Name and location are required", 400);
    }

    const existingCollege = await College.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") }
    });

    if (existingCollege) {
      return sendError(res, `A college named "${name.trim()}" already exists`, 409);
    }

    // Server-side atomic concurrency-safe ID generation
    const collegeId = await generateId("college", "COL");

    const college = await College.create({
      collegeId,
      name: name.trim(),
      location: location.trim()
    });

    return sendSuccess(res, "College created successfully", college, 201);
  } catch (error) {
    return sendError(res, error.message || "Failed to create college", 500);
  }
};

// @desc    Get single college by ID (Mongo ObjectId or COL-xxx)
// @route   GET /api/colleges/:id
// @access  Authenticated
const getCollegeById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let college = null;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(identifier);
    }
    if (!college) {
      college = await College.findOne({ collegeId: identifier.toUpperCase() });
    }

    if (!college) {
      return sendError(res, "College not found", 404);
    }

    return sendSuccess(res, "College retrieved successfully", college);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve college", 500);
  }
};

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Admin only
const updateCollege = async (req, res) => {
  try {
    const { name, location } = req.body;
    const college = await College.findById(req.params.id);

    if (!college) {
      return sendError(res, "College not found", 404);
    }

    if (name) college.name = name.trim();
    if (location) college.location = location.trim();

    await college.save();

    return sendSuccess(res, "College updated successfully", college);
  } catch (error) {
    return sendError(res, error.message || "Failed to update college", 500);
  }
};

// @desc    Delete college
// @route   DELETE /api/colleges/:id
// @access  Admin only
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return sendError(res, "College not found", 404);
    }

    await College.findByIdAndDelete(req.params.id);

    return sendSuccess(res, "College deleted successfully", {});
  } catch (error) {
    return sendError(res, error.message || "Failed to delete college", 500);
  }
};

// @desc    Get coordinator's own college
// @route   GET /api/colleges/my
// @access  Coordinator (or any authenticated user with college assigned)
const getMyCollege = async (req, res) => {
  try {
    if (!req.user.collegeId) {
      return sendError(
        res,
        "No college is currently assigned to your account",
        404
      );
    }

    const college = await College.findById(req.user.collegeId);
    if (!college) {
      return sendError(res, "Assigned college record not found", 404);
    }

    return sendSuccess(res, "My college retrieved successfully", college);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve college", 500);
  }
};

module.exports = {
  getColleges,
  createCollege,
  getCollegeById,
  updateCollege,
  deleteCollege,
  getMyCollege
};

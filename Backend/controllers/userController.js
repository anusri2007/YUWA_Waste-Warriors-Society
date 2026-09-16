const User = require("../models/User");
const College = require("../models/College");
const { ROLES, USER_STATUS } = require("../utils/constants");
const { sendSuccess, sendPaginated, sendError } = require("../utils/apiResponse");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");

// @desc    Get all users (with filters and pagination)
// @route   GET /api/users
// @access  Admin only
const getUsers = async (req, res) => {
  try {
    const { role, status, collegeId, search } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};

    if (role && Object.values(ROLES).includes(role.toUpperCase())) {
      filter.role = role.toUpperCase();
    }

    if (status && Object.values(USER_STATUS).includes(status.toUpperCase())) {
      filter.status = status.toUpperCase();
    }

    if (collegeId) {
      filter.collegeId = collegeId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .populate("collegeId", "collegeId name location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendPaginated(
      res,
      "Users retrieved successfully",
      users,
      getPaginationMeta(total, page, limit)
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve users", 500);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Admin only
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("collegeId", "collegeId name location");

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, "User details retrieved successfully", user);
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve user", 500);
  }
};

// @desc    Update basic user info
// @route   PUT /api/users/:id
// @access  Admin only
const updateUser = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (name) user.name = name.trim();
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber ? phoneNumber.trim() : null;

    await user.save();

    return sendSuccess(res, "User updated successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phoneNumber: user.phoneNumber
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to update user", 500);
  }
};

// @desc    Update user status (PENDING / ACTIVE / BLOCKED)
// @route   PUT /api/users/:id/status
// @access  Admin only
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !Object.values(USER_STATUS).includes(status.toUpperCase())) {
      return sendError(
        res,
        `Invalid status. Allowed: ${Object.values(USER_STATUS).join(", ")}`,
        400
      );
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    user.status = status.toUpperCase();
    await user.save();

    return sendSuccess(res, `User status updated to ${user.status}`, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to update user status", 500);
  }
};

// @desc    Update user role (ADMIN / COORDINATOR / STUDENT / EVALUATOR)
// @route   PUT /api/users/:id/role
// @access  Admin only
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !Object.values(ROLES).includes(role.toUpperCase())) {
      return sendError(
        res,
        `Invalid role. Allowed: ${Object.values(ROLES).join(", ")}`,
        400
      );
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    user.role = role.toUpperCase();
    await user.save();

    return sendSuccess(res, `User role updated to ${user.role}`, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to update user role", 500);
  }
};

// @desc    Assign college to user (especially for coordinators)
// @route   PUT /api/users/:id/assign-college
// @access  Admin only
const assignCollege = async (req, res) => {
  try {
    const { collegeId } = req.body;

    if (!collegeId) {
      return sendError(res, "collegeId is required", 400);
    }

    // Support either Mongo ObjectId or generated collegeId code (e.g. COL-001)
    let college = null;
    if (collegeId.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(collegeId);
    }
    if (!college) {
      college = await College.findOne({ collegeId: collegeId.toUpperCase() });
    }

    if (!college) {
      return sendError(res, "College not found", 404);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    user.collegeId = college._id;
    await user.save();

    return sendSuccess(res, `User assigned to college ${college.name} (${college.collegeId})`, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: {
        id: college._id,
        collegeId: college.collegeId,
        name: college.name
      }
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to assign college", 500);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  updateUserRole,
  assignCollege
};

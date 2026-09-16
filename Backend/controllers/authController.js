const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ROLES, USER_STATUS } = require("../utils/constants");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const generateToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  collegeId: user.collegeId || null,
  phoneNumber: user.phoneNumber || null
});

// @desc    Register a new user (Student / Coordinator / Evaluator)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, username, email, password, phoneNumber, role, collegeId } = req.body;
    const displayName = (name || username || "").trim();

    if (!displayName || !email || !password) {
      return sendError(res, "Name, email and password are required", 400);
    }

    if (password.length < 6) {
      return sendError(res, "Password must be at least 6 characters long", 400);
    }

    // Critical security: Public registration must NEVER allow ADMIN role
    if (role && role.toString().toUpperCase() === ROLES.ADMIN) {
      return sendError(res, "Admin registration is not allowed.", 403);
    }

    let targetRole = ROLES.STUDENT;
    if (role) {
      const upperRole = role.toString().toUpperCase();
      if (![ROLES.STUDENT, ROLES.COORDINATOR, ROLES.EVALUATOR].includes(upperRole)) {
        return sendError(
          res,
          `Invalid role specified. Allowed roles for registration: ${[ROLES.STUDENT, ROLES.COORDINATOR, ROLES.EVALUATOR].join(", ")}`,
          400
        );
      }
      targetRole = upperRole;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return sendError(res, "User with this email already exists", 409);
    }

    // Students are ACTIVE immediately; Coordinator & Evaluator are PENDING admin approval
    const targetStatus = targetRole === ROLES.STUDENT ? USER_STATUS.ACTIVE : USER_STATUS.PENDING;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: displayName,
      email: normalizedEmail,
      password: hashedPassword,
      role: targetRole,
      status: targetStatus,
      collegeId: collegeId || null,
      phoneNumber: phoneNumber ? phoneNumber.trim() : null
    });

    // If account is PENDING approval, do NOT issue an active JWT token
    if (targetStatus === USER_STATUS.PENDING) {
      return sendSuccess(
        res,
        "Registration successful. Your account is pending admin approval.",
        {
          user: formatUserResponse(user)
        },
        201
      );
    }

    // For ACTIVE students, issue JWT token for immediate access
    const token = generateToken(user._id, user.role);

    return sendSuccess(
      res,
      "Student registered successfully",
      {
        token,
        user: formatUserResponse(user)
      },
      201
    );
  } catch (error) {
    return sendError(res, error.message || "Registration failed", 500);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return sendError(res, "Invalid email or password", 401);
    }

    if (user.status === USER_STATUS.PENDING) {
      return sendError(res, "Your account is pending admin approval.", 403);
    }

    if (user.status === USER_STATUS.BLOCKED) {
      return sendError(res, "Your account has been blocked. Please contact admin.", 403);
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, "Login successful", {
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    return sendError(res, error.message || "Login failed", 500);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("collegeId", "collegeId name location");

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, "User profile retrieved successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        college: user.collegeId,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve profile", 500);
  }
};

// @desc    Logout user (client destroys token, server acknowledges)
// @route   POST /api/auth/logout
// @access  Public / Private
const logout = async (req, res) => {
  return sendSuccess(res, "Logged out successfully", {});
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
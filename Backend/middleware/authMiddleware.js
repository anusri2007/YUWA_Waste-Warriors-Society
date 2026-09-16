const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "_id name email role status collegeId"
    );

    if (!user) {
      return sendError(res, "User no longer exists", 401);
    }

    if (user.status === "BLOCKED") {
      return sendError(res, "Account is blocked. Please contact admin.", 403);
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      status: user.status,
      collegeId: user.collegeId ? user.collegeId.toString() : null,
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, "Token has expired", 401);
    }
    return sendError(res, "Invalid or expired token", 401);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select(
        "_id name email role status collegeId"
      );
      if (user && user.status !== "BLOCKED") {
        req.user = {
          userId: user._id.toString(),
          role: user.role,
          status: user.status,
          collegeId: user.collegeId ? user.collegeId.toString() : null,
          name: user.name,
          email: user.email
        };
      }
    }
  } catch (err) {
    // Ignore invalid token on public routes
  }
  next();
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;
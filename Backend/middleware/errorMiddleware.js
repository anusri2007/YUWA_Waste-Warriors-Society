const { sendError } = require("../utils/apiResponse");

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

/**
 * Central Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err.message);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    return sendError(res, `Invalid format for field: ${err.path}`, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return sendError(res, `Duplicate value entered for ${field}. Please use another value.`, 409);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, messages.join(", "), 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, "Invalid authentication token", 401);
  }
  if (err.name === "TokenExpiredError") {
    return sendError(res, "Authentication token has expired", 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return sendError(res, message, statusCode);
};

module.exports = {
  notFoundHandler,
  errorHandler
};

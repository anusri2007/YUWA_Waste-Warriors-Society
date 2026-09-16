/**
 * Standardized API Response utilities
 * Enforces:
 * Success: { "success": true, "message": "...", "data": {} }
 * Error:   { "success": false, "message": "..." }
 */

const sendSuccess = (res, message = "Success", data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendPaginated = (res, message = "Success", data = [], pagination = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination
  });
};

const sendError = (res, message = "An error occurred", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  sendSuccess,
  sendPaginated,
  sendError
};

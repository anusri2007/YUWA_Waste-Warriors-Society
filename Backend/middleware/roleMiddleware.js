const { sendError } = require("../utils/apiResponse");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, "Access denied: insufficient permissions", 403);
    }

    // PENDING privileged accounts (ADMIN, COORDINATOR, EVALUATOR) cannot access privileged functionality
    if (
      ["ADMIN", "COORDINATOR", "EVALUATOR"].includes(req.user.role) &&
      req.user.status === "PENDING"
    ) {
      return sendError(
        res,
        "Account is pending admin approval. Access denied.",
        403
      );
    }

    next();
  };
};

module.exports = roleMiddleware;
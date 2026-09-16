const mongoose = require("mongoose");
const { sendError } = require("../utils/apiResponse");

/**
 * Validates that specified request parameters or body keys contain valid MongoDB ObjectIds
 */
const validateObjectId = (paramName = "id", location = "params") => {
  return (req, res, next) => {
    const id = req[location]?.[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, `Invalid ${paramName} identifier format`, 400);
    }
    next();
  };
};

module.exports = {
  validateObjectId
};

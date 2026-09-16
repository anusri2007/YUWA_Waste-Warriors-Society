const express = require("express");
const {
  getCalibrationTasks,
  evaluateCalibrationTask,
  getMyCalibrations,
  getCalibrationById
} = require("../controllers/calibrationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

router.get("/tasks", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), getCalibrationTasks);
router.get("/my", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), getMyCalibrations);
router.post("/:taskId", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), evaluateCalibrationTask);
router.get("/:id", getCalibrationById);

module.exports = router;

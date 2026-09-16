const express = require("express");
const {
  triggerAiEvaluation,
  getAiEvaluation
} = require("../controllers/evaluationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

// AI-Assisted Evaluation Endpoints
// POST /api/ai-evaluations/:submissionId -> Triggers AI rubric evaluation
router.post("/:submissionId", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), triggerAiEvaluation);

// GET /api/ai-evaluations/:submissionId -> Retrieves existing AI evaluation suggestion
router.get("/:submissionId", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), getAiEvaluation);

module.exports = router;

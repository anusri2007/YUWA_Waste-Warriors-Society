const express = require("express");
const {
  assignEvaluator,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignedSubmissions,
  getMyEvaluations,
  getEvaluationById,
  evaluateSubmission,
  updateEvaluation,
  triggerAiEvaluation,
  getAiEvaluation
} = require("../controllers/evaluationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

// Assignment management (Admin only)
router.post("/assign", roleMiddleware(ROLES.ADMIN), assignEvaluator);
router.get("/assignments", roleMiddleware(ROLES.ADMIN), getAssignments);
router.put("/assignments/:id", roleMiddleware(ROLES.ADMIN), updateAssignment);
router.delete("/assignments/:id", roleMiddleware(ROLES.ADMIN), deleteAssignment);

// Evaluator routes
router.get("/assigned", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), getAssignedSubmissions);
router.get("/my", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), getMyEvaluations);

// AI-Assisted Evaluation
router.post("/:submissionId/ai-evaluate", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), triggerAiEvaluation);
router.get("/:submissionId/ai-evaluation", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), getAiEvaluation);

// Scoring submission (Human in the loop)
router.post("/:submissionId", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), evaluateSubmission);

// Specific evaluation viewing & updating
router.get("/:id", getEvaluationById);
router.put("/:id", roleMiddleware(ROLES.EVALUATOR, ROLES.ADMIN), updateEvaluation);

module.exports = router;


const express = require("express");
const {
  createSubmission,
  updateSubmission,
  addEvidence,
  deleteEvidence,
  submitSubmission,
  getMySubmissions,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus
} = require("../controllers/submissionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

// Student own submissions
router.get("/my", roleMiddleware(ROLES.STUDENT), getMySubmissions);

// Base list (Admin, Evaluator, Coordinator) and create (Student)
router.get(
  "/",
  roleMiddleware(ROLES.ADMIN, ROLES.EVALUATOR, ROLES.COORDINATOR),
  getSubmissions
);
router.post("/", roleMiddleware(ROLES.STUDENT), createSubmission);

// Parameterized routes
router.get("/:id", getSubmissionById);
router.put("/:id", updateSubmission);
router.post(
  "/:id/evidence",
  upload.single("file"),
  addEvidence
);
router.delete("/:id/evidence/:evidenceId", deleteEvidence);
router.put("/:id/submit", roleMiddleware(ROLES.STUDENT), submitSubmission);
router.put(
  "/:id/status",
  roleMiddleware(ROLES.ADMIN, ROLES.EVALUATOR),
  updateSubmissionStatus
);

module.exports = router;

const express = require("express");
const {
  getCommunitySubmissions,
  getCommunityMilestones,
  celebrateSubmission
} = require("../controllers/communityController");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/submissions", optionalAuth, getCommunitySubmissions);
router.get("/milestones", getCommunityMilestones);
router.post("/:id/celebrate", optionalAuth, celebrateSubmission);

module.exports = router;

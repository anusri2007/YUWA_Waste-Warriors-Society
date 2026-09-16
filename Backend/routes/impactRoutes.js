const express = require("express");
const {
  getCompetitionImpact,
  getImpactByCollege,
  getImpactByTask
} = require("../controllers/impactController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/:competitionId/by-college", getImpactByCollege);
router.get("/:competitionId/by-task", getImpactByTask);
router.get("/:competitionId", getCompetitionImpact);

module.exports = router;

const express = require("express");
const {
  getCompetitions,
  createCompetition,
  getCompetitionById,
  updateCompetition,
  updateCompetitionStatus,
  getCompetitionHistory,
  getCompetitionLeaderboard,
  getCompetitionImpact
} = require("../controllers/competitionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCompetitions);
router.post("/", roleMiddleware(ROLES.ADMIN), createCompetition);

router.get("/:id/history", getCompetitionHistory);
router.get("/:id/leaderboard", getCompetitionLeaderboard);
router.get("/:id/impact", getCompetitionImpact);

router.get("/:id", getCompetitionById);
router.put("/:id", roleMiddleware(ROLES.ADMIN), updateCompetition);
router.put("/:id/status", roleMiddleware(ROLES.ADMIN), updateCompetitionStatus);

module.exports = router;

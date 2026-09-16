const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/:competitionId", getLeaderboard);

module.exports = router;

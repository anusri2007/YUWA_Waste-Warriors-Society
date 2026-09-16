const express = require("express");
const {
  createTeam,
  joinTeam,
  getTeams,
  getMyTeams,
  getCollegeTeams,
  getTeamById,
  updateTeam,
  getTeamMembers,
  getTeamSubmissions
} = require("../controllers/teamController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

// Specific routes before parameter routes
router.post("/join", roleMiddleware(ROLES.STUDENT), joinTeam);
router.get("/my", roleMiddleware(ROLES.STUDENT), getMyTeams);
router.get("/college", roleMiddleware(ROLES.COORDINATOR), getCollegeTeams);

// Base collection routes
router.get("/", roleMiddleware(ROLES.ADMIN), getTeams);
router.post("/", roleMiddleware(ROLES.COORDINATOR), createTeam);

// Parameterized routes
router.get("/:id", getTeamById);
router.put("/:id", roleMiddleware(ROLES.COORDINATOR, ROLES.ADMIN), updateTeam);
router.get("/:id/members", getTeamMembers);
router.get("/:id/submissions", getTeamSubmissions);

module.exports = router;

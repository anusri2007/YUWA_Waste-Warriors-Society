const express = require("express");
const {
  getCoordinatorDashboard,
  getCoordinatorTeams,
  getCoordinatorPending,
  getAdminDashboard
} = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

// Coordinator routes (own college only)
router.get("/college", roleMiddleware(ROLES.COORDINATOR), getCoordinatorDashboard);
router.get("/college/teams", roleMiddleware(ROLES.COORDINATOR), getCoordinatorTeams);
router.get("/college/pending", roleMiddleware(ROLES.COORDINATOR), getCoordinatorPending);

// Admin system-wide dashboard
router.get("/admin", roleMiddleware(ROLES.ADMIN), getAdminDashboard);

module.exports = router;

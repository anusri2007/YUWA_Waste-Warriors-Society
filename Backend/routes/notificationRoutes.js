const express = require("express");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  nudgeTeam
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

router.get("/my", getMyNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);

router.post("/nudge", roleMiddleware(ROLES.COORDINATOR, ROLES.ADMIN), nudgeTeam);

module.exports = router;

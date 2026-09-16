const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  updateUserRole,
  assignCollege
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { validateObjectId } = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

// All user management routes are Admin only
router.use(authMiddleware);
router.use(roleMiddleware(ROLES.ADMIN));

router.get("/", getUsers);
router.get("/:id", validateObjectId("id"), getUserById);
router.put("/:id", validateObjectId("id"), updateUser);
router.put("/:id/status", validateObjectId("id"), updateUserStatus);
router.put("/:id/role", validateObjectId("id"), updateUserRole);
router.put("/:id/assign-college", validateObjectId("id"), assignCollege);

module.exports = router;

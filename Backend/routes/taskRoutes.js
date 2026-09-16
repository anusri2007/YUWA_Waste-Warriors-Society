const express = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.get("/:id", getTaskById);

router.post("/", roleMiddleware(ROLES.ADMIN), createTask);
router.put("/:id", roleMiddleware(ROLES.ADMIN), updateTask);
router.delete("/:id", roleMiddleware(ROLES.ADMIN), deleteTask);

module.exports = router;

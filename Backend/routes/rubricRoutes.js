const express = require("express");
const {
  getRubricsByTask,
  createRubric,
  updateRubric,
  deleteRubric
} = require("../controllers/rubricController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

router.get("/task/:taskId", getRubricsByTask);
router.post("/", roleMiddleware(ROLES.ADMIN), createRubric);
router.put("/:id", roleMiddleware(ROLES.ADMIN), updateRubric);
router.delete("/:id", roleMiddleware(ROLES.ADMIN), deleteRubric);

module.exports = router;

const express = require("express");
const { getReport, exportReport } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(ROLES.ADMIN, ROLES.COORDINATOR));

router.get("/:competitionId/export", exportReport);
router.get("/:competitionId", getReport);

module.exports = router;

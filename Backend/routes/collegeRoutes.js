const express = require("express");
const {
  getColleges,
  createCollege,
  getCollegeById,
  updateCollege,
  deleteCollege,
  getMyCollege
} = require("../controllers/collegeController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

// Coordinator's own college
router.get("/my", getMyCollege);

// College list & detail (accessible to authenticated users)
router.get("/", getColleges);
router.get("/:id", getCollegeById);

// Admin-only operations
router.post("/", roleMiddleware(ROLES.ADMIN), createCollege);
router.put("/:id", roleMiddleware(ROLES.ADMIN), updateCollege);
router.delete("/:id", roleMiddleware(ROLES.ADMIN), deleteCollege);

module.exports = router;

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

// Import all route modules
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const competitionRoutes = require("./routes/competitionRoutes");
const taskRoutes = require("./routes/taskRoutes");
const rubricRoutes = require("./routes/rubricRoutes");
const teamRoutes = require("./routes/teamRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const calibrationRoutes = require("./routes/calibrationRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const impactRoutes = require("./routes/impactRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const communityRoutes = require("./routes/communityRoutes");
const reportRoutes = require("./routes/reportRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const aiEvaluationRoutes = require("./routes/aiEvaluationRoutes");

const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static evidence uploads if local storage adapter is active
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Connect to Database
connectDB();

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "YUWA Backend is running"
  });
});

// Mount All API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/rubrics", rubricRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/ai-evaluations", aiEvaluationRoutes);
app.use("/api/calibration", calibrationRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/audit-logs", auditLogRoutes);

// Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`YUWA Ecolympics Backend running on port ${PORT}`);
  });
}

module.exports = app;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Submission = require("../models/Submission");
const Task = require("../models/Task");
const Rubric = require("../models/Rubric");
const EvaluationAssignment = require("../models/EvaluationAssignment");
const Evaluation = require("../models/Evaluation");
const Team = require("../models/Team");
const { SUBMISSION_STATUS, ROLES } = require("../utils/constants");

async function getReadyTestData() {
  await mongoose.connect(process.env.MONGO_URI);

  // Find or setup an Evaluator
  let evaluator = await User.findOne({ role: ROLES.EVALUATOR, status: "ACTIVE" });
  if (!evaluator) {
    evaluator = await User.findOne({ role: ROLES.ADMIN, status: "ACTIVE" });
  }

  // Find or setup a submitted submission
  let submission = await Submission.findOne({
    status: { $in: [SUBMISSION_STATUS.SUBMITTED, SUBMISSION_STATUS.UNDER_REVIEW] }
  }).populate("taskId").populate("teamId");

  // If none exists, find any task, rubric, and team to create a ready-to-evaluate submission
  if (!submission) {
    const task = await Task.findOne();
    const team = await Team.findOne();
    const student = await User.findOne({ role: ROLES.STUDENT });

    submission = await Submission.create({
      teamId: team._id,
      competitionId: team.competitionId,
      taskId: task._id,
      submittedBy: student ? student._id : evaluator._id,
      status: SUBMISSION_STATUS.SUBMITTED,
      reflection: "We gathered 35 kg of recyclable plastic across campus during the weekend drive.",
      impactData: { wasteRecoveredKg: 35, studentHours: 6, awarenessCount: 40 },
      evidence: [
        {
          type: "PHOTO",
          url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5",
          caption: "Segregated plastic collection drive"
        }
      ],
      submittedAt: new Date()
    });
    submission = await Submission.findById(submission._id).populate("taskId").populate("teamId");
  }

  // Ensure evaluator is assigned to this submission
  let assignment = await EvaluationAssignment.findOne({
    submissionId: submission._id,
    evaluatorId: evaluator._id
  });

  if (!assignment) {
    assignment = await EvaluationAssignment.create({
      submissionId: submission._id,
      evaluatorId: evaluator._id,
      assignedBy: evaluator._id,
      status: "ASSIGNED"
    });
  }

  // Fetch active rubric for task
  const rubric = await Rubric.findOne({ taskId: submission.taskId._id, active: true });

  // Generate valid JWT token for evaluator
  const token = jwt.sign(
    { userId: evaluator._id.toString(), role: evaluator.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  console.log("=================================================");
  console.log("READY-TO-USE TEST CREDENTIALS & IDS");
  console.log("=================================================");
  console.log(`Evaluator Email:    ${evaluator.email}`);
  console.log(`Evaluator Role:     ${evaluator.role}`);
  console.log(`Evaluator ID:       ${evaluator._id}`);
  console.log(`Submission ID:      ${submission._id}`);
  console.log(`Task Title:         ${submission.taskId.title}`);
  console.log(`Task ID:            ${submission.taskId._id}`);
  console.log(`Rubric ID:          ${rubric ? rubric._id : "N/A"}`);
  if (rubric && rubric.criteria) {
    console.log("Rubric Criteria:");
    rubric.criteria.forEach((c, idx) => {
      console.log(`  [${idx + 1}] ID: ${c._id} | Name: "${c.name}" | Max: ${c.maxPoints}`);
    });
  }
  console.log("\nJWT Token for Header (Authorization: Bearer <TOKEN>):");
  console.log(token);
  console.log("=================================================");

  await mongoose.disconnect();
}

getReadyTestData().catch((err) => {
  console.error(err);
  process.exit(1);
});

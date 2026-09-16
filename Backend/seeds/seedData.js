const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const College = require("../models/College");
const Competition = require("../models/Competition");
const Task = require("../models/Task");
const Rubric = require("../models/Rubric");
const Team = require("../models/Team");
const Counter = require("../models/Counter");
const {
  ROLES,
  USER_STATUS,
  COMPETITION_STATUS,
  TASK_TYPES,
  TASK_STATUS
} = require("../utils/constants");

const seedDatabase = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log("Connected to MongoDB Atlas.");

    // Clean existing test collections
    console.log("Cleaning existing seed records...");
    await Promise.all([
      User.deleteMany({ email: /@yuwa-ecolympics\.org$/ }),
      College.deleteMany({ collegeId: { $regex: /^COL-/ } }),
      Competition.deleteMany({ name: /Ecolympics/ }),
      Task.deleteMany({}),
      Rubric.deleteMany({}),
      Team.deleteMany({}),
      Counter.deleteMany({ _id: { $in: ["college", "team"] } })
    ]);

    const defaultPassword = await bcrypt.hash("Password123!", 10);

    // 1. Create College
    console.log("Seeding College...");
    const college = await College.create({
      collegeId: "COL-001",
      name: "St. Xavier's College of Environmental Studies",
      location: "Dehradun, Uttarakhand"
    });
    await Counter.create({ _id: "college", seq: 1 });

    // 2. Create Users (1 admin, 1 coordinator, 1 evaluator, 2 students)
    console.log("Seeding Users...");
    const admin = await User.create({
      name: "YUWA Admin",
      email: "admin@yuwa-ecolympics.org",
      password: defaultPassword,
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE
    });

    const coordinator = await User.create({
      name: "Prof. Rajesh Sharma",
      email: "coordinator@yuwa-ecolympics.org",
      password: defaultPassword,
      role: ROLES.COORDINATOR,
      status: USER_STATUS.ACTIVE,
      collegeId: college._id,
      phoneNumber: "+919876543210"
    });

    const evaluator = await User.create({
      name: "Dr. Ananya Verma",
      email: "evaluator@yuwa-ecolympics.org",
      password: defaultPassword,
      role: ROLES.EVALUATOR,
      status: USER_STATUS.ACTIVE
    });

    const student1 = await User.create({
      name: "Aarav Patel",
      email: "aarav.student@yuwa-ecolympics.org",
      password: defaultPassword,
      role: ROLES.STUDENT,
      status: USER_STATUS.ACTIVE,
      collegeId: college._id,
      phoneNumber: "+919123456780"
    });

    const student2 = await User.create({
      name: "Diya Sengupta",
      email: "diya.student@yuwa-ecolympics.org",
      password: defaultPassword,
      role: ROLES.STUDENT,
      status: USER_STATUS.ACTIVE,
      collegeId: college._id,
      phoneNumber: "+919123456781"
    });

    // 3. Create Competition
    console.log("Seeding Competition...");
    const competition = await Competition.create({
      name: "Ecolympics 2026 Season 1",
      year: 2026,
      description: "Inter-college climate-action and sustainability championship organized by YUWA.",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-10-31"),
      status: COMPETITION_STATUS.ACTIVE,
      createdBy: admin._id
    });

    // 4. Create Tasks
    console.log("Seeding Tasks...");
    const task1 = await Task.create({
      competitionId: competition._id,
      title: "Campus Plastic & Dry Waste Recovery Drive",
      description: "Mobilize student volunteers to recover and segregate plastic, paper, and dry waste across college campus grounds and surrounding waterbodies.",
      taskType: TASK_TYPES.CLEANUP,
      instructions: "1. Take high-resolution before-and-after photos. 2. Weigh all collected waste in kg. 3. Document segregation categories. 4. Write team reflection.",
      deadline: new Date("2026-08-30"),
      maxPoints: 100,
      status: TASK_STATUS.ACTIVE,
      requiredEvidence: {
        photo: true,
        video: false,
        reflection: true,
        wasteWeightKg: true
      },
      impactMetrics: {
        wasteRecoveredKg: true,
        studentHours: true,
        awarenessCount: true,
        climateActionCount: true
      },
      createdBy: admin._id
    });

    const task2 = await Task.create({
      competitionId: competition._id,
      title: "Community Climate Action Street Play (Nukkad Natak)",
      description: "Perform an engaging street play in public markets or residential zones to raise awareness on circular economy and source segregation.",
      taskType: TASK_TYPES.STREET_PLAY,
      instructions: "1. Perform in a high-footfall area. 2. Record video highlights. 3. Estimate crowd reach. 4. Reflect on audience responses.",
      deadline: new Date("2026-09-15"),
      maxPoints: 100,
      status: TASK_STATUS.ACTIVE,
      requiredEvidence: {
        photo: true,
        video: true,
        reflection: true,
        wasteWeightKg: false
      },
      impactMetrics: {
        wasteRecoveredKg: false,
        studentHours: true,
        awarenessCount: true,
        climateActionCount: true
      },
      createdBy: admin._id
    });

    // 5. Create Rubrics for Tasks
    console.log("Seeding Rubrics...");
    await Rubric.create({
      taskId: task1._id,
      criteria: [
        {
          name: "Waste Recovery Quantity & Proper Segregation",
          description: "Accuracy in sorting plastic, paper, glass, and verified weight metrics.",
          maxPoints: 40
        },
        {
          name: "Volunteer Mobilization & Safety",
          description: "Student participation hours, protective gear, and organized coordination.",
          maxPoints: 30
        },
        {
          name: "Evidence Completeness & Reflection",
          description: "High quality photographic evidence and depth of learning in team reflection.",
          maxPoints: 30
        }
      ],
      totalPoints: 100,
      version: 1,
      active: true,
      createdBy: admin._id
    });

    await Rubric.create({
      taskId: task2._id,
      criteria: [
        {
          name: "Script Quality & Ecological Messaging",
          description: "Clarity and impact of sustainability message on source segregation.",
          maxPoints: 40
        },
        {
          name: "Audience Engagement & Community Reach",
          description: "Audience interaction, crowd size, and Q&A engagement.",
          maxPoints: 35
        },
        {
          name: "Execution & Video Documentation",
          description: "Vocal projection, energy, teamwork, and recorded video quality.",
          maxPoints: 25
        }
      ],
      totalPoints: 100,
      version: 1,
      active: true,
      createdBy: admin._id
    });

    // 6. Create Team
    console.log("Seeding Team...");
    const team = await Team.create({
      teamId: "TEAM-001",
      teamName: "EcoWarriors Green League",
      competitionId: competition._id,
      collegeId: college._id,
      coordinatorId: coordinator._id,
      members: [student1._id, student2._id],
      status: "ACTIVE"
    });
    await Counter.create({ _id: "team", seq: 1 });

    console.log("\n========================================================");
    console.log("SEEDING COMPLETED SUCCESSFULLY!");
    console.log("========================================================");
    console.log("Credentials (Password for all accounts: Password123!):");
    console.log(`- Admin:       ${admin.email}`);
    console.log(`- Coordinator: ${coordinator.email} (College: ${college.name})`);
    console.log(`- Evaluator:   ${evaluator.email}`);
    console.log(`- Student 1:   ${student1.email} (Team: ${team.teamName})`);
    console.log(`- Student 2:   ${student2.email} (Team: ${team.teamName})`);
    console.log(`- College:     ${college.name} (${college.collegeId})`);
    console.log(`- Competition: ${competition.name} (${competition.year})`);
    console.log(`- Tasks:       1. ${task1.title}, 2. ${task2.title}`);
    console.log("========================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error.message);
    process.exit(1);
  }
};

seedDatabase();

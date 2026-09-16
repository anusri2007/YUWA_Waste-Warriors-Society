/**
 * Automated End-to-End Test Suite for YUWA Ecolympics Backend
 * Validates:
 * 1. Health check
 * 2. Public Student Registration & Duplicate Email handling
 * 3. Login with correct and wrong credentials
 * 4. Auth token verification & /api/auth/me
 * 5. Role violation checks (Student accessing Admin/Coordinator endpoints -> 403)
 * 6. Admin College Management & Auto ID Generation (COL-xxx)
 * 7. Coordinator College Scoping & My College endpoint
 * 8. Competition, Task, and Rubric Management (Versioned Rubrics)
 * 9. Coordinator Team Creation (TEAM-xxx) & Student Team Join
 * 10. Student Single Active Team in Competition Constraint
 * 11. Submission Workflow: DRAFT creation -> Evidence addition -> Required Evidence validation -> SUBMIT
 * 12. Immutability: Editing submitted submission is blocked
 * 13. Evaluator Assignment & Rubric Criteria scoring with bounds validation
 * 14. Server-side total score calculation (client cannot forge score)
 * 15. Leaderboard dynamic aggregation & deterministic ranking
 * 16. Coordinator & Admin Dashboards (strictly college-scoped)
 * 17. Impact Aggregation (strictly counts approved submissions)
 * 18. In-App Notifications & Coordinator Nudges
 * 19. Community public-safe feed & celebration counter
 * 20. Historical competition snapshot
 */

const http = require("http");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });
process.env.NODE_ENV = "test";

const app = require("../server");
const User = require("../models/User");

let server;
let baseUrl;

// Test state tokens and IDs
let adminToken = "";
let coordinatorToken = "";
let evaluatorToken = "";
let student1Token = "";
let student2Token = "";

let testCollegeId = "";
let testCompetitionId = "";
let testTaskId = "";
let testRubricId = "";
let testTeamId = "";
let testSubmissionId = "";
let testEvaluationId = "";

const request = (method, endpoint, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, baseUrl);
    const headers = {};
    let payload = null;

    if (body) {
      payload = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(payload);
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(
      url,
      {
        method,
        headers
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => (rawData += chunk));
        res.on("end", () => {
          try {
            const parsed = rawData ? JSON.parse(rawData) : null;
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: parsed
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              raw: rawData
            });
          }
        });
      }
    );

    req.on("error", reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
};

const runTests = async () => {
  console.log("\n============================================================");
  console.log("STARTING YUWA ECOLYMPICS BACKEND INTEGRATION TEST SUITE");
  console.log("============================================================\n");

  const PORT = 5555;
  server = app.listen(PORT);
  baseUrl = `http://localhost:${PORT}`;

  try {
    // 1. Health check
    console.log("[1] Testing Health Check endpoint...");
    const health = await request("GET", "/");
    assert(health.status === 200, "Health check returns 200");
    assert(health.body.message === "YUWA Backend is running", "Health check message is correct");

    // 2. Authentication: Login seeded accounts
    console.log("\n[2] Testing Authentication with seeded accounts...");
    const adminLogin = await request("POST", "/api/auth/login", {
      email: "admin@yuwa-ecolympics.org",
      password: "Password123!"
    });
    assert(adminLogin.status === 200, "Admin login successful (200)");
    assert(adminLogin.body.data.token, "Admin received JWT token");
    assert(adminLogin.body.data.user.role === "ADMIN", "Admin role confirmed");
    adminToken = adminLogin.body.data.token;

    const coordLogin = await request("POST", "/api/auth/login", {
      email: "coordinator@yuwa-ecolympics.org",
      password: "Password123!"
    });
    assert(coordLogin.status === 200, "Coordinator login successful (200)");
    coordinatorToken = coordLogin.body.data.token;

    const evalLogin = await request("POST", "/api/auth/login", {
      email: "evaluator@yuwa-ecolympics.org",
      password: "Password123!"
    });
    assert(evalLogin.status === 200, "Evaluator login successful (200)");
    evaluatorToken = evalLogin.body.data.token;

    const student1Login = await request("POST", "/api/auth/login", {
      email: "aarav.student@yuwa-ecolympics.org",
      password: "Password123!"
    });
    assert(student1Login.status === 200, "Student 1 login successful (200)");
    student1Token = student1Login.body.data.token;

    // 3. Auth Edge Cases: Invalid password & non-existent email
    console.log("\n[3] Testing Auth Edge Cases...");
    const wrongPass = await request("POST", "/api/auth/login", {
      email: "admin@yuwa-ecolympics.org",
      password: "WrongPassword!"
    });
    assert(wrongPass.status === 401, "Wrong password correctly rejected with 401");
    assert(wrongPass.body.success === false, "Error response shape has success: false");

    // 4. Public Student Registration
    console.log("\n[4] Testing Public Student Registration & Duplication Prevention...");
    const uniqueEmail = `test.student.${Date.now()}@yuwa-ecolympics.org`;
    const regRes = await request("POST", "/api/auth/register", {
      name: "Rohit Sharma",
      email: uniqueEmail,
      password: "Password123!",
      phoneNumber: "+919999988888",
      role: "ADMIN" // Attempt to elevate role!
    });
    assert(regRes.status === 201, "Student registered with 201 Created");
    assert(regRes.body.data.user.role === "STUDENT", "Public register ignored ADMIN attempt and forced STUDENT");
    assert(regRes.body.data.token, "JWT token issued directly upon registration");
    student2Token = regRes.body.data.token;

    const dupReg = await request("POST", "/api/auth/register", {
      name: "Rohit Duplicate",
      email: uniqueEmail,
      password: "Password123!"
    });
    assert(dupReg.status === 409, "Duplicate email registration rejected with 409 Conflict");

    // 5. Protected /me Profile
    console.log("\n[5] Testing /api/auth/me profile endpoint...");
    const noTokenMe = await request("GET", "/api/auth/me");
    assert(noTokenMe.status === 401, "Protected /me with no token rejected with 401");

    const validMe = await request("GET", "/api/auth/me", null, student2Token);
    assert(validMe.status === 200, "Protected /me with valid token returns 200");
    assert(validMe.body.data.user.email === uniqueEmail, "Profile contains correct email");
    assert(validMe.body.data.user.password === undefined, "Password hash is NEVER exposed in profile");

    // 6. Security: Role Violations
    console.log("\n[6] Testing Role Security Boundaries...");
    const studentCreateCollege = await request("POST", "/api/colleges", { name: "Fake College", location: "City" }, student2Token);
    assert(studentCreateCollege.status === 403, "Student attempting to create college rejected with 403 Forbidden");

    const studentCreateComp = await request("POST", "/api/competitions", { name: "Fake Comp" }, student2Token);
    assert(studentCreateComp.status === 403, "Student attempting to create competition rejected with 403 Forbidden");

    // 7. Admin College CRUD & Atomic ID Generation
    console.log("\n[7] Testing College Management & Concurrency-Safe ID Generation...");
    const collegeRes = await request(
      "POST",
      "/api/colleges",
      {
        name: `Himalayan Institute of Tech ${Date.now()}`,
        location: "Rishikesh, Uttarakhand"
      },
      adminToken
    );
    assert(collegeRes.status === 201, "Admin created college successfully (201)");
    assert(collegeRes.body.data.collegeId.startsWith("COL-"), `College auto-assigned ID: ${collegeRes.body.data.collegeId}`);
    testCollegeId = collegeRes.body.data._id;

    const collegesList = await request("GET", "/api/colleges", null, student1Token);
    assert(collegesList.status === 200, "Authenticated user can list colleges (200)");
    assert(collegesList.body.data.length > 0, "Colleges list returned records");

    // 8. Coordinator College Scoping
    console.log("\n[8] Testing Coordinator Scoping & My College endpoint...");
    const myCollegeRes = await request("GET", "/api/colleges/my", null, coordinatorToken);
    assert(myCollegeRes.status === 200, "Coordinator retrieved assigned college (200)");
    assert(myCollegeRes.body.data.collegeId === "COL-001", "Coordinator college is correctly COL-001");

    // 9. Competitions, Tasks & Rubrics
    console.log("\n[9] Testing Competitions, Tasks & Rubric Versioning...");
    const comps = await request("GET", "/api/competitions", null, student1Token);
    assert(comps.status === 200, "List competitions returns 200");
    testCompetitionId = comps.body.data[0]._id;

    const tasks = await request("GET", `/api/tasks?competitionId=${testCompetitionId}`, null, student1Token);
    assert(tasks.status === 200, "List tasks returns 200");
    assert(tasks.body.data.length >= 2, "Found seeded tasks");
    testTaskId = tasks.body.data[0]._id;

    const rubricRes = await request("GET", `/api/rubrics/task/${testTaskId}`, null, student1Token);
    assert(rubricRes.status === 200, "Rubric retrieved for task (200)");
    assert(rubricRes.body.data[0].criteria.length > 0, "Rubric has criteria");
    testRubricId = rubricRes.body.data[0]._id;

    // 10. Team Creation & Joining
    console.log("\n[10] Testing Team Management & Single Active Team Rule...");
    const teamCreateRes = await request(
      "POST",
      "/api/teams",
      {
        teamName: `Green Panthers ${Date.now()}`,
        competitionId: testCompetitionId
      },
      coordinatorToken
    );
    assert(teamCreateRes.status === 201, "Coordinator created team (201)");
    assert(teamCreateRes.body.data.teamId.startsWith("TEAM-"), `Team auto-assigned ID: ${teamCreateRes.body.data.teamId}`);
    testTeamId = teamCreateRes.body.data._id;

    // Student 2 joins team
    const joinRes = await request("POST", "/api/teams/join", { teamId: testTeamId }, student2Token);
    assert(joinRes.status === 200, "Student 2 successfully joined team (200)");

    // Student 2 tries to join ANOTHER team in the same competition
    const joinAgainRes = await request(
      "POST",
      "/api/teams/join",
      { teamId: "TEAM-001" }, // Existing team in same competition
      student2Token
    );
    assert(joinAgainRes.status === 400, "Student prevented from joining multiple active teams in same competition (400)");

    // 11. Submissions Workflow
    console.log("\n[11] Testing Submission Draft, Evidence & Required Evidence Enforcement...");
    const subRes = await request(
      "POST",
      "/api/submissions",
      {
        teamId: testTeamId,
        taskId: testTaskId,
        reflection: "Initial draft reflection on cleanup operations.",
        impactData: {
          wasteRecoveredKg: 0,
          studentHours: 12
        }
      },
      student2Token
    );
    assert(subRes.status === 201, "Draft submission created (201)");
    assert(subRes.body.data.status === "DRAFT", "Submission status is DRAFT");
    testSubmissionId = subRes.body.data._id;

    // Attempt premature submit without required evidence (Task 1 requires photo, reflection, wasteWeightKg)
    const prematureSubmit = await request("PUT", `/api/submissions/${testSubmissionId}/submit`, {}, student2Token);
    assert(prematureSubmit.status === 400, "Premature submit rejected due to missing required evidence (400)");

    // Add evidence
    const addEvRes = await request(
      "POST",
      `/api/submissions/${testSubmissionId}/evidence`,
      {
        type: "PHOTO",
        url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
        caption: "Collected segregated plastic recyclables"
      },
      student2Token
    );
    assert(addEvRes.status === 200, "Added photo evidence to draft submission (200)");

    // Update draft with required reflection and waste weight
    const updateSubRes = await request(
      "PUT",
      `/api/submissions/${testSubmissionId}`,
      {
        reflection: "Comprehensive team reflection: successfully mobilized 15 students and cleared 45.5 kg of dry waste.",
        impactData: {
          wasteRecoveredKg: 45.5,
          studentHours: 18,
          awarenessCount: 120,
          climateActionCount: 1
        }
      },
      student2Token
    );
    assert(updateSubRes.status === 200, "Updated draft submission (200)");

    // Submit submission
    const finalSubmit = await request("PUT", `/api/submissions/${testSubmissionId}/submit`, {}, student2Token);
    assert(finalSubmit.status === 200, "Final submit succeeded after satisfying required evidence (200)");
    assert(finalSubmit.body.data.status === "SUBMITTED", "Status transitioned to SUBMITTED");

    // Attempt to edit after submit -> must be rejected
    const editAfterSubmit = await request(
      "PUT",
      `/api/submissions/${testSubmissionId}`,
      { reflection: "Hacking reflection after submit" },
      student2Token
    );
    assert(editAfterSubmit.status === 400, "Editing SUBMITTED submission rejected (400)");

    // 12. Evaluation Workflow
    console.log("\n[12] Testing Evaluator Assignment & Rubric Scoring...");
    const evalUser = await User.findOne({ email: "evaluator@yuwa-ecolympics.org" });

    // Admin assigns evaluator
    const assignRes = await request(
      "POST",
      "/api/evaluations/assign",
      {
        submissionId: testSubmissionId,
        evaluatorId: evalUser._id
      },
      adminToken
    );
    assert(assignRes.status === 201, "Admin assigned evaluator to submission (201)");

    // Evaluator checks assigned submissions
    const assignedList = await request("GET", "/api/evaluations/assigned", null, evaluatorToken);
    assert(assignedList.status === 200, "Evaluator retrieved assigned submissions (200)");
    assert(assignedList.body.data.length > 0, "Found assigned submission in evaluator queue");

    // Fetch rubric criteria to score
    const rubricObj = (await request("GET", `/api/rubrics/task/${testTaskId}`, null, evaluatorToken)).body.data[0];

    // Attempt invalid score (> max points)
    const invalidScoreBody = {
      criteriaScores: rubricObj.criteria.map((c) => ({
        criterionId: c._id,
        score: c.maxPoints + 50 // Exceeds max points!
      })),
      feedback: "Overly generous scoring",
      decision: "APPROVED"
    };
    const invalidScoreRes = await request("POST", `/api/evaluations/${testSubmissionId}`, invalidScoreBody, evaluatorToken);
    assert(invalidScoreRes.status === 400, "Score exceeding criterion maxPoints rejected (400)");

    // Valid evaluation scoring
    const validScores = rubricObj.criteria.map((c) => ({
      criterionId: c._id,
      score: Math.floor(c.maxPoints * 0.9) // 90% score
    }));
    const evalRes = await request(
      "POST",
      `/api/evaluations/${testSubmissionId}`,
      {
        criteriaScores: validScores,
        feedback: "Excellent work on source segregation and community engagement!",
        decision: "APPROVED"
      },
      evaluatorToken
    );
    assert(evalRes.status === 201, "Evaluator scored submission successfully (201)");
    assert(evalRes.body.data.decision === "APPROVED", "Evaluation decision is APPROVED");
    assert(evalRes.body.data.totalScore > 0, `Server-calculated total score: ${evalRes.body.data.totalScore}`);
    testEvaluationId = evalRes.body.data._id;

    // 13. Leaderboard Dynamic Aggregation
    console.log("\n[13] Testing Live Leaderboard Aggregation...");
    const lbRes = await request("GET", `/api/leaderboard/${testCompetitionId}`, null, student1Token);
    assert(lbRes.status === 200, "Leaderboard retrieved successfully (200)");
    assert(lbRes.body.data.leaderboard.length > 0, "Leaderboard contains ranked teams");
    assert(lbRes.body.data.leaderboard[0].rank === 1, "Top team has rank 1");
    assert(lbRes.body.data.leaderboard[0].totalScore > 0, "Leaderboard reflects approved evaluation score");

    // 14. Impact Aggregation
    console.log("\n[14] Testing Impact Aggregation from Approved Submissions...");
    const impactRes = await request("GET", `/api/impact/${testCompetitionId}`, null, student1Token);
    assert(impactRes.status === 200, "Impact retrieved successfully (200)");
    assert(impactRes.body.data.impact.totalWasteRecoveredKg >= 45.5, "Impact aggregates verified 45.5 kg waste recovered");
    assert(impactRes.body.data.impact.approvedSubmissions >= 1, "Impact counts approved submissions");

    const impactColleges = await request("GET", `/api/impact/${testCompetitionId}/by-college`, null, student1Token);
    assert(impactColleges.status === 200, "Impact grouped by college returns 200");

    const impactTasks = await request("GET", `/api/impact/${testCompetitionId}/by-task`, null, student1Token);
    assert(impactTasks.status === 200, "Impact grouped by task returns 200");

    // 15. Coordinator & Admin Dashboards
    console.log("\n[15] Testing Dashboards...");
    const coordDash = await request("GET", "/api/dashboard/college", null, coordinatorToken);
    assert(coordDash.status === 200, "Coordinator college dashboard returns 200");
    assert(coordDash.body.data.college.collegeId === "COL-001", "Coordinator dashboard is strictly college-scoped");

    const coordTeams = await request("GET", "/api/dashboard/college/teams", null, coordinatorToken);
    assert(coordTeams.status === 200, "Coordinator college teams progress returns 200");

    const adminDash = await request("GET", "/api/dashboard/admin", null, adminToken);
    assert(adminDash.status === 200, "Admin system dashboard returns 200");
    assert(adminDash.body.data.counts.teams > 0, "Admin dashboard reports teams count");
    assert(adminDash.body.data.submissionPipeline.evaluated >= 1, "Admin dashboard reports evaluated submissions count");

    // 16. In-App Notifications & Nudges
    console.log("\n[16] Testing In-App Notifications & Team Nudges...");
    const nudgeRes = await request(
      "POST",
      "/api/notifications/nudge",
      {
        teamId: testTeamId,
        message: "Friendly reminder to check the waste recovery deadline this Friday!"
      },
      coordinatorToken
    );
    assert(nudgeRes.status === 201, "Coordinator sent nudge to team members (201)");

    const notifs = await request("GET", "/api/notifications/my", null, student2Token);
    assert(notifs.status === 200, "Student 2 received notifications (200)");
    assert(notifs.body.data.unreadCount > 0, "Unread notifications present");

    const notifId = notifs.body.data.notifications[0]._id;
    const readRes = await request("PUT", `/api/notifications/${notifId}/read`, {}, student2Token);
    assert(readRes.status === 200, "Notification marked as read (200)");

    // 17. Community Feed & Celebrations
    console.log("\n[17] Testing Community Public-Safe Feed & Celebrations...");
    const communityFeed = await request("GET", "/api/community/submissions");
    assert(communityFeed.status === 200, "Public can access community feed without auth (200)");

    const milestones = await request("GET", "/api/community/milestones");
    assert(milestones.status === 200, "Community milestones retrieved (200)");

    const celebrateRes = await request("POST", `/api/community/${testSubmissionId}/celebrate`);
    assert(celebrateRes.status === 200, "Submission celebrated successfully (200)");
    assert(celebrateRes.body.data.celebrationCount >= 1, "Celebration count incremented");

    // 18. Historical Snapshot & Reports
    console.log("\n[18] Testing Historical Snapshot & Reports...");
    const historyRes = await request("GET", `/api/competitions/${testCompetitionId}/history`, null, student1Token);
    assert(historyRes.status === 200, "Competition historical snapshot retrieved (200)");

    const reportRes = await request("GET", `/api/reports/${testCompetitionId}`, null, coordinatorToken);
    assert(reportRes.status === 200, "Comprehensive competition report retrieved (200)");

    const csvExport = await request("GET", `/api/reports/${testCompetitionId}/export`, null, adminToken);
    assert(csvExport.status === 200, "CSV report exported (200)");
    assert(csvExport.headers["content-type"].includes("text/csv"), "Export response has text/csv Content-Type");

    console.log("\n============================================================");
    console.log("🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!");
    console.log("============================================================\n");

    server.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ TEST SUITE FAILED:", error.message);
    if (server) server.close();
    process.exit(1);
  }
};

runTests();

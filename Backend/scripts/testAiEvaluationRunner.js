/**
 * AI-Assisted Evaluation Test Suite for YUWA Ecolympics Backend
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

let adminToken = "";
let coordinatorToken = "";
let evaluatorToken = "";
let studentToken = "";

let testCollegeId = "";
let testCompetitionId = "";
let testTaskId = "";
let testRubricId = "";
let testCriterion1Id = "";
let testCriterion2Id = "";
let testTeamId = "";
let testSubmissionId = "";

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

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = { raw: data };
        }
        resolve({ status: res.statusCode, body: json });
      });
    });

    req.on("error", (err) => reject(err));

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

let passed = 0;
let failed = 0;

const assert = (condition, testName, details = "") => {
  if (condition) {
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${testName}`);
    passed++;
  } else {
    console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${testName} ${details ? `-> ${JSON.stringify(details)}` : ""}`);
    failed++;
  }
};

async function runAiEvaluationTests() {
  console.log("\n=======================================================");
  console.log("  STARTING AI-ASSISTED EVALUATION TEST SUITE");
  console.log("=======================================================\n");

  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  const timestamp = Date.now();

  try {
    // 1. Setup users (Admin, Coordinator, Evaluator, Student)
    const adminEmail = `ai_admin_${timestamp}@yuwa.org`;
    const coordEmail = `ai_coord_${timestamp}@yuwa.org`;
    const evalEmail = `ai_evaluator_${timestamp}@yuwa.org`;
    const studentEmail = `ai_student_${timestamp}@yuwa.org`;

    await request("POST", "/api/auth/register", {
      name: "AI Admin",
      email: adminEmail,
      password: "Password@123"
    });
    await User.findOneAndUpdate({ email: adminEmail }, { role: "ADMIN", status: "ACTIVE" });

    await request("POST", "/api/auth/register", {
      name: "AI Evaluator",
      email: evalEmail,
      password: "Password@123"
    });
    await User.findOneAndUpdate({ email: evalEmail }, { role: "EVALUATOR", status: "ACTIVE" });

    await request("POST", "/api/auth/register", {
      name: "AI Coordinator",
      email: coordEmail,
      password: "Password@123"
    });

    const studentReg = await request("POST", "/api/auth/register", {
      name: "AI Student",
      email: studentEmail,
      password: "Password@123"
    });
    studentToken = studentReg.body.data.token;

    const adminLogin = await request("POST", "/api/auth/login", { email: adminEmail, password: "Password@123" });
    adminToken = adminLogin.body.data.token;

    const evalLogin = await request("POST", "/api/auth/login", { email: evalEmail, password: "Password@123" });
    evaluatorToken = evalLogin.body.data.token;

    // 2. Create College, Competition, Task, Rubric
    const colRes = await request("POST", "/api/colleges", { name: `AI Test College ${timestamp}`, location: "Dehradun" }, adminToken);
    testCollegeId = colRes.body.data._id;

    // Assign coordinator to college
    await User.findOneAndUpdate({ email: coordEmail }, { role: "COORDINATOR", status: "ACTIVE", collegeId: testCollegeId });
    const coordLogin = await request("POST", "/api/auth/login", { email: coordEmail, password: "Password@123" });
    coordinatorToken = coordLogin.body.data.token;

    assert(adminToken && evaluatorToken && coordinatorToken && studentToken, "1. Users registered and authenticated");

    const compRes = await request("POST", "/api/competitions", {
      name: `AI Ecolympics ${timestamp}`,
      year: 2026,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 30),
      status: "ACTIVE"
    }, adminToken);
    testCompetitionId = compRes.body.data._id;

    const taskRes = await request("POST", "/api/tasks", {
      competitionId: testCompetitionId,
      title: "Campus Cleanliness & Plastic Audit",
      description: "Perform waste segregation and weigh collected recyclable plastics.",
      taskType: "CLEANUP",
      instructions: "Photograph collected waste and document reflection.",
      deadline: new Date(Date.now() + 86400000 * 7),
      maxPoints: 100,
      requiredEvidence: { photo: true, reflection: true, wasteWeightKg: true }
    }, adminToken);
    testTaskId = taskRes.body.data._id;

    const rubricRes = await request("POST", "/api/rubrics", {
      taskId: testTaskId,
      criteria: [
        { name: "Waste Quantification & Impact", description: "Weight and segregation accuracy", maxPoints: 50 },
        { name: "Documentation & Quality", description: "Clear photo evidence and reflection", maxPoints: 50 }
      ]
    }, adminToken);
    testRubricId = rubricRes.body.data._id;
    testCriterion1Id = rubricRes.body.data.criteria[0]._id;
    testCriterion2Id = rubricRes.body.data.criteria[1]._id;

    assert(testRubricId && testCriterion1Id && testCriterion2Id, "2. College, Competition, Task, and Rubric setup completed");

    // 3. Create Team as Coordinator & Student Joins Team
    const teamRes = await request("POST", "/api/teams", {
      teamName: `AI Eco Warriors ${timestamp}`,
      competitionId: testCompetitionId
    }, coordinatorToken);
    testTeamId = teamRes.body.data._id;

    // Join team as student
    const joinRes = await request("POST", "/api/teams/join", { teamId: testTeamId }, studentToken);
    assert(joinRes.status === 200, "3. Student joined team successfully");

    // Create a draft submission
    const draftRes = await request("POST", "/api/submissions", {
      teamId: testTeamId,
      taskId: testTaskId,
      reflection: "We gathered 35 kg of recyclable plastic across campus during the weekend drive.",
      impactData: { wasteRecoveredKg: 35, studentHours: 6, awarenessCount: 40 }
    }, studentToken);
    testSubmissionId = draftRes.body.data._id;

    // 4. Test error case: AI evaluation on DRAFT submission must fail (400)
    const draftAiRes = await request("POST", `/api/evaluations/${testSubmissionId}/ai-evaluate`, {}, adminToken);
    assert(draftAiRes.status === 400, "4. AI evaluation on DRAFT submission is blocked (400)");

    // Add evidence and finalize submission
    await request("POST", `/api/submissions/${testSubmissionId}/evidence`, {
      type: "PHOTO",
      url: "https://example.com/clean_campus.jpg",
      caption: "Segregated plastic collection"
    }, studentToken);

    const submitRes = await request("PUT", `/api/submissions/${testSubmissionId}/submit`, {}, studentToken);
    assert(submitRes.status === 200 && submitRes.body.data.status === "SUBMITTED", "5. Submission finalized with evidence and reflection");

    // 5. Assign Evaluator
    const evalUser = await User.findOne({ email: evalEmail });
    const assignRes = await request("POST", "/api/evaluations/assign", {
      submissionId: testSubmissionId,
      evaluatorId: evalUser._id.toString()
    }, adminToken);
    assert(assignRes.status === 201, "6. Evaluator assigned to submission");

    // 6. Test unauthorized access: Student cannot trigger AI evaluation (403)
    const studentAiRes = await request("POST", `/api/evaluations/${testSubmissionId}/ai-evaluate`, {}, studentToken);
    assert(studentAiRes.status === 403, "7. Student role blocked from triggering AI evaluation (403)");

    // 7. Trigger AI Evaluation as Evaluator
    const evalAiRes = await request("POST", `/api/evaluations/${testSubmissionId}/ai-evaluate`, {}, evaluatorToken);
    assert(
      evalAiRes.status === 200 &&
      evalAiRes.body.data &&
      typeof evalAiRes.body.data.suggestedScore === "number" &&
      evalAiRes.body.data.suggestedScore > 0 &&
      evalAiRes.body.data.suggestedScore <= 100 &&
      evalAiRes.body.data.criteria.length === 2 &&
      evalAiRes.body.data.confidence >= 0 &&
      evalAiRes.body.data.confidence <= 1 &&
      evalAiRes.body.data.reviewStatus === "PENDING_REVIEW",
      "8. AI Evaluation successfully triggered with structured suggestions, observations, and confidence",
      evalAiRes.body.data
    );

    // 8. Test dedicated /api/ai-evaluations/:submissionId endpoint alias
    const aliasAiRes = await request("GET", `/api/ai-evaluations/${testSubmissionId}`, null, evaluatorToken);
    assert(
      aliasAiRes.status === 200 &&
      aliasAiRes.body.data.aiSuggestedScore === evalAiRes.body.data.suggestedScore &&
      aliasAiRes.body.data.reviewStatus === "PENDING_REVIEW",
      "9. GET /api/ai-evaluations/:submissionId returns persisted AI evaluation"
    );

    const aiSuggestedScore = evalAiRes.body.data.suggestedScore;

    // 9. Human Evaluator reviews and modifies score (Human-in-the-loop)
    // Evaluator gives 45 on criterion 1 and 40 on criterion 2 -> Total = 85
    const humanScore1 = 45;
    const humanScore2 = 40;
    const humanTotalExpected = humanScore1 + humanScore2;

    const evalFinalRes = await request("POST", `/api/evaluations/${testSubmissionId}`, {
      criteriaScores: [
        { criterionId: testCriterion1Id, score: humanScore1 },
        { criterionId: testCriterion2Id, score: humanScore2 }
      ],
      feedback: "Great cleanup effort and verified weight. Excellent photo documentation.",
      decision: "APPROVED",
      reviewAction: "MODIFIED"
    }, evaluatorToken);

    assert(
      evalFinalRes.status === 201 &&
      evalFinalRes.body.data.totalScore === humanTotalExpected &&
      evalFinalRes.body.data.decision === "APPROVED",
      "10. Human evaluator successfully submitted final score"
    );

    const evaluationId = evalFinalRes.body.data._id;

    // 10. Verify that both AI recommendation and Human final score are preserved in DB
    const evalGetRes = await request("GET", `/api/evaluations/${evaluationId}`, null, evaluatorToken);
    assert(
      evalGetRes.status === 200 &&
      evalGetRes.body.data.totalScore === humanTotalExpected &&
      evalGetRes.body.data.aiSuggestedScore === aiSuggestedScore &&
      evalGetRes.body.data.reviewStatus === "MODIFIED",
      "11. Database preserves BOTH human finalScore and AI suggestedScore intact",
      {
        humanTotalScore: evalGetRes.body.data.totalScore,
        aiSuggestedScore: evalGetRes.body.data.aiSuggestedScore,
        reviewStatus: evalGetRes.body.data.reviewStatus
      }
    );

    // 11. Verify dynamic Leaderboard uses human totalScore
    const lbRes = await request("GET", `/api/leaderboard/${testCompetitionId}`, null, evaluatorToken);
    assert(
      lbRes.status === 200 &&
      lbRes.body.data?.leaderboard &&
      lbRes.body.data.leaderboard.length > 0 &&
      lbRes.body.data.leaderboard[0].totalScore === humanTotalExpected,
      "12. Dynamic leaderboard correctly uses human totalScore (85)",
      lbRes.body
    );

  } catch (error) {
    console.error("Test execution error:", error);
    failed++;
  } finally {
    if (server) server.close();
  }

  console.log("\n=======================================================");
  console.log(`  AI EVALUATION TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAiEvaluationTests();

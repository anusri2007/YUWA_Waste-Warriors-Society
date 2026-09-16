/**
 * Automated Test Suite for User Registration, Status, and Admin Approval Workflow
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
let testTeamId = "";
let testSubmissionId = "";

let registeredCoordinatorId = "";
let registeredEvaluatorId = "";
let registeredBlockedUserId = "";

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

async function runUserWorkflowTests() {
  console.log("\n=======================================================");
  console.log("  STARTING USER REGISTRATION & APPROVAL WORKFLOW TESTS");
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
    // 1. Seeded Admin Login
    const adminLogin = await request("POST", "/api/auth/login", {
      email: "admin@yuwa-ecolympics.org",
      password: "Password123!"
    });
    assert(
      adminLogin.status === 200 && adminLogin.body.data?.token && adminLogin.body.data?.user?.role === "ADMIN",
      "1. Seeded Admin can login successfully and receives JWT token"
    );
    adminToken = adminLogin.body.data.token;

    // Fetch existing seeded college & competition
    const colList = await request("GET", "/api/colleges", null, adminToken);
    testCollegeId = colList.body.data?.[0]?._id;

    const compList = await request("GET", "/api/competitions", null, adminToken);
    testCompetitionId = compList.body.data?.[0]?._id;

    // 2. Student Registration (Creates ACTIVE account + returns token immediately)
    const studentEmail = `student_${timestamp}@test.org`;
    const studentReg = await request("POST", "/api/auth/register", {
      name: "Test Student",
      email: studentEmail,
      password: "Password123!",
      role: "STUDENT",
      collegeId: testCollegeId
    });

    assert(
      studentReg.status === 201 &&
      studentReg.body.data?.user?.status === "ACTIVE" &&
      studentReg.body.data?.user?.role === "STUDENT" &&
      studentReg.body.data?.token,
      "2. Student registration creates ACTIVE account and returns JWT token immediately"
    );
    studentToken = studentReg.body.data.token;

    // 3. Student Login
    const studentLogin = await request("POST", "/api/auth/login", {
      email: studentEmail,
      password: "Password123!"
    });
    assert(studentLogin.status === 200 && studentLogin.body.data?.token, "3. Student can login successfully");

    // 4. Coordinator Registration (Creates PENDING account + NO token returned)
    const coordEmail = `coord_${timestamp}@test.org`;
    const coordReg = await request("POST", "/api/auth/register", {
      name: "Test Coordinator",
      email: coordEmail,
      password: "Password123!",
      role: "COORDINATOR",
      collegeId: testCollegeId,
      status: "ACTIVE" // Attempting to forge status must be ignored!
    });

    assert(
      coordReg.status === 201 &&
      coordReg.body.data?.user?.status === "PENDING" &&
      coordReg.body.data?.user?.role === "COORDINATOR" &&
      coordReg.body.data?.token === undefined &&
      coordReg.body.message.includes("pending admin approval"),
      "4. Coordinator registration creates PENDING account, ignores forged status, and issues NO token"
    );
    registeredCoordinatorId = coordReg.body.data.user.id;

    // 5. Pending Coordinator Login Attempt (Must be rejected with 403)
    const coordPendingLogin = await request("POST", "/api/auth/login", {
      email: coordEmail,
      password: "Password123!"
    });
    assert(
      coordPendingLogin.status === 403 &&
      coordPendingLogin.body.message === "Your account is pending admin approval.",
      "5. Pending Coordinator login is rejected with 403 (Account pending admin approval)"
    );

    // 6. Evaluator Registration (Creates PENDING account + NO token returned)
    const evalEmail = `eval_${timestamp}@test.org`;
    const evalReg = await request("POST", "/api/auth/register", {
      name: "Test Evaluator",
      email: evalEmail,
      password: "Password123!",
      role: "EVALUATOR"
    });

    assert(
      evalReg.status === 201 &&
      evalReg.body.data?.user?.status === "PENDING" &&
      evalReg.body.data?.user?.role === "EVALUATOR" &&
      evalReg.body.data?.token === undefined,
      "6. Evaluator registration creates PENDING account and issues NO token"
    );
    registeredEvaluatorId = evalReg.body.data.user.id;

    // 7. Pending Evaluator Login Attempt (Must be rejected with 403)
    const evalPendingLogin = await request("POST", "/api/auth/login", {
      email: evalEmail,
      password: "Password123!"
    });
    assert(
      evalPendingLogin.status === 403 &&
      evalPendingLogin.body.message === "Your account is pending admin approval.",
      "7. Pending Evaluator login is rejected with 403 (Account pending admin approval)"
    );

    // 8. Public Signup cannot register as ADMIN (Must be rejected with 403)
    const fakeAdminReg = await request("POST", "/api/auth/register", {
      name: "Fake Admin",
      email: `fake_admin_${timestamp}@test.org`,
      password: "Password123!",
      role: "ADMIN"
    });
    assert(
      fakeAdminReg.status === 403 &&
      fakeAdminReg.body.message === "Admin registration is not allowed.",
      "8. Public signup with role: ADMIN is strictly rejected with 403 Forbidden"
    );

    // 9. Admin Retrieves Pending Requests
    const pendingRes = await request("GET", "/api/users/pending", null, adminToken);
    assert(
      pendingRes.status === 200 &&
      Array.isArray(pendingRes.body.data) &&
      pendingRes.body.data.some((u) => u._id === registeredCoordinatorId) &&
      pendingRes.body.data.some((u) => u._id === registeredEvaluatorId),
      "9. Admin can list all pending user requests via GET /api/users/pending"
    );

    // 10. Filter Pending Requests by role
    const pendingEvalRes = await request("GET", "/api/users/pending?role=EVALUATOR", null, adminToken);
    assert(
      pendingEvalRes.status === 200 &&
      pendingEvalRes.body.data.every((u) => u.role === "EVALUATOR"),
      "10. Admin can filter pending requests by role (?role=EVALUATOR)"
    );

    // 11. Security Boundary: Non-Admin cannot access /api/users/pending or approve users
    const studentPendingAccess = await request("GET", "/api/users/pending", null, studentToken);
    assert(studentPendingAccess.status === 403, "11. Non-admin (Student) cannot view pending requests (403 Forbidden)");

    const studentApproveAttempt = await request("PUT", `/api/users/${registeredCoordinatorId}/status`, { status: "ACTIVE" }, studentToken);
    assert(studentApproveAttempt.status === 403, "12. Non-admin (Student) cannot approve users (403 Forbidden)");

    // 12. Admin Approves Coordinator
    const approveCoord = await request("PUT", `/api/users/${registeredCoordinatorId}/status`, { status: "ACTIVE" }, adminToken);
    assert(
      approveCoord.status === 200 && approveCoord.body.data?.status === "ACTIVE",
      "13. Admin approves Coordinator successfully (status -> ACTIVE)"
    );

    // 13. Approved Coordinator Login & Functionality
    const coordApprovedLogin = await request("POST", "/api/auth/login", {
      email: coordEmail,
      password: "Password123!"
    });
    assert(
      coordApprovedLogin.status === 200 && coordApprovedLogin.body.data?.token,
      "14. Approved Coordinator can now login successfully"
    );
    coordinatorToken = coordApprovedLogin.body.data.token;

    // Coordinator creates a Team
    const teamRes = await request("POST", "/api/teams", {
      teamName: `Green Warriors ${timestamp}`,
      competitionId: testCompetitionId
    }, coordinatorToken);
    assert(teamRes.status === 201 && teamRes.body.data?._id, "15. Approved Coordinator can create team");
    testTeamId = teamRes.body.data._id;

    // 14. Admin Approves Evaluator
    const approveEval = await request("PUT", `/api/users/${registeredEvaluatorId}/status`, { status: "ACTIVE" }, adminToken);
    assert(
      approveEval.status === 200 && approveEval.body.data?.status === "ACTIVE",
      "16. Admin approves Evaluator successfully (status -> ACTIVE)"
    );

    // 15. Approved Evaluator Login
    const evalApprovedLogin = await request("POST", "/api/auth/login", {
      email: evalEmail,
      password: "Password123!"
    });
    assert(
      evalApprovedLogin.status === 200 && evalApprovedLogin.body.data?.token,
      "17. Approved Evaluator can now login successfully"
    );
    evaluatorToken = evalApprovedLogin.body.data.token;

    // 16. Admin Rejects / Blocks an Account
    const blockEmail = `blocked_${timestamp}@test.org`;
    const blockReg = await request("POST", "/api/auth/register", {
      name: "Spam User",
      email: blockEmail,
      password: "Password123!",
      role: "COORDINATOR",
      collegeId: testCollegeId
    });
    registeredBlockedUserId = blockReg.body.data.user.id;

    const blockRes = await request("PUT", `/api/users/${registeredBlockedUserId}/status`, { status: "BLOCKED" }, adminToken);
    assert(
      blockRes.status === 200 && blockRes.body.data?.status === "BLOCKED",
      "18. Admin can reject/block an account (status -> BLOCKED)"
    );

    const blockedLogin = await request("POST", "/api/auth/login", {
      email: blockEmail,
      password: "Password123!"
    });
    assert(
      blockedLogin.status === 403 && blockedLogin.body.message.includes("blocked"),
      "19. Blocked user login is rejected with 403 Forbidden"
    );

    // 17. Admin Self-Demotion / Self-Blocking Protection
    const adminSelfBlock = await request("PUT", `/api/users/${adminLogin.body.data.user.id}/status`, { status: "BLOCKED" }, adminToken);
    assert(
      adminSelfBlock.status === 400,
      "20. Admin is protected against self-blocking/demoting their own admin account (400)"
    );

    // 18. End-to-end flow with approved Evaluator scoring a Student submission
    await request("POST", "/api/teams/join", { teamId: testTeamId }, studentToken);

    const taskList = await request("GET", "/api/tasks", null, studentToken);
    testTaskId = taskList.body.data?.[0]?._id;

    const subDraft = await request("POST", "/api/submissions", {
      teamId: testTeamId,
      taskId: testTaskId,
      reflection: "Recovered 30 kg waste across college grounds.",
      impactData: { wasteRecoveredKg: 30, studentHours: 5, awarenessCount: 25 }
    }, studentToken);
    testSubmissionId = subDraft.body.data._id;

    await request("POST", `/api/submissions/${testSubmissionId}/evidence`, {
      type: "PHOTO",
      url: "https://example.com/cleanup.jpg",
      caption: "Plastic waste audit"
    }, studentToken);

    await request("PUT", `/api/submissions/${testSubmissionId}/submit`, {}, studentToken);

    await request("POST", "/api/evaluations/assign", {
      submissionId: testSubmissionId,
      evaluatorId: registeredEvaluatorId
    }, adminToken);

    // Evaluator triggers AI evaluation
    const aiEvalRes = await request("POST", `/api/evaluations/${testSubmissionId}/ai-evaluate`, {}, evaluatorToken);
    assert(
      aiEvalRes.status === 200 &&
      aiEvalRes.body.data?.suggestedScore > 0 &&
      aiEvalRes.body.data?.reviewStatus === "PENDING_REVIEW",
      "21. Approved Evaluator triggers AI evaluation successfully"
    );

  } catch (error) {
    console.error("Test execution error:", error);
    failed++;
  } finally {
    if (server) server.close();
  }

  console.log("\n=======================================================");
  console.log(`  USER WORKFLOW TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runUserWorkflowTests();

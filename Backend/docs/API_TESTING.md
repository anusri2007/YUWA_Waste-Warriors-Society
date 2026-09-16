# YUWA Ecolympics — API Testing Guide & Test Suite

This document describes how to execute automated integration tests and perform manual verification of all backend features.

---

## 1. Quick Automated Test Execution

An automated end-to-end integration test runner is included in `scripts/testRunner.js`.

To run the full suite:
```bash
node scripts/testRunner.js
```

Or via npm:
```bash
npm test
```

### What the Automated Test Suite Verifies (All Passed ✓):
1. **Health Check**: `GET /` returns 200 with `{ "message": "YUWA Backend is running" }`.
2. **Authentication**: Successful login across all four roles (`ADMIN`, `COORDINATOR`, `EVALUATOR`, `STUDENT`).
3. **Auth Edge Cases**: Incorrect passwords and non-existent emails return 401 with standard error envelope.
4. **Public Student Registration**: `POST /api/auth/register` creates `STUDENT` only, prevents privilege escalation attempts, issues JWT, and blocks duplicate emails with 409 Conflict.
5. **Protected Profile**: `GET /api/auth/me` rejects missing tokens with 401 and returns sanitized profile (password never exposed).
6. **Role Security Boundaries**: Students hitting Admin routes (`POST /api/colleges`, `POST /api/competitions`) are rejected with 403 Forbidden.
7. **Admin College Management**: `POST /api/colleges` creates colleges with concurrency-safe atomic sequence IDs (`COL-001`, `COL-002`).
8. **Coordinator Scoping**: `GET /api/colleges/my` safely scopes to coordinator's assigned college.
9. **Competitions & Tasks**: Competitions and tasks are listed with full details; active rubric criteria are retrieved.
10. **Team Management & Joining Constraint**: Coordinator creates team (`TEAM-xxx`); Student joins team; Student attempting to join a second active team in the same competition is rejected with 400 Bad Request.
11. **Submission Workflow**:
    - Creation of `DRAFT` submission.
    - Premature submit without required evidence is blocked with 400 Bad Request.
    - Adding photo evidence succeeds.
    - Substantive reflection and positive waste weight kg recorded.
    - `PUT /api/submissions/:id/submit` transitions status to `SUBMITTED`.
    - Tamper check: editing a `SUBMITTED` submission is blocked with 400.
12. **Evaluator Assignment & Rubric Scoring**:
    - Admin assigns evaluator to submission (`POST /api/evaluations/assign`).
    - Evaluator sees submission in `GET /api/evaluations/assigned`.
    - Scores exceeding rubric criterion `maxPoints` are rejected with 400.
    - Evaluator scores valid criteria; server computes total score; submission updates to `EVALUATED`.
13. **Live Leaderboard**: `GET /api/leaderboard/:competitionId` dynamically computes rank based on approved evaluation score and deterministic tie-breaking.
14. **Impact Aggregation**: `GET /api/impact/:competitionId` aggregates verified waste kg, student hours, awareness count, and climate actions strictly from approved submissions.
15. **Dashboards**:
    - Coordinator dashboard is strictly scoped to coordinator's college (`COL-001`).
    - Coordinator teams progress and falling-behind teams identified.
    - Admin dashboard aggregates system-wide counts and submission pipeline statuses.
16. **Notifications & Nudges**: Coordinator sends in-app nudge to team members; students receive notification in `GET /api/notifications/my` and can mark it as read.
17. **Community Engagement**: Public access to community feed without auth; milestone highlights; celebration cheers counter increment.
18. **Historical Archives & Reports**: Competition history snapshot; comprehensive JSON report; CSV export file download.

---

## 2. Seed Data Credentials

Run the database seeder anytime to populate a fresh environment:
```bash
node seeds/seedData.js
```

### Seed Accounts (Password for all: `Password123!`)
| Role | Email | Assigned Entity |
|---|---|---|
| **Admin** | `admin@yuwa-ecolympics.org` | System Administrator |
| **Coordinator** | `coordinator@yuwa-ecolympics.org` | St. Xavier's College (`COL-001`) |
| **Evaluator** | `evaluator@yuwa-ecolympics.org` | Independent Evaluator |
| **Student 1** | `aarav.student@yuwa-ecolympics.org` | EcoWarriors Green League (`TEAM-001`) |
| **Student 2** | `diya.student@yuwa-ecolympics.org` | EcoWarriors Green League (`TEAM-001`) |

---

## 3. Sample cURL Test Workflows

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yuwa-ecolympics.org","password":"Password123!"}'
```

### 2. View Protected Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. Create College (Admin)
```bash
curl -X POST http://localhost:5000/api/colleges \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Doon University","location":"Dehradun"}'
```

### 4. Create Team (Coordinator)
```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer <COORDINATOR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Climate Crusaders","competitionId":"<COMPETITION_ID>"}'
```

### 5. Join Team (Student)
```bash
curl -X POST http://localhost:5000/api/teams/join \
  -H "Authorization: Bearer <STUDENT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"teamId":"TEAM-001"}'
```

### 6. View Live Leaderboard
```bash
curl -X GET http://localhost:5000/api/leaderboard/<COMPETITION_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### 7. Export Competition Report (CSV)
```bash
curl -X GET http://localhost:5000/api/reports/<COMPETITION_ID>/export \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  --output report.csv
```

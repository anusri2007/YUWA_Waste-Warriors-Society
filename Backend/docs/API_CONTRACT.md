# YUWA Ecolympics — Backend API Contract & Specification

This document serves as the complete, authoritative REST API contract for the **YUWA Ecolympics Competition Management Platform Backend**. Frontend developers can build all four role dashboards (**Student**, **Coordinator**, **Evaluator**, **Admin**) exclusively from this specification.

---

## 1. Global Standards

### Base URL
- **Local Development**: `http://localhost:5000`

### Headers
- `Content-Type: application/json` (unless uploading multipart files)
- `Authorization: Bearer <JWT_TOKEN>` (for all protected endpoints)

### Response Envelope Format
All endpoints return consistent JSON envelopes:

#### Success Response
```json
{
  "success": true,
  "message": "Human readable success description",
  "data": { ... }
}
```

#### Paginated Success Response
```json
{
  "success": true,
  "message": "List retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 54,
    "pages": 3
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Clear description of what went wrong"
}
```

### Standard Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation error, missing required field, or invalid state transition.
- `401 Unauthorized`: Missing or invalid/expired JWT token.
- `403 Forbidden`: Role not authorized or access outside college scope.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Duplicate email, team name conflict, or duplicate active submission.
- `500 Internal Server Error`: Server exception (stack traces are never exposed).

---

## 2. User Roles & Access Control Matrix

| Role | Permitted Actions |
|---|---|
| **PUBLIC** | Register as Student, login, view community feed, view community milestones, celebrate approved submissions. |
| **STUDENT** | View tasks/competitions, join a team (1 active team per competition), create & edit own team's draft submissions, upload evidence, submit final submission, view own submissions, view live leaderboard & impact, receive notifications. |
| **COORDINATOR** | All Student permissions + create teams for own college, view own college's teams & students, view coordinator dashboard & falling-behind teams, send team nudges. |
| **EVALUATOR** | View assigned submissions, view rubric criteria, score criteria (within max bounds), submit evaluation decisions (`APPROVED`, `REJECTED`, `FLAGGED`), perform calibration exercises. |
| **ADMIN** | System-wide authority: manage colleges (`COL-xxx`), manage user roles/statuses, assign coordinators to colleges, create competitions/tasks/rubrics, assign evaluators, system dashboard & exports. |

---

## 3. Module Endpoints

### 3.1 Authentication (`/api/auth`)

#### `POST /api/auth/register`
- **Auth**: Public
- **Description**: Registers a new user. Always assigns `role: "STUDENT"`, hashes password, and issues JWT.
- **Request Body**:
  ```json
  {
    "name": "Aarav Patel",
    "email": "aarav@college.edu",
    "password": "Password123!",
    "phoneNumber": "+919876543210"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Student registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "65f01...",
        "name": "Aarav Patel",
        "email": "aarav@college.edu",
        "role": "STUDENT",
        "status": "ACTIVE",
        "collegeId": null,
        "phoneNumber": "+919876543210"
      }
    }
  }
  ```

#### `POST /api/auth/login`
- **Auth**: Public
- **Description**: Authenticates user and issues JWT. Rejects `BLOCKED` accounts.
- **Request Body**:
  ```json
  {
    "email": "aarav@college.edu",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "65f01...",
        "name": "Aarav Patel",
        "email": "aarav@college.edu",
        "role": "STUDENT",
        "status": "ACTIVE"
      }
    }
  }
  ```

#### `GET /api/auth/me`
- **Auth**: Required (`STUDENT`, `COORDINATOR`, `EVALUATOR`, `ADMIN`)
- **Description**: Returns profile of currently authenticated user without password.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully",
    "data": {
      "user": {
        "id": "65f01...",
        "name": "Aarav Patel",
        "email": "aarav@college.edu",
        "role": "STUDENT",
        "status": "ACTIVE",
        "college": {
          "id": "65f02...",
          "collegeId": "COL-001",
          "name": "St. Xavier's College",
          "location": "Dehradun"
        }
      }
    }
  }
  ```

---

### 3.2 User Management (`/api/users`)

#### `GET /api/users`
- **Auth**: `ADMIN`
- **Query Params**: `role`, `status`, `collegeId`, `search`, `page`, `limit`
- **Response**: Paginated list of users.

#### `GET /api/users/:id`
- **Auth**: `ADMIN`
- **Response**: User details populated with college.

#### `PUT /api/users/:id/status`
- **Auth**: `ADMIN`
- **Request Body**: `{ "status": "PENDING" | "ACTIVE" | "BLOCKED" }`

#### `PUT /api/users/:id/role`
- **Auth**: `ADMIN`
- **Request Body**: `{ "role": "ADMIN" | "COORDINATOR" | "STUDENT" | "EVALUATOR" }`

#### `PUT /api/users/:id/assign-college`
- **Auth**: `ADMIN`
- **Request Body**: `{ "collegeId": "65f02..." | "COL-001" }`

---

### 3.3 Colleges (`/api/colleges`)

#### `GET /api/colleges`
- **Auth**: Authenticated
- **Query Params**: `search`, `page`, `limit`
- **Response**: Paginated list of colleges.

#### `POST /api/colleges`
- **Auth**: `ADMIN`
- **Description**: Creates college with server-generated concurrency-safe `collegeId` (`COL-001`, `COL-002`...).
- **Request Body**:
  ```json
  {
    "name": "Doon University",
    "location": "Dehradun, Uttarakhand"
  }
  ```

#### `GET /api/colleges/my`
- **Auth**: `COORDINATOR` (or assigned users)
- **Description**: Returns coordinator's assigned college (derived from `req.user.collegeId`).

#### `GET /api/colleges/:id`
- **Auth**: Authenticated (accepts Mongo `_id` or `COL-xxx`).

---

### 3.4 Teams (`/api/teams`)

#### `POST /api/teams`
- **Auth**: `COORDINATOR`
- **Description**: Creates team for coordinator's college. Auto-generates `teamId` (`TEAM-001`...).
- **Request Body**:
  ```json
  {
    "teamName": "EcoWarriors Delta",
    "competitionId": "65f03..."
  }
  ```

#### `POST /api/teams/join`
- **Auth**: `STUDENT`
- **Description**: Student joins team. Validates student is not in multiple active teams in the same competition.
- **Request Body**:
  ```json
  {
    "teamId": "TEAM-001"
  }
  ```

#### `GET /api/teams/my`
- **Auth**: `STUDENT`
- **Description**: Returns student's active teams and teammates.

#### `GET /api/teams/college`
- **Auth**: `COORDINATOR`
- **Description**: Returns all teams from coordinator's college.

#### `GET /api/teams/:id/members`
- **Auth**: Authenticated
- **Description**: Returns populated student members of team.

#### `GET /api/teams/:id/submissions`
- **Auth**: Authenticated
- **Description**: Returns all submissions submitted by this team.

---

### 3.5 Competitions (`/api/competitions`)

#### `GET /api/competitions`
- **Auth**: Authenticated
- **Query Params**: `status`, `year`, `search`

#### `POST /api/competitions`
- **Auth**: `ADMIN`
- **Request Body**:
  ```json
  {
    "name": "Ecolympics 2026 Season 1",
    "year": 2026,
    "description": "Annual climate action competition",
    "startDate": "2026-03-01",
    "endDate": "2026-10-31",
    "status": "ACTIVE"
  }
  ```

#### `GET /api/competitions/:id/history`
- **Auth**: Authenticated
- **Description**: Read-only historical snapshot for past editions (total teams, tasks, top 3 leaderboard, impact).

---

### 3.6 Tasks & Rubrics (`/api/tasks`, `/api/rubrics`)

#### `GET /api/tasks?competitionId=<id>`
- **Auth**: Authenticated
- **Description**: List tasks for a competition.

#### `POST /api/tasks`
- **Auth**: `ADMIN`
- **Request Body**:
  ```json
  {
    "competitionId": "65f03...",
    "title": "Campus Plastic Clean-up",
    "description": "Collect and segregate waste",
    "taskType": "CLEANUP",
    "instructions": "Take before-after photos, weigh waste in kg",
    "deadline": "2026-08-30",
    "maxPoints": 100,
    "requiredEvidence": {
      "photo": true,
      "video": false,
      "reflection": true,
      "wasteWeightKg": true
    },
    "impactMetrics": {
      "wasteRecoveredKg": true,
      "studentHours": true,
      "awarenessCount": true,
      "climateActionCount": true
    }
  }
  ```

#### `GET /api/rubrics/task/:taskId`
- **Auth**: Authenticated
- **Description**: Returns active rubric criteria with max points for evaluation.

#### `POST /api/rubrics`
- **Auth**: `ADMIN`
- **Description**: Creates or updates version of rubric for a task.
- **Request Body**:
  ```json
  {
    "taskId": "65f04...",
    "criteria": [
      { "name": "Waste Segregation Quality", "maxPoints": 50, "description": "Sorting accuracy" },
      { "name": "Volunteer Participation", "maxPoints": 50, "description": "Student hours" }
    ]
  }
  ```

---

### 3.7 Submissions & Evidence (`/api/submissions`)

#### `POST /api/submissions`
- **Auth**: `STUDENT` (must belong to team)
- **Description**: Creates a new `DRAFT` submission.
- **Request Body**:
  ```json
  {
    "teamId": "65f05...",
    "taskId": "65f04...",
    "reflection": "Initial notes on our project",
    "impactData": {
      "wasteRecoveredKg": 32.5,
      "studentHours": 14,
      "awarenessCount": 80,
      "climateActionCount": 1
    }
  }
  ```

#### `POST /api/submissions/:id/evidence`
- **Auth**: `STUDENT` (team member)
- **Content-Type**: `multipart/form-data` OR `application/json`
- **For file upload**: Form field `file` (binary) and optional `type`, `caption`.
- **For direct URL**:
  ```json
  {
    "type": "PHOTO",
    "url": "https://storage.com/photo1.jpg",
    "caption": "Collected PET bottles"
  }
  ```

#### `DELETE /api/submissions/:id/evidence/:evidenceId`
- **Auth**: `STUDENT` (DRAFT only)

#### `PUT /api/submissions/:id/submit`
- **Auth**: `STUDENT` (team member)
- **Description**: Finalizes submission (`DRAFT` -> `SUBMITTED`). Validates all required evidence items configured on the task. Once submitted, submissions cannot be edited.

---

### 3.8 Evaluations & Calibration (`/api/evaluations`, `/api/calibration`)

#### `POST /api/evaluations/assign`
- **Auth**: `ADMIN`
- **Request Body**:
  ```json
  {
    "submissionId": "65f06...",
    "evaluatorId": "65f07...",
    "notes": "Evaluate priority cleanup drive"
  }
  ```

#### `GET /api/evaluations/assigned`
- **Auth**: `EVALUATOR` (returns submissions assigned to logged in evaluator)

#### `POST /api/evaluations/:submissionId`
- **Auth**: `EVALUATOR` (assigned only, or Admin)
- **Description**: Scores criteria against active rubric. Total score is computed server-side.
- **Request Body**:
  ```json
  {
    "criteriaScores": [
      { "criterionId": "65f08...", "score": 45 },
      { "criterionId": "65f09...", "score": 42 }
    ],
    "feedback": "Outstanding execution and accurate segregation.",
    "decision": "APPROVED"
  }
  ```

#### `POST /api/calibration/:taskId`
- **Auth**: `EVALUATOR`
- **Description**: Evaluator scores reference benchmark submission; system evaluates discrepancy tolerance.

---

### 3.9 Leaderboard (`/api/leaderboard`)

#### `GET /api/leaderboard/:competitionId`
- **Auth**: Authenticated / Public
- **Description**: Live, deterministic ranked leaderboard.
- **Deterministic Sort**:
  1. `totalScore` DESC
  2. `completedTasks` DESC
  3. `approvedSubmissions` DESC
  4. `earliestSubmission` ASC
  5. `teamName` ASC
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "competition": { "name": "Ecolympics 2026", "year": 2026 },
      "leaderboard": [
        {
          "rank": 1,
          "teamId": "TEAM-001",
          "teamName": "EcoWarriors Green League",
          "collegeId": "COL-001",
          "collegeName": "St. Xavier's College",
          "totalScore": 87,
          "completedTasks": 1,
          "approvedSubmissions": 1
        }
      ]
    }
  }
  ```

---

### 3.10 Dashboards (`/api/dashboard`)

#### `GET /api/dashboard/college`
- **Auth**: `COORDINATOR`
- **Description**: College coordinator dashboard strictly scoped to `req.user.collegeId`.
- **Response**:
  ```json
  {
    "college": { "collegeId": "COL-001", "name": "St. Xavier's College" },
    "metrics": {
      "totalTeams": 3,
      "totalStudents": 18,
      "totalSubmissions": 5,
      "approvedSubmissions": 3,
      "submissionBreakdown": { "draft": 1, "submitted": 1, "evaluated": 3 }
    },
    "impact": {
      "wasteRecoveredKg": 145.2,
      "studentHours": 54.0,
      "awarenessCount": 350
    }
  }
  ```

#### `GET /api/dashboard/college/pending`
- **Auth**: `COORDINATOR`
- **Description**: Identifies falling-behind teams (zero submissions or stuck in draft).

#### `GET /api/dashboard/admin`
- **Auth**: `ADMIN`
- **Description**: System-wide totals of colleges, teams, students, coordinators, evaluators, submission pipeline statuses, top 5 leaderboard, and aggregate impact.

---

### 3.11 Impact (`/api/impact`)

#### `GET /api/impact/:competitionId`
- **Auth**: Authenticated
- **Description**: Aggregates strictly approved submissions.
- **Metrics**: `totalWasteRecoveredKg`, `totalStudentHours`, `totalAwarenessCount`, `totalClimateActions`, `participatingTeamsCount`, `participatingCollegesCount`.

#### `GET /api/impact/:competitionId/by-college`
- **Auth**: Authenticated
- **Description**: Impact aggregated by participating college.

#### `GET /api/impact/:competitionId/by-task`
- **Auth**: Authenticated
- **Description**: Impact aggregated by task type.

---

### 3.12 Notifications (`/api/notifications`)

#### `GET /api/notifications/my`
- **Auth**: Authenticated
- **Description**: Returns in-app notifications and unread count.

#### `PUT /api/notifications/:id/read`
- **Auth**: Authenticated

#### `POST /api/notifications/nudge`
- **Auth**: `COORDINATOR` / `ADMIN`
- **Description**: Sends in-app nudge to all students of target team. Coordinators can only nudge teams from their own college.
- **Request Body**:
  ```json
  {
    "teamId": "TEAM-001",
    "message": "Please finalize your cleanup drive evidence by Friday!"
  }
  ```

---

### 3.13 Community Feed (`/api/community`)

#### `GET /api/community/submissions`
- **Auth**: Public / Optional Auth
- **Description**: Public-safe feed of approved submissions. PII (phone, email, evaluator notes) is strictly stripped.
- **Query Params**: `competitionId`, `page`, `limit`

#### `GET /api/community/milestones`
- **Auth**: Public
- **Description**: Highlights key milestones (e.g. 5,000 kg waste diverted).

#### `POST /api/community/:id/celebrate`
- **Auth**: Public / Authenticated
- **Description**: Increments celebration cheers counter for an approved submission.

---

### 3.14 Reports (`/api/reports`)

#### `GET /api/reports/:competitionId`
- **Auth**: `ADMIN`, `COORDINATOR`
- **Description**: Comprehensive JSON competition summary.

#### `GET /api/reports/:competitionId/export`
- **Auth**: `ADMIN`, `COORDINATOR`
- **Description**: Returns downloadable CSV file containing final rankings and college performance.

---

### 3.15 Audit Logs (`/api/audit-logs`)

#### `GET /api/audit-logs`
- **Auth**: `ADMIN`
- **Description**: Audit trail of system administrative actions.

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SubmissionCard from "../components/SubmissionCard";

const submissions = [
  {
    id: 1,
    team: "Eco Warriors",
    college: "ABC College",
    task: "Waste Segregation",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    team: "Green Champs",
    college: "XYZ College",
    task: "Plastic Collection",
    time: "4 hours ago",
    status: "pending",
  },
  {
    id: 3,
    team: "Earth Squad",
    college: "KLU",
    task: "Campus Clean-up",
    time: "Yesterday",
    status: "evaluated",
  },
  {
    id: 4,
    team: "Eco Heroes",
    college: "SRM University",
    task: "E-Waste Drive",
    time: "Yesterday",
    status: "rejected",
  },
];

function EvaluatorDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const pending = submissions.filter(
    (submission) => submission.status === "pending"
  );

  const evaluated = submissions.filter(
    (submission) => submission.status === "evaluated"
  );

  const rejected = submissions.filter(
    (submission) => submission.status === "rejected"
  );

  const getVisibleSubmissions = () => {
    if (activeTab === "pending") {
      return pending;
    }

    if (activeTab === "evaluated") {
      return evaluated;
    }

    if (activeTab === "rejected") {
      return rejected;
    }

    return submissions;
  };

  const visibleSubmissions = getVisibleSubmissions();

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSelectedSubmission(null);
  };

  return (
    <div className="evaluator-layout">

      {/* SIDEBAR */}
      <Sidebar
        activePage="dashboard"
        onNavigate={onNavigate}
      />

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* HEADER */}
        <Header />

        <section className="dashboard-content">

          {/* PAGE INTRO */}
          <div className="page-intro">
            <div>
              <span className="page-label">Evaluator Portal</span>

              <h2>Review student submissions</h2>

              <p>
                Evaluate environmental tasks submitted by
                participating teams.
              </p>
            </div>
          </div>

          {/* STATUS TABS */}
          <div className="status-tabs">

            <button
              className={`status-tab ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => changeTab("overview")}
            >
              Overview
            </button>

            <button
              className={`status-tab ${
                activeTab === "pending" ? "active" : ""
              }`}
              onClick={() => changeTab("pending")}
            >
              Pending

              <span className="tab-count">
                {pending.length}
              </span>
            </button>

            <button
              className={`status-tab ${
                activeTab === "evaluated" ? "active" : ""
              }`}
              onClick={() => changeTab("evaluated")}
            >
              Evaluated

              <span className="tab-count">
                {evaluated.length}
              </span>
            </button>

            <button
              className={`status-tab ${
                activeTab === "rejected" ? "active" : ""
              }`}
              onClick={() => changeTab("rejected")}
            >
              Rejected

              <span className="tab-count">
                {rejected.length}
              </span>
            </button>

          </div>

          {/* STAT CARDS */}
          <div className="stats-grid">

            <StatCard
              title="Assigned Submissions"
              value="24"
              icon="📥"
              description="Total assigned to you"
            />

            <StatCard
              title="Pending Evaluation"
              value={pending.length}
              icon="⏳"
              description="Waiting for review"
            />

            <StatCard
              title="Evaluated"
              value={evaluated.length}
              icon="✅"
              description="Completed evaluations"
            />

            <StatCard
              title="Rejected"
              value={rejected.length}
              icon="❌"
              description="Submissions rejected"
            />

          </div>

          {/* SUBMISSIONS SECTION */}
          <section className="submissions-section">

            <div className="section-heading">

              <div>
                <h2>
                  {activeTab === "overview"
                    ? "Recent Submissions"
                    : `${activeTab
                        .charAt(0)
                        .toUpperCase()}${activeTab.slice(1)} Submissions`}
                </h2>

                <p>
                  {visibleSubmissions.length} submissions
                </p>
              </div>

              {activeTab !== "pending" && (
                <button
                  className="view-all-btn"
                  onClick={() => changeTab("pending")}
                >
                  View pending →
                </button>
              )}

            </div>

            {/* SUBMISSION LIST */}
            <div className="submission-list">

              {visibleSubmissions.length > 0 ? (
                visibleSubmissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    onReview={setSelectedSubmission}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>

                  <h3>No submissions found</h3>

                  <p>
                    There are no submissions in this category.
                  </p>
                </div>
              )}

            </div>

          </section>

          {/* QUICK REVIEW PREVIEW */}
          {selectedSubmission && (
            <div className="review-preview">

              <div className="review-preview-header">

                <div>
                  <span>Submission Review</span>

                  <h2>
                    {selectedSubmission.team}
                  </h2>
                </div>

                <button
                  className="close-btn"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ×
                </button>

              </div>

              <div className="review-grid">

                <div>
                  <span>College</span>

                  <strong>
                    {selectedSubmission.college}
                  </strong>
                </div>

                <div>
                  <span>Task</span>

                  <strong>
                    {selectedSubmission.task}
                  </strong>
                </div>

                <div>
                  <span>Submitted</span>

                  <strong>
                    {selectedSubmission.time}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong className={`status-${selectedSubmission.status}`}>
                    {selectedSubmission.status}
                  </strong>
                </div>

              </div>

              <button
                className="start-review-btn"
                onClick={() => onNavigate("submissions")}
              >
                Open Full Review →
              </button>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default EvaluatorDashboard;
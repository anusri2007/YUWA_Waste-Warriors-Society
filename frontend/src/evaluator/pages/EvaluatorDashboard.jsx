import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SubmissionCard from "../components/SubmissionCard";
import { useEvaluator } from "../context/EvaluatorContext";

function EvaluatorDashboard() {
  const navigate = useNavigate();
  const { submissions, stats } = useEvaluator();
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

    // "overview" shows recent submissions
    return submissions;
  };

  const visibleSubmissions = getVisibleSubmissions();

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSelectedSubmission(null);
  };

  const handleReviewClick = (submission) => {
    navigate(`/submissions/${submission.id}`);
  };

  return (
    <div className="evaluator-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <Header />

        <section className="dashboard-content">
          {/* PAGE INTRO */}
          <div className="page-intro">
            <div>
              <span className="page-label">Evaluator Portal</span>
              <h2>Review Student Submissions</h2>
              <p>
                Evaluate environmental and waste management tasks submitted by participating student teams.
              </p>
            </div>

            <div className="header-quick-actions">
              <button
                className="secondary-btn"
                onClick={() => navigate("/submissions")}
              >
                All Submissions ({stats.totalAssigned}) →
              </button>
              <button
                className="secondary-btn"
                onClick={() => navigate("/analytics")}
              >
                Analytics →
              </button>
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
              <span className="tab-count">{submissions.length}</span>
            </button>

            <button
              className={`status-tab ${
                activeTab === "pending" ? "active" : ""
              }`}
              onClick={() => changeTab("pending")}
            >
              Pending
              <span className="tab-count">{pending.length}</span>
            </button>

            <button
              className={`status-tab ${
                activeTab === "evaluated" ? "active" : ""
              }`}
              onClick={() => changeTab("evaluated")}
            >
              Evaluated
              <span className="tab-count">{evaluated.length}</span>
            </button>

            <button
              className={`status-tab ${
                activeTab === "rejected" ? "active" : ""
              }`}
              onClick={() => changeTab("rejected")}
            >
              Rejected
              <span className="tab-count">{rejected.length}</span>
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="stats-grid">
            <StatCard
              title="Assigned Submissions"
              value={stats.totalAssigned}
              icon="📥"
              description="Total assigned to you"
            />

            <StatCard
              title="Pending Evaluation"
              value={stats.pendingCount}
              icon="⏳"
              description="Waiting for review"
            />

            <StatCard
              title="Evaluated"
              value={stats.evaluatedCount}
              icon="✅"
              description="Completed evaluations"
            />

            <StatCard
              title="Rejected"
              value={stats.rejectedCount}
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
                    : `${activeTab.charAt(0).toUpperCase()}${activeTab.slice(1)} Submissions`}
                </h2>
                <p>{visibleSubmissions.length} submissions in this view</p>
              </div>

              {activeTab !== "pending" && pending.length > 0 && (
                <button
                  className="view-all-btn"
                  onClick={() => changeTab("pending")}
                >
                  View pending ({pending.length}) →
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
                    onReview={handleReviewClick}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No submissions found</h3>
                  <p>There are no submissions in this category.</p>
                </div>
              )}
            </div>
          </section>

          {/* QUICK REVIEW PREVIEW MODAL / DRAWER (if triggered) */}
          {selectedSubmission && (
            <div className="review-preview">
              <div className="review-preview-header">
                <div>
                  <span>Submission Review</span>
                  <h2>{selectedSubmission.team}</h2>
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
                  <strong>{selectedSubmission.college}</strong>
                </div>

                <div>
                  <span>Task</span>
                  <strong>{selectedSubmission.task}</strong>
                </div>

                <div>
                  <span>Submitted</span>
                  <strong>{selectedSubmission.submitted || selectedSubmission.time}</strong>
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
                onClick={() => navigate(`/submissions/${selectedSubmission.id}`)}
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
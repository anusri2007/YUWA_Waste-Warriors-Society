import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEvaluator } from "../context/EvaluatorContext";

function SubmissionReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSubmissionById, evaluateSubmission, rejectSubmission, reopenSubmission } =
    useEvaluator();

  const submission = getSubmissionById(id);

  // Evaluation Form State
  const [impactScore, setImpactScore] = useState(25);
  const [executionScore, setExecutionScore] = useState(25);
  const [authenticityScore, setAuthenticityScore] = useState(15);
  const [sustainabilityScore, setSustainabilityScore] = useState(15);
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");

  // Rejection Modal / Form State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState(
    "Incomplete Evidence & Photo Documentation"
  );
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [rejectError, setRejectError] = useState("");

  // Evidence Preview Modal State
  const [previewEvidence, setPreviewEvidence] = useState(null);

  // Edit Mode for already evaluated submission
  const [isEditingEvaluation, setIsEditingEvaluation] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!submission) {
    return (
      <div className="evaluator-layout">
        <Sidebar />
        <main className="main-content">
          <Header />
          <section className="dashboard-content">
            <div className="not-found-container">
              <h2>Submission Not Found</h2>
              <p>The submission ID #{id} does not exist or has been removed.</p>
              <button
                className="submission-action"
                onClick={() => navigate("/submissions")}
              >
                Back to Submissions
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Calculate live total score
  const totalScore =
    Number(impactScore || 0) +
    Number(executionScore || 0) +
    Number(authenticityScore || 0) +
    Number(sustainabilityScore || 0);

  // Handle Approve / Evaluate Submission
  const handleApproveEvaluation = (e) => {
    e.preventDefault();
    setFormError("");

    if (!feedback.trim()) {
      setFormError("Please enter detailed feedback for the student team.");
      return;
    }

    if (totalScore < 0 || totalScore > 100) {
      setFormError("Total score must be between 0 and 100.");
      return;
    }

    evaluateSubmission(submission.id, {
      totalScore,
      criteriaScores: {
        impact: Number(impactScore),
        execution: Number(executionScore),
        authenticity: Number(authenticityScore),
        sustainability: Number(sustainabilityScore),
      },
      feedback: feedback.trim(),
    });

    setIsEditingEvaluation(false);
    showToast(`Evaluation for "${submission.team}" successfully recorded!`);
  };

  // Handle Reject Submission
  const handleConfirmRejection = (e) => {
    e.preventDefault();
    setRejectError("");

    if (!rejectFeedback.trim()) {
      setRejectError(
        "Please provide specific feedback explaining the reason for rejection."
      );
      return;
    }

    rejectSubmission(submission.id, {
      reason: rejectReason,
      feedback: rejectFeedback.trim(),
    });

    setShowRejectModal(false);
    showToast(`Submission by "${submission.team}" marked as Rejected.`);
  };

  // Handle Re-open / Re-evaluate
  const handleReopen = () => {
    if (
      window.confirm(
        "Are you sure you want to reopen this submission for re-evaluation?"
      )
    ) {
      reopenSubmission(submission.id);
      setIsEditingEvaluation(true);
      showToast("Submission is now reopened for evaluation.");
    }
  };

  // Load existing values into form if editing
  const startEditing = () => {
    if (submission.evaluation) {
      const c = submission.evaluation.criteriaScores || {};
      setImpactScore(c.impact || 25);
      setExecutionScore(c.execution || 25);
      setAuthenticityScore(c.authenticity || 15);
      setSustainabilityScore(c.sustainability || 15);
      setFeedback(submission.evaluation.feedback || "");
    }
    setIsEditingEvaluation(true);
  };

  return (
    <div className="evaluator-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Header />

        <section className="review-page">
          {/* TOAST MESSAGE */}
          {toastMessage && (
            <div className="toast-notification">
              <span>✓</span> {toastMessage}
            </div>
          )}

          {/* BREADCRUMB & BACK BUTTON */}
          <div className="review-navigation-bar">
            <button
              className="back-button"
              onClick={() => navigate("/submissions")}
            >
              ← Back to Submissions
            </button>

            <nav className="breadcrumb">
              <Link to="/">Dashboard</Link>
              <span>/</span>
              <Link to="/submissions">Submissions</Link>
              <span>/</span>
              <span className="current">{submission.team}</span>
            </nav>
          </div>

          {/* PAGE HEADER */}
          <div className="review-page-header">
            <div>
              <span className="workspace-label">
                Evaluator Workspace • {submission.category || "Waste Management"}
              </span>
              <h1>{submission.team}</h1>
              <p>{submission.college} • Task: {submission.task}</p>
            </div>

            <div className="header-status-group">
              <span className={`status-badge ${submission.status}`}>
                {submission.status === "pending" && "Pending Review"}
                {submission.status === "evaluated" && (submission.score ? `Evaluated (${submission.score})` : "Evaluated")}
                {submission.status === "rejected" && "Rejected"}
              </span>
            </div>
          </div>

          {/* =========================================================
              BASIC DETAILS & METRICS CARDS
             ========================================================= */}
          <div className="review-details-card">
            <div className="card-header-line">
              <h2>Submission Overview</h2>
              <span className="timestamp-badge">Submitted: {submission.submittedAt || submission.submitted}</span>
            </div>

            <div className="review-details-grid">
              <div>
                <span>Team Name</span>
                <strong>{submission.team}</strong>
              </div>

              <div>
                <span>College / University</span>
                <strong>{submission.college}</strong>
              </div>

              <div>
                <span>Assigned Task</span>
                <strong>{submission.task}</strong>
              </div>

              <div>
                <span>Team Lead</span>
                <strong>{submission.lead || "Student Lead"}</strong>
              </div>

              <div>
                <span>Team Size</span>
                <strong>{submission.members || (submission.teamMembers ? submission.teamMembers.length : 1)} Members</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{submission.category || "Waste Management"}</strong>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="submission-description-block">
              <h3>Task Description & Summary</h3>
              <p>{submission.description}</p>
            </div>

            {/* IMPACT METRICS */}
            {submission.impactMetrics && (
              <div className="impact-metrics-section">
                <h3>Reported Environmental Impact</h3>
                <div className="impact-grid">
                  {Object.entries(submission.impactMetrics).map(([key, val]) => (
                    <div className="impact-box" key={key}>
                      <span className="impact-metric-value">{val}</span>
                      <span className="impact-metric-label">
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEAM ROSTER */}
            {submission.teamMembers && submission.teamMembers.length > 0 && (
              <div className="team-roster-section">
                <h3>Registered Team Members</h3>
                <div className="roster-chips">
                  {submission.teamMembers.map((member, i) => (
                    <div className="roster-chip" key={i}>
                      <div className="roster-avatar">{member.name.charAt(0)}</div>
                      <div>
                        <strong>{member.name}</strong>
                        <span>{member.role} ({member.studentId})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================
              SUBMITTED EVIDENCE & ATTACHMENTS
             ========================================================= */}
          <div className="review-details-card">
            <div className="card-header-line">
              <h2>Submitted Evidence & Documentation</h2>
              <span className="tag-pill">
                {submission.evidence ? submission.evidence.length : 0} Items
              </span>
            </div>

            <p className="section-subtext">
              Examine visual proofs, field measurements, and institutional sign-offs submitted for this task.
            </p>

            <div className="evidence-grid">
              {submission.evidence && submission.evidence.length > 0 ? (
                submission.evidence.map((item) => (
                  <div className="evidence-card" key={item.id}>
                    {item.type === "image" ? (
                      <div
                        className="evidence-img-container"
                        onClick={() => setPreviewEvidence(item)}
                      >
                        <img src={item.url} alt={item.title} loading="lazy" />
                        <div className="img-overlay-hover">Click to Enlarge 🔍</div>
                      </div>
                    ) : (
                      <div className="evidence-doc-container">
                        <div className="doc-icon">📄</div>
                        <div className="doc-info">
                          <strong>{item.fileName}</strong>
                          <span>{item.fileSize} • Verified PDF</span>
                        </div>
                      </div>
                    )}

                    <div className="evidence-caption-box">
                      <h4>{item.title}</h4>
                      <p>{item.caption}</p>
                      <button
                        className="view-evidence-btn"
                        onClick={() => setPreviewEvidence(item)}
                      >
                        {item.type === "image" ? "View Image" : "Inspect Document"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No attachments uploaded with this submission.</p>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================
              EVALUATED SUBMISSION VIEW (When status === 'evaluated' & not editing)
             ========================================================= */}
          {submission.status === "evaluated" && !isEditingEvaluation && (
            <div className="review-details-card evaluation-final-card">
              <div className="card-header-line">
                <div className="evaluated-title-group">
                  <span className="success-icon">✓</span>
                  <div>
                    <h2>Evaluation Completed</h2>
                    <p className="evaluation-meta">
                      Reviewed by {submission.evaluation?.evaluatorName || "Evaluator"} on{" "}
                      {submission.evaluation?.evaluatedAt || "Recently"}
                    </p>
                  </div>
                </div>

                <div className="score-badge-large">
                  <span>Score</span>
                  <strong>{submission.score || `${submission.evaluation?.totalScore}/100`}</strong>
                </div>
              </div>

              {/* CRITERIA BREAKDOWN */}
              <div className="criteria-summary-grid">
                <div className="criteria-box">
                  <span>Environmental Impact & Waste Diverted</span>
                  <strong>
                    {submission.evaluation?.criteriaScores?.impact || "--"} / 30 pts
                  </strong>
                </div>

                <div className="criteria-box">
                  <span>Execution & Student Effort</span>
                  <strong>
                    {submission.evaluation?.criteriaScores?.execution || "--"} / 30 pts
                  </strong>
                </div>

                <div className="criteria-box">
                  <span>Evidence & Documentation Authenticity</span>
                  <strong>
                    {submission.evaluation?.criteriaScores?.authenticity || "--"} / 20 pts
                  </strong>
                </div>

                <div className="criteria-box">
                  <span>Innovation & Sustainability</span>
                  <strong>
                    {submission.evaluation?.criteriaScores?.sustainability || "--"} / 20 pts
                  </strong>
                </div>
              </div>

              {/* FEEDBACK QUOTE */}
              <div className="evaluator-feedback-box">
                <h4>Evaluator Comments & Feedback</h4>
                <blockquote>
                  "{submission.evaluation?.feedback || "Evaluation complete."}"
                </blockquote>
              </div>

              {/* ACTIONS FOR EVALUATED */}
              <div className="evaluated-actions-bar">
                <button className="secondary-btn" onClick={startEditing}>
                  ✎ Edit Evaluation & Score
                </button>
                <button className="reopen-btn" onClick={handleReopen}>
                  ↺ Reopen Submission
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              REJECTED SUBMISSION VIEW (When status === 'rejected')
             ========================================================= */}
          {submission.status === "rejected" && (
            <div className="review-details-card rejected-final-card">
              <div className="card-header-line">
                <div className="evaluated-title-group">
                  <span className="rejected-icon">✕</span>
                  <div>
                    <h2>Submission Rejected</h2>
                    <p className="evaluation-meta">
                      Flagged by {submission.rejection?.evaluatorName || "Evaluator"} on{" "}
                      {submission.rejection?.rejectedAt || "Recently"}
                    </p>
                  </div>
                </div>

                <span className="status-badge rejected">Action Required</span>
              </div>

              <div className="rejection-details-box">
                <h4>Stated Rejection Reason</h4>
                <div className="reason-pill">
                  {submission.rejection?.reason || "Did not meet criteria"}
                </div>

                <h4>Evaluator Remarks & Instructions for Revision</h4>
                <p className="rejection-feedback-text">
                  {submission.rejection?.feedback ||
                    "Please revise the documentation and re-upload authentic evidence."}
                </p>
              </div>

              <div className="evaluated-actions-bar">
                <button className="primary-btn" onClick={handleReopen}>
                  ↺ Re-evaluate Submission
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => navigate("/submissions")}
                >
                  Return to Submissions List
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              EVALUATION FORM (When status === 'pending' OR editing)
             ========================================================= */}
          {(submission.status === "pending" || isEditingEvaluation) && (
            <div className="review-details-card evaluation-entry-card">
              <div className="card-header-line">
                <div>
                  <h2>{isEditingEvaluation ? "Edit Evaluation" : "Evaluator Scoring & Feedback"}</h2>
                  <p className="section-subtext">
                    Score each rubric criteria according to YUWA Waste Warriors Society guidelines.
                  </p>
                </div>

                <div className="live-score-display">
                  <span>Total Calculated Score</span>
                  <strong className={totalScore >= 80 ? "high-score" : "med-score"}>
                    {totalScore} / 100
                  </strong>
                </div>
              </div>

              {formError && <div className="form-error-banner">⚠️ {formError}</div>}

              <form onSubmit={handleApproveEvaluation} className="evaluation-form">
                {/* RUBRIC SCORING GRID */}
                <div className="rubric-grid">
                  {/* Criterion 1 */}
                  <div className="rubric-item">
                    <div className="rubric-header">
                      <label htmlFor="impact">1. Environmental Impact & Waste Reduction</label>
                      <span className="max-score">Max: 30 pts</span>
                    </div>
                    <p className="rubric-desc">
                      Quantifiable waste diverted, collected, or composted. Direct community and environmental benefit.
                    </p>
                    <div className="slider-input-group">
                      <input
                        id="impact"
                        type="range"
                        min="0"
                        max="30"
                        value={impactScore}
                        onChange={(e) => setImpactScore(e.target.value)}
                      />
                      <span className="slider-value-box">{impactScore} pts</span>
                    </div>
                  </div>

                  {/* Criterion 2 */}
                  <div className="rubric-item">
                    <div className="rubric-header">
                      <label htmlFor="execution">2. Execution & Team Effort</label>
                      <span className="max-score">Max: 30 pts</span>
                    </div>
                    <p className="rubric-desc">
                      Organization of the campaign, volunteer mobilization, planning, and task completion.
                    </p>
                    <div className="slider-input-group">
                      <input
                        id="execution"
                        type="range"
                        min="0"
                        max="30"
                        value={executionScore}
                        onChange={(e) => setExecutionScore(e.target.value)}
                      />
                      <span className="slider-value-box">{executionScore} pts</span>
                    </div>
                  </div>

                  {/* Criterion 3 */}
                  <div className="rubric-item">
                    <div className="rubric-header">
                      <label htmlFor="authenticity">3. Verification & Evidence Authenticity</label>
                      <span className="max-score">Max: 20 pts</span>
                    </div>
                    <p className="rubric-desc">
                      High quality geotagged photos, official recycling vendor receipts, signoffs, and audit sheets.
                    </p>
                    <div className="slider-input-group">
                      <input
                        id="authenticity"
                        type="range"
                        min="0"
                        max="20"
                        value={authenticityScore}
                        onChange={(e) => setAuthenticityScore(e.target.value)}
                      />
                      <span className="slider-value-box">{authenticityScore} pts</span>
                    </div>
                  </div>

                  {/* Criterion 4 */}
                  <div className="rubric-item">
                    <div className="rubric-header">
                      <label htmlFor="sustainability">4. Innovation & Long-Term Sustainability</label>
                      <span className="max-score">Max: 20 pts</span>
                    </div>
                    <p className="rubric-desc">
                      Replicability, innovative approach, durability of the solution beyond the event.
                    </p>
                    <div className="slider-input-group">
                      <input
                        id="sustainability"
                        type="range"
                        min="0"
                        max="20"
                        value={sustainabilityScore}
                        onChange={(e) => setSustainabilityScore(e.target.value)}
                      />
                      <span className="slider-value-box">{sustainabilityScore} pts</span>
                    </div>
                  </div>
                </div>

                {/* EVALUATOR FEEDBACK COMMENTS */}
                <div className="feedback-section">
                  <label htmlFor="evaluator-feedback">
                    Evaluator Feedback & Constructive Comments *
                  </label>
                  <p className="field-hint">
                    Provide constructive praise and practical advice for the student team. This feedback will be visible to the team.
                  </p>
                  <textarea
                    id="evaluator-feedback"
                    rows="4"
                    placeholder="E.g., Great execution on waste sorting! Consider partnering with local municipality for long-term organic waste pickup..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  />
                </div>

                {/* ACTIONS */}
                <div className="review-actions">
                  <div className="left-actions">
                    <button
                      type="button"
                      className="reject-btn"
                      onClick={() => setShowRejectModal(true)}
                    >
                      Reject Submission...
                    </button>
                    {isEditingEvaluation && (
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => setIsEditingEvaluation(false)}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <button type="submit" className="approve-btn">
                    ✓ Approve & Finalize Evaluation ({totalScore}/100)
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================
              REJECTION MODAL
             ========================================================= */}
          {showRejectModal && (
            <div className="modal-backdrop" onClick={() => setShowRejectModal(false)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Reject Submission: {submission.team}</h3>
                  <button
                    className="close-btn"
                    onClick={() => setShowRejectModal(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleConfirmRejection} className="modal-body">
                  <p className="modal-explainer">
                    Rejecting will notify the team with your feedback and required adjustments before they can be considered for awards.
                  </p>

                  {rejectError && (
                    <div className="form-error-banner">⚠️ {rejectError}</div>
                  )}

                  <div className="form-group">
                    <label>Reason for Rejection *</label>
                    <select
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      required
                    >
                      <option value="Incomplete Evidence & Photo Documentation">
                        Incomplete Evidence & Photo Documentation
                      </option>
                      <option value="Lack of Authorized Recycler Handover / Chain of Custody">
                        Lack of Authorized Recycler Handover / Chain of Custody
                      </option>
                      <option value="Non-compliance with Competition Guidelines">
                        Non-compliance with Competition Guidelines
                      </option>
                      <option value="Unverified Geolocation or Timestamps">
                        Unverified Geolocation or Timestamps
                      </option>
                      <option value="Duplicate or Plagiarized Submission">
                        Duplicate or Plagiarized Submission
                      </option>
                      <option value="Other">Other Specific Grounds</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Detailed Evaluator Remarks for Student Team *</label>
                    <textarea
                      rows="4"
                      placeholder="Specify exactly what evidence or proof is missing, and how the team can rectify their submission..."
                      value={rejectFeedback}
                      onChange={(e) => setRejectFeedback(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => setShowRejectModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="danger-confirm-btn">
                      Confirm Rejection
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================
              EVIDENCE PREVIEW MODAL
             ========================================================= */}
          {previewEvidence && (
            <div className="modal-backdrop" onClick={() => setPreviewEvidence(null)}>
              <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{previewEvidence.title}</h3>
                  <button
                    className="close-btn"
                    onClick={() => setPreviewEvidence(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  {previewEvidence.type === "image" ? (
                    <div className="modal-img-wrapper">
                      <img src={previewEvidence.url} alt={previewEvidence.title} />
                    </div>
                  ) : (
                    <div className="modal-doc-wrapper">
                      <div className="doc-big-icon">📄</div>
                      <h4>{previewEvidence.fileName}</h4>
                      <p>Document Verified • Size: {previewEvidence.fileSize}</p>
                      <div className="doc-preview-box">
                        <p>
                          <strong>Document Preview:</strong> Official sign-off issued by institutional coordinator. All metrics and timestamps certified for YUWA Waste Warriors competition.
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="modal-caption-text">{previewEvidence.caption}</p>
                </div>

                <div className="modal-actions">
                  <button
                    className="secondary-btn"
                    onClick={() => setPreviewEvidence(null)}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SubmissionReview;
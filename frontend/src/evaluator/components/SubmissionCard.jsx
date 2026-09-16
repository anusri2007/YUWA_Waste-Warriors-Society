
function SubmissionCard({ submission, onReview }) {
  return (
    <div className="submission-card">
      <div className="submission-info">
        <div className="team-avatar">
          {submission.team ? submission.team.charAt(0) : "T"}
        </div>

        <div>
          <h3>{submission.team}</h3>
          <p>{submission.college}</p>
        </div>
      </div>

      <div className="submission-task">
        <span>Task</span>
        <strong>{submission.task}</strong>
      </div>

      <div className="submission-time">
        <span>Submitted</span>
        <strong>{submission.submitted || submission.time || "Recently"}</strong>
      </div>

      <div className="submission-status-indicator">
        <span className={`status-badge ${submission.status}`}>
          {submission.status === "pending" && "Pending"}
          {submission.status === "evaluated" && (submission.score || "Evaluated")}
          {submission.status === "rejected" && "Rejected"}
        </span>
      </div>

      <button
        className="review-btn"
        onClick={() => onReview(submission)}
      >
        {submission.status === "pending" ? "Review →" : "View →"}
      </button>
    </div>
  );
}

export default SubmissionCard;
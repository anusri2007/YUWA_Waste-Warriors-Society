function SubmissionCard({ submission, onReview }) {
  return (
    <div className="submission-card">
      <div className="submission-info">
        <div className="team-avatar">
          {submission.team.charAt(0)}
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
        <strong>{submission.time}</strong>
      </div>

      <button
        className="review-btn"
        onClick={() => onReview(submission)}
      >
        Review →
      </button>
    </div>
  );
}

export default SubmissionCard;
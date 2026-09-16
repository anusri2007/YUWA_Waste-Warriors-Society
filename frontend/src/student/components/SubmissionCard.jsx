import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Award, CheckCircle2, Clock, AlertTriangle, ArrowRight, RotateCcw, Image, Video, Recycle } from "lucide-react";

const SubmissionCard = ({ submission }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="sub-status-pill sub-approved"><CheckCircle2 size={13} /> Approved</span>;
      case "Under Review":
        return <span className="sub-status-pill sub-review"><Clock size={13} /> Under Review</span>;
      case "Rejected":
        return <span className="sub-status-pill sub-rejected"><AlertTriangle size={13} /> Rejected</span>;
      default:
        return <span className="sub-status-pill sub-submitted"><Clock size={13} /> Submitted</span>;
    }
  };

  return (
    <div className="eco-submission-card">
      <div className="sub-card-header">
        <div className="sub-id-row">
          <span className="sub-id-tag">{submission.id}</span>
          <span className="sub-date">
            <Calendar size={13} /> {submission.submissionDate}
          </span>
        </div>
        {getStatusBadge(submission.status)}
      </div>

      <div className="sub-card-body">
        <h4 className="sub-task-title">{submission.taskTitle}</h4>

        {/* Evidence preview chips */}
        <div className="sub-evidence-strip">
          {submission.photos && submission.photos.length > 0 && (
            <div className="evidence-chip">
              <Image size={13} />
              <span>{submission.photos.length} Photo{submission.photos.length > 1 ? "s" : ""}</span>
            </div>
          )}
          {submission.videos && submission.videos.length > 0 && (
            <div className="evidence-chip">
              <Video size={13} />
              <span>{submission.videos.length} Video{submission.videos.length > 1 ? "s" : ""}</span>
            </div>
          )}
          {submission.wasteCollectedKg > 0 && (
            <div className="evidence-chip chip-waste">
              <Recycle size={13} />
              <span>{submission.wasteCollectedKg} kg Diverted</span>
            </div>
          )}
        </div>

        {/* Score display */}
        <div className="sub-score-box">
          <div className="score-label-row">
            <span className="score-label">Evaluator Score</span>
            <span className="score-value">
              {submission.score !== null ? (
                <strong className="text-emerald-600">
                  {submission.score} <span className="text-muted">/ {submission.maxPoints} pts</span>
                </strong>
              ) : (
                <span className="text-muted italic">Pending Evaluation</span>
              )}
            </span>
          </div>
        </div>

        {/* Feedback snippet */}
        {submission.evaluatorFeedback && (
          <div className="sub-feedback-snippet">
            <span className="feedback-snippet-title">Evaluator Feedback:</span>
            <p className="feedback-snippet-text">"{submission.evaluatorFeedback}"</p>
          </div>
        )}
      </div>

      <div className="sub-card-footer">
        <Link
          to={`/student/submissions/${submission.id}`}
          className="btn-sub-details"
        >
          <span>View Submission</span>
          <ArrowRight size={14} />
        </Link>

        {submission.status === "Rejected" && (
          <Link
            to={`/student/submit/${submission.taskId}`}
            className="btn-sub-resubmit"
          >
            <RotateCcw size={14} />
            <span>Resubmit Task</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;

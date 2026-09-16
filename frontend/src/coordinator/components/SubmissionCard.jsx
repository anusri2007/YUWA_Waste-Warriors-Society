import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Image,
  Video,
  Award,
  Recycle,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquareQuote,
  Building2,
  Users
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const SubmissionCard = ({
  submission,
  onApprove,
  onReject,
  onOpenFeedback
}) => {
  return (
    <div className="coordinator-sub-card glass-card">
      <div className="sub-top-bar">
        <div className="sub-id-group">
          <span className="sub-id-chip">{submission.id}</span>
          <span className="sub-date">
            <Calendar size={13} /> {submission.submissionDate}
          </span>
        </div>
        <StatusBadge status={submission.status} size="small" />
      </div>

      <div className="sub-student-row">
        <div className="sub-student-avatar-chip">
          {submission.studentName.charAt(0)}
        </div>
        <div className="sub-student-meta">
          <strong className="sub-student-name">{submission.studentName}</strong>
          <span className="sub-student-team">
            <Users size={12} /> {submission.team || "Independent"} • <Building2 size={12} /> {submission.studentCollege.split(" ")[0]}
          </span>
        </div>
      </div>

      <h4 className="sub-activity-heading">{submission.activityName}</h4>
      <p className="sub-desc-snippet">{submission.activityDescription || submission.reflection}</p>

      {/* Evidence preview tags */}
      <div className="sub-evidence-strip">
        {submission.photos && submission.photos.length > 0 && (
          <span className="ev-badge photo-ev">
            <Image size={13} /> {submission.photos.length} Photo{submission.photos.length > 1 ? "s" : ""}
          </span>
        )}
        {submission.videos && submission.videos.length > 0 && (
          <span className="ev-badge video-ev">
            <Video size={13} /> Video Clip
          </span>
        )}
        {submission.wasteCollectedKg > 0 && (
          <span className="ev-badge waste-ev">
            <Recycle size={13} /> {submission.wasteCollectedKg} kg Diverted
          </span>
        )}
        {submission.hoursSpent > 0 && (
          <span className="ev-badge time-ev">
            <Clock size={13} /> {submission.hoursSpent} hrs
          </span>
        )}
      </div>

      {submission.evaluatorFeedback && (
        <div className="coordinator-feedback-quote">
          <span className="quote-lbl">Jury / Coordinator Note:</span>
          <p>"{submission.evaluatorFeedback}"</p>
        </div>
      )}

      {/* Actions Row */}
      <div className="sub-actions-bottom">
        <div className="sub-points-allotment">
          <Award size={15} className="text-amber-400" />
          <span>{submission.points || 100} pts</span>
        </div>

        <div className="sub-btn-group">
          <Link
            to={`/coordinator/submissions/${submission.id}`}
            className="btn-action-view"
            title="Inspect Submission Details"
          >
            <Eye size={15} />
            <span>View</span>
          </Link>

          {submission.status === "Pending" && (
            <>
              <button
                type="button"
                className="btn-action-approve"
                onClick={() => onApprove && onApprove(submission.id, submission.points)}
                title="Approve & Award Points"
              >
                <CheckCircle size={15} />
                <span>Approve</span>
              </button>

              <button
                type="button"
                className="btn-action-reject"
                onClick={() => onReject ? onReject(submission.id) : (onOpenFeedback && onOpenFeedback(submission))}
                title="Reject with Feedback"
              >
                <XCircle size={15} />
                <span>Reject</span>
              </button>

              <button
                type="button"
                className="btn-action-feedback"
                onClick={() => onOpenFeedback && onOpenFeedback(submission)}
                title="Send Feedback / Request Changes"
              >
                <MessageSquareQuote size={15} />
                <span>Feedback</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;


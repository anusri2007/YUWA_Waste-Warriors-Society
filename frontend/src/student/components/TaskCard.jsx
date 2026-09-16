import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Award, CheckCircle, FileText, ArrowRight, Upload, Clock, AlertCircle } from "lucide-react";

const TaskCard = ({ task }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
      case "Completed":
        return <span className="task-status-badge badge-approved"><CheckCircle size={13} /> {status}</span>;
      case "Under Review":
        return <span className="task-status-badge badge-review"><Clock size={13} /> Under Review</span>;
      case "Submitted":
        return <span className="task-status-badge badge-submitted"><CheckCircle size={13} /> Submitted</span>;
      case "In Progress":
        return <span className="task-status-badge badge-progress"><Clock size={13} /> In Progress</span>;
      case "Rejected":
        return <span className="task-status-badge badge-rejected"><AlertCircle size={13} /> Needs Resubmission</span>;
      default:
        return <span className="task-status-badge badge-not-started">Not Started</span>;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Clean-up drives": return "cat-cleanup";
      case "Waste segregation": return "cat-segregation";
      case "Street plays": return "cat-plays";
      case "Poster making": return "cat-poster";
      case "Waste recovery": return "cat-recovery";
      case "Community interaction": return "cat-community";
      default: return "cat-awareness";
    }
  };

  return (
    <div className="eco-task-card">
      <div className="task-card-header">
        <div className="task-category-row">
          <span className={`task-cat-pill ${getCategoryColor(task.category)}`}>
            {task.category}
          </span>
          <span className="task-points-pill">
            <Award size={14} className="text-amber-500" />
            <strong>+{task.points} pts</strong>
          </span>
        </div>

        {getStatusBadge(task.status)}
      </div>

      <div className="task-card-body">
        <h3 className="task-card-title">{task.title}</h3>
        <p className="task-card-description">{task.description}</p>

        {task.requiredEvidence && task.requiredEvidence.length > 0 && (
          <div className="task-evidence-preview">
            <span className="evidence-preview-label">
              <FileText size={13} /> Required Evidence:
            </span>
            <ul className="evidence-preview-list">
              {task.requiredEvidence.slice(0, 2).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              {task.requiredEvidence.length > 2 && (
                <li className="text-muted">+{task.requiredEvidence.length - 2} more requirements</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="task-card-footer">
        <div className="task-deadline-info">
          <Calendar size={14} className="text-muted" />
          <span>Deadline: <strong>{task.deadline}</strong></span>
        </div>

        <div className="task-action-btns">
          <Link
            to={`/student/tasks/${task.id}`}
            className="btn-task-details"
            title="View Full Task Details"
          >
            View Details
          </Link>

          {task.status !== "Approved" && task.status !== "Completed" && (
            <Link
              to={`/student/submit/${task.id}`}
              className="btn-task-submit"
              title="Submit Evidence for this task"
            >
              <Upload size={14} />
              <span>{task.status === "Rejected" ? "Resubmit" : "Submit"}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

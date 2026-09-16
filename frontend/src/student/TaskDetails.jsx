import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  FileText,
  Upload,
  ArrowLeft,
  ShieldCheck,
  ListOrdered,
  Sparkles
} from "lucide-react";
import { useStudent } from "./StudentContext";

const TaskDetails = ({ taskId }) => {
  const { tasks, selectedTaskId } = useStudent();
  const navigate = useNavigate();

  // Find task by props id or context selectedTaskId or default to first available
  const activeId = taskId || selectedTaskId || tasks[0]?.id;
  const task = tasks.find((t) => t.id === activeId) || tasks[0];

  if (!task) {
    return (
      <div className="task-details-subview glass-card">
        <h3>No task selected</h3>
        <Link to="/student/tasks/available" className="eco-btn-primary">
          Browse Available Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="task-details-subview">
      {/* Back button */}
      <div className="details-nav-row">
        <button
          type="button"
          className="btn-back-to-tasks"
          onClick={() => navigate("/student/tasks")}
        >
          <ArrowLeft size={16} />
          <span>Back to All Tasks</span>
        </button>
      </div>

      {/* Main Task Detail Card */}
      <div className="task-detail-main-card glass-card">
        <div className="detail-top-strip">
          <div className="detail-cat-badges">
            <span className="task-cat-pill-glass">{task.category}</span>
            <span className="diff-badge diff-med">{task.difficulty || "Standard"}</span>
          </div>

          <div className="detail-points-box">
            <Award size={18} className="text-amber-400" />
            <span>+{task.points} Points</span>
          </div>
        </div>

        <h1 className="detail-task-title">{task.title}</h1>
        <p className="detail-task-desc">{task.description}</p>

        {/* 3 Overview Info Tiles */}
        <div className="detail-info-tiles-grid">
          <div className="detail-tile">
            <Calendar size={18} className="text-cyan-400" />
            <div>
              <span className="tile-hdr">Submission Deadline</span>
              <strong className="tile-txt">{task.deadline}</strong>
            </div>
          </div>

          <div className="detail-tile">
            <Clock size={18} className="text-emerald-400" />
            <div>
              <span className="tile-hdr">Estimated Time</span>
              <strong className="tile-txt">{task.estimatedHours || "3-4 hours"}</strong>
            </div>
          </div>

          <div className="detail-tile">
            <ShieldCheck size={18} className="text-purple-400" />
            <div>
              <span className="tile-hdr">Current Status</span>
              <strong className="tile-txt text-emerald-300">{task.status}</strong>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="detail-section-block">
          <div className="block-title-row">
            <ListOrdered size={18} className="text-emerald-400" />
            <h3>Execution Instructions</h3>
          </div>
          <div className="instructions-body">
            {task.instructions ? (
              <pre className="instructions-pre">{task.instructions}</pre>
            ) : (
              <p>Follow standard field safety protocols and coordinate with your squad leader.</p>
            )}
          </div>
        </div>

        {/* Requirements & Evidence Needed */}
        <div className="detail-section-block">
          <div className="block-title-row">
            <FileText size={18} className="text-cyan-400" />
            <h3>Evidence & Verification Requirements</h3>
          </div>

          <ul className="requirements-check-list">
            {(task.requirements || [
              "High-resolution before and after photographs",
              "Weigh scale readout or attendance verification log",
              "Brief 150-word written reflection on community impact"
            ]).map((req, i) => (
              <li key={i}>
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Submission Guidelines Note */}
        {task.submissionRequirements && (
          <div className="submission-guide-box">
            <Sparkles size={16} className="text-amber-400" />
            <span>Submission Note: {task.submissionRequirements}</span>
          </div>
        )}

        {/* Submit Action CTA */}
        <div className="detail-cta-row">
          <Link
            to="/student/submit"
            state={{ taskId: task.id }}
            className="eco-btn-primary detail-submit-btn"
          >
            <Upload size={18} />
            <span>Submit Activity Evidence</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

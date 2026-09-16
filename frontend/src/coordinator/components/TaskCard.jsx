import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Award, Users, CheckCircle2, ArrowRight, Edit3 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const TaskCard = ({ task, onEdit }) => {
  return (
    <div className="coordinator-task-card glass-card">
      <div className="task-card-top-row">
        <div className="task-cat-difficulty-group">
          <span className="task-cat-pill">{task.category}</span>
          <span className="task-diff-pill">{task.difficulty || "Standard"}</span>
        </div>
        <StatusBadge status={task.status} size="small" />
      </div>

      <h3 className="task-card-title">{task.title}</h3>
      <p className="task-card-desc">{task.description}</p>

      <div className="task-card-kpi-row">
        <div className="task-kpi">
          <Calendar size={13} className="text-cyan-400" />
          <span>Due: <strong>{task.deadline}</strong></span>
        </div>

        <div className="task-kpi">
          <Award size={13} className="text-amber-400" />
          <span>Reward: <strong>+{task.points} pts</strong></span>
        </div>

        <div className="task-kpi">
          <Users size={13} className="text-purple-400" />
          <span><strong>{task.participants || 0}</strong> Volunteers</span>
        </div>
      </div>

      <div className="task-completion-rate-box">
        <div className="rate-hdr">
          <span>Squad Completion Pace</span>
          <strong>{task.completionRate || 65}%</strong>
        </div>
        <div className="rate-track">
          <div className="rate-fill" style={{ width: `${task.completionRate || 65}%` }} />
        </div>
      </div>

      <div className="task-card-actions">
        <Link to={`/coordinator/tasks/${task.id}`} className="btn-view-task-glass">
          <span>Manage Task</span>
          <ArrowRight size={14} />
        </Link>

        {onEdit && (
          <button
            type="button"
            className="btn-edit-task-icon"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Edit3 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;


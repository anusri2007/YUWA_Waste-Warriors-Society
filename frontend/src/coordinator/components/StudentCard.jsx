import React from "react";
import { Link } from "react-router-dom";
import { Building2, Users, Award, CheckCircle2, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

const StudentCard = ({ student }) => {
  return (
    <div className="coordinator-student-card glass-card">
      <div className="card-top-header">
        <div className="student-avatar-ring">
          <img
            src={student.avatar}
            alt={student.name}
            className="student-avatar-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="avatar-fallback">{student.name.charAt(0)}</div>
          <span className="online-indicator" />
        </div>

        <div className="student-header-info">
          <h4 className="student-name">{student.name}</h4>
          <span className="student-course">{student.course || "Environmental Engineering"}</span>
          <span className="student-college-name">
            <Building2 size={13} /> {student.college}
          </span>
        </div>

        <StatusBadge status={student.status || "Active"} size="small" />
      </div>

      <div className="student-metrics-grid">
        <div className="s-metric-box">
          <span className="s-metric-lbl">Total Points</span>
          <strong className="s-metric-val text-amber-400">
            <Award size={14} /> {student.points ? student.points.toLocaleString() : "0"}
          </strong>
        </div>

        <div className="s-metric-box">
          <span className="s-metric-lbl">Tasks Completed</span>
          <strong className="s-metric-val text-emerald-400">
            <CheckCircle2 size={14} /> {student.tasksCompleted || 0}
          </strong>
        </div>

        <div className="s-metric-box">
          <span className="s-metric-lbl">Current Rank</span>
          <strong className="s-metric-val text-cyan-400">#{student.rank || "—"}</strong>
        </div>

        <div className="s-metric-box">
          <span className="s-metric-lbl">Squad / Team</span>
          <strong className="s-metric-val text-purple-300">
            <Users size={14} /> {student.team || "Independent"}
          </strong>
        </div>
      </div>

      <div className="card-footer-actions">
        <Link to={`/coordinator/students/${student.id}`} className="btn-view-profile-glass">
          <span>View Student Dossier</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default StudentCard;


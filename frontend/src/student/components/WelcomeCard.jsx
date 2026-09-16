import React from "react";
import { Link } from "react-router-dom";
import { Award, Users, Building2, CheckCircle, ArrowRight, Leaf } from "lucide-react";

const WelcomeCard = ({ student }) => {
  return (
    <div className="eco-welcome-card">
      <div className="welcome-main-info">
        <div className="welcome-tag-badge">
          <Leaf size={14} className="text-emerald-300" />
          <span>YUWA Ecolympics 2026</span>
        </div>

        <h2 className="welcome-heading">
          Welcome back, {student?.name || "Student"}! 🌱
        </h2>

        <div className="welcome-details-grid">
          <div className="welcome-meta-item">
            <span className="meta-label">College</span>
            <span className="meta-value">
              <Building2 size={15} /> {student?.college}
            </span>
          </div>

          <div className="welcome-meta-item">
            <span className="meta-label">Team</span>
            <span className="meta-value">
              <Users size={15} /> {student?.team}
            </span>
          </div>

          <div className="welcome-meta-item">
            <span className="meta-label">Competition</span>
            <span className="meta-value">
              <Award size={15} /> {student?.competition || "Ecolympics"}
            </span>
          </div>

          <div className="welcome-meta-item">
            <span className="meta-label">Status</span>
            <span className="status-chip active-chip">
              <span className="chip-dot" /> {student?.status || "Active"}
            </span>
          </div>
        </div>

        <div className="welcome-cta-row">
          <Link to="/student/tasks" className="eco-btn-primary">
            <span>Explore Environmental Tasks</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/student/submit" className="eco-btn-secondary">
            <span>Submit Evidence</span>
          </Link>
        </div>
      </div>

      <div className="welcome-rank-highlight">
        <div className="rank-badge-circle">
          <span className="rank-label">Current Rank</span>
          <span className="rank-number">#{student?.rank || 8}</span>
          <span className="rank-movement text-emerald-300">
            ↑ Moved up from #{student?.previousRank || 11}
          </span>
        </div>
        <div className="team-leader-note">
          <span>Team Leader: <strong>{student?.teamLeader}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;

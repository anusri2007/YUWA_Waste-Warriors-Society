import React from "react";
import { Link } from "react-router-dom";
import { Users, Award, Trophy, Recycle, ArrowRight, Shield } from "lucide-react";
import StatusBadge from "./StatusBadge";

const TeamCard = ({ team }) => {
  return (
    <div className="coordinator-team-card glass-card">
      <div className="team-card-top-row">
        <div>
          <span className="team-code-pill">{team.code || "TEAM"}</span>
          <h3 className="team-card-name">{team.name}</h3>
          <p className="team-college-sub">{team.college}</p>
        </div>
        <div className="team-rank-badge">
          <Trophy size={16} className="text-amber-400" />
          <span>Rank #{team.rank || "—"}</span>
        </div>
      </div>

      <div className="team-leader-strip">
        <Shield size={14} className="text-emerald-400" />
        <span>Squad Leader: <strong>{team.leader || "Captain"}</strong></span>
      </div>

      <div className="team-stats-strip">
        <div className="t-stat-cell">
          <span className="t-lbl">Points</span>
          <strong className="t-val text-amber-400">{team.points ? team.points.toLocaleString() : "0"}</strong>
        </div>
        <div className="t-stat-cell">
          <span className="t-lbl">Members</span>
          <strong className="t-val text-cyan-400">{team.membersCount || (team.members ? team.members.length : 4)} Active</strong>
        </div>
        <div className="t-stat-cell">
          <span className="t-lbl">Tasks Done</span>
          <strong className="t-val text-emerald-400">{team.completedTasks || 0}</strong>
        </div>
        <div className="t-stat-cell">
          <span className="t-lbl">Waste (kg)</span>
          <strong className="t-val text-purple-300">{team.wasteDivertedKg || 0} kg</strong>
        </div>
      </div>

      <div className="team-progress-bar-section">
        <div className="team-prog-lbl-row">
          <span>Squad Progress</span>
          <strong>{team.progress || 75}%</strong>
        </div>
        <div className="team-prog-track">
          <div className="team-prog-fill" style={{ width: `${team.progress || 75}%` }} />
        </div>
      </div>

      <div className="team-card-actions">
        <Link to={`/coordinator/teams/${team.id}`} className="eco-btn-primary full-width-btn">
          <span>View Team Performance</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;


import React, { useState } from "react";
import {
  Users,
  Trophy,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  Mail,
  Shield,
  Sparkles,
  ArrowRight,
  UserCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { useStudent } from "./StudentContext";
import "./MyTeam.css";

const MyTeam = () => {
  const { team } = useStudent();
  const [selectedMember, setSelectedMember] = useState(null);

  const handleNudge = (name) => {
    toast.success(`Sent encouragement nudge to ${name}! 🌿`, { icon: "💚" });
  };

  return (
    <div className="my-team-page">
      {/* Team Header Glass Hero */}
      <section className="team-hero-glass glass-card">
        <div className="team-hero-header-row">
          <div className="team-main-titles">
            <span className="team-code-badge">{team.code}</span>
            <h1 className="team-headline">{team.name}</h1>
            <p className="team-college-sub">{team.college}</p>
          </div>

          <div className="team-leader-tag">
            <Shield size={16} className="text-amber-400" />
            <span>Team Leader: <strong>{team.leader}</strong></span>
          </div>
        </div>

        {/* 3 Core Team KPIs */}
        <div className="team-kpis-grid">
          <div className="team-kpi-card">
            <div className="kpi-icon-wrap icon-amber">
              <Award size={22} />
            </div>
            <div>
              <span className="kpi-label">Cumulative Team Points</span>
              <div className="kpi-value text-amber-400">{team.points.toLocaleString()} pts</div>
              <span className="kpi-hint">Avg {Math.round(team.points / team.members.length)} pts / member</span>
            </div>
          </div>

          <div className="team-kpi-card">
            <div className="kpi-icon-wrap icon-emerald">
              <Trophy size={22} />
            </div>
            <div>
              <span className="kpi-label">National Team Rank</span>
              <div className="kpi-value text-emerald-400">Rank #{team.rank}</div>
              <span className="kpi-hint">Top 10 League Qualifiers</span>
            </div>
          </div>

          <div className="team-kpi-card">
            <div className="kpi-icon-wrap icon-cyan">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="kpi-label">Collective Progress</span>
              <div className="kpi-value text-cyan-400">{team.progress}%</div>
              <span className="kpi-hint">{team.completedTasks} completed • {team.pendingTasks} pending</span>
            </div>
          </div>
        </div>

        {/* Team Progress Track */}
        <div className="team-progress-bar-wrap">
          <div className="prog-header-line">
            <span>Team Task Completion Goal</span>
            <strong>{team.progress}% Achieved</strong>
          </div>
          <div className="prog-track-bg">
            <div className="prog-track-fill" style={{ width: `${team.progress}%` }} />
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="team-members-section">
        <div className="section-title-bar">
          <div className="title-with-icon">
            <Users size={20} className="text-emerald-400" />
            <h2>Team Members ({team.members.length})</h2>
          </div>
          <span className="text-muted text-sm">4 / 4 Squad Positions Filled</span>
        </div>

        <div className="team-members-grid">
          {team.members.map((member) => (
            <div
              key={member.id}
              className={`member-glass-card glass-card ${member.isCurrentUser ? "current-user-card" : ""}`}
            >
              {member.isCurrentUser && (
                <span className="you-pill-ribbon">You</span>
              )}

              <div className="member-card-top">
                <div className="member-avatar-wrapper">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="member-avatar-photo"
                  />
                  <span className="member-online-dot" />
                </div>

                <div className="member-name-group">
                  <h3 className="member-card-name">{member.name}</h3>
                  <span className="member-card-role">{member.role}</span>
                </div>
              </div>

              <div className="member-card-stats-row">
                <div className="m-stat-box">
                  <span className="m-stat-label">Points</span>
                  <strong className="m-stat-val text-amber-400">{member.points}</strong>
                </div>
                <div className="m-stat-box">
                  <span className="m-stat-label">Tasks Done</span>
                  <strong className="m-stat-val text-emerald-400">{member.tasksDone}</strong>
                </div>
              </div>

              <div className="member-card-footer">
                <button
                  type="button"
                  className="btn-view-member"
                  onClick={() => setSelectedMember(member)}
                >
                  View Member
                </button>

                {!member.isCurrentUser && (
                  <button
                    type="button"
                    className="btn-nudge-member"
                    onClick={() => handleNudge(member.name)}
                    title="Send an eco nudge"
                  >
                    Nudge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="team-modal-backdrop" onClick={() => setSelectedMember(null)}>
          <div className="team-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-member-header">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="modal-avatar"
              />
              <div>
                <h3>{selectedMember.name}</h3>
                <span className="modal-role">{selectedMember.role}</span>
                <p className="modal-team-sub">{team.name} • {team.college}</p>
              </div>
            </div>

            <div className="modal-stats-strip">
              <div className="m-strip-col">
                <span>Individual Points</span>
                <strong>{selectedMember.points} pts</strong>
              </div>
              <div className="m-strip-col">
                <span>Tasks Completed</span>
                <strong>{selectedMember.tasksDone} verified</strong>
              </div>
              <div className="m-strip-col">
                <span>Team Contribution</span>
                <strong>{Math.round((selectedMember.points / team.points) * 100)}%</strong>
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                type="button"
                className="eco-btn-primary"
                onClick={() => {
                  handleNudge(selectedMember.name);
                  setSelectedMember(null);
                }}
              >
                Send Cheer / Nudge
              </button>
              <button
                type="button"
                className="eco-btn-secondary"
                onClick={() => setSelectedMember(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, Trophy, Award, Sparkles, User } from "lucide-react";
import { useStudent } from "../StudentContext";

const StudentHeader = ({ onToggleMobileSidebar }) => {
  const { student, competition } = useStudent();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/student/competition")) return "Active Competition";
    if (path.includes("/student/team")) return "My Team Roster";
    if (path.includes("/student/points")) return "Points & Rewards Breakdown";
    if (path.includes("/student/progress")) return "Impact & Progress Dashboard";
    if (path.includes("/student/tasks/available")) return "Available Tasks";
    if (path.includes("/student/tasks/details")) return "Task Guidelines & Details";
    if (path.includes("/student/tasks/completed")) return "Completed Tasks Archive";
    if (path.includes("/student/tasks")) return "Eco Challenges & Tasks";
    if (path.includes("/student/submit")) return "Submit Field Activity Evidence";
    if (path.includes("/student/submissions")) return "My Submission History";
    if (path.includes("/student/leaderboard")) return "Championship Leaderboard";
    if (path.includes("/student/profile")) return "Student Profile & Badges";
    return "Student Dashboard";
  };

  return (
    <header className="glass-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-title-wrapper">
          <h1 className="header-page-title">{getPageTitle()}</h1>
          <span className="header-breadcrumb">
            YUWA Ecolympics • {student.college.split(" ")[0]} • {student.team}
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Gamified Stats */}
        <div className="header-stat-capsule points-capsule">
          <Award size={15} className="text-amber-400" />
          <span className="capsule-val">{student.points.toLocaleString()}</span>
          <span className="capsule-label">pts</span>
        </div>

        <div className="header-stat-capsule rank-capsule">
          <Trophy size={15} className="text-emerald-400" />
          <span className="capsule-val">Rank #{student.rank}</span>
        </div>

        {/* Days Left Chip */}
        <div className="days-left-chip">
          <Sparkles size={14} className="text-cyan-400" />
          <span>{competition.daysRemaining} Days Left</span>
        </div>

        {/* Profile Avatar Quick Button */}
        <Link to="/student/profile" className="header-avatar-btn" title="View Profile">
          <img
            src={student.avatar}
            alt={student.name}
            className="header-avatar-thumb"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="header-avatar-fallback">{student.name.charAt(0)}</div>
        </Link>
      </div>
    </header>
  );
};

export default StudentHeader;

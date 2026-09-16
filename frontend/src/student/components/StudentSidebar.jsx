import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Trophy,
  Users,
  Award,
  TrendingUp,
  ListTodo,
  CheckCircle2,
  FileText,
  Upload,
  FileCheck,
  User,
  LogOut,
  X,
  Leaf,
  Sparkles,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import { useStudent } from "../StudentContext";

const StudentSidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { student } = useStudent();
  const navigate = useNavigate();

  const navGroups = [
    {
      group: "MAIN",
      items: [
        { label: "Home", path: "/student/home", icon: Home },
        { label: "Active Competition", path: "/student/competition", icon: Sparkles, badge: "LIVE" },
        { label: "My Team", path: "/student/team", icon: Users },
        { label: "My Points", path: "/student/points", icon: Award },
        { label: "Progress", path: "/student/progress", icon: TrendingUp }
      ]
    },
    {
      group: "TASKS & ACTION",
      items: [
        { label: "All Tasks", path: "/student/tasks", icon: ListTodo },
        { label: "Available Tasks", path: "/student/tasks/available", icon: CheckCircle2 },
        { label: "Task Details", path: "/student/tasks/details", icon: FileText },
        { label: "Completed Tasks", path: "/student/tasks/completed", icon: CheckCircle2 },
        { label: "Submit Activity", path: "/student/submit", icon: Upload, highlight: true },
        { label: "My Submissions", path: "/student/submissions", icon: FileCheck }
      ]
    },
    {
      group: "STANDINGS & ACCOUNT",
      items: [
        { label: "Leaderboard", path: "/student/leaderboard", icon: Trophy },
        { label: "Profile", path: "/student/profile", icon: User }
      ]
    }
  ];

  const handleLogout = () => {
    toast.success("Logged out successfully. Keep championing the planet!", { icon: "🌍" });
    if (onCloseMobile) onCloseMobile();
    navigate("/student/home");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="glass-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-label="Close menu overlay"
        />
      )}

      <aside className={`glass-sidebar ${isMobileOpen ? "open" : ""}`}>
        {/* Logo Branding */}
        <div className="sidebar-brand">
          <div className="brand-leaf-halo">
            <Leaf size={22} className="text-emerald-400" />
          </div>
          <div className="brand-text-block">
            <h2 className="brand-title">YUWA</h2>
            <span className="brand-subtitle">Ecolympics 2026</span>
          </div>

          <button
            type="button"
            className="mobile-close-btn"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mini Student Profile Card */}
        <div className="sidebar-profile-card" onClick={() => { navigate("/student/profile"); if (onCloseMobile) onCloseMobile(); }}>
          <div className="sidebar-avatar-ring">
            <img
              src={student.avatar}
              alt={student.name}
              className="sidebar-avatar-img"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className="avatar-fallback-letter">
              {student.name.charAt(0)}
            </div>
            <span className="status-dot-active" />
          </div>

          <div className="sidebar-profile-info">
            <h4 className="profile-name">{student.name}</h4>
            <span className="profile-team">{student.team}</span>
            <div className="profile-quick-stats">
              <span className="pill-pts">{student.points} pts</span>
              <span className="pill-rank">Rank #{student.rank}</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="sidebar-scrollable-nav">
          {navGroups.map((grp) => (
            <div key={grp.group} className="nav-group-section">
              <span className="nav-group-heading">{grp.group}</span>
              <div className="nav-items-stack">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `glass-nav-item ${isActive ? "nav-active" : ""} ${
                          item.highlight ? "nav-highlight-cta" : ""
                        }`
                      }
                    >
                      <Icon size={18} className="nav-item-icon" />
                      <span className="nav-item-label">{item.label}</span>
                      {item.badge && (
                        <span className="nav-live-badge">{item.badge}</span>
                      )}
                      <ChevronRight size={14} className="nav-item-arrow" />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Footer */}
        <div className="sidebar-footer-box">
          <button
            type="button"
            className="glass-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;

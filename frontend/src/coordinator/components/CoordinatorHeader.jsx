import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Sparkles,
  Award,
  Users,
  ChevronDown,
  X,
  FileCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { useCoordinator } from "../CoordinatorContext";

const CoordinatorHeader = ({ onToggleMobileSidebar }) => {
  const { coordinator, stats, notifications, markAllNotificationsRead } = useCoordinator();
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const unreadNotifs = notifications.filter((n) => !n.read);

  const getPageHeading = () => {
    const p = location.pathname;
    if (p.includes("/coordinator/students/")) return "Student Profile & Dossier";
    if (p.includes("/coordinator/students")) return "Student Participation Directory";
    if (p.includes("/coordinator/teams/")) return "Squad Performance & Roster";
    if (p.includes("/coordinator/teams")) return "Active Teams Management";
    if (p.includes("/coordinator/competition")) return "Championship Overview & Milestones";
    if (p.includes("/coordinator/tasks/create")) return "Create New Challenge";
    if (p.includes("/coordinator/tasks/")) return "Task Configuration & Submissions";
    if (p.includes("/coordinator/tasks")) return "Task Library & Challenge Monitor";
    if (p.includes("/coordinator/submissions/")) return "Submission Verification & Scoring";
    if (p.includes("/coordinator/submissions")) return "Field Activity Submissions Review";
    if (p.includes("/coordinator/leaderboard")) return "National Championship Leaderboard";
    if (p.includes("/coordinator/points")) return "Points Allocation & Score Audits";
    if (p.includes("/coordinator/progress")) return "Ecolympics Progress & Milestones";
    if (p.includes("/coordinator/colleges")) return "Participating Colleges & Campuses";
    if (p.includes("/coordinator/analytics")) return "Analytics, Insights & Impact Metrics";
    if (p.includes("/coordinator/notifications")) return "Communications & Alert Center";
    if (p.includes("/coordinator/profile")) return "Coordinator Profile & Credentials";
    return "Coordinator Dashboard";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    navigate(`/coordinator/students?search=${encodeURIComponent(globalSearch.trim())}`);
  };

  return (
    <header className="coordinator-glass-header">
      <div className="header-left-group">
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        <div className="header-titles-block">
          <h1 className="header-page-title">{getPageHeading()}</h1>
          <span className="header-sub-breadcrumb">
            YUWA Ecolympics 2026 • Coordinator Command Portal
          </span>
        </div>
      </div>

      <div className="header-right-group">
        {/* Global Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="header-search-form desktop-only">
          <Search size={16} className="search-icon-glass" />
          <input
            type="text"
            placeholder="Search students, squads, tasks..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
          {globalSearch && (
            <button
              type="button"
              className="btn-clear-header-search"
              onClick={() => setGlobalSearch("")}
            >
              <X size={13} />
            </button>
          )}
        </form>

        {/* Pending Submissions Quick Pill */}
        {stats.pendingSubmissions > 0 && (
          <Link
            to="/coordinator/submissions"
            className="pending-submissions-pill"
            title="Review pending submissions"
          >
            <span className="live-ping-dot" />
            <FileCheck size={14} />
            <span>{stats.pendingSubmissions} Pending Reviews</span>
          </Link>
        )}

        {/* Notifications Dropdown Trigger */}
        <div className="header-notif-wrapper">
          <button
            type="button"
            className={`header-icon-btn ${showNotifDropdown ? "active" : ""}`}
            onClick={() => {
              setShowNotifDropdown((prev) => !prev);
              setShowProfileDropdown(false);
            }}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotifs.length > 0 && (
              <span className="notif-count-badge">{unreadNotifs.length}</span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifDropdown && (
            <div className="header-dropdown-panel notif-dropdown glass-card">
              <div className="dropdown-panel-header">
                <div>
                  <h4>Notifications</h4>
                  <span className="text-xs text-muted">{unreadNotifs.length} unread alerts</span>
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    type="button"
                    className="btn-mark-read-mini"
                    onClick={markAllNotificationsRead}
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="dropdown-notif-list">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className={`dropdown-notif-item ${!n.read ? "unread" : ""}`}
                    onClick={() => {
                      setShowNotifDropdown(false);
                      if (n.link) navigate(n.link);
                    }}
                  >
                    <div className="notif-item-header">
                      <strong className="notif-item-title">{n.title}</strong>
                      <span className="notif-item-time">{n.time}</span>
                    </div>
                    <p className="notif-item-msg">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="dropdown-panel-footer">
                <Link
                  to="/coordinator/notifications"
                  onClick={() => setShowNotifDropdown(false)}
                  className="dropdown-footer-link"
                >
                  View All Notifications Center
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Coordinator Profile Trigger & Dropdown */}
        <div className="header-profile-wrapper">
          <button
            type="button"
            className="header-profile-btn"
            onClick={() => {
              setShowProfileDropdown((prev) => !prev);
              setShowNotifDropdown(false);
            }}
          >
            <div className="profile-btn-avatar">
              <img
                src={coordinator.avatar}
                alt={coordinator.name}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <span>{coordinator.name.charAt(0)}</span>
            </div>

            <div className="profile-btn-text desktop-only">
              <span className="profile-btn-name">{coordinator.name.split(" ")[0]}</span>
              <span className="profile-btn-role">Coordinator</span>
            </div>

            <ChevronDown size={14} className="desktop-only text-muted" />
          </button>

          {/* Profile Dropdown Panel */}
          {showProfileDropdown && (
            <div className="header-dropdown-panel profile-dropdown glass-card">
              <div className="dropdown-user-info">
                <div className="dropdown-user-avatar">
                  <img src={coordinator.avatar} alt={coordinator.name} />
                </div>
                <div>
                  <strong>{coordinator.name}</strong>
                  <span className="text-xs text-muted block">{coordinator.email}</span>
                  <span className="role-tag-pill">{coordinator.role}</span>
                </div>
              </div>

              <div className="dropdown-menu-list">
                <Link
                  to="/coordinator/profile"
                  className="dropdown-menu-item"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <User size={16} />
                  <span>Coordinator Profile & Settings</span>
                </Link>

                <Link
                  to="/coordinator/submissions"
                  className="dropdown-menu-item"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <FileCheck size={16} />
                  <span>Submissions Queue ({stats.pendingSubmissions})</span>
                </Link>

                <Link
                  to="/coordinator/competition"
                  className="dropdown-menu-item"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <Sparkles size={16} />
                  <span>Competition Milestones</span>
                </Link>
              </div>

              <div className="dropdown-panel-footer">
                <button
                  type="button"
                  className="dropdown-logout-btn"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    toast.success("Logged out of Coordinator Session.");
                    navigate("/coordinator/dashboard");
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CoordinatorHeader;


import React from "react";
import {
  Menu,
  Search,
  Bell,
  Sparkles
} from "lucide-react";
import "./Navbar.css";

const Navbar = ({
  activeTab,
  setActiveTab,
  setIsMobileOpen,
  student,
  unreadCount = 0,
  searchQuery = "",
  setSearchQuery
}) => {
  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "profile":
        return "Student Profile";
      case "courses":
        return "Enrolled Courses";
      case "progress":
        return "Academic Progress";
      case "tasks":
        return "Assignments & Tasks";
      case "notifications":
        return "Notifications & Alerts";
      default:
        return "Student Portal";
    }
  };

  return (
    <header className="portal-navbar">
      <div className="navbar-left">
        <button
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-heading">
          <h1>{getPageTitle()}</h1>
          <span className="navbar-subheading">
            Welcome back, {student?.name?.split(" ")[0] || "Student"}
          </span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="navbar-search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search courses, tasks, syllabus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        <div className="term-pill">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Sem 6 • Spring 2026</span>
        </div>

        <button
          className="navbar-icon-btn"
          onClick={() => setActiveTab("notifications")}
          title="View Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="navbar-notif-dot">{unreadCount}</span>
          )}
        </button>

        <div
          className="navbar-profile-chip"
          onClick={() => setActiveTab("profile")}
          title="View My Profile"
          role="button"
          tabIndex={0}
        >
          <div className="profile-avatar-wrapper">
            <img
              src={student?.avatar}
              alt={student?.name || "Student"}
              className="navbar-avatar-img"
              onError={(e) => {
                // Fallback to initials if image doesn't load
                e.target.style.display = "none";
              }}
            />
            <div className="avatar-fallback">
              {student?.name ? student.name.charAt(0) : "S"}
            </div>
            <span className="online-indicator" />
          </div>

          <div className="profile-chip-info">
            <span className="profile-chip-name">{student?.name || "Student"}</span>
            <span className="profile-chip-id">{student?.studentId}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Bell, User, LogOut, Menu } from "lucide-react";
import toast from "react-hot-toast";

const StudentNavbar = ({
  student,
  unreadCount = 0,
  onToggleMobileSidebar
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully. See you soon, Eco-Warrior!");
    navigate("/student");
  };

  return (
    <header className="student-portal-navbar">
      <div className="navbar-brand-section">
        <button
          type="button"
          className="mobile-sidebar-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/student" className="navbar-logo-link">
          <div className="navbar-leaf-badge">
            <Leaf size={20} />
          </div>
          <div className="navbar-brand-text">
            <span className="brand-title">YUWA Ecolympics</span>
            <span className="brand-sub desktop-only">Student Dashboard</span>
          </div>
        </Link>
      </div>

      <div className="navbar-center-info desktop-only">
        <div className="student-college-pill">
          <span className="pill-dot" />
          <span className="college-title" title={student?.college}>
            {student?.college}
          </span>
          <span className="team-pill-badge">{student?.team}</span>
        </div>
      </div>

      <div className="navbar-actions-section">
        {/* Notifications Icon with Badge */}
        <Link
          to="/student/notifications"
          className="navbar-action-btn notif-btn"
          title="Notifications & Alerts"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notif-counter-badge">{unreadCount}</span>
          )}
        </Link>

        {/* Profile Avatar / Link */}
        <Link
          to="/student/profile"
          className="navbar-profile-trigger"
          title="My Profile"
        >
          <div className="navbar-avatar-circle">
            {student?.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="navbar-avatar-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : null}
            <span className="avatar-letter">
              {student?.name ? student.name.charAt(0) : "S"}
            </span>
          </div>

          <div className="navbar-user-text desktop-only">
            <span className="nav-user-name">{student?.name || "Student"}</span>
            <span className="nav-user-rank">Rank #{student?.rank || 8}</span>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          className="navbar-logout-btn"
          onClick={handleLogout}
          title="Logout of YUWA Ecolympics"
        >
          <LogOut size={18} />
          <span className="desktop-only">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default StudentNavbar;

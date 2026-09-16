import React from "react";
import {
  LayoutDashboard,
  User,
  BookOpen,
  TrendingUp,
  CheckSquare,
  Bell,
  LogOut,
  X,
  GraduationCap
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  unreadCount = 0,
  onLogout
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: User },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside className={`portal-sidebar ${isMobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-badge">
            <div className="brand-icon">
              <GraduationCap size={24} />
            </div>
            <div className="brand-text">
              <h2>YUWA Portal</h2>
              <span>Student Hub</span>
            </div>
          </div>

          <button
            className="sidebar-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-nav-container">
          <span className="nav-group-title">MAIN NAVIGATION</span>
          <nav className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon className="nav-icon" size={20} />
                  <span className="nav-label">{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="portal-version-card">
            <p className="version-title">Academic Session</p>
            <p className="version-subtitle">2025-26 (Sem VI)</p>
          </div>

          <button
            type="button"
            className="logout-nav-btn"
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

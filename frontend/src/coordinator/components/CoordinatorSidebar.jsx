import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Trophy,
  ListTodo,
  UploadCloud,
  Medal,
  BarChart3,
  School,
  Award,
  TrendingUp,
  Bell,
  User,
  LogOut,
  X,
  Leaf,
  ChevronRight,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { useCoordinator } from "../CoordinatorContext";

const CoordinatorSidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { coordinator, stats, notifications } = useCoordinator();
  const navigate = useNavigate();

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const navGroups = [
    {
      group: "OVERVIEW & MONITORING",
      items: [
        { label: "Dashboard", path: "/coordinator", icon: LayoutDashboard },
        { label: "Active Competition", path: "/coordinator/competition", icon: Trophy, badge: "LIVE" },
        { label: "Participating Students", path: "/coordinator/students", icon: Users },
        { label: "Active Teams", path: "/coordinator/teams", icon: UsersRound },
        { label: "Participating Colleges", path: "/coordinator/colleges", icon: School }
      ]
    },
    {
      group: "TASKS & EVALUATIONS",
      items: [
        { label: "Task Management", path: "/coordinator/tasks", icon: ListTodo },
        {
          label: "Submissions Review",
          path: "/coordinator/submissions",
          icon: UploadCloud,
          badge: stats.pendingSubmissions > 0 ? `${stats.pendingSubmissions} PENDING` : null,
          highlight: stats.pendingSubmissions > 0
        },
        { label: "Points Management", path: "/coordinator/points", icon: Award }
      ]
    },
    {
      group: "STANDINGS & INTELLIGENCE",
      items: [
        { label: "Leaderboard", path: "/coordinator/leaderboard", icon: Medal },
        { label: "Analytics & Reports", path: "/coordinator/analytics", icon: BarChart3 },
        { label: "Progress Tracking", path: "/coordinator/progress", icon: TrendingUp }
      ]
    },
    {
      group: "ADMIN & COMMUNICATIONS",
      items: [
        {
          label: "Notifications",
          path: "/coordinator/notifications",
          icon: Bell,
          badge: unreadNotifsCount > 0 ? unreadNotifsCount : null
        },
        { label: "Coordinator Profile", path: "/coordinator/profile", icon: User }
      ]
    }
  ];

  const handleLogout = () => {
    toast.success("Coordinator logged out successfully.", { icon: "👋" });
    if (onCloseMobile) onCloseMobile();
    navigate("/coordinator/dashboard");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="coordinator-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-label="Close menu"
        />
      )}

      <aside className={`coordinator-glass-sidebar ${isMobileOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-box">
          <div className="brand-leaf-halo">
            <Leaf size={24} className="text-emerald-400" />
          </div>
          <div className="brand-text-block">
            <h2 className="brand-main-title">YUWA</h2>
            <span className="brand-sub-title">ECOLYMPICS</span>
            <span className="brand-role-chip">Coordinator Panel</span>
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

        {/* Coordinator Mini Profile Badge */}
        <div
          className="sidebar-coord-profile"
          onClick={() => {
            navigate("/coordinator/profile");
            if (onCloseMobile) onCloseMobile();
          }}
        >
          <div className="coord-avatar-ring">
            <img
              src={coordinator.avatar}
              alt={coordinator.name}
              className="coord-avatar-img"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className="coord-avatar-fallback">{coordinator.name.charAt(0)}</div>
            <span className="coord-online-dot" />
          </div>

          <div className="coord-profile-details">
            <h4 className="coord-name">{coordinator.name}</h4>
            <span className="coord-role-title">Chief Coordinator</span>
            <div className="coord-reviews-tag">
              <Sparkles size={11} className="text-amber-400" />
              <span>{coordinator.totalReviewsDone} Reviews done</span>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <div className="sidebar-nav-scroll-area">
          {navGroups.map((grp) => (
            <div key={grp.group} className="nav-group-wrapper">
              <span className="nav-group-title">{grp.group}</span>
              <div className="nav-items-stack">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `coord-nav-link ${isActive ? "active" : ""} ${
                          item.highlight ? "nav-highlight" : ""
                        }`
                      }
                    >
                      <Icon size={18} className="coord-nav-icon" />
                      <span className="coord-nav-label">{item.label}</span>
                      {item.badge && (
                        <span className={`coord-nav-badge ${item.highlight ? "badge-pulse" : ""}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={14} className="coord-nav-arrow" />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Logout */}
        <div className="sidebar-footer-row">
          <button
            type="button"
            className="coord-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default CoordinatorSidebar;

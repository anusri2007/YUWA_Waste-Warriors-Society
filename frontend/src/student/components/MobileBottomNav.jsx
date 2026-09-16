import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListTodo, Upload, Trophy, User } from "lucide-react";

const MobileBottomNav = () => {
  const bottomNavItems = [
    { label: "Home", path: "/student", end: true, icon: LayoutDashboard },
    { label: "Tasks", path: "/student/tasks", icon: ListTodo },
    { label: "Submit", path: "/student/submit", icon: Upload, isCta: true },
    { label: "Leaderboard", path: "/student/leaderboard", icon: Trophy },
    { label: "Profile", path: "/student/profile", icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav-bar">
      <div className="mobile-bottom-nav-inner">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;

          if (item.isCta) {
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `bottom-nav-cta ${isActive ? "active-cta" : ""}`
                }
                title={item.label}
              >
                <div className="cta-icon-circle">
                  <Icon size={20} />
                </div>
                <span className="bottom-nav-label">{item.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `bottom-nav-tab ${isActive ? "active-tab" : ""}`
              }
            >
              <Icon size={20} className="bottom-nav-icon" />
              <span className="bottom-nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

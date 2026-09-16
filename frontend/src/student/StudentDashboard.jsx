import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { StudentProvider } from "./StudentContext";
import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";
import MobileBottomNav from "./components/MobileBottomNav";
import StudentHome from "./StudentHome";
import ActiveCompetition from "./ActiveCompetition";
import MyTeam from "./MyTeam";
import MyPoints from "./MyPoints";
import Progress from "./Progress";
import Tasks from "./Tasks";
import SubmitActivity from "./SubmitActivity";
import MySubmissions from "./MySubmissions";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Courses from "./Courses";
import "./StudentDashboard.css";

const StudentDashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="student-glass-app">
      {/* Ambient Blurred Floating Blobs */}
      <div className="ambient-blobs-layer" aria-hidden="true">
        <div className="blob-1" />
        <div className="blob-2" />
        <div className="blob-3" />
      </div>

      {/* Sidebar Navigation */}
      <StudentSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Glass Area */}
      <div className="glass-main-area">
        <StudentHeader
          onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
        />

        <main className="glass-page-body">
          <Routes>
            <Route index element={<StudentHome />} />
            <Route path="home" element={<StudentHome />} />
            <Route path="competition" element={<ActiveCompetition />} />
            <Route path="team" element={<MyTeam />} />
            <Route path="points" element={<MyPoints />} />
            <Route path="progress" element={<Progress />} />
            <Route path="tasks/*" element={<Tasks />} />
            <Route path="submit" element={<SubmitActivity />} />
            <Route path="submissions" element={<MySubmissions />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="courses" element={<Courses />} />
            <Route path="*" element={<Navigate to="/student/home" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Bar for handheld viewports */}
      <MobileBottomNav />
    </div>
  );
};

const StudentDashboard = () => {
  return (
    <StudentProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(10, 31, 27, 0.95)",
            color: "#ffffff",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: "500"
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff"
            }
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff"
            }
          }
        }}
      />
      <StudentDashboardLayout />
    </StudentProvider>
  );
};

export default StudentDashboard;

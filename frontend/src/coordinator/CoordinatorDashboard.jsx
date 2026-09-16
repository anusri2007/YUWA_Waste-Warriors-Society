import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CoordinatorProvider } from './CoordinatorContext';
import CoordinatorSidebar from './components/CoordinatorSidebar';
import CoordinatorHeader from './components/CoordinatorHeader';

// Pages
import CoordinatorHome from './CoordinatorHome';
import Students from './Students';
import StudentDetails from './StudentDetails';
import Teams from './Teams';
import TeamDetails from './TeamDetails';
import Competition from './Competition';
import Tasks from './Tasks';
import CreateTask from './CreateTask';
import TaskDetails from './TaskDetails';
import Submissions from './Submissions';
import SubmissionDetails from './SubmissionDetails';
import Leaderboard from './Leaderboard';
import Points from './Points';
import Progress from './Progress';
import Colleges from './Colleges';
import Analytics from './Analytics';
import Notifications from './Notifications';
import Profile from './Profile';

import './CoordinatorDashboard.css';

const CoordinatorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="coordinator-glass-app">
      {/* Ambient background glowing orbs */}
      <div className="ambient-blobs-layer" aria-hidden="true">
        <div className="blob-coord-1" />
        <div className="blob-coord-2" />
        <div className="blob-coord-3" />
      </div>

      {/* Sidebar Navigation */}
      <CoordinatorSidebar
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="coordinator-main-area">
        <CoordinatorHeader onToggleMobileSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)} />

        <main className="coordinator-page-body">
          <Routes>
            <Route index element={<CoordinatorHome />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<StudentDetails />} />
            <Route path="teams" element={<Teams />} />
            <Route path="teams/:id" element={<TeamDetails />} />
            <Route path="competition" element={<Competition />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/create" element={<CreateTask />} />
            <Route path="tasks/:id" element={<TaskDetails />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="submissions/:id" element={<SubmissionDetails />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="points" element={<Points />} />
            <Route path="progress" element={<Progress />} />
            <Route path="colleges" element={<Colleges />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/coordinator" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const CoordinatorDashboard = () => {
  return (
    <CoordinatorProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            fontSize: '0.9rem'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f172a'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f172a'
            }
          }
        }}
      />
      <CoordinatorLayout />
    </CoordinatorProvider>
  );
};

export default CoordinatorDashboard;

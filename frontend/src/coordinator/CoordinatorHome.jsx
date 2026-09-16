import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from "recharts";
import {
  Users,
  UsersRound,
  Clock,
  CheckCircle,
  Trophy,
  School,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck,
  Calendar,
  Award,
  ListTodo,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  X
} from "lucide-react";
import { useCoordinator } from "./CoordinatorContext";
import StatCard from "./components/StatCard";
import SubmissionCard from "./components/SubmissionCard";
import StatusBadge from "./components/StatusBadge";
import "./CoordinatorHome.css";

const CoordinatorHome = () => {
  const {
    coordinator,
    stats,
    competition,
    submissions,
    tasks,
    teams,
    participationChartData,
    approveSubmission,
    rejectSubmission,
    requestSubmissionChanges
  } = useCoordinator();

  const navigate = useNavigate();
  const [feedbackModalSub, setFeedbackModalSub] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [actionType, setActionType] = useState("feedback"); // feedback | reject

  const pendingSubmissions = submissions.filter((s) => s.status === "Pending").slice(0, 3);
  const activeTasks = tasks.filter((t) => t.status === "Active").slice(0, 3);
  const topTeams = teams.slice(0, 4);

  const handleOpenFeedback = (sub, isReject = false) => {
    setFeedbackModalSub(sub);
    setActionType(isReject ? "reject" : "feedback");
    setFeedbackText(isReject ? "Submission evidence does not meet criteria." : "");
  };

  const handleSendFeedback = () => {
    if (!feedbackModalSub) return;
    if (actionType === "reject") {
      rejectSubmission(feedbackModalSub.id, feedbackText);
    } else {
      requestSubmissionChanges(feedbackModalSub.id, feedbackText);
    }
    setFeedbackModalSub(null);
    setFeedbackText("");
  };

  return (
    <div className="coordinator-home-page">
      {/* 1. Welcome Greeting Banner */}
      <section className="coord-welcome-banner glass-card">
        <div className="welcome-banner-text">
          <div className="coord-live-badge">
            <Sparkles size={14} className="text-emerald-400" />
            <span>YUWA ECOLYMPICS 2026 • COMMAND HEADQUARTERS</span>
          </div>
          <h2 className="welcome-title">Welcome back, {coordinator.name.split(" ")[0]} 👋</h2>
          <p className="welcome-sub">
            Monitor student participation, verify environmental field initiatives, and drive the Ecolympics championship forward.
          </p>
        </div>

        <div className="welcome-quick-actions">
          <Link to="/coordinator/submissions" className="eco-btn-primary">
            <FileCheck size={16} />
            <span>Review Submissions ({stats.pendingSubmissions})</span>
          </Link>
          <Link to="/coordinator/tasks/create" className="eco-btn-secondary">
            <ListTodo size={16} />
            <span>Create New Task</span>
          </Link>
        </div>
      </section>

      {/* 2. Top 6 Glass Statistics Cards */}
      <section className="stats-six-grid">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          description="Registered participants"
          icon={Users}
          color="emerald"
          trend="+12% this week"
          onClick={() => navigate("/coordinator/students")}
        />

        <StatCard
          title="Active Teams"
          value={stats.activeTeams}
          description="Currently participating"
          icon={UsersRound}
          color="cyan"
          trend="+8 squads"
          onClick={() => navigate("/coordinator/teams")}
        />

        <StatCard
          title="Pending Submissions"
          value={stats.pendingSubmissions}
          description="Awaiting coordinator review"
          icon={Clock}
          color="amber"
          trend="Action required"
          onClick={() => navigate("/coordinator/submissions")}
        />

        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          description="Verified activities"
          icon={CheckCircle}
          color="violet"
          trend="+140 today"
          onClick={() => navigate("/coordinator/tasks")}
        />

        <StatCard
          title="Total Points"
          value={stats.totalPoints}
          description="Championship score pool"
          icon={Trophy}
          color="blue"
          trend="82% of season pool"
          onClick={() => navigate("/coordinator/points")}
        />

        <StatCard
          title="Active Colleges"
          value={stats.activeColleges}
          description="Partner institutions"
          icon={School}
          color="teal"
          trend="6 major states"
          onClick={() => navigate("/coordinator/colleges")}
        />
      </section>

      {/* 3. Active Competition Hero Card */}
      <section className="comp-hero-glass-card glass-card">
        <div className="comp-hero-inner">
          <div className="comp-hero-left">
            <div className="comp-badge-row">
              <span className="live-status-pill">
                <span className="live-ping" /> {competition.status}
              </span>
              <span className="comp-date-chip">
                <Calendar size={13} /> {competition.startDate} – {competition.endDate}
              </span>
            </div>

            <h3 className="comp-title-large">{competition.title}</h3>
            <p className="comp-subtitle-text">{competition.subtitle}</p>

            {/* Key Metric Capsules */}
            <div className="comp-kpi-capsules">
              <div className="kpi-capsule">
                <Clock size={15} className="text-cyan-400" />
                <span><strong>{competition.daysRemaining}</strong> Days Remaining</span>
              </div>
              <div className="kpi-capsule">
                <Users size={15} className="text-emerald-400" />
                <span><strong>{competition.totalParticipants}</strong> Participants</span>
              </div>
              <div className="kpi-capsule">
                <UsersRound size={15} className="text-purple-400" />
                <span><strong>{competition.totalTeams}</strong> Squads</span>
              </div>
              <div className="kpi-capsule">
                <Award size={15} className="text-amber-400" />
                <span><strong>{competition.wasteDivertedTotalKg} kg</strong> Waste Diverted</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="comp-prog-container">
              <div className="comp-prog-head">
                <span>Championship Milestone Completion</span>
                <strong>{competition.progressPercentage}%</strong>
              </div>
              <div className="comp-prog-track">
                <div className="comp-prog-fill" style={{ width: `${competition.progressPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="comp-hero-right">
            <Link to="/coordinator/competition" className="eco-btn-primary btn-view-comp-lg">
              <span>View Competition Details</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Participation Overview Chart (Recharts) */}
      <section className="chart-overview-card glass-card">
        <div className="chart-header-row">
          <div>
            <h3 className="chart-main-title">Student Participation & Activity Velocity</h3>
            <p className="chart-sub-title">Weekly trajectory of registrations, active participants, and completed challenges</p>
          </div>
          <span className="chart-stat-chip">
            <TrendingUp size={14} className="text-emerald-400" />
            <span>+24% Activity Velocity</span>
          </span>
        </div>

        <div className="recharts-box">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={participationChartData}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 33, 28, 0.95)",
                  borderRadius: "12px",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                  color: "#ffffff"
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="registeredStudents"
                name="Registered Students"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#regGrad)"
              />
              <Area
                type="monotone"
                dataKey="activeStudents"
                name="Active Students"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#actGrad)"
              />
              <Line
                type="monotone"
                dataKey="completedActivities"
                name="Completed Activities"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, fill: "#f59e0b" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 5. Two-Column Dashboard Split: Pending Submissions & Quick Tasks */}
      <div className="home-two-col-grid">
        {/* Left Column: Pending Submissions Review Section */}
        <div className="home-left-col">
          <div className="col-section-header">
            <div className="title-with-icon">
              <UploadCloud size={20} className="text-amber-400" />
              <h3>Pending Submissions Awaiting Review ({stats.pendingSubmissions})</h3>
            </div>
            <Link to="/coordinator/submissions" className="view-all-link">
              <span>View All ({submissions.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="submissions-vertical-stack">
            {pendingSubmissions.map((sub) => (
              <SubmissionCard
                key={sub.id}
                submission={sub}
                onApprove={approveSubmission}
                onReject={(id) => handleOpenFeedback(sub, true)}
                onOpenFeedback={(sub) => handleOpenFeedback(sub, false)}
              />
            ))}

            {pendingSubmissions.length === 0 && (
              <div className="no-pending-card glass-card">
                <CheckCircle size={36} className="text-emerald-400" />
                <h4>All Submissions Verified</h4>
                <p>No pending evidence reviews in the evaluation queue.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Tasks & Top Teams Spotlight */}
        <div className="home-right-col">
          {/* Active Tasks Widget */}
          <div className="home-side-widget glass-card">
            <div className="widget-header">
              <div className="widget-title">
                <ListTodo size={18} className="text-cyan-400" />
                <h4>Active Challenges</h4>
              </div>
              <Link to="/coordinator/tasks" className="widget-link">
                Manage
              </Link>
            </div>

            <div className="active-tasks-list">
              {activeTasks.map((t) => (
                <div key={t.id} className="active-task-item">
                  <div className="task-item-top">
                    <span className="task-cat-pill-sm">{t.category}</span>
                    <span className="task-pts-pill">+{t.points} pts</span>
                  </div>
                  <h5 className="task-item-name">{t.title}</h5>
                  <div className="task-item-bottom">
                    <span>Due: {t.deadline}</span>
                    <span>{t.participants} Volunteers</span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/coordinator/tasks/create" className="btn-create-task-widget">
              <span>+ Create New Challenge</span>
            </Link>
          </div>

          {/* Top Teams Spotlight Widget */}
          <div className="home-side-widget glass-card">
            <div className="widget-header">
              <div className="widget-title">
                <Trophy size={18} className="text-amber-400" />
                <h4>Top Squad Standings</h4>
              </div>
              <Link to="/coordinator/leaderboard" className="widget-link">
                Full Board
              </Link>
            </div>

            <div className="top-teams-list">
              {topTeams.map((team) => (
                <div key={team.id} className="top-team-row">
                  <div className="team-rank-pill">#{team.rank}</div>
                  <div className="team-info-cell">
                    <strong className="team-cell-name">{team.name}</strong>
                    <span className="team-cell-college">{team.college.split(" ")[0]}</span>
                  </div>
                  <div className="team-points-cell">
                    <strong className="text-amber-400">{team.points}</strong>
                    <span>pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback / Reject Modal Dialog */}
      {feedbackModalSub && (
        <div className="coordinator-modal-backdrop" onClick={() => setFeedbackModalSub(null)}>
          <div className="coordinator-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h3>
                {actionType === "reject" ? "Reject Submission & Send Feedback" : "Send Coordinator Feedback"}
              </h3>
              <button
                type="button"
                className="btn-clear"
                onClick={() => setFeedbackModalSub(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="modal-sub-preview">
                <span className="sub-id-chip">{feedbackModalSub.id}</span>
                <strong>{feedbackModalSub.activityName}</strong>
                <span className="text-sm text-muted">Submitted by {feedbackModalSub.studentName}</span>
              </div>

              <div className="form-group">
                <label htmlFor="feedback-text">
                  Coordinator Feedback / Reason for Action *
                </label>
                <textarea
                  id="feedback-text"
                  rows="4"
                  placeholder="Explain clearly what requirements were missed or provide guidance..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="glass-textarea"
                />
              </div>
            </div>

            <div className="modal-footer-bar">
              <button
                type="button"
                className="eco-btn-secondary"
                onClick={() => setFeedbackModalSub(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={actionType === "reject" ? "btn-action-reject" : "eco-btn-primary"}
                onClick={handleSendFeedback}
              >
                {actionType === "reject" ? "Confirm Rejection" : "Send Feedback to Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorHome;


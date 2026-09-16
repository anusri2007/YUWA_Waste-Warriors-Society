import React from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  ListTodo,
  FileCheck,
  Trophy,
  Activity,
  Users,
  ArrowRight,
  TrendingUp,
  Recycle,
  Sparkles
} from "lucide-react";
import { useStudent } from "../StudentContext";
import WelcomeCard from "../components/WelcomeCard";
import StatsCards from "../components/StatsCards";
import ProgressBar from "../components/ProgressBar";
import TaskCard from "../components/TaskCard";
import SubmissionCard from "../components/SubmissionCard";
import LeaderboardCard from "../components/LeaderboardCard";
import ActivityCard from "../components/ActivityCard";

const Overview = () => {
  const {
    student,
    statistics,
    tasks,
    submissions,
    leaderboard,
    activities,
    chartPerformanceData,
    celebrateActivity
  } = useStudent();

  const upcomingTasks = tasks.filter((t) => t.status !== "Approved").slice(0, 3);
  const recentSubmissions = submissions.slice(0, 2);
  const topTeams = leaderboard.slice(0, 5);
  const currentTeamEntry = leaderboard.find((t) => t.isCurrentTeam);

  return (
    <div className="eco-overview-page">
      {/* 1. Welcome Card */}
      <WelcomeCard student={student} />

      {/* 2. Statistics Grid */}
      <StatsCards statistics={statistics} student={student} />

      {/* 3. Competition Progress */}
      <ProgressBar
        completedTasks={student.tasksCompleted}
        totalTasks={student.tasksCompleted + student.tasksPending}
        points={student.totalPoints}
        wasteRecovered={`${student.wasteRecoveredKg} kg`}
        climateActions={student.climateActions}
      />

      {/* 4. Dashboard Charts (Responsive Recharts) */}
      <div className="overview-charts-grid">
        {/* Chart 1: Points & Cumulative Waste Diverted */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Points Growth & Waste Diverted</h3>
              <p className="chart-subtitle">Weekly trajectory in YUWA Ecolympics Season</p>
            </div>
            <span className="chart-legend-badge">
              <TrendingUp size={14} className="text-emerald-500" />
              <span>+275 pts/wk</span>
            </span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartPerformanceData}>
                <defs>
                  <linearGradient id="pointsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="points"
                  name="Points"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#pointsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Waste Recovered (kg) */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Weekly Waste Diverted (kg)</h3>
              <p className="chart-subtitle">Direct landfill diversion impact by your team</p>
            </div>
            <span className="chart-legend-badge">
              <Recycle size={14} className="text-emerald-500" />
              <span>Total 75.4 kg</span>
            </span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1"
                  }}
                />
                <Bar dataKey="wasteKg" name="Waste (kg)" radius={[6, 6, 0, 0]}>
                  {chartPerformanceData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === chartPerformanceData.length - 1 ? "#059669" : "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Main Overview Columns */}
      <div className="overview-split-columns">
        {/* Left Column: Upcoming Tasks & Recent Submissions */}
        <div className="overview-primary-column">
          {/* Upcoming Tasks Section */}
          <section className="dashboard-section-block">
            <div className="section-title-line">
              <div className="section-label-group">
                <ListTodo size={20} className="text-emerald-600" />
                <h3>Upcoming Assigned Tasks</h3>
              </div>
              <Link to="/student/tasks" className="section-more-link">
                <span>View All Tasks ({tasks.length})</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="tasks-cards-stack">
              {upcomingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>

          {/* Recent Submissions Section */}
          <section className="dashboard-section-block">
            <div className="section-title-line">
              <div className="section-label-group">
                <FileCheck size={20} className="text-emerald-600" />
                <h3>Recent Submissions</h3>
              </div>
              <Link to="/student/submissions" className="section-more-link">
                <span>All Submissions ({submissions.length})</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="submissions-cards-stack">
              {recentSubmissions.map((sub) => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Leaderboard, Team & Activity Feed */}
        <div className="overview-secondary-column">
          {/* Current Leaderboard Standings Card */}
          <section className="dashboard-section-block side-block">
            <div className="section-title-line">
              <div className="section-label-group">
                <Trophy size={20} className="text-amber-500" />
                <h3>Leaderboard Highlights</h3>
              </div>
              <Link to="/student/leaderboard" className="section-more-link">
                <span>Full Board</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Current team position spotlight */}
            {currentTeamEntry && (
              <div className="your-team-spotlight">
                <div className="spotlight-rank">#{currentTeamEntry.rank}</div>
                <div className="spotlight-info">
                  <strong className="spotlight-name">{currentTeamEntry.team} (You)</strong>
                  <span className="spotlight-pts">{currentTeamEntry.points} points • {currentTeamEntry.wasteRecovered} kg waste</span>
                </div>
                <span className="spotlight-move">↑ Rank +3</span>
              </div>
            )}

            <div className="side-leaderboard-list">
              {topTeams.map((entry) => (
                <LeaderboardCard
                  key={entry.rank}
                  entry={entry}
                  isCurrentTeam={entry.isCurrentTeam}
                />
              ))}
            </div>
          </section>

          {/* Team Info Card */}
          <section className="dashboard-section-block side-block">
            <div className="section-title-line">
              <div className="section-label-group">
                <Users size={20} className="text-emerald-600" />
                <h3>Your Team Roster</h3>
              </div>
              <Link to="/student/profile" className="section-more-link">
                <span>Manage</span>
              </Link>
            </div>

            <div className="team-roster-summary">
              <div className="roster-header">
                <strong>{student.team}</strong>
                <span className="roster-id-pill">ID: {student.teamId}</span>
              </div>

              <div className="roster-members-list">
                {student.teamMembers.map((member, idx) => (
                  <div key={idx} className="roster-member-row">
                    <div className="member-avatar-chip">
                      {member.name.charAt(0)}
                    </div>
                    <div className="member-info-col">
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Activity Feed Snippet */}
          <section className="dashboard-section-block side-block">
            <div className="section-title-line">
              <div className="section-label-group">
                <Activity size={20} className="text-emerald-600" />
                <h3>Recent Climate Actions</h3>
              </div>
              <Link to="/student/activity" className="section-more-link">
                <span>Live Feed</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="side-activity-list">
              {activities.slice(0, 2).map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  onCelebrate={celebrateActivity}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Overview;

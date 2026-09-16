import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area
} from "recharts";
import {
  Award,
  Sparkles,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Image,
  Video,
  FileText,
  Star,
  Gift
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./MyPoints.css";

const MyPoints = () => {
  const { student, pointsActivities, pointsHistoryChartData } = useStudent();

  const getActivityIcon = (type) => {
    switch (type) {
      case "task":
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case "photo":
        return <Image size={16} className="text-cyan-400" />;
      case "video":
        return <Video size={16} className="text-purple-400" />;
      case "reflection":
        return <FileText size={16} className="text-amber-400" />;
      default:
        return <Star size={16} className="text-yellow-400" />;
    }
  };

  return (
    <div className="my-points-page">
      {/* 3 Large Glass Stat Cards */}
      <section className="points-metrics-grid">
        <div className="point-stat-card glass-card card-glow-gold">
          <div className="p-stat-top">
            <span className="p-stat-title">Total Points</span>
            <div className="p-stat-icon-halo halo-gold">
              <Award size={24} />
            </div>
          </div>
          <div className="p-stat-number text-amber-400">
            {student.points.toLocaleString()}
          </div>
          <p className="p-stat-desc">Lifetime YUWA Ecolympics score</p>
          <div className="p-mini-target-pill">
            <Sparkles size={12} />
            <span>Target: 2,000 pts (62% achieved)</span>
          </div>
        </div>

        <div className="point-stat-card glass-card card-glow-emerald">
          <div className="p-stat-top">
            <span className="p-stat-title">Weekly Points</span>
            <div className="p-stat-icon-halo halo-emerald">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="p-stat-number text-emerald-400">
            +{student.weeklyPoints}
          </div>
          <p className="p-stat-desc">Earned in Sprint 3 (Current Week)</p>
          <div className="p-mini-target-pill text-emerald-300">
            <span>+38% compared to previous sprint</span>
          </div>
        </div>

        <div className="point-stat-card glass-card card-glow-cyan">
          <div className="p-stat-top">
            <span className="p-stat-title">Competition Points</span>
            <div className="p-stat-icon-halo halo-cyan">
              <Star size={24} />
            </div>
          </div>
          <div className="p-stat-number text-cyan-400">
            {student.competitionPoints}
          </div>
          <p className="p-stat-desc">Direct league leaderboard contributions</p>
          <div className="p-mini-target-pill text-cyan-300">
            <span>Qualifies for National Green Medal</span>
          </div>
        </div>
      </section>

      {/* Points Progress Over Time Chart */}
      <section className="points-chart-section glass-card">
        <div className="points-chart-header">
          <div>
            <h2 className="points-chart-title">Points Growth Trajectory</h2>
            <p className="points-chart-sub">Cumulative points earned throughout season sprints</p>
          </div>
          <span className="chart-highlight-pill">
            <TrendingUp size={14} className="text-emerald-400" />
            <span>+100 pts Today</span>
          </span>
        </div>

        <div className="recharts-wrapper-box">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={pointsHistoryChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 31, 27, 0.95)",
                  borderRadius: "12px",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                  color: "#ffffff"
                }}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Cumulative Score"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "#34d399", stroke: "#071513" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Points Activities Stream */}
      <section className="points-activities-section glass-card">
        <div className="activities-header">
          <div className="act-title-tag">
            <Sparkles size={18} className="text-amber-400" />
            <h3>Recent Point-Earning Activities</h3>
          </div>
          <span className="text-muted text-sm">{pointsActivities.length} actions recorded</span>
        </div>

        <div className="activities-timeline-stack">
          {pointsActivities.map((item) => (
            <div key={item.id} className="act-timeline-item">
              <div className="act-icon-bubble">
                {getActivityIcon(item.type)}
              </div>

              <div className="act-item-details">
                <strong className="act-item-title">{item.activity}</strong>
                <span className="act-item-date">
                  <Calendar size={12} /> {item.date}
                </span>
              </div>

              <div className="act-item-pts-badge">
                <span>+{item.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyPoints;

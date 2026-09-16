import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Users,
  Trophy,
  Target,
  ArrowRight,
  ShieldCheck,
  Recycle
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./Progress.css";

const Progress = () => {
  const { student, team, progressMetrics } = useStudent();

  const progressCards = [
    {
      id: "tasks",
      title: "Tasks Progress",
      percentage: progressMetrics.tasks, // 72%
      completed: student.tasksCompleted,
      total: student.totalTasks,
      unit: "tasks completed",
      color: "#10b981",
      glowClass: "progress-emerald",
      icon: CheckCircle2,
      subtext: "18 verified by evaluation mentors"
    },
    {
      id: "activities",
      title: "Activities Impact",
      percentage: progressMetrics.activities, // 85%
      completed: 17,
      total: 20,
      unit: "field activities logged",
      color: "#06b6d4",
      glowClass: "progress-cyan",
      icon: Sparkles,
      subtext: "Drives, workshops & street plays"
    },
    {
      id: "team-contribution",
      title: "Team Contribution",
      percentage: progressMetrics.teamContribution, // 64%
      completed: student.points,
      total: team.points,
      unit: "points of team total",
      color: "#8b5cf6",
      glowClass: "progress-violet",
      icon: Users,
      subtext: `${student.name} is lead contributor`
    },
    {
      id: "competition",
      title: "Competition Milestone",
      percentage: progressMetrics.competition, // 76%
      completed: 14,
      total: 18,
      unit: "sprint checkpoints",
      color: "#f59e0b",
      glowClass: "progress-amber",
      icon: Trophy,
      subtext: "Eligible for Regional Finals trophy"
    }
  ];

  return (
    <div className="progress-dashboard-page">
      {/* Header Banner */}
      <section className="progress-banner-glass glass-card">
        <div>
          <div className="progress-live-pill">
            <Sparkles size={14} className="text-emerald-400" />
            <span>REAL-TIME ANALYTICS</span>
          </div>
          <h1 className="progress-headline">Academic & Climate Progress</h1>
          <p className="progress-tagline">
            Monitor your environmental diversion quota, personal milestones, and collective team pace.
          </p>
        </div>

        <div className="overall-ring-gauge">
          <svg className="ring-svg" viewBox="0 0 120 120">
            <circle
              className="ring-bg"
              cx="60"
              cy="60"
              r="50"
            />
            <circle
              className="ring-fill"
              cx="60"
              cy="60"
              r="50"
              strokeDasharray="314"
              strokeDashoffset={314 - (314 * progressMetrics.competition) / 100}
            />
          </svg>
          <div className="ring-content">
            <span className="ring-pct">{progressMetrics.competition}%</span>
            <span className="ring-lbl">Overall</span>
          </div>
        </div>
      </section>

      {/* 4 Circular & Bar Progress Cards */}
      <section className="progress-cards-grid">
        {progressCards.map((card) => {
          const Icon = card.icon;
          const strokeDashoffset = 251 - (251 * card.percentage) / 100;

          return (
            <div key={card.id} className={`glass-card prog-card ${card.glowClass}`}>
              <div className="prog-card-header">
                <div className="prog-icon-badge" style={{ color: card.color }}>
                  <Icon size={20} />
                </div>
                <span className="prog-card-name">{card.title}</span>
              </div>

              {/* Circular Gauge Center */}
              <div className="prog-circular-wrap">
                <svg className="circle-gauge-svg" viewBox="0 0 100 100">
                  <circle
                    className="circle-gauge-bg"
                    cx="50"
                    cy="50"
                    r="40"
                  />
                  <circle
                    className="circle-gauge-bar"
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={card.color}
                    strokeDasharray="251"
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="circle-gauge-center">
                  <span className="gauge-num" style={{ color: card.color }}>
                    {card.percentage}%
                  </span>
                  <span className="gauge-sub">Achieved</span>
                </div>
              </div>

              {/* Linear Progress Bar */}
              <div className="prog-linear-section">
                <div className="prog-linear-labels">
                  <span>{card.completed} / {card.total} {card.unit}</span>
                </div>
                <div className="prog-linear-track">
                  <motion.div
                    className="prog-linear-fill"
                    style={{ backgroundColor: card.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${card.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="prog-linear-sub">{card.subtext}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Waste Diversion & Milestone Breakdown */}
      <section className="glass-card waste-milestone-panel">
        <div className="milestone-title-row">
          <div className="milestone-title-group">
            <Recycle size={22} className="text-emerald-400" />
            <h3>Cumulative Waste Diversion Target Breakdown</h3>
          </div>
          <span className="milestone-stat-pill">75.4 kg / 100.0 kg Target</span>
        </div>

        <div className="waste-milestone-bars">
          <div className="milestone-row">
            <div className="milestone-head">
              <span>Plastic & Dry Recyclables Diverted</span>
              <strong>38.5 kg (77% of quota)</strong>
            </div>
            <div className="milestone-track">
              <div className="milestone-fill fill-emerald" style={{ width: "77%" }} />
            </div>
          </div>

          <div className="milestone-row">
            <div className="milestone-head">
              <span>Bio-Organic & Wet Compost Diverted</span>
              <strong>26.5 kg (88% of quota)</strong>
            </div>
            <div className="milestone-track">
              <div className="milestone-fill fill-cyan" style={{ width: "88%" }} />
            </div>
          </div>

          <div className="milestone-row">
            <div className="milestone-head">
              <span>Hazardous Electronic Waste Collected</span>
              <strong>10.4 kg (52% of quota)</strong>
            </div>
            <div className="milestone-track">
              <div className="milestone-fill fill-violet" style={{ width: "52%" }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Progress;

import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Clock,
  Award,
  Trophy,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Target,
  Gift,
  Recycle,
  Leaf
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./ActiveCompetition.css";

const ActiveCompetition = () => {
  const { competition, student, team } = useStudent();

  return (
    <div className="active-competition-page">
      {/* Visual Hero Glass Card */}
      <section className="comp-hero-card glass-card">
        <div className="comp-hero-glow-blob" />

        <div className="comp-hero-badge-row">
          <span className="live-competition-badge">
            <span className="live-ping" /> {competition.status}
          </span>
          <span className="comp-dates-chip">
            <Calendar size={13} /> {competition.startDate} – {competition.endDate}
          </span>
        </div>

        <h1 className="comp-hero-title-main">{competition.title}</h1>
        <p className="comp-hero-tagline">{competition.subtitle}</p>

        {/* 4 Core Stat Highlights */}
        <div className="comp-stat-grid">
          <div className="comp-stat-box">
            <span className="comp-stat-label">Days Remaining</span>
            <div className="comp-stat-val text-cyan-400">
              <Clock size={22} className="inline-icon" />
              <span>{competition.daysRemaining}</span>
            </div>
            <span className="comp-stat-sub">Final sprint deadline</span>
          </div>

          <div className="comp-stat-box">
            <span className="comp-stat-label">Current Points</span>
            <div className="comp-stat-val text-amber-400">
              <Award size={22} className="inline-icon" />
              <span>{student.points.toLocaleString()}</span>
            </div>
            <span className="comp-stat-sub">Team: {team.points} pts</span>
          </div>

          <div className="comp-stat-box">
            <span className="comp-stat-label">Current Rank</span>
            <div className="comp-stat-val text-emerald-400">
              <Trophy size={22} className="inline-icon" />
              <span>#{competition.currentRank}</span>
            </div>
            <span className="comp-stat-sub">Division 1 Top Tier</span>
          </div>

          <div className="comp-stat-box">
            <span className="comp-stat-label">Your Team</span>
            <div className="comp-stat-val text-purple-400">
              <Users size={22} className="inline-icon" />
              <span>{team.name}</span>
            </div>
            <span className="comp-stat-sub">{team.members.length} active warriors</span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="comp-progress-section">
          <div className="comp-progress-header">
            <span className="prog-title">Overall Competition Progress</span>
            <strong className="prog-pct">{competition.progressPercentage}%</strong>
          </div>
          <div className="comp-progress-track">
            <div
              className="comp-progress-bar"
              style={{ width: `${competition.progressPercentage}%` }}
            />
          </div>
          <div className="comp-progress-sub">
            <span>{student.tasksCompleted} of {student.totalTasks} core challenges submitted</span>
            <span>Target: 2,000 Team Points</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="comp-cta-banner-row">
          <Link to="/student/tasks/available" className="eco-btn-primary comp-btn-lg">
            <span>Continue Competition</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/student/submit" className="eco-btn-secondary comp-btn-lg">
            <span>Submit Evidence Now</span>
          </Link>
        </div>
      </section>

      {/* Two Column Section: Competition Rules & Grand Prizes */}
      <div className="comp-details-split">
        {/* Left: Competition Pillars & Rules */}
        <section className="glass-card comp-rules-card">
          <div className="card-section-title">
            <Target size={20} className="text-emerald-400" />
            <h3>Championship Pillars & Scoring</h3>
          </div>

          <div className="pillars-list">
            <div className="pillar-item">
              <div className="pillar-num">01</div>
              <div className="pillar-body">
                <h4>Decentralized Waste Diversion (40% Weightage)</h4>
                <p>Weigh, record, and divert organic, plastic, and e-waste from city landfills. Points are awarded per certified kilogram diverted.</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-num">02</div>
              <div className="pillar-body">
                <h4>Community & Youth Mobilization (30% Weightage)</h4>
                <p>Perform street plays (Nukkad Natak), workshops in residential societies, and cleanups involving neighborhood citizens.</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-num">03</div>
              <div className="pillar-body">
                <h4>Authentic Digital Evidence (30% Weightage)</h4>
                <p>Upload timestamped photos, GPS tags, weigh scale readings, and video summaries verified by our expert evaluation jury.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Awards & Recognition */}
        <section className="glass-card comp-prizes-card">
          <div className="card-section-title">
            <Gift size={20} className="text-amber-400" />
            <h3>Championship Rewards & Grants</h3>
          </div>

          <div className="prizes-stack">
            {competition.prizes.map((p, idx) => (
              <div key={idx} className={`prize-row-box prize-rank-${idx + 1}`}>
                <div className="prize-badge">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                </div>
                <div className="prize-content">
                  <strong className="prize-title">{p.rank}</strong>
                  <p className="prize-desc">{p.reward}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="prize-footer-note">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>All qualifying participants receive national sustainability certificates.</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ActiveCompetition;

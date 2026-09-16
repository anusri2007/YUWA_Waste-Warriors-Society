import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Target,
  FileCheck,
  ArrowRight,
  Gift,
  Building2,
  BarChart3
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import StatusBadge from './components/StatusBadge';
import './Competition.css';

const Competition = () => {
  const navigate = useNavigate();
  const { activeCompetition, stats } = useCoordinator();

  const phases = [
    {
      id: 1,
      name: 'Phase 1: Campus Waste Audit & Segregation',
      status: 'Active',
      startDate: '2026-03-01',
      endDate: '2026-03-15',
      pointsAvailable: 3500,
      description: 'Audit campus bins, implement 3-way segregation stations, and log initial baseline waste output.'
    },
    {
      id: 2,
      name: 'Phase 2: Single-Use Plastic Elimination Drive',
      status: 'Upcoming',
      startDate: '2026-03-16',
      endDate: '2026-03-25',
      pointsAvailable: 4500,
      description: 'Replace cafeteria single-use plastics with sustainable alternatives and distribute eco-kits.'
    },
    {
      id: 3,
      name: 'Phase 3: Community Composting & Organic Waste',
      status: 'Upcoming',
      startDate: '2026-03-26',
      endDate: '2026-04-05',
      pointsAvailable: 4000,
      description: 'Set up micro-compost units in college hostels and botanical gardens.'
    },
    {
      id: 4,
      name: 'Phase 4: Circular Economy Innovation Pitch (Grand Finale)',
      status: 'Upcoming',
      startDate: '2026-04-06',
      endDate: '2026-04-15',
      pointsAvailable: 6000,
      description: 'Present technological or systemic campus circular models to the National Jury panel.'
    }
  ];

  const rules = [
    {
      title: 'Geotagged & Timestamped Submissions',
      desc: 'All photo and video proofs must contain visible geotags or timestamps taken during campus drives.'
    },
    {
      title: 'Coordinator Verification Mandatory',
      desc: 'Points are only awarded after official coordinator approval. Flagged submissions will be returned for revision.'
    },
    {
      title: 'Inter-Department Collaboration Bonus',
      desc: 'Squads combining engineering, science, and arts departments earn a 10% multiplier on phase milestones.'
    },
    {
      title: 'Zero Tolerance for Greenwashing',
      desc: 'Fabricated proofs or duplicate submissions result in immediate 500-point penalties and squad flag.'
    }
  ];

  return (
    <div className="coord-page-container competition-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <Trophy className="title-icon" /> Competition Overview
          </h1>
          <p className="coord-page-subtitle">
            Manage championship timelines, milestone tracks, rules, and national prize allocations.
          </p>
        </div>
        <div className="coord-page-actions">
          <button
            className="coord-btn coord-btn-primary"
            onClick={() => navigate('/coordinator/leaderboard')}
          >
            <Trophy size={16} /> Live Standings
          </button>
        </div>
      </div>

      {/* Main Championship Hero Card */}
      <div className="glass-card comp-hero-banner">
        <div className="comp-hero-bg-glow" />
        <div className="comp-hero-inner">
          <div className="comp-badge-pill">
            <span className="live-indicator" /> National Championship 2026
          </div>
          <h2 className="comp-hero-title">{activeCompetition.name}</h2>
          <p className="comp-hero-desc">{activeCompetition.description}</p>

          <div className="comp-hero-meta-grid">
            <div className="comp-meta-card glass-card">
              <Calendar className="meta-card-icon emerald" size={20} />
              <div>
                <span className="meta-card-label">Timeline</span>
                <span className="meta-card-val">
                  {activeCompetition.startDate} — {activeCompetition.endDate}
                </span>
              </div>
            </div>

            <div className="comp-meta-card glass-card">
              <Clock className="meta-card-icon cyan" size={20} />
              <div>
                <span className="meta-card-label">Days Remaining</span>
                <span className="meta-card-val">{activeCompetition.daysLeft} Days Left</span>
              </div>
            </div>

            <div className="comp-meta-card glass-card">
              <Users className="meta-card-icon violet" size={20} />
              <div>
                <span className="meta-card-label">Participants</span>
                <span className="meta-card-val">{stats.totalStudents} Students ({stats.activeTeams} Teams)</span>
              </div>
            </div>

            <div className="comp-meta-card glass-card">
              <Gift className="meta-card-icon amber" size={20} />
              <div>
                <span className="meta-card-label">Prize Pool</span>
                <span className="meta-card-val">{activeCompetition.prizePool}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Phases / Timeline */}
      <div className="comp-section">
        <div className="comp-section-head">
          <div className="title-group">
            <Target className="text-emerald-400" size={22} />
            <h3>Championship Phases & Milestones</h3>
          </div>
          <span className="phase-count-badge">4 Phases</span>
        </div>

        <div className="phases-timeline">
          {phases.map((phase, idx) => (
            <div
              key={phase.id}
              className={`phase-card glass-card ${phase.status === 'Active' ? 'active-phase' : ''}`}
            >
              <div className="phase-indicator-col">
                <div className="phase-circle">{idx + 1}</div>
                {idx < phases.length - 1 && <div className="phase-connector" />}
              </div>

              <div className="phase-content">
                <div className="phase-header-row">
                  <h4>{phase.name}</h4>
                  <StatusBadge status={phase.status} />
                </div>
                <p className="phase-desc">{phase.description}</p>

                <div className="phase-footer-row">
                  <div className="phase-dates">
                    <Calendar size={14} />
                    <span>{phase.startDate} to {phase.endDate}</span>
                  </div>
                  <div className="phase-points">
                    <Sparkles size={14} />
                    <span>Max {phase.pointsAvailable.toLocaleString()} Points Available</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules & Guidelines */}
      <div className="comp-section">
        <div className="comp-section-head">
          <div className="title-group">
            <ShieldCheck className="text-cyan-400" size={22} />
            <h3>Coordinator Verification & Scoring Guidelines</h3>
          </div>
        </div>

        <div className="rules-grid">
          {rules.map((rule, idx) => (
            <div key={idx} className="rule-card glass-card">
              <div className="rule-icon-box">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4>{rule.title}</h4>
                <p>{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Competition;

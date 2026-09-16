import React from 'react';
import {
  TrendingUp,
  Leaf,
  Sparkles,
  Target,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  BarChart3,
  Calendar,
  Layers,
  Recycle
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import ProgressCard from './components/ProgressCard';
import StatusBadge from './components/StatusBadge';
import './Progress.css';

const Progress = () => {
  const { activeCompetition, stats } = useCoordinator();

  const impactGauges = [
    {
      title: 'Plastic Waste Diverted',
      value: '4,280 kg',
      target: '5,000 kg goal',
      percent: 85,
      color: 'emerald',
      icon: Recycle
    },
    {
      title: 'Organic Waste Composted',
      value: '6,150 kg',
      target: '8,000 kg goal',
      percent: 76,
      color: 'cyan',
      icon: Leaf
    },
    {
      title: 'E-Waste Safely Recovered',
      value: '1,890 kg',
      target: '2,500 kg goal',
      percent: 75,
      color: 'violet',
      icon: Sparkles
    },
    {
      title: 'CO2e Emissions Offset',
      value: '14.2 MT',
      target: '18.0 MT goal',
      percent: 78,
      color: 'amber',
      icon: Flame
    }
  ];

  const milestones = [
    {
      id: 1,
      name: 'Baseline Waste Audit Completion across 45 Campuses',
      phase: 'Phase 1',
      progress: 100,
      status: 'Completed',
      date: '2026-03-05'
    },
    {
      id: 2,
      name: 'Installation of 500+ Three-Bin Segregation Stations',
      phase: 'Phase 1',
      progress: 92,
      status: 'Active',
      date: '2026-03-12'
    },
    {
      id: 3,
      name: 'Cafeteria Single-Use Plastic Ban & Eco-Kit Distribution',
      phase: 'Phase 2',
      progress: 45,
      status: 'Active',
      date: '2026-03-20'
    },
    {
      id: 4,
      name: 'Hostel Micro-Composting Unit Deployment',
      phase: 'Phase 3',
      progress: 10,
      status: 'Upcoming',
      date: '2026-03-28'
    },
    {
      id: 5,
      name: 'National Circular Economy Grand Finale Presentations',
      phase: 'Phase 4',
      progress: 0,
      status: 'Upcoming',
      date: '2026-04-10'
    }
  ];

  return (
    <div className="coord-page-container progress-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <TrendingUp className="title-icon" /> National Impact & Progress
          </h1>
          <p className="coord-page-subtitle">
            Track aggregate environmental diversion metrics, greenhouse gas reductions, and phase milestones.
          </p>
        </div>
      </div>

      {/* Main Hero Championship Progress */}
      <div className="glass-card comp-progress-banner">
        <div className="banner-left-info">
          <span className="banner-tag">Championship Pace</span>
          <h2>Ecolympics 2026 Campaign Health</h2>
          <p>
            Currently running on schedule. 84% of participating colleges have met Phase 1 segregation milestones ahead of deadline.
          </p>

          <div className="banner-stats-mini-row">
            <div>
              <span className="mini-num">{activeCompetition.daysLeft}</span>
              <span className="mini-lbl">Days Left</span>
            </div>
            <div className="mini-divider" />
            <div>
              <span className="mini-num">{stats.totalStudents.toLocaleString()}</span>
              <span className="mini-lbl">Active Warriors</span>
            </div>
            <div className="mini-divider" />
            <div>
              <span className="mini-num">{(stats.totalPoints / 1000).toFixed(1)}k</span>
              <span className="mini-lbl">Points Scored</span>
            </div>
          </div>
        </div>

        <div className="banner-right-gauge">
          <ProgressCard
            title="Overall Completion"
            value={`${activeCompetition.progressPercentage}%`}
            percent={activeCompetition.progressPercentage}
            subtitle="Championship Target"
          />
        </div>
      </div>

      {/* Impact Metric Gauges Grid */}
      <div className="impact-gauges-grid">
        {impactGauges.map((gauge, idx) => {
          const Icon = gauge.icon;
          return (
            <div key={idx} className="glass-card impact-gauge-card">
              <div className="gauge-card-header">
                <div className={`gauge-icon-box ${gauge.color}`}>
                  <Icon size={22} />
                </div>
                <span className="gauge-percent-tag">{gauge.percent}%</span>
              </div>

              <div className="gauge-body">
                <span className="gauge-val">{gauge.value}</span>
                <span className="gauge-title">{gauge.title}</span>
                <span className="gauge-target">{gauge.target}</span>
              </div>

              <div className="gauge-bar-bg">
                <div
                  className={`gauge-bar-fill ${gauge.color}`}
                  style={{ width: `${gauge.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Roadmap */}
      <div className="milestones-section">
        <div className="section-header">
          <h3 className="section-title">
            <Target size={20} className="text-emerald-400" /> Championship Phase Milestones
          </h3>
        </div>

        <div className="glass-card milestones-list-card">
          {milestones.map((m) => (
            <div key={m.id} className="milestone-row-item">
              <div className="ms-status-icon">
                {m.status === 'Completed' ? (
                  <CheckCircle2 size={22} className="text-emerald-400" />
                ) : (
                  <Clock size={22} className="text-cyan-400" />
                )}
              </div>

              <div className="ms-info-col">
                <div className="ms-header">
                  <h4>{m.name}</h4>
                  <StatusBadge status={m.status} />
                </div>
                <div className="ms-meta">
                  <span>{m.phase}</span> • <span>Target Date: {m.date}</span>
                </div>
              </div>

              <div className="ms-progress-col">
                <div className="ms-prog-header">
                  <span>Progress</span>
                  <span className="font-bold">{m.progress}%</span>
                </div>
                <div className="ms-bar-bg">
                  <div className="ms-bar-fill" style={{ width: `${m.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;

import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Sparkles,
  PieChart as PieIcon,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Coins
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useCoordinator } from './CoordinatorContext';
import './Points.css';

const Points = () => {
  const { stats, submissions, students } = useCoordinator();
  const [searchQuery, setSearchQuery] = useState('');

  // Category distribution data
  const categoryData = [
    { name: 'Segregation', points: 34500, color: '#10b981' },
    { name: 'Plastic-Free', points: 28200, color: '#0ea5e9' },
    { name: 'Waste Audit', points: 19800, color: '#8b5cf6' },
    { name: 'Composting', points: 16400, color: '#f59e0b' },
    { name: 'Innovation', points: 9600, color: '#ec4899' }
  ];

  const totalPointsAwarded = stats.totalPointsAwarded || 108500;
  const budgetTotal = 250000;
  const budgetPercent = Math.round((totalPointsAwarded / budgetTotal) * 100);

  // Points history audit logs
  const pointsAuditLog = submissions
    .filter((s) => s.status === 'Approved')
    .map((s, idx) => ({
      id: s.id,
      studentName: s.studentName,
      taskTitle: s.taskTitle,
      points: s.points,
      timestamp: s.submittedAt || 'Today, 11:20 AM',
      verifier: 'Dr. Anita Sharma',
      txId: `TXN-88${idx + 101}`
    }));

  const filteredLogs = pointsAuditLog.filter(
    (log) =>
      log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.txId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="coord-page-container points-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <Coins className="title-icon" /> Points System & Audit Ledger
          </h1>
          <p className="coord-page-subtitle">
            Manage point allocations, category distribution, verification logs, and national incentive budgets.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="points-stats-grid">
        <div className="glass-card stat-pill-box">
          <div className="pill-icon emerald">
            <Award size={24} />
          </div>
          <div>
            <span className="pill-val">{totalPointsAwarded.toLocaleString()}</span>
            <span className="pill-lbl">Total Points Awarded</span>
          </div>
        </div>

        <div className="glass-card stat-pill-box">
          <div className="pill-icon cyan">
            <Coins size={24} />
          </div>
          <div>
            <span className="pill-val">{(budgetTotal - totalPointsAwarded).toLocaleString()}</span>
            <span className="pill-lbl">Remaining Point Pool</span>
          </div>
        </div>

        <div className="glass-card stat-pill-box">
          <div className="pill-icon violet">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="pill-val">
              {Math.round(totalPointsAwarded / (submissions.filter((s) => s.status === 'Approved').length || 1))} pts
            </span>
            <span className="pill-lbl">Avg. Award / Submission</span>
          </div>
        </div>

        <div className="glass-card stat-pill-box">
          <div className="pill-icon amber">
            <Sparkles size={24} />
          </div>
          <div>
            <span className="pill-val">{budgetPercent}%</span>
            <span className="pill-lbl">Budget Utilisation</span>
          </div>
        </div>
      </div>

      {/* Visual Distribution Charts Row */}
      <div className="points-charts-row">
        {/* Bar Chart */}
        <div className="glass-card chart-panel">
          <h3 className="section-title">
            <TrendingUp size={18} className="text-emerald-400" /> Category-wise Points Distribution
          </h3>
          <div className="points-chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(val) => [`${val.toLocaleString()} pts`, 'Points']}
                />
                <Bar dataKey="points" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share List */}
        <div className="glass-card share-panel">
          <h3 className="section-title">
            <PieIcon size={18} className="text-cyan-400" /> Category Breakdown
          </h3>
          <div className="category-shares-list">
            {categoryData.map((cat, idx) => {
              const percent = Math.round((cat.points / totalPointsAwarded) * 100);
              return (
                <div key={idx} className="cat-share-item">
                  <div className="cat-share-top">
                    <div className="cat-dot-name">
                      <span className="cat-color-dot" style={{ background: cat.color }} />
                      <span className="cat-name">{cat.name}</span>
                    </div>
                    <span className="cat-pts">{cat.points.toLocaleString()} pts ({percent}%)</span>
                  </div>
                  <div className="cat-progress-bg">
                    <div
                      className="cat-progress-bar"
                      style={{ width: `${percent}%`, background: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Points Ledger & Audit Stream */}
      <div className="points-ledger-section">
        <div className="section-header">
          <h3 className="section-title">
            <ShieldCheck size={20} className="text-emerald-400" /> Real-time Points Audit Ledger
          </h3>
        </div>

        {/* Control Bar */}
        <div className="glass-card controls-bar">
          <div className="search-box-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="coord-input search-input"
              placeholder="Search by student name, task, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card table-responsive">
          <table className="coord-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Student</th>
                <th>Task / Mission</th>
                <th>Points Awarded</th>
                <th>Verified At</th>
                <th>Verified By</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-cyan-400 text-xs">{log.txId}</td>
                  <td className="font-semibold text-white">{log.studentName}</td>
                  <td>{log.taskTitle}</td>
                  <td>
                    <span className="text-emerald-400 font-bold">+{log.points} pts</span>
                  </td>
                  <td className="text-slate-400">{log.timestamp}</td>
                  <td>
                    <span className="verifier-pill">
                      <ShieldCheck size={13} className="text-emerald-400" /> {log.verifier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Points;


import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  PieChart as PieIcon,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Leaf
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useCoordinator } from './CoordinatorContext';
import './Analytics.css';

const Analytics = () => {
  const { analyticsData, stats, colleges } = useCoordinator();
  const [timeRange, setTimeRange] = useState('14d');

  // Colors
  const COLORS = ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899'];

  // Top Colleges Chart Data
  const topCollegesChartData = colleges
    .slice(0, 5)
    .map((c) => ({
      name: c.name.length > 15 ? c.name.slice(0, 14) + '...' : c.name,
      points: c.points,
      students: c.studentsCount || 80
    }));

  const handleExportReport = () => {
    alert('Generating detailed Ecolympics Analytics Report (PDF / CSV)...');
  };

  return (
    <div className="coord-page-container analytics-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <BarChart3 className="title-icon" /> Competition Intelligence & Analytics
          </h1>
          <p className="coord-page-subtitle">
            Deep-dive metrics on student engagement, approval velocity, waste diversion distribution, and institutional performance.
          </p>
        </div>
        <div className="coord-page-actions">
          <div className="select-wrap">
            <Calendar size={16} className="select-icon" />
            <select
              className="coord-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="14d">Last 14 Days</option>
              <option value="30d">Championship Inception</option>
            </select>
          </div>
          <button className="coord-btn coord-btn-secondary" onClick={handleExportReport}>
            <Download size={16} /> Export Intelligence Report
          </button>
        </div>
      </div>

      {/* Analytics KPI Tiles */}
      <div className="analytics-kpi-grid">
        <div className="glass-card kpi-tile">
          <div className="kpi-icon emerald">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-data">
            <span className="kpi-val">94.2%</span>
            <span className="kpi-lbl">Verification Approval Rate</span>
          </div>
        </div>

        <div className="glass-card kpi-tile">
          <div className="kpi-icon cyan">
            <Clock size={22} />
          </div>
          <div className="kpi-data">
            <span className="kpi-val">1.8 hrs</span>
            <span className="kpi-lbl">Avg. Review Turnaround</span>
          </div>
        </div>

        <div className="glass-card kpi-tile">
          <div className="kpi-icon violet">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-data">
            <span className="kpi-val">128 / day</span>
            <span className="kpi-lbl">Submission Velocity</span>
          </div>
        </div>

        <div className="glass-card kpi-tile">
          <div className="kpi-icon amber">
            <Leaf size={22} />
          </div>
          <div className="kpi-data">
            <span className="kpi-val">12.3 Tons</span>
            <span className="kpi-lbl">Total Diverted Footprint</span>
          </div>
        </div>
      </div>

      {/* Chart Row 1: Submissions Trend & Category Pie */}
      <div className="analytics-charts-row">
        {/* Submissions & Approvals Daily Trend */}
        <div className="glass-card chart-card-full">
          <div className="chart-card-header">
            <div className="title-group">
              <TrendingUp className="text-emerald-400" size={18} />
              <h3>Submission Inflow vs Verified Approvals</h3>
            </div>
            <span className="chart-badge">Daily Velocity</span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.participationTrend}>
                <defs>
                  <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  name="Total Submissions"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSubmissions)"
                />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  name="Verified Approved"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApprovals)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie */}
        <div className="glass-card chart-card-side">
          <div className="chart-card-header">
            <div className="title-group">
              <PieIcon className="text-cyan-400" size={18} />
              <h3>Task Category Share</h3>
            </div>
          </div>

          <div className="chart-wrapper pie-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={analyticsData.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(val, name) => [`${val}% of tasks`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Pie Legend */}
            <div className="pie-legend-grid">
              {analyticsData.categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="pie-legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  <span className="legend-lbl">{cat.name} ({cat.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Top Colleges Benchmark */}
      <div className="glass-card chart-card-full">
        <div className="chart-card-header">
          <div className="title-group">
            <Award className="text-violet-400" size={18} />
            <h3>Top 5 Institutional Performance (Score vs Enrolled Students)</h3>
          </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topCollegesChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="points" name="Total Points" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="students" name="Active Students" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;


import React from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Recycle, Sparkles } from "lucide-react";

const ProgressBar = ({
  completedTasks = 8,
  totalTasks = 12,
  points = 1240,
  maxPoints = 2000,
  wasteRecovered = "75.4 kg",
  climateActions = 12
}) => {
  const taskPercent = Math.min(Math.round((completedTasks / totalTasks) * 100), 100);
  const pointsPercent = Math.min(Math.round((points / maxPoints) * 100), 100);

  return (
    <div className="eco-progress-card">
      <div className="eco-progress-header">
        <div className="progress-title-badge">
          <Sparkles size={16} className="text-emerald-500" />
          <span>Competition Progress</span>
        </div>
        <span className="progress-phase-tag">Stage 2: Field Action Phase</span>
      </div>

      <div className="progress-bars-grid">
        {/* Task Completion Bar */}
        <div className="progress-track-item">
          <div className="track-label-row">
            <span className="track-name">
              <CheckCircle2 size={15} className="text-emerald-600" />
              Tasks Completed
            </span>
            <span className="track-val font-semibold">
              {completedTasks} <span className="text-muted">/ {totalTasks}</span>
            </span>
          </div>
          <div className="progress-bar-bg">
            <motion.div
              className="progress-bar-fill fill-emerald"
              initial={{ width: 0 }}
              animate={{ width: `${taskPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="track-sub-row">
            <span>{taskPercent}% target achieved</span>
            <span>{totalTasks - completedTasks} remaining</span>
          </div>
        </div>

        {/* Points Accumulated Bar */}
        <div className="progress-track-item">
          <div className="track-label-row">
            <span className="track-name">
              <Award size={15} className="text-amber-500" />
              Points Earned
            </span>
            <span className="track-val font-semibold">
              {points} <span className="text-muted">/ {maxPoints} pts</span>
            </span>
          </div>
          <div className="progress-bar-bg">
            <motion.div
              className="progress-bar-fill fill-amber"
              initial={{ width: 0 }}
              animate={{ width: `${pointsPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            />
          </div>
          <div className="track-sub-row">
            <span>{pointsPercent}% to Regional Final Qualifier</span>
            <span>Rank #8 in Division</span>
          </div>
        </div>
      </div>

      {/* Mini Stat Badges */}
      <div className="progress-badges-row">
        <div className="progress-badge-chip">
          <Recycle size={15} className="text-emerald-600" />
          <div className="badge-chip-text">
            <strong>{wasteRecovered}</strong>
            <span>Waste Diverted</span>
          </div>
        </div>

        <div className="progress-badge-chip">
          <Sparkles size={15} className="text-blue-500" />
          <div className="badge-chip-text">
            <strong>{climateActions} Actions</strong>
            <span>Impact Initiatives</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

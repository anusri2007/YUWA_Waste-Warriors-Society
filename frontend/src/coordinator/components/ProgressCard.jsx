import React from "react";

const ProgressCard = ({
  title,
  percentage,
  value,
  total,
  unit = "",
  color = "#10b981",
  icon: Icon,
  description
}) => {
  const strokeDashoffset = 251 - (251 * Math.min(100, percentage)) / 100;

  return (
    <div className="coordinator-progress-card glass-card">
      <div className="prog-card-top">
        {Icon && (
          <div className="prog-icon-badge" style={{ color: color, borderColor: `${color}40`, backgroundColor: `${color}15` }}>
            <Icon size={20} />
          </div>
        )}
        <div>
          <h4 className="prog-title">{title}</h4>
          {description && <span className="prog-desc">{description}</span>}
        </div>
      </div>

      <div className="prog-center-ring">
        <svg className="prog-svg" viewBox="0 0 100 100">
          <circle className="prog-svg-bg" cx="50" cy="50" r="40" />
          <circle
            className="prog-svg-fill"
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeDasharray="251"
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="prog-ring-text">
          <span className="prog-pct-num" style={{ color: color }}>{percentage}%</span>
          <span className="prog-pct-lbl">Achieved</span>
        </div>
      </div>

      {(value !== undefined && total !== undefined) && (
        <div className="prog-card-footer">
          <span>{value} of {total} {unit}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;


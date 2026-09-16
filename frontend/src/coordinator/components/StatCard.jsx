import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  color = "emerald", // emerald | cyan | amber | violet | blue | teal
  trend,
  onClick
}) => {
  return (
    <div
      className={`glass-stat-card card-glow-${color} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="stat-card-top-row">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-icon-wrapper halo-${color}`}>
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div className="stat-card-number">{typeof value === "number" ? value.toLocaleString() : value}</div>

      <div className="stat-card-bottom-row">
        {description && <p className="stat-card-subtext">{description}</p>}
        {trend && (
          <span className="stat-trend-pill">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;


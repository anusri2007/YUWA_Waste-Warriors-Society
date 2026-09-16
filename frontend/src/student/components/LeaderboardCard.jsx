import React from "react";
import { Trophy, TrendingUp, TrendingDown, Minus, Award, Building2, Recycle } from "lucide-react";

const LeaderboardCard = ({ entry, isCurrentTeam = false }) => {
  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="rank-podium rank-gold">🥇 1</span>;
    if (rank === 2) return <span className="rank-podium rank-silver">🥈 2</span>;
    if (rank === 3) return <span className="rank-podium rank-bronze">🥉 3</span>;
    return <span className="rank-podium rank-regular">#{rank}</span>;
  };

  const getMovementIcon = (movement) => {
    if (movement === "up") return <span className="movement-tag text-emerald-600" title="Moved up"><TrendingUp size={14} /> Up</span>;
    if (movement === "down") return <span className="movement-tag text-red-500" title="Moved down"><TrendingDown size={14} /> Down</span>;
    return <span className="movement-tag text-muted" title="Stable"><Minus size={14} /> Same</span>;
  };

  return (
    <div className={`leaderboard-item-row ${isCurrentTeam ? "current-team-highlight" : ""}`}>
      <div className="lead-col-rank">
        {getRankBadge(entry.rank)}
      </div>

      <div className="lead-col-team">
        <div className="team-name-row">
          <strong className="lead-team-name">{entry.team}</strong>
          {isCurrentTeam && (
            <span className="you-badge">Your Team</span>
          )}
        </div>
        <span className="lead-college-name">
          <Building2 size={13} /> {entry.college}
        </span>
      </div>

      <div className="lead-col-waste">
        <div className="waste-stat-chip">
          <Recycle size={13} className="text-emerald-600" />
          <span>{entry.wasteRecovered} kg</span>
        </div>
      </div>

      <div className="lead-col-points">
        <span className="lead-points-val">{entry.points.toLocaleString()}</span>
        <span className="lead-points-label">pts</span>
      </div>

      <div className="lead-col-trend">
        {getMovementIcon(entry.movement)}
      </div>
    </div>
  );
};

export default LeaderboardCard;

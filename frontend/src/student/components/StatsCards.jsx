import React from "react";
import { CheckCircle2, Clock, Award, Trophy, Recycle, Sparkles } from "lucide-react";

const StatsCards = ({ statistics, student }) => {
  const statsList = [
    {
      id: "tasks-completed",
      label: "Tasks Completed",
      value: statistics?.tasksCompleted ?? student?.tasksCompleted ?? 8,
      supporting: "Verified by regional evaluators",
      icon: CheckCircle2,
      colorClass: "card-emerald"
    },
    {
      id: "tasks-pending",
      label: "Tasks Pending",
      value: statistics?.tasksPending ?? student?.tasksPending ?? 4,
      supporting: "Upcoming deadlines this week",
      icon: Clock,
      colorClass: "card-amber"
    },
    {
      id: "total-points",
      label: "Total Points",
      value: (statistics?.totalPoints ?? student?.totalPoints ?? 1240).toLocaleString(),
      supporting: "+275 pts earned this sprint",
      icon: Award,
      colorClass: "card-blue"
    },
    {
      id: "current-rank",
      label: "Current Rank",
      value: `#${statistics?.currentRank ?? student?.rank ?? 8}`,
      supporting: "Division 1 • Top 10 bracket",
      icon: Trophy,
      colorClass: "card-purple"
    },
    {
      id: "waste-recovered",
      label: "Waste Recovered",
      value: statistics?.wasteRecovered ?? `${student?.wasteRecoveredKg ?? 75.4} kg`,
      supporting: "Diverted from city landfills",
      icon: Recycle,
      colorClass: "card-teal"
    },
    {
      id: "climate-actions",
      label: "Climate Actions",
      value: statistics?.climateActions ?? student?.climateActions ?? 12,
      supporting: "Drives, plays & workshops",
      icon: Sparkles,
      colorClass: "card-green"
    }
  ];

  return (
    <div className="stats-cards-grid">
      {statsList.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className={`stat-metric-card ${item.colorClass}`}>
            <div className="stat-card-icon-bubble">
              <Icon size={22} />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label">{item.label}</span>
              <div className="stat-card-value">{item.value}</div>
              <span className="stat-card-supporting">{item.supporting}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

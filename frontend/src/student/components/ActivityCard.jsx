import React from "react";
import { Heart, Building2, Recycle, Award, Clock } from "lucide-react";

const ActivityCard = ({ activity, onCelebrate }) => {
  return (
    <div className="eco-activity-card">
      <div className="activity-card-header">
        <div className="activity-team-info">
          <div className="activity-avatar-circle">
            {activity.team.charAt(0)}
          </div>
          <div>
            <h4 className="activity-team-name">{activity.team}</h4>
            <span className="activity-college-name">
              <Building2 size={12} /> {activity.college}
            </span>
          </div>
        </div>

        <span className="activity-time-stamp">
          <Clock size={12} /> {activity.time}
        </span>
      </div>

      <p className="activity-text">{activity.activity}</p>

      {activity.photo && (
        <div className="activity-photo-wrap">
          <img
            src={activity.photo}
            alt={activity.activity}
            className="activity-photo"
            loading="lazy"
          />
        </div>
      )}

      <div className="activity-card-footer">
        <div className="activity-stats-row">
          <span className="act-stat-badge stat-waste">
            <Recycle size={13} /> {activity.wasteRecovered} recovered
          </span>
          <span className="act-stat-badge stat-points">
            <Award size={13} /> +{activity.pointsEarned} pts
          </span>
        </div>

        <button
          type="button"
          className={`btn-celebrate ${activity.userCelebrated ? "celebrated" : ""}`}
          onClick={() => onCelebrate && onCelebrate(activity.id)}
          title="Celebrate this climate initiative"
        >
          <Heart
            size={16}
            className={activity.userCelebrated ? "fill-current text-rose-500" : ""}
          />
          <span>Celebrate ({activity.celebrations || 0})</span>
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;

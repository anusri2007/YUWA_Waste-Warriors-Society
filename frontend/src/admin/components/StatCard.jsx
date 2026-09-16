function StatCard({ title, value, icon, description, badge }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <div className="admin-stat-icon">{icon}</div>
        <span className="admin-stat-value">{value}</span>
      </div>

      <div className="admin-stat-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      {badge && <div className="admin-stat-footer">{badge}</div>}
    </div>
  );
}

export default StatCard;


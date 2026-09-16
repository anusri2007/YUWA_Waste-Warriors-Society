function StatCard({ title, value, icon, description }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
        <span className="stat-value">{value}</span>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default StatCard;
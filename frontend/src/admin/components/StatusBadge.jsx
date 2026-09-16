function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase();

  let badgeClass = "badge-default";
  if (normalized === "active" || normalized === "approved" || normalized === "completed") {
    badgeClass = "badge-success";
  } else if (normalized === "pending" || normalized === "upcoming") {
    badgeClass = "badge-warning";
  } else if (normalized === "rejected" || normalized === "inactive") {
    badgeClass = "badge-danger";
  } else if (normalized === "draft") {
    badgeClass = "badge-neutral";
  }

  return <span className={`admin-status-badge ${badgeClass}`}>{status}</span>;
}

export default StatusBadge;


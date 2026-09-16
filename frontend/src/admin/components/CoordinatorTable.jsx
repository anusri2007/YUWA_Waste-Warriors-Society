import StatusBadge from "./StatusBadge";

function CoordinatorTable({
  coordinators,
  onApprove,
  onReject,
  onViewDetails,
}) {
  if (!coordinators || coordinators.length === 0) {
    return (
      <div className="admin-empty-state">
        <div className="admin-empty-icon">👥</div>
        <h3>No coordinators found</h3>
        <p>No records match the current filter or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Coordinator Name</th>
            <th>Contact Info</th>
            <th>Affiliated Institution</th>
            <th>Request Date</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coordinators.map((coord) => (
            <tr key={coord.id}>
              <td>
                <strong
                  style={{ cursor: "pointer", color: "#197642" }}
                  onClick={() => onViewDetails && onViewDetails(coord)}
                  title="Click to view details"
                >
                  {coord.name}
                </strong>
                <div style={{ fontSize: "11px", color: "#648078", marginTop: "2px" }}>
                  ID: COORD-{coord.id.toString().padStart(4, "0")}
                </div>
              </td>

              <td>
                <div>{coord.email}</div>
                <div style={{ fontSize: "11px", color: "#648078" }}>{coord.phone}</div>
              </td>

              <td>
                <strong>{coord.college}</strong>
              </td>

              <td style={{ fontSize: "12px", color: "#648078" }}>
                {coord.requestDate}
              </td>

              <td>
                <StatusBadge status={coord.status} />
              </td>

              <td>
                <div className="admin-table-actions" style={{ justifyContent: "flex-end" }}>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => onViewDetails && onViewDetails(coord)}
                    title="View Profile Details"
                  >
                    View
                  </button>

                  {coord.status === "Pending" && (
                    <>
                      <button
                        className="admin-btn admin-btn-primary admin-btn-sm"
                        onClick={() => onApprove && onApprove(coord)}
                        title="Approve Coordinator"
                      >
                        Approve
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => onReject && onReject(coord)}
                        title="Reject Coordinator Application"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {coord.status === "Rejected" && (
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => onApprove && onApprove(coord)}
                      title="Reconsider & Approve"
                    >
                      Re-approve
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoordinatorTable;


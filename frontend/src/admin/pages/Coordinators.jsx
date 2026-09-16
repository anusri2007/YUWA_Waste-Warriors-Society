import { useState, useMemo } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import CoordinatorTable from "../components/CoordinatorTable";
import SearchBar from "../components/SearchBar";
import FormModal from "../components/FormModal";
import StatusBadge from "../components/StatusBadge";
import { useAdmin } from "../context/AdminContext";

function Coordinators() {
  const {
    coordinators,
    approveCoordinator,
    rejectCoordinator,
  } = useAdmin();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Modals state
  const [rejectingCoord, setRejectingCoord] = useState(null);
  const [rejectReason, setRejectReason] = useState("Unverified Institutional Credentials");
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [viewingCoord, setViewingCoord] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Counts
  const counts = {
    all: coordinators.length,
    pending: coordinators.filter((c) => c.status === "Pending").length,
    approved: coordinators.filter((c) => c.status === "Approved").length,
    rejected: coordinators.filter((c) => c.status === "Rejected").length,
  };

  // Filtered coordinators list
  const filteredCoordinators = useMemo(() => {
    return coordinators.filter((coord) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        coord.name.toLowerCase().includes(q) ||
        coord.email.toLowerCase().includes(q) ||
        coord.college.toLowerCase().includes(q);

      const matchesTab =
        activeTab === "all" || coord.status.toLowerCase() === activeTab.toLowerCase();

      return matchesSearch && matchesTab;
    });
  }, [coordinators, search, activeTab]);

  // Handle Approve
  const handleApprove = (coord) => {
    approveCoordinator(coord.id);
    showToast(`Coordinator "${coord.name}" approved successfully.`);
  };

  // Handle Reject Submit
  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (rejectingCoord) {
      const fullReason = rejectRemarks.trim()
        ? `${rejectReason}: ${rejectRemarks.trim()}`
        : rejectReason;
      rejectCoordinator(rejectingCoord.id, fullReason);
      showToast(`Coordinator "${rejectingCoord.name}" application rejected.`);
      setRejectingCoord(null);
      setRejectRemarks("");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminHeader title="Coordinators Management" subtitle="Faculty & Campus Lead Approvals" />

        <div className="admin-content">
          {/* TOAST NOTIFICATION */}
          {toastMessage && (
            <div className="admin-toast">
              <span>✓</span>
              {toastMessage}
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="admin-page-header">
            <div>
              <span className="admin-workspace-label">Faculty & Lead Verification</span>
              <h1>Coordinator Applications & Approvals</h1>
              <p>
                Review and approve college coordinators to supervise student environmental teams and certify task evidence.
              </p>
            </div>
          </div>

          {/* STATUS TABS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              borderBottom: "1px solid #dce7e2",
              marginBottom: "24px",
            }}
          >
            <button
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: activeTab === "all" ? 700 : 500,
                color: activeTab === "all" ? "#197642" : "#648078",
                borderBottom: activeTab === "all" ? "3px solid #197642" : "3px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => setActiveTab("all")}
            >
              All Coordinators
              <span
                style={{
                  background: activeTab === "all" ? "#dff4e5" : "#edf2ef",
                  color: activeTab === "all" ? "#167442" : "#71817c",
                  padding: "2px 7px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {counts.all}
              </span>
            </button>

            <button
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: activeTab === "pending" ? 700 : 500,
                color: activeTab === "pending" ? "#a76b00" : "#648078",
                borderBottom: activeTab === "pending" ? "3px solid #e59d18" : "3px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => setActiveTab("pending")}
            >
              Pending Verification
              <span
                style={{
                  background: "#fff3d8",
                  color: "#a76b00",
                  padding: "2px 7px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {counts.pending}
              </span>
            </button>

            <button
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: activeTab === "approved" ? 700 : 500,
                color: activeTab === "approved" ? "#197642" : "#648078",
                borderBottom: activeTab === "approved" ? "3px solid #197642" : "3px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => setActiveTab("approved")}
            >
              Approved Leads
              <span
                style={{
                  background: "#def5e8",
                  color: "#177345",
                  padding: "2px 7px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {counts.approved}
              </span>
            </button>

            <button
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: activeTab === "rejected" ? 700 : 500,
                color: activeTab === "rejected" ? "#c9363f" : "#648078",
                borderBottom: activeTab === "rejected" ? "3px solid #c9363f" : "3px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => setActiveTab("rejected")}
            >
              Rejected
              <span
                style={{
                  background: "#ffe3e5",
                  color: "#c9363f",
                  padding: "2px 7px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {counts.rejected}
              </span>
            </button>
          </div>

          {/* TOOLBAR */}
          <div className="admin-toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Search coordinator by name, institutional email, or college..."
            />

            {search && (
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )}
          </div>

          {/* TABLE SECTION CARD */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h2>
                  {activeTab === "all"
                    ? "All Coordinators"
                    : `${activeTab.charAt(0).toUpperCase()}${activeTab.slice(1)} Coordinators`}{" "}
                  ({filteredCoordinators.length})
                </h2>
                <p>Status of institutional faculty advisors across affiliated colleges</p>
              </div>
            </div>

            <CoordinatorTable
              coordinators={filteredCoordinators}
              onApprove={handleApprove}
              onReject={setRejectingCoord}
              onViewDetails={setViewingCoord}
            />
          </div>

          {/* =========================================================
              MODAL: REJECT COORDINATOR
             ========================================================= */}
          {rejectingCoord && (
            <FormModal
              isOpen={!!rejectingCoord}
              title={`Reject Application: ${rejectingCoord.name}`}
              onClose={() => setRejectingCoord(null)}
            >
              <form onSubmit={handleConfirmReject}>
                <p style={{ fontSize: "13px", color: "#648078", marginBottom: "16px" }}>
                  Please indicate the primary grounds for declining this coordinator request. This feedback will assist in re-application.
                </p>

                <div className="admin-form-group">
                  <label>Primary Reason *</label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  >
                    <option value="Unverified Institutional Credentials">
                      Unverified Institutional Credentials
                    </option>
                    <option value="College Not Registered with YUWA">
                      College Not Registered with YUWA
                    </option>
                    <option value="Duplicate Application for Same Campus">
                      Duplicate Application for Same Campus
                    </option>
                    <option value="Invalid Contact Information">
                      Invalid Contact Information
                    </option>
                    <option value="Other Specific Criteria">
                      Other Specific Criteria
                    </option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Additional Notes / Remarks</label>
                  <textarea
                    rows="3"
                    placeholder="Provide specific details or next steps for the applicant..."
                    value={rejectRemarks}
                    onChange={(e) => setRejectRemarks(e.target.value)}
                  />
                </div>

                <div className="admin-modal-footer" style={{ margin: "24px -24px -24px" }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setRejectingCoord(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-danger">
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </FormModal>
          )}

          {/* =========================================================
              MODAL: VIEW COORDINATOR DETAILS
             ========================================================= */}
          {viewingCoord && (
            <FormModal
              isOpen={!!viewingCoord}
              title={`Coordinator Profile: ${viewingCoord.name}`}
              onClose={() => setViewingCoord(null)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div
                  style={{
                    background: "#f8faf9",
                    padding: "16px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "16px" }}>{viewingCoord.name}</strong>
                    <div style={{ fontSize: "12px", color: "#648078" }}>
                      Registered on {viewingCoord.requestDate}
                    </div>
                  </div>
                  <StatusBadge status={viewingCoord.status} />
                </div>

                <div className="admin-form-row">
                  <div style={{ background: "#f8faf9", padding: "14px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "12px", color: "#648078" }}>EMAIL ADDRESS</div>
                    <strong style={{ fontSize: "13px" }}>{viewingCoord.email}</strong>
                  </div>

                  <div style={{ background: "#f8faf9", padding: "14px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "12px", color: "#648078" }}>PHONE NUMBER</div>
                    <strong style={{ fontSize: "13px" }}>{viewingCoord.phone}</strong>
                  </div>
                </div>

                <div style={{ background: "#f8faf9", padding: "14px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#648078" }}>AFFILIATED INSTITUTION</div>
                  <strong style={{ fontSize: "14px" }}>{viewingCoord.college}</strong>
                </div>

                {viewingCoord.rejectionReason && (
                  <div style={{ background: "#ffe3e5", padding: "14px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "12px", color: "#c9363f", fontWeight: 700 }}>REJECTION REASON</div>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#55272a" }}>
                      {viewingCoord.rejectionReason}
                    </p>
                  </div>
                )}

                <div className="admin-modal-footer" style={{ margin: "16px -24px -24px" }}>
                  {viewingCoord.status === "Pending" && (
                    <>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => {
                          setRejectingCoord(viewingCoord);
                          setViewingCoord(null);
                        }}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary"
                        onClick={() => {
                          handleApprove(viewingCoord);
                          setViewingCoord(null);
                        }}
                      >
                        Approve Coordinator
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setViewingCoord(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </FormModal>
          )}
        </div>
      </main>
    </div>
  );
}

export default Coordinators;


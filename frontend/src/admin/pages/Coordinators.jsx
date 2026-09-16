import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

function Coordinators() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <AdminHeader title="Coordinators Management" subtitle="Faculty & Lead Approvals" />
        <div className="admin-content">
          <p>Loading Coordinators module...</p>
        </div>
      </main>
    </div>
  );
}

export default Coordinators;

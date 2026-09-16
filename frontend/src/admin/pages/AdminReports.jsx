import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

function AdminReports() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <AdminHeader title="Reports & Analytics" subtitle="Society-Wide Metrics" />
        <div className="admin-content">
          <p>Loading Reports module...</p>
        </div>
      </main>
    </div>
  );
}

export default AdminReports;

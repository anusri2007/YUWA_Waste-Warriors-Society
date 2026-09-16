import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

function Colleges() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <AdminHeader title="Colleges Management" subtitle="Institutional Directory" />
        <div className="admin-content">
          <p>Loading Colleges module...</p>
        </div>
      </main>
    </div>
  );
}

export default Colleges;

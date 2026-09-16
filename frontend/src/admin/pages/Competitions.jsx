import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

function Competitions() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <AdminHeader title="Competitions Management" subtitle="Environmental Challenges" />
        <div className="admin-content">
          <p>Loading Competitions module...</p>
        </div>
      </main>
    </div>
  );
}

export default Competitions;

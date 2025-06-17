
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AuthGuard from "../Auth/AuthGuard";

const AdminLayout = () => {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminLayout;
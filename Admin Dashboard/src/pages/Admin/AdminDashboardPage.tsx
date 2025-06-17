
import AdminDashboardContent from "@/components/Admin/Dashboard/AdminDashboardContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";
import { useEffect, useState } from "react";

interface UserData {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

const AdminDashboardPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      const user = JSON.parse(userDataString);
      setUserData(user);
    }
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto">
        <AdminDashboardContent departmentFilter={userData.department} />
      </div>
    </AuthGuard>
  );
};

export default AdminDashboardPage;


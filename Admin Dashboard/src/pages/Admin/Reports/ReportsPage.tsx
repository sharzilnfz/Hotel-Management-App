
import ReportsContent from "@/components/Admin/Reports/ReportsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";
import { useState, useEffect } from "react";

interface UserData {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

const ReportsPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      const user = JSON.parse(userDataString);
      setUserData(user);
    }
  }, []);

  // Allow access to all departments, regardless of access level
  return (
    <AuthGuard>
      <div className="container mx-auto">
        <ReportsContent department={userData?.department || 'Management'} />
      </div>
    </AuthGuard>
  );
};

export default ReportsPage;

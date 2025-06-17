
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddStaffMemberForm from "@/components/Admin/Staff/AddStaffMemberForm";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";
import { toast } from "sonner";

interface CurrentUser {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

const AddStaffMemberPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  
  useEffect(() => {
    // Get current user from localStorage
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      setCurrentUser(JSON.parse(userDataString));
    }
    
    // Check if user can add staff members
    const checkPermission = () => {
      if (!userDataString) {
        toast.error("You must be logged in");
        navigate("/admin-login");
        return;
      }
      
      const userData: CurrentUser = JSON.parse(userDataString);
      
      // Only administrators, managers, or users with Administrative access can add staff
      if (
        userData.accessLevel !== "Full Access" && 
        userData.accessLevel !== "Administrative" && 
        userData.role !== "Administrator" && 
        userData.role !== "Manager"
      ) {
        toast.error("You don't have permission to add staff members");
        navigate("/admin");
        return;
      }
    };
    
    checkPermission();
  }, [navigate]);

  return (
    <AuthGuard requiredRoles={["Administrator", "Manager"]} requiredDepartments={["Management", "Human Resources"]}>
      <div className="container mx-auto">
        {currentUser && <AddStaffMemberForm currentUserDepartment={currentUser.department} currentUserRole={currentUser.role} />}
      </div>
    </AuthGuard>
  );
};

export default AddStaffMemberPage;

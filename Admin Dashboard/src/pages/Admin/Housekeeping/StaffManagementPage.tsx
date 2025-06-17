
import StaffManagement from "@/components/Admin/Housekeeping/StaffManagement";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const StaffManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Housekeeping"]}>
      <div className="container mx-auto">
        <StaffManagement />
      </div>
    </AuthGuard>
  );
};

export default StaffManagementPage;

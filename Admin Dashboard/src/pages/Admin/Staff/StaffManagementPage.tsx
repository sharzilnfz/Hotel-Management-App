
import StaffManagementContent from "@/components/Admin/Staff/StaffManagementContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const StaffManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Human Resources"]}>
      <div className="container mx-auto">
        <StaffManagementContent />
      </div>
    </AuthGuard>
  );
};

export default StaffManagementPage;

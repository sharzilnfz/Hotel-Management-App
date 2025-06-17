
import UsersManagementContent from "@/components/Admin/Users/UsersManagementContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const UsersManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Human Resources"]}>
      <div className="container mx-auto">
        <UsersManagementContent />
      </div>
    </AuthGuard>
  );
};

export default UsersManagementPage;

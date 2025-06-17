
import SuppliesManagement from "@/components/Admin/Housekeeping/SuppliesManagement";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const SuppliesPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Housekeeping"]}>
      <div className="container mx-auto">
        <SuppliesManagement />
      </div>
    </AuthGuard>
  );
};

export default SuppliesPage;

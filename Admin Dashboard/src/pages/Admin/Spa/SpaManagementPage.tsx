
import SpaManagementContent from "@/components/Admin/Spa/SpaManagementContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const SpaManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Spa & Wellness"]}>
      <div className="container mx-auto">
        <SpaManagementContent />
      </div>
    </AuthGuard>
  );
};

export default SpaManagementPage;

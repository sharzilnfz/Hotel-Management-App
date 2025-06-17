
import TaxSettingsContent from "@/components/Admin/Tax/TaxSettingsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const TaxSettingsPage = () => {
  return (
    <AuthGuard requiredRoles={["Administrator"]} requiredDepartments={["Management", "Finance"]}>
      <div className="container mx-auto">
        <TaxSettingsContent />
      </div>
    </AuthGuard>
  );
};

export default TaxSettingsPage;

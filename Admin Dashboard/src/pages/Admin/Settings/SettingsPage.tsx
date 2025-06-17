
import SettingsContent from "@/components/Admin/Settings/SettingsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const SettingsPage = () => {
  return (
    <AuthGuard requiredRoles={["Administrator"]} requiredDepartments={["Management"]}>
      <div className="container mx-auto">
        <SettingsContent />
      </div>
    </AuthGuard>
  );
};

export default SettingsPage;


import ContentManagementDashboard from "@/components/Admin/ContentManagement/ContentManagementDashboard";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const ContentManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Sales & Marketing"]}>
      <div className="container mx-auto">
        <ContentManagementDashboard />
      </div>
    </AuthGuard>
  );
};

export default ContentManagementPage;

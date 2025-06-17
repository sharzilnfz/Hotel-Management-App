
import HousekeepingReports from "@/components/Admin/Housekeeping/HousekeepingReports";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const ReportsPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Housekeeping"]}>
      <div className="container mx-auto">
        <HousekeepingReports />
      </div>
    </AuthGuard>
  );
};

export default ReportsPage;

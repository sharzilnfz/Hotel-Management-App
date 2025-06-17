
import ScheduleManagement from "@/components/Admin/Housekeeping/ScheduleManagement";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const SchedulePage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Housekeeping"]}>
      <div className="container mx-auto">
        <ScheduleManagement />
      </div>
    </AuthGuard>
  );
};

export default SchedulePage;

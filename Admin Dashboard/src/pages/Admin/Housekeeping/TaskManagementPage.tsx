
import TaskManagement from "@/components/Admin/Housekeeping/TaskManagement";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const TaskManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Housekeeping"]}>
      <div className="container mx-auto">
        <TaskManagement />
      </div>
    </AuthGuard>
  );
};

export default TaskManagementPage;

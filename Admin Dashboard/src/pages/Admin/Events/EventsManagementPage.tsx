
import EventsManagementContent from "@/components/Admin/Events/EventsManagementContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const EventsManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Events"]}>
      <div className="container mx-auto">
        <EventsManagementContent />
      </div>
    </AuthGuard>
  );
};

export default EventsManagementPage;

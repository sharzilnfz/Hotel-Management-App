
import EventsReportsContent from "@/components/Admin/Events/EventsReportsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const EventsReportsPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Events", "Sales & Marketing"]}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Event Analytics & Reports</h1>
        <EventsReportsContent />
      </div>
    </AuthGuard>
  );
};

export default EventsReportsPage;

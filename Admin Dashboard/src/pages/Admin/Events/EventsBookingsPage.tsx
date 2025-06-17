
import EventsBookingsContent from "@/components/Admin/Events/EventsBookingsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const EventsBookingsPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Events"]}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Events Bookings</h1>
        <EventsBookingsContent />
      </div>
    </AuthGuard>
  );
};

export default EventsBookingsPage;

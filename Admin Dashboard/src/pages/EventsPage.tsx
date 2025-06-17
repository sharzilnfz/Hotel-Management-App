
import EventsList from "@/components/Events/EventsList";

const EventsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Hotel Events</h1>
      <EventsList />
    </div>
  );
};

export default EventsPage;

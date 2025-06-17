
import EventCard from "./EventCard";

const EventsList = () => {
  // In a real app, this would be fetched from an API
  const events = [
    {
      id: "e1",
      title: "Summer Jazz Night",
      description: "Enjoy an evening of smooth jazz by the poolside with renowned local musicians.",
      date: new Date("2023-09-15T19:00:00"),
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 75,
      location: "Hotel Poolside"
    },
    {
      id: "e2",
      title: "Wine Tasting Gala",
      description: "Sample exquisite wines from around the world paired with gourmet appetizers.",
      date: new Date("2023-09-20T18:00:00"),
      imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 120,
      location: "Grand Ballroom"
    },
    {
      id: "e3",
      title: "Cooking Masterclass",
      description: "Learn to prepare signature dishes with our executive chef in this interactive class.",
      date: new Date("2023-09-25T11:00:00"),
      imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 150,
      location: "Hotel Kitchen"
    },
    {
      id: "e4",
      title: "Weekend Wellness Retreat",
      description: "A full weekend of yoga, meditation, and wellness workshops to rejuvenate your mind and body.",
      date: new Date("2023-10-01T09:00:00"),
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 299,
      location: "Wellness Center"
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {events.map(event => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          description={event.description}
          date={event.date}
          imageUrl={event.imageUrl}
          price={event.price}
          location={event.location}
        />
      ))}
    </div>
  );
};

export default EventsList;

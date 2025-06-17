
import RoomCard from "./RoomCard";

const RoomsList = () => {
  // In a real app, this would be fetched from an API
  const rooms = [
    {
      id: "r1",
      name: "Classic Room",
      description: "Our cozy classic rooms offer comfort and style for the budget-conscious traveler.",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["King Bed", "Wi-Fi", "TV", "Mini-bar"],
      capacity: 2
    },
    {
      id: "r2",
      name: "Deluxe Suite",
      description: "Spacious and elegant, our deluxe suites provide a luxurious home away from home.",
      price: 349,
      imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["King Bed", "Lounge Area", "Wi-Fi", "TV", "Mini-bar", "Bathtub"],
      capacity: 3
    },
    {
      id: "r3",
      name: "Presidential Suite",
      description: "The epitome of luxury, our presidential suite offers unparalleled comfort and amenities.",
      price: 599,
      imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["King Bed", "Separate Living Room", "Dining Area", "Wi-Fi", "TV", "Mini-bar", "Jacuzzi", "Balcony"],
      capacity: 4
    },
    {
      id: "r4",
      name: "Family Room",
      description: "Perfect for families, our spacious family rooms ensure everyone has room to relax.",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["2 Queen Beds", "Wi-Fi", "TV", "Mini-bar", "Extra Space"],
      capacity: 4
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {rooms.map(room => (
        <RoomCard
          key={room.id}
          id={room.id}
          name={room.name}
          description={room.description}
          price={room.price}
          imageUrl={room.imageUrl}
          amenities={room.amenities}
          capacity={room.capacity}
        />
      ))}
    </div>
  );
};

export default RoomsList;

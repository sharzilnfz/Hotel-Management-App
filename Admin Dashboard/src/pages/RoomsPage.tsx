
import RoomsList from "@/components/Rooms/RoomsList";

const RoomsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Room Selection</h1>
      <RoomsList />
    </div>
  );
};

export default RoomsPage;

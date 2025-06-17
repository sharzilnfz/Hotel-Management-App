
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { RoomCard } from "@/components/ui/room-card";
import { useBooking } from "@/contexts/BookingContext";
import { DatePicker } from "@/components/ui/date-picker";
import { addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RoomsList = () => {
  const navigate = useNavigate();
  const { rooms } = useBooking();
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);

  const handleRoomSelect = (roomId: string) => {
    if (!checkIn || !checkOut) {
      return;
    }
    navigate(`/rooms/${roomId}?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&guests=${guests}`);
  };

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckIn(date);
    // If check-out is earlier than check-in + 1, adjust it
    if (date && checkOut && checkOut <= date) {
      setCheckOut(addDays(date, 1));
    }
  };

  const clearFilters = () => {
    setGuests(1);
    setCheckIn(undefined);
    setCheckOut(undefined);
  };

  return (
    <MobileLayout title="Room Booking" showBackButton>
      <div className="p-4 pb-20">
        {/* Search Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4 mb-6">
          <h2 className="font-medium text-gray-800 mb-2">Find Your Perfect Room</h2>
          
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              date={checkIn}
              setDate={handleCheckInChange}
              label="Check-in"
              placeholder="Select date"
              fromDate={new Date()}
            />
            <DatePicker
              date={checkOut}
              setDate={setCheckOut}
              label="Check-out"
              placeholder="Select date"
              fromDate={checkIn ? addDays(checkIn, 1) : undefined}
            />
          </div>

          {/* Guests Selection */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Number of Guests
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hotel-burgundy focus:border-transparent appearance-none bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full border-dashed border-gray-300 mt-2"
          >
            Clear All
          </Button>
        </div>

        {/* Results Section */}
        <div className="mb-4">
          <h2 className="text-xl font-playfair font-semibold text-hotel-burgundy mb-2">
            Available Rooms
          </h2>
          <p className="text-gray-600 text-sm">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              description={room.description}
              price={room.price}
              image={room.image}
              amenities={room.amenities}
              capacity={room.capacity}
              onClick={() => handleRoomSelect(room.id)}
            />
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default RoomsList;


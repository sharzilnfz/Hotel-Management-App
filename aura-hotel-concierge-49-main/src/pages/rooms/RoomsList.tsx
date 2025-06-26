import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, Plus, Minus } from "lucide-react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { RoomCard } from "@/components/ui/room-card";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { DatePicker } from "@/components/ui/date-picker";
import { addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MultiRoomSelector } from "@/components/rooms/MultiRoomSelector";
const RoomsList = () => {
  const navigate = useNavigate();
  const {
    rooms
  } = useBooking();
  const {
    user,
    isAuthenticated
  } = useAuth();
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [showMultiRoomSelector, setShowMultiRoomSelector] = useState(false);

  // Debug logging
  console.log('RoomsList - Auth state:', {
    isAuthenticated,
    user
  });
  console.log('RoomsList - User loyalty info:', user ? {
    loyaltyPoints: user.loyaltyPoints,
    tier: user.tier
  } : 'No user');

  // Calculate if multiple rooms are needed
  const maxSingleRoomCapacity = Math.max(...rooms.map(room => room.capacity));
  const needsMultipleRooms = guests > maxSingleRoomCapacity;
  const handleRoomSelect = (roomId: string) => {
    if (!checkIn || !checkOut) {
      return;
    }
    const selectedRoom = rooms.find(r => r.id === parseInt(roomId));
    if (!selectedRoom) return;

    // If guests exceed any single room capacity, show multi-room selector
    if (needsMultipleRooms) {
      setShowMultiRoomSelector(true);
      return;
    }

    // Calculate how many rooms are needed based on guests and room capacity
    const roomsNeeded = Math.ceil(guests / selectedRoom.capacity);
    navigate(`/rooms/${roomId}?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&guests=${guests}&roomsNeeded=${roomsNeeded}`);
  };
  const handleCheckInChange = (date: Date | undefined) => {
    setCheckIn(date);
    // If check-out is earlier than check-in + 1, adjust it
    if (date && checkOut && checkOut <= date) {
      setCheckOut(addDays(date, 1));
    }
  };
  const handleSearch = () => {
    // Search functionality can be implemented here
    console.log('Searching with filters:', {
      checkIn,
      checkOut,
      guests
    });
  };
  const incrementGuests = () => {
    if (guests < 20) {
      // Increased max guests to accommodate multiple rooms
      setGuests(guests + 1);
    }
  };
  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };
  const handleGuestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 20) {
      setGuests(value);
    }
  };

  // Show multi-room selector if needed
  if (showMultiRoomSelector && checkIn && checkOut) {
    return <MobileLayout title="Select Room Combination" showBackButton>
        <MultiRoomSelector guests={guests} checkIn={checkIn} checkOut={checkOut} onBack={() => setShowMultiRoomSelector(false)} />
      </MobileLayout>;
  }
  return <MobileLayout title="Room Booking" showBackButton>
      <div className="p-4 pb-20">
        {/* Luxurious Search Panel */}
        <div className="bg-gradient-to-br from-white via-hotel-pearl to-hotel-cream rounded-2xl shadow-luxury border border-hotel-beige/30 p-5 space-y-5 mb-6 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-hotel-burgundy/10 via-transparent to-hotel-gold/10"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="font-playfair mb-1 tracking-wide text-center text-hotel-burgundy font-bold text-xl my-0 py-0 px-[33px]">
              Find Your Perfect Stay
            </h2>
            <p className="text-hotel-charcoal/60 font-montserrat mb-4 text-center text-xs">
              Discover luxury accommodations tailored to your needs
            </p>
            
            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <DatePicker date={checkIn} setDate={handleCheckInChange} label="Check-in" placeholder="Select date" fromDate={new Date()} />
              <DatePicker date={checkOut} setDate={setCheckOut} label="Check-out" placeholder="Select date" fromDate={checkIn ? addDays(checkIn, 1) : undefined} />
            </div>

            {/* Guests Selection - Luxurious Design */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-hotel-sand-dark font-montserrat tracking-wide mx-[13px]">
                Number of Guests
              </label>
              <div className="flex items-center justify-between bg-gradient-to-r from-hotel-pearl via-white to-hotel-cream border-2 border-hotel-beige/40 rounded-2xl px-4 py-2 shadow-elegant hover:shadow-luxury transition-all duration-300 max-w-sm backdrop-blur-sm">
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-xl text-hotel-burgundy hover:bg-hotel-gold/20 hover:text-hotel-burgundy transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed p-0 shadow-sm hover:shadow-md" onClick={decrementGuests} disabled={guests <= 1}>
                  <Minus size={14} strokeWidth={2.5} />
                </Button>
                
                <div className="flex items-center gap-2 px-3">
                  <div className="p-1.5 bg-hotel-burgundy/5 rounded-lg">
                    <Users className="h-4 w-4 text-hotel-burgundy" strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" min="1" max="20" value={guests} onChange={handleGuestInputChange} className="w-10 text-center border-0 bg-transparent p-0 text-base font-semibold text-hotel-charcoal focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-auto" />
                    <span className="text-sm font-medium text-hotel-charcoal/70 font-montserrat">
                      {guests === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                </div>
                
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-xl text-hotel-burgundy hover:bg-hotel-gold/20 hover:text-hotel-burgundy transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed p-0 shadow-sm hover:shadow-md" onClick={incrementGuests} disabled={guests >= 20}>
                  <Plus size={14} strokeWidth={2.5} />
                </Button>
              </div>
              
              {/* Multiple Rooms Notice */}
              {needsMultipleRooms && <div className="mt-3 p-3 bg-hotel-burgundy/10 border border-hotel-burgundy/20 rounded-xl">
                  <p className="text-sm text-hotel-burgundy font-medium">
                    Multiple rooms required for {guests} guests. You'll be able to select different room types.
                  </p>
                </div>}
            </div>

            {/* Search Button - Updated to match Book Now button */}
            <Button onClick={handleSearch} className="w-full h-12 font-bold text-base rounded-md flex items-center justify-center gap-3 transition-colors text-hotel-sand bg-hotel-burgundy-dark bg-red-900 hover:bg-red-800">
              <Search size={16} strokeWidth={2} />
              Search Available Rooms
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-4">
          <h2 className="text-xl font-playfair font-semibold text-hotel-burgundy mb-2 mx-[8px]">
            Available Rooms
          </h2>
          <p className="text-gray-600 text-sm mx-[10px]">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid gap-6">
          {rooms.map(room => {
          const roomsNeeded = needsMultipleRooms ? "Multiple" : Math.ceil(guests / room.capacity);
          const totalPrice = needsMultipleRooms ? 0 : room.price * (typeof roomsNeeded === 'number' ? roomsNeeded : 1);
          return <div key={room.id} className="relative">
                <RoomCard id={room.id.toString()} name={room.name} description={room.description} price={needsMultipleRooms ? room.price : totalPrice} image={room.image} amenities={room.amenities} capacity={room.capacity} onClick={() => handleRoomSelect(room.id.toString())} />
                {needsMultipleRooms ? <div className="absolute top-3 right-3 bg-hotel-burgundy text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    Select combination
                  </div> : typeof roomsNeeded === 'number' && roomsNeeded > 1 && <div className="absolute top-3 right-3 bg-hotel-burgundy text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    {roomsNeeded} rooms needed
                  </div>}
              </div>;
        })}
        </div>
      </div>
    </MobileLayout>;
};
export default RoomsList;
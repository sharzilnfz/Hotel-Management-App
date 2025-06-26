import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBooking } from "@/contexts/BookingContext";
import { Plus, Minus, Users, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface MultiRoomSelectorProps {
  guests: number;
  checkIn: Date;
  checkOut: Date;
  onBack: () => void;
}

interface RoomSelection {
  roomId: number;
  quantity: number;
}

export const MultiRoomSelector = ({ guests, checkIn, checkOut, onBack }: MultiRoomSelectorProps) => {
  const { rooms } = useBooking();
  const navigate = useNavigate();
  
  const [selectedRooms, setSelectedRooms] = useState<RoomSelection[]>([]);

  // Calculate total capacity and cost
  const totalCapacity = selectedRooms.reduce((total, selection) => {
    const room = rooms.find(r => r.id === selection.roomId);
    return total + (room ? room.capacity * selection.quantity : 0);
  }, 0);

  const totalCost = selectedRooms.reduce((total, selection) => {
    const room = rooms.find(r => r.id === selection.roomId);
    return total + (room ? room.price * selection.quantity : 0);
  }, 0);

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = totalCost * nights;

  const updateRoomQuantity = (roomId: number, change: number) => {
    setSelectedRooms(prev => {
      const existing = prev.find(s => s.roomId === roomId);
      if (existing) {
        const newQuantity = existing.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter(s => s.roomId !== roomId);
        }
        return prev.map(s => 
          s.roomId === roomId ? { ...s, quantity: newQuantity } : s
        );
      } else if (change > 0) {
        return [...prev, { roomId, quantity: 1 }];
      }
      return prev;
    });
  };

  const getSelectedQuantity = (roomId: number) => {
    return selectedRooms.find(s => s.roomId === roomId)?.quantity || 0;
  };

  const canProceed = totalCapacity >= guests && selectedRooms.length > 0;

  const handleProceed = () => {
    if (!canProceed) return;

    // Create a booking configuration with multiple rooms
    const roomsConfig = selectedRooms.map(selection => ({
      roomId: selection.roomId,
      quantity: selection.quantity
    }));

    const params = new URLSearchParams({
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests: guests.toString(),
      multiRoom: 'true',
      rooms: JSON.stringify(roomsConfig)
    });

    navigate(`/rooms/multi-booking?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-hotel-burgundy/10"
            >
              <ArrowLeft size={20} className="text-hotel-burgundy" />
            </Button>
            <div>
              <h1 className="text-xl font-playfair font-semibold text-hotel-burgundy">
                Select Room Combination
              </h1>
              <p className="text-sm text-hotel-charcoal/70">
                {format(checkIn, "MMM d")} - {format(checkOut, "MMM d, yyyy")} • {guests} guests
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <Card className={`border-2 ${totalCapacity >= guests ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-hotel-burgundy" />
                  <span className="font-medium">
                    Capacity: {totalCapacity} / {guests} guests
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-hotel-burgundy">
                    ${totalPrice}
                  </span>
                  <span className="text-sm text-hotel-charcoal/70 block">
                    for {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                </div>
              </div>
              {totalCapacity < guests && (
                <p className="text-sm text-orange-600 mt-2">
                  Need {guests - totalCapacity} more guest capacity
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Room Selection */}
        <div className="space-y-4 mb-8">
          {rooms.map((room) => {
            const selectedQuantity = getSelectedQuantity(room.id);
            
            return (
              <Card key={room.id} className="overflow-hidden">
                <div className="flex">
                  {/* Room Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Room Details */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-hotel-burgundy">{room.name}</h3>
                        <p className="text-sm text-hotel-charcoal/70">
                          Up to {room.capacity} guests
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-hotel-burgundy">${room.price}</span>
                        <span className="text-xs text-hotel-charcoal/70 block">per night</span>
                      </div>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-hotel-charcoal/70">
                        {selectedQuantity > 0 && `${selectedQuantity} ${selectedQuantity === 1 ? 'room' : 'rooms'} • ${selectedQuantity * room.capacity} guests`}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateRoomQuantity(room.id, -1)}
                          disabled={selectedQuantity === 0}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {selectedQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateRoomQuantity(room.id, 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Continue Booking Button - Positioned in content area */}
        <div className="bg-gradient-to-br from-white via-hotel-pearl to-hotel-cream rounded-3xl shadow-luxury border-2 border-hotel-beige/40 p-8 mx-2 backdrop-blur-sm">
          <Button
            onClick={handleProceed}
            disabled={!canProceed}
            className={`w-full h-14 rounded-2xl font-playfair font-bold text-lg transition-all duration-500 shadow-elegant hover:shadow-luxury transform relative overflow-hidden ${
              canProceed 
                ? 'bg-luxury-gradient hover:bg-hotel-burgundy/90 text-white hover:-translate-y-2 hover:scale-[1.02] active:translate-y-0 active:scale-100' 
                : 'bg-hotel-beige/50 text-hotel-charcoal/50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center relative z-10">
              {canProceed ? (
                <>
                  <ArrowRight size={22} className="mr-3 animate-pulse" />
                  <span className="tracking-wide">
                    Continue Booking
                  </span>
                </>
              ) : (
                <span className="font-montserrat font-medium">
                  {totalCapacity === 0 ? 'Select rooms to continue' : `Need ${guests - totalCapacity} more guest capacity`}
                </span>
              )}
            </div>
            {canProceed && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </Button>
          
          {canProceed && (
            <div className="text-center mt-4">
              <p className="text-sm text-hotel-charcoal/70 font-montserrat font-medium">
                Review your selection and proceed to booking details
              </p>
              <div className="flex items-center justify-center mt-2 text-xs text-hotel-charcoal/50">
                <div className="w-8 h-px bg-hotel-burgundy/30"></div>
                <span className="mx-3 font-playfair italic">Luxury Awaits</span>
                <div className="w-8 h-px bg-hotel-burgundy/30"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

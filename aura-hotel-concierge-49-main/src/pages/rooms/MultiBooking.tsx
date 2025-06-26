import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookingConfirmation } from "@/components/ui/booking-confirmation";
import { GuestInfoForm } from "@/components/events/GuestInfoForm";
import { ExtrasSelector } from "@/components/ui/extras-selector";

const MultiBooking = () => {
  const [searchParams] = useSearchParams();
  const {
    rooms,
    bookRoom,
    getRoomExtras,
    getRoomAddons
  } = useBooking();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  const [selectedExtras, setSelectedExtras] = useState<{
    id: string;
    quantity: number;
  }[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{
    id: string;
    quantity: number;
  }[]>([]);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  // Parse URL parameters
  const checkIn = new Date(searchParams.get('checkIn') || '');
  const checkOut = new Date(searchParams.get('checkOut') || '');
  const guests = parseInt(searchParams.get('guests') || '1');
  const roomsConfig = JSON.parse(searchParams.get('rooms') || '[]');

  // Calculate booking details
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const bookingDetails = roomsConfig.map((config: any) => {
    const room = rooms.find(r => r.id === config.roomId);
    return {
      room,
      quantity: config.quantity,
      subtotal: room ? room.price * config.quantity * nights : 0
    };
  });
  const calculateExtrasTotal = () => {
    const roomExtras = getRoomExtras();
    const roomAddons = getRoomAddons();
    const extrasTotal = selectedExtras.reduce((total, selected) => {
      const extra = roomExtras.find(e => e.id === selected.id);
      return total + (extra ? extra.price * selected.quantity : 0);
    }, 0);
    const addonsTotal = selectedAddons.reduce((total, selected) => {
      const addon = roomAddons.find(a => a.id === selected.id);
      return total + (addon ? addon.price * selected.quantity : 0);
    }, 0);
    return extrasTotal + addonsTotal;
  };
  const roomsTotal = bookingDetails.reduce((total, detail) => total + detail.subtotal, 0);
  const totalPrice = roomsTotal + calculateExtrasTotal();
  const totalRooms = bookingDetails.reduce((total, detail) => total + detail.quantity, 0);
  const handleBooking = () => {
    setShowGuestForm(true);
  };
  const handleGuestInfoSubmit = (guestInfo: any) => {
    // Navigate to payment page instead of directly booking
    const roomNames = bookingDetails.map(detail => `${detail.room?.name} (${detail.quantity})`).join(', ');
    const bookingData = {
      bookingType: "room",
      title: `Multiple Rooms (${totalRooms} rooms)`,
      date: `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d, yyyy")}`,
      details: `${nights} nights • ${guests} guests • ${roomNames}`,
      location: "Luxury Hotel",
      guestInfo,
      totalPrice,
      selectedExtras,
      selectedAddons,
      multiRoomData: {
        bookingDetails,
        checkIn,
        checkOut,
        nights,
        guests
      }
    };
    const onConfirm = async (paymentData: any) => {
      try {
        // Book all rooms
        const bookings = [];
        for (const detail of bookingDetails) {
          if (detail.room) {
            for (let i = 0; i < detail.quantity; i++) {
              const booking = bookRoom(detail.room.id, checkIn, checkOut);
              bookings.push(booking);
            }
          }
        }

        // Convert selected extras and addons to BookingExtra format
        const roomExtras = getRoomExtras();
        const roomAddons = getRoomAddons();
        const extras = selectedExtras.map(selected => {
          const extra = roomExtras.find(e => e.id === selected.id);
          return {
            id: selected.id,
            name: extra?.name,
            price: extra ? extra.price * selected.quantity : 0
          };
        });
        const addons = selectedAddons.map(selected => {
          const addon = roomAddons.find(a => a.id === selected.id);
          return {
            id: selected.id,
            name: addon?.name,
            price: addon ? addon.price * selected.quantity : 0
          };
        });
        setBookingConfirmation({
          bookingType: "room",
          confirmationCode: bookings[0]?.confirmationCode || '',
          title: `Multiple Rooms (${totalRooms} rooms)`,
          date: `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d, yyyy")}`,
          details: `${nights} nights • ${guests} guests • ${roomNames}`,
          location: "Luxury Hotel",
          name: `${guestInfo.firstName} ${guestInfo.lastName}`,
          contact: guestInfo.phone,
          email: guestInfo.email,
          extras,
          addons,
          totalPrice,
          loyaltyPoints: Math.floor(totalPrice),
          paymentMethod: paymentData.paymentMethod
        });
        setShowGuestForm(false);
      } catch (error) {
        toast({
          title: "Booking failed",
          description: error instanceof Error ? error.message : "Failed to book rooms",
          variant: "destructive"
        });
      }
    };
    navigate('/payment', {
      state: {
        bookingData,
        onConfirm
      }
    });
  };
  const handleGuestFormCancel = () => {
    setShowGuestForm(false);
  };

  // Show guest form if active
  if (showGuestForm) {
    return <MobileLayout title="Guest Information" showBackButton>
        <GuestInfoForm eventTitle={`Multiple Rooms Booking (${totalRooms} rooms)`} onSubmit={handleGuestInfoSubmit} onCancel={handleGuestFormCancel} />
      </MobileLayout>;
  }
  if (bookingConfirmation) {
    return <MobileLayout hideHeader>
        <div className="p-4 min-h-screen flex items-center justify-center">
          <BookingConfirmation {...bookingConfirmation} />
        </div>
      </MobileLayout>;
  }
  return <MobileLayout title="Booking Summary" showBackButton>
      <div className="p-4 pb-20 space-y-6">
        {/* Booking Summary Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-hotel-charcoal/70">Check-in</span>
              <span className="font-medium">{format(checkIn, "PPP")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-hotel-charcoal/70">Check-out</span>
              <span className="font-medium">{format(checkOut, "PPP")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-hotel-charcoal/70">Duration</span>
              <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-hotel-charcoal/70">Guests</span>
              <span className="font-medium">{guests} guests</span>
            </div>
          </CardContent>
        </Card>

        {/* Room Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-hotel-burgundy">Selected Rooms</h3>
          {bookingDetails.map((detail, index) => <Card key={index}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img src={detail.room?.image} alt={detail.room?.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-hotel-burgundy">{detail.room?.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-hotel-charcoal/70 mb-2">
                      <Users size={14} />
                      <span>Up to {detail.room?.capacity} guests per room</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hotel-charcoal/70">
                        {detail.quantity} {detail.quantity === 1 ? 'room' : 'rooms'} × {nights} {nights === 1 ? 'night' : 'nights'}
                      </span>
                      <span className="font-bold text-hotel-burgundy">
                        ${detail.subtotal}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Room Extras */}
        <ExtrasSelector title="Room Extras" items={getRoomExtras()} selectedExtras={selectedExtras} onExtrasChange={setSelectedExtras} />

        {/* Room Add-ons */}
        <ExtrasSelector title="Add-ons & Amenities" items={getRoomAddons()} selectedExtras={selectedAddons} onExtrasChange={setSelectedAddons} />

        {/* Total Price */}
        <Card className="bg-hotel-burgundy/5 border-hotel-burgundy/20">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-hotel-sand-dark">Rooms: {totalRooms} × {nights} nights</span>
                <span className="text-hotel-sand-dark ">${roomsTotal}</span>
              </div>
              {calculateExtrasTotal() > 0 && <div className="flex justify-between text-sm">
                  <span>Extras & Add-ons</span>
                  <span>${calculateExtrasTotal()}</span>
                </div>}
              <div className="flex justify-between items-center text-lg pt-2 border-t border-hotel-burgundy/20">
                <span className="font-semibold text-hotel-charcoal">Total Amount</span>
                <span className="font-bold text-hotel-burgundy text-xl">${totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button onClick={handleBooking} className="w-full h-12 bg-hotel-burgundy hover:bg-hotel-burgundy/90 text-white text-lg font-semibold">
          Complete Booking
        </Button>
      </div>
    </MobileLayout>;
};
export default MultiBooking;

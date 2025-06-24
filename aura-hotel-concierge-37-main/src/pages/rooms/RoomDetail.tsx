import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Wifi, Coffee, Tv, Car, AirVent, Bath, Star, Users, Bed, Award } from "lucide-react";
import { format } from "date-fns";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GuestInfoForm } from "@/components/events/GuestInfoForm";
import { ExtrasSelector } from "@/components/ui/extras-selector";
const RoomDetail = () => {
  const {
    roomId
  } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    rooms,
    getRoomExtras,
    getRoomAddons
  } = useBooking();
  const {
    user,
    isAuthenticated
  } = useAuth();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);
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

  // Parse dates from URL parameters
  useEffect(() => {
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    if (checkInParam && checkOutParam) {
      setCheckIn(new Date(checkInParam));
      setCheckOut(new Date(checkOutParam));
    }
  }, [searchParams]);
  const room = rooms.find(r => r.id === parseInt(roomId || ""));

  // Check if dates are pre-selected from URL
  const datesPreSelected = searchParams.get('checkIn') && searchParams.get('checkOut');
  if (!room) {
    return <MobileLayout title="Room Not Found" showBackButton>
        <div className="p-4 text-center">
          <p>Room not found</p>
          <Link to="/rooms">
            <Button className="mt-4">Back to Rooms</Button>
          </Link>
        </div>
      </MobileLayout>;
  }
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "breakfast":
        return <Coffee className="w-4 h-4" />;
      case "tv":
        return <Tv className="w-4 h-4" />;
      case "parking":
        return <Car className="w-4 h-4" />;
      case "ac":
        return <AirVent className="w-4 h-4" />;
      case "bathroom":
        return <Bath className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded" />;
    }
  };
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
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
  const calculateTotal = () => {
    return room.price * calculateNights() + calculateExtrasTotal();
  };
  const handleBookRoom = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Please select dates",
        description: "Please select both check-in and check-out dates",
        variant: "destructive"
      });
      return;
    }
    if (checkIn >= checkOut) {
      toast({
        title: "Invalid dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive"
      });
      return;
    }

    // Store booking data and show guest form
    setPendingBookingData({
      room,
      checkIn,
      checkOut,
      totalPrice: calculateTotal(),
      selectedExtras,
      selectedAddons
    });
    setShowGuestForm(true);
  };
  const handleGuestInfoSubmit = (guestInfo: any) => {
    if (!pendingBookingData) return;

    // Navigate to payment page with booking data
    const bookingData = {
      bookingType: "room",
      title: pendingBookingData.room.title,
      date: `${format(pendingBookingData.checkIn, "MMM d")} - ${format(pendingBookingData.checkOut, "MMM d, yyyy")}`,
      details: `${calculateNights()} night${calculateNights() > 1 ? 's' : ''} • ${pendingBookingData.room.capacity} guests`,
      location: pendingBookingData.room.location || "Luxury Hotel",
      guestInfo,
      totalPrice: pendingBookingData.totalPrice,
      selectedExtras: pendingBookingData.selectedExtras,
      selectedAddons: pendingBookingData.selectedAddons,
      roomData: pendingBookingData
    };
    navigate('/payment', {
      state: {
        bookingData
      }
    });

    // Reset form
    setCheckIn(undefined);
    setCheckOut(undefined);
    setSelectedExtras([]);
    setSelectedAddons([]);
    setShowGuestForm(false);
    setPendingBookingData(null);
  };
  const handleGuestFormCancel = () => {
    setShowGuestForm(false);
    setPendingBookingData(null);
  };

  // Show guest form if active
  if (showGuestForm && pendingBookingData) {
    return <MobileLayout title="Guest Information" showBackButton>
        <GuestInfoForm eventTitle={`${pendingBookingData.room.title} Reservation`} onSubmit={handleGuestInfoSubmit} onCancel={handleGuestFormCancel} />
      </MobileLayout>;
  }
  return <MobileLayout title={room.title} showBackButton>
      <div className="max-w-md mx-auto">
        {/* Room Image */}
        <div className="relative h-64 bg-gray-200 rounded-b-2xl overflow-hidden">
          <img src={room.image} alt={room.title} className="w-full h-full object-fill" />
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            ${room.price}/night
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Room Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-hotel-burgundy text-lg">{room.title}</span>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span className="text-sm text-hotel-charcoal">{room.rating}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-hotel-charcoal/70">{room.description}</p>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-hotel-burgundy" />
                  <span>{room.beds}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-hotel-burgundy" />
                  <span>{room.guests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-hotel-burgundy" />
                  <span>{room.bathrooms}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-hotel-charcoal mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-3">
                  {room.amenities.map(amenity => <div key={amenity} className="flex items-center gap-2 bg-hotel-pearl px-3 py-1 rounded-full text-sm">
                      {getAmenityIcon(amenity)}
                      <span className="capitalize">{amenity}</span>
                    </div>)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Display or Selection */}
          {datesPreSelected && checkIn && checkOut ? <Card>
              <CardHeader>
                <CardTitle className="text-hotel-burgundy mx-[12px] text-center text-base">Selected Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-hotel-pearl/50 border border-hotel-beige/40 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm text-hotel-charcoal/70 mb-1">Check-in</div>
                      <div className="font-semibold text-hotel-burgundy">
                        {format(checkIn, "MMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-hotel-charcoal/70 mb-1">Check-out</div>
                      <div className="font-semibold text-hotel-burgundy">
                        {format(checkOut, "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-hotel-beige/40 text-center">
                    <span className="text-sm text-hotel-charcoal/70">
                      {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card> : <Card>
              <CardHeader>
                <CardTitle className="text-hotel-burgundy">Select Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-hotel-charcoal mb-2">
                      Check-in
                    </label>
                    <DatePicker date={checkIn} setDate={setCheckIn} fromDate={new Date()} placeholder="Check-in date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-hotel-charcoal mb-2">
                      Check-out
                    </label>
                    <DatePicker date={checkOut} setDate={setCheckOut} fromDate={checkIn || new Date()} placeholder="Check-out date" />
                  </div>
                </div>
              </CardContent>
            </Card>}

          {/* Room Extras */}
          <ExtrasSelector title="Room Extras" items={getRoomExtras()} selectedExtras={selectedExtras} onExtrasChange={setSelectedExtras} />

          {/* Room Add-ons */}
          <ExtrasSelector title="Add-ons & Amenities" items={getRoomAddons()} selectedExtras={selectedAddons} onExtrasChange={setSelectedAddons} />

          {/* Price Summary */}
          {checkIn && checkOut && calculateNights() > 0 && <Card className="bg-hotel-burgundy/5 border-hotel-burgundy/20">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="mx-[10px]- decoration-hotel-sand-dark text-hotel-sand px-0 my-0 mx-[5px]">Room: ${room.price} x {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                    <span className="text-hotel-sand my-0 px-[10px]">${room.price * calculateNights()}</span>
                  </div>
                  {calculateExtrasTotal() > 0 && <div className="flex justify-between text-sm">
                      <span className="mx-[6px]">Extras & Add-ons</span>
                      <span className="my-0 px-[9px]">${calculateExtrasTotal()}</span>
                    </div>}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-hotel-burgundy/20">
                    <span className="text-hotel-burgundy-dark mx-[5px]">Total</span>
                    <span className="text-hotel-burgundy my-0 px-[8px]">${calculateTotal()}</span>
                  </div>
                </div>
                
                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center text-amber-700 text-sm px-0 py-0 my-[20px]">
                  <Award className="h-4 w-4 mr-2 text-amber-500" />
                  Earn {Math.floor(calculateTotal())} loyalty points with this booking
                </div>
              </CardContent>
            </Card>}

          {/* Book Button */}
          <Button onClick={handleBookRoom} disabled={!checkIn || !checkOut || calculateNights() <= 0} className="w-full py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-700 text-hotel-sand">
            {checkIn && checkOut && calculateNights() > 0 ? `Book Room - $${calculateTotal()}` : "Select Dates to Continue"}
          </Button>
        </div>
      </div>
    </MobileLayout>;
};
export default RoomDetail;
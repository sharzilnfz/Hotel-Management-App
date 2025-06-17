
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { DatePicker } from "@/components/ui/date-picker";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { BookingConfirmation } from "@/components/ui/booking-confirmation";
import { 
  Calendar, 
  Users, 
  Wifi, 
  Coffee, 
  Bath, 
  Car, 
  Wind, 
  Tv,
  UserPlus,
  Minus,
  Plus,
  Tag,
  CheckCircle,
  XCircle,
  Award,
  Gift,
  Utensils,
  Plane,
  BedDouble,
  Heart // Replacing Spa with Heart icon
} from "lucide-react";
import { addDays, differenceInDays, isToday, isBefore } from "date-fns";
import { formatDate } from "@/lib/booking-utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={18} />,
  breakfast: <Coffee size={18} />,
  bathroom: <Bath size={18} />,
  parking: <Car size={18} />,
  ac: <Wind size={18} />,
  tv: <Tv size={18} />,
};

// Available extras with their prices
const availableExtras = [
  {
    id: "breakfast",
    name: "Breakfast",
    description: "Daily breakfast buffet",
    price: 25,
    icon: <Coffee size={18} />,
    priceType: "per-person-night" // per person per night
  },
  {
    id: "airport-pickup",
    name: "Airport Pickup",
    description: "One-way airport transfer",
    price: 75,
    icon: <Plane size={18} />,
    priceType: "fixed" // one-time fee
  },
  {
    id: "extra-bed",
    name: "Extra Bed",
    description: "Additional bed in your room",
    price: 40,
    icon: <BedDouble size={18} />,
    priceType: "per-night" // per night
  }
];

// Premium add-ons
const premiumAddons = [
  {
    id: "spa",
    name: "Spa Package",
    description: "60-minute couples massage",
    price: 180,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Heart size={18} /> // Changed from Spa to Heart
  },
  {
    id: "romantic-dinner",
    name: "Romantic Dinner",
    description: "Private dinner for two with champagne",
    price: 250,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Utensils size={18} />
  },
  {
    id: "celebration",
    name: "Celebration Package",
    description: "Room decoration, cake and champagne",
    price: 120,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Gift size={18} />
  }
];

// Promo codes for testing
const validPromoCodes = {
  "WELCOME10": { type: "percentage", value: 10 },
  "SAVE50": { type: "fixed", value: 50 },
  "VIP25": { type: "percentage", value: 25 }
};

const RoomDetail = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getRoom, bookRoom } = useBooking();
  const { user, isAuthenticated } = useAuth();
  
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");
  const guestsParam = searchParams.get("guests");
  
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    checkInParam ? new Date(checkInParam) : undefined
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    checkOutParam ? new Date(checkOutParam) : undefined
  );
  const [adults, setAdults] = useState(guestsParam ? parseInt(guestsParam) : 1);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{type: string, value: number} | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  
  const form = useForm({
    defaultValues: {
      extras: [] as string[],
      addons: [] as string[]
    }
  });

  const room = roomId ? getRoom(roomId) : undefined;

  useEffect(() => {
    if (!room) {
      navigate("/rooms");
    }
  }, [room, navigate]);

  useEffect(() => {
    // Adjust children ages array based on number of children
    if (children > childrenAges.length) {
      // Add new children with default age 0
      setChildrenAges([...childrenAges, ...Array(children - childrenAges.length).fill(0)]);
    } else if (children < childrenAges.length) {
      // Remove extra ages
      setChildrenAges(childrenAges.slice(0, children));
    }
  }, [children]);

  if (!room) {
    return null;
  }

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckIn(date);
    if (date && (!checkOut || checkOut <= date)) {
      setCheckOut(addDays(date, 1));
    }
  };

  const totalGuests = adults + children;
  const nights = checkIn && checkOut
    ? differenceInDays(checkOut, checkIn)
    : 0;
  
  // Calculate extras cost
  const calculateExtrasCost = () => {
    return availableExtras.reduce((total, extra) => {
      if (selectedExtras.includes(extra.id)) {
        if (extra.priceType === "per-person-night") {
          return total + (extra.price * totalGuests * nights);
        } else if (extra.priceType === "per-night") {
          return total + (extra.price * nights);
        } else {
          return total + extra.price; // fixed price
        }
      }
      return total;
    }, 0);
  };

  // Calculate addons cost
  const calculateAddonsCost = () => {
    return premiumAddons.reduce((total, addon) => {
      if (selectedAddons.includes(addon.id)) {
        return total + addon.price;
      }
      return total;
    }, 0);
  };
  
  // Calculate base room cost
  const baseRoomCost = nights * room.price;
  
  // Calculate discount from promo code
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    const subtotal = baseRoomCost + calculateExtrasCost() + calculateAddonsCost();
    
    if (appliedPromo.type === "percentage") {
      return Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      return appliedPromo.value;
    }
  };
  
  // Calculate total price
  const totalPrice = baseRoomCost + calculateExtrasCost() + calculateAddonsCost() - calculateDiscount();
  
  // Calculate loyalty points (1 point per $1)
  const loyaltyPoints = Math.floor(totalPrice);

  const handleApplyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      toast.error("Please enter a promo code");
      return;
    }
    
    if (validPromoCodes[code as keyof typeof validPromoCodes]) {
      const promo = validPromoCodes[code as keyof typeof validPromoCodes];
      setAppliedPromo(promo);
      
      const message = promo.type === "percentage" 
        ? `${promo.value}% discount applied!` 
        : `$${promo.value} discount applied!`;
      
      toast.success(message);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast.info("Promo code removed");
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...childrenAges];
    newAges[index] = age;
    setChildrenAges(newAges);
  };

  const handleBookRoom = async () => {
    if (!checkIn || !checkOut || !adults) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (totalGuests > room.capacity) {
      toast.error(`This room can only accommodate ${room.capacity} guests`);
      return;
    }

    setIsBooking(true);
    
    try {
      const booking = bookRoom(roomId!, checkIn, checkOut, totalGuests);
      
      // Prepare extras and addons for booking
      const bookedExtras = selectedExtras.map(id => {
        const extra = availableExtras.find(e => e.id === id);
        return {
          id,
          name: extra?.name,
          price: extra?.price
        };
      });
      
      const bookedAddons = selectedAddons.map(id => {
        const addon = premiumAddons.find(a => a.id === id);
        return {
          id,
          name: addon?.name,
          price: addon?.price
        };
      });
      
      // Create confirmation object
      setBookingConfirmation({
        bookingType: "room",
        confirmationCode: booking.confirmationCode,
        title: room.name,
        date: `${formatDate(checkIn)} - ${formatDate(checkOut)}`,
        details: `${nights} ${nights === 1 ? "night" : "nights"}, ${totalGuests} ${totalGuests === 1 ? "guest" : "guests"}`,
        name: user?.name || "Guest",
        contact: user?.phone || "Not provided",
        email: user?.email || "Not provided",
        extras: bookedExtras,
        addons: bookedAddons,
        totalPrice: totalPrice,
        loyaltyPoints: loyaltyPoints
      });
    } catch (error) {
      console.error("Error booking room:", error);
      toast.error("There was an error processing your booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today) && !isToday(date);
  };

  if (bookingConfirmation) {
    return (
      <MobileLayout hideHeader>
        <div className="p-4 min-h-screen flex items-center justify-center">
          <BookingConfirmation {...bookingConfirmation} />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title={room.name} showBackButton>
      <div className="pb-20">
        <div className="relative h-64">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl font-playfair font-semibold text-hotel-burgundy">
              {room.name}
            </h1>
            <div className="text-right">
              <span className="text-2xl font-semibold text-hotel-burgundy">${room.price}</span>
              <span className="text-gray-500 block text-sm">per night</span>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{room.description}</p>

          <div className="mb-6">
            <h2 className="font-medium text-lg mb-2">Amenities</h2>
            <div className="grid grid-cols-3 gap-3">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center p-2 bg-gray-50 rounded-lg"
                >
                  <span className="mr-2 text-hotel-burgundy">
                    {amenityIcons[amenity] || null}
                  </span>
                  <span className="text-sm capitalize">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h2 className="font-medium text-lg mb-3">Book This Room</h2>
            
            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
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
            
            {/* Guest Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-3 text-gray-700">
                Number of Guests
              </label>
              
              {/* Adults */}
              <div className="flex items-center justify-between mb-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Users size={18} className="text-hotel-burgundy mr-2" />
                  <span>Adults</span>
                </div>
                <div className="flex items-center">
                  <button 
                    type="button"
                    className="p-1 bg-white rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                    disabled={adults <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{adults}</span>
                  <button 
                    type="button"
                    className="p-1 bg-white rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setAdults(prev => prev + 1)}
                    disabled={adults + children >= room.capacity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Children */}
              <div className="flex items-center justify-between mb-1 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <UserPlus size={18} className="text-hotel-burgundy mr-2" />
                  <span>Children</span>
                </div>
                <div className="flex items-center">
                  <button 
                    type="button"
                    className="p-1 bg-white rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                    disabled={children <= 0}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{children}</span>
                  <button 
                    type="button"
                    className="p-1 bg-white rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setChildren(prev => prev + 1)}
                    disabled={adults + children >= room.capacity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Children Ages */}
              <AnimatePresence>
                {children > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 p-3 rounded-lg mt-2"
                  >
                    <p className="text-sm text-gray-600 mb-2">Children's ages</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: children }).map((_, index) => (
                        <div key={`child-${index}`} className="flex flex-col">
                          <label className="text-xs text-gray-500 mb-1">Child {index + 1}</label>
                          <select
                            value={childrenAges[index]}
                            onChange={(e) => handleChildAgeChange(index, parseInt(e.target.value))}
                            className="text-sm p-2 border border-gray-200 rounded"
                          >
                            {Array.from({ length: 18 }).map((_, age) => (
                              <option key={age} value={age}>{age} {age === 1 ? 'year' : 'years'}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {totalGuests > room.capacity && (
                <p className="text-red-500 text-sm mt-2">
                  This room can only accommodate {room.capacity} guests
                </p>
              )}
            </div>
            
            {/* Extras */}
            {checkIn && checkOut && nights > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-md mb-2">Select Extras</h3>
                <div className="space-y-2">
                  {availableExtras.map((extra) => (
                    <div 
                      key={extra.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Checkbox 
                          id={`extra-${extra.id}`}
                          checked={selectedExtras.includes(extra.id)}
                          onCheckedChange={() => toggleExtra(extra.id)}
                          className="mr-2 data-[state=checked]:bg-hotel-burgundy data-[state=checked]:text-white"
                        />
                        <div>
                          <label 
                            htmlFor={`extra-${extra.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {extra.name}
                          </label>
                          <p className="text-xs text-gray-500">{extra.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-hotel-burgundy">
                          ${extra.price}
                          <span className="text-xs text-gray-500 ml-1">
                            {extra.priceType === "per-person-night" && "/person/night"}
                            {extra.priceType === "per-night" && "/night"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promo Code */}
            {checkIn && checkOut && nights > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-md mb-2">Promo Code</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="pl-9 w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hotel-burgundy focus:border-transparent"
                      disabled={!!appliedPromo}
                    />
                  </div>
                  {appliedPromo ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemovePromoCode}
                      className="shrink-0"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleApplyPromoCode}
                      className="bg-hotel-burgundy text-white shrink-0"
                    >
                      Apply
                    </Button>
                  )}
                </div>
                
                {appliedPromo && (
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {appliedPromo.type === "percentage" 
                      ? `${appliedPromo.value}% discount applied` 
                      : `$${appliedPromo.value} discount applied`}
                  </div>
                )}
              </div>
            )}

            {/* Price Summary */}
            {checkIn && checkOut && nights > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-gray-100 pt-4 mt-4"
              >
                <h3 className="font-medium text-md mb-2">Price Summary</h3>
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>
                      ${room.price} x {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                    <span>${baseRoomCost}</span>
                  </div>
                  
                  {calculateExtrasCost() > 0 && (
                    <div className="flex justify-between">
                      <span>Selected extras</span>
                      <span>${calculateExtrasCost()}</span>
                    </div>
                  )}
                  
                  {calculateAddonsCost() > 0 && (
                    <div className="flex justify-between">
                      <span>Selected add-ons</span>
                      <span>${calculateAddonsCost()}</span>
                    </div>
                  )}
                  
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${calculateDiscount()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-hotel-burgundy">${totalPrice}</span>
                </div>
                
                <div className="mt-2 bg-amber-50 p-2 rounded-lg flex items-center text-amber-700 text-sm">
                  <Award className="h-4 w-4 mr-1 text-amber-500" />
                  Earn {loyaltyPoints} loyalty points with this booking
                </div>
              </motion.div>
            )}

            <button
              className={`w-full py-3 rounded-lg font-medium mt-4 ${
                checkIn && checkOut && nights > 0 && totalGuests <= room.capacity
                  ? "bg-hotel-burgundy text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!checkIn || !checkOut || nights <= 0 || isBooking || totalGuests > room.capacity}
              onClick={handleBookRoom}
            >
              {isBooking
                ? "Processing..."
                : checkIn && checkOut && nights > 0
                ? `Book for $${totalPrice}`
                : "Select Dates to Book"}
            </button>
          </div>

          {/* Premium Add-ons Section */}
          {checkIn && checkOut && nights > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <h2 className="font-medium text-lg mb-3">
                <Gift className="inline-block mr-2 text-hotel-burgundy" size={20} />
                Suggested Add-ons
              </h2>
              <div className="space-y-3">
                {premiumAddons.map((addon) => (
                  <div 
                    key={addon.id}
                    className={cn(
                      "border rounded-lg p-3 transition-all",
                      selectedAddons.includes(addon.id) 
                        ? "border-hotel-burgundy bg-hotel-burgundy/5" 
                        : "border-gray-200"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                        <img 
                          src={addon.image} 
                          alt={addon.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{addon.name}</h3>
                          <span className="text-hotel-burgundy font-medium">${addon.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{addon.description}</p>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => toggleAddon(addon.id)}
                          variant={selectedAddons.includes(addon.id) ? "outline" : "default"}
                          className={cn(
                            selectedAddons.includes(addon.id) 
                              ? "border-hotel-burgundy text-hotel-burgundy" 
                              : "bg-hotel-burgundy text-white"
                          )}
                        >
                          {selectedAddons.includes(addon.id) ? "Remove" : "Add to Booking"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-medium text-lg mb-3">Cancellation Policy</h2>
            <p className="text-sm text-gray-600">
              Free cancellation up to 24 hours before check-in. Cancellations made less than 24 hours in advance are subject to a one-night charge.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RoomDetail;

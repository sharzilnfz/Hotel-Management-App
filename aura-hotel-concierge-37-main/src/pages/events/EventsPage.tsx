import React, { useState } from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { useBooking } from "@/contexts/BookingContext";
import { DatePicker } from "@/components/ui/date-picker";
import { format, isSameDay, addDays } from "date-fns";
import { Calendar, Ticket, Clock, MapPin, Info, Coffee, Tag, Award, Gift, Heart, Utensils, CheckCircle, XCircle, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BookingConfirmation } from "@/components/ui/booking-confirmation";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Available extras with their prices
const availableExtras = [
  {
    id: "vip-seating",
    name: "VIP Seating",
    description: "Priority seating with better views",
    price: 30,
    icon: <Ticket size={18} />,
    priceType: "per-ticket" // per ticket
  },
  {
    id: "welcome-drink",
    name: "Welcome Drink",
    description: "Complimentary welcome drink",
    price: 15,
    icon: <Coffee size={18} />,
    priceType: "per-person" // per person
  },
  {
    id: "transportation",
    name: "Transportation",
    description: "Hotel transport to and from event",
    price: 25,
    icon: <Plane size={18} />,
    priceType: "fixed" // fixed price
  }
];

// Premium add-ons
const premiumAddons = [
  {
    id: "dinner-package",
    name: "Pre-Event Dinner",
    description: "Enjoy a 3-course meal before the event",
    price: 120,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Utensils size={18} />
  },
  {
    id: "spa-package",
    name: "Spa Treatment",
    description: "Relax with a spa treatment before or after the event",
    price: 95,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Heart size={18} />
  },
  {
    id: "souvenir-package",
    name: "Event Souvenir",
    description: "Special commemorative item for your event",
    price: 50,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Gift size={18} />
  }
];

// Promo codes for testing
const validPromoCodes = {
  "EVENT10": { type: "percentage", value: 10 },
  "SAVE25": { type: "fixed", value: 25 },
  "SUMMER15": { type: "percentage", value: 15 }
};

const EventsPage = () => {
  const { events, bookEvent } = useBooking();
  const [ticketCounts, setTicketCounts] = useState<Record<number, number>>({});
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{type: string, value: number} | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const incrementTicket = (eventId: number) => {
    const currentCount = ticketCounts[eventId] || 0;
    const event = events.find(e => e.id === eventId);
    
    if (event && currentCount < event.availableTickets) {
      setTicketCounts({
        ...ticketCounts,
        [eventId]: currentCount + 1
      });
      
      // When increasing tickets, set this as the active event
      setActiveEventId(eventId);
    } else {
      toast({
        title: "Maximum tickets reached",
        description: "You've reached the maximum available tickets for this event.",
        variant: "destructive"
      });
    }
  };

  const decrementTicket = (eventId: number) => {
    const currentCount = ticketCounts[eventId] || 0;
    if (currentCount > 0) {
      setTicketCounts({
        ...ticketCounts,
        [eventId]: currentCount - 1
      });
    }
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

  const handleApplyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      toast({
        title: "Please enter a promo code",
        description: "Enter a valid promo code to receive a discount.",
        variant: "destructive"
      });
      return;
    }
    
    if (validPromoCodes[code as keyof typeof validPromoCodes]) {
      const promo = validPromoCodes[code as keyof typeof validPromoCodes];
      setAppliedPromo(promo);
      
      const message = promo.type === "percentage" 
        ? `${promo.value}% discount applied!` 
        : `$${promo.value} discount applied!`;
      
      toast({
        title: "Promo code applied",
        description: message,
        variant: "default"
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired.",
        variant: "destructive"
      });
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast({
      title: "Promo code removed",
      description: "Your promo code has been removed.",
      variant: "default"
    });
  };

  // Calculate extras cost for the active event
  const calculateExtrasCost = (eventId: number) => {
    const ticketCount = ticketCounts[eventId] || 0;
    
    return availableExtras.reduce((total, extra) => {
      if (selectedExtras.includes(extra.id)) {
        if (extra.priceType === "per-ticket" || extra.priceType === "per-person") {
          return total + (extra.price * ticketCount);
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

  // Calculate base event cost
  const calculateBaseEventCost = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    const ticketCount = ticketCounts[eventId] || 0;
    return event ? event.price * ticketCount : 0;
  };

  // Calculate discount from promo code
  const calculateDiscount = (eventId: number) => {
    if (!appliedPromo) return 0;
    
    const subtotal = calculateBaseEventCost(eventId) + calculateExtrasCost(eventId) + calculateAddonsCost();
    
    if (appliedPromo.type === "percentage") {
      return Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      return appliedPromo.value;
    }
  };

  // Calculate total price for an event
  const calculateTotalPrice = (eventId: number) => {
    const baseEventCost = calculateBaseEventCost(eventId);
    const extrasCost = calculateExtrasCost(eventId);
    const addonsCost = calculateAddonsCost();
    const discount = calculateDiscount(eventId);
    
    return baseEventCost + extrasCost + addonsCost - discount;
  };

  // Calculate loyalty points (1 point per $1)
  const calculateLoyaltyPoints = (eventId: number) => {
    return Math.floor(calculateTotalPrice(eventId));
  };

  const handleBookEvent = (eventId: number) => {
    try {
      const ticketCount = ticketCounts[eventId] || 0;
      if (ticketCount <= 0) {
        toast({
          title: "No tickets selected",
          description: "Please select at least one ticket to continue.",
          variant: "destructive"
        });
        return;
      }

      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const booking = bookEvent(eventId, ticketCount);
      
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
      
      const totalPrice = calculateTotalPrice(eventId);
      const loyaltyPoints = calculateLoyaltyPoints(eventId);
      
      // Create confirmation object
      setBookingConfirmation({
        bookingType: "event",
        confirmationCode: booking.confirmationCode,
        title: event.title,
        date: format(new Date(event.date), "MMMM d, yyyy"),
        time: event.time,
        details: `${ticketCount} ${ticketCount === 1 ? "ticket" : "tickets"}`,
        location: event.location,
        extras: bookedExtras,
        addons: bookedAddons,
        totalPrice: totalPrice,
        loyaltyPoints: loyaltyPoints,
        promoApplied: appliedPromo ? 
          (appliedPromo.type === "percentage" ? `${appliedPromo.value}%` : `$${appliedPromo.value}`) : 
          null
      });

      // Reset states
      setTicketCounts({
        ...ticketCounts,
        [eventId]: 0
      });
      setSelectedExtras([]);
      setSelectedAddons([]);
      setPromoCode("");
      setAppliedPromo(null);
      
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Failed to book event",
        variant: "destructive"
      });
    }
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
    <MobileLayout title="Hotel Events" showBackButton>
      <div className="max-w-md mx-auto p-4">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-playfair font-bold text-hotel-burgundy text-center">
            Choose your event
          </h1>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {events.length > 0 ? (
            events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-playfair font-semibold text-hotel-burgundy">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 mb-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-hotel-burgundy" />
                      <span className="text-sm">
                        {format(new Date(event.date), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-hotel-burgundy" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-hotel-burgundy" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Ticket className="w-4 h-4 mr-2 text-hotel-burgundy" />
                      <span className="text-sm">${event.price} per ticket</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Info className="w-4 h-4 mr-2 text-hotel-burgundy" />
                      <span className="text-sm">{event.availableTickets} tickets available</span>
                    </div>
                  </div>

                  {/* Ticket Selector */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-4">
                    <span className="text-sm font-medium text-gray-700">Tickets:</span>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => decrementTicket(event.id)}
                        className="w-8 h-8 rounded-full bg-hotel-cream text-hotel-burgundy flex items-center justify-center font-bold hover:bg-hotel-burgundy hover:text-white transition-colors"
                        disabled={(ticketCounts[event.id] || 0) <= 0}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {ticketCounts[event.id] || 0}
                      </span>
                      <button 
                        onClick={() => incrementTicket(event.id)}
                        className="w-8 h-8 rounded-full bg-hotel-cream text-hotel-burgundy flex items-center justify-center font-bold hover:bg-hotel-burgundy hover:text-white transition-colors"
                        disabled={(ticketCounts[event.id] || 0) >= event.availableTickets}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Extras, Promo Code, and Add-ons - Only show for active event with tickets */}
                  {activeEventId === event.id && (ticketCounts[event.id] || 0) > 0 && (
                    <>
                      {/* Extras Selection */}
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
                                    {extra.priceType === "per-ticket" && "/ticket"}
                                    {extra.priceType === "per-person" && "/person"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Promo Code */}
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

                      {/* Price Summary */}
                      <div className="border-t border-gray-100 pt-4 mt-4 mb-4">
                        <h3 className="font-medium text-md mb-2">Price Summary</h3>
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between">
                            <span>
                              ${event.price} x {ticketCounts[event.id] || 0} {(ticketCounts[event.id] || 0) === 1 ? "ticket" : "tickets"}
                            </span>
                            <span>${calculateBaseEventCost(event.id)}</span>
                          </div>
                          
                          {calculateExtrasCost(event.id) > 0 && (
                            <div className="flex justify-between">
                              <span>Selected extras</span>
                              <span>${calculateExtrasCost(event.id)}</span>
                            </div>
                          )}
                          
                          {calculateAddonsCost() > 0 && (
                            <div className="flex justify-between">
                              <span>Selected add-ons</span>
                              <span>${calculateAddonsCost()}</span>
                            </div>
                          )}
                          
                          {calculateDiscount(event.id) > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount</span>
                              <span>-${calculateDiscount(event.id)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100">
                          <span>Total</span>
                          <span className="text-hotel-burgundy">${calculateTotalPrice(event.id)}</span>
                        </div>
                        
                        <div className="mt-2 bg-amber-50 p-2 rounded-lg flex items-center text-amber-700 text-sm">
                          <Award className="h-4 w-4 mr-1 text-amber-500" />
                          Earn {calculateLoyaltyPoints(event.id)} loyalty points with this booking
                        </div>
                      </div>

                      {/* Premium Add-ons Section */}
                      <div className="mb-6">
                        <h2 className="font-medium text-lg mb-3">
                          <Gift className="inline-block mr-2 text-hotel-burgundy" size={18} />
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
                    </>
                  )}

                  <Button
                    onClick={() => handleBookEvent(event.id)}
                    className="w-full bg-hotel-burgundy hover:bg-hotel-burgundy/90 text-white"
                    disabled={(ticketCounts[event.id] || 0) <= 0}
                  >
                    {(ticketCounts[event.id] || 0) > 0 
                      ? `Book Tickets ($${calculateTotalPrice(event.id)})` 
                      : "Select Tickets"}
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No events found</h3>
                <p className="text-gray-500">
                  There are no events scheduled at the moment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default EventsPage;

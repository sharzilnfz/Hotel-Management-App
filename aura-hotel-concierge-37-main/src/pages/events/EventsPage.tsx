import React, { useState } from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtrasSelector } from "@/components/ui/extras-selector";
import { Calendar, Clock, MapPin, Users, Star, Award, Ticket, Music, ChefHat, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GuestInfoForm } from "@/components/events/GuestInfoForm";
import { BookingConfirmation } from "@/components/ui/booking-confirmation";

const EventsPage = () => {
  const {
    events,
    bookEvent,
    getEventExtras,
    getEventAddons
  } = useBooking();
  const {
    user,
    isAuthenticated
  } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [selectedExtras, setSelectedExtras] = useState<{
    id: string;
    quantity: number;
  }[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{
    id: string;
    quantity: number;
  }[]>([]);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const getEventIcon = (type: string) => {
    switch (type) {
      case "music":
        return <Music className="w-5 h-5" />;
      case "culinary":
        return <ChefHat className="w-5 h-5" />;
      case "special":
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "music":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "culinary":
        return "bg-green-100 text-green-700 border-green-200";
      case "special":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setTicketCount(1);
    setSelectedExtras([]);
    setSelectedAddons([]);
  };
  const calculateExtrasTotal = () => {
    const eventExtras = getEventExtras();
    const eventAddons = getEventAddons();
    const extrasTotal = selectedExtras.reduce((total, selected) => {
      const extra = eventExtras.find(e => e.id === selected.id);
      return total + (extra ? extra.price * selected.quantity : 0);
    }, 0);
    const addonsTotal = selectedAddons.reduce((total, selected) => {
      const addon = eventAddons.find(a => a.id === selected.id);
      return total + (addon ? addon.price * selected.quantity : 0);
    }, 0);
    return extrasTotal + addonsTotal;
  };
  const calculateTotal = () => {
    const basePrice = selectedEvent ? selectedEvent.price * ticketCount : 0;
    return basePrice + calculateExtrasTotal();
  };
  const handleBookEvent = () => {
    if (!selectedEvent) {
      toast({
        title: "Please select an event",
        description: "Please choose an event to book",
        variant: "destructive"
      });
      return;
    }
    if (ticketCount > selectedEvent.availableTickets) {
      toast({
        title: "Not enough tickets available",
        description: `Only ${selectedEvent.availableTickets} tickets remaining`,
        variant: "destructive"
      });
      return;
    }

    // Store booking data and show guest form
    setPendingBookingData({
      selectedEvent,
      ticketCount,
      selectedExtras,
      selectedAddons,
      totalPrice: calculateTotal()
    });
    setShowGuestForm(true);
  };
  const handleGuestInfoSubmit = (guestInfo: any) => {
    if (!pendingBookingData) return;

    // Navigate to payment page with booking data
    const bookingData = {
      bookingType: "event",
      title: pendingBookingData.selectedEvent.title,
      date: format(pendingBookingData.selectedEvent.date, "MMMM d, yyyy"),
      time: pendingBookingData.selectedEvent.time,
      details: `${pendingBookingData.ticketCount} ticket${pendingBookingData.ticketCount > 1 ? 's' : ''}`,
      location: pendingBookingData.selectedEvent.location,
      guestInfo,
      totalPrice: pendingBookingData.totalPrice,
      selectedExtras: pendingBookingData.selectedExtras,
      selectedAddons: pendingBookingData.selectedAddons,
      eventData: {
        eventId: pendingBookingData.selectedEvent.id,
        tickets: pendingBookingData.ticketCount,
        selectedExtras: pendingBookingData.selectedExtras,
        selectedAddons: pendingBookingData.selectedAddons
      }
    };
    navigate('/payment', {
      state: {
        bookingData
      }
    });

    // Reset form
    setSelectedEvent(null);
    setTicketCount(1);
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
        <GuestInfoForm eventTitle={`${pendingBookingData.selectedEvent.title} - ${pendingBookingData.ticketCount} ticket${pendingBookingData.ticketCount > 1 ? 's' : ''}`} onSubmit={handleGuestInfoSubmit} onCancel={handleGuestFormCancel} />
      </MobileLayout>;
  }
  if (bookingConfirmation) {
    return <MobileLayout hideHeader>
        <div className="p-4 min-h-screen flex items-center justify-center">
          <BookingConfirmation {...bookingConfirmation} />
        </div>
      </MobileLayout>;
  }
  return <MobileLayout title="Events" showBackButton>
      <div className="max-w-md mx-auto p-4">
        <div className="mb-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-hotel-burgundy/10 rounded-full">
                <Sparkles className="w-8 h-8 text-hotel-burgundy" />
              </div>
            </div>
            <h1 className="font-playfair font-bold text-hotel-burgundy mb-2 text-xl">
              Exclusive Events
            </h1>
            <p className="text-hotel-charcoal/70 text-xs text-center">
              Join us for unforgettable experiences and special occasions
            </p>
          </motion.div>
        </div>

        {!selectedEvent ? <div className="space-y-4">
            <h2 className="font-semibold mb-4 mx-[18px] text-hotel-sand text-base text-center">
              Upcoming Events
            </h2>
            {events.map((event, index) => <motion.div key={event.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }}>
                <Card className="cursor-pointer overflow-hidden border-2 border-hotel-beige/30 hover:border-hotel-gold/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-luxury" onClick={() => handleEventSelect(event)}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                            <div className="flex items-center gap-1">
                              {getEventIcon(event.type)}
                              <span className="capitalize">{event.type}</span>
                            </div>
                          </div>
                        </div>
                        <h3 className="font-playfair text-xl font-bold text-hotel-burgundy mb-2">
                          {event.title}
                        </h3>
                        <p className="text-hotel-charcoal/70 text-sm mb-3">{event.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium text-hotel-charcoal/70 mb-1">From</div>
                        <div className="text-2xl font-bold text-hotel-burgundy">${event.price}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-hotel-charcoal/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-hotel-burgundy" />
                        <span>{format(event.date, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-hotel-burgundy" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-hotel-burgundy" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-hotel-burgundy" />
                        <span>{event.availableTickets} tickets available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div> : <div className="space-y-6">
            {/* Selected Event Summary */}
            <Card className="border-hotel-gold/30 bg-gradient-to-r from-hotel-cream to-hotel-pearl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-hotel-sand-dark text-lg">
                    {selectedEvent.title}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)} className="text-hotel-burgundy hover:bg-hotel-burgundy/10">
                    Change
                  </Button>
                </div>
                <p className="text-hotel-charcoal/70 text-sm mb-3">
                  {selectedEvent.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-hotel-charcoal/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-hotel-burgundy" />
                    <span>{format(selectedEvent.date, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-hotel-burgundy" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-hotel-burgundy" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>${selectedEvent.price} per ticket</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-hotel-burgundy">Select Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-hotel-charcoal mb-2">
                      Number of Tickets
                    </label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setTicketCount(Math.max(1, ticketCount - 1))} className="w-10 h-10 rounded-full bg-hotel-beige flex items-center justify-center text-hotel-charcoal hover:bg-hotel-burgundy hover:text-white transition-colors">
                        -
                      </button>
                      <span className="text-2xl font-bold text-hotel-charcoal w-12 text-center">
                        {ticketCount}
                      </span>
                      <button onClick={() => setTicketCount(Math.min(selectedEvent.availableTickets, ticketCount + 1))} className="w-10 h-10 rounded-full bg-hotel-burgundy text-white flex items-center justify-center hover:bg-hotel-burgundy/90 transition-colors">
                        +
                      </button>
                    </div>
                    <p className="text-xs text-hotel-charcoal/60 mt-2">
                      Maximum {selectedEvent.availableTickets} tickets available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Extras */}
            <ExtrasSelector title="Event Extras" items={getEventExtras()} selectedExtras={selectedExtras} onExtrasChange={setSelectedExtras} />

            {/* Event Add-ons */}
            <ExtrasSelector title="Event Add-ons" items={getEventAddons()} selectedExtras={selectedAddons} onExtrasChange={setSelectedAddons} />

            {/* Price Summary */}
            <Card className="bg-hotel-burgundy/5 border-hotel-burgundy/20">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-hotel-sand-dark ">{ticketCount} ticket{ticketCount > 1 ? 's' : ''} × ${selectedEvent.price}</span>
                    <span className="mx-[17px] text-hotel-sand-dark">${selectedEvent.price * ticketCount}</span>
                  </div>
                  {calculateExtrasTotal() > 0 && <div className="flex justify-between text-sm">
                      <span>Extras & Add-ons</span>
                      <span>${calculateExtrasTotal()}</span>
                    </div>}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-hotel-burgundy/20">
                    <span className="text-hotel-burgundy-dark mx-[5px]">Total</span>
                    <span className="text-hotel-burgundy my-0 px-[14px]">${calculateTotal()}</span>
                  </div>
                </div>
                
                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center text-amber-700 text-sm my-[15px] py-[4px] px-[6px]">
                  <Award className="h-4 w-4 mr-2 text-amber-500" />
                  Earn {Math.floor(calculateTotal())} loyalty points with this booking
                </div>
              </CardContent>
            </Card>

            {/* Book Button */}
            <Button onClick={handleBookEvent} disabled={!selectedEvent || ticketCount === 0} className="w-full bg-hotel-burgundy-dark text-hotel-sand-dark-3 font-semibold h-12 bg-red-900 hover:bg-red-800 text-hotel-sand-dark text-hotel-sand">
              {selectedEvent && ticketCount > 0 ? `Book ${ticketCount} Ticket${ticketCount > 1 ? 's' : ''}` : "Select Tickets to Continue"}
            </Button>
          </div>}
      </div>
    </MobileLayout>;
};
export default EventsPage;


import React, { useState } from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useBooking } from "@/contexts/BookingContext";
import { useToast } from "@/hooks/use-toast";
import { GuestInfoForm } from "@/components/events/GuestInfoForm";
import { SpaPageHeader } from "@/components/spa/SpaPageHeader";
import { SpaServiceSelector } from "@/components/spa/SpaServiceSelector";
import { SpaBookingForm } from "@/components/spa/SpaBookingForm";
import { SpaBookingSummary } from "@/components/spa/SpaBookingSummary";

const SpaServices = () => {
  const { spaServices, getSpaExtras, getSpaAddons } = useBooking();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
  const [selectedExtras, setSelectedExtras] = useState<{ id: string; quantity: number }[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; quantity: number }[]>([]);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setSelectedDuration(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedSpecialist("");
    setSelectedExtras([]);
    setSelectedAddons([]);
  };

  const handleDurationSelect = (duration: { minutes: number; price: number }) => {
    setSelectedDuration(duration.minutes);
  };

  const calculateExtrasTotal = () => {
    const spaExtras = getSpaExtras();
    const spaAddons = getSpaAddons();
    
    const extrasTotal = selectedExtras.reduce((total, selected) => {
      const extra = spaExtras.find(e => e.id === selected.id);
      return total + (extra ? extra.price * selected.quantity : 0);
    }, 0);
    
    const addonsTotal = selectedAddons.reduce((total, selected) => {
      const addon = spaAddons.find(a => a.id === selected.id);
      return total + (addon ? addon.price * selected.quantity : 0);
    }, 0);
    
    return extrasTotal + addonsTotal;
  };

  const calculatePrice = () => {
    if (!selectedService || !selectedDuration) return 0;
    const durationOption = selectedService.durations.find((d: any) => d.minutes === selectedDuration);
    const basePrice = durationOption ? durationOption.price : selectedService.basePrice;
    return basePrice + calculateExtrasTotal();
  };

  const handleBookService = () => {
    if (!selectedService || !selectedDuration || !selectedDate || !selectedTime || !selectedSpecialist) {
      toast({
        title: "Please complete your selection",
        description: "Please select a service, duration, date, time, and specialist",
        variant: "destructive"
      });
      return;
    }

    setPendingBookingData({
      selectedService,
      selectedDuration,
      selectedDate,
      selectedTime,
      selectedSpecialist,
      selectedExtras,
      selectedAddons,
      totalPrice: calculatePrice()
    });
    setShowGuestForm(true);
  };

  const handleGuestInfoSubmit = (guestInfo: any) => {
    if (!pendingBookingData) return;

    // Navigate to payment page with booking data
    const bookingData = {
      bookingType: "spa",
      title: pendingBookingData.selectedService.name,
      date: format(pendingBookingData.selectedDate, "MMMM d, yyyy"),
      time: pendingBookingData.selectedTime,
      details: `${pendingBookingData.selectedDuration} minutes with ${pendingBookingData.selectedSpecialist}`,
      location: "Luxury Spa",
      guestInfo,
      totalPrice: pendingBookingData.totalPrice,
      selectedExtras: pendingBookingData.selectedExtras,
      selectedAddons: pendingBookingData.selectedAddons,
      spaData: pendingBookingData
    };

    navigate('/payment', { 
      state: { 
        bookingData
      }
    });

    // Reset form
    setSelectedService(null);
    setSelectedDuration(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedSpecialist("");
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
    return (
      <MobileLayout title="Guest Information" showBackButton>
        <GuestInfoForm
          eventTitle={`${pendingBookingData.selectedService.name} Appointment`}
          onSubmit={handleGuestInfoSubmit}
          onCancel={handleGuestFormCancel}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Spa Services" showBackButton>
      <div className="max-w-md mx-auto p-4">
        <SpaPageHeader />

        {/* Service Selection */}
        {!selectedService ? (
          <SpaServiceSelector
            services={spaServices}
            onServiceSelect={handleServiceSelect}
          />
        ) : (
          <>
            <SpaBookingForm
              selectedService={selectedService}
              selectedDuration={selectedDuration}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedSpecialist={selectedSpecialist}
              selectedExtras={selectedExtras}
              selectedAddons={selectedAddons}
              spaExtras={getSpaExtras()}
              spaAddons={getSpaAddons()}
              onServiceReset={() => setSelectedService(null)}
              onDurationSelect={handleDurationSelect}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              onSpecialistSelect={setSelectedSpecialist}
              onExtrasChange={setSelectedExtras}
              onAddonsChange={setSelectedAddons}
            />

            <SpaBookingSummary
              selectedService={selectedService}
              selectedDuration={selectedDuration}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedSpecialist={selectedSpecialist}
              extrasTotal={calculateExtrasTotal()}
              totalPrice={calculatePrice()}
              onBookService={handleBookService}
            />
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default SpaServices;

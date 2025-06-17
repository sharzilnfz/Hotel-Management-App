import React, { useState } from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { useBooking, SpaService } from "@/contexts/BookingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingConfirmation } from "@/components/ui/booking-confirmation";
import { toast } from "sonner";
import { 
  Clock, 
  User, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Award, 
  Gift,
  Heart,
  Utensils,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice, calculateLoyaltyPoints } from "@/lib/booking-utils";
import { DurationSelector } from "@/components/spa/DurationSelector";
import { SelectorGroup } from "@/components/ui/selector-group";

// Available extras with their prices
const availableExtras = [
  {
    id: "aromatherapy",
    name: "Aromatherapy",
    description: "Premium essential oils for enhanced relaxation",
    price: 25,
    icon: <Sparkles size={18} />
  },
  {
    id: "hot-stones",
    name: "Hot Stones",
    description: "Add hot stone therapy to any massage",
    price: 35,
    icon: <Sparkles size={18} />
  },
  {
    id: "extended-time",
    name: "Extended Time",
    description: "Add 15 minutes to your session",
    price: 30,
    icon: <Clock size={18} />
  }
];

// Premium add-ons
const premiumAddons = [
  {
    id: "couple-package",
    name: "Couples Package",
    description: "Transform your session into a couples experience",
    price: 120,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Heart size={18} />
  },
  {
    id: "champagne",
    name: "Champagne & Chocolates",
    description: "Enjoy premium champagne and chocolates after your treatment",
    price: 75,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Gift size={18} />
  },
  {
    id: "lunch",
    name: "Spa Lunch",
    description: "Healthy gourmet lunch at our spa café",
    price: 45,
    image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
    icon: <Utensils size={18} />
  }
];

// Promo codes for testing
const validPromoCodes = {
  "SPA25": { type: "percentage", value: 25 },
  "RELAX50": { type: "fixed", value: 50 },
  "WELLNESS15": { type: "percentage", value: 15 }
};

const SpaServices = () => {
  const { spaServices, getSpaService, bookSpa } = useBooking();
  const [step, setStep] = useState<"service" | "datetime" | "specialist" | "extras" | "confirmation">("service");
  const [selectedService, setSelectedService] = useState<SpaService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{type: string, value: number} | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<{ minutes: number; price: number } | null>(null);
  
  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", 
    "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const handleServiceSelect = (service: SpaService) => {
    setSelectedService(service);
    setSelectedDuration(service.durations[1]); // Default to 60 min
    setStep("datetime");
  };

  const handleTimeSelect = (option: { id: string; label: string }) => {
    setSelectedTime(option.label);
    setStep("specialist");
  };

  const handleSpecialistSelect = (option: { id: string; label: string }) => {
    setSelectedSpecialist(option.label);
    setStep("extras");
  };

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

  // Calculate extras cost
  const calculateExtrasCost = () => {
    return availableExtras.reduce((total, extra) => {
      if (selectedExtras.includes(extra.id)) {
        return total + extra.price;
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
  
  // Update price calculations to use selected duration
  const baseServiceCost = selectedDuration?.price || 0;
  
  // Calculate discount from promo code
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    const subtotal = baseServiceCost + calculateExtrasCost() + calculateAddonsCost();
    
    if (appliedPromo.type === "percentage") {
      return Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      return appliedPromo.value;
    }
  };
  
  // Calculate total price
  const totalPrice = baseServiceCost + calculateExtrasCost() + calculateAddonsCost() - calculateDiscount();
  
  // Calculate loyalty points
  const loyaltyPoints = calculateLoyaltyPoints(totalPrice);

  const handleBooking = () => {
    if (!selectedService || !selectedTime || !selectedSpecialist) return;
    
    try {
      const booking = bookSpa(
        selectedService.id,
        selectedDate,
        selectedTime,
        selectedSpecialist
      );

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

      setBookingConfirmation({
        bookingType: "spa",
        confirmationCode: booking.confirmationCode,
        title: selectedService.name,
        date: format(selectedDate, "MMMM dd, yyyy"),
        time: selectedTime,
        location: "Spa & Wellness Center",
        details: `Specialist: ${selectedSpecialist}`,
        name: "John Doe", // This would come from user profile
        contact: "+1 (555) 123-4567", // This would come from user profile
        email: "johndoe@example.com", // This would come from user profile
        extras: bookedExtras,
        addons: bookedAddons,
        totalPrice: totalPrice,
        loyaltyPoints: loyaltyPoints
      });

      setStep("confirmation");
      toast.success("Spa service booked successfully!");
    } catch (error) {
      toast.error("Failed to book spa service");
      console.error(error);
    }
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setSelectedDate(new Date());
    setSelectedTime("");
    setSelectedSpecialist("");
    setSelectedExtras([]);
    setSelectedAddons([]);
    setPromoCode("");
    setAppliedPromo(null);
    setBookingConfirmation(null);
    setStep("service");
  };

  const renderServiceSelection = () => (
    <div className="grid gap-4">
      <h3 className="text-lg font-playfair text-center text-hotel-burgundy">Choose a Treatment</h3>
      {spaServices.map((service) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden hover:border-hotel-gold cursor-pointer transition-all"
                onClick={() => handleServiceSelect(service)}>
            <div className="h-40 overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-playfair text-lg font-medium text-hotel-burgundy">{service.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock size={14} className="mr-1" /> {service.durations.map(d => `${d.minutes}min`).join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-hotel-burgundy">From ${Math.min(...service.durations.map(d => d.price))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderDateTimeSelection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => setStep("service")}
      >
        ← Back to Services
      </Button>
      
      <h3 className="text-lg font-playfair font-medium text-hotel-burgundy mb-4">
        {selectedService?.name}
      </h3>

      {selectedService && (
        <DurationSelector
          durations={selectedService.durations}
          selectedDuration={selectedDuration || undefined}
          onSelect={setSelectedDuration}
        />
      )}
      
      <div className="mb-6 mt-6">
        <SelectorGroup
          title="Select Date"
          icon={<Calendar size={18} className="mr-2 text-hotel-gold" />}
          options={[0, 1, 2, 3, 4, 5].map((dayOffset) => {
            const date = new Date();
            date.setDate(date.getDate() + dayOffset);
            return {
              id: date.toDateString(),
              label: format(date, "EEE"),
              sublabel: format(date, "d")
            };
          })}
          selectedId={selectedDate.toDateString()}
          onSelect={(option) => {
            const date = new Date(option.id);
            setSelectedDate(date);
          }}
          columns={3}
        />
      </div>
      
      <div>
        <SelectorGroup
          title="Select Time"
          icon={<Clock size={18} className="mr-2 text-hotel-gold" />}
          options={availableTimes.map((time) => ({
            id: time,
            label: time
          }))}
          selectedId={selectedTime}
          onSelect={handleTimeSelect}
          columns={3}
        />
      </div>
    </motion.div>
  );

  const renderSpecialistSelection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => setStep("datetime")}
      >
        ← Back to Date & Time
      </Button>
      
      <div className="text-center mb-4">
        <h3 className="text-lg font-playfair font-medium text-hotel-burgundy">
          {selectedService?.name}
        </h3>
        <p className="text-sm text-gray-600">
          {format(selectedDate, "MMMM d, yyyy")} at {selectedTime}
        </p>
      </div>
      
      <SelectorGroup
        title="Select Specialist"
        icon={<User size={18} className="mr-2 text-hotel-gold" />}
        options={selectedService?.specialists.map((specialist) => ({
          id: specialist,
          label: specialist,
          sublabel: "Spa Specialist"
        })) || []}
        selectedId={selectedSpecialist}
        onSelect={handleSpecialistSelect}
        columns={1}
      />
    </motion.div>
  );

  const renderExtrasSelection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => setStep("specialist")}
      >
        ← Back to Specialist Selection
      </Button>
      
      <div className="text-center mb-4">
        <h3 className="text-lg font-playfair font-medium text-hotel-burgundy">
          {selectedService?.name}
        </h3>
        <p className="text-sm text-gray-600">
          {format(selectedDate, "MMMM d, yyyy")} at {selectedTime}
        </p>
        <p className="text-sm text-gray-600">
          Specialist: {selectedSpecialist}
        </p>
      </div>

      {/* Optional Extras */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Extras (Optional)</h4>
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
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Add-ons */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Gift size={16} className="mr-2 text-hotel-burgundy" /> 
          Suggested Add-ons
        </h4>
        <div className="space-y-3">
          {premiumAddons.map((addon) => (
            <div 
              key={addon.id}
              className={`border rounded-lg p-3 transition-all ${
                selectedAddons.includes(addon.id) 
                  ? "border-hotel-burgundy bg-hotel-burgundy/5" 
                  : "border-gray-200"
              }`}
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
                    className={
                      selectedAddons.includes(addon.id) 
                        ? "border-hotel-burgundy text-hotel-burgundy" 
                        : "bg-hotel-burgundy text-white"
                    }
                  >
                    {selectedAddons.includes(addon.id) ? "Remove" : "Add to Booking"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Promo Code</h4>
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
      <div className="border-t border-gray-100 pt-4 mt-4">
        <h4 className="font-medium text-md mb-2">Price Summary</h4>
        <div className="space-y-1 mb-3">
          <div className="flex justify-between">
            <span>{selectedService?.name}</span>
            <span>${baseServiceCost}</span>
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
      </div>

      <Button
        className="w-full py-3 mt-6 bg-hotel-burgundy text-white"
        onClick={handleBooking}
      >
        Book for ${totalPrice}
      </Button>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <BookingConfirmation
        bookingType="spa"
        confirmationCode={bookingConfirmation.confirmationCode}
        title={selectedService?.name || ""}
        date={bookingConfirmation.date}
        time={bookingConfirmation.time}
        location="Spa & Wellness Center"
        details={`Specialist: ${bookingConfirmation.specialist}`}
        name="John Doe" // This would come from user profile
        contact="+1 (555) 123-4567" // This would come from user profile
        email="johndoe@example.com" // This would come from user profile
      />
      
      <div className="mt-6 text-center">
        <Button 
          onClick={handleBackToServices}
          className="bg-hotel-burgundy hover:bg-hotel-burgundy/90 text-white"
        >
          Book Another Service
        </Button>
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (step) {
      case "service":
        return renderServiceSelection();
      case "datetime":
        return renderDateTimeSelection();
      case "specialist":
        return renderSpecialistSelection();
      case "extras":
        return renderExtrasSelection();
      case "confirmation":
        return renderConfirmation();
      default:
        return renderServiceSelection();
    }
  };

  return (
    <MobileLayout title="Spa Services" showBackButton>
      <div className="p-4">
        {renderStepContent()}
      </div>
    </MobileLayout>
  );
};

export default SpaServices;

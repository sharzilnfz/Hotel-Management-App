import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DurationSelector } from "@/components/spa/DurationSelector";
import { SpecialistSelector } from "@/components/spa/SpecialistSelector";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { ExtrasSelector } from "@/components/ui/extras-selector";
import { Calendar, User, Star } from "lucide-react";

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
interface SpaBookingFormProps {
  selectedService: any;
  selectedDuration: number | null;
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedSpecialist: string;
  selectedExtras: {
    id: string;
    quantity: number;
  }[];
  selectedAddons: {
    id: string;
    quantity: number;
  }[];
  spaExtras: any[];
  spaAddons: any[];
  onServiceReset: () => void;
  onDurationSelect: (duration: {
    minutes: number;
    price: number;
  }) => void;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onSpecialistSelect: (specialist: string) => void;
  onExtrasChange: (extras: {
    id: string;
    quantity: number;
  }[]) => void;
  onAddonsChange: (addons: {
    id: string;
    quantity: number;
  }[]) => void;
}
export function SpaBookingForm({
  selectedService,
  selectedDuration,
  selectedDate,
  selectedTime,
  selectedSpecialist,
  selectedExtras,
  selectedAddons,
  spaExtras,
  spaAddons,
  onServiceReset,
  onDurationSelect,
  onDateSelect,
  onTimeSelect,
  onSpecialistSelect,
  onExtrasChange,
  onAddonsChange
}: SpaBookingFormProps) {
  return (
    <div className="space-y-6">
      {/* Selected Service Summary */}
      <Card className="border-hotel-gold/30 bg-gradient-to-r from-hotel-cream to-hotel-pearl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-hotel-sand font-bold text-[hotel-sand-dark]">
              {selectedService.name}
            </h3>
            <Button variant="ghost" size="sm" onClick={onServiceReset} className="text-hotel-burgundy hover:bg-hotel-burgundy/10">
              Change
            </Button>
          </div>
          <p className="text-hotel-charcoal/70 text-sm">
            {selectedService.description}
          </p>
          <div className="flex items-center mt-3 text-hotel-charcoal/60">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className="text-sm">4.8</span>
            <span className="mx-2">•</span>
            <span className="text-sm">Base price: ${selectedService.basePrice}</span>
          </div>
        </CardContent>
      </Card>

      {/* Duration Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-hotel-burgundy text-base">Select Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <DurationSelector 
            durations={selectedService.durations} 
            selectedDuration={selectedDuration ? selectedService.durations.find((d: any) => d.minutes === selectedDuration) : undefined} 
            onSelect={onDurationSelect} 
          />
        </CardContent>
      </Card>

      {/* Date and Time Selection */}
      {selectedDuration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-hotel-burgundy text-base">
              <Calendar className="w-5 h-5 mr-2" />
              Select Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hotel-charcoal mb-2 mx-[10px]">
                Preferred Date
              </label>
              <DatePicker 
                date={selectedDate} 
                setDate={onDateSelect} 
                fromDate={new Date()} 
                placeholder="Select appointment date" 
              />
            </div>
            
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-hotel-charcoal mb-3">
                  Available Times
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => onTimeSelect(time)}
                      className={`p-2 text-sm rounded-lg border transition-all ${
                        selectedTime === time 
                          ? "bg-hotel-burgundy text-white border-hotel-burgundy" 
                          : "bg-white text-hotel-charcoal border-hotel-beige hover:border-hotel-burgundy"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Specialist Selection */}
      {selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-hotel-burgundy text-base">
              <User className="w-5 h-5 mr-2" />
              Choose Your Specialist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpecialistSelector
              specialists={selectedService.specialists}
              selectedSpecialist={selectedSpecialist}
              onSpecialistSelect={onSpecialistSelect}
            />
          </CardContent>
        </Card>
      )}

      {/* Spa Extras */}
      {selectedSpecialist && (
        <ExtrasSelector 
          title="Spa Extras" 
          items={spaExtras} 
          selectedExtras={selectedExtras} 
          onExtrasChange={onExtrasChange} 
        />
      )}

      {/* Spa Add-ons */}
      {selectedSpecialist && (
        <ExtrasSelector 
          title="Spa Add-ons" 
          items={spaAddons} 
          selectedExtras={selectedAddons} 
          onExtrasChange={onAddonsChange} 
        />
      )}
    </div>
  );
}

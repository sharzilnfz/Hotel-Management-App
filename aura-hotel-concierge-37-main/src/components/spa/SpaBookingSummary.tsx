import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
interface SpaBookingSummaryProps {
  selectedService: any;
  selectedDuration: number | null;
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedSpecialist: string;
  extrasTotal: number;
  totalPrice: number;
  onBookService: () => void;
}
export function SpaBookingSummary({
  selectedService,
  selectedDuration,
  selectedDate,
  selectedTime,
  selectedSpecialist,
  extrasTotal,
  totalPrice,
  onBookService
}: SpaBookingSummaryProps) {
  if (!selectedDuration) return null;
  const isComplete = selectedService && selectedDuration && selectedDate && selectedTime && selectedSpecialist;
  return <>
      {/* Price Summary */}
      <Card className="bg-hotel-burgundy/5 border-hotel-burgundy/20 my-[14px]">
        <CardContent className="p-6 py-[22px] my-[6px]">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-hotel-sand px-0 mx-0 my-0 py-0">Service ({selectedDuration} min)</span>
              <span className="text-hotel-sand mx-[13px]">${selectedService.durations.find((d: any) => d.minutes === selectedDuration)?.price || selectedService.basePrice}</span>
            </div>
            {extrasTotal > 0 && <div className="flex justify-between text-sm">
                <span>Extras & Add-ons</span>
                <span className="my-0 py-0 px-[12px]">${extrasTotal}</span>
              </div>}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-hotel-burgundy/20">
              <span className="text-hotel-burgundy-dark mx-[3px]">Total</span>
              <span className="text-hotel-burgundy mx-[11px]">${totalPrice}</span>
            </div>
          </div>
          
          <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center text-amber-700 text-sm my-[12px] py-[2px] px-[2px] mx-0">
            <Award className="h-4 w-4 mr-2 text-amber-500" />
            Earn {Math.floor(totalPrice)} loyalty points with this booking
          </div>
        </CardContent>
      </Card>

      {/* Book Button */}
      <Button onClick={onBookService} disabled={!isComplete} className="w-full bg-hotel-burgundy hover:bg-hotel-burgundy/90 text-white text-lg font-semibold py-[11px] my-[4px]">
        {isComplete ? "Book Appointment" : "Complete Selection to Continue"}
      </Button>
    </>;
}
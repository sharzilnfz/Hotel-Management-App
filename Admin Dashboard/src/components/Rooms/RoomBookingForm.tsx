
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, InfoIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoomBookingFormProps {
  roomId: string;
  roomName: string;
  price: number;
  isRefundable?: boolean;
  refundPolicy?: string;
}

const RoomBookingForm = ({ 
  roomId, 
  roomName, 
  price, 
  isRefundable = true,
  refundPolicy = "Full refund if cancelled up to 48 hours before check-in. 50% refund if cancelled up to 24 hours before check-in."
}: RoomBookingFormProps) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const { toast } = useToast();
  
  const isDateValid = checkInDate && checkOutDate && checkOutDate > checkInDate;
  
  const getTotalNights = () => {
    if (!isDateValid) return 0;
    return Math.ceil(
      (checkOutDate!.getTime() - checkInDate!.getTime()) / (1000 * 60 * 60 * 24)
    );
  };
  
  const totalPrice = getTotalNights() * price;

  const handleSubmit = () => {
    // In a real app, this would call an API to process the booking
    toast({
      title: "Booking Submitted",
      description: `Your ${roomName} has been booked successfully for ${getTotalNights()} nights.`,
    });
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="check-in">Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="check-in"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? (
                    format(checkInDate, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  initialFocus
                  disabled={(date) => 
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-out">Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="check-out"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? (
                    format(checkOutDate, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  initialFocus
                  disabled={(date) => 
                    date < (checkInDate || new Date(new Date().setHours(0, 0, 0, 0)))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Number of Guests</Label>
          <div className="flex items-center">
            <Users size={16} className="mr-2 text-gray-500" />
            <Input
              id="guests"
              type="number"
              min={1}
              max={4}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="special-requests">Special Requests (Optional)</Label>
          <Input
            id="special-requests"
            placeholder="e.g., High floor, early check-in..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="refundable" className="text-sm font-medium">Refundable</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{refundPolicy}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch id="refundable" checked={isRefundable} disabled />
        </div>

        {isDateValid && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between mb-2">
              <span>Total nights:</span>
              <span>{getTotalNights()}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total price:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}

        <Button
          className="w-full bg-hotel-primary hover:bg-opacity-90"
          onClick={handleSubmit}
          disabled={!isDateValid}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default RoomBookingForm;

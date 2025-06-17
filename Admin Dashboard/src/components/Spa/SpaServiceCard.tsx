
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface SpaServiceCardProps {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  imageUrl: string;
}

const SpaServiceCard = ({
  id,
  name,
  description,
  duration,
  price,
  imageUrl
}: SpaServiceCardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const { toast } = useToast();

  // Available time slots for demo
  const timeSlots = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  const handleBooking = () => {
    // In a real app, this would call an API to process the booking
    toast({
      title: "Spa Appointment Booked",
      description: `Your ${name} appointment has been scheduled for ${format(selectedDate!, "PPP")} at ${selectedTime}.`,
    });
    setShowBookingOptions(false);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <div className="text-lg font-semibold text-hotel-primary">${price}</div>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock size={16} className="mr-1" />
          <span>{duration} minutes</span>
        </div>
        
        <Button 
          onClick={() => setShowBookingOptions(!showBookingOptions)}
          className="w-full bg-hotel-primary hover:bg-opacity-90 text-white"
        >
          {showBookingOptions ? "Hide Booking Options" : "Book Appointment"}
        </Button>
        
        {showBookingOptions && (
          <div className="mt-4 border-t border-gray-200 pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => 
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Time</label>
              <Select onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-hotel-primary hover:bg-opacity-90"
            >
              Confirm Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaServiceCard;

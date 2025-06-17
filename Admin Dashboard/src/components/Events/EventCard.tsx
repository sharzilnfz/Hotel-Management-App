
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  imageUrl: string;
  price: number;
  location: string;
}

const EventCard = ({
  id,
  title,
  description,
  date,
  imageUrl,
  price,
  location
}: EventCardProps) => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const { toast } = useToast();

  const handlePurchase = () => {
    // In a real app, this would call an API to process the ticket purchase
    toast({
      title: "Tickets Purchased",
      description: `You have purchased ${ticketCount} ticket(s) for ${title}.`,
    });
    setShowTicketForm(false);
  };

  const formattedDate = format(new Date(date), "EEEE, MMMM d, yyyy");
  const formattedTime = format(new Date(date), "h:mm a");

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays size={16} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-1" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={16} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-hotel-primary">${price}<span className="text-sm text-gray-500">/ticket</span></div>
        </div>
        
        <Button 
          onClick={() => setShowTicketForm(!showTicketForm)}
          className="w-full bg-hotel-primary hover:bg-opacity-90 text-white"
        >
          <Ticket size={16} className="mr-2" />
          {showTicketForm ? "Hide Ticket Form" : "Purchase Tickets"}
        </Button>
        
        {showTicketForm && (
          <div className="mt-4 border-t border-gray-200 pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-count">Number of Tickets</Label>
              <Input
                id="ticket-count"
                type="number"
                min={1}
                value={ticketCount}
                onChange={(e) => setTicketCount(parseInt(e.target.value))}
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Price per ticket:</span>
                <span>${price}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total price:</span>
                <span>${price * ticketCount}</span>
              </div>
            </div>
            
            <Button
              onClick={handlePurchase}
              className="w-full bg-hotel-primary hover:bg-opacity-90"
            >
              Confirm Purchase
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;

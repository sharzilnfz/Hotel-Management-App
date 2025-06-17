
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Check } from "lucide-react";
import RoomBookingForm from "./RoomBookingForm";

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  amenities: string[];
  capacity: number;
}

const RoomCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  amenities,
  capacity
}: RoomCardProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <div className="text-lg font-semibold text-hotel-primary">${price}<span className="text-sm text-gray-500">/night</span></div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Users size={16} className="mr-1" />
          <span>Up to {capacity} guests</span>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center text-xs bg-gray-100 rounded-full px-2 py-1">
                <Check size={12} className="text-hotel-primary mr-1" />
                {amenity}
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="w-full bg-hotel-primary hover:bg-opacity-90 text-white"
        >
          <Calendar size={16} className="mr-2" />
          {showBookingForm ? "Hide Booking Form" : "Book Now"}
        </Button>
        
        {showBookingForm && <RoomBookingForm roomId={id} roomName={name} price={price} />}
      </div>
    </div>
  );
};

export default RoomCard;

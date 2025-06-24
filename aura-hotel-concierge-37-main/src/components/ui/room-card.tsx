import React from "react";
import { motion } from "framer-motion";
import { Bath, Users, Wifi, Coffee } from "lucide-react";
interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string;
  amenities: string[];
  capacity: number;
  onClick?: () => void;
}
export function RoomCard({
  id,
  name,
  description,
  price,
  currency = "$",
  image,
  amenities,
  capacity,
  onClick
}: RoomCardProps) {
  return <motion.div whileHover={{
    y: -5
  }} className="overflow-hidden rounded-xl bg-white shadow-md border border-gray-100 hover:border-hotel-gold/50 transition-all" onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-playfair text-lg font-semibold text-hotel-burgundy">{name}</h3>
          <div className="text-right">
            <span className="text-lg font-semibold text-hotel-burgundy">{currency}{price}</span>
            <span className="text-sm text-gray-500 block">per night</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-hotel-sand-dark" />
            <span>{capacity}</span>
          </div>
          {amenities.includes("wifi") && <div className="flex items-center gap-1">
              <Wifi size={16} className="text-hotel-sand-dark" />
            </div>}
          {amenities.includes("bathroom") && <div className="flex items-center gap-1">
              <Bath size={16} className="text-hotel-sand-dark" />
            </div>}
          {amenities.includes("breakfast") && <div className="flex items-center gap-1">
              <Coffee size={16} className="text-hotel-sand-dark" />
            </div>}
        </div>
        
        <button onClick={e => {
        e.stopPropagation();
        onClick && onClick();
      }} className="w-full py-2 rounded-md hover:bg-opacity-90 transition-colors text-hotel-sand text-[hotel-sand-dark] font-bold bg-hotel-burgundy-dark bg-red-900 hover:bg-red-800">
          Book Now
        </button>
      </div>
    </motion.div>;
}
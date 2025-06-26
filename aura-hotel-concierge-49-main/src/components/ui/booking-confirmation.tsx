
import React from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Check, Calendar, Clock, MapPin, Phone, Mail, Award, Gift, Tag } from "lucide-react";

export interface BookingExtra {
  id: string;
  name?: string;
  price?: number;
}

interface BookingConfirmationProps {
  bookingType: "room" | "spa" | "event" | "restaurant" | "meeting";
  confirmationCode: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  details: string;
  name: string;
  contact: string;
  email: string;
  extras?: BookingExtra[];
  addons?: BookingExtra[];
  totalPrice?: number;
  loyaltyPoints?: number;
}

export function BookingConfirmation({
  bookingType,
  confirmationCode,
  title,
  date,
  time,
  location,
  details,
  name,
  contact,
  email,
  extras = [],
  addons = [],
  totalPrice,
  loyaltyPoints,
}: BookingConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-md mx-auto"
    >
      <div className="bg-hotel-burgundy text-white p-5 text-center">
        <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center mb-3">
          <Check size={32} className="text-hotel-burgundy" />
        </div>
        <h2 className="font-playfair text-xl font-semibold">Booking Confirmed!</h2>
        <p className="text-sm opacity-90 mt-1">Thank you for your reservation</p>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-hotel-burgundy">{title}</h3>
            <p className="text-sm text-gray-600">{details}</p>
          </div>
          <div className="text-right">
            <span className="font-medium text-sm text-gray-500">Confirmation Code</span>
            <span className="block font-mono font-bold text-hotel-burgundy">{confirmationCode}</span>
          </div>
        </div>
        
        <div className="border-t border-b border-gray-100 py-4 my-4 grid gap-2">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar size={18} className="text-hotel-burgundy" />
            <span>{date}</span>
          </div>
          
          {time && (
            <div className="flex items-center gap-3 text-gray-700">
              <Clock size={18} className="text-hotel-burgundy" />
              <span>{time}</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin size={18} className="text-hotel-burgundy" />
              <span>{location}</span>
            </div>
          )}
        </div>
        
        {/* Price Details Section - new */}
        {totalPrice && (
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Booking Details</h4>
            
            {/* Extras */}
            {extras && extras.length > 0 && (
              <div className="mb-2">
                <span className="text-sm text-gray-500">Selected Extras:</span>
                <ul className="text-sm">
                  {extras.map((extra, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{extra.name}</span>
                      <span>${extra.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Add-ons */}
            {addons && addons.length > 0 && (
              <div className="mb-2">
                <span className="text-sm text-gray-500">Selected Add-ons:</span>
                <ul className="text-sm">
                  {addons.map((addon, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{addon.name}</span>
                      <span>${addon.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Total Price */}
            <div className="flex justify-between mt-2 font-medium">
              <span>Total</span>
              <span className="text-hotel-burgundy">${totalPrice}</span>
            </div>
            
            {/* Loyalty Points */}
            {loyaltyPoints && (
              <div className="flex items-center mt-3 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                <Award size={16} className="mr-1 text-amber-500" />
                <span>You've earned {loyaltyPoints} loyalty points</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mb-5">
          <h4 className="font-medium text-gray-700 mb-2">Guest Information</h4>
          <div className="grid gap-2">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="font-medium">Name:</span>
              <span>{name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={16} className="text-hotel-burgundy" />
              <span>{contact}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={16} className="text-hotel-burgundy" />
              <span>{email}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className="p-2 bg-white border border-gray-200 rounded-lg">
            <QRCodeSVG
              value={`PARKSIDE-${bookingType.toUpperCase()}-${confirmationCode}`}
              size={120}
              bgColor="#FFFFFF"
              fgColor="#6B0F1A"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Present this code at check-in/reception</p>
          <p className="mt-1">A copy has been sent to your email</p>
        </div>
      </div>
    </motion.div>
  );
}

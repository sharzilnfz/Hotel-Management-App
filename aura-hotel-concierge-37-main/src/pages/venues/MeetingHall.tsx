
import React, { useState } from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Clock, Wifi, Coffee, Car, Monitor } from "lucide-react";
import { MeetingHallBookingForm } from "@/components/venues/MeetingHallBookingForm";
import { BookingThankYou } from "@/components/venues/BookingThankYou";

const MeetingHall = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleBookClick = () => {
    setShowBookingForm(true);
  };

  const handleFormSubmit = (formData: any) => {
    console.log("Meeting hall booking submitted:", formData);
    setShowBookingForm(false);
    setShowThankYou(true);
  };

  const handleFormCancel = () => {
    setShowBookingForm(false);
  };

  if (showThankYou) {
    return (
      <MobileLayout hideHeader>
        <BookingThankYou />
      </MobileLayout>
    );
  }

  if (showBookingForm) {
    return (
      <MobileLayout title="Book Meeting Hall" showBackButton>
        <MeetingHallBookingForm 
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Meeting Hall" showBackButton>
      <div className="p-4 pb-20 space-y-6">
        {/* Hero Image */}
        <div className="relative h-64 rounded-2xl overflow-hidden">
          <img 
            src="/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png" 
            alt="Meeting Hall"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h1 className="text-2xl font-playfair font-bold text-white">Executive Meeting Hall</h1>
            <div className="flex items-center gap-1 text-white/90 mt-1">
              <MapPin size={14} />
              <span className="text-sm">Luxury Hotel, Level 2</span>
            </div>
          </div>
        </div>

        {/* Venue Details */}
        <Card>
          <CardHeader>
            <CardTitle>Venue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-hotel-burgundy" />
                <div>
                  <p className="text-sm text-hotel-charcoal/70">Capacity</p>
                  <p className="font-semibold">Up to 50 people</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-hotel-burgundy" />
                <div>
                  <p className="text-sm text-hotel-charcoal/70">Duration</p>
                  <p className="font-semibold">Flexible hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-hotel-burgundy" />
                <span className="text-sm">High-Speed WiFi</span>
              </div>
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-hotel-burgundy" />
                <span className="text-sm">AV Equipment</span>
              </div>
              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-hotel-burgundy" />
                <span className="text-sm">Refreshments Available</span>
              </div>
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-hotel-burgundy" />
                <span className="text-sm">Valet Parking</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-hotel-charcoal/80 leading-relaxed">
              Our Executive Meeting Hall offers a sophisticated environment for corporate meetings, 
              presentations, and business events. Featuring state-of-the-art audiovisual equipment, 
              elegant décor, and professional service, it's the perfect space for your important gatherings.
            </p>
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button 
          onClick={handleBookClick}
          className="w-full h-12 bg-hotel-burgundy hover:bg-hotel-burgundy/90 text-white text-lg font-semibold"
        >
          Book Meeting Hall
        </Button>
      </div>
    </MobileLayout>
  );
};

export default MeetingHall;

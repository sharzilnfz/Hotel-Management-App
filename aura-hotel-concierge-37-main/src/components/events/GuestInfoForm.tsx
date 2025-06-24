
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface GuestInfoFormProps {
  onSubmit: (guestInfo: GuestInfo) => void;
  onCancel: () => void;
  eventTitle: string;
}

export const GuestInfoForm: React.FC<GuestInfoFormProps> = ({
  onSubmit,
  onCancel,
  eventTitle
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isBookingForGuest, setIsBookingForGuest] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  // Auto-fill user information when component mounts or booking type changes
  useEffect(() => {
    if (isAuthenticated && user && !isBookingForGuest) {
      const nameParts = user.name.split(" ");
      setGuestInfo({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email,
        phone: user.phone || ""
      });
    } else if (isBookingForGuest) {
      // Clear form when booking for guest
      setGuestInfo({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
      });
    }
  }, [user, isAuthenticated, isBookingForGuest]);

  const handleInputChange = (field: keyof GuestInfo, value: string) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!guestInfo.firstName.trim() || !guestInfo.lastName.trim() || 
        !guestInfo.email.trim() || !guestInfo.phone.trim()) {
      return;
    }

    onSubmit(guestInfo);
  };

  const isFormValid = guestInfo.firstName.trim() && 
                     guestInfo.lastName.trim() && 
                     guestInfo.email.trim() && 
                     guestInfo.phone.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-4"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-playfair text-hotel-burgundy">
            Guest Information
          </CardTitle>
          <p className="text-sm text-hotel-charcoal/70">
            Please provide guest details for: {eventTitle}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Type Toggle - Only show for authenticated users */}
            {isAuthenticated && (
              <div className="bg-hotel-pearl/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-hotel-charcoal">Booking for:</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={!isBookingForGuest ? "default" : "outline"}
                    onClick={() => setIsBookingForGuest(false)}
                    className={`${!isBookingForGuest 
                      ? "bg-hotel-burgundy text-white" 
                      : "border-hotel-burgundy text-hotel-burgundy hover:bg-hotel-burgundy hover:text-white"
                    }`}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Myself
                  </Button>
                  <Button
                    type="button"
                    variant={isBookingForGuest ? "default" : "outline"}
                    onClick={() => setIsBookingForGuest(true)}
                    className={`${isBookingForGuest 
                      ? "bg-hotel-burgundy text-white" 
                      : "border-hotel-burgundy text-hotel-burgundy hover:bg-hotel-burgundy hover:text-white"
                    }`}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Guest
                  </Button>
                </div>
              </div>
            )}

            {/* Guest Information Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={guestInfo.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={guestInfo.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-hotel-burgundy text-hotel-burgundy hover:bg-hotel-burgundy hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 bg-hotel-burgundy hover:bg-hotel-burgundy/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

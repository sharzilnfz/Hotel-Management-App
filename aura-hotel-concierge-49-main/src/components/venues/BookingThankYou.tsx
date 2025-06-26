
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookingThankYou() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-playfair font-bold text-hotel-burgundy">
              Thank You for your Interest!
            </h1>
            <p className="text-hotel-charcoal/80 leading-relaxed">
              Our Team will contact you as soon as possible!
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-hotel-cream/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-hotel-charcoal/70">
              <Clock className="w-4 h-4 text-hotel-burgundy" />
              <span>Response time: Within 24 hours</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-hotel-charcoal/70">
              <Phone className="w-4 h-4 text-hotel-burgundy" />
              <span>We'll call to confirm details</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleGoHome}
            className="w-full bg-hotel-burgundy hover:bg-hotel-burgundy/90"
          >
            Return to Home
          </Button>

          {/* Contact Information */}
          <div className="text-xs text-hotel-charcoal/60 pt-4 border-t border-hotel-beige/30">
            <p>Need immediate assistance?</p>
            <p className="font-medium">Call us at: +1 (555) 123-4567</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { Calendar, Award, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const BookingsList = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MobileLayout title="Reservations" showBackButton>
      <div className="p-6">
        {isAuthenticated ? (
          <div className="hotel-card p-8 text-center border-2 border-hotel-beige/40">
            <div className="py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-hotel-pearl to-hotel-beige flex items-center justify-center">
                <Calendar size={48} className="text-hotel-burgundy/60" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-playfair font-bold text-hotel-burgundy mb-3">
                No Current Reservations
              </h3>
              <p className="text-hotel-charcoal/70 font-montserrat mb-8 leading-relaxed">
                Discover our luxury accommodations and book your perfect getaway
              </p>
              <Link to="/rooms">
                <button className="bg-luxury-gradient text-white py-4 px-8 rounded-2xl font-semibold font-montserrat shadow-luxury hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-hotel-burgundy/20">
                  Explore Suites
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="hotel-card p-8 text-center border-2 border-hotel-beige/40">
            <div className="py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-hotel-gold-light to-hotel-gold flex items-center justify-center">
                <Award size={48} className="text-hotel-burgundy" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-playfair font-bold text-hotel-burgundy mb-3">
                Exclusive Member Access
              </h3>
              <p className="text-hotel-charcoal/70 font-montserrat mb-8 leading-relaxed">
                Join our elite community to access luxury reservations and earn exclusive rewards
              </p>
              <Link to="/auth/login">
                <button className="bg-luxury-gradient text-white py-4 px-8 rounded-2xl font-semibold font-montserrat shadow-luxury hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-hotel-burgundy/20">
                  Become a Member
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default BookingsList;

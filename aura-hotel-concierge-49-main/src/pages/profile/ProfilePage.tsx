
import React from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { useAuth } from "@/contexts/AuthContext";
import { Award, Mail, Phone, Edit, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <MobileLayout title="Profile" showBackButton>
        <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center">
          <h2 className="text-xl font-semibold text-hotel-burgundy mb-4">
            Please sign in to view your profile
          </h2>
          <Link to="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="My Profile" showBackButton showBottomNav={false}>
      <div className="p-4 space-y-6 pb-24">
        {/* Profile header */}
        <div className="bg-gradient-to-br from-hotel-burgundy to-hotel-burgundy/90 text-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-hotel-cream text-hotel-burgundy text-2xl font-semibold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center mt-1 text-white/90">
                <Award className="h-4 w-4 mr-1" />
                <span>{user.tier} Member</span>
              </div>
              <div className="mt-3">
                <Link to="/profile/edit">
                  <Button size="sm" variant="gold" className="rounded-full px-4">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-medium text-lg text-hotel-burgundy mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-hotel-burgundy mr-3" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-hotel-burgundy mr-3" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Loyalty Information */}
        <Link to="/loyalty" className="block">
          <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg text-hotel-burgundy">Loyalty Program</h3>
              <div className="flex items-center mt-1 text-gray-600">
                <Award className="h-4 w-4 mr-1 text-hotel-gold" />
                <span>{user.loyaltyPoints} points</span>
                <span className="mx-1">•</span>
                <span className="font-medium capitalize">{user.tier} Tier</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>

        {/* Bookings */}
        <Link to="/bookings" className="block">
          <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg text-hotel-burgundy">My Bookings</h3>
              <p className="text-gray-600 text-sm mt-1">View your current and past bookings</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>

        {/* Sign Out Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              logout();
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}

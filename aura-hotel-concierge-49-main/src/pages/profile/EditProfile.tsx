
import React from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProfile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <MobileLayout 
      showBackButton={true} 
      title="Edit Profile" 
      showBottomNav={false}
    >
      <div className="p-6">
        <div className="hotel-card p-6 border-2 border-hotel-beige/40">
          <ProfileForm user={user} />
        </div>
      </div>
    </MobileLayout>
  );
}

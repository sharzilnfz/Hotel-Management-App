import React from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { Award, Gift, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LoyaltyProgram = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const loyaltyTiers = [
    {
      name: "Silver",
      points: 0,
      benefits: ["Free Wi-Fi", "Late checkout (when available)"]
    },
    {
      name: "Gold",
      points: 5000,
      benefits: ["Silver benefits", "Room upgrades", "Welcome amenity"]
    },
    {
      name: "Platinum",
      points: 10000,
      benefits: ["Gold benefits", "Spa credit", "Free breakfast"]
    }
  ];

  const rewards = [
    {
      id: "free-night",
      title: "Free Night Stay",
      description: "Valid for standard rooms",
      points: 25000
    },
    {
      id: "spa-credit",
      title: "Spa Credit $50",
      description: "Valid for any spa service",
      points: 10000
    },
    {
      id: "restaurant-voucher",
      title: "Restaurant Voucher",
      description: "$25 off your next meal",
      points: 5000
    }
  ];

  const handleRewardRedeem = (reward: typeof rewards[0]) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to redeem rewards",
        variant: "destructive"
      });
      return;
    }

    if (user.loyaltyPoints < reward.points) {
      toast({
        title: "Insufficient points",
        description: `You need ${reward.points} points to redeem this reward. You currently have ${user.loyaltyPoints} points.`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reward redeemed!",
      description: `${reward.title} has been added to your account. Check your email for details.`,
    });
  };

  return (
    <MobileLayout title="Loyalty Program" showBackButton>
      <div className="p-4 pb-20">
        {isAuthenticated && user ? (
          <>
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-hotel-burgundy text-white flex items-center justify-center text-xl font-semibold mr-4">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-medium">{user.name}</h2>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award size={16} className="text-hotel-gold mr-1" />
                    <span>{user.loyaltyPoints} points</span>
                    <span className="mx-1">•</span>
                    <span className="font-medium capitalize">{user.tier} Tier</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Progress to Next Tier</h3>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-hotel-gold"
                    style={{ width: `${Math.min((user.loyaltyPoints / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Current: {user.loyaltyPoints} pts</span>
                  <span>Next tier: 5,000 pts</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <h3 className="font-playfair text-lg font-medium text-hotel-burgundy mb-3 flex items-center">
                <Gift size={20} className="mr-2 text-hotel-gold" />
                Available Rewards
              </h3>
              <div className="space-y-3">
                {rewards.map((reward) => (
                  <div key={reward.id} className="border border-gray-100 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{reward.title}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                    <button 
                      onClick={() => handleRewardRedeem(reward)}
                      disabled={user.loyaltyPoints < reward.points}
                      className={`text-white text-sm px-3 py-1 rounded transition-colors ${
                        user.loyaltyPoints >= reward.points 
                          ? 'bg-hotel-burgundy hover:bg-hotel-burgundy/90' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {reward.points.toLocaleString()} pts
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-playfair text-lg font-medium text-hotel-burgundy mb-3 flex items-center">
                <Star size={20} className="mr-2 text-hotel-gold" />
                Loyalty Tiers
              </h3>
              <div className="space-y-4 mt-3">
                {loyaltyTiers.map((tier) => (
                  <div 
                    key={tier.name}
                    className={`p-3 rounded-lg ${
                      user.tier.toLowerCase() === tier.name.toLowerCase() 
                        ? 'bg-hotel-burgundy/10 border border-hotel-burgundy/20' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center">
                        {user.tier.toLowerCase() === tier.name.toLowerCase() && (
                          <Award size={16} className="text-hotel-gold mr-1" />
                        )}
                        {tier.name} Tier
                      </h4>
                      <span className="text-sm text-gray-600">{tier.points}+ points</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Award size={48} className="mx-auto text-hotel-gold mb-4" />
            <h2 className="text-xl font-playfair font-semibold text-hotel-burgundy mb-3">
              Join Our Loyalty Program
            </h2>
            <p className="text-gray-600 mb-6">
              Sign in to access our exclusive loyalty program and start earning rewards with every stay.
            </p>
            <Link to="/auth/login">
              <button className="bg-hotel-burgundy text-white py-2 px-6 rounded-lg text-sm font-medium">
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default LoyaltyProgram;

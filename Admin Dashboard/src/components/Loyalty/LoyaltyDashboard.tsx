
import { Award, Gift, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const LoyaltyDashboard = () => {
  // In a real app, this would be fetched from an API based on the user's data
  const loyaltyData = {
    tier: "Silver",
    points: 2750,
    nextTier: "Gold",
    pointsForNextTier: 5000,
    rewards: [
      {
        id: "r1",
        name: "Free Breakfast",
        pointsCost: 500,
        description: "Enjoy a complimentary breakfast for two at our restaurant."
      },
      {
        id: "r2",
        name: "Room Upgrade",
        pointsCost: 1000,
        description: "Upgrade your next stay to the next room category."
      },
      {
        id: "r3",
        name: "Spa Credit",
        pointsCost: 1500,
        description: "$50 credit to use at our spa."
      }
    ],
    recentActivity: [
      {
        id: "a1",
        type: "earned",
        points: 250,
        description: "Room booking - Deluxe Suite",
        date: "2023-08-25"
      },
      {
        id: "a2",
        type: "earned",
        points: 100,
        description: "Restaurant order - Dinner",
        date: "2023-08-26"
      },
      {
        id: "a3",
        type: "redeemed",
        points: 500,
        description: "Free breakfast reward",
        date: "2023-08-27"
      }
    ]
  };

  const progressPercentage = (loyaltyData.points / loyaltyData.pointsForNextTier) * 100;

  return (
    <div className="space-y-8 pb-6">
      {/* Tier Status */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {loyaltyData.tier} Member
            </h3>
            <p className="text-sm text-gray-600">
              {loyaltyData.points} points earned
            </p>
          </div>
          <div className="bg-hotel-primary p-2 rounded-full text-white">
            <Award size={24} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{loyaltyData.tier}</span>
            <span>{loyaltyData.nextTier}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-gray-500 text-right">
            {loyaltyData.pointsForNextTier - loyaltyData.points} points needed for {loyaltyData.nextTier}
          </p>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <Gift size={20} className="text-hotel-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Available Rewards</h3>
        </div>
        
        <div className="space-y-4">
          {loyaltyData.rewards.map((reward) => (
            <div key={reward.id} className="border border-gray-200 rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{reward.name}</h4>
                <span className="bg-hotel-accent text-hotel-primary rounded-full px-2 py-1 text-xs font-medium">
                  {reward.pointsCost} points
                </span>
              </div>
              <p className="text-sm text-gray-600">{reward.description}</p>
              <button
                className={`w-full mt-2 py-1.5 rounded-md text-sm font-medium ${
                  loyaltyData.points >= reward.pointsCost
                    ? "bg-hotel-primary text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
                disabled={loyaltyData.points < reward.pointsCost}
              >
                {loyaltyData.points >= reward.pointsCost ? "Redeem Reward" : "Not Enough Points"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <TrendingUp size={20} className="text-hotel-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        </div>
        
        <div className="space-y-3">
          {loyaltyData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
              <span className={`text-sm font-medium ${
                activity.type === "earned" ? "text-green-600" : "text-red-600"
              }`}>
                {activity.type === "earned" ? "+" : "-"}{activity.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDashboard;

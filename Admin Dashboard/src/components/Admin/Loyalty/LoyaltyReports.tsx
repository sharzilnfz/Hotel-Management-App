
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Users, Award, TrendingUp } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="text-hotel-primary">{icon}</div>
      </div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

const LoyaltyReports = () => {
  // Sample data - in a real app, this would come from an API
  const membershipData = [
    { month: 'Jan', bronze: 120, silver: 80, gold: 40, platinum: 20 },
    { month: 'Feb', bronze: 140, silver: 90, gold: 45, platinum: 22 },
    { month: 'Mar', bronze: 160, silver: 100, gold: 50, platinum: 25 },
    { month: 'Apr', bronze: 180, silver: 110, gold: 55, platinum: 28 },
    { month: 'May', bronze: 200, silver: 120, gold: 60, platinum: 30 },
    { month: 'Jun', bronze: 220, silver: 130, gold: 65, platinum: 32 },
  ];

  const stats = [
    {
      title: "Total Members",
      value: "2,834",
      icon: <Users className="h-4 w-4" />,
      description: "+12% from last month"
    },
    {
      title: "Active Members",
      value: "2,156",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "76% activation rate"
    },
    {
      title: "Points Redeemed",
      value: "156,420",
      icon: <Trophy className="h-4 w-4" />,
      description: "Last 30 days"
    },
    {
      title: "Average Tier",
      value: "Silver",
      icon: <Award className="h-4 w-4" />,
      description: "Most common tier"
    },
  ];

  // Configuration for chart colors
  const chartConfig = {
    bronze: {
      theme: {
        light: "#b87c4c",
        dark: "#b87c4c"
      }
    },
    silver: {
      theme: {
        light: "#9ca3af",
        dark: "#9ca3af"
      }
    },
    gold: {
      theme: {
        light: "#fbbf24",
        dark: "#fbbf24"
      }
    },
    platinum: {
      theme: {
        light: "#64748b",
        dark: "#64748b"
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Growth by Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={membershipData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bronze" fill="#b87c4c" name="Bronze" />
                <Bar dataKey="silver" fill="#9ca3af" name="Silver" />
                <Bar dataKey="gold" fill="#fbbf24" name="Gold" />
                <Bar dataKey="platinum" fill="#64748b" name="Platinum" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyReports;

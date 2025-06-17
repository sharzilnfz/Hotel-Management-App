
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportsContentProps {
  department?: string;
}

const ReportsContent = ({ department = "Management" }: ReportsContentProps) => {
  const [timeRange, setTimeRange] = useState("month");
  
  // Mock data for charts
  const occupancyData = [
    { name: "Jan", occupancy: 65 },
    { name: "Feb", occupancy: 59 },
    { name: "Mar", occupancy: 80 },
    { name: "Apr", occupancy: 81 },
    { name: "May", occupancy: 56 },
    { name: "Jun", occupancy: 55 },
    { name: "Jul", occupancy: 78 },
    { name: "Aug", occupancy: 90 },
    { name: "Sep", occupancy: 81 },
    { name: "Oct", occupancy: 66 },
    { name: "Nov", occupancy: 70 },
    { name: "Dec", occupancy: 85 }
  ];
  
  const revenueData = [
    { name: "Jan", revenue: 54000 },
    { name: "Feb", revenue: 45000 },
    { name: "Mar", revenue: 60000 },
    { name: "Apr", revenue: 65000 },
    { name: "May", revenue: 50000 },
    { name: "Jun", revenue: 48000 },
    { name: "Jul", revenue: 70000 },
    { name: "Aug", revenue: 85000 },
    { name: "Sep", revenue: 78000 },
    { name: "Oct", revenue: 60000 },
    { name: "Nov", revenue: 65000 },
    { name: "Dec", revenue: 90000 }
  ];
  
  const spaRevenueData = [
    { name: "Jan", revenue: 18000 },
    { name: "Feb", revenue: 22000 },
    { name: "Mar", revenue: 25000 },
    { name: "Apr", revenue: 20000 },
    { name: "May", revenue: 19000 },
    { name: "Jun", revenue: 21000 },
    { name: "Jul", revenue: 24000 },
    { name: "Aug", revenue: 28000 },
    { name: "Sep", revenue: 26000 },
    { name: "Oct", revenue: 22000 },
    { name: "Nov", revenue: 20000 },
    { name: "Dec", revenue: 27000 }
  ];
  
  const restaurantRevenueData = [
    { name: "Jan", revenue: 32000 },
    { name: "Feb", revenue: 29000 },
    { name: "Mar", revenue: 31000 },
    { name: "Apr", revenue: 33000 },
    { name: "May", revenue: 30000 },
    { name: "Jun", revenue: 34000 },
    { name: "Jul", revenue: 38000 },
    { name: "Aug", revenue: 42000 },
    { name: "Sep", revenue: 39000 },
    { name: "Oct", revenue: 35000 },
    { name: "Nov", revenue: 33000 },
    { name: "Dec", revenue: 41000 }
  ];
  
  // Get department-specific data
  const getDepartmentRevenueData = () => {
    switch (department) {
      case "Spa & Wellness":
        return spaRevenueData;
      case "Food & Beverage":
        return restaurantRevenueData;
      default:
        return revenueData;
    }
  };
  
  const departmentRevenue = getDepartmentRevenueData();
  
  // Calculate department-specific totals
  const totalRevenue = departmentRevenue.reduce((sum, item) => sum + item.revenue, 0);
  
  const bookingSourceData = [
    { name: "Website", value: 45 },
    { name: "OTAs", value: 30 },
    { name: "Phone", value: 15 },
    { name: "Walk-in", value: 5 },
    { name: "Travel Agents", value: 5 }
  ];
  
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];
  
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  // Generate department-specific title
  const getDepartmentTitle = () => {
    if (department === "Management") return "Reports & Analytics";
    return `${department} Reports & Analytics`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{getDepartmentTitle()}</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {department === "Management" || department === "Front Office" || department === "Housekeeping" ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +5% from previous period
              </p>
            </CardContent>
          </Card>
        ) : null}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {department === "Management" ? "Total Revenue" : `${department} Revenue`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              +12% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {department === "Spa & Wellness" ? "Spa Bookings" : 
               department === "Food & Beverage" ? "Restaurant Bookings" : "Total Bookings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department === "Spa & Wellness" ? "1,245" : 
              department === "Food & Beverage" ? "3,042" : "4,287"}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              +8% from previous period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={department === "Spa & Wellness" ? "revenue" : 
             department === "Food & Beverage" ? "revenue" : "occupancy"} className="w-full">
        <TabsList className="mb-4">
          {(department === "Management" || department === "Front Office" || department === "Housekeeping") && (
            <TabsTrigger value="occupancy">Occupancy Rate</TabsTrigger>
          )}
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          {department === "Management" && (
            <TabsTrigger value="bookingSource">Booking Sources</TabsTrigger>
          )}
        </TabsList>
        
        {(department === "Management" || department === "Front Office" || department === "Housekeeping") && (
          <TabsContent value="occupancy" className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Occupancy Rate</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter size={14} />
                <span>Filter</span>
              </Button>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => [`${value}%`, "Occupancy"]} />
                  <Legend />
                  <Bar dataKey="occupancy" fill="#8884d8" name="Occupancy Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="revenue" className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {department === "Management" ? "Revenue Analysis" : `${department} Revenue Analysis`}
            </h2>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter size={14} />
              <span>Filter</span>
            </Button>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getDepartmentRevenueData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => [formatCurrency(value), "Revenue"]} />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Monthly Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        {department === "Management" && (
          <TabsContent value="bookingSource" className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Booking Sources</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter size={14} />
                <span>Filter</span>
              </Button>
            </div>
            <div className="h-[400px] flex justify-center">
              <ResponsiveContainer width="70%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ReportsContent;

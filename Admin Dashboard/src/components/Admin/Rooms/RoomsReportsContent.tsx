
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Download, 
  Filter, 
  Printer,
  FileText,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RoomsReportsContent = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  
  // Mock data for room charts
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
    { name: "Jan", revenue: 48000 },
    { name: "Feb", revenue: 42000 },
    { name: "Mar", revenue: 55000 },
    { name: "Apr", revenue: 57000 },
    { name: "May", revenue: 45000 },
    { name: "Jun", revenue: 44000 },
    { name: "Jul", revenue: 58000 },
    { name: "Aug", revenue: 72000 },
    { name: "Sep", revenue: 65000 },
    { name: "Oct", revenue: 52000 },
    { name: "Nov", revenue: 56000 },
    { name: "Dec", revenue: 78000 }
  ];
  
  const roomTypeData = [
    { name: "Standard", value: 30 },
    { name: "Deluxe", value: 35 },
    { name: "Suite", value: 20 },
    { name: "Family", value: 10 },
    { name: "Presidential", value: 5 }
  ];
  
  const bookingSourceData = [
    { name: "Website", value: 45 },
    { name: "OTAs", value: 30 },
    { name: "Phone", value: 15 },
    { name: "Walk-in", value: 5 },
    { name: "Travel Agents", value: 5 }
  ];
  
  // Mock data for top rooms table
  const topRoomsData = [
    { id: 1, name: "Deluxe Ocean View", bookings: 156, revenue: 85400, occupancyRate: 92 },
    { id: 2, name: "Premium Suite", bookings: 124, revenue: 98500, occupancyRate: 88 },
    { id: 3, name: "Family Room", bookings: 98, revenue: 65300, occupancyRate: 82 },
    { id: 4, name: "Standard King", bookings: 145, revenue: 54200, occupancyRate: 78 },
    { id: 5, name: "Presidential Suite", bookings: 36, revenue: 124000, occupancyRate: 75 },
  ];
  
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];
  
  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };
  
  // Calculate annual totals
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = 1246; // Mock total number of bookings
  const avgOccupancy = occupancyData.reduce((sum, item) => sum + item.occupancy, 0) / occupancyData.length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Room Analytics Dashboard</h2>
          <p className="text-gray-500">Track bookings, revenue, and occupancy metrics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangePicker 
            value={dateRange} 
            onValueChange={setDateRange}
          />
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Time Range" />
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
          
          <Button variant="outline" className="flex items-center gap-2">
            <Printer size={16} />
            <span>Print</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-500">Room Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              +8% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOccupancy.toFixed(1)}%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              +5% from previous period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="occupancy" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="occupancy" className="flex items-center gap-2">
            <BarChartIcon size={16} />
            <span>Occupancy Rate</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <BarChartIcon size={16} />
            <span>Revenue Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="roomTypes" className="flex items-center gap-2">
            <PieChartIcon size={16} />
            <span>Room Types</span>
          </TabsTrigger>
          <TabsTrigger value="bookingSource" className="flex items-center gap-2">
            <PieChartIcon size={16} />
            <span>Booking Sources</span>
          </TabsTrigger>
          <TabsTrigger value="topRooms" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Top Rooms</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="occupancy" className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Monthly Occupancy Rate</h2>
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
        
        <TabsContent value="revenue" className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Monthly Revenue</h2>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter size={14} />
              <span>Filter</span>
            </Button>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        
        <TabsContent value="roomTypes" className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bookings by Room Type</h2>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter size={14} />
              <span>Filter</span>
            </Button>
          </div>
          <div className="h-[400px] flex justify-center">
            <ResponsiveContainer width="70%" height="100%">
              <PieChart>
                <Pie
                  data={roomTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roomTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="bookingSource" className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bookings by Source</h2>
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
        
        <TabsContent value="topRooms" className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Performing Rooms</h2>
            <div className="flex gap-2">
              <Select defaultValue="all" onValueChange={setRoomTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Room Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Room Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="presidential">Presidential</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download size={14} />
                <span>Export</span>
              </Button>
            </div>
          </div>
          
          <Table>
            <TableCaption>Top performing rooms based on revenue and occupancy</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Occupancy Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topRoomsData.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.bookings}</TableCell>
                  <TableCell>${room.revenue.toLocaleString()}</TableCell>
                  <TableCell>{room.occupancyRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomsReportsContent;

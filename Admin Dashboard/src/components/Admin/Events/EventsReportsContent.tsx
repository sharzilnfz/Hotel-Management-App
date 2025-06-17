import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Download, Calendar, Filter, ChartBar, ChartPie, FileText, Printer } from "lucide-react";

const EventsReportsContent = () => {
  const [period, setPeriod] = useState("month");
  const [eventType, setEventType] = useState("all");

  // Mock data for charts
  const attendanceData = [
    { name: "Summer Jazz Night", value: 45, fill: "#3b82f6" },
    { name: "Wine Tasting Gala", value: 50, fill: "#10b981" },
    { name: "Cooking Masterclass", value: 25, fill: "#f59e0b" },
    { name: "Weekend Wellness Retreat", value: 20, fill: "#6366f1" },
    { name: "Spring Charity Gala", value: 150, fill: "#ec4899" },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 25000 },
    { month: "May", revenue: 22000 },
    { month: "Jun", revenue: 30000 },
    { month: "Jul", revenue: 28000 },
    { month: "Aug", revenue: 32000 },
    { month: "Sep", revenue: 35000 },
    { month: "Oct", revenue: 31000 },
    { month: "Nov", revenue: 34000 },
    { month: "Dec", revenue: 40000 },
  ];

  const categoryData = [
    { name: "Music", count: 8 },
    { name: "Food & Wine", count: 12 },
    { name: "Wellness", count: 15 },
    { name: "Charity", count: 5 },
    { name: "Workshops", count: 10 },
  ];

  // Most popular events
  const popularEvents = [
    { id: "e1", name: "Spring Charity Gala", attendance: 150, revenue: 30000, rating: 4.8 },
    { id: "e2", name: "Wine Tasting Gala", attendance: 70, revenue: 8400, rating: 4.7 },
    { id: "e3", name: "Summer Jazz Night", attendance: 95, revenue: 7125, rating: 4.6 },
    { id: "e4", name: "Cooking Masterclass", attendance: 28, revenue: 4200, rating: 4.9 },
    { id: "e5", name: "Weekend Wellness Retreat", attendance: 48, revenue: 14352, rating: 4.5 },
  ];

  // Recent events
  const recentEvents = [
    { id: "e1", name: "Summer Jazz Night", date: "2025-04-15", attendance: 45, revenue: 3375, status: "completed" },
    { id: "e2", name: "Wine Tasting Gala", date: "2025-04-20", attendance: 50, revenue: 6000, status: "completed" },
    { id: "e3", name: "Cooking Masterclass", date: "2025-04-25", attendance: 25, revenue: 3750, status: "upcoming" },
    { id: "e4", name: "Weekend Wellness Retreat", date: "2025-05-01", attendance: 20, revenue: 5980, status: "upcoming" },
    { id: "e5", name: "Spring Charity Gala", date: "2025-05-10", attendance: 0, revenue: 0, status: "upcoming" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-purple-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChartBar className="h-5 w-5 text-hotel-primary" />
          <h2 className="text-xl font-semibold">Event Performance Analytics</h2>
        </div>
        <div>
          <Button className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print Report
          </Button>
          <Button className="ml-2">
            <Download className="mr-2 h-4 w-4" /> Export Reports
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Time Period:</span>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span>Event Type:</span>
        </div>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="food">Food & Wine</SelectItem>
            <SelectItem value="wellness">Wellness</SelectItem>
            <SelectItem value="charity">Charity</SelectItem>
            <SelectItem value="workshops">Workshops</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$64,125</div>
            <p className="text-sm text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">290</div>
            <p className="text-sm text-green-600">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.7/5.0</div>
            <p className="text-sm text-green-600">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Popular Events</CardTitle>
              <FileText className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popularEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.attendance}</TableCell>
                        <TableCell>${event.revenue.toLocaleString()}</TableCell>
                        <TableCell>{event.rating} / 5.0</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Attendance</CardTitle>
              <ChartPie className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={(entry) => entry.name}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Monthly Revenue</CardTitle>
              <ChartBar className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Events</CardTitle>
              <FileText className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.attendance}</TableCell>
                        <TableCell>${event.revenue.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsReportsContent;

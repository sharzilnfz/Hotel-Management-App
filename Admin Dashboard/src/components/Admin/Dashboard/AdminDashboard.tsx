
import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Bed, 
  Heart, 
  Ticket, 
  Utensils 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Mock data for demonstration
  const stats = {
    all: {
      totalRevenue: 143250,
      bookingsToday: 28,
      activeGuests: 76,
      availableRooms: 45
    },
    rooms: {
      availableRooms: 45,
      bookedRooms: 55,
      maintenanceRooms: 5,
      upcomingCheckins: 12,
      upcomingCheckouts: 8,
      currentGuests: 32,
      revenue: 78500
    },
    spa: {
      totalAppointments: 42,
      todayAppointments: 8,
      availableSlots: 24,
      revenue: 24750
    },
    events: {
      upcomingEvents: 5,
      ticketsSold: 178,
      revenue: 17800
    },
    restaurant: {
      ordersToday: 64,
      activeReservations: 12,
      revenue: 22200
    }
  };

  const recentBookings = [
    { id: "BK-7834", type: "Room", item: "Deluxe King", customer: "John Smith", date: "2023-04-08", amount: 245 },
    { id: "BK-7835", type: "Spa", item: "Swedish Massage", customer: "Maria Garcia", date: "2023-04-08", amount: 120 },
    { id: "BK-7836", type: "Event", item: "Wine Tasting", customer: "Robert Johnson", date: "2023-04-09", amount: 85 },
    { id: "BK-7837", type: "Room", item: "Executive Suite", customer: "Emily Wong", date: "2023-04-10", amount: 520 },
    { id: "BK-7838", type: "Restaurant", item: "Table Reservation", customer: "Daniel Brown", date: "2023-04-08", amount: 175 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Quick Filter:</span>
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            <option value="all">All Departments</option>
            <option value="rooms">Rooms</option>
            <option value="spa">Spa</option>
            <option value="events">Events</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.all.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Bookings Today</p>
                <p className="text-2xl font-bold">{stats.all.bookingsToday}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>8% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Active Guests</p>
                <p className="text-2xl font-bold">{stats.all.activeGuests}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-amber-600">
              <span>Current occupancy: 63%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Available Rooms</p>
                <p className="text-2xl font-bold">{stats.all.availableRooms}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Bed className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <span>45% rooms available</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Revenue by department for the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-end gap-8 mt-4 px-2">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-blue-500 w-16 rounded-t" style={{height: `${stats.rooms.revenue / 1000}px`}}></div>
                <div className="flex items-center gap-1">
                  <Bed size={16} />
                  <span className="text-sm">Rooms</span>
                </div>
                <span className="text-sm font-medium">${stats.rooms.revenue.toLocaleString()}</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="bg-pink-500 w-16 rounded-t" style={{height: `${stats.spa.revenue / 1000}px`}}></div>
                <div className="flex items-center gap-1">
                  <Heart size={16} />
                  <span className="text-sm">Spa</span>
                </div>
                <span className="text-sm font-medium">${stats.spa.revenue.toLocaleString()}</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="bg-amber-500 w-16 rounded-t" style={{height: `${stats.events.revenue / 1000}px`}}></div>
                <div className="flex items-center gap-1">
                  <Ticket size={16} />
                  <span className="text-sm">Events</span>
                </div>
                <span className="text-sm font-medium">${stats.events.revenue.toLocaleString()}</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="bg-green-500 w-16 rounded-t" style={{height: `${stats.restaurant.revenue / 1000}px`}}></div>
                <div className="flex items-center gap-1">
                  <Utensils size={16} />
                  <span className="text-sm">Restaurant</span>
                </div>
                <span className="text-sm font-medium">${stats.restaurant.revenue.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Department Stats</CardTitle>
            <CardDescription>Key metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="rooms">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="rooms"><Bed size={16} /></TabsTrigger>
                <TabsTrigger value="spa"><Heart size={16} /></TabsTrigger>
                <TabsTrigger value="events"><Ticket size={16} /></TabsTrigger>
                <TabsTrigger value="restaurant"><Utensils size={16} /></TabsTrigger>
              </TabsList>
              
              <TabsContent value="rooms" className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Available:</span>
                  <span className="font-medium">{stats.rooms.availableRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Booked:</span>
                  <span className="font-medium">{stats.rooms.bookedRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maintenance:</span>
                  <span className="font-medium">{stats.rooms.maintenanceRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Upcoming Check-ins:</span>
                  <span className="font-medium">{stats.rooms.upcomingCheckins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Upcoming Check-outs:</span>
                  <span className="font-medium">{stats.rooms.upcomingCheckouts}</span>
                </div>
              </TabsContent>
              
              <TabsContent value="spa" className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Appointments:</span>
                  <span className="font-medium">{stats.spa.totalAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Today's Appointments:</span>
                  <span className="font-medium">{stats.spa.todayAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Available Slots:</span>
                  <span className="font-medium">{stats.spa.availableSlots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue:</span>
                  <span className="font-medium">${stats.spa.revenue.toLocaleString()}</span>
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Upcoming Events:</span>
                  <span className="font-medium">{stats.events.upcomingEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tickets Sold:</span>
                  <span className="font-medium">{stats.events.ticketsSold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue:</span>
                  <span className="font-medium">${stats.events.revenue.toLocaleString()}</span>
                </div>
              </TabsContent>
              
              <TabsContent value="restaurant" className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Orders Today:</span>
                  <span className="font-medium">{stats.restaurant.ordersToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Reservations:</span>
                  <span className="font-medium">{stats.restaurant.activeReservations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue:</span>
                  <span className="font-medium">${stats.restaurant.revenue.toLocaleString()}</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest bookings across all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.type}</TableCell>
                  <TableCell>{booking.item}</TableCell>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>${booking.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Calendar as CalendarIcon, Check, X, Clock, RotateCcw, Globe, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SpaBooking {
  id: string;
  clientName: string;
  service: string;
  specialist: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  isRefundable: boolean;
  refundPolicy: string;
  email: string;
  phone: string;
  source: "website" | "app";
}

const SpaBookingsContent = () => {
  const [bookings, setBookings] = useState<SpaBooking[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<SpaBooking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    const mockBookings: SpaBooking[] = [
      { 
        id: "b1", 
        clientName: "Sarah Johnson", 
        service: "Swedish Massage", 
        specialist: "Emma Thompson", 
        date: "2025-04-09", 
        time: "10:00 AM", 
        duration: 60, 
        status: "confirmed",
        isRefundable: true,
        refundPolicy: "Full refund if cancelled 24 hours before appointment. 50% refund if cancelled 12 hours before appointment.",
        email: "sarah.johnson@example.com",
        phone: "+1-555-123-4567",
        source: "website"
      },
      { 
        id: "b2", 
        clientName: "Michael Brown", 
        service: "Deep Tissue Massage", 
        specialist: "David Wilson", 
        date: "2025-04-09", 
        time: "11:30 AM", 
        duration: 90, 
        status: "completed",
        isRefundable: false,
        refundPolicy: "Non-refundable for premium services.",
        email: "michael.brown@example.com",
        phone: "+1-555-987-6543",
        source: "app"
      },
      { 
        id: "b3", 
        clientName: "Jennifer Davis", 
        service: "Hot Stone Therapy", 
        specialist: "Emma Thompson", 
        date: "2025-04-09", 
        time: "2:00 PM", 
        duration: 90, 
        status: "confirmed",
        isRefundable: true,
        refundPolicy: "Full refund if cancelled 24 hours before appointment.",
        email: "jennifer.davis@example.com",
        phone: "+1-555-234-5678",
        source: "website"
      },
      { 
        id: "b4", 
        clientName: "Robert Miller", 
        service: "Aromatherapy Facial", 
        specialist: "Lisa Anderson", 
        date: "2025-04-10", 
        time: "9:30 AM", 
        duration: 45, 
        status: "pending",
        isRefundable: true,
        refundPolicy: "Full refund if cancelled 24 hours before appointment.",
        email: "robert.miller@example.com",
        phone: "+1-555-345-6789",
        source: "app"
      },
      { 
        id: "b5", 
        clientName: "Elizabeth Wilson", 
        service: "Deluxe Spa Package", 
        specialist: "David Wilson", 
        date: "2025-04-10", 
        time: "1:00 PM", 
        duration: 120, 
        status: "cancelled",
        isRefundable: false,
        refundPolicy: "Deluxe packages are non-refundable once confirmed.",
        email: "elizabeth.wilson@example.com",
        phone: "+1-555-456-7890",
        source: "website"
      },
      { 
        id: "b6", 
        clientName: "James Taylor", 
        service: "Swedish Massage", 
        specialist: "Emma Thompson", 
        date: "2025-04-11", 
        time: "3:30 PM", 
        duration: 60, 
        status: "confirmed",
        isRefundable: true,
        refundPolicy: "Full refund if cancelled 24 hours before appointment.",
        email: "james.taylor@example.com",
        phone: "+1-555-567-8901",
        source: "app"
      },
      { 
        id: "b7", 
        clientName: "Patricia Moore", 
        service: "Deep Tissue Massage", 
        specialist: "Lisa Anderson", 
        date: "2025-04-11", 
        time: "11:00 AM", 
        duration: 90, 
        status: "pending",
        isRefundable: true,
        refundPolicy: "Full refund if cancelled 24 hours before appointment. 50% refund if cancelled 12 hours before appointment.",
        email: "patricia.moore@example.com",
        phone: "+1-555-678-9012",
        source: "website"
      },
      { 
        id: "b8", 
        clientName: "John Anderson", 
        service: "Hot Stone Therapy", 
        specialist: "David Wilson", 
        date: "2025-04-12", 
        time: "10:00 AM", 
        duration: 90, 
        status: "confirmed",
        isRefundable: true,
        refundPolicy: "Full refund if cancelled 24 hours before appointment.",
        email: "john.anderson@example.com",
        phone: "+1-555-789-0123",
        source: "app"
      },
    ];
    setBookings(mockBookings);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filter !== "all" && booking.status !== filter) return false;
    if (date && booking.date !== format(date, "yyyy-MM-dd")) return false;
    if (searchQuery && !booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.service.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.specialist.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleRefundRequest = (booking: SpaBooking) => {
    setSelectedBooking(booking);
    setShowRefundDialog(true);
  };

  const handleProcessRefund = () => {
    if (selectedBooking) {
      toast.success(`Refund request for booking ${selectedBooking.id} has been initiated`);
      setShowRefundDialog(false);
    }
  };

  const handleViewDetails = (booking: SpaBooking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const getSourceIcon = (source: "website" | "app") => {
    if (source === "website") {
      return <Globe className="h-4 w-4 text-blue-500" />;
    } else if (source === "app") {
      return <Smartphone className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData.role === "Administrator" || userData.accessLevel === "Full Access";
    }
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Spa Bookings</h1>
        <Button>
          New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by client, service, or specialist..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Specialist</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refundable</TableHead>
                    {isSuperAdmin && <TableHead>Source</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.clientName}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.specialist}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{booking.duration} min</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          {booking.isRefundable ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                        {isSuperAdmin && (
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {getSourceIcon(booking.source)}
                              <span className="text-xs capitalize">{booking.source}</span>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(booking)}>View</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                          {isSuperAdmin && booking.status !== "cancelled" && booking.isRefundable && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => handleRefundRequest(booking)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" /> Refund
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isSuperAdmin ? 9 : 8} className="text-center py-4">
                        No bookings found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Today's Overview</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>8 bookings scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>3 completed</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span>1 cancelled</span>
              </div>
              <Button className="w-full mt-4" variant="outline">View Full Schedule</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              {selectedBooking?.isRefundable 
                ? "Are you sure you want to process a refund for this booking?" 
                : "This booking is marked as non-refundable."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Refund Policy:</h3>
                <p className="text-sm text-gray-700">{selectedBooking.refundPolicy}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Booking ID:</p>
                  <p className="text-sm">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Client:</p>
                  <p className="text-sm">{selectedBooking.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Service:</p>
                  <p className="text-sm">{selectedBooking.service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact:</p>
                  <p className="text-sm">{selectedBooking.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>Cancel</Button>
            <Button 
              disabled={selectedBooking && !selectedBooking.isRefundable} 
              onClick={handleProcessRefund}
            >
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about the booking
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Booking Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Booking ID:</span>
                      <span className="text-sm">{selectedBooking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="text-sm">{getStatusBadge(selectedBooking.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="text-sm">{selectedBooking.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Time:</span>
                      <span className="text-sm">{selectedBooking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Service:</span>
                      <span className="text-sm">{selectedBooking.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Specialist:</span>
                      <span className="text-sm">{selectedBooking.specialist}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Duration:</span>
                      <span className="text-sm">{selectedBooking.duration} min</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Client Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">{selectedBooking.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm">{selectedBooking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="text-sm">{selectedBooking.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Refund Policy</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Refundable:</span>
                    <Switch checked={selectedBooking.isRefundable} id="refundable-toggle" disabled />
                  </div>
                </div>
                <p className="text-sm p-3 bg-gray-50 rounded-md">{selectedBooking.refundPolicy}</p>
              </div>
              
              {isSuperAdmin && selectedBooking.status !== "cancelled" && selectedBooking.isRefundable && (
                <div className="flex justify-end">
                  <Button onClick={() => {
                    setShowDetailsDialog(false);
                    setTimeout(() => handleRefundRequest(selectedBooking), 100);
                  }}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Process Refund
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpaBookingsContent;

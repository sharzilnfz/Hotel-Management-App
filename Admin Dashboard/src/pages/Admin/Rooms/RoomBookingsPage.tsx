import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Globe,
  Smartphone
} from "lucide-react";

const RoomBookingsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Mock data for bookings
  const bookings = [
    {
      id: "BK001",
      guestName: "John Smith",
      roomName: "Classic Room",
      checkIn: new Date("2025-04-12"),
      checkOut: new Date("2025-04-15"),
      totalAmount: 597,
      status: "confirmed",
      guests: 2,
      specialRequests: "High floor if possible",
      isRefundable: true,
      refundPolicy: "Full refund if cancelled up to 48 hours before check-in. 50% refund if cancelled up to 24 hours before check-in.",
      email: "john.smith@example.com",
      phone: "+1-555-123-4567",
      source: "website"
    },
    {
      id: "BK002",
      guestName: "Sarah Johnson",
      roomName: "Deluxe Suite",
      checkIn: new Date("2025-04-15"),
      checkOut: new Date("2025-04-20"),
      totalAmount: 1745,
      status: "confirmed",
      guests: 3,
      specialRequests: "Early check-in requested",
      isRefundable: true,
      refundPolicy: "Full refund if cancelled up to 72 hours before check-in. No refund after that.",
      email: "sarah.johnson@example.com",
      phone: "+1-555-987-6543",
      source: "app"
    },
    {
      id: "BK003",
      guestName: "Michael Davis",
      roomName: "Presidential Suite",
      checkIn: new Date("2025-04-20"),
      checkOut: new Date("2025-04-25"),
      totalAmount: 2995,
      status: "pending",
      guests: 2,
      specialRequests: "",
      isRefundable: false,
      refundPolicy: "This is a non-refundable booking. No refunds will be provided for cancellations.",
      email: "michael.davis@example.com",
      phone: "+1-555-456-7890",
      source: "website"
    },
    {
      id: "BK004",
      guestName: "Emma Wilson",
      roomName: "Family Room",
      checkIn: new Date("2025-04-20"),
      checkOut: new Date("2025-04-23"),
      totalAmount: 897,
      status: "cancelled",
      guests: 4,
      specialRequests: "Baby crib needed",
      isRefundable: true,
      refundPolicy: "Full refund if cancelled up to 48 hours before check-in. 50% refund if cancelled up to 24 hours before check-in.",
      email: "emma.wilson@example.com",
      phone: "+1-555-789-0123",
      source: "app"
    }
  ];

  // Filter bookings based on search query, date range, and status
  const filteredBookings = bookings.filter(booking => {
    // Filter by search query
    const matchesSearch = booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           booking.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by date range
    const matchesDateRange = !dateRange?.from || !dateRange?.to || 
                           (booking.checkIn >= dateRange.from && booking.checkOut <= (dateRange.to || dateRange.from));
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesDateRange && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRefundRequest = (booking) => {
    setSelectedBooking(booking);
    setShowRefundDialog(true);
  };

  const handleProcessRefund = () => {
    toast.success(`Refund request for booking ${selectedBooking?.id} has been initiated`);
    setShowRefundDialog(false);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const getSourceIcon = (source) => {
    if (source === "website") {
      return <Globe className="h-4 w-4 text-blue-500" />;
    } else if (source === "app") {
      return <Smartphone className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  // Check if user is super admin (for simplicity, just checking if we have access to the refund page)
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData.role === "Administrator" || userData.accessLevel === "Full Access";
    }
    return false;
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">Room Bookings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="date-range">Date Range</Label>
            <DateRangePicker 
              value={dateRange} 
              onValueChange={setDateRange} 
              className="w-full" 
            />
          </div>
          
          <div className="flex-1">
            <Label htmlFor="status">Booking Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="search"
                placeholder="Search by guest name or room..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div>
            <span className="text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </span>
          </div>
        </div>
        
        <Table>
          <TableCaption>List of room bookings</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Amount</TableHead>
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
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{booking.roomName}</TableCell>
                  <TableCell>{format(booking.checkIn, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(booking.checkOut, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>${booking.totalAmount}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {booking.isRefundable ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
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
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 11 : 10} className="text-center py-8 text-gray-500">
                  No bookings found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                  <p className="text-sm font-medium">Guest:</p>
                  <p className="text-sm">{selectedBooking.guestName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount:</p>
                  <p className="text-sm">${selectedBooking.totalAmount}</p>
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedBooking.status)}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Check-in:</span>
                      <span className="text-sm">{format(selectedBooking.checkIn, "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Check-out:</span>
                      <span className="text-sm">{format(selectedBooking.checkOut, "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Room:</span>
                      <span className="text-sm">{selectedBooking.roomName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Guests:</span>
                      <span className="text-sm">{selectedBooking.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-sm">${selectedBooking.totalAmount}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Guest Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">{selectedBooking.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm">{selectedBooking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="text-sm">{selectedBooking.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">Special Requests:</span>
                      <span className="text-sm text-right">{selectedBooking.specialRequests || "None"}</span>
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

export default RoomBookingsPage;

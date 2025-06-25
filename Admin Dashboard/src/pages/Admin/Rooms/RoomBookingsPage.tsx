import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { bookingService } from '@/services/bookingService';
import { format } from 'date-fns';
import {
  CheckCircle,
  Edit,
  Eye,
  Filter,
  Globe,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Smartphone,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

interface BackendBooking {
  _id: string;
  bookingId: string;
  roomName?: string;
  roomId?: {
    name: string;
  };
  primaryGuest?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  guestDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  primaryGuestFullName?: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount?: number;
  totalPrice?: number;
  status: string;
  numberOfGuests?: number;
  totalGuests?: number;
  specialRequests?: string;
  isRefundable: boolean;
  refundPolicy?: string;
  cancellationPolicy?: string;
  source: string;
}

const RoomBookingsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch bookings from API
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        dateRange: dateRange?.from && dateRange?.to ? dateRange : undefined,
        search: searchQuery.trim() || undefined,
      };
      const response = await bookingService.getAllBookings(filters);

      // Handle the nested response structure
      let bookingsData = [];
      if (response.success && response.data && response.data.bookings) {
        bookingsData = response.data.bookings;
      } else if (response.data) {
        bookingsData = response.data;
      } else if (Array.isArray(response)) {
        bookingsData = response;
      } else {
        bookingsData = [];
      }

      console.log('Processed bookings data:', bookingsData);
      setBookings(bookingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateRange, searchQuery]);

  // Load bookings on component mount and when filters change
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); // Transform backend data to match component expectations
  const transformBooking = (booking: BackendBooking) => ({
    id: booking.bookingId || booking._id,
    guestName:
      booking.primaryGuestFullName ||
      `${
        booking.primaryGuest?.firstName || booking.guestDetails?.firstName || ''
      } ${
        booking.primaryGuest?.lastName || booking.guestDetails?.lastName || ''
      }`.trim() ||
      'Unknown Guest',
    roomName: booking.roomName || booking.roomId?.name || 'Unknown Room',
    checkIn: new Date(booking.checkInDate),
    checkOut: new Date(booking.checkOutDate),
    totalAmount: booking.totalAmount || booking.totalPrice || 0,
    status: booking.status?.toLowerCase() || 'pending',
    guests: booking.numberOfGuests || booking.totalGuests || 1,
    specialRequests: booking.specialRequests || '',
    isRefundable: booking.isRefundable !== false,
    refundPolicy:
      booking.refundPolicy ||
      booking.cancellationPolicy ||
      'Standard refund policy applies.',
    email:
      booking.primaryGuest?.email ||
      booking.guestDetails?.email ||
      'No email provided',
    phone:
      booking.primaryGuest?.phone ||
      booking.guestDetails?.phone ||
      'No phone provided',
    source: booking.source || 'website',
    // Include original booking data for detailed operations
    originalData: booking,
  });

  // Filter bookings based on search query (if not handled by backend)
  const filteredBookings = bookings.map(transformBooking).filter((booking) => {
    if (!searchQuery.trim()) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      booking.guestName.toLowerCase().includes(searchLower) ||
      booking.roomName.toLowerCase().includes(searchLower) ||
      booking.id.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleRefundRequest = (booking) => {
    setSelectedBooking(booking);
    setShowRefundDialog(true);
  };

  const handleProcessRefund = async () => {
    if (!selectedBooking?.originalData?._id) {
      toast.error('Invalid booking data');
      return;
    }

    try {
      // Cancel the booking via API
      await bookingService.cancelBooking(
        selectedBooking.originalData._id,
        'Refund requested by admin'
      );

      toast.success(
        `Refund request for booking ${selectedBooking?.id} has been initiated`
      );
      setShowRefundDialog(false);

      // Refresh bookings
      fetchBookings();
    } catch (err) {
      toast.error('Failed to process refund');
      console.error('Refund error:', err);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const getSourceIcon = (source) => {
    if (source === 'website') {
      return <Globe className="h-4 w-4 text-blue-500" />;
    } else if (source === 'app') {
      return <Smartphone className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  // Check if user is super admin (for simplicity, just checking if we have access to the refund page)
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    const userDataString = localStorage.getItem('currentUser');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return (
        userData.role === 'Administrator' ||
        userData.accessLevel === 'Full Access'
      );
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
        </div>{' '}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBookings}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
          <div>
            <span className="text-sm text-gray-500">
              {loading
                ? 'Loading...'
                : `Showing ${filteredBookings.length} of ${bookings.length} bookings`}
            </span>
          </div>
        </div>{' '}
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin ? 11 : 10}
                  className="text-center py-8"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin ? 11 : 10}
                  className="text-center py-8 text-red-500"
                >
                  Error: {error}
                  <br />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchBookings}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </TableCell>
              </TableRow>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{booking.roomName}</TableCell>
                  <TableCell>
                    {format(booking.checkIn, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(booking.checkOut, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>${booking.totalAmount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
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
                        <span className="text-xs capitalize">
                          {booking.source}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {isSuperAdmin &&
                        booking.status !== 'cancelled' &&
                        booking.isRefundable && (
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
                <TableCell
                  colSpan={isSuperAdmin ? 11 : 10}
                  className="text-center py-8 text-gray-500"
                >
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
                ? 'Are you sure you want to process a refund for this booking?'
                : 'This booking is marked as non-refundable.'}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Refund Policy:</h3>
                <p className="text-sm text-gray-700">
                  {selectedBooking.refundPolicy}
                </p>
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
            <Button
              variant="outline"
              onClick={() => setShowRefundDialog(false)}
            >
              Cancel
            </Button>
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
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Booking Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Booking ID:</span>
                      <span className="text-sm">{selectedBooking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          selectedBooking.status
                        )}`}
                      >
                        {selectedBooking.status.charAt(0).toUpperCase() +
                          selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Check-in:</span>
                      <span className="text-sm">
                        {format(selectedBooking.checkIn, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Check-out:</span>
                      <span className="text-sm">
                        {format(selectedBooking.checkOut, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Room:</span>
                      <span className="text-sm">
                        {selectedBooking.roomName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Guests:</span>
                      <span className="text-sm">{selectedBooking.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-sm">
                        ${selectedBooking.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Guest Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">
                        {selectedBooking.guestName}
                      </span>
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
                      <span className="text-sm font-medium">
                        Special Requests:
                      </span>
                      <span className="text-sm text-right">
                        {selectedBooking.specialRequests || 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Refund Policy
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Refundable:</span>
                    <Switch
                      checked={selectedBooking.isRefundable}
                      id="refundable-toggle"
                      disabled
                    />
                  </div>
                </div>
                <p className="text-sm p-3 bg-gray-50 rounded-md">
                  {selectedBooking.refundPolicy}
                </p>
              </div>

              {isSuperAdmin &&
                selectedBooking.status !== 'cancelled' &&
                selectedBooking.isRefundable && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        setShowDetailsDialog(false);
                        setTimeout(
                          () => handleRefundRequest(selectedBooking),
                          100
                        );
                      }}
                    >
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

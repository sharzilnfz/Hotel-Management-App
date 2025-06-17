import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar as CalendarIcon, Filter, RotateCcw, Globe, Smartphone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface EventBooking {
  id: string;
  eventId: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  attendees: number;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed";
  bookingStatus: "confirmed" | "cancelled" | "attended" | "no-show";
  refundPolicy: {
    isRefundable: boolean;
    daysBeforeEvent: number;
    refundPercentage: number;
  };
  source: "website" | "app";
}

const EventsBookingsContent = () => {
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<EventBooking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showRefundPolicyDialog, setShowRefundPolicyDialog] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const refundPolicyForm = useForm({
    defaultValues: {
      isRefundable: false,
      daysBeforeEvent: 2,
      refundPercentage: 100
    }
  });

  useEffect(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setIsSuperAdmin(userData.role === "Administrator" || userData.accessLevel === "Full Access");
    }

    const mockBookings: EventBooking[] = [
      {
        id: "b1",
        eventId: "e1",
        eventName: "Summer Jazz Night",
        customerName: "John Smith",
        customerEmail: "john.smith@example.com",
        customerPhone: "+1-555-123-4567",
        bookingDate: "2025-04-02",
        attendees: 2,
        totalAmount: 150,
        paymentStatus: "paid",
        bookingStatus: "confirmed",
        refundPolicy: {
          isRefundable: true,
          daysBeforeEvent: 2,
          refundPercentage: 100
        },
        source: "website"
      },
      {
        id: "b2",
        eventId: "e2",
        eventName: "Wine Tasting Gala",
        customerEmail: "emily.johnson@example.com",
        customerName: "Emily Johnson",
        customerPhone: "+1-555-234-5678",
        bookingDate: "2025-04-05",
        attendees: 4,
        totalAmount: 480,
        paymentStatus: "paid",
        bookingStatus: "confirmed",
        refundPolicy: {
          isRefundable: false,
          daysBeforeEvent: 0,
          refundPercentage: 0
        },
        source: "app"
      },
      {
        id: "b3",
        eventId: "e3",
        eventName: "Cooking Masterclass",
        customerName: "Michael Brown",
        customerEmail: "michael.brown@example.com",
        customerPhone: "+1-555-345-6789",
        bookingDate: "2025-04-10",
        attendees: 1,
        totalAmount: 150,
        paymentStatus: "paid",
        bookingStatus: "confirmed",
        refundPolicy: {
          isRefundable: true,
          daysBeforeEvent: 3,
          refundPercentage: 75
        },
        source: "website"
      },
      {
        id: "b4",
        eventId: "e4",
        eventName: "Weekend Wellness Retreat",
        customerName: "Jessica Davis",
        customerEmail: "jessica.davis@example.com",
        customerPhone: "+1-555-456-7890",
        bookingDate: "2025-04-15",
        attendees: 2,
        totalAmount: 598,
        paymentStatus: "pending",
        bookingStatus: "confirmed",
        refundPolicy: {
          isRefundable: false,
          daysBeforeEvent: 0,
          refundPercentage: 0
        },
        source: "app"
      },
      {
        id: "b5",
        eventId: "e1",
        eventName: "Summer Jazz Night",
        customerName: "Robert Wilson",
        customerEmail: "robert.wilson@example.com",
        customerPhone: "+1-555-567-8901",
        bookingDate: "2025-04-18",
        attendees: 3,
        totalAmount: 225,
        paymentStatus: "paid",
        bookingStatus: "cancelled",
        refundPolicy: {
          isRefundable: true,
          daysBeforeEvent: 1,
          refundPercentage: 50
        },
        source: "website"
      }
    ];
    setBookings(mockBookings);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (searchQuery && 
        !booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.eventName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedDate && booking.bookingDate !== format(selectedDate, "yyyy-MM-dd")) {
      return false;
    }
    
    if (selectedStatus !== "all" && booking.bookingStatus !== selectedStatus) {
      return false;
    }
    
    return true;
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "attended":
        return <Badge className="bg-green-500">Attended</Badge>;
      case "no-show":
        return <Badge className="bg-gray-500">No-show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRefundPolicyBadge = (policy: { isRefundable: boolean; daysBeforeEvent: number; refundPercentage: number }) => {
    if (!policy.isRefundable) {
      return <Badge className="bg-gray-500">Non-refundable</Badge>;
    }
    
    return (
      <Badge className="bg-green-500">
        {policy.refundPercentage}% up to {policy.daysBeforeEvent} day{policy.daysBeforeEvent !== 1 ? 's' : ''} before
      </Badge>
    );
  };

  const getSourceIcon = (source: "website" | "app") => {
    if (source === "website") {
      return <Globe className="h-4 w-4 text-blue-500" />;
    } else if (source === "app") {
      return <Smartphone className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    
    const updatedBookings = bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? { ...booking, bookingStatus: "cancelled" as const } 
        : booking
    );
    
    setBookings(updatedBookings);
    toast.success(`Booking for ${selectedBooking.eventName} has been cancelled.`);
    setShowCancelDialog(false);
  };

  const handleUpdateStatus = (booking: EventBooking, newStatus: "confirmed" | "cancelled" | "attended" | "no-show") => {
    const updatedBookings = bookings.map(b => 
      b.id === booking.id 
        ? { ...b, bookingStatus: newStatus } 
        : b
    );
    
    setBookings(updatedBookings);
    toast.success(`Booking status updated to ${newStatus}.`);
  };

  const onSubmitRefundPolicy = (data: { isRefundable: boolean; daysBeforeEvent: number; refundPercentage: number }) => {
    if (!selectedBooking) return;
    
    const updatedBookings = bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? { 
            ...booking, 
            refundPolicy: {
              isRefundable: data.isRefundable,
              daysBeforeEvent: data.daysBeforeEvent,
              refundPercentage: data.refundPercentage
            }
          } 
        : booking
    );
    
    setBookings(updatedBookings);
    toast.success(`Refund policy for ${selectedBooking.customerName}'s booking has been updated.`);
    setShowRefundDialog(false);
  };

  const handleRefundRequest = (booking: EventBooking) => {
    setSelectedBooking(booking);
    setShowRefundDialog(true);
  };

  const handleProcessRefund = () => {
    if (!selectedBooking) return;
    
    toast.success(`Refund for ${selectedBooking.customerName}'s booking has been processed.`);
    
    setShowRefundDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events Bookings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, or event..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="no-show">No-show</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => {
                setSelectedDate(undefined);
                setSelectedStatus("all");
                setSearchQuery("");
              }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refund Policy</TableHead>
                    {isSuperAdmin && <TableHead>Source</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                        </TableCell>
                        <TableCell>{booking.eventName}</TableCell>
                        <TableCell>{booking.bookingDate}</TableCell>
                        <TableCell>{booking.attendees}</TableCell>
                        <TableCell>${booking.totalAmount}</TableCell>
                        <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                        <TableCell>{getBookingStatusBadge(booking.bookingStatus)}</TableCell>
                        <TableCell>
                          {getRefundPolicyBadge(booking.refundPolicy)}
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
                          {booking.bookingStatus !== "cancelled" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCancelDialog(true);
                                }}
                              >
                                Cancel
                              </Button>
                              
                              {booking.bookingStatus === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-50 text-green-600 hover:bg-green-100 ml-2"
                                  onClick={() => handleUpdateStatus(booking, "attended")}
                                >
                                  Mark Attended
                                </Button>
                              )}
                              
                              {booking.bookingStatus === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-gray-50 text-gray-600 hover:bg-gray-100 ml-2"
                                  onClick={() => handleUpdateStatus(booking, "no-show")}
                                >
                                  No-show
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                className="ml-2"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowRefundPolicyDialog(true);
                                }}
                              >
                                Refund Settings
                              </Button>

                              {isSuperAdmin && booking.refundPolicy.isRefundable && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-blue-500 hover:text-blue-700 ml-2"
                                  onClick={() => handleRefundRequest(booking)}
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" /> Refund
                                </Button>
                              )}
                            </>
                          )}
                          
                          {booking.bookingStatus === "cancelled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                              onClick={() => handleUpdateStatus(booking, "confirmed")}
                            >
                              Restore
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isSuperAdmin ? 10 : 9} className="text-center py-4">
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
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Booking Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Booking Statistics</h3>
                <Tabs defaultValue="summary">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="status">By Status</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Bookings:</span>
                        <span className="font-medium">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Bookings:</span>
                        <span className="font-medium">
                          {bookings.filter(b => b.bookingStatus !== "cancelled").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-medium">
                          ${bookings.reduce((sum, b) => sum + (b.bookingStatus !== "cancelled" ? b.totalAmount : 0), 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Attendees:</span>
                        <span className="font-medium">
                          {bookings.reduce((sum, b) => sum + (b.bookingStatus !== "cancelled" ? b.attendees : 0), 0)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="status" className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Confirmed:</span>
                        <span className="font-medium">
                          {bookings.filter(b => b.bookingStatus === "confirmed").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cancelled:</span>
                        <span className="font-medium">
                          {bookings.filter(b => b.bookingStatus === "cancelled").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Attended:</span>
                        <span className="font-medium">
                          {bookings.filter(b => b.bookingStatus === "attended").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>No-show:</span>
                        <span className="font-medium">
                          {bookings.filter(b => b.bookingStatus === "no-show").length}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <p className="mb-4">
                Are you sure you want to cancel the booking for <strong>{selectedBooking.eventName}</strong> made by <strong>{selectedBooking.customerName}</strong>?
              </p>
              
              <div className="bg-amber-50 p-3 rounded-md text-amber-800 text-sm mb-4">
                <p>This will:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Mark the booking as cancelled</li>
                  <li>Free up space for other attendees</li>
                  <li>Potentially trigger a refund process if applicable</li>
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Go Back
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelBooking}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRefundPolicyDialog} onOpenChange={setShowRefundPolicyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Refund Policy Settings</DialogTitle>
            <DialogDescription>
              Configure the refund policy for this booking.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-2">
              <p className="mb-4">
                Configure refund settings for <strong>{selectedBooking.eventName}</strong> booking made by <strong>{selectedBooking.customerName}</strong>.
              </p>
              
              <Form {...refundPolicyForm}>
                <form onSubmit={refundPolicyForm.handleSubmit(onSubmitRefundPolicy)} className="space-y-6">
                  <FormField
                    control={refundPolicyForm.control}
                    name="isRefundable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Refundable</FormLabel>
                          <FormDescription>
                            Allow customers to cancel and receive a refund
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {refundPolicyForm.watch("isRefundable") && (
                    <div className="space-y-4">
                      <FormField
                        control={refundPolicyForm.control}
                        name="daysBeforeEvent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days Before Event</FormLabel>
                            <FormDescription>
                              How many days before the event should cancellations be allowed?
                            </FormDescription>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={30}
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={refundPolicyForm.control}
                        name="refundPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Percentage</FormLabel>
                            <FormDescription>
                              What percentage of the payment will be refunded?
                            </FormDescription>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowRefundPolicyDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              {selectedBooking?.refundPolicy.isRefundable 
                ? "Are you sure you want to process a refund for this booking?" 
                : "This booking is marked as non-refundable."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Refund Policy:</h3>
                <p className="text-sm text-gray-700">
                  {selectedBooking.refundPolicy.isRefundable 
                    ? `${selectedBooking.refundPolicy.refundPercentage}% refund if cancelled up to ${selectedBooking.refundPolicy.daysBeforeEvent} day(s) before the event.`
                    : "This booking is non-refundable."}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Booking ID:</p>
                  <p className="text-sm">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Customer:</p>
                  <p className="text-sm">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount:</p>
                  <p className="text-sm">${selectedBooking.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact:</p>
                  <p className="text-sm">{selectedBooking.customerEmail}</p>
                </div>
                {isSuperAdmin && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Source:</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {getSourceIcon(selectedBooking.source)}
                      <span className="text-sm capitalize">{selectedBooking.source}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>Cancel</Button>
            <Button 
              disabled={selectedBooking && !selectedBooking.refundPolicy.isRefundable} 
              onClick={handleProcessRefund}
            >
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsBookingsContent;

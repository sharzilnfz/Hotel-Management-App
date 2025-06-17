import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Search, Plus, Calendar as CalendarIcon, QrCode, Ticket, Check, X, RotateCcw, AlertCircle, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import EditEventModal from "@/components/Admin/Events/EditEventModal";

// API endpoints
const EVENTS_API_URL = "http://localhost:4000/api/events";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  isRefundable: boolean;
  refundPolicy: string;
  images: string[];
  addons: Array<{
    name: string;
    price: number;
  }>;
  publishWebsite: boolean;
  publishApp: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RefundRequest {
  id: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  requestDate: string;
  amount: number;
  status: "pending" | "approved" | "declined";
  reason: string;
}

const EventsManagementContent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRefundSheet, setShowRefundSheet] = useState(false);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundType, setRefundType] = useState<string>("full");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(EVENTS_API_URL);
      setEvents(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Mock refund requests (keeping this until we have a refund API endpoint)
    const mockRefundRequests: RefundRequest[] = [
      {
        id: "r1",
        eventId: "e1",
        eventTitle: "Summer Jazz Night",
        customerName: "John Smith",
        customerEmail: "john.smith@example.com",
        bookingDate: "2025-04-01",
        requestDate: "2025-04-05",
        amount: 75,
        status: "pending",
        reason: "Unable to attend due to illness"
      },
      {
        id: "r2",
        eventId: "e2",
        eventTitle: "Wine Tasting Gala",
        customerName: "Emily Johnson",
        customerEmail: "emily.johnson@example.com",
        bookingDate: "2025-04-02",
        requestDate: "2025-04-10",
        amount: 120,
        status: "approved",
        reason: "Schedule conflict"
      }
    ];
    setRefundRequests(mockRefundRequests);
  }, []);

  const filteredEvents = events.filter(event => {
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (date) {
      const eventDate = new Date(event.date);
      const selectedDate = date;
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case "ongoing":
        return <Badge className="bg-green-500">Ongoing</Badge>;
      case "completed":
        return <Badge className="bg-purple-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAddEvent = () => {
    navigate('/admin/events/add');
  };

  const handleEditEvent = (event: Event) => {
    setEditingEventId(event._id);
    setShowEditModal(true);
  };

  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData.role === "Administrator" || userData.accessLevel === "Full Access";
    }
    return false;
  });

  const handleRefundRequest = (event: Event) => {
    if (!event.isRefundable) {
      toast.error("This event is not eligible for refunds.");
      return;
    }

    setSelectedEvent(event);
    setRefundAmount(event.price);
    setRefundType("full");
    setRefundReason("");
    setShowRefundSheet(true);
  };

  const calculateRefundAmount = (type: string, originalPrice: number) => {
    switch (type) {
      case "full":
        return originalPrice;
      case "partial75":
        return originalPrice * 0.75;
      case "partial50":
        return originalPrice * 0.5;
      case "partial25":
        return originalPrice * 0.25;
      case "custom":
        return refundAmount;
      default:
        return originalPrice;
    }
  };

  const handleProcessRefund = () => {
    if (!selectedEvent || !refundReason) {
      toast.error("Please provide a reason for the refund");
      return;
    }

    const calculatedAmount = calculateRefundAmount(refundType, selectedEvent.price);

    const newRefundRequest: RefundRequest = {
      id: `r${refundRequests.length + 1}`,
      eventId: selectedEvent._id,
      eventTitle: selectedEvent.title,
      customerName: "Customer Name",
      customerEmail: "customer@example.com",
      bookingDate: "2025-04-01",
      requestDate: format(new Date(), "yyyy-MM-dd"),
      amount: calculatedAmount,
      status: "approved",
      reason: refundReason
    };

    setRefundRequests([...refundRequests, newRefundRequest]);

    toast.success(`Refund of $${calculatedAmount.toFixed(2)} for event ${selectedEvent.title} has been processed`);
    setShowRefundSheet(false);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsDialog(true);
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/events/bookings')}>
            <Ticket className="mr-2 h-4 w-4" /> View Bookings
          </Button>
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" /> Add New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search events..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setDate(undefined)}>
                Clear Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <span>Loading events...</span>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">
                {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Refundable</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <TableRow key={event._id}>
                          <TableCell>{event.title}</TableCell>
                          <TableCell>{formatEventDate(event.date)}</TableCell>
                          <TableCell>{event.startTime}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>${event.price}</TableCell>
                          <TableCell>{event.currentAttendees || 0}/{event.maxAttendees}</TableCell>
                          <TableCell>{getStatusBadge(event.status)}</TableCell>
                          <TableCell>
                            {event.isRefundable ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(event)}
                            >
                              View
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  <QrCode className="h-4 w-4 mr-1" /> QR
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Event QR Code</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col items-center justify-center p-4">
                                  <div className="bg-white p-4 rounded-lg">
                                    <QRCode
                                      value={`HOTEL_EVENT:${selectedEvent?._id}:${selectedEvent?.title}`}
                                      size={200}
                                    />
                                  </div>
                                  <p className="mt-4 text-center text-sm">
                                    Scan this QR code to verify attendees for {selectedEvent?.title}
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditEvent(event)}
                            >
                              Edit
                            </Button>
                            {isSuperAdmin && event.status !== "cancelled" && event.isRefundable && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => handleRefundRequest(event)}
                              >
                                <RotateCcw className="h-4 w-4 mr-1" /> Refund
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No events found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
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
              <h3 className="font-medium">Event Statistics</h3>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-gray-500" />
                <span>{events.length} total events scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500 h-4 w-4" />
                <span>{events.filter(e => e.status === "upcoming").length} upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500 h-4 w-4" />
                <span>{events.filter(e => e.status === "completed").length} completed</span>
              </div>
              <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/admin/events/reports')}>
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              {selectedEvent?.isRefundable
                ? "Are you sure you want to process a refund for this event booking?"
                : "This event is marked as non-refundable."}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Refund Policy:</h3>
                <p className="text-sm text-gray-700">{selectedEvent.refundPolicy}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Event ID:</p>
                  <p className="text-sm">{selectedEvent._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Event:</p>
                  <p className="text-sm">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price:</p>
                  <p className="text-sm">${selectedEvent.price}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>Cancel</Button>
            <Button
              disabled={selectedEvent && !selectedEvent.isRefundable}
              onClick={() => {
                setShowRefundDialog(false);
                if (selectedEvent) handleRefundRequest(selectedEvent);
              }}
            >
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={showRefundSheet} onOpenChange={setShowRefundSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Process Refund</SheetTitle>
            <SheetDescription>
              Please complete the refund form below.
            </SheetDescription>
          </SheetHeader>

          {selectedEvent && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Event Details</h3>
                  <div className="rounded-md border p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Title:</div>
                      <div>{selectedEvent.title}</div>
                      <div className="font-medium">Date:</div>
                      <div>{formatEventDate(selectedEvent.date)}</div>
                      <div className="font-medium">Original Price:</div>
                      <div>${selectedEvent.price.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Refund Policy</h3>
                  <div className="rounded-md border p-3 bg-muted/50">
                    <p className="text-sm">{selectedEvent.refundPolicy}</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Refund Type</h3>
                  <Select
                    defaultValue="full"
                    onValueChange={(value) => {
                      setRefundType(value);
                      if (value !== "custom") {
                        setRefundAmount(calculateRefundAmount(value, selectedEvent.price));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select refund amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Refund (100%)</SelectItem>
                      <SelectItem value="partial75">Partial Refund (75%)</SelectItem>
                      <SelectItem value="partial50">Partial Refund (50%)</SelectItem>
                      <SelectItem value="partial25">Partial Refund (25%)</SelectItem>
                      <SelectItem value="custom">Custom Amount</SelectItem>
                    </SelectContent>
                  </Select>

                  {refundType === "custom" && (
                    <div className="grid gap-2 pt-2">
                      <label htmlFor="refundAmount" className="text-sm">Custom Refund Amount</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="refundAmount"
                          type="number"
                          placeholder="0.00"
                          className="pl-10"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
                          max={selectedEvent.price}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Refund Reason</h3>
                  <Textarea
                    placeholder="Enter reason for refund..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-amber-50 text-amber-900">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">
                    This will process a refund of <strong>${calculateRefundAmount(refundType, selectedEvent.price).toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="pt-4">
            <Button variant="outline" onClick={() => setShowRefundSheet(false)}>Cancel</Button>
            <Button
              onClick={handleProcessRefund}
              disabled={!refundReason}
            >
              Process Refund
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              Complete information about the event
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Event Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Event ID:</span>
                      <span className="text-sm">{selectedEvent._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Title:</span>
                      <span className="text-sm">{selectedEvent.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="text-sm">{getStatusBadge(selectedEvent.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="text-sm">{formatEventDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Time:</span>
                      <span className="text-sm">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="text-sm">${selectedEvent.price}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Attendance Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Maximum Capacity:</span>
                      <span className="text-sm">{selectedEvent.maxAttendees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Current Attendees:</span>
                      <span className="text-sm">{selectedEvent.currentAttendees || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Created At:</span>
                      <span className="text-sm">{new Date(selectedEvent.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Updated At:</span>
                      <span className="text-sm">{new Date(selectedEvent.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                <p className="text-sm p-3 bg-gray-50 rounded-md">{selectedEvent.description}</p>
              </div>

              {selectedEvent.addons && selectedEvent.addons.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Add-ons</h4>
                  <div className="space-y-2">
                    {selectedEvent.addons.map((addon, index) => (
                      <div key={index} className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="text-sm">{addon.name}</span>
                        <span className="text-sm">${addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Refund Policy</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Refundable:</span>
                    <Switch checked={selectedEvent.isRefundable} id="refundable-toggle" disabled />
                  </div>
                </div>
                <p className="text-sm p-3 bg-gray-50 rounded-md">{selectedEvent.refundPolicy}</p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button onClick={() => {
                  setShowDetailsDialog(false);
                  handleEditEvent(selectedEvent);
                }}>
                  Edit Event
                </Button>

                {isSuperAdmin && selectedEvent.status !== "cancelled" && selectedEvent.isRefundable && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setTimeout(() => handleRefundRequest(selectedEvent), 100);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Process Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        eventId={editingEventId}
        onSuccess={fetchEvents}
      />
    </div>
  );
};

export default EventsManagementContent;

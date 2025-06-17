import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Plus, Edit, Trash2, Search, Loader2, Calendar, Clock, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// API endpoint for events
const EVENTS_API_URL = "http://localhost:4000/api/events";

// Interface for event from API
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
  bookingDeadlineDate: string;
  bookingDeadlineTime: string;
  isRefundable: boolean;
  refundPolicy: string;
  addons: Array<{
    name: string;
    price: number;
    _id: string;
  }>;
  images: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const EventManagementContent: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(EVENTS_API_URL);
      
      // Check the response structure and handle it accordingly
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setEvents(response.data.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search query and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle adding a new event
  const handleAddEvent = () => {
    navigate("/admin/events/add");
  };

  // Handle editing an event
  const handleEditEvent = (id: string) => {
    navigate(`/admin/events/edit/${id}`);
  };

  // Handle deleting an event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      setDeleting(true);
      await axios.delete(`${EVENTS_API_URL}/${selectedEvent._id}`);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  // Handle updating event status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`${EVENTS_API_URL}/status/${id}`, { status: newStatus });
      toast.success(`Event status updated to ${newStatus}`);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event status:", error);
      toast.error("Failed to update event status");
    }
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Event Management</h2>
        <Button onClick={handleAddEvent}>
          <Plus className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </div>
      
      <div className="my-4 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Loading events...</span>
            </div>
          ) : (
            <>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No events found</p>
                  <Button onClick={handleAddEvent} variant="outline">
                    Add Your First Event
                  </Button>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No events match your search criteria</p>
                  <Button onClick={() => {setSearchQuery(""); setStatusFilter("all");}} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event._id}>
                        <TableCell>
                          <div className="w-16 h-16 rounded-md overflow-hidden">
                            {event.images && event.images.length > 0 ? (
                              <img
                                src={`http://localhost:4000/uploads/events/${event.images[0]}`}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error("Image failed to load:", event.images[0]);
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px]">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {event.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{formatEventDate(event.date)}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{event.startTime} - {event.endTime}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.status === "upcoming" ? "outline" :
                              event.status === "ongoing" ? "default" :
                              event.status === "completed" ? "secondary" :
                              "destructive"
                            }
                            className="capitalize"
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span>{event.currentAttendees}/{event.maxAttendees}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span>${event.price.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Select
                              defaultValue={event.status}
                              onValueChange={(value) => handleUpdateStatus(event._id, value)}
                            >
                              <SelectTrigger className="w-28 text-xs h-8 px-2">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditEvent(event._id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() => {
                                setSelectedEvent(event);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              {selectedEvent ? ` "${selectedEvent.title}"` : ''} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteEvent();
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventManagementContent; 
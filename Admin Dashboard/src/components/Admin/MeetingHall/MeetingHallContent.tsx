import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import {
  AlertCircle,
  Building2,
  Calendar as CalendarIcon,
  CalendarRange,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  PlusCircle,
  Search,
  Tag,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// API base URL
const API_BASE_URL = 'http://localhost:4000/api';

// Mock data for meeting halls
// const meetingHalls = [
//   {
//     id: 1,
//     name: "Grand Ballroom",
//     capacity: 500,
//     size: "1200 sq ft",
//     price: "$3,000/day",
//     amenities: ["AV Equipment", "Stage", "Catering", "WiFi"],
//     status: "Available"
//   },
//   {
//     id: 2,
//     name: "Executive Boardroom",
//     capacity: 20,
//     size: "400 sq ft",
//     price: "$500/day",
//     amenities: ["Video Conferencing", "Whiteboard", "Coffee Service", "WiFi"],
//     status: "Available"
//   },
//   {
//     id: 3,
//     name: "Conference Room A",
//     capacity: 50,
//     size: "600 sq ft",
//     price: "$800/day",
//     amenities: ["Projector", "Conference Phone", "Catering", "WiFi"],
//     status: "Booked"
//   },
//   {
//     id: 4,
//     name: "Conference Room B",
//     capacity: 50,
//     size: "600 sq ft",
//     price: "$800/day",
//     amenities: ["Projector", "Conference Phone", "Catering", "WiFi"],
//     status: "Available"
//   },
//   {
//     id: 5,
//     name: "Seminar Room",
//     capacity: 100,
//     size: "800 sq ft",
//     price: "$1,200/day",
//     amenities: ["AV Equipment", "Classroom Setup", "Catering", "WiFi"],
//     status: "Maintenance"
//   }
// ];

// Mock data for bookings
const bookings = [
  {
    id: 'BK-001',
    hallName: 'Grand Ballroom',
    client: 'ABC Corporation',
    eventType: 'Annual Conference',
    startDate: '2025-05-10',
    endDate: '2025-05-12',
    attendees: 350,
    status: 'Confirmed',
  },
  {
    id: 'BK-002',
    hallName: 'Conference Room A',
    client: 'XYZ Inc.',
    eventType: 'Board Meeting',
    startDate: '2025-04-15',
    endDate: '2025-04-15',
    attendees: 15,
    status: 'Confirmed',
  },
  {
    id: 'BK-003',
    hallName: 'Executive Boardroom',
    client: 'Tech Solutions LLC',
    eventType: 'Client Presentation',
    startDate: '2025-04-20',
    endDate: '2025-04-20',
    attendees: 12,
    status: 'Pending',
  },
  {
    id: 'BK-004',
    hallName: 'Seminar Room',
    client: 'University of Technology',
    eventType: 'Workshop',
    startDate: '2025-06-05',
    endDate: '2025-06-07',
    attendees: 75,
    status: 'Pending',
  },
];

// Mock data for new booking requests
const bookingRequests = [
  {
    id: 'REQ-001',
    firstName: 'John',
    lastName: 'Smith',
    companyName: 'Acme Corp',
    email: 'john.smith@acmecorp.com',
    phone: '555-123-4567',
    preferredDate: '2025-06-15',
    preferredTime: '10:00 AM',
    hallName: 'Grand Ballroom',
    attendees: 150,
    purpose: 'Annual Company Meeting',
    additionalRequirements:
      'Need projector and sound system. Catering for lunch.',
    submissionDate: '2025-04-01T14:30:00',
    status: 'New',
    notes: '',
    isNew: true,
  },
  {
    id: 'REQ-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    companyName: 'Tech Innovations',
    email: 'sarah.j@techinnovations.com',
    phone: '555-222-3333',
    preferredDate: '2025-05-20',
    preferredTime: '2:00 PM',
    hallName: 'Conference Room B',
    attendees: 30,
    purpose: 'Product Launch Planning',
    additionalRequirements: 'Video conferencing equipment needed',
    submissionDate: '2025-04-02T09:15:00',
    status: 'Contacted',
    notes: 'Called on 04/05 - they want to confirm by end of week',
    isNew: false,
  },
  {
    id: 'REQ-003',
    firstName: 'Michael',
    lastName: 'Williams',
    companyName: 'Global Finance',
    email: 'm.williams@globalfinance.com',
    phone: '555-444-5555',
    preferredDate: '2025-06-10',
    preferredTime: '9:00 AM',
    hallName: 'Executive Boardroom',
    attendees: 15,
    purpose: 'Board Meeting',
    additionalRequirements: 'Coffee service, presentation materials',
    submissionDate: '2025-04-03T16:45:00',
    status: 'Confirmed',
    notes: 'Deposit received 04/07',
    isNew: false,
  },
  {
    id: 'REQ-004',
    firstName: 'Emily',
    lastName: 'Brown',
    companyName: 'Creative Designs',
    email: 'emily@creativedesigns.com',
    phone: '555-666-7777',
    preferredDate: '2025-07-05',
    preferredTime: '1:00 PM',
    hallName: 'Conference Room A',
    attendees: 25,
    purpose: 'Design Workshop',
    additionalRequirements: 'Whiteboards, display areas for design materials',
    submissionDate: '2025-04-05T11:20:00',
    status: 'Declined',
    notes: 'Room unavailable on requested date, no alternative dates worked',
    isNew: false,
  },
  {
    id: 'REQ-005',
    firstName: 'Robert',
    lastName: 'Davis',
    companyName: 'Davis & Associates',
    email: 'robert@davisassociates.com',
    phone: '555-888-9999',
    preferredDate: '2025-06-22',
    preferredTime: '11:00 AM',
    hallName: 'Seminar Room',
    attendees: 60,
    purpose: 'Legal Seminar',
    additionalRequirements: 'Microphones, recording equipment',
    submissionDate: '2025-04-08T13:10:00',
    status: 'New',
    notes: '',
    isNew: true,
  },
];

const MeetingHallContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedTab, setSelectedTab] = useState('halls');
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const { toast } = useToast();

  // State for API data
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState({
    halls: false,
    bookings: false,
    requests: false,
  });

  // Calendar view state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedHall, setSelectedHall] = useState('all');
  // Add state for the dialog near the other state declarations
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHallForEdit, setSelectedHallForEdit] = useState(null);
  const [selectedHallForDelete, setSelectedHallForDelete] = useState(null);
  const [newHall, setNewHall] = useState({
    name: '',
    capacity: '',
    size: '',
    price: '',
    amenities: '',
    status: 'Available',
  });
  const [editHall, setEditHall] = useState({
    name: '',
    capacity: '',
    size: '',
    price: '',
    amenities: '',
    status: 'Available',
  });

  // Fetch meeting halls
  useEffect(() => {
    const fetchHalls = async () => {
      if (selectedTab === 'halls') {
        setLoading((prev) => ({ ...prev, halls: true }));
        try {
          const response = await axios.get(
            `${API_BASE_URL}/meeting-hall/halls`
          );

          if (response.data.status === 'success') {
            setHalls(response.data.data.halls);
          } else {
            throw new Error('Failed to fetch meeting halls');
          }
        } catch (error) {
          console.error('Error fetching halls:', error);
          toast({
            title: 'Error',
            description:
              'Failed to load meeting halls. Using sample data instead.',
            variant: 'destructive',
          });

          // Fallback to mock data
          // setHalls(meetingHalls);
        } finally {
          setLoading((prev) => ({ ...prev, halls: false }));
        }
      }
    };

    fetchHalls();
  }, [selectedTab, toast]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (selectedTab === 'bookings') {
        setLoading((prev) => ({ ...prev, bookings: true }));
        try {
          const response = await axios.get(
            `${API_BASE_URL}/meeting-hall/bookings`
          );

          if (response.data.status === 'success') {
            // Format dates for display
            const formattedBookings = response.data.data.bookings.map(
              (booking) => ({
                ...booking,
                id: booking.bookingId,
                startDate: format(new Date(booking.startDate), 'yyyy-MM-dd'),
                endDate: format(new Date(booking.endDate), 'yyyy-MM-dd'),
              })
            );
            setBookings(formattedBookings);
          } else {
            throw new Error('Failed to fetch bookings');
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
          toast({
            title: 'Error',
            description: 'Failed to load bookings. Using sample data instead.',
            variant: 'destructive',
          });

          // Fallback to mock data
          setBookings(bookings);
        } finally {
          setLoading((prev) => ({ ...prev, bookings: false }));
        }
      }
    };

    fetchBookings();
  }, [selectedTab, toast]);

  // Fetch booking requests
  useEffect(() => {
    const fetchBookingRequests = async () => {
      if (selectedTab === 'requests') {
        setLoading((prev) => ({ ...prev, requests: true }));
        try {
          const response = await axios.get(
            `${API_BASE_URL}/meeting-hall/booking-requests`
          );

          if (response.data.status === 'success') {
            // Format dates for display
            const formattedRequests = response.data.data.requests.map(
              (request) => ({
                ...request,
                id: request.requestId,
                preferredDate: format(
                  new Date(request.preferredDate),
                  'yyyy-MM-dd'
                ),
                submissionDate: request.submissionDate, // Keep as ISO string for formatting in the component
              })
            );
            setBookingRequests(formattedRequests);
          } else {
            throw new Error('Failed to fetch booking requests');
          }
        } catch (error) {
          console.error('Error fetching booking requests:', error);
          toast({
            title: 'Error',
            description:
              'Failed to load booking requests. Using sample data instead.',
            variant: 'destructive',
          });

          // Fallback to mock data
          setBookingRequests(bookingRequests);
        } finally {
          setLoading((prev) => ({ ...prev, requests: false }));
        }
      }
    };

    fetchBookingRequests();
  }, [selectedTab, toast]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Booked':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'Confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'New':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'Declined':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New':
        return <AlertCircle className="h-4 w-4" />;
      case 'Contacted':
        return <MessageSquare className="h-4 w-4" />;
      case 'Confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleViewRequest = (request) => {
    // Mark as read if it's a new request
    if (request.isNew) {
      markRequestAsRead(request._id);
    }
    setSelectedRequest(request);
    setNewStatus(request.status);
    setNewNote('');
  };

  const markRequestAsRead = async (requestId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/meeting-hall/booking-requests/${requestId}/mark-as-read`
      );

      // Update local state to reflect the change
      setBookingRequests((requests) =>
        requests.map((req) =>
          req._id === requestId ? { ...req, isNew: false } : req
        )
      );
    } catch (error) {
      console.error('Error marking request as read:', error);
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const updateData: {
        status: string;
        notes?: string;
        isNew?: boolean;
      } = {
        status: newStatus,
      };

      if (newNote.trim()) {
        // Append new note to existing notes
        const existingNotes = selectedRequest.notes || '';
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm');
        const formattedNote = `${timestamp}: ${newNote}${
          existingNotes ? '\n\n' + existingNotes : ''
        }`;
        updateData.notes = formattedNote;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/meeting-hall/booking-requests/${selectedRequest._id}`,
        updateData
      );

      if (response.data.status === 'success') {
        // Update local state
        setBookingRequests((requests) =>
          requests.map((req) =>
            req._id === selectedRequest._id
              ? {
                  ...req,
                  status: newStatus,
                  notes: updateData.notes || req.notes,
                  isNew: false,
                }
              : req
          )
        );

        toast({
          title: 'Request Updated',
          description: `The booking request has been updated successfully.`,
        });

        // Close dialog
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: 'Export Feature',
      description: 'Export functionality will be implemented in the future.',
    });
  };

  const getFilteredHalls = () => {
    return halls.filter(
      (hall) =>
        hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hall.amenities &&
          hall.amenities.some((amenity) =>
            amenity.toLowerCase().includes(searchQuery.toLowerCase())
          )) ||
        hall.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredBookings = () => {
    return bookings.filter(
      (booking) =>
        booking.hallName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.eventType &&
          booking.eventType
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        booking.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredRequests = () => {
    return bookingRequests.filter(
      (request) =>
        request.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.companyName &&
          request.companyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderRequestsTable = () => (
    <div className="rounded-md border">
      {loading.requests ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Preferred Date</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getFilteredRequests().length > 0 ? (
              getFilteredRequests().map((request) => (
                <TableRow key={request.id || request._id}>
                  <TableCell className="font-medium">
                    {request.isNew && (
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                    )}
                    {request.firstName} {request.lastName}
                  </TableCell>
                  <TableCell>{request.companyName}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell>
                    {request.preferredDate} {request.preferredTime}
                  </TableCell>
                  <TableCell>
                    {typeof request.submissionDate === 'string'
                      ? format(
                          new Date(request.submissionDate),
                          'MMM d, yyyy h:mm a'
                        )
                      : format(request.submissionDate, 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
                >
                  No booking requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );

  const countNewRequests = () => {
    return bookingRequests.filter((request) => request.isNew).length;
  };

  // Add the handleAddHall function where other handler functions are defined
  const handleAddHall = async () => {
    try {
      // Format amenities as an array
      const amenitiesArray = newHall.amenities
        ? newHall.amenities.split(',').map((item) => item.trim())
        : [];

      const hallData = {
        ...newHall,
        capacity: parseInt(newHall.capacity),
        amenities: amenitiesArray,
      };

      const response = await axios.post(
        `${API_BASE_URL}/meeting-hall/halls`,
        hallData
      );

      if (response.data.status === 'success') {
        // Add the new hall to the state
        setHalls([...halls, response.data.data.hall]);

        // Close dialog and reset form
        setAddDialogOpen(false);
        setNewHall({
          name: '',
          capacity: '',
          size: '',
          price: '',
          amenities: '',
          status: 'Available',
        });

        toast({
          title: 'Success',
          description: 'Meeting hall added successfully',
        });
      }
    } catch (error) {
      console.error('Error adding meeting hall:', error);
      toast({
        title: 'Error',
        description: 'Failed to add meeting hall. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Edit hall function
  const handleEditHall = async () => {
    try {
      // Format amenities as an array
      const amenitiesArray = editHall.amenities
        ? typeof editHall.amenities === 'string'
          ? editHall.amenities.split(',').map((item) => item.trim())
          : editHall.amenities
        : [];

      const hallData = {
        ...editHall,
        capacity: parseInt(editHall.capacity),
        amenities: amenitiesArray,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/meeting-hall/halls/${selectedHallForEdit._id}`,
        hallData
      );

      if (response.data.status === 'success') {
        // Update the hall in the state
        setHalls(
          halls.map((hall) =>
            hall._id === selectedHallForEdit._id
              ? response.data.data.hall
              : hall
          )
        );

        // Close dialog and reset form
        setEditDialogOpen(false);
        setSelectedHallForEdit(null);
        setEditHall({
          name: '',
          capacity: '',
          size: '',
          price: '',
          amenities: '',
          status: 'Available',
        });

        toast({
          title: 'Success',
          description: 'Meeting hall updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating meeting hall:', error);
      toast({
        title: 'Error',
        description: 'Failed to update meeting hall. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Delete hall function
  const handleDeleteHall = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/meeting-hall/halls/${selectedHallForDelete._id}`
      );

      if (response.status === 204 || response.data.status === 'success') {
        // Remove the hall from the state
        setHalls(
          halls.filter((hall) => hall._id !== selectedHallForDelete._id)
        );

        // Close dialog and reset
        setDeleteDialogOpen(false);
        setSelectedHallForDelete(null);

        toast({
          title: 'Success',
          description: 'Meeting hall deleted successfully',
        });
      }
    } catch (error) {
      console.error('Error deleting meeting hall:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete meeting hall. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (hall) => {
    setSelectedHallForEdit(hall);
    setEditHall({
      name: hall.name,
      capacity: hall.capacity.toString(),
      size: hall.size,
      price: hall.price,
      amenities: Array.isArray(hall.amenities)
        ? hall.amenities.join(', ')
        : hall.amenities || '',
      status: hall.status,
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (hall) => {
    setSelectedHallForDelete(hall);
    setDeleteDialogOpen(true);
  };

  // Update the edit input handler for the form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditHall({
      ...editHall,
      [name]: value,
    });
  };

  // Update the input handler for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHall({
      ...newHall,
      [name]: value,
    });
  };

  // Next month handler
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Previous month handler
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Get bookings for a specific day
  const getBookingsForDay = (day) => {
    return bookings.filter((booking) => {
      // Convert string dates to Date objects
      const startDate =
        typeof booking.startDate === 'string'
          ? parseISO(booking.startDate)
          : booking.startDate;
      const endDate =
        typeof booking.endDate === 'string'
          ? parseISO(booking.endDate)
          : booking.endDate;

      // Check if the day falls within the booking period
      return (
        (selectedHall === 'all' || booking.hallName === selectedHall) &&
        isWithinInterval(day, { start: startDate, end: endDate })
      );
    });
  };

  // Calculate booking color based on hall name for consistency
  const getBookingColor = (hallName) => {
    const colors = [
      'bg-blue-200 border-blue-400',
      'bg-green-200 border-green-400',
      'bg-yellow-200 border-yellow-400',
      'bg-purple-200 border-purple-400',
      'bg-red-200 border-red-400',
      'bg-indigo-200 border-indigo-400',
      'bg-pink-200 border-pink-400',
      'bg-orange-200 border-orange-400',
    ];

    // Generate a consistent index based on hall name
    const hallIndex =
      [...hallName].reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[hallIndex];
  };

  // Handle booking click in calendar
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  // Get unique hall names for filtering
  const getUniqueHallNames = () => {
    const hallNames = bookings.map((booking) => booking.hallName);
    return ['all', ...new Set(hallNames)];
  };

  // Render a calendar day with its bookings
  const renderDay = (day, dayInMonth) => {
    const dayBookings = getBookingsForDay(day);
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, currentMonth);

    return (
      <div
        key={day.toString()}
        className={`h-32 p-1 border relative ${
          !isCurrentMonth ? 'bg-gray-50' : ''
        } ${isToday(day) ? 'bg-blue-50' : ''} ${
          isSelected ? 'border-2 border-blue-500' : ''
        }`}
        onClick={() => setSelectedDate(day)}
      >
        <div
          className={`text-sm ${!isCurrentMonth ? 'text-gray-400' : ''} ${
            isToday(day) ? 'font-bold text-blue-600' : ''
          }`}
        >
          {format(day, 'd')}
        </div>
        <div className="mt-1 overflow-y-auto max-h-[80px]">
          {dayBookings.slice(0, 3).map((booking, idx) => (
            <div
              key={`${booking.id}-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                handleBookingClick(booking);
              }}
              className={`text-xs p-1 my-0.5 rounded truncate cursor-pointer border-l-2 ${getBookingColor(
                booking.hallName
              )}`}
            >
              {booking.client}
            </div>
          ))}
          {dayBookings.length > 3 && (
            <div className="text-xs text-gray-500 mt-1">
              +{dayBookings.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render the calendar header (day names)
  const renderDayHeaders = () => {
    const weekStart = startOfWeek(new Date());
    const days = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(weekStart),
    });

    return days.map((day) => (
      <div key={day.toString()} className="font-semibold text-center py-2">
        {format(day, 'EEE')}
      </div>
    ));
  };

  // Generate the days for the current month view
  const renderDaysGrid = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const rows = [];
    let cells = [];

    days.forEach((day, i) => {
      cells.push(renderDay(day, isSameMonth(day, currentMonth)));
      if ((i + 1) % 7 === 0) {
        rows.push(cells);
        cells = [];
      }
    });

    return rows.map((row, i) => (
      <div key={i} className="grid grid-cols-7 border-l">
        {row}
      </div>
    ));
  };

  // Render the booking details dialog
  const renderBookingDetails = () => {
    if (!selectedBooking) return null;

    return (
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              {selectedBooking.id} - {selectedBooking.eventType}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Hall</h3>
                <p>{selectedBooking.hallName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Client</h3>
                <p>{selectedBooking.client}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dates</h3>
                <p>
                  {selectedBooking.startDate === selectedBooking.endDate
                    ? selectedBooking.startDate
                    : `${selectedBooking.startDate} - ${selectedBooking.endDate}`}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Attendees</h3>
                <p className="flex items-center">
                  <Users size={14} className="mr-1" />
                  {selectedBooking.attendees}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </div>
              {selectedBooking.totalPrice && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p>{selectedBooking.totalPrice}</p>
                </div>
              )}
              {selectedBooking.notes && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="text-sm">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBooking(null)}>
              Close
            </Button>
            <Button>Edit Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Meeting Hall Management
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export Data</span>
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                <span>Add Meeting Hall</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Meeting Hall</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new meeting hall.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="name"
                    className="text-right text-sm font-medium"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newHall.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Grand Ballroom"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="capacity"
                    className="text-right text-sm font-medium"
                  >
                    Capacity
                  </label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={newHall.capacity}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="size"
                    className="text-right text-sm font-medium"
                  >
                    Size
                  </label>
                  <Input
                    id="size"
                    name="size"
                    value={newHall.size}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="1200 sq ft"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="price"
                    className="text-right text-sm font-medium"
                  >
                    Price
                  </label>
                  <Input
                    id="price"
                    name="price"
                    value={newHall.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="$1,000/day"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="amenities"
                    className="text-right text-sm font-medium"
                  >
                    Amenities
                  </label>
                  <Input
                    id="amenities"
                    name="amenities"
                    value={newHall.amenities}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="AV Equipment, WiFi, Catering (comma separated)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="status"
                    className="text-right text-sm font-medium"
                  >
                    Status
                  </label>
                  <Select
                    name="status"
                    value={newHall.status}
                    onValueChange={(value) =>
                      setNewHall({ ...newHall, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Booked">Booked</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddHall}>
                  Add Meeting Hall
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs
        defaultValue={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="halls">Meeting Halls</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Booking Requests
            {countNewRequests() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {countNewRequests()}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="halls" className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search halls..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Filter</Button>
            </div>
          </div>

          <div className="rounded-md border">
            {loading.halls ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amenities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredHalls().length > 0 ? (
                    getFilteredHalls().map((hall) => (
                      <TableRow key={hall._id || hall.id}>
                        <TableCell className="font-medium">
                          {hall.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-500" />
                            <span>{hall.capacity}</span>
                          </div>
                        </TableCell>
                        <TableCell>{hall.size}</TableCell>
                        <TableCell>{hall.price}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {hall.amenities &&
                              hall.amenities
                                .slice(0, 2)
                                .map((amenity, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-gray-50"
                                  >
                                    {amenity}
                                  </Badge>
                                ))}
                            {hall.amenities && hall.amenities.length > 2 && (
                              <Badge variant="outline" className="bg-gray-50">
                                +{hall.amenities.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(hall.status)}>
                            {hall.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(hall)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => openDeleteDialog(hall)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-gray-500"
                      >
                        No meeting halls found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="bookings"
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search bookings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <CalendarIcon size={16} />
                <span>New Booking</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            {loading.bookings ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Hall</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredBookings().length > 0 ? (
                    getFilteredBookings().map((booking) => (
                      <TableRow key={booking.id || booking._id}>
                        <TableCell className="font-medium">
                          {booking.id || booking.bookingId}
                        </TableCell>
                        <TableCell>{booking.hallName}</TableCell>
                        <TableCell>{booking.client}</TableCell>
                        <TableCell>{booking.eventType}</TableCell>
                        <TableCell>
                          {booking.startDate === booking.endDate
                            ? booking.startDate
                            : `${booking.startDate} - ${booking.endDate}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-500" />
                            <span>{booking.attendees}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-10 text-gray-500"
                      >
                        No bookings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="requests"
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search booking requests..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                <span>Export to Excel</span>
              </Button>
            </div>
          </div>

          {renderRequestsTable()}

          <Dialog
            open={selectedRequest !== null}
            onOpenChange={(open) => !open && setSelectedRequest(null)}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Booking Request Details</DialogTitle>
                <DialogDescription>
                  Request {selectedRequest?.id} submitted on{' '}
                  {selectedRequest &&
                    format(
                      new Date(selectedRequest.submissionDate),
                      'MMM d, yyyy h:mm a'
                    )}
                </DialogDescription>
              </DialogHeader>

              {selectedRequest && (
                <ScrollArea className="max-h-[70vh]">
                  <div className="grid grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1" /> Contact Information
                        </h3>
                        <div className="mt-2 space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="font-medium min-w-32">
                              Full Name:
                            </span>
                            <span>
                              {selectedRequest.firstName}{' '}
                              {selectedRequest.lastName}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium min-w-32">
                              Company:
                            </span>
                            <Building2 size={14} className="text-gray-500" />
                            <span>{selectedRequest.companyName}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium min-w-32">Email:</span>
                            <Mail size={14} className="text-gray-500" />
                            <span>{selectedRequest.email}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium min-w-32">Phone:</span>
                            <Phone size={14} className="text-gray-500" />
                            <span>{selectedRequest.phone}</span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" /> Event
                          Details
                        </h3>
                        <div className="mt-2 space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="font-medium min-w-32">
                              Preferred Date:
                            </span>
                            <CalendarRange
                              size={14}
                              className="text-gray-500"
                            />
                            <span>{selectedRequest.preferredDate}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium min-w-32">
                              Preferred Time:
                            </span>
                            <Clock size={14} className="text-gray-500" />
                            <span>{selectedRequest.preferredTime}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium min-w-32">Venue:</span>
                            <span>{selectedRequest.hallName}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium min-w-32">
                              Attendees:
                            </span>
                            <Users size={14} className="text-gray-500" />
                            <span>{selectedRequest.attendees}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> Event Purpose
                        </h3>
                        <p className="mt-2 text-sm">
                          {selectedRequest.purpose}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Tag className="h-4 w-4 mr-1" /> Additional
                          Requirements
                        </h3>
                        <p className="mt-2 text-sm">
                          {selectedRequest.additionalRequirements}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Current Status
                        </h3>
                        <Badge
                          className={`mt-2 ${getStatusColor(
                            selectedRequest.status
                          )}`}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(selectedRequest.status)}
                            {selectedRequest.status}
                          </span>
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Previous Notes
                        </h3>
                        <p className="mt-2 text-sm">
                          {selectedRequest.notes
                            ? selectedRequest.notes
                            : 'No notes available'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6 border-t pt-6">
                    <h3 className="text-sm font-medium text-gray-500">
                      Update Status
                    </h3>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Add Notes
                      </h3>
                      <Textarea
                        placeholder="Add internal notes about this booking request"
                        className="mt-2"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                    </div>
                  </div>
                </ScrollArea>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleUpdateRequest}>Update Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent
          value="calendar"
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="space-y-6">
            {/* Calendar header with controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevMonth}
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  aria-label="Next Month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Today
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Filter by hall:</span>
                  <Select value={selectedHall} onValueChange={setSelectedHall}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select hall" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniqueHallNames().map((hall) => (
                        <SelectItem key={hall} value={hall}>
                          {hall === 'all' ? 'All Halls' : hall}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    // This could open a booking creation dialog in the future
                    toast({
                      title: 'New Booking',
                      description: 'Create new booking feature coming soon.',
                    });
                  }}
                >
                  <PlusCircle size={16} />
                  <span>New Booking</span>
                </Button>
              </div>
            </div>

            {/* Calendar view */}
            {loading.bookings ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                {/* Calendar day headers */}
                <div className="grid grid-cols-7 bg-gray-50">
                  {renderDayHeaders()}
                </div>

                {/* Calendar days grid */}
                <div className="border-t">{renderDaysGrid()}</div>
              </div>
            )}

            {/* Legend showing hall colors */}
            <div className="flex flex-wrap gap-3 mt-4 text-xs">
              {halls.map((hall) => (
                <div key={hall._id || hall.id} className="flex items-center">
                  <div
                    className={`w-3 h-3 mr-1 rounded-sm border-l-2 ${getBookingColor(
                      hall.name
                    )}`}
                  ></div>
                  <span>{hall.name}</span>
                </div>
              ))}
            </div>

            {/* Booking details dialog */}
            {renderBookingDetails()}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Meeting Hall Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Meeting Hall</DialogTitle>
            <DialogDescription>
              Update the details of the meeting hall.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-name"
                className="text-right text-sm font-medium"
              >
                Name
              </label>
              <Input
                id="edit-name"
                name="name"
                value={editHall.name}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="Grand Ballroom"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-capacity"
                className="text-right text-sm font-medium"
              >
                Capacity
              </label>
              <Input
                id="edit-capacity"
                name="capacity"
                type="number"
                value={editHall.capacity}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="100"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-size"
                className="text-right text-sm font-medium"
              >
                Size
              </label>
              <Input
                id="edit-size"
                name="size"
                value={editHall.size}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="1200 sq ft"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-price"
                className="text-right text-sm font-medium"
              >
                Price
              </label>
              <Input
                id="edit-price"
                name="price"
                value={editHall.price}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="$1,000/day"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-amenities"
                className="text-right text-sm font-medium"
              >
                Amenities
              </label>
              <Input
                id="edit-amenities"
                name="amenities"
                value={editHall.amenities}
                onChange={handleEditInputChange}
                className="col-span-3"
                placeholder="AV Equipment, WiFi, Catering (comma separated)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-status"
                className="text-right text-sm font-medium"
              >
                Status
              </label>
              <Select
                name="status"
                value={editHall.status}
                onValueChange={(value) =>
                  setEditHall({ ...editHall, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditHall}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Meeting Hall Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Meeting Hall</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meeting hall? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteHall}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete Hall
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingHallContent;

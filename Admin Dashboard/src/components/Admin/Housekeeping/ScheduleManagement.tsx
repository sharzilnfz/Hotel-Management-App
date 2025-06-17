import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { CalendarDays, Plus, Clock, Users, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:4000/api";

// Shift types definition
const shiftTypes = [
  { id: "morning", name: "Morning (6am - 2pm)", color: "bg-blue-100 text-blue-800" },
  { id: "afternoon", name: "Afternoon (2pm - 10pm)", color: "bg-amber-100 text-amber-800" },
  { id: "night", name: "Night (10pm - 6am)", color: "bg-purple-100 text-purple-800" },
  { id: "day-off", name: "Day Off", color: "bg-gray-100 text-gray-800" }
];

const ScheduleManagement = () => {
  const [date, setDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [view, setView] = useState("calendar");

  const form = useForm({
    defaultValues: {
      staffId: "",
      date: new Date(),
      shiftType: "",
      notes: ""
    }
  });

  // Fetch staff members
  const fetchStaffMembers = async () => {
    try {
      console.log("Fetching staff members...");
      const response = await axios.get(`${API_BASE_URL}/house-keeping/staff`);
      console.log("Staff response:", response.data);

      if (response.data.status === 'success') {
        setStaffMembers(response.data.data.staff);
        console.log("Staff members loaded:", response.data.data.staff.length);
        return response.data.data.staff;
      } else {
        throw new Error("Failed to fetch staff data");
      }
    } catch (error) {
      console.error("Error fetching staff members:", error);
      toast({
        title: "Error",
        description: "Failed to load staff members. Using sample data instead.",
        variant: "destructive",
      });

      // Use sample data if API fails
      const sampleStaff = [
        { _id: "1", name: "John Smith" },
        { _id: "2", name: "Maria Garcia" },
        { _id: "3", name: "David Lee" },
        { _id: "4", name: "Sarah Johnson" },
        { _id: "5", name: "Michael Brown" }
      ];

      setStaffMembers(sampleStaff);
      console.log("Using sample staff data:", sampleStaff.length);
      return sampleStaff;
    }
  };

  // Fetch schedules
  const fetchSchedules = async (currentStaff) => {
    setLoading(true);
    try {
      // Get schedules for the next 14 days
      const today = new Date();
      const endDate = addDays(today, 14);
      const startDateStr = format(today, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');

      console.log("Fetching schedules from", startDateStr, "to", endDateStr);
      const response = await axios.get(
        `${API_BASE_URL}/house-keeping/schedules?startDate=${startDateStr}&endDate=${endDateStr}`
      );

      if (response.data.status === 'success') {
        console.log("Schedules loaded:", response.data.data.schedules.length);
        setSchedule(response.data.data.schedules);
      } else {
        throw new Error("Failed to fetch schedule data");
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Failed to load schedules. Using sample data instead.",
        variant: "destructive",
      });

      // Generate sample data if API fails
      const staffToUse = currentStaff || staffMembers;
      console.log("Using staff for sample schedules:", staffToUse.length);
      const sampleSchedule = generateSampleSchedule(staffToUse);
      setSchedule(sampleSchedule);
      console.log("Sample schedules generated:", sampleSchedule.length);
    } finally {
      setLoading(false);
    }
  };

  // Generate sample schedule for fallback
  const generateSampleSchedule = (currentStaff) => {
    const today = new Date();
    const schedule = [];
    const staffToUse = currentStaff || staffMembers;

    console.log("Generating sample schedule with staff:", staffToUse.length);

    for (let i = 0; i < 14; i++) {
      const scheduleDate = addDays(today, i);
      const dateString = format(scheduleDate, "yyyy-MM-dd");

      // Assign shifts to staff members
      staffToUse.forEach(staff => {
        // Simple pattern: rotate shifts, with occasional days off
        let shiftType;
        if (i % 7 === 0) {
          shiftType = "day-off"; // Day off once a week
        } else if (i % 3 === 0) {
          shiftType = "morning";
        } else if (i % 3 === 1) {
          shiftType = "afternoon";
        } else {
          shiftType = "night";
        }

        schedule.push({
          _id: `${staff._id}-${dateString}`,
          staffId: staff._id,
          staffName: staff.name,
          date: dateString,
          shiftType: shiftType,
          notes: ""
        });
      });
    }

    return schedule;
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const staff = await fetchStaffMembers();
        await fetchSchedules(staff);
      } catch (error) {
        console.error("Error in loadData:", error);
      }
    };

    loadData();
  }, []);

  const getStaffScheduleForDate = (selectedDate) => {
    const dateString = format(selectedDate, "yyyy-MM-dd");
    return schedule.filter(item => item.date === dateString);
  };

  const getShiftTypeDetails = (shiftTypeId) => {
    return shiftTypes.find(shift => shift.id === shiftTypeId) || shiftTypes[0];
  };

  const handleSubmit = async (data) => {
    try {
      const dateString = format(data.date, "yyyy-MM-dd");
      const staffMember = staffMembers.find(s => s._id.toString() === data.staffId);

      if (!staffMember) {
        throw new Error("Staff member not found");
      }

      // Check if there's already a schedule for this staff on this date
      const existingSchedule = schedule.find(
        item => item.staffId.toString() === data.staffId && item.date === dateString
      );

      let response;

      if (existingSchedule) {
        // Update existing schedule
        response = await axios.put(
          `${API_BASE_URL}/house-keeping/schedules/${existingSchedule._id}`,
          {
            shiftType: data.shiftType,
            notes: data.notes
          }
        );
      } else {
        // Add new schedule
        response = await axios.post(
          `${API_BASE_URL}/house-keeping/schedules`,
          {
            staffId: data.staffId,
            staffName: staffMember.name,
            date: dateString,
            shiftType: data.shiftType,
            notes: data.notes
          }
        );
      }

      if (response.data.status === 'success') {
        // Refresh the schedules
        await fetchSchedules(staffMembers);

        setOpen(false);
        form.reset();

        toast({
          title: "Schedule Updated",
          description: `Schedule for ${staffMember.name} on ${format(data.date, 'MMM dd, yyyy')} has been updated.`,
        });
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDaysWithScheduledShifts = () => {
    const uniqueDates = [...new Set(schedule.map(item => item.date))];
    return uniqueDates.map(dateStr => parseISO(dateStr));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Housekeeping Schedule</h1>
        <div className="flex gap-4">
          <Tabs value={view} onValueChange={setView} className="flex items-center">
            <TabsList>
              <TabsTrigger value="calendar" className="flex gap-1 items-center">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex gap-1 items-center">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Staff</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Schedule Shift</span>
                <span className="inline sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a Shift</DialogTitle>
                <DialogDescription>
                  Assign a shift to a staff member.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="staffId"
                    rules={{ required: "Staff member is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Staff Member</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select staff member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {staffMembers.map(staff => (
                              <SelectItem key={staff._id} value={staff._id.toString()}>
                                {staff.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="border rounded-md"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shiftType"
                    rules={{ required: "Shift type is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select shift type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shiftTypes.map(shift => (
                              <SelectItem key={shift.id} value={shift.id}>
                                {shift.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Any special instructions" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Schedule Shift</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={view} className="w-full">
        <TabsContent value="calendar" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  modifiers={{
                    scheduled: getDaysWithScheduledShifts()
                  }}
                  modifiersStyles={{
                    scheduled: {
                      fontWeight: 'bold',
                      backgroundColor: '#eef2ff',
                      color: '#4f46e5'
                    }
                  }}
                />

                <div className="mt-4 space-y-2">
                  <h3 className="font-medium">Shift Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {shiftTypes.map(shift => (
                      <Badge key={shift.id} className={shift.color}>
                        {shift.id === "day-off" ? "Off" : shift.id.charAt(0).toUpperCase() + shift.id.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Shifts for {format(date, "MMMM d, yyyy")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead className="hidden md:table-cell">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getStaffScheduleForDate(date).map(shift => {
                      const shiftDetails = getShiftTypeDetails(shift.shiftType);
                      return (
                        <TableRow key={shift._id}>
                          <TableCell>{shift.staffName}</TableCell>
                          <TableCell>
                            <Badge className={shiftDetails.color}>
                              {shiftDetails.name.split(' ')[0]}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {shift.notes || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {getStaffScheduleForDate(date).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No shifts scheduled for this day.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Staff Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      {[...Array(7)].map((_, i) => {
                        const day = addDays(new Date(), i);
                        return (
                          <TableHead key={i} className="text-center">
                            <div className="font-medium">{format(day, "EEE")}</div>
                            <div className="text-xs text-muted-foreground">{format(day, "MMM d")}</div>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffMembers.map(staff => (
                      <TableRow key={staff._id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        {[...Array(7)].map((_, i) => {
                          const day = addDays(new Date(), i);
                          const dayString = format(day, "yyyy-MM-dd");
                          const shift = schedule.find(s =>
                            s.staffId === staff._id && s.date === dayString
                          );

                          let shiftDisplay = null;
                          if (shift) {
                            const shiftDetails = getShiftTypeDetails(shift.shiftType);
                            shiftDisplay = (
                              <Badge className={shiftDetails.color}>
                                {shiftDetails.id === "day-off" ? "Off" : shiftDetails.id.charAt(0).toUpperCase()}
                              </Badge>
                            );
                          }

                          return (
                            <TableCell key={i} className="text-center">
                              {shiftDisplay || <span className="text-gray-300">-</span>}
                            </TableCell>
                          );
                        })}
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

export default ScheduleManagement;

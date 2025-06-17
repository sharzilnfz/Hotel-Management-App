import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Room numbers (still using mock data for now)
const roomNumbers = [
  "101", "102", "103", "104", "105",
  "201", "202", "203", "204", "205",
  "301", "302", "303", "304", "305",
  "401", "402", "403", "404", "405",
  "501", "502", "503", "504", "505"
];

// Priority badges
const priorityBadges = {
  high: <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>,
  medium: <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>,
  low: <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>,
};

// Status badges
const statusBadges = {
  pending: <Badge variant="outline" className="border-gray-300 text-gray-600">Pending</Badge>,
  "in-progress": <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>,
  completed: <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>,
  delayed: <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Delayed</Badge>,
};

// Form schema
const taskSchema = z.object({
  roomNumber: z.string().min(1, { message: "Room number is required" }),
  assignedTo: z.string().min(1, { message: "Please assign to a staff member" }),
  priority: z.string(),
  notes: z.string().optional(),
  dueDate: z.date(),
  isRecurring: z.boolean().default(false)
});

const TaskManagement = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      roomNumber: "",
      assignedTo: "",
      priority: "medium",
      notes: "",
      dueDate: new Date(),
      isRecurring: false,
    }
  });

  // Fetch staff and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch staff
        const staffResponse = await axios.get(`${API_URL}/api/house-keeping/staff`);
        if (staffResponse.data.data && staffResponse.data.data.staff) {
          setStaff(staffResponse.data.data.staff);
        }

        // Fetch tasks
        const tasksResponse = await axios.get(`${API_URL}/api/house-keeping/tasks`);
        if (tasksResponse.data.data && tasksResponse.data.data.tasks) {
          setTasks(tasksResponse.data.data.tasks);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s._id === staffId);
    return staffMember ? staffMember.name : "Unassigned";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPp");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("Creating task with data:", data);

      const response = await axios.post(`${API_URL}/api/house-keeping/tasks`, {
        roomNumber: data.roomNumber,
        assignedTo: data.assignedTo,
        priority: data.priority,
        notes: data.notes,
        dueDate: data.dueDate.toISOString(),
        isRecurring: data.isRecurring,
      });

      console.log("Task created:", response.data);

      // Add new task to state
      if (response.data.data && response.data.data.task) {
        setTasks(prevTasks => [...prevTasks, response.data.data.task]);
      }

      setOpen(false);
      form.reset();

      toast({
        title: "Task Created",
        description: `Task for Room ${data.roomNumber} has been assigned.`,
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      setIsLoading(true);
      console.log(`Updating task ${taskId} to status: ${newStatus}`);

      const response = await axios.patch(`${API_URL}/api/house-keeping/tasks/${taskId}`, {
        status: newStatus
      });

      console.log("Task updated:", response.data);

      // Update task in state
      if (response.data.data && response.data.data.task) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? response.data.data.task : task
          )
        );
      }

      toast({
        title: "Task Updated",
        description: `Task status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Housekeeping Task Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Cleaning Task</DialogTitle>
              <DialogDescription>
                Assign a new cleaning or maintenance task to housekeeping staff.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateTask)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roomNumbers.map(room => (
                            <SelectItem key={room} value={room}>{room}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {staff.map(staffMember => (
                            <SelectItem key={staffMember._id} value={staffMember._id}>
                              {staffMember.name}
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
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date & Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal flex justify-between items-center"
                            >
                              {field.value ? (
                                format(field.value, "PPp")
                              ) : (
                                <span>Pick a date and time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <Input
                              type="time"
                              onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':');
                                const newDate = new Date(field.value);
                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                field.onChange(newDate);
                              }}
                              defaultValue={format(field.value, 'HH:mm')}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional instructions or details"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Recurring Task
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Set this task as recurring for long-stay rooms
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Creating..." : "Create Task"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Active Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Recurring</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium">{task.roomNumber}</TableCell>
                      <TableCell>
                        {task.assignedTo && typeof task.assignedTo === 'object'
                          ? task.assignedTo.name
                          : getStaffName(task.assignedTo)}
                      </TableCell>
                      <TableCell>{priorityBadges[task.priority as keyof typeof priorityBadges]}</TableCell>
                      <TableCell>{statusBadges[task.status as keyof typeof statusBadges]}</TableCell>
                      <TableCell className="max-w-xs truncate">{task.notes}</TableCell>
                      <TableCell className="text-sm">
                        {task.dueDate ? formatDate(task.dueDate) : "No date"}
                      </TableCell>
                      <TableCell>{task.isRecurring ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          defaultValue={task.status}
                          onValueChange={(value) => updateTaskStatus(task._id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="delayed">Delayed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No tasks assigned yet. Create a new task to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManagement;

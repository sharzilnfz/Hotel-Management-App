import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, MoreVertical, Edit, Trash, Star, Loader2, Upload, CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Available areas
const availableAreas = [
  "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor",
  "Lobby", "Meeting Areas", "Restaurant", "Spa", "Pool Area"
];

// Validation schema
const staffSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(7, { message: "Phone number must be at least 7 characters" }),
  position: z.string().min(1, { message: "Position is required" }),
  assignedAreas: z.array(z.string()).min(1, { message: "At least one area must be assigned" }),
  status: z.string().default("Active"),
  joinDate: z.date({ required_error: "Join date is required" }),
  avatar: z.any().optional()
});

type FormValues = z.infer<typeof staffSchema>;

const StaffManagement = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "Room Attendant",
      assignedAreas: [],
      status: "Active"
    }
  });

  // Fetch staff data
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/api/house-keeping/staff`);
        console.log("Fetched staff data:", response.data);

        if (response.data.data && response.data.data.staff) {
          // Process each staff member's data
          const processedStaff = response.data.data.staff.map((staffMember: any) => {
            // Parse assignedAreas if it's a string array with JSON strings
            if (staffMember.assignedAreas && Array.isArray(staffMember.assignedAreas)) {
              try {
                // Check if the first item is a JSON string
                if (typeof staffMember.assignedAreas[0] === 'string' &&
                  staffMember.assignedAreas[0].startsWith('[')) {
                  // Parse the JSON string
                  staffMember.assignedAreas = JSON.parse(staffMember.assignedAreas[0]);
                  console.log(`Parsed assignedAreas for ${staffMember.name}:`, staffMember.assignedAreas);
                }
              } catch (error) {
                console.error(`Error parsing assignedAreas for ${staffMember.name}:`, error);
                staffMember.assignedAreas = [];
              }
            }
            return staffMember;
          });

          console.log("Processed staff data:", processedStaff);
          setStaff(processedStaff);
        } else {
          console.error("Unexpected response format:", response.data);
          toast({
            title: "Error",
            description: "Could not load staff data",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast({
          title: "Error",
          description: "Failed to load staff data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [toast]);

  const handleOpenEditDialog = (staffMember: any) => {
    setEditingStaff(staffMember);
    // Reset avatar preview - show existing avatar
    setAvatarFile(null);
    setAvatarPreview(staffMember.avatar ? getImageUrl(staffMember.avatar) : null);

    form.reset({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      position: staffMember.position,
      assignedAreas: staffMember.assignedAreas || [],
      status: staffMember.status,
      joinDate: staffMember.joinDate ? new Date(staffMember.joinDate) : new Date()
    });
    setDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setEditingStaff(null);
    // Reset avatar preview
    setAvatarFile(null);
    setAvatarPreview(null);

    form.reset({
      name: "",
      email: "",
      phone: "",
      position: "Room Attendant",
      assignedAreas: [],
      status: "Active",
      joinDate: new Date()
    });
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting data:", data);

      // Create form data to handle file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("position", data.position);
      formData.append("status", data.status);
      formData.append("joinDate", data.joinDate.toISOString());

      // Handle assigned areas as a JSON string
      formData.append("assignedAreas", JSON.stringify(data.assignedAreas));

      // Log form data for debugging
      console.log("Form data entries:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Append file if available
      if (avatarFile) {
        formData.append("avatar", avatarFile);
        console.log("New avatar file added to form data");
      } else if (editingStaff && !avatarFile) {
        // If editing and no new file was uploaded, indicate to keep existing avatar
        formData.append("keepExistingAvatar", "true");
        console.log("Keeping existing avatar (no new file uploaded)");
      }

      if (editingStaff) {
        // Update existing staff
        const response = await axios.patch(
          `${API_URL}/api/house-keeping/staff/${editingStaff._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log("Update response:", response.data);

        // Update local state
        setStaff(prevStaff =>
          prevStaff.map(s =>
            s._id === editingStaff._id ? response.data.data.staff : s
          )
        );

        toast({
          title: "Staff Updated",
          description: `${data.name}'s information has been updated.`,
        });
      } else {
        // Add new staff
        const response = await axios.post(
          `${API_URL}/api/house-keeping/staff`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log("Create response:", response.data);

        // Add to local state
        setStaff(prevStaff => [...prevStaff, response.data.data.staff]);

        toast({
          title: "Staff Added",
          description: `${data.name} has been added to the housekeeping team.`,
        });
      }

      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving staff:", error);
      toast({
        title: "Error",
        description: "Failed to save staff data",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/api/house-keeping/staff/${staffId}`);

      // Update local state
      setStaff(prevStaff => prevStaff.filter(s => s._id !== staffId));

      toast({
        title: "Staff Removed",
        description: "The staff member has been removed from the system.",
      });
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <span className="mr-1">{rating}</span>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  // Helper function to format image URL
  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder.svg";

    console.log("Raw image path:", path);

    // If it's already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      console.log("Using full URL:", path);
      return path;
    }

    // If it's a relative path, prepend the API URL
    let fullUrl;
    if (path.startsWith('/')) {
      fullUrl = `${API_URL}${path}`;
    } else {
      fullUrl = `${API_URL}/${path}`;
    }

    console.log("Constructed image URL:", fullUrl);
    return fullUrl;
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
        <h1 className="text-2xl font-bold">Housekeeping Staff Management</h1>
        <Button onClick={handleOpenAddDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Staff</span>
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[98vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
            <DialogDescription>
              {editingStaff
                ? 'Update the housekeeping staff information.'
                : 'Add a new member to the housekeeping team.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Avatar upload */}
              <div className="flex flex-col items-center space-y-2 mb-4">
                <Avatar className="h-24 w-24">
                  {avatarPreview ? (
                    <AvatarImage
                      src={avatarPreview}
                      alt="Staff avatar preview"
                      onError={(e) => {
                        console.error("Error loading avatar preview:", e);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <AvatarFallback>
                      <Upload className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer text-sm text-primary hover:underline"
                >
                  {editingStaff ? (avatarPreview ? 'Change photo' : 'Upload photo') : 'Upload photo'}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(editingStaff?.avatar ? getImageUrl(editingStaff.avatar) : null);
                    }}
                  >
                    Reset to {editingStaff ? 'original' : 'default'}
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  Recommended size: 500x500px. Max size: 5MB
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="staff@hotel.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="555-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Room Attendant">Room Attendant</SelectItem>
                        <SelectItem value="Laundry Attendant">Laundry Attendant</SelectItem>
                        <SelectItem value="Public Area Cleaner">Public Area Cleaner</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Joining Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Areas</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Toggle the selected area
                        const currentValues = field.value || [];
                        if (currentValues.includes(value)) {
                          field.onChange(currentValues.filter(v => v !== value));
                        } else {
                          field.onChange([...currentValues, value]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select areas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableAreas.map(area => (
                          <SelectItem key={area} value={area}>
                            <div className="flex items-center">
                              <span className="mr-2">{area}</span>
                              {field.value?.includes(area) && (
                                <Badge className="ml-auto">Selected</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value?.map(area => (
                        <Badge key={area} variant="outline" className="flex items-center gap-1">
                          {area}
                          <button
                            type="button"
                            className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center text-xs"
                            onClick={() => {
                              field.onChange(field.value.filter(v => v !== area));
                            }}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Saving..." : editingStaff ? "Update Staff" : "Add Staff"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {staff.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No staff members found. Add your first staff member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(member => (
            <Card key={member._id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={getImageUrl(member.avatar)}
                    alt={member.name}
                    onError={(e) => {
                      const imagePath = member.avatar ? getImageUrl(member.avatar) : "no image";
                      console.error(`Error loading image for ${member.name} from path: ${imagePath}`, e);

                      // Log response details from browser
                      fetch(getImageUrl(member.avatar))
                        .then(response => {
                          console.log(`Fetch response for ${member.name}'s image:`,
                            response.status, response.statusText);
                          return response.text();
                        })
                        .catch(err => console.error("Fetch check failed:", err));

                      // If image fails to load, fallback to initials
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <AvatarFallback>{member.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenEditDialog(member)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteStaff(member._id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Position</p>
                    <p className="mt-1">{member.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={
                      member.status === "Active" ? "bg-green-100 text-green-800" :
                        member.status === "On Leave" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                    }>
                      {member.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Joining Date</p>
                    <p className="mt-1">
                      {member.joinDate && !isNaN(new Date(member.joinDate).getTime())
                        ? format(new Date(member.joinDate), "PPP")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned Areas</p>
                    <div className="mt-1 space-y-1">
                      {Array.isArray(member.assignedAreas) && member.assignedAreas.length > 0 ? (
                        <>
                          {member.assignedAreas.slice(0, 2).map((area: string) => (
                            <Badge key={area} variant="outline">{area}</Badge>
                          ))}
                          {member.assignedAreas.length > 2 && (
                            <Badge variant="outline" className="bg-primary/10">
                              +{member.assignedAreas.length - 2} more
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Performance</p>
                    <p className="mt-1">{renderRating(member.performance || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                    <p className="text-lg font-semibold">{member.tasksDone || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Tasks</p>
                    <p className="text-lg font-semibold">{member.tasksInProgress || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffManagement;

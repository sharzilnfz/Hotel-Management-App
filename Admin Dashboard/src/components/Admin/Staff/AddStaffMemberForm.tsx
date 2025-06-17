import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

// API endpoints
const API_BASE_URL = "http://localhost:4000/api";
const STAFF_API_URL = `${API_BASE_URL}/staff`;
const ROLES_API_URL = `${API_BASE_URL}/roles`;
const DEPARTMENTS_API_URL = `${API_BASE_URL}/departments`;
const ACCESS_LEVELS_API_URL = `${API_BASE_URL}/access-levels`;

interface AddStaffMemberFormProps {
  currentUserDepartment: string;
  currentUserRole: string;
}

// Interface for role, department, and access level
interface Role {
  _id: string;
  name: string;
}

interface Department {
  _id: string;
  name: string;
}

interface AccessLevel {
  _id: string;
  name: string;
  level: number;
}

const staffFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  department: z.string().min(2, {
    message: "Department is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(7, {
    message: "Phone number must be at least 7 characters.",
  }),
  role: z.string().min(1, {
    message: "Role is required.",
  }),
  status: z.string().default("Active"),
  accessLevel: z.string().default("Standard"),
  startDate: z.string().optional(),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

const AddStaffMemberForm = ({ currentUserDepartment, currentUserRole }: AddStaffMemberFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canEditAllDepartments, setCanEditAllDepartments] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const navigate = useNavigate();

  // Fetch roles, departments, and access levels from the database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [rolesResponse, departmentsResponse, accessLevelsResponse] = await Promise.all([
          axios.get(ROLES_API_URL),
          axios.get(DEPARTMENTS_API_URL),
          axios.get(ACCESS_LEVELS_API_URL)
        ]);

        // Process roles data
        let rolesData = [];
        if (rolesResponse.data.data && Array.isArray(rolesResponse.data.data)) {
          rolesData = rolesResponse.data.data;
        } else if (rolesResponse.data.roles && Array.isArray(rolesResponse.data.roles)) {
          rolesData = rolesResponse.data.roles;
        } else if (Array.isArray(rolesResponse.data)) {
          rolesData = rolesResponse.data;
        }
        setRoles(rolesData);

        // Process departments data
        let departmentsData = [];
        if (departmentsResponse.data.data && Array.isArray(departmentsResponse.data.data)) {
          departmentsData = departmentsResponse.data.data;
        } else if (departmentsResponse.data.departments && Array.isArray(departmentsResponse.data.departments)) {
          departmentsData = departmentsResponse.data.departments;
        } else if (Array.isArray(departmentsResponse.data)) {
          departmentsData = departmentsResponse.data;
        }
        setDepartments(departmentsData);

        // Process access levels data
        let accessLevelsData = [];
        if (accessLevelsResponse.data.data && Array.isArray(accessLevelsResponse.data.data)) {
          accessLevelsData = accessLevelsResponse.data.data;
        } else if (accessLevelsResponse.data.accessLevels && Array.isArray(accessLevelsResponse.data.accessLevels)) {
          accessLevelsData = accessLevelsResponse.data.accessLevels;
        } else if (Array.isArray(accessLevelsResponse.data)) {
          accessLevelsData = accessLevelsResponse.data;
        }
        setAccessLevels(accessLevelsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load form data. Some options may be limited.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if user can edit all departments based on their role and department
  useEffect(() => {
    if (currentUserRole === "Administrator" || currentUserDepartment === "Management" || currentUserDepartment === "Human Resources") {
      setCanEditAllDepartments(true);
    }
  }, [currentUserRole, currentUserDepartment]);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      position: "",
      department: canEditAllDepartments ? "" : currentUserDepartment,
      email: "",
      phone: "",
      role: "",
      status: "Active",
      accessLevel: "Standard",
      startDate: "",
      emergencyContact: "",
      address: "",
    },
  });

  useEffect(() => {
    // Update form default values when canEditAllDepartments changes
    if (!canEditAllDepartments) {
      form.setValue("department", currentUserDepartment);
    }
  }, [canEditAllDepartments, currentUserDepartment, form]);

  const onSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);

    try {
      // Submit data to backend API
      const response = await axios.post(STAFF_API_URL, values);

      toast.success("Staff member added successfully");

      setTimeout(() => {
        navigate("/admin/staff");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to add staff member. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate available department options based on user permissions
  const getDepartmentOptions = () => {
    if (departments.length === 0) {
      return canEditAllDepartments
        ? ["Management", "Human Resources"] // Fallback defaults if API fails
        : [currentUserDepartment];
    }

    return canEditAllDepartments
      ? departments
      : departments.filter(dept => dept.name === currentUserDepartment);
  };

  // Get available roles based on user role
  const getAvailableRoles = () => {
    if (roles.length === 0) {
      // Fallback defaults if API fails
      const defaultRoles = ["Manager", "Supervisor", "Staff", "Intern", "Contractor"];
      return currentUserRole === "Administrator"
        ? ["Administrator", ...defaultRoles]
        : defaultRoles;
    }

    // If user is not an admin, filter out the Administrator role
    return currentUserRole === "Administrator"
      ? roles
      : roles.filter(role => role.name !== "Administrator");
  };

  // Get available access levels based on user role
  const getAccessLevelOptions = () => {
    if (accessLevels.length === 0) {
      // Fallback to hardcoded values if API fails
      if (currentUserRole === "Administrator") {
        return ["Full Access", "Administrative", "Standard", "Limited", "Read Only"];
      } else if (currentUserRole === "Manager") {
        return ["Standard", "Limited", "Read Only"];
      } else {
        return ["Limited", "Read Only"];
      }
    }

    // Sort access levels by their level number (higher number = higher access)
    const sortedLevels = [...accessLevels].sort((a, b) => b.level - a.level);

    if (currentUserRole === "Administrator") {
      return sortedLevels;
    } else if (currentUserRole === "Manager") {
      // Managers can assign standard and lower access levels
      return sortedLevels.filter(level =>
        ["Standard", "Limited", "Read Only"].includes(level.name)
      );
    } else {
      // Other roles can only assign limited and read-only access
      return sortedLevels.filter(level =>
        ["Limited", "Read Only"].includes(level.name)
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading form data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/staff">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Staff Member</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">Personal Information</h2>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                        <Input placeholder="john.doe@parksideplaza.com" {...field} />
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 987-6543" {...field} />
                      </FormControl>
                      <FormDescription>
                        Contact number in case of emergency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">Employment Information</h2>

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Front Desk Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!canEditAllDepartments}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getDepartmentOptions().map((dept) => (
                            <SelectItem key={dept._id || dept} value={dept.name || dept}>
                              {dept.name || dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!canEditAllDepartments && (
                        <FormDescription>
                          You can only add staff to your department: {currentUserDepartment}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableRoles().map((role) => (
                            <SelectItem key={role._id || role} value={role.name || role}>
                              {role.name || role}
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
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAccessLevelOptions().map((level) => (
                            <SelectItem key={level._id || level} value={level.name || level}>
                              {level.name || level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Determines what areas of the system the staff member can access
                      </FormDescription>
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
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                          <SelectItem value="Terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => navigate("/admin/staff")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Staff Member"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddStaffMemberForm;

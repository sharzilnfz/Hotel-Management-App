import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

// API endpoints
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const STAFF_API_URL = `${API_URL}/api/staff`;
const ROLES_API_URL = `${API_URL}/api/roles`;
const DEPARTMENTS_API_URL = `${API_URL}/api/departments`;
const ACCESS_LEVELS_API_URL = `${API_URL}/api/access-levels`;

// Interfaces for data types
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

// Schema for form validation
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    position: z.string().min(2, { message: "Position must be at least 2 characters" }),
    department: z.string().min(1, { message: "Department is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(7, { message: "Phone number must be at least 7 characters" }),
    role: z.string().min(1, { message: "Role is required" }),
    status: z.string().min(1, { message: "Status is required" }),
    accessLevel: z.string().min(1, { message: "Access level is required" }),
    active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface EditStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    staffId: string;
    onSuccess: () => void;
}

const EditStaffModal = ({
    isOpen,
    onClose,
    staffId,
    onSuccess,
}: EditStaffModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<string>("Staff");

    // Form definition
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            position: "",
            department: "",
            email: "",
            phone: "",
            role: "",
            status: "Active",
            accessLevel: "Standard",
            active: true,
        },
    });

    // Get current user from localStorage for role-based permissions
    useEffect(() => {
        const userDataString = localStorage.getItem("currentUser");
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                setCurrentUserRole(userData.role || "Staff");
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    // Fetch roles, departments, and access levels data
    useEffect(() => {
        if (!isOpen) return;

        const fetchMetadata = async () => {
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
                console.error("Error fetching metadata:", error);
                toast.error("Failed to load some form options. Some fields may be limited.");
            }
        };

        fetchMetadata();
    }, [isOpen]);

    // Fetch staff data
    useEffect(() => {
        const fetchStaffData = async () => {
            if (!isOpen || !staffId) return;

            try {
                setIsFetching(true);
                console.log("Fetching staff with ID:", staffId);
                console.log("Fetch endpoint:", `${STAFF_API_URL}/${staffId}`);

                // Using direct axios call instead of the instance
                const response = await axios({
                    method: 'GET',
                    url: `${STAFF_API_URL}/${staffId}`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Staff detail API response:", response.data);

                // Extract staff data from the response
                const data = response.data;
                let staffData;

                if (data.data && data.data.staff) {
                    staffData = data.data.staff;
                } else if (data.data && data.data.doc) {
                    // Some APIs return data in a doc field
                    staffData = data.data.doc;
                } else if (data.data) {
                    staffData = data.data;
                } else if (data.staff) {
                    staffData = data.staff;
                } else if (data.doc) {
                    staffData = data.doc;
                } else {
                    staffData = data;
                }

                console.log("Processed staff data:", staffData);

                if (!staffData) {
                    throw new Error("Could not find staff data in the response");
                }

                // Set form values
                form.reset({
                    name: staffData.name || "",
                    position: staffData.position || "",
                    department: staffData.department || "",
                    email: staffData.email || "",
                    phone: staffData.phone || "",
                    role: staffData.role || "",
                    status: staffData.status || "Active",
                    accessLevel: staffData.accessLevel || "Standard",
                    active: staffData.active ?? true,
                });

                setError(null);
            } catch (err) {
                console.error("Failed to fetch staff data:", err);

                // Detailed axios error logging
                if (axios.isAxiosError(err)) {
                    const statusCode = err.response?.status;
                    const responseData = err.response?.data;

                    console.error(`Status code: ${statusCode}`);
                    console.error("Response data:", responseData);

                    const errorMessage = responseData?.message ||
                        err.message ||
                        "Failed to load staff data";

                    setError("Failed to load staff data. Please try again.");
                    toast.error(errorMessage);
                } else {
                    setError("Failed to load staff data. Please try again.");
                    toast.error("Failed to load staff data");
                }
            } finally {
                setIsFetching(false);
            }
        };

        fetchStaffData();
    }, [isOpen, staffId, form]);

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

    // Submit handler
    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true);
            console.log("Submitting form data:", data);

            // Create the request body
            const requestBody = {
                name: data.name,
                position: data.position,
                department: data.department,
                email: data.email,
                phone: data.phone,
                role: data.role,
                status: data.status,
                accessLevel: data.accessLevel,
                active: data.active
            };

            console.log("Request endpoint:", `${STAFF_API_URL}/${staffId}`);
            console.log("Request body:", requestBody);

            // Try with different configurations to handle CORS and network issues
            try {
                // Attempt 1: Standard axios call with all credentials
                const response = await axios({
                    method: 'PATCH',
                    url: `${STAFF_API_URL}/${staffId}`,
                    data: requestBody,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                });

                console.log("Update response:", response.data);
                console.log("Updated staff data:", response.data.data?.staff || response.data.data);
                toast.success("Staff member updated successfully");
                onSuccess();
                onClose();
                return;
            } catch (axiosError) {
                console.error("First attempt failed:", axiosError);

                // If the first attempt fails, try another approach
                try {
                    // Attempt 2: Without credentials, different content type
                    const response = await axios({
                        method: 'PATCH',
                        url: `${STAFF_API_URL}/${staffId}`,
                        data: requestBody,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*'
                        },
                        withCredentials: false
                    });

                    console.log("Second attempt response:", response.data);
                    toast.success("Staff member updated successfully");
                    onSuccess();
                    onClose();
                    return;
                } catch (secondError) {
                    console.error("Second attempt failed:", secondError);

                    // Try a third approach with FormData instead of JSON
                    try {
                        // Create FormData
                        const formData = new FormData();
                        Object.entries(requestBody).forEach(([key, value]) => {
                            formData.append(key, value.toString());
                        });

                        const response = await axios({
                            method: 'PATCH',
                            url: `${STAFF_API_URL}/${staffId}`,
                            data: formData,
                            headers: {
                                'Accept': '*/*'
                            },
                            withCredentials: false
                        });

                        console.log("FormData attempt response:", response.data);
                        toast.success("Staff member updated successfully");
                        onSuccess();
                        onClose();
                        return;
                    } catch (thirdError) {
                        console.error("FormData attempt failed:", thirdError);
                        throw thirdError;
                    }
                }
            }
        } catch (error) {
            console.error("Error updating staff:", error);

            let errorMessage = "Failed to update staff member";

            if (axios.isAxiosError(error)) {
                // Network errors often don't have response data
                if (error.message === "Network Error") {
                    errorMessage = "Network error - Please check your connection and the API server";

                    // Log additional debug info
                    console.error("Network error details:");
                    console.error("- Error name:", error.name);
                    console.error("- Error message:", error.message);
                    console.error("- Error code:", error.code);
                    console.error("- Error config:", error.config);
                } else {
                    errorMessage = error.response?.data?.message || error.message || errorMessage;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Staff Member</DialogTitle>
                </DialogHeader>

                {isFetching ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">{error}</div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Position</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Hotel Manager" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments.length > 0 ? (
                                                        departments.map((dept) => (
                                                            <SelectItem key={dept._id || dept.name} value={dept.name}>
                                                                {dept.name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <SelectItem value="Management">Management</SelectItem>
                                                            <SelectItem value="Front Office">Front Office</SelectItem>
                                                            <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                                                            <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                                            <SelectItem value="Spa & Wellness">Spa & Wellness</SelectItem>
                                                            <SelectItem value="Security">Security</SelectItem>
                                                            <SelectItem value="IT">IT</SelectItem>
                                                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                                                            <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
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
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {getAvailableRoles().length > 0 ? (
                                                        getAvailableRoles().map((role) => (
                                                            <SelectItem
                                                                key={role._id || role.name || role}
                                                                value={role.name || role}
                                                            >
                                                                {role.name || role}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <>
                                                            {currentUserRole === "Administrator" && (
                                                                <SelectItem value="Administrator">Administrator</SelectItem>
                                                            )}
                                                            <SelectItem value="Manager">Manager</SelectItem>
                                                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                                                            <SelectItem value="Staff">Staff</SelectItem>
                                                            <SelectItem value="Intern">Intern</SelectItem>
                                                            <SelectItem value="Contractor">Contractor</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                                                <Input placeholder="+1 (555) 123-4567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
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
                                    name="accessLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Access Level</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an access level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {getAccessLevelOptions().length > 0 ? (
                                                        getAccessLevelOptions().map((level) => (
                                                            <SelectItem
                                                                key={level._id || level.name || level}
                                                                value={level.name || level}
                                                            >
                                                                {level.name || level}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <SelectItem value="Full Access">Full Access</SelectItem>
                                                            <SelectItem value="Administrative">Administrative</SelectItem>
                                                            <SelectItem value="Standard">Standard</SelectItem>
                                                            <SelectItem value="Limited">Limited</SelectItem>
                                                            <SelectItem value="Read Only">Read Only</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Account Status</FormLabel>
                                            <div className="text-sm text-muted-foreground">
                                                Disable to deactivate this user account
                                            </div>
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

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditStaffModal; 
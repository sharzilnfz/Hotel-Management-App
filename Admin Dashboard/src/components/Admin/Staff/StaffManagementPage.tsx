import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Plus,
    MoreHorizontal,
    UserPlus,
    Pencil,
    Trash2,
    Mail,
    Phone,
    Eye,
    Filter,
} from "lucide-react";

// API endpoint
const STAFF_API_URL = "http://localhost:4000/api/staff";

// Staff interface
interface Staff {
    _id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    role: string;
    status: string;
    accessLevel: string;
    startDate: string;
    emergencyContact?: string;
    address?: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
    employmentLength?: string;
}

const StaffManagementPage = () => {
    const navigate = useNavigate();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

    // Current user details (would normally come from authentication context)
    const currentUser = {
        role: "Administrator", // or "Manager", "Staff", etc.
        department: "Management", // or other department
    };

    const fetchStaff = async () => {
        try {
            setLoading(true);
            let url = STAFF_API_URL;

            // Add any active filters
            if (departmentFilter || statusFilter) {
                url += "?";
                if (departmentFilter) {
                    url += `department=${departmentFilter}`;
                }

                if (statusFilter) {
                    url += departmentFilter ? `&status=${statusFilter}` : `status=${statusFilter}`;
                }
            }

            const response = await axios.get(url);
            setStaff(response.data.data.staff);
        } catch (error) {
            console.error("Error fetching staff:", error);
            toast.error("Failed to load staff members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [departmentFilter, statusFilter]);

    const handleAddStaff = () => {
        navigate("/admin/staff/add");
    };

    const handleEditStaff = (staffId: string) => {
        navigate(`/admin/staff/edit/${staffId}`);
    };

    const handleViewStaff = (staffId: string) => {
        navigate(`/admin/staff/view/${staffId}`);
    };

    const handleDeleteStaff = async () => {
        if (!staffToDelete) return;

        try {
            await axios.delete(`${STAFF_API_URL}/${staffToDelete._id}`);
            toast.success("Staff member deleted successfully");
            setStaffToDelete(null);
            fetchStaff();
        } catch (error) {
            console.error("Error deleting staff:", error);
            toast.error("Failed to delete staff member");
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "Active":
                return "success";
            case "On Leave":
                return "warning";
            case "Suspended":
                return "default";
            case "Terminated":
                return "destructive";
            default:
                return "secondary";
        }
    };

    // Filter staff based on search query
    const filteredStaff = staff.filter((member) => {
        const matchesSearch = searchQuery
            ? member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.department.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return matchesSearch;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const canManageStaff = (staff: Staff) => {
        // Allow administrators to manage all staff
        if (currentUser.role === "Administrator") return true;

        // Managers can manage staff in their department
        if (currentUser.role === "Manager" && staff.department === currentUser.department) return true;

        // HR can manage all staff
        if (currentUser.department === "Human Resources") return true;

        return false;
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Staff Management</h1>
                    <p className="text-muted-foreground">Manage hotel staff members and their roles</p>
                </div>
                <Button onClick={handleAddStaff} className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Add Staff</span>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search staff..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Department
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("")}>
                                All Departments
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Management")}>
                                Management
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Front Office")}>
                                Front Office
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Housekeeping")}>
                                Housekeeping
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Food & Beverage")}>
                                Food & Beverage
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Maintenance")}>
                                Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Spa & Wellness")}>
                                Spa & Wellness
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Security")}>
                                Security
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("IT")}>
                                IT
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Human Resources")}>
                                Human Resources
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDepartmentFilter("Sales & Marketing")}>
                                Sales & Marketing
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setStatusFilter("")}>
                                All Statuses
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                                Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("On Leave")}>
                                On Leave
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("Suspended")}>
                                Suspended
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("Terminated")}>
                                Terminated
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {(departmentFilter || statusFilter) && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDepartmentFilter("");
                                setStatusFilter("");
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Staff Members</CardTitle>
                    <CardDescription>
                        {departmentFilter && `Department: ${departmentFilter}`}
                        {statusFilter && departmentFilter && ` | `}
                        {statusFilter && `Status: ${statusFilter}`}
                        {!departmentFilter && !statusFilter && "All staff members"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <p>Loading staff members...</p>
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-muted-foreground mb-4">No staff members found</p>
                            <Button onClick={handleAddStaff}>Add Staff Member</Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStaff.map((member) => (
                                        <TableRow key={member._id}>
                                            <TableCell className="flex items-center gap-3 font-medium">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.photo} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {member.name}
                                            </TableCell>
                                            <TableCell>{member.position}</TableCell>
                                            <TableCell>{member.department}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                                >
                                                    <Mail className="h-3 w-3" />
                                                    {member.email}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        member.status === "Active"
                                                            ? "success"
                                                            : member.status === "On Leave"
                                                                ? "warning"
                                                                : member.status === "Suspended"
                                                                    ? "default"
                                                                    : "destructive"
                                                    }
                                                >
                                                    {member.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleViewStaff(member._id)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>

                                                        {canManageStaff(member) && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleEditStaff(member._id)}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>

                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <DropdownMenuItem
                                                                            className="text-red-600"
                                                                            onSelect={(e) => {
                                                                                e.preventDefault();
                                                                                setStaffToDelete(member);
                                                                            }}
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </AlertDialogTrigger>
                                                                </AlertDialog>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog for Delete */}
            <AlertDialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove {staffToDelete?.name} from the staff list. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteStaff} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default StaffManagementPage; 
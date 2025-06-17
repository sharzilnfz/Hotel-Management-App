import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface for current user
interface CurrentUser {
    name: string;
    email: string;
    role: string;
    department: string;
    accessLevel: string;
}

// Interface for role
interface Role {
    _id: string;
    name: string;
    description?: string;
    department?: string;
    permissions?: string[];
    createdAt: string;
    updatedAt: string;
}

// Interface for department
interface Department {
    _id: string;
    name: string;
}

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const ROLE_ENDPOINT = `${API_URL}/api/roles`;
const DEPARTMENT_ENDPOINT = `${API_URL}/api/departments`;

const AddRoleContent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // New role form state
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDescription, setNewRoleDescription] = useState("");
    const [newRoleDepartment, setNewRoleDepartment] = useState("");

    // Edit role form state
    const [editRoleName, setEditRoleName] = useState("");
    const [editRoleDescription, setEditRoleDescription] = useState("");
    const [editRoleDepartment, setEditRoleDepartment] = useState("");

    // Get current user from localStorage
    useEffect(() => {
        const userDataString = localStorage.getItem("currentUser");
        if (userDataString) {
            setCurrentUser(JSON.parse(userDataString));
        }
    }, []);

    // Fetch roles data
    const fetchRolesData = async () => {
        try {
            setIsLoading(true);
            console.log("Fetching all roles from:", ROLE_ENDPOINT);

            const response = await axios({
                method: 'GET',
                url: ROLE_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("API Response:", response.data);

            // Handle different response formats based on the actual API response
            let rolesData = [];
            const data = response.data;

            if (data.data && data.data.roles && Array.isArray(data.data.roles)) {
                rolesData = data.data.roles;
            } else if (data.data && Array.isArray(data.data)) {
                rolesData = data.data;
            } else if (Array.isArray(data)) {
                rolesData = data;
            } else if (data.roles && Array.isArray(data.roles)) {
                rolesData = data.roles;
            }

            setRoles(rolesData);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch roles data:", err);

            if (axios.isAxiosError(err)) {
                const statusCode = err.response?.status;
                const responseData = err.response?.data;

                console.error(`Status code: ${statusCode}`);
                console.error("Response data:", responseData);

                const errorMessage = responseData?.message ||
                    err.message ||
                    "Failed to load roles data";

                setError("Failed to load roles data. Please try again later.");
                toast.error(errorMessage);
            } else {
                setError("Failed to load roles data. Please try again later.");
                toast.error(err instanceof Error ? err.message : "Failed to load roles data");
            }

            setRoles([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch departments data
    const fetchDepartmentsData = async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: DEPARTMENT_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Handle different response formats
            let departmentsData = [];
            const data = response.data;

            if (data.data && data.data.departments && Array.isArray(data.data.departments)) {
                departmentsData = data.data.departments;
            } else if (data.data && Array.isArray(data.data)) {
                departmentsData = data.data;
            } else if (Array.isArray(data)) {
                departmentsData = data;
            } else if (data.departments && Array.isArray(data.departments)) {
                departmentsData = data.departments;
            }

            setDepartments(departmentsData);
        } catch (error) {
            console.error("Failed to fetch departments:", error);
            toast.error("Failed to load departments. Some features may be limited.");
        }
    };

    // Initial data fetch
    useEffect(() => {
        Promise.all([fetchRolesData(), fetchDepartmentsData()]);
    }, []);

    // Create new role
    const createRole = async () => {
        if (!newRoleName.trim()) {
            toast.error("Role name is required");
            return;
        }

        try {
            const response = await axios({
                method: 'POST',
                url: ROLE_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name: newRoleName,
                    description: newRoleDescription,
                    department: newRoleDepartment || undefined
                }
            });

            console.log("Create role response:", response.data);
            toast.success("Role created successfully");

            // Reset form and close modal
            setNewRoleName("");
            setNewRoleDescription("");
            setNewRoleDepartment("");
            setIsAddModalOpen(false);

            // Refresh data
            fetchRolesData();
        } catch (error) {
            console.error("Error creating role:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to create role";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to create role");
            }
        }
    };

    // Delete role
    const deleteRole = async (id: string) => {
        try {
            await axios({
                method: 'DELETE',
                url: `${ROLE_ENDPOINT}/${id}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            toast.success("Role deleted successfully");

            // Refresh data
            fetchRolesData();
        } catch (error) {
            console.error("Error deleting role:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to delete role";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to delete role");
            }
        }
    };

    // Update role
    const updateRole = async () => {
        if (!selectedRole || !editRoleName.trim()) {
            toast.error("Role name is required");
            return;
        }

        try {
            const response = await axios({
                method: 'PUT',
                url: `${ROLE_ENDPOINT}/${selectedRole._id}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name: editRoleName,
                    description: editRoleDescription,
                    department: editRoleDepartment || undefined
                }
            });

            console.log("Update role response:", response.data);
            toast.success("Role updated successfully");

            // Reset form and close modal
            setEditRoleName("");
            setEditRoleDescription("");
            setEditRoleDepartment("");
            setIsEditModalOpen(false);
            setSelectedRole(null);

            // Refresh data
            fetchRolesData();
        } catch (error) {
            console.error("Error updating role:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to update role";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to update role");
            }
        }
    };

    // Open edit modal
    const openEditModal = (role: Role) => {
        setSelectedRole(role);
        setEditRoleName(role.name);
        setEditRoleDescription(role.description || "");
        setEditRoleDepartment(role.department || "");
        setIsEditModalOpen(true);
    };

    // Filter roles based on search query
    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.department && role.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Find department name by ID
    const getDepartmentName = (departmentId: string) => {
        const department = departments.find(d => d._id === departmentId);
        return department ? department.name : 'Unknown Department';
    };

    // Check if user has permission to manage roles
    const canManageRoles =
        !currentUser ||
        currentUser.accessLevel === "Full Access" ||
        currentUser.accessLevel === "Administrative" ||
        currentUser.role === "Administrator" ||
        currentUser.role === "Manager";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
                {canManageRoles && (
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <PlusCircle size={16} />
                        <span>Add Role</span>
                    </Button>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="text"
                            placeholder="Search roles..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created Date</TableHead>
                                {canManageRoles && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={canManageRoles ? 5 : 4} className="text-center py-10">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                            <span>Loading roles data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={canManageRoles ? 5 : 4} className="text-center py-10 text-red-500">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : filteredRoles.length > 0 ? (
                                filteredRoles.map((role) => (
                                    <TableRow key={role._id}>
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell>{role.department ? getDepartmentName(role.department) : 'All Departments'}</TableCell>
                                        <TableCell>{role.description || "No description"}</TableCell>
                                        <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                                        {canManageRoles && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(role)}
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    {(currentUser?.accessLevel === "Full Access" || currentUser?.role === "Administrator") && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => deleteRole(role._id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={canManageRoles ? 5 : 4} className="text-center py-10 text-gray-500">
                                        No roles found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add Role Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Role</DialogTitle>
                        <DialogDescription>
                            Create a new role for your organization.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="roleName">Role Name *</Label>
                            <Input
                                id="roleName"
                                placeholder="Enter role name"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roleDepartment">Department (Optional)</Label>
                            <Select value={newRoleDepartment} onValueChange={setNewRoleDepartment}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Departments</SelectItem>
                                    {departments.map((department) => (
                                        <SelectItem key={department._id} value={department._id}>
                                            {department.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roleDescription">Description (Optional)</Label>
                            <Textarea
                                id="roleDescription"
                                placeholder="Enter role description"
                                value={newRoleDescription}
                                onChange={(e) => setNewRoleDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={createRole}>Create Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Role Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>
                            Update the role information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="editRoleName">Role Name *</Label>
                            <Input
                                id="editRoleName"
                                placeholder="Enter role name"
                                value={editRoleName}
                                onChange={(e) => setEditRoleName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editRoleDepartment">Department (Optional)</Label>
                            <Select value={editRoleDepartment} onValueChange={setEditRoleDepartment}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Departments</SelectItem>
                                    {departments.map((department) => (
                                        <SelectItem key={department._id} value={department._id}>
                                            {department.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editRoleDescription">Description (Optional)</Label>
                            <Textarea
                                id="editRoleDescription"
                                placeholder="Enter role description"
                                value={editRoleDescription}
                                onChange={(e) => setEditRoleDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={updateRole}>Update Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddRoleContent; 
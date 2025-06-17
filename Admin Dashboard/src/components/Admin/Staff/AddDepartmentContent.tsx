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

// Interface for current user
interface CurrentUser {
    name: string;
    email: string;
    role: string;
    department: string;
    accessLevel: string;
}

// Interface for department
interface Department {
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const DEPARTMENT_ENDPOINT = `${API_URL}/api/departments`;

const AddDepartmentContent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    // New department form state
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [newDepartmentDescription, setNewDepartmentDescription] = useState("");

    // Edit department form state
    const [editDepartmentName, setEditDepartmentName] = useState("");
    const [editDepartmentDescription, setEditDepartmentDescription] = useState("");

    // Get current user from localStorage
    useEffect(() => {
        const userDataString = localStorage.getItem("currentUser");
        if (userDataString) {
            setCurrentUser(JSON.parse(userDataString));
        }
    }, []);

    // Fetch departments data
    const fetchDepartmentsData = async () => {
        try {
            setIsLoading(true);
            console.log("Fetching all departments from:", DEPARTMENT_ENDPOINT);

            const response = await axios({
                method: 'GET',
                url: DEPARTMENT_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("API Response:", response.data);

            // Handle different response formats based on the actual API response
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
            setError(null);
        } catch (err) {
            console.error("Failed to fetch departments data:", err);

            if (axios.isAxiosError(err)) {
                const statusCode = err.response?.status;
                const responseData = err.response?.data;

                console.error(`Status code: ${statusCode}`);
                console.error("Response data:", responseData);

                const errorMessage = responseData?.message ||
                    err.message ||
                    "Failed to load departments data";

                setError("Failed to load departments data. Please try again later.");
                toast.error(errorMessage);
            } else {
                setError("Failed to load departments data. Please try again later.");
                toast.error(err instanceof Error ? err.message : "Failed to load departments data");
            }

            setDepartments([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchDepartmentsData();
    }, []);

    // Create new department
    const createDepartment = async () => {
        if (!newDepartmentName.trim()) {
            toast.error("Department name is required");
            return;
        }

        try {
            const response = await axios({
                method: 'POST',
                url: DEPARTMENT_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name: newDepartmentName,
                    description: newDepartmentDescription
                }
            });

            console.log("Create department response:", response.data);
            toast.success("Department created successfully");

            // Reset form and close modal
            setNewDepartmentName("");
            setNewDepartmentDescription("");
            setIsAddModalOpen(false);

            // Refresh data
            fetchDepartmentsData();
        } catch (error) {
            console.error("Error creating department:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to create department";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to create department");
            }
        }
    };

    // Delete department
    const deleteDepartment = async (id: string) => {
        try {
            await axios({
                method: 'DELETE',
                url: `${DEPARTMENT_ENDPOINT}/${id}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            toast.success("Department deleted successfully");

            // Refresh data
            fetchDepartmentsData();
        } catch (error) {
            console.error("Error deleting department:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to delete department";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to delete department");
            }
        }
    };

    // Update department
    const updateDepartment = async () => {
        if (!selectedDepartment || !editDepartmentName.trim()) {
            toast.error("Department name is required");
            return;
        }

        try {
            const response = await axios({
                method: 'PUT',
                url: `${DEPARTMENT_ENDPOINT}/${selectedDepartment._id}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name: editDepartmentName,
                    description: editDepartmentDescription
                }
            });

            console.log("Update department response:", response.data);
            toast.success("Department updated successfully");

            // Reset form and close modal
            setEditDepartmentName("");
            setEditDepartmentDescription("");
            setIsEditModalOpen(false);
            setSelectedDepartment(null);

            // Refresh data
            fetchDepartmentsData();
        } catch (error) {
            console.error("Error updating department:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to update department";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to update department");
            }
        }
    };

    // Open edit modal
    const openEditModal = (department: Department) => {
        setSelectedDepartment(department);
        setEditDepartmentName(department.name);
        setEditDepartmentDescription(department.description || "");
        setIsEditModalOpen(true);
    };

    // Filter departments based on search query
    const filteredDepartments = departments.filter((department) =>
        department.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if user has permission to manage departments
    const canManageDepartments =
        !currentUser ||
        currentUser.accessLevel === "Full Access" ||
        currentUser.accessLevel === "Administrative" ||
        currentUser.role === "Administrator" ||
        currentUser.role === "Manager";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
                {canManageDepartments && (
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <PlusCircle size={16} />
                        <span>Add Department</span>
                    </Button>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="text"
                            placeholder="Search departments..."
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
                                <TableHead>Department Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created Date</TableHead>
                                {canManageDepartments && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={canManageDepartments ? 4 : 3} className="text-center py-10">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                            <span>Loading departments data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={canManageDepartments ? 4 : 3} className="text-center py-10 text-red-500">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : filteredDepartments.length > 0 ? (
                                filteredDepartments.map((department) => (
                                    <TableRow key={department._id}>
                                        <TableCell className="font-medium">{department.name}</TableCell>
                                        <TableCell>{department.description || "No description"}</TableCell>
                                        <TableCell>{new Date(department.createdAt).toLocaleDateString()}</TableCell>
                                        {canManageDepartments && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(department)}
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    {(currentUser?.accessLevel === "Full Access" || currentUser?.role === "Administrator") && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => deleteDepartment(department._id)}
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
                                    <TableCell colSpan={canManageDepartments ? 4 : 3} className="text-center py-10 text-gray-500">
                                        No departments found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add Department Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                        <DialogDescription>
                            Create a new department for your organization.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="departmentName">Department Name *</Label>
                            <Input
                                id="departmentName"
                                placeholder="Enter department name"
                                value={newDepartmentName}
                                onChange={(e) => setNewDepartmentName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="departmentDescription">Description (Optional)</Label>
                            <Textarea
                                id="departmentDescription"
                                placeholder="Enter department description"
                                value={newDepartmentDescription}
                                onChange={(e) => setNewDepartmentDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={createDepartment}>Create Department</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Department Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogDescription>
                            Update the department information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="editDepartmentName">Department Name *</Label>
                            <Input
                                id="editDepartmentName"
                                placeholder="Enter department name"
                                value={editDepartmentName}
                                onChange={(e) => setEditDepartmentName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editDepartmentDescription">Description (Optional)</Label>
                            <Textarea
                                id="editDepartmentDescription"
                                placeholder="Enter department description"
                                value={editDepartmentDescription}
                                onChange={(e) => setEditDepartmentDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={updateDepartment}>Update Department</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddDepartmentContent; 
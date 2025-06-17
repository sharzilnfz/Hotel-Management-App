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

// Interface for access level
interface AccessLevel {
    _id: string;
    name: string;
    description?: string;
    permissions?: string[];
    createdAt: string;
    updatedAt: string;
}

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const ACCESS_LEVEL_ENDPOINT = `${API_URL}/api/access-levels`;

const AddAccessLevelContent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAccessLevel, setSelectedAccessLevel] = useState<AccessLevel | null>(null);

    // New access level form state
    const [newAccessLevelName, setNewAccessLevelName] = useState("");
    const [newAccessLevelDescription, setNewAccessLevelDescription] = useState("");

    // Edit access level form state
    const [editAccessLevelName, setEditAccessLevelName] = useState("");
    const [editAccessLevelDescription, setEditAccessLevelDescription] = useState("");

    // Get current user from localStorage
    useEffect(() => {
        const userDataString = localStorage.getItem("currentUser");
        if (userDataString) {
            setCurrentUser(JSON.parse(userDataString));
        }
    }, []);

    // Fetch access levels data
    const fetchAccessLevelsData = async () => {
        try {
            setIsLoading(true);
            console.log("Fetching all access levels from:", ACCESS_LEVEL_ENDPOINT);

            const response = await axios({
                method: 'GET',
                url: ACCESS_LEVEL_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("API Response:", response.data);

            // Handle different response formats based on the actual API response
            let accessLevelsData = [];
            const data = response.data;

            if (data.data && data.data.accessLevels && Array.isArray(data.data.accessLevels)) {
                accessLevelsData = data.data.accessLevels;
            } else if (data.data && Array.isArray(data.data)) {
                accessLevelsData = data.data;
            } else if (Array.isArray(data)) {
                accessLevelsData = data;
            } else if (data.accessLevels && Array.isArray(data.accessLevels)) {
                accessLevelsData = data.accessLevels;
            }

            setAccessLevels(accessLevelsData);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch access levels data:", err);

            if (axios.isAxiosError(err)) {
                const statusCode = err.response?.status;
                const responseData = err.response?.data;

                console.error(`Status code: ${statusCode}`);
                console.error("Response data:", responseData);

                const errorMessage = responseData?.message ||
                    err.message ||
                    "Failed to load access levels data";

                setError("Failed to load access levels data. Please try again later.");
                toast.error(errorMessage);
            } else {
                setError("Failed to load access levels data. Please try again later.");
                toast.error(err instanceof Error ? err.message : "Failed to load access levels data");
            }

            setAccessLevels([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchAccessLevelsData();
    }, []);

    // Create new access level
    const createAccessLevel = async () => {
        if (!newAccessLevelName.trim()) {
            toast.error("Access level name is required");
            return;
        }

        try {
            const response = await axios({
                method: 'POST',
                url: ACCESS_LEVEL_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name: newAccessLevelName,
                    description: newAccessLevelDescription
                }
            });

            console.log("Create access level response:", response.data);
            toast.success("Access level created successfully");

            // Reset form and close modal
            setNewAccessLevelName("");
            setNewAccessLevelDescription("");
            setIsAddModalOpen(false);

            // Refresh data
            fetchAccessLevelsData();
        } catch (error) {
            console.error("Error creating access level:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to create access level";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to create access level");
            }
        }
    };

    // Delete access level
    const deleteAccessLevel = async (id: string) => {
        try {
            await axios({
                method: 'DELETE',
                url: `${ACCESS_LEVEL_ENDPOINT}/${id}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            toast.success("Access level deleted successfully");

            // Refresh data
            fetchAccessLevelsData();
        } catch (error) {
            console.error("Error deleting access level:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to delete access level";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to delete access level");
            }
        }
    };

    // Update access level
    const updateAccessLevel = async () => {
        if (!selectedAccessLevel || !editAccessLevelName.trim()) {
            toast.error("Access level name is required");
            return;
        }

        try {
            const response = await axios({
                method: 'PUT',
                url: `${ACCESS_LEVEL_ENDPOINT}/${selectedAccessLevel._id}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name: editAccessLevelName,
                    description: editAccessLevelDescription
                }
            });

            console.log("Update access level response:", response.data);
            toast.success("Access level updated successfully");

            // Reset form and close modal
            setEditAccessLevelName("");
            setEditAccessLevelDescription("");
            setIsEditModalOpen(false);
            setSelectedAccessLevel(null);

            // Refresh data
            fetchAccessLevelsData();
        } catch (error) {
            console.error("Error updating access level:", error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to update access level";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to update access level");
            }
        }
    };

    // Open edit modal
    const openEditModal = (accessLevel: AccessLevel) => {
        setSelectedAccessLevel(accessLevel);
        setEditAccessLevelName(accessLevel.name);
        setEditAccessLevelDescription(accessLevel.description || "");
        setIsEditModalOpen(true);
    };

    // Filter access levels based on search query
    const filteredAccessLevels = accessLevels.filter((accessLevel) =>
        accessLevel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if user has permission to manage access levels
    const canManageAccessLevels =
        !currentUser ||
        currentUser.accessLevel === "Full Access" ||
        currentUser.accessLevel === "Administrative" ||
        currentUser.role === "Administrator";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Access Level Management</h1>
                {canManageAccessLevels && (
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <PlusCircle size={16} />
                        <span>Add Access Level</span>
                    </Button>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="text"
                            placeholder="Search access levels..."
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
                                <TableHead>Access Level Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created Date</TableHead>
                                {canManageAccessLevels && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={canManageAccessLevels ? 4 : 3} className="text-center py-10">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                            <span>Loading access levels data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={canManageAccessLevels ? 4 : 3} className="text-center py-10 text-red-500">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : filteredAccessLevels.length > 0 ? (
                                filteredAccessLevels.map((accessLevel) => (
                                    <TableRow key={accessLevel._id}>
                                        <TableCell className="font-medium">{accessLevel.name}</TableCell>
                                        <TableCell>{accessLevel.description || "No description"}</TableCell>
                                        <TableCell>{new Date(accessLevel.createdAt).toLocaleDateString()}</TableCell>
                                        {canManageAccessLevels && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(accessLevel)}
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    {currentUser?.accessLevel === "Full Access" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => deleteAccessLevel(accessLevel._id)}
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
                                    <TableCell colSpan={canManageAccessLevels ? 4 : 3} className="text-center py-10 text-gray-500">
                                        No access levels found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add Access Level Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Access Level</DialogTitle>
                        <DialogDescription>
                            Create a new access level for your organization.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="accessLevelName">Access Level Name *</Label>
                            <Input
                                id="accessLevelName"
                                placeholder="Enter access level name"
                                value={newAccessLevelName}
                                onChange={(e) => setNewAccessLevelName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accessLevelDescription">Description (Optional)</Label>
                            <Textarea
                                id="accessLevelDescription"
                                placeholder="Enter access level description"
                                value={newAccessLevelDescription}
                                onChange={(e) => setNewAccessLevelDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={createAccessLevel}>Create Access Level</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Access Level Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Access Level</DialogTitle>
                        <DialogDescription>
                            Update the access level information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="editAccessLevelName">Access Level Name *</Label>
                            <Input
                                id="editAccessLevelName"
                                placeholder="Enter access level name"
                                value={editAccessLevelName}
                                onChange={(e) => setEditAccessLevelName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editAccessLevelDescription">Description (Optional)</Label>
                            <Textarea
                                id="editAccessLevelDescription"
                                placeholder="Enter access level description"
                                value={editAccessLevelDescription}
                                onChange={(e) => setEditAccessLevelDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={updateAccessLevel}>Update Access Level</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddAccessLevelContent; 
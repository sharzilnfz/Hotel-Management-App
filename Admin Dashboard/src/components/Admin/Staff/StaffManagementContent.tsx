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
import { PlusCircle, Search, Edit, Trash2, UserPlus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { StaffMember } from "@/types/staff";
import { toast } from "sonner";
import DeleteStaffModal from "./DeleteStaffModal";
import EditStaffModal from "./EditStaffModal";
import axios from "axios";

// Interface for current user
interface CurrentUser {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const STAFF_ENDPOINT = `${API_URL}/api/staff`;

const StaffManagementContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get current user from localStorage
  useEffect(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      setCurrentUser(JSON.parse(userDataString));
    }
  }, []);

  // Fetch staff data with axios
  const fetchStaffData = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching all staff members from:", `${API_URL}/api/staff`);

      // Using direct axios call instead of the instance
      const response = await axios({
        method: 'GET',
        url: `${API_URL}/api/staff`,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("API Response:", response.data);

      // Handle different response formats based on the actual API response
      let staffData = [];
      const data = response.data;

      if (data.data && data.data.staff && Array.isArray(data.data.staff)) {
        // Format: { data: { staff: [...] } }
        staffData = data.data.staff;
      } else if (data.data && Array.isArray(data.data)) {
        // Format: { data: [...] }
        staffData = data.data;
      } else if (Array.isArray(data)) {
        // Format: [...]
        staffData = data;
      } else if (data.staff && Array.isArray(data.staff)) {
        // Format: { staff: [...] }
        staffData = data.staff;
      }

      console.log("Processed staff data:", staffData);
      console.log("Data type:", Array.isArray(staffData) ? "Array" : typeof staffData);
      console.log("Data length:", Array.isArray(staffData) ? staffData.length : "N/A");

      setStaffMembers(staffData);
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

        setError("Failed to load staff data. Please try again later.");
        toast.error(errorMessage);
      } else {
        setError("Failed to load staff data. Please try again later.");
        toast.error(err instanceof Error ? err.message : "Failed to load staff data");
      }

      setStaffMembers([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStaffData();
  }, []);

  // Delete staff member with axios
  const deleteStaffMember = async (id: string) => {
    try {
      console.log("Deleting staff with ID:", id);
      console.log("Delete endpoint:", `${API_URL}/api/staff/${id}`);

      // Using direct axios call
      const response = await axios({
        method: 'DELETE',
        url: `${API_URL}/api/staff/${id}`,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Delete response:", response.data);

      // Refresh data after successful deletion
      fetchStaffData();
      return true;
    } catch (error) {
      console.error("Error deleting staff member:", error);

      // Detailed axios error logging
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const responseData = error.response?.data;

        console.error(`Status code: ${statusCode}`);
        console.error("Response data:", responseData);

        const errorMessage = responseData?.message ||
          error.message ||
          "Failed to delete staff member";

        console.error("Error message:", errorMessage);
      }

      throw error;
    }
  };

  // Handle successful delete
  const handleDeleteSuccess = () => {
    fetchStaffData();
  };

  // Handle successful edit
  const handleEditSuccess = () => {
    fetchStaffData();
  };

  // Filter staff based on user's department and search query
  const filteredStaff = Array.isArray(staffMembers)
    ? staffMembers.filter((staff) => {
      // Filter by department if not Full Access user and not in Management
      const departmentFilter =
        !currentUser ||
        currentUser.accessLevel === "Full Access" ||
        currentUser.department === "Management" ||
        currentUser.department === staff.department;

      // Filter by search query
      const searchFilter =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase());

      return departmentFilter && searchFilter;
    })
    : [];

  // Check if user has permission to add staff
  const canAddStaff =
    !currentUser ||
    currentUser.accessLevel === "Full Access" ||
    currentUser.accessLevel === "Administrative" ||
    currentUser.role === "Administrator" ||
    currentUser.role === "Manager";

  // Open delete modal
  const openDeleteModal = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
        {canAddStaff && (
          <Link to="/admin/staff/add">
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              <span>Add Staff Member</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Display department filter info if not admin */}
      {currentUser && currentUser.accessLevel !== "Full Access" && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <p className="text-sm text-blue-700">
            Viewing staff for: <span className="font-medium">{currentUser.department}</span>
          </p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search staff..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {currentUser && (currentUser.accessLevel === "Full Access" || currentUser.role === "Manager") && (
              <>
                <Button variant="outline">Export</Button>
                <Button variant="outline">Filter</Button>
              </>
            )}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                {canAddStaff && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={canAddStaff ? 7 : 6} className="text-center py-10">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                      <span>Loading staff data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={canAddStaff ? 7 : 6} className="text-center py-10 text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <TableRow key={staff._id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}
                      >
                        {staff.status}
                      </span>
                    </TableCell>
                    {canAddStaff && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(staff)}
                          >
                            <Edit size={16} />
                          </Button>
                          {(currentUser?.accessLevel === "Full Access" || currentUser?.role === "Administrator") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => openDeleteModal(staff)}
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
                  <TableCell colSpan={canAddStaff ? 7 : 6} className="text-center py-10 text-gray-500">
                    No staff members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add EditStaffModal */}
      {selectedStaff && (
        <>
          <DeleteStaffModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            staffId={selectedStaff._id}
            staffName={selectedStaff.name}
            onSuccess={handleDeleteSuccess}
          />
          <EditStaffModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            staffId={selectedStaff._id}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </div>
  );
};

export default StaffManagementContent;

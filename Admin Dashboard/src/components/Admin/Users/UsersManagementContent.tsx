import { useState, useEffect } from "react";
import axios from "axios";
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
import { Search, Edit, Trash2, UserPlus, Mail, Phone, Shield, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { User } from "@/types/user";
import UserProfile from "./UserProfile";
import UserEditForm from "./UserEditForm";
import UserBookings from "./UserBookings";

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const USERS_ENDPOINT = `${API_URL}/api/users`;

// View modes for the user management content
type ViewMode = "list" | "profile" | "edit" | "bookings";

const UsersManagementContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState<User[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // State for view mode and selected user
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Form state for adding new user
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    role: "Guest",
    isStaff: false,
    department: "",
  });

  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch guest users
        const guestResponse = await axios.get(`${USERS_ENDPOINT}/guests`);
        setGuests(guestResponse.data.data || []);

        // Fetch staff users
        const staffResponse = await axios.get(`${USERS_ENDPOINT}/staff`);
        setStaffUsers(staffResponse.data.data || []);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
        toast({
          title: "Error",
          description: err.message || "Failed to load users. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search query
  const filteredGuests = guests.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaffUsers = staffUsers.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewUserForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setNewUserForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle add new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = {
        ...newUserForm,
        isStaff: newUserForm.isStaff || newUserForm.role === "Administrator" ||
          newUserForm.role === "Manager" || newUserForm.role === "Front Desk"
      };

      const response = await axios.post(`${USERS_ENDPOINT}/signup`, userData);

      // Get user from response
      const user = response.data.user;

      // Update state based on user type
      if (user.isStaff) {
        setStaffUsers(prev => [user, ...prev]);
        setIsAddStaffDialogOpen(false);
      } else {
        setGuests(prev => [user, ...prev]);
        setIsAddUserDialogOpen(false);
      }

      // Reset form
      setNewUserForm({
        fullName: "",
        userName: "",
        email: "",
        phone: "",
        password: "",
        role: "Guest",
        isStaff: false,
        department: "",
      });

      toast({
        title: "Success",
        description: "User created successfully!",
      });
    } catch (err: any) {
      console.error("Error creating user:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`${USERS_ENDPOINT}/${userToDelete._id}`);

      // Update state based on user type
      if (userToDelete.isStaff) {
        setStaffUsers(prev => prev.filter(user => user._id !== userToDelete._id));
      } else {
        setGuests(prev => prev.filter(user => user._id !== userToDelete._id));
      }

      setIsConfirmDeleteOpen(false);
      setUserToDelete(null);

      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle user status update
  const handleStatusChange = async (user: User, newStatus: "Active" | "Inactive") => {
    try {
      const response = await axios.patch(`${USERS_ENDPOINT}/${user._id}/status`, { status: newStatus });
      const updatedUser = response.data.data;

      // Update state based on user type
      if (user.isStaff) {
        setStaffUsers(prev =>
          prev.map(u => u._id === user._id ? updatedUser : u)
        );
      } else {
        setGuests(prev =>
          prev.map(u => u._id === user._id ? updatedUser : u)
        );
      }

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}!`,
      });
    } catch (err: any) {
      console.error("Error updating user status:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message || "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "VIP Guest":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{role}</Badge>;
      case "Administrator":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{role}</Badge>;
      case "Manager":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{role}</Badge>;
      case "Front Desk":
        return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">{role}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Format datetime for display
  const formatDateTime = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Handler for viewing user profile
  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setViewMode("profile");
  };

  // Handler for editing user
  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setViewMode("edit");
  };

  // Handler for viewing user bookings
  const handleViewBookings = (userId: string) => {
    setSelectedUserId(userId);
    setViewMode("bookings");
  };

  // Handler for going back to the user list
  const handleBackToList = () => {
    setViewMode("list");
    setSelectedUserId("");
  };

  // Handler for user update
  const handleUserUpdated = (updatedUser: User) => {
    // Update the user in the appropriate list
    if (updatedUser.isStaff) {
      setStaffUsers(prev =>
        prev.map(user => user._id === updatedUser._id ? updatedUser : user)
      );
    } else {
      setGuests(prev =>
        prev.map(user => user._id === updatedUser._id ? updatedUser : user)
      );
    }
  };

  // Render the appropriate view based on viewMode
  if (viewMode === "profile") {
    return <UserProfile userId={selectedUserId} onBack={handleBackToList} />;
  }

  if (viewMode === "edit") {
    return <UserEditForm
      userId={selectedUserId}
      onBack={handleBackToList}
      onUserUpdated={handleUserUpdated}
    />;
  }

  if (viewMode === "bookings") {
    return <UserBookings userId={selectedUserId} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      </div>

      <Tabs defaultValue="guests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="guests">Guest Users</TabsTrigger>
          <TabsTrigger value="staff">Staff Users</TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2" onClick={() => setIsAddUserDialogOpen(true)}>
                <UserPlus size={16} />
                <span>Add New User</span>
              </Button>
              <Button variant="outline">Export</Button>
              <Button variant="outline">Filter</Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Loyalty Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.length > 0 ? (
                    filteredGuests.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Mail size={14} className="text-gray-500" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={14} className="text-gray-500" />
                              <span className="text-sm">{user.phone || "N/A"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>{formatDate(user.registeredDate)}</TableCell>
                        <TableCell>{formatDate(user.lastVisit)}</TableCell>
                        <TableCell>{user.loyaltyPoints.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewProfile(user._id)}>
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user._id)}>
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewBookings(user._id)}>
                                View Bookings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "Active" ? (
                                <DropdownMenuItem
                                  className="text-amber-500"
                                  onClick={() => handleStatusChange(user, "Inactive")}
                                >
                                  Deactivate Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-500"
                                  onClick={() => handleStatusChange(user, "Active")}
                                >
                                  Activate Account
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => {
                                  setUserToDelete(user);
                                  setIsConfirmDeleteOpen(true);
                                }}
                              >
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                        {searchQuery ? "No users found matching your search" : "No guest users found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="staff" className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search staff users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setNewUserForm(prev => ({ ...prev, isStaff: true, role: "Front Desk" }));
                setIsAddStaffDialogOpen(true);
              }}
            >
              <UserPlus size={16} />
              <span>Add Staff User</span>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p>Loading staff users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaffUsers.length > 0 ? (
                    filteredStaffUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Mail size={14} className="text-gray-500" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={14} className="text-gray-500" />
                              <span className="text-sm">{user.phone || "N/A"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Shield size={14} className="text-gray-500" />
                            {getRoleBadge(user.role)}
                          </div>
                        </TableCell>
                        <TableCell>{user.department || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDateTime(user.lastLogin)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewProfile(user._id)}>
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user._id)}>
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewBookings(user._id)}>
                                View Bookings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "Active" ? (
                                <DropdownMenuItem
                                  className="text-amber-500"
                                  onClick={() => handleStatusChange(user, "Inactive")}
                                >
                                  Deactivate Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-500"
                                  onClick={() => handleStatusChange(user, "Active")}
                                >
                                  Activate Account
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => {
                                  setUserToDelete(user);
                                  setIsConfirmDeleteOpen(true);
                                }}
                              >
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        {searchQuery ? "No staff users found matching your search" : "No staff users found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Guest User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Guest</DialogTitle>
            <DialogDescription>
              Create a new guest user account. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={newUserForm.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="userName">Username*</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={newUserForm.userName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newUserForm.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUserForm.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={newUserForm.role}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Guest">Guest</option>
                  <option value="VIP Guest">VIP Guest</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Staff User Dialog */}
      <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Staff User</DialogTitle>
            <DialogDescription>
              Create a new staff user account. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name*</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={newUserForm.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="userName">Username*</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={newUserForm.userName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newUserForm.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUserForm.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role*</Label>
                <select
                  id="role"
                  name="role"
                  value={newUserForm.role}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Manager">Manager</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={newUserForm.department}
                  onChange={handleInputChange}
                  placeholder="e.g. Management, Reception, etc."
                />
              </div>
              <input type="hidden" name="isStaff" value="true" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Staff User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {userToDelete && (
              <div className="text-center">
                <p className="font-medium">{userToDelete.fullName}</p>
                <p className="text-sm text-gray-500">{userToDelete.email}</p>
                <p className="text-sm text-gray-500">{userToDelete.role}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagementContent;

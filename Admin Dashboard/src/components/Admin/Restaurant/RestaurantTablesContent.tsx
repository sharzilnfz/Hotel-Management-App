import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Plus, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// Define the Table interface
interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  reservationTime: string | null;
  customerName: string | null;
}

const API_URL = "http://localhost:4000/api/restaurant/tables";

const RestaurantTablesContent: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTableNumber, setNewTableNumber] = useState<number | undefined>(undefined);
  const [newTableCapacity, setNewTableCapacity] = useState<number>(4);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [assignStatus, setAssignStatus] = useState<"occupied" | "reserved">("occupied");

  // Fetch all tables when component mounts
  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch tables from API
  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);

      if (response.data.success) {
        setTables(response.data.data);
      } else {
        toast.error("Failed to fetch tables");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const filteredTables = tables.filter(table => {
    // Search by table number, capacity, or customer name
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" ||
      table.number.toString().includes(searchQuery) ||
      table.capacity.toString().includes(searchQuery) ||
      (table.customerName && table.customerName.toLowerCase().includes(searchLower));

    // Filter by status
    const matchesStatus = statusFilter === "all" || table.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddTable = async () => {
    if (!newTableNumber) {
      toast.error("Please enter a table number");
      return;
    }

    if (tables.some(table => table.number === newTableNumber)) {
      toast.error("A table with this number already exists");
      return;
    }

    try {
      console.log("Sending new table data:", { number: newTableNumber, capacity: newTableCapacity });

      const response = await axios.post(API_URL, {
      number: newTableNumber,
        capacity: newTableCapacity
      });

      console.log("Server response:", response.data);

      if (response.data.success) {
        setTables([...tables, response.data.data]);
    setNewTableNumber(undefined);
    setNewTableCapacity(4);
        setDialogOpen(false); // Close the dialog after successful addition
    toast.success(`Table ${newTableNumber} has been added`);
      } else {
        toast.error(response.data.message || "Failed to add table");
      }
    } catch (error: any) {
      console.error("Error adding table:", error);
      toast.error(error.response?.data?.message || "Failed to connect to server");
    }
  };

  const handleUpdateTableStatus = async (id: string, status: string, customerName?: string, reservationTime?: string) => {
    try {
      const updateData = {
          status,
        customerName,
        reservationTime
      };

      console.log("Sending table status update:", updateData);

      const response = await axios.put(`${API_URL}/status/${id}`, updateData);

      console.log("Server response:", response.data);

      if (response.data.success) {
        const updatedTables = tables.map(table =>
          table._id === id ? response.data.data : table
        );
        setTables(updatedTables);
        toast.success(`Table ${tables.find(t => t._id === id)?.number} status updated to ${status}`);
      } else {
        toast.error(response.data.message || "Failed to update table status");
      }
    } catch (error: any) {
      console.error("Error updating table status:", error);
      toast.error(error.response?.data?.message || "Failed to connect to server");
    }
  };

  const openAssignDialog = (table: Table) => {
    setSelectedTable(table);
    setCustomerName("");
    setReservationTime("");
    setAssignStatus("occupied");
    setAssignDialogOpen(true);
  };

  const handleAssignCustomer = async () => {
    if (!selectedTable) return;

    if (!customerName) {
      toast.error("Please enter a customer name");
      return;
    }

    if (!reservationTime) {
      toast.error("Please enter a reservation time");
      return;
    }

    await handleUpdateTableStatus(
      selectedTable._id,
      assignStatus,
      customerName,
      reservationTime
    );

    setAssignDialogOpen(false);
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm("Are you sure you want to delete this table?")) return;

    try {
      console.log("Deleting table with ID:", id);

      const response = await axios.delete(`${API_URL}/${id}`);

      console.log("Server response:", response.data);

      if (response.data.success) {
        setTables(tables.filter(table => table._id !== id));
        toast.success("Table deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete table");
      }
    } catch (error: any) {
      console.error("Error deleting table:", error);
      toast.error(error.response?.data?.message || "Failed to connect to server");
    }
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 border-green-200";
      case "occupied":
        return "bg-red-50 border-red-200";
      case "reserved":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getTableStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Restaurant Tables</h2>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin/restaurant")}>
            Back to Menu Items
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
                <DialogDescription>
                  Add a new table to the restaurant layout.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table-number" className="col-span-1">
                    Table Number
                  </Label>
                  <Input
                    id="table-number"
                    type="number"
                    min="1"
                    value={newTableNumber || ""}
                    onChange={(e) => setNewTableNumber(parseInt(e.target.value) || undefined)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table-capacity" className="col-span-1">
                    Capacity
                  </Label>
                  <Input
                    id="table-capacity"
                    type="number"
                    min="1"
                    max="20"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(parseInt(e.target.value) || 4)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTable}>Add Table</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="my-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by table number, capacity, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assign Customer Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Customer to Table {selectedTable?.number}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assign-customer-name" className="col-span-1">
                Customer
              </Label>
              <Input
                id="assign-customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assign-reservation-time" className="col-span-1">
                Time
              </Label>
              <Input
                id="assign-reservation-time"
                type="time"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assign-status" className="col-span-1">
                Status
              </Label>
              <Select
                value={assignStatus}
                onValueChange={(value: "occupied" | "reserved") => setAssignStatus(value)}
              >
                <SelectTrigger id="assign-status" className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignCustomer}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Tables</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading tables...</span>
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTables.map((table) => (
                <Card key={table._id} className={`${getTableStatusColor(table.status)} border`}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getTableStatusBadge(table.status)
                    }`}>
                    {table.number}
                  </div>
                  <p className="mt-2 font-medium">Table {table.number}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <p>{table.capacity} Seats</p>
                  </div>
                  {table.status !== "available" && (
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{table.customerName}</p>
                      <p className="text-xs text-gray-500">
                        {table.status === "occupied" ? "Since" : "Reserved for"} {table.reservationTime}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 w-full">
                    <Select
                      value={table.status}
                        onValueChange={(value) => handleUpdateTableStatus(table._id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {table.status === "available" && (
                      <Button
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() => openAssignDialog(table)}
                      >
                          Assign Customer
                        </Button>
                  )}
                </CardContent>
              </Card>
            ))}

              {!loading && filteredTables.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No tables found matching your criteria
              </div>
            )}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantTablesContent;


import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, CircleDot, Search, Filter } from "lucide-react";

// Room status types and colors
const roomStatuses = [
  { id: "clean", label: "Clean / Ready", color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4 mr-1" /> },
  { id: "dirty", label: "Dirty / Needs Cleaning", color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4 mr-1" /> },
  { id: "in-progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4 mr-1" /> },
  { id: "inspected", label: "Inspected", color: "bg-blue-100 text-blue-800", icon: <CircleDot className="h-4 w-4 mr-1" /> },
];

// Room types
const roomTypes = ["All Types", "Single", "Double", "Suite", "Deluxe", "Presidential"];
const floors = ["All Floors", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"];

// Mock room data (in a real app, this would come from an API)
const mockRooms = [
  { id: 1, number: "101", type: "Single", floor: "1st Floor", status: "clean", lastCleaned: "2025-04-09T08:30:00", notes: "" },
  { id: 2, number: "102", type: "Single", floor: "1st Floor", status: "dirty", lastCleaned: "2025-04-08T14:45:00", notes: "Guest checked out" },
  { id: 3, number: "103", type: "Double", floor: "1st Floor", status: "in-progress", lastCleaned: "2025-04-09T10:15:00", notes: "Deep cleaning" },
  { id: 4, number: "201", type: "Double", floor: "2nd Floor", status: "inspected", lastCleaned: "2025-04-09T11:30:00", notes: "" },
  { id: 5, number: "202", type: "Suite", floor: "2nd Floor", status: "clean", lastCleaned: "2025-04-09T09:20:00", notes: "" },
  { id: 6, number: "301", type: "Suite", floor: "3rd Floor", status: "dirty", lastCleaned: "2025-04-08T16:10:00", notes: "VIP arrival tomorrow" },
  { id: 7, number: "302", type: "Deluxe", floor: "3rd Floor", status: "clean", lastCleaned: "2025-04-09T07:45:00", notes: "" },
  { id: 8, number: "401", type: "Deluxe", floor: "4th Floor", status: "inspected", lastCleaned: "2025-04-09T12:00:00", notes: "" },
  { id: 9, number: "501", type: "Presidential", floor: "5th Floor", status: "dirty", lastCleaned: "2025-04-08T17:30:00", notes: "Special amenities" },
  { id: 10, number: "502", type: "Presidential", floor: "5th Floor", status: "in-progress", lastCleaned: "2025-04-09T13:15:00", notes: "" },
];

const RoomStatusDashboard = () => {
  const [rooms, setRooms] = useState(mockRooms);
  const [filteredRooms, setFilteredRooms] = useState(mockRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedFloor, setSelectedFloor] = useState("All Floors");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Filter rooms based on selected filters
  useEffect(() => {
    let filtered = [...rooms];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType !== "All Types") {
      filtered = filtered.filter(room => room.type === selectedType);
    }

    // Apply floor filter
    if (selectedFloor !== "All Floors") {
      filtered = filtered.filter(room => room.floor === selectedFloor);
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(room => room.status === selectedStatus);
    }

    setFilteredRooms(filtered);
  }, [searchTerm, selectedType, selectedFloor, selectedStatus, rooms]);

  // Count rooms by status
  const statusCounts = roomStatuses.reduce((counts, status) => {
    counts[status.id] = rooms.filter(room => room.status === status.id).length;
    return counts;
  }, {});

  // Get status details by ID
  const getStatusDetails = (statusId) => {
    return roomStatuses.find(status => status.id === statusId) || roomStatuses[0];
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Update room status
  const updateRoomStatus = (roomId, newStatus) => {
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return { ...room, status: newStatus, lastCleaned: new Date().toISOString() };
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  return (
    <div className="space-y-6">
      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roomStatuses.map((status) => (
          <Card key={status.id} className="border-l-4" style={{
            borderLeftColor: status.color.includes('green') ? '#10B981' :
              status.color.includes('red') ? '#EF4444' :
                status.color.includes('yellow') ? '#F59E0B' : '#3B82F6'
          }}>
            <CardContent className="p-4">
              <div className="flex items-center">
                {status.icon}
                <span className="font-medium">{status.label}</span>
              </div>
              <p className="text-2xl font-bold mt-2">{statusCounts[status.id] || 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search room number or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Room Type Filter */}
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Floor Filter */}
            <Select
              value={selectedFloor}
              onValueChange={setSelectedFloor}
            >
              <SelectTrigger>
                <SelectValue placeholder="Floor" />
              </SelectTrigger>
              <SelectContent>
                {floors.map((floor) => (
                  <SelectItem key={floor} value={floor}>
                    {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {roomStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room List */}
      <Card>
        <CardHeader>
          <CardTitle>Room Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4">Room</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Floor</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Last Cleaned</th>
                  <th className="text-left p-4">Notes</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => {
                  const statusDetails = getStatusDetails(room.status);
                  return (
                    <tr key={room.id} className="border-b">
                      <td className="p-4 font-medium">
                        {room.number}
                      </td>
                      <td className="p-4">
                        {room.type}
                      </td>
                      <td className="p-4">
                        {room.floor}
                      </td>
                      <td className="p-4">
                        <Badge className={statusDetails.color}>{statusDetails.label}</Badge>
                      </td>
                      <td className="p-4 text-sm">
                        {formatDate(room.lastCleaned)}
                      </td>
                      <td className="p-4 text-sm">
                        {room.notes || "-"}
                      </td>
                      <td className="p-4">
                        <Select
                          value={room.status}
                          onValueChange={(value) => updateRoomStatus(room.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {roomStatuses.map((status) => (
                              <SelectItem key={status.id} value={status.id}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      No rooms match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomStatusDashboard;

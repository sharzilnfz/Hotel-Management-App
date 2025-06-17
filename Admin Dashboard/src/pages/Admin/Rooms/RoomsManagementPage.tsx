import { useState, useEffect } from "react";
import { Eye, Edit, Trash, Plus, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch } from "@/contexts/SearchContext";
import 'react-quill/dist/quill.snow.css';

interface Room {
  _id: string;
  name: string;
  type: string;
  category: string;
  bedType: string;
  capacity: number;
  price: number;
  totalRooms: number;
  availableRooms: number;
  description: string;
  isRefundable: boolean;
  refundPolicy: string;
  breakfastIncluded: boolean;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  payNow: boolean;
  payAtHotel: boolean;
  discount: {
    name: string;
    type: string;
    value: number;
    capacity: number;
    active: boolean;
    publishWebsite: boolean;
    publishApp: boolean;
  };
  cancellationPolicy: string;
  publishWebsite: boolean;
  publishApp: boolean;
  active: boolean;
  images: string[];
}

const roomFormSchema = z.object({
  name: z.string().min(2, { message: "Room name is required" }),
  type: z.string().min(1, { message: "Room type is required" }),
  category: z.string().min(1, { message: "Room category is required" }),
  bedType: z.string().min(1, { message: "Bed type is required" }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  totalRooms: z.number().min(1, { message: "Must have at least 1 room" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  isRefundable: z.boolean().default(true),
  refundPolicy: z.string().optional(),
  breakfastIncluded: z.boolean().default(false),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  payNow: z.boolean().default(true),
  payAtHotel: z.boolean().default(true),
  discount: z.record(z.any()).optional(),
  cancellationPolicy: z.string().optional(),
  publishWebsite: z.boolean().default(true),
  publishApp: z.boolean().default(true),
  active: z.boolean().default(true),
  images: z.array(z.string()).default([]),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

const RoomsManagementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { searchQuery, setSearchQuery, searchTarget, setSearchTarget } = useSearch();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortOrder, setSortOrder] = useState<"none" | "lowToHigh" | "highToLow">("none");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({});

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: "",
      type: "",
      category: "",
      bedType: "",
      capacity: 2,
      price: 0,
      totalRooms: 1,
      description: "",
      isRefundable: true,
      refundPolicy: "Full refund if cancelled up to 48 hours before check-in. 50% refund if cancelled up to 24 hours before check-in.",
      breakfastIncluded: false,
      checkInTime: "14:00",
      checkOutTime: "12:00",
      amenities: [],
      payNow: true,
      payAtHotel: true,
      discount: {
        name: "",
        type: "percentage",
        value: 0,
        capacity: 0,
        active: false,
        publishWebsite: true,
        publishApp: true
      },
      cancellationPolicy: "flexible",
      publishWebsite: true,
      publishApp: true,
      active: true,
      images: []
    }
  });

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/rooms");
      if (response.data.success) {
        const roomsWithAvailability = response.data.data.map(room => ({
          ...room,
          availableRooms: room.availableRooms !== undefined ? room.availableRooms : room.totalRooms
        }));
        setRooms(roomsWithAvailability);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set the search target when component mounts
    setSearchTarget('rooms');

    // Clean up when component unmounts
    return () => {
      setSearchTarget('');
      setSearchQuery('');
    };
  }, [setSearchTarget, setSearchQuery]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDeleteRoom = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/rooms/${id}`);
      if (response.data.success) {
        setRooms(rooms.filter(room => room._id !== id));
        toast({
          title: "Success",
          description: "Room deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleNextImage = () => {
    if (selectedRoom?.images) {
      setCurrentImageIndex((prev) =>
        prev === selectedRoom.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedRoom?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedRoom.images.length - 1 : prev - 1
      );
    }
  };

  const getFilteredAndSortedRooms = () => {
    let filteredRooms = [...rooms];

    // Apply status filter
    if (filterStatus !== "all") {
      filteredRooms = filteredRooms.filter(room =>
        filterStatus === "active" ? room.active : !room.active
      );
    }

    // Apply search filter across multiple fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredRooms = filteredRooms.filter(room => {
        // Room Type (name)
        if (room.name.toLowerCase().includes(query)) return true;
        // Category
        if (room.category.toLowerCase().includes(query)) return true;
        // Room Type
        if (room.type.toLowerCase().includes(query)) return true;
        // Capacity
        if (room.capacity.toString().includes(query)) return true;
        // Price/Night
        if (room.price.toString().includes(query)) return true;

        // Status - more explicit matching
        if (room.active && "active".toLowerCase().includes(query)) return true;
        if (!room.active && "inactive".toLowerCase().includes(query)) return true;
        if (!room.active && "maintenance".toLowerCase().includes(query)) return true;

        // Availability - search by numbers
        const availStr = `${room.availableRooms || 0}/${room.totalRooms}`;
        if (availStr.includes(query)) return true;

        return false;
      });
    }

    // Apply price sort
    if (sortOrder !== "none") {
      filteredRooms.sort((a, b) => {
        if (sortOrder === "lowToHigh") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    }

    return filteredRooms;
  };

  const filteredRooms = getFilteredAndSortedRooms();

  const handleSortChange = (order: "none" | "lowToHigh" | "highToLow") => {
    setSortOrder(order);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image+Available';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Construct the image URL by adding the rooms folder path
    return `http://localhost:4000/uploads/rooms/${imagePath}`;
  };

  const getAmenityColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];
    return colors[index % colors.length];
  };

  const handleUpdateRoom = (room: Room) => {
    navigate(`/admin/rooms/edit/${room._id}`);
  };

  const onSubmit = async (values: RoomFormValues) => {
    try {
      const formDataObj = new FormData();

      // Append form values from react-hook-form
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataObj.append(key, String(value));
        }
      });

      // Append additional form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formDataObj.append(key, JSON.stringify(value));
          } else {
            formDataObj.append(key, String(value));
          }
        }
      });

      // Append files
      selectedFiles.forEach(file => {
        formDataObj.append('images', file);
      });

      const response = await axios.put(
        `http://localhost:4000/api/rooms/${selectedRoom?._id}`,
        formDataObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "Room Updated Successfully",
          description: `${values.name} has been updated.`
        });
        fetchRooms();
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update room",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <Link to="/admin/rooms/add">
            <Button className="bg-hotel-primary hover:bg-opacity-90 whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Add New Room
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Room Inventory</CardTitle>
          <CardDescription>
            Manage your hotel's room types and availability
            {searchQuery && (
              <span className="ml-2 font-medium text-primary">
                Showing results for "{searchQuery}"
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("inactive")}
              >
                Inactive
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">Price:</span>
              <Button
                variant={sortOrder === "none" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("none")}
              >
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Default
              </Button>
              <Button
                variant={sortOrder === "lowToHigh" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("lowToHigh")}
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Low to High
              </Button>
              <Button
                variant={sortOrder === "highToLow" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("highToLow")}
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                High to Low
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room._id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.category}</TableCell>
                  <TableCell>{room.capacity} guests</TableCell>
                  <TableCell>${room.price}</TableCell>
                  <TableCell>
                    <Badge variant={room.active ? "outline" : "secondary"}>
                      {room.active ? "Active" : "Maintenance"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{room.availableRooms !== undefined ? room.availableRooms : room.totalRooms}/{room.totalRooms} rooms</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewRoom(room)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateRoom(room)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteRoom(room._id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Rooms</p>
                <p className="text-2xl font-bold">{rooms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Available Rooms</p>
                <p className="text-2xl font-bold">{rooms.filter(room => room.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Rooms under Maintenance</p>
                <p className="text-2xl font-bold">{rooms.filter(room => !room.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl p-0 overflow-auto max-h-[90vh]">
          {selectedRoom && (
            <div className="flex flex-col md:flex-row">
              {/* Image Gallery */}
              <div className="w-full md:w-1/2 relative max-h-[80vh] overflow-hidden">
                {selectedRoom.images && selectedRoom.images.length > 0 ? (
                  <>
                    <div className="relative h-full">
                      <img
                        src={getImageUrl(selectedRoom.images[currentImageIndex])}
                        alt={selectedRoom.name}
                        className="w-full h-full object-contain max-h-[70vh]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/80 hover:bg-white"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <div className="flex gap-2">
                        {selectedRoom.images.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                              }`}
                          />
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/80 hover:bg-white"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="h-64 md:h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No images available</span>
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="w-full md:w-1/2 p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-2xl font-bold">
                    {selectedRoom.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-100">
                      {selectedRoom.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={selectedRoom.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {selectedRoom.active ? "Active" : "Maintenance"}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium">{selectedRoom.capacity} guests</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Price per Night</p>
                    <p className="font-medium">${selectedRoom.price}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total Rooms</p>
                    <p className="font-medium">{selectedRoom.totalRooms}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Available Rooms</p>
                    <p className="font-medium">{selectedRoom.availableRooms !== undefined ? selectedRoom.availableRooms : selectedRoom.totalRooms}</p>
                  </div>
                </div>

                {selectedRoom.description && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <div 
                      className="text-gray-600 rich-text-content"
                      dangerouslySetInnerHTML={{ __html: selectedRoom.description }}
                    />
                  </div>
                )}

                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`${getAmenityColor(index)}`}
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedRoom.checkInTime || selectedRoom.checkOutTime) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedRoom.checkInTime && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Check-in Time</p>
                        <p className="font-medium text-blue-600">{selectedRoom.checkInTime}</p>
                      </div>
                    )}
                    {selectedRoom.checkOutTime && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Check-out Time</p>
                        <p className="font-medium text-blue-600">{selectedRoom.checkOutTime}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedRoom.isRefundable && selectedRoom.refundPolicy && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Refund Policy</h3>
                    <div 
                      className="text-gray-600 rich-text-content"
                      dangerouslySetInnerHTML={{ __html: selectedRoom.refundPolicy }}
                    />
                  </div>
                )}

                {selectedRoom.cancellationPolicy && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Cancellation Policy</h3>
                    <p className="text-gray-600">{selectedRoom.cancellationPolicy}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsManagementPage;

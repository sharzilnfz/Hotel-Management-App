import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, Plus, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

const AddRoomPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    },
  });

  const [formData, setFormData] = useState({
    breakfastIncluded: false,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    amenities: [],
    extras: [],
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
  });

  const [availableAmenities, setAvailableAmenities] = useState([
    { id: "wifi", label: "Free Wi-Fi" },
    { id: "tv", label: "Flat-screen TV" },
    { id: "ac", label: "Air conditioning" },
    { id: "minibar", label: "Minibar" },
    { id: "safe", label: "In-room safe" },
    { id: "workspace", label: "Work desk" },
    { id: "balcony", label: "Private balcony" },
    { id: "bathtub", label: "Bathtub" },
    { id: "shower", label: "Rain shower" },
    { id: "coffeeMaker", label: "Coffee maker" },
    { id: "hairDryer", label: "Hair dryer" },
    { id: "iron", label: "Iron and ironing board" },
    { id: "robe", label: "Bathrobes and slippers" }
  ]);

  const [amenityDialogOpen, setAmenityDialogOpen] = useState(false);
  const [currentAmenity, setCurrentAmenity] = useState({ id: "", label: "" });
  const [isEditingAmenity, setIsEditingAmenity] = useState(false);

  // State for extras/add-ons
  const [extraDialogOpen, setExtraDialogOpen] = useState(false);
  const [currentExtra, setCurrentExtra] = useState({ name: "", price: 0 });
  const [isEditingExtra, setIsEditingExtra] = useState(false);
  const [currentExtraIndex, setCurrentExtraIndex] = useState(-1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAmenityChange = (id: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, id]
      });
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(item => item !== id)
      });
    }
  };

  const handleAddAmenity = () => {
    setCurrentAmenity({ id: "", label: "" });
    setIsEditingAmenity(false);
    setAmenityDialogOpen(true);
  };

  const handleEditAmenity = (amenity: { id: string, label: string }) => {
    setCurrentAmenity({ ...amenity });
    setIsEditingAmenity(true);
    setAmenityDialogOpen(true);
  };

  const handleDeleteAmenity = (id: string) => {
    setAvailableAmenities(availableAmenities.filter(amenity => amenity.id !== id));

    if (formData.amenities.includes(id)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(amenityId => amenityId !== id)
      });
    }

    toast({
      title: "Amenity Deleted",
      description: "The amenity has been removed."
    });
  };

  const saveAmenity = () => {
    if (!currentAmenity.label.trim() || !currentAmenity.id.trim()) {
      toast({
        title: "Invalid Input",
        description: "Both ID and Label are required.",
        variant: "destructive"
      });
      return;
    }

    if (isEditingAmenity) {
      setAvailableAmenities(availableAmenities.map(amenity =>
        amenity.id === currentAmenity.id ? { ...currentAmenity } : amenity
      ));

      toast({
        title: "Amenity Updated",
        description: `${currentAmenity.label} has been updated.`
      });
    } else {
      if (availableAmenities.some(amenity => amenity.id === currentAmenity.id)) {
        toast({
          title: "Duplicate ID",
          description: "This amenity ID already exists. Please use a unique ID.",
          variant: "destructive"
        });
        return;
      }

      setAvailableAmenities([...availableAmenities, { ...currentAmenity }]);

      toast({
        title: "Amenity Added",
        description: `${currentAmenity.label} has been added to the list.`
      });
    }

    setAmenityDialogOpen(false);
  };

  // Extra/Add-on handlers
  const handleAddExtra = () => {
    setCurrentExtra({ name: "", price: 0 });
    setIsEditingExtra(false);
    setCurrentExtraIndex(-1);
    setExtraDialogOpen(true);
  };

  const handleEditExtra = (extra: { name: string, price: number }, index: number) => {
    setCurrentExtra({ ...extra });
    setIsEditingExtra(true);
    setCurrentExtraIndex(index);
    setExtraDialogOpen(true);
  };

  const handleDeleteExtra = (index: number) => {
    setFormData({
      ...formData,
      extras: formData.extras.filter((_, i) => i !== index)
    });

    toast({
      title: "Extra Deleted",
      description: "The extra has been removed."
    });
  };

  const saveExtra = () => {
    if (!currentExtra.name.trim()) {
      toast({
        title: "Invalid Input",
        description: "Name is required.",
        variant: "destructive"
      });
      return;
    }

    if (currentExtra.price < 0) {
      toast({
        title: "Invalid Price",
        description: "Price must be a positive number.",
        variant: "destructive"
      });
      return;
    }

    if (isEditingExtra && currentExtraIndex >= 0) {
      // Update existing extra
      const updatedExtras = [...formData.extras];
      updatedExtras[currentExtraIndex] = { ...currentExtra };

      setFormData({
        ...formData,
        extras: updatedExtras
      });

      toast({
        title: "Extra Updated",
        description: `${currentExtra.name} has been updated.`
      });
    } else {
      // Add new extra
      setFormData({
        ...formData,
        extras: [...formData.extras, { ...currentExtra }]
      });

      toast({
        title: "Extra Added",
        description: `${currentExtra.name} has been added.`
      });
    }

    setExtraDialogOpen(false);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);

      // Create preview URLs
      const imageUrls = fileArray.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);

      // Create preview URLs
      const imageUrls = fileArray.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const onSubmit = async (values: RoomFormValues) => {
    try {
      // Create FormData for file upload
      const formDataObj = new FormData();

      // Append form values from react-hook-form
      formDataObj.append('name', values.name);
      formDataObj.append('type', values.type);
      formDataObj.append('category', values.category);
      formDataObj.append('bedType', values.bedType);
      formDataObj.append('capacity', values.capacity.toString());
      formDataObj.append('price', values.price.toString());
      formDataObj.append('totalRooms', values.totalRooms.toString());
      formDataObj.append('description', values.description);
      formDataObj.append('isRefundable', values.isRefundable.toString());
      formDataObj.append('refundPolicy', values.refundPolicy || '');

      // Append additional form data as strings (backend expects string values)
      formDataObj.append('breakfastIncluded', formData.breakfastIncluded.toString());
      formDataObj.append('checkInTime', formData.checkInTime);
      formDataObj.append('checkOutTime', formData.checkOutTime);
      formDataObj.append('payNow', formData.payNow.toString());
      formDataObj.append('payAtHotel', formData.payAtHotel.toString());
      formDataObj.append('cancellationPolicy', formData.cancellationPolicy);
      formDataObj.append('publishWebsite', formData.publishWebsite.toString());
      formDataObj.append('publishApp', formData.publishApp.toString());
      formDataObj.append('active', formData.active.toString());

      // Append JSON fields (backend expects these as JSON strings)
      formDataObj.append('amenities', JSON.stringify(formData.amenities));
      formDataObj.append('extras', JSON.stringify(formData.extras));
      formDataObj.append('discount', JSON.stringify(formData.discount));

      // Append files
      selectedFiles.forEach(file => {
        formDataObj.append('images', file);
      });

      // Log all form data entries for debugging
      console.log("=== Form Data Contents ===");
      for (let [key, value] of formDataObj.entries()) {
        console.log(`${key}:`, value);
      }
      console.log("=== End Form Data ===");

      // Send data to backend
      const response = await axios.post("http://localhost:4000/api/rooms", formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast({
          title: "Room Added Successfully",
          description: `${values.name} has been added to your inventory.`
        });

        // Navigate back to rooms list
        navigate("/admin/rooms");
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to add room",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting room:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add room",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/rooms")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Room</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Room Details</CardTitle>
                  <CardDescription>Enter the basic information about the room.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Deluxe King Room"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="deluxe">Deluxe</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="suite">Suite</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="double">Double</SelectItem>
                              <SelectItem value="twin">Twin</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                              <SelectItem value="accessible">Accessible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bedType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bed Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bed type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="king">King</SelectItem>
                              <SelectItem value="queen">Queen</SelectItem>
                              <SelectItem value="twin">Twin</SelectItem>
                              <SelectItem value="double">Double</SelectItem>
                              <SelectItem value="single">Single</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity (Guests)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Night ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalRooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Rooms Available</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkInTime">Check-in Time</Label>
                      <Input
                        id="checkInTime"
                        name="checkInTime"
                        type="time"
                        value={formData.checkInTime}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkOutTime">Check-out Time</Label>
                      <Input
                        id="checkOutTime"
                        name="checkOutTime"
                        type="time"
                        value={formData.checkOutTime}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="breakfastIncluded"
                        checked={formData.breakfastIncluded}
                        onCheckedChange={(checked) => handleSwitchChange("breakfastIncluded", checked)}
                      />
                      <Label htmlFor="breakfastIncluded">Breakfast Included</Label>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'indent': '-1' }, { 'indent': '+1' }],
                                [{ 'align': [] }],
                                ['clean']
                              ],
                            }}
                            style={{ height: '250px', marginBottom: '50px' }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Room Amenities</CardTitle>
                    <CardDescription>Select the amenities available in this room type.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAmenity}
                    className="ml-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Amenity
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={amenity.id}
                          checked={formData.amenities.includes(amenity.id)}
                          onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked === true)}
                          className="mt-1"
                        />
                        <div className="flex flex-col">
                          <Label htmlFor={amenity.id} className="flex items-center">
                            {amenity.label}
                            <div className="ml-2 flex space-x-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEditAmenity(amenity)}
                              >
                                <Edit className="h-3 w-3 text-gray-500" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:text-red-600"
                                onClick={() => handleDeleteAmenity(amenity.id)}
                              >
                                <Trash className="h-3 w-3 text-gray-500 hover:text-red-600" />
                              </Button>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add-ons & Extras Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Add-ons & Extras (Optional)</CardTitle>
                    <CardDescription>Add extra services with additional pricing</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddExtra}
                    className="ml-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Extra
                  </Button>
                </CardHeader>
                <CardContent>
                  {formData.extras.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No extras added. Click "Add Extra" to add optional services.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.extras.map((extra, index) => (
                        <div key={index} className="flex items-center justify-between border rounded-md p-3">
                          <div className="space-y-1">
                            <p className="font-medium">{extra.name}</p>
                            <p className="text-sm text-muted-foreground">Price: ${extra.price}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditExtra(extra, index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteExtra(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment & Booking Options</CardTitle>
                  <CardDescription>Configure payment and booking settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Payment Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between border p-4 rounded-md">
                        <div>
                          <p className="font-medium">Pay Now</p>
                          <p className="text-sm text-gray-500">Allow guests to pay online when booking</p>
                        </div>
                        <Switch
                          checked={formData.payNow}
                          onCheckedChange={(checked) => handleSwitchChange("payNow", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-md">
                        <div>
                          <p className="font-medium">Pay at Hotel</p>
                          <p className="text-sm text-gray-500">Allow guests to pay during check-in</p>
                        </div>
                        <Switch
                          checked={formData.payAtHotel}
                          onCheckedChange={(checked) => handleSwitchChange("payAtHotel", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <h3 className="text-lg font-medium">Refund Policy</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure refund options for this room
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="isRefundable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Refundable Booking
                            </FormLabel>
                            <FormDescription>
                              Allow customers to cancel and receive refunds
                            </FormDescription>
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

                    {form.watch("isRefundable") && (
                      <FormField
                        control={form.control}
                        name="refundPolicy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Policy</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a refund policy" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Full refund if cancelled up to 48 hours before check-in. 50% refund if cancelled up to 24 hours before check-in.">
                                  Standard (48h full/24h partial)
                                </SelectItem>
                                <SelectItem value="Full refund if cancelled up to 72 hours before check-in. No refund after that.">
                                  Extended (72h full/no partial)
                                </SelectItem>
                                <SelectItem value="Full refund if cancelled up to 24 hours before check-in. No refund after that.">
                                  Limited (24h full/no partial)
                                </SelectItem>
                                <SelectItem value="No refunds available for this booking.">
                                  No Refunds
                                </SelectItem>
                                <SelectItem value="custom">
                                  Custom
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Or enter a custom refund policy below
                            </FormDescription>
                            {field.value === "custom" && (
                              <ReactQuill
                                theme="snow"
                                value={field.value === "custom" ? "" : field.value}
                                onChange={field.onChange}
                                modules={{
                                  toolbar: [
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['clean']
                                  ],
                                }}
                                style={{ height: '150px', marginBottom: '50px' }}
                              />
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {!form.watch("isRefundable") && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">This is a non-refundable room. No refunds will be provided for cancellations.</p>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <Label>Cancellation Policy</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("cancellationPolicy", value)}
                      value={formData.cancellationPolicy}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible (24 hour notice)</SelectItem>
                        <SelectItem value="moderate">Moderate (3 days notice)</SelectItem>
                        <SelectItem value="strict">Strict (7 days notice)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Room Images</CardTitle>
                  <CardDescription>Upload photos of the room</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Drag & drop images here</p>
                    <p className="text-xs text-gray-500 mt-1">or</p>
                    <Button
                      className="mt-2"
                      variant="outline"
                      size="sm"
                      onClick={handleFileSelect}
                    >
                      Select Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supports JPG, PNG, WEBP. Max 5MB each.
                    </p>
                  </div>

                  {/* Display selected images */}
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Room image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Discount Settings</CardTitle>
                  <CardDescription>Set special rates and discounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="discountActive">Enable Discount</Label>
                    <Switch
                      id="discountActive"
                      checked={formData.discount.active}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          discount: {
                            ...formData.discount,
                            active: checked
                          }
                        });
                      }}
                    />
                  </div>

                  {formData.discount.active && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="discountName">Discount Name (Optional)</Label>
                        <Input
                          id="discountName"
                          value={formData.discount.name}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              discount: {
                                ...formData.discount,
                                name: e.target.value
                              }
                            });
                          }}
                          placeholder="e.g., Summer Special"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Discount Type</Label>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="percentage"
                              name="discountType"
                              value="percentage"
                              checked={formData.discount.type === "percentage"}
                              onChange={() => {
                                setFormData({
                                  ...formData,
                                  discount: {
                                    ...formData.discount,
                                    type: "percentage"
                                  }
                                });
                              }}
                            />
                            <Label htmlFor="percentage">Percentage (%)</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="fixed"
                              name="discountType"
                              value="fixed"
                              checked={formData.discount.type === "fixed"}
                              onChange={() => {
                                setFormData({
                                  ...formData,
                                  discount: {
                                    ...formData.discount,
                                    type: "fixed"
                                  }
                                });
                              }}
                            />
                            <Label htmlFor="fixed">Fixed Amount ($)</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discountValue">
                          Discount {formData.discount.type === "percentage" ? "Percentage" : "Amount"}
                        </Label>
                        <Input
                          id="discountValue"
                          type="number"
                          value={formData.discount.value}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              discount: {
                                ...formData.discount,
                                value: parseFloat(e.target.value) || 0
                              }
                            });
                          }}
                          min={0}
                          max={formData.discount.type === "percentage" ? 100 : undefined}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discountCapacity">Guest Limit (0 = unlimited)</Label>
                        <Input
                          id="discountCapacity"
                          type="number"
                          value={formData.discount.capacity}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              discount: {
                                ...formData.discount,
                                capacity: parseInt(e.target.value) || 0
                              }
                            });
                          }}
                          min={0}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                  <CardDescription>Control where this room appears</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Publish on Website</p>
                      <p className="text-sm text-gray-500">Show this room on the hotel website</p>
                    </div>
                    <Switch
                      checked={formData.publishWebsite}
                      onCheckedChange={(checked) => handleSwitchChange("publishWebsite", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Publish on Mobile App</p>
                      <p className="text-sm text-gray-500">Show this room in the mobile app</p>
                    </div>
                    <Switch
                      checked={formData.publishApp}
                      onCheckedChange={(checked) => handleSwitchChange("publishApp", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="font-medium">Room Status</p>
                      <p className="text-sm text-gray-500">Is this room active and bookable?</p>
                    </div>
                    <Switch
                      checked={formData.active}
                      onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button type="submit" className="w-full bg-hotel-primary hover:bg-opacity-90">
                    Save Room
                  </Button>
                  <Button type="button" variant="outline" className="w-full mt-2" onClick={() => navigate("/admin/rooms")}>
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={amenityDialogOpen} onOpenChange={setAmenityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingAmenity ? "Edit Amenity" : "Add New Amenity"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amenity-id">Amenity ID</Label>
              <Input
                id="amenity-id"
                value={currentAmenity.id}
                onChange={(e) => setCurrentAmenity({ ...currentAmenity, id: e.target.value })}
                placeholder="e.g., wifi"
                disabled={isEditingAmenity}
              />
              <p className="text-xs text-gray-500">Unique identifier for this amenity</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenity-label">Display Name</Label>
              <Input
                id="amenity-label"
                value={currentAmenity.label}
                onChange={(e) => setCurrentAmenity({ ...currentAmenity, label: e.target.value })}
                placeholder="e.g., Free Wi-Fi"
              />
              <p className="text-xs text-gray-500">Name displayed to users</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAmenityDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveAmenity}
            >
              {isEditingAmenity ? "Update" : "Add"} Amenity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extra Dialog */}
      <Dialog open={extraDialogOpen} onOpenChange={setExtraDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingExtra ? "Edit Extra" : "Add New Extra"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="extra-name">Name</Label>
              <Input
                id="extra-name"
                value={currentExtra.name}
                onChange={(e) => setCurrentExtra({ ...currentExtra, name: e.target.value })}
                placeholder="e.g., Hot Stones"
              />
              <p className="text-xs text-gray-500">Name of the extra service</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra-price">Price ($)</Label>
              <Input
                id="extra-price"
                type="number"
                min="0"
                step="0.01"
                value={currentExtra.price}
                onChange={(e) => setCurrentExtra({
                  ...currentExtra,
                  price: parseFloat(e.target.value) || 0
                })}
                placeholder="e.g., 15.00"
              />
              <p className="text-xs text-gray-500">Additional cost for this service</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setExtraDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveExtra}
            >
              {isEditingExtra ? "Update" : "Add"} Extra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRoomPage;

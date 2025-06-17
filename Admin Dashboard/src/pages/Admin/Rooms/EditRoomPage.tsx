import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowLeft, Upload, Plus, Edit, Trash, X, Check } from "lucide-react";
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

const EditRoomPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [amenityDialogOpen, setAmenityDialogOpen] = useState(false);
    const [currentAmenity, setCurrentAmenity] = useState({ id: "", label: "" });
    const [isEditingAmenity, setIsEditingAmenity] = useState(false);
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

    const [formData, setFormData] = useState({
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
    });

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

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/rooms/${id}`);
                if (response.data.success) {
                    const roomData = response.data.data;
                    form.reset({
                        name: roomData.name,
                        type: roomData.type,
                        category: roomData.category,
                        bedType: roomData.bedType,
                        capacity: roomData.capacity,
                        price: roomData.price,
                        totalRooms: roomData.totalRooms,
                        description: roomData.description,
                        isRefundable: roomData.isRefundable,
                        refundPolicy: roomData.refundPolicy,
                        breakfastIncluded: roomData.breakfastIncluded,
                        checkInTime: roomData.checkInTime,
                        checkOutTime: roomData.checkOutTime,
                        amenities: roomData.amenities || [],
                        payNow: roomData.payNow,
                        payAtHotel: roomData.payAtHotel,
                        discount: roomData.discount || {},
                        cancellationPolicy: roomData.cancellationPolicy,
                        publishWebsite: roomData.publishWebsite,
                        publishApp: roomData.publishApp,
                        active: roomData.active,
                        images: roomData.images || []
                    });
                    setFormData({
                        breakfastIncluded: roomData.breakfastIncluded,
                        checkInTime: roomData.checkInTime || "14:00",
                        checkOutTime: roomData.checkOutTime || "12:00",
                        amenities: roomData.amenities || [],
                        payNow: roomData.payNow,
                        payAtHotel: roomData.payAtHotel,
                        discount: roomData.discount || {
                            name: "",
                            type: "percentage",
                            value: 0,
                            capacity: 0,
                            active: false,
                            publishWebsite: true,
                            publishApp: true
                        },
                        cancellationPolicy: roomData.cancellationPolicy || "flexible",
                        publishWebsite: roomData.publishWebsite,
                        publishApp: roomData.publishApp,
                        active: roomData.active,
                        images: roomData.images || []
                    });
                    console.log("Loaded room data:", roomData);
                }
            } catch (error) {
                console.error("Error fetching room data:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch room data",
                    variant: "destructive",
                });
                navigate("/admin/rooms");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoomData();
        }
    }, [id, form, navigate, toast]);

    // Handler functions
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

    // File handling functions
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
        // If we're removing a new file (that has a URL created by URL.createObjectURL)
        if (typeof formData.images[index] === 'string' && formData.images[index].startsWith('blob:')) {
            // Remove from selectedFiles array too
            const fileIndex = selectedFiles.findIndex((_, i) => i === index - (formData.images.length - selectedFiles.length));
            if (fileIndex !== -1) {
                setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
            }
        }

        // Remove from formData.images
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const onSubmit = async (values: RoomFormValues) => {
        try {
            const formDataObj = new FormData();

            // Log what we're submitting
            console.log("Submitting data:", values);
            console.log("FormData:", formData);
            console.log("Selected files:", selectedFiles);

            // Create a combined data object with all values
            const combinedData = {
                ...values,
                // Override specific values from formData
                breakfastIncluded: formData.breakfastIncluded,
                checkInTime: formData.checkInTime,
                checkOutTime: formData.checkOutTime,
                amenities: formData.amenities,
                payNow: formData.payNow,
                payAtHotel: formData.payAtHotel,
                discount: formData.discount,
                cancellationPolicy: formData.cancellationPolicy,
                publishWebsite: formData.publishWebsite,
                publishApp: formData.publishApp,
                active: formData.active
            };

            console.log("Combined data:", combinedData);

            // Append all data as single values (not arrays)
            Object.entries(combinedData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'images') {
                        // Skip images as they'll be handled separately
                    } else if (key === 'amenities') {
                        formDataObj.append(key, JSON.stringify(value));
                    } else if (typeof value === 'boolean') {
                        formDataObj.append(key, value.toString());
                    } else if (typeof value === 'object') {
                        formDataObj.append(key, JSON.stringify(value));
                    } else {
                        formDataObj.append(key, String(value));
                    }
                }
            });

            // Only include existing server images (not the blob URLs)
            const existingImages = formData.images.filter(img =>
                typeof img === 'string' && !img.startsWith('blob:')
            );
            formDataObj.append('existingImages', JSON.stringify(existingImages));

            // Append files - only new files are in the selectedFiles array
            if (selectedFiles.length > 0) {
                selectedFiles.forEach(file => {
                    formDataObj.append('images', file);
                });
            }

            // Log the FormData before sending
            console.log("Form data entries:");
            for (let [key, value] of formDataObj.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await axios.put(
                `http://localhost:4000/api/rooms/${id}`,
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
                navigate("/admin/rooms");
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
        return <div className="flex items-center justify-center h-screen">
            <div className="text-xl">Loading...</div>
        </div>;
    }

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';

        // If it's a blob URL (new uploaded image preview)
        if (typeof imagePath === 'string' && imagePath.startsWith('blob:')) {
            return imagePath;
        }

        // If it's a full URL
        if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
            return imagePath;
        }

        // Otherwise it's a relative path from the server
        return `http://localhost:4000/uploads/rooms/${imagePath}`;
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
                <h1 className="text-2xl font-bold">Edit Room</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Room Details Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Room Details</CardTitle>
                                    <CardDescription>Update the basic information about the room.</CardDescription>
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
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(Number(e.target.value))
                                                            }}
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
                                                            onChange={(e) => {
                                                                field.onChange(Number(e.target.value))
                                                            }}
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
                                                    <FormLabel>Total Rooms</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(Number(e.target.value))
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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

                            {/* Amenities Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Amenities</CardTitle>
                                    <CardDescription>Select the amenities available in this room.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {availableAmenities.map((amenity) => (
                                            <div className="flex items-center space-x-2" key={amenity.id}>
                                                <Checkbox
                                                    id={`amenity-${amenity.id}`}
                                                    checked={formData.amenities.includes(amenity.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleAmenityChange(amenity.id, checked as boolean)
                                                    }
                                                />
                                                <label
                                                    htmlFor={`amenity-${amenity.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {amenity.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddAmenity}
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add New Amenity
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Room Options Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Room Options</CardTitle>
                                    <CardDescription>Configure additional room options and services.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="breakfastIncluded" className="font-medium">
                                                Breakfast Included
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                Room rate includes breakfast
                                            </p>
                                        </div>
                                        <Switch
                                            id="breakfastIncluded"
                                            checked={formData.breakfastIncluded}
                                            onCheckedChange={(checked) =>
                                                handleSwitchChange("breakfastIncluded", checked)
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <Label className="font-medium">Check-in/Check-out Time</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="checkInTime" className="text-sm">Check-in</Label>
                                                <Input
                                                    id="checkInTime"
                                                    type="time"
                                                    value={formData.checkInTime}
                                                    onChange={(e) => handleChange(e)}
                                                    name="checkInTime"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="checkOutTime" className="text-sm">Check-out</Label>
                                                <Input
                                                    id="checkOutTime"
                                                    type="time"
                                                    value={formData.checkOutTime}
                                                    onChange={(e) => handleChange(e)}
                                                    name="checkOutTime"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment and Cancellation Policies */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment & Cancellation</CardTitle>
                                    <CardDescription>Set payment options and cancellation policies.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="font-medium">Payment Options</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between border rounded-md p-3">
                                                <Label htmlFor="payNow" className="font-normal">
                                                    Pay Online
                                                </Label>
                                                <Switch
                                                    id="payNow"
                                                    checked={formData.payNow}
                                                    onCheckedChange={(checked) =>
                                                        handleSwitchChange("payNow", checked)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between border rounded-md p-3">
                                                <Label htmlFor="payAtHotel" className="font-normal">
                                                    Pay at Hotel
                                                </Label>
                                                <Switch
                                                    id="payAtHotel"
                                                    checked={formData.payAtHotel}
                                                    onCheckedChange={(checked) =>
                                                        handleSwitchChange("payAtHotel", checked)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="isRefundable" className="font-medium">
                                                Refundable
                                            </Label>
                                            <FormField
                                                control={form.control}
                                                name="isRefundable"
                                                render={({ field }) => (
                                                    <Switch
                                                        id="isRefundable"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="refundPolicy"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Refund Policy</FormLabel>
                                                    <FormControl>
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            modules={{
                                                                toolbar: [
                                                                    ['bold', 'italic', 'underline'],
                                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                    ['clean']
                                                                ],
                                                            }}
                                                            style={{ height: '150px', marginBottom: '50px' }}
                                                            readOnly={!form.watch("isRefundable")}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="font-medium">Cancellation Policy</Label>
                                        <RadioGroup
                                            value={formData.cancellationPolicy}
                                            onValueChange={(value) => handleSelectChange("cancellationPolicy", value)}
                                        >
                                            <div className="flex items-start space-x-2">
                                                <RadioGroupItem value="flexible" id="flexible" />
                                                <Label htmlFor="flexible" className="font-normal">
                                                    <span className="block font-medium">Flexible</span>
                                                    <span className="block text-sm text-gray-500">Free cancellation up to 24 hours before check-in</span>
                                                </Label>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <RadioGroupItem value="moderate" id="moderate" />
                                                <Label htmlFor="moderate" className="font-normal">
                                                    <span className="block font-medium">Moderate</span>
                                                    <span className="block text-sm text-gray-500">Free cancellation up to 5 days before check-in</span>
                                                </Label>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <RadioGroupItem value="strict" id="strict" />
                                                <Label htmlFor="strict" className="font-normal">
                                                    <span className="block font-medium">Strict</span>
                                                    <span className="block text-sm text-gray-500">No refunds for cancellations</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Discounts Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Discounts</CardTitle>
                                    <CardDescription>Set promotional discounts for this room.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-medium">Enable Discount</Label>
                                        <Switch
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
                                        <div className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="discountName">Discount Name</Label>
                                                    <Input
                                                        id="discountName"
                                                        placeholder="e.g., Summer Special"
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
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="discountType">Discount Type</Label>
                                                    <Select
                                                        value={formData.discount.type}
                                                        onValueChange={(value) => {
                                                            setFormData({
                                                                ...formData,
                                                                discount: {
                                                                    ...formData.discount,
                                                                    type: value
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <SelectTrigger id="discountType">
                                                            <SelectValue placeholder="Select discount type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                            <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="discountValue">
                                                        {formData.discount.type === "percentage" ? "Percentage (%)" : "Amount ($)"}
                                                    </Label>
                                                    <Input
                                                        id="discountValue"
                                                        type="number"
                                                        min="0"
                                                        max={formData.discount.type === "percentage" ? "100" : undefined}
                                                        placeholder={formData.discount.type === "percentage" ? "10" : "50"}
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
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="discountCapacity">Rooms Available at Discount</Label>
                                                    <Input
                                                        id="discountCapacity"
                                                        type="number"
                                                        min="0"
                                                        placeholder="5"
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
                                                    />
                                                    <p className="text-xs text-gray-500">Set to 0 for unlimited</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right side column with room images */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Room Images</CardTitle>
                                    <CardDescription>Upload photos of the room.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                            }`}
                                        onClick={handleFileSelect}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-500">
                                            Drag and drop your images here, or click to browse
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Supported formats: JPEG, PNG, WebP
                                        </p>
                                    </div>

                                    {formData.images.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {formData.images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={typeof image === 'string' ? getImageUrl(image) : image}
                                                        alt={`Room preview ${index + 1}`}
                                                        className="h-24 w-full object-cover rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-4 w-4 text-red-500" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Publishing Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publishing Settings</CardTitle>
                                    <CardDescription>Control where this room is displayed.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="publishWebsite" className="font-medium">
                                                Website
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                Show this room on the hotel website
                                            </p>
                                        </div>
                                        <Switch
                                            id="publishWebsite"
                                            checked={formData.publishWebsite}
                                            onCheckedChange={(checked) =>
                                                handleSwitchChange("publishWebsite", checked)
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="publishApp" className="font-medium">
                                                Mobile App
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                Show this room on the mobile app
                                            </p>
                                        </div>
                                        <Switch
                                            id="publishApp"
                                            checked={formData.publishApp}
                                            onCheckedChange={(checked) =>
                                                handleSwitchChange("publishApp", checked)
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="active" className="font-medium">
                                                Active
                                            </Label>
                                            <p className="text-sm text-gray-500">
                                                Room is available for booking
                                            </p>
                                        </div>
                                        <Switch
                                            id="active"
                                            checked={formData.active}
                                            onCheckedChange={(checked) =>
                                                handleSwitchChange("active", checked)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <Card className="bg-gray-50">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">Ready to update this room?</h3>
                                        <p className="text-sm text-gray-500">Save your changes to update this room in your inventory.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => navigate("/admin/rooms")}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="bg-hotel-primary hover:bg-opacity-90"
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Update Room
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </Form>

            {/* Amenity Dialog */}
            <Dialog open={amenityDialogOpen} onOpenChange={setAmenityDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditingAmenity ? "Edit Amenity" : "Add New Amenity"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amenityId">ID</Label>
                            <Input
                                id="amenityId"
                                value={currentAmenity.id}
                                onChange={(e) => setCurrentAmenity({ ...currentAmenity, id: e.target.value })}
                                placeholder="e.g., wifi"
                                disabled={isEditingAmenity}
                            />
                            <p className="text-xs text-gray-500">
                                A unique identifier for this amenity (no spaces).
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amenityLabel">Label</Label>
                            <Input
                                id="amenityLabel"
                                value={currentAmenity.label}
                                onChange={(e) => setCurrentAmenity({ ...currentAmenity, label: e.target.value })}
                                placeholder="e.g., Free Wi-Fi"
                            />
                            <p className="text-xs text-gray-500">
                                The display name shown to users.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAmenityDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={saveAmenity}>
                            {isEditingAmenity ? "Save Changes" : "Add Amenity"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditRoomPage; 
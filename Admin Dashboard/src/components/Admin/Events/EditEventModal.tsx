import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign, Users, Plus, X, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// API endpoint for events
const EVENTS_API_URL = "http://localhost:4000/api/events";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    date: z.date(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in format HH:MM"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in format HH:MM"),
    bookingDeadlineDate: z.date(),
    bookingDeadlineTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in format HH:MM"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    price: z.number().min(0, "Price must be a positive number"),
    maxAttendees: z.number().int().min(1, "Maximum attendees must be at least 1"),
    image: z.instanceof(FileList).optional(),
    addons: z.array(
        z.object({
            name: z.string().min(1, "Add-on name is required"),
            price: z.number().min(0, "Price must be a positive number"),
        })
    ).optional(),
    isRefundable: z.boolean().default(true),
    refundPolicy: z.string().min(5, "Refund policy must be at least 5 characters long").optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Interface for event from API
interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    price: number;
    maxAttendees: number;
    currentAttendees: number;
    status: string;
    bookingDeadlineDate: string;
    bookingDeadlineTime: string;
    isRefundable: boolean;
    refundPolicy: string;
    addons: Array<{
        name: string;
        price: number;
        _id: string;
    }>;
    images: string[];
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string | null;
    onSuccess: () => void;
}

const EditEventModal = ({ isOpen, onClose, eventId, onSuccess }: EditEventModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [addons, setAddons] = useState<{ name: string; price: number; _id?: string }[]>([]);
    const [addonName, setAddonName] = useState("");
    const [addonPrice, setAddonPrice] = useState(0);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            startTime: "18:00",
            endTime: "21:00",
            bookingDeadlineDate: new Date(),
            bookingDeadlineTime: "12:00",
            location: "",
            price: 0,
            maxAttendees: 50,
            addons: [],
            isRefundable: true,
            refundPolicy: "Full refund if cancelled 48 hours before the event. 50% refund if cancelled 24 hours before.",
        },
    });

    const isRefundable = form.watch("isRefundable");

    // Fetch event data when modal is opened
    useEffect(() => {
        if (isOpen && eventId) {
            const fetchEvent = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get(`${EVENTS_API_URL}/${eventId}`);

                    if (response.data && response.data.data) {
                        const event: Event = response.data.data;

                        // Convert string dates to Date objects
                        const eventDate = new Date(event.date);
                        const bookingDeadlineDate = new Date(event.bookingDeadlineDate);

                        // Set form values
                        form.reset({
                            title: event.title,
                            description: event.description,
                            date: eventDate,
                            startTime: event.startTime,
                            endTime: event.endTime,
                            bookingDeadlineDate: bookingDeadlineDate,
                            bookingDeadlineTime: event.bookingDeadlineTime,
                            location: event.location,
                            price: event.price,
                            maxAttendees: event.maxAttendees,
                            isRefundable: event.isRefundable,
                            refundPolicy: event.refundPolicy,
                        });

                        // Set addons
                        if (event.addons && event.addons.length > 0) {
                            setAddons(event.addons.map(addon => ({
                                name: addon.name,
                                price: addon.price,
                                _id: addon._id
                            })));
                        } else {
                            setAddons([]);
                        }

                        // Set existing images
                        if (event.images && event.images.length > 0) {
                            setExistingImages(event.images);
                        } else {
                            setExistingImages([]);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching event:", error);
                    toast.error("Failed to load event data");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchEvent();
        } else {
            // Clear form when closed
            form.reset();
            setAddons([]);
            setExistingImages([]);
            setPreviewImage(null);
        }
    }, [isOpen, eventId, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Create preview URL for the image
        const imageUrl = URL.createObjectURL(files[0]);
        setPreviewImage(imageUrl);
    };

    const onSubmit = async (data: FormValues) => {
        if (!eventId) return;

        setIsSubmitting(true);

        try {
            // Create a FormData object to send files along with other data
            const formData = new FormData();

            // Add form fields to FormData
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("date", data.date.toISOString());
            formData.append("startTime", data.startTime);
            formData.append("endTime", data.endTime);
            formData.append("bookingDeadlineDate", data.bookingDeadlineDate.toISOString());
            formData.append("bookingDeadlineTime", data.bookingDeadlineTime);
            formData.append("location", data.location);
            formData.append("price", data.price.toString());
            formData.append("maxAttendees", data.maxAttendees.toString());
            formData.append("isRefundable", data.isRefundable.toString());

            if (data.refundPolicy) {
                formData.append("refundPolicy", data.refundPolicy);
            }

            // Add addons as JSON string
            formData.append("addons", JSON.stringify(addons));

            // Add existing images
            formData.append("existingImages", JSON.stringify(existingImages));

            // Add new image if selected
            if (data.image && data.image.length > 0) {
                formData.append("images", data.image[0]);
            }

            // Default values
            formData.append("publishWebsite", "true");
            formData.append("publishApp", "true");
            formData.append("active", "true");

            // Make API call to update the event
            await axios.put(`${EVENTS_API_URL}/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Event updated successfully");

            // Cleanup preview image
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }

            // Close modal and refresh list
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error(axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "There was a problem updating your event");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddAddon = () => {
        if (addonName.trim() === "" || addonPrice < 0) return;

        setAddons([...addons, { name: addonName, price: addonPrice }]);
        setAddonName("");
        setAddonPrice(0);
    };

    const handleRemoveAddon = (index: number) => {
        const newAddons = [...addons];
        newAddons.splice(index, 1);
        setAddons(newAddons);
    };

    const handleRemoveExistingImage = (index: number) => {
        const newExistingImages = [...existingImages];
        newExistingImages.splice(index, 1);
        setExistingImages(newExistingImages);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                        <span>Loading event data...</span>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Title*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter event title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description*</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter event description"
                                                        className="min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location*</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                        <Input placeholder="Enter location" className="pl-10" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Date*</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="startTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Start Time*</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                            <Input
                                                                placeholder="HH:MM"
                                                                className="pl-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="endTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>End Time*</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                            <Input
                                                                placeholder="HH:MM"
                                                                className="pl-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price*</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="pl-10"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="maxAttendees"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Max Attendees*</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                            <Input
                                                                type="number"
                                                                placeholder="50"
                                                                className="pl-10"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Booking Deadline</h3>
                                    <div className="space-y-3">
                                        <FormField
                                            control={form.control}
                                            name="bookingDeadlineDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Deadline Date*</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="bookingDeadlineTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Deadline Time*</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                            <Input
                                                                placeholder="HH:MM"
                                                                className="pl-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Refund Policy</h3>
                                    <div className="space-y-3">
                                        <FormField
                                            control={form.control}
                                            name="isRefundable"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                    <div>
                                                        <FormLabel className="text-base mb-0">Refundable Event</FormLabel>
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

                                        {isRefundable && (
                                            <FormField
                                                control={form.control}
                                                name="refundPolicy"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Refund Policy</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a refund policy" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Full refund if cancelled 48 hours before the event. 50% refund if cancelled 24 hours before.">
                                                                    Standard (48h full/24h partial)
                                                                </SelectItem>
                                                                <SelectItem value="Full refund if cancelled 7 days before the event. 50% refund if cancelled 72 hours before.">
                                                                    Extended (7 days full/72h partial)
                                                                </SelectItem>
                                                                <SelectItem value="Full refund if cancelled 24 hours before the event. No refund after that.">
                                                                    Limited (24h full/no partial)
                                                                </SelectItem>
                                                                <SelectItem value="No refunds available for this event.">
                                                                    No Refunds
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Or enter custom refund policy"
                                                                className="mt-2"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h3 className="text-sm font-medium">Optional Add-ons</h3>
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <FormLabel>Add-on Name</FormLabel>
                                        <Input
                                            placeholder="e.g., Premium Drink Package"
                                            value={addonName}
                                            onChange={(e) => setAddonName(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <FormLabel>Price</FormLabel>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-10"
                                                value={addonPrice}
                                                onChange={(e) => setAddonPrice(parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <Button type="button" onClick={handleAddAddon} className="mb-0.5">
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                </div>

                                {addons.length > 0 && (
                                    <div className="bg-muted p-3 rounded-md">
                                        <h4 className="text-sm font-medium mb-2">Added Options:</h4>
                                        <div className="space-y-2">
                                            {addons.map((addon, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="font-normal">
                                                            ${addon.price.toFixed(2)}
                                                        </Badge>
                                                        <span>{addon.name}</span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveAddon(index)}
                                                    >
                                                        <X className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h3 className="text-sm font-medium">Event Images</h3>

                                {/* Display existing images */}
                                {existingImages.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-xs text-muted-foreground">Current Images:</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {existingImages.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={`http://localhost:4000/uploads/events/${image}`}
                                                        alt={`Event ${index}`}
                                                        className="rounded-md w-full h-24 object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleRemoveExistingImage(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add new image */}
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel>Add New Image (Optional)</FormLabel>
                                            <FormControl>
                                                <div className="space-y-3">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        {...fieldProps}
                                                        onChange={(e) => {
                                                            onChange(e.target.files);
                                                            handleImageChange(e);
                                                        }}
                                                    />

                                                    {previewImage && (
                                                        <div className="mt-2">
                                                            <p className="text-xs text-muted-foreground mb-1">New Image Preview:</p>
                                                            <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                                                                <img
                                                                    src={previewImage}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    className="absolute top-1 right-1 h-6 w-6"
                                                                    onClick={() => {
                                                                        URL.revokeObjectURL(previewImage);
                                                                        setPreviewImage(null);
                                                                        onChange(null);
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Updating..." : "Update Event"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditEventModal; 
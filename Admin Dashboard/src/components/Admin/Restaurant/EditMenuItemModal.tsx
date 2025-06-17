import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, X, Upload, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    category: z.string().min(1, { message: "Please select a category" }),
    price: z.coerce.number().positive({ message: "Price must be a positive number" }),
    preparationTime: z.coerce.number().int().positive({ message: "Preparation time must be a positive number" }),
    ingredients: z.string().min(5, { message: "Ingredients must be at least 5 characters" }),
    available: z.boolean().default(true),
    extras: z.array(
        z.object({
            name: z.string().min(1, { message: "Extra name is required" }),
            price: z.coerce.number().min(0, { message: "Price must be a non-negative number" })
        })
    ).default([]),
});

type FormData = z.infer<typeof formSchema>;

// Define interfaces
interface Extra {
    name: string;
    price: number;
}

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    preparationTime: number;
    ingredients: string;
    available: boolean;
    extras: Extra[];
    images: string[];
}

// Interface for menu categories
interface MenuCategory {
    _id: string;
    name: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface EditMenuItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuItemId: string | null;
    onSuccess: () => void;
}

const MENU_ITEMS_ENDPOINT = "http://localhost:4000/api/restaurant/menu-items";
const MENU_CATEGORIES_ENDPOINT = "http://localhost:4000/api/restaurant/menu-categories";

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
    isOpen,
    onClose,
    menuItemId,
    onSuccess
}) => {
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [extraName, setExtraName] = useState("");
    const [extraPrice, setExtraPrice] = useState("");
    const [extras, setExtras] = useState<Extra[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            price: undefined,
            preparationTime: undefined,
            ingredients: "",
            available: true,
            extras: [],
        },
    });

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await axios.get(`${MENU_CATEGORIES_ENDPOINT}?active=true`);
            
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // Sort categories by sortOrder
                const sortedCategories = response.data.data.sort((a: MenuCategory, b: MenuCategory) => a.sortOrder - b.sortOrder);
                setCategories(sortedCategories);
            } else if (response.data && Array.isArray(response.data)) {
                const sortedCategories = response.data.sort((a: MenuCategory, b: MenuCategory) => a.sortOrder - b.sortOrder);
                setCategories(sortedCategories);
            } else {
                console.error("Unexpected API response format:", response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories. Please create categories first.");
            setCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    // Fetch categories when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !menuItemId) {
            return;
        }

        const fetchMenuItem = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${MENU_ITEMS_ENDPOINT}/${menuItemId}`);
                const menuItem: MenuItem = response.data.data;

                // Set form values
                form.reset({
                    name: menuItem.name,
                    description: menuItem.description,
                    category: menuItem.category,
                    price: menuItem.price,
                    preparationTime: menuItem.preparationTime,
                    ingredients: menuItem.ingredients,
                    available: menuItem.available,
                    extras: menuItem.extras || [],
                });

                // Set existing images
                setExistingImages(menuItem.images);
                
                // Set extras state for UI
                setExtras(menuItem.extras || []);
            } catch (error) {
                console.error("Error fetching menu item:", error);
                toast.error("Failed to load menu item data");
                onClose();
            } finally {
                setIsLoading(false);
            }
        };

        if (menuItemId) {
            fetchMenuItem();
        }
    }, [isOpen, menuItemId, form, onClose]);

    const addExtra = () => {
        if (!extraName.trim()) {
            toast.error("Extra name is required");
            return;
        }

        const priceValue = parseFloat(extraPrice);
        if (isNaN(priceValue) || priceValue < 0) {
            toast.error("Price must be a valid non-negative number");
            return;
        }

        const newExtra = { name: extraName, price: priceValue };
        const updatedExtras = [...extras, newExtra];
        setExtras(updatedExtras);
        form.setValue("extras", updatedExtras);
        
        // Reset inputs
        setExtraName("");
        setExtraPrice("");
    };

    const removeExtra = (index: number) => {
        const updatedExtras = extras.filter((_, i) => i !== index);
        setExtras(updatedExtras);
        form.setValue("extras", updatedExtras);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Store the FileList object
        setSelectedFiles(files);

        // Create preview URLs for each file
        const newPreviews: string[] = [];
        for (let i = 0; i < files.length; i++) {
            newPreviews.push(URL.createObjectURL(files[i]));
        }

        // Clear previous new preview URLs to avoid memory leaks
        previewImages.forEach(url => URL.revokeObjectURL(url));

        setPreviewImages(newPreviews);
    };

    const removeNewImage = (index: number) => {
        if (!selectedFiles) return;

        // Create a new FileList-like object without the removed image
        const dt = new DataTransfer();

        for (let i = 0; i < selectedFiles.length; i++) {
            if (i !== index) {
                dt.items.add(selectedFiles[i]);
            }
        }

        // Update selected files
        setSelectedFiles(dt.files.length > 0 ? dt.files : null);

        // Update previews
        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const onSubmit = async (values: FormData) => {
        if (!menuItemId) return;

        try {
            setIsSubmitting(true);

            // Create a form data object to send files and other data
            const formData = new FormData();

            // Add form fields to the formData
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("category", values.category);
            formData.append("price", values.price.toString());
            formData.append("preparationTime", values.preparationTime.toString());
            formData.append("ingredients", values.ingredients);
            formData.append("available", values.available.toString());
            
            // Add extras as JSON string
            formData.append("extras", JSON.stringify(values.extras));

            // Add new images if any are selected
            if (selectedFiles && selectedFiles.length > 0) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    formData.append("images", selectedFiles[i]);
                }
            }

            // Make PUT request with axios
            const response = await axios.put(`${MENU_ITEMS_ENDPOINT}/${menuItemId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(response.data.message || "Menu item updated successfully");

            // Clean up preview URLs
            previewImages.forEach(url => URL.revokeObjectURL(url));

            // Close modal and refresh data
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating menu item:", error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Failed to update menu item");
            } else {
                toast.error("An error occurred while updating the menu item");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Clean up preview URLs before closing
        previewImages.forEach(url => URL.revokeObjectURL(url));
        setPreviewImages([]);
        setSelectedFiles(null);
        setExtras([]);
        setExtraName("");
        setExtraPrice("");
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Menu Item</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Loading menu item data...</span>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Item Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter item name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categoriesLoading ? (
                                                        <div className="flex items-center justify-center py-2">
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                            <span className="text-sm">Loading...</span>
                                                        </div>
                                                    ) : categories.length === 0 ? (
                                                        <div className="px-2 py-2 text-sm text-muted-foreground">
                                                            No categories found. Please create categories first.
                                                        </div>
                                                    ) : (
                                                        categories.map((category) => (
                                                            <SelectItem key={category._id} value={category.name}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="preparationTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preparation Time (minutes)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="15" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="col-span-1 md:col-span-2">
                                    <FormLabel className="text-sm font-medium">Images</FormLabel>
                                    <div className="space-y-4 mt-2">
                                        {/* Existing Images */}
                                        {existingImages.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium">Current Images</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {existingImages.map((url, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={`http://localhost:4000${url}`}
                                                                alt={`Menu item ${index}`}
                                                                className="rounded-md w-full h-24 object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Uploading new images will replace all current images
                                                </p>
                                            </div>
                                        )}

                                        {/* Upload new images */}
                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => document.getElementById('modal-image-upload')?.click()}>
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">
                                                Click to upload new images or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                PNG, JPG, WEBP up to 5MB each
                                            </p>
                                            <Input
                                                id="modal-image-upload"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </div>

                                        {/* Preview of new images */}
                                        {previewImages.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium">New Images to Upload</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {previewImages.map((url, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={url}
                                                                alt={`Preview ${index}`}
                                                                className="rounded-md w-full h-24 object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => removeNewImage(index)}
                                                            >
                                                                <X className="h-4 w-4 text-white" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <FormLabel className="text-sm font-medium">Add-ons & Extras (Optional)</FormLabel>
                                    <div className="space-y-4 mt-2 p-4 border rounded-md">
                                        <div className="text-sm text-gray-600">Add extra services with additional pricing</div>
                                        
                                        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                                            <Input
                                                placeholder="Extra name"
                                                value={extraName}
                                                onChange={(e) => setExtraName(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Price ($)"
                                                value={extraPrice}
                                                onChange={(e) => setExtraPrice(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button type="button" onClick={addExtra} variant="outline">
                                                <Plus className="h-4 w-4 mr-2" /> Add Extra
                                            </Button>
                                        </div>
                                        
                                        {extras.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {extras.map((extra, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                                        {extra.name} (${extra.price.toFixed(2)})
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExtra(index)}
                                                            className="ml-1 text-gray-500 hover:text-red-500"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500 mt-2">No extras added. Click "Add Extra" to add optional items.</div>
                                        )}
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="ingredients"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>Ingredients</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="List the ingredients separated by commas"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter a detailed description of the menu item"
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
                                    name="available"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Available</FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Make this item available on the menu
                                                </p>
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
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditMenuItemModal; 
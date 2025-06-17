import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

type ServiceDuration = {
  id: string;
  duration: string;
  price: string;
};

type AddOn = {
  id: string;
  name: string;
  price: string;
  selected: boolean;
};

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Specialist {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  status?: string;
}

interface SpaService {
  _id: string;
  title: string;
  description: string;
  categoryId: {
    _id: string;
    name: string;
  };
  specialist: string;
  specialistId: string;
  availability: string;
  status: string;
  isRefundable: boolean;
  refundPolicy: string;
  durations: {
    duration: string;
    price: number;
    _id?: string;
  }[];
  addons: {
    name: string;
    price: number;
    selected: boolean;
    _id?: string;
  }[];
  images: string[];
  popularityScore?: number;
}

interface AddSpaServiceFormProps {
  serviceToEdit?: SpaService;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Service name must be at least 2 characters.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
  specialist: z.string().min(1, { message: 'Please select a specialist.' }),
  availability: z.string().optional(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  status: z.string().default('available'),
});

const AddSpaServiceForm = ({ serviceToEdit }: AddSpaServiceFormProps) => {
  const navigate = useNavigate();
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingSpecialists, setIsLoadingSpecialists] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [durations, setDurations] = useState<ServiceDuration[]>([
    { id: '1', duration: '30', price: '50' },
    { id: '2', duration: '60', price: '100' },
  ]);

  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: '1', name: 'Hot Stones', price: '15', selected: false },
    { id: '2', name: 'Essential Oils', price: '10', selected: false },
  ]);

  const [isRefundable, setIsRefundable] = useState(true);
  const [refundPolicy, setRefundPolicy] = useState('Full refund if cancelled up to 48 hours before appointment. 50% refund if cancelled up to 24 hours before appointment.');

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await axios.get('http://localhost:4000/api/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          console.error('Failed to fetch categories:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch specialists from API
  useEffect(() => {
    const fetchSpecialists = async () => {
      setIsLoadingSpecialists(true);
      try {
        const response = await axios.get('http://localhost:4000/api/specialists');
        if (response.data.success) {
          setSpecialists(response.data.data.filter((specialist: Specialist) =>
            specialist.status === 'active'
          ));
        } else {
          console.error('Failed to fetch specialists:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching specialists:', error);
      } finally {
        setIsLoadingSpecialists(false);
      }
    };

    fetchSpecialists();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      specialist: '',
      availability: '',
      description: '',
      status: 'available',
    },
  });

  // Initialize form with service data when in edit mode
  useEffect(() => {
    if (serviceToEdit) {
      setIsEditMode(true);
      console.log("Initializing form with service data:", serviceToEdit);

      // Set form values
      form.reset({
        name: serviceToEdit.title,
        category: serviceToEdit.categoryId._id,
        specialist: serviceToEdit.specialistId,
        availability: serviceToEdit.availability,
        description: serviceToEdit.description,
        status: serviceToEdit.status === 'active' ? 'available' : 'unavailable',
      });

      // Set durations
      if (serviceToEdit.durations && serviceToEdit.durations.length > 0) {
        const formattedDurations = serviceToEdit.durations.map((duration, index) => ({
          id: duration._id || `edit-${index}`,
          duration: duration.duration.toString(),
          price: duration.price.toString(),
        }));
        setDurations(formattedDurations);
      }

      // Set addons
      if (serviceToEdit.addons && serviceToEdit.addons.length > 0) {
        const formattedAddons = serviceToEdit.addons.map((addon, index) => ({
          id: addon._id || `edit-${index}`,
          name: addon.name,
          price: addon.price.toString(),
          selected: addon.selected,
        }));
        setAddOns(formattedAddons);
      } else {
        setAddOns([]);
      }

      // Set refund policy
      setIsRefundable(serviceToEdit.isRefundable);
      setRefundPolicy(serviceToEdit.refundPolicy);

      // Set existing images
      if (serviceToEdit.images && serviceToEdit.images.length > 0) {
        setExistingImages(serviceToEdit.images);
      }
    }
  }, [serviceToEdit, form]);

  const addDuration = () => {
    const newId = String(Date.now());
    setDurations([...durations, { id: newId, duration: '', price: '' }]);
  };

  const removeDuration = (id: string) => {
    setDurations(durations.filter(duration => duration.id !== id));
  };

  const updateDuration = (id: string, field: 'duration' | 'price', value: string) => {
    setDurations(durations.map(duration =>
      duration.id === id ? { ...duration, [field]: value } : duration
    ));
  };

  const addAddon = () => {
    const newId = String(Date.now());
    setAddOns([...addOns, { id: newId, name: '', price: '', selected: false }]);
  };

  const removeAddon = (id: string) => {
    setAddOns(addOns.filter(addon => addon.id !== id));
  };

  const updateAddon = (id: string, field: 'name' | 'price' | 'selected', value: any) => {
    setAddOns(addOns.map(addon =>
      addon.id === id ? { ...addon, [field]: value } : addon
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImages = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages([...images, ...newImages]);
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
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      const newImages = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number, isExistingImage = false) => {
    if (isExistingImage) {
      // Remove from existing images
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
    } else {
      // Remove from new images
      const newImages = [...images];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      setImages(newImages);
    }
  };

  // Helper function to get image URL for existing images
  const getImageUrl = (filename: string) => {
    if (filename.startsWith('http')) {
      return filename;
    }
    return `http://localhost:4000/uploads/services/${filename}`;
  };

  // Validate that we have at least one image (either existing or new)
  const validateImages = (): boolean => {
    if (images.length === 0 && existingImages.length === 0) {
      toast.error('Please upload at least one image');
      return false;
    }
    return true;
  };

  const validateDurations = (): boolean => {
    if (durations.length === 0) {
      toast.error('Please add at least one duration option');
      return false;
    }

    for (const duration of durations) {
      if (!duration.duration.trim() || !duration.price.trim()) {
        toast.error('Please fill in all duration and price fields');
        return false;
      }

      if (isNaN(parseFloat(duration.price)) || parseFloat(duration.price) <= 0) {
        toast.error('Price must be a valid positive number');
        return false;
      }

      if (isNaN(parseInt(duration.duration)) || parseInt(duration.duration) <= 0) {
        toast.error('Duration must be a valid positive number');
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!validateDurations() || !validateImages()) {
      return;
    }

    setIsLoading(true);

    try {
      // Find the selected specialist to get their full name
      const selectedSpecialist = specialists.find(spec => spec._id === data.specialist);

      if (!selectedSpecialist) {
        toast.error('Please select a valid specialist');
        setIsLoading(false);
        return;
      }

      // Ensure specialist name is a non-empty string
      const specialistName = `${selectedSpecialist.firstName} ${selectedSpecialist.lastName}`.trim();
      if (!specialistName) {
        toast.error('Specialist name cannot be empty');
        setIsLoading(false);
        return;
      }

      // Format durations to match backend model - ENSURE duration is a STRING
      const formattedDurations = durations.map(duration => ({
        duration: String(duration.duration), // Explicitly convert to string
        price: Number(duration.price) // Explicitly convert to number
      }));

      if (formattedDurations.length === 0) {
        toast.error('At least one duration must be provided');
        setIsLoading(false);
        return;
      }

      // Filter valid addons
      const formattedAddons = addOns
        .filter(addon => addon.selected && addon.name.trim() && addon.price.trim())
        .map(addon => ({
          name: String(addon.name).trim(), // Ensure it's a string and trimmed
          price: Number(addon.price), // Ensure it's a number
          selected: Boolean(addon.selected) // Ensure it's a boolean
        }));

      // Create FormData object to handle file uploads
      const formData = new FormData();

      // Append all the text fields
      formData.append('title', String(data.name).trim());
      formData.append('description', String(data.description).trim());
      formData.append('categoryId', data.category);
      formData.append('specialist', specialistName);
      formData.append('specialistId', data.specialist);
      formData.append('availability', data.availability ? String(data.availability).trim() : 'Daily');

      // More explicit status handling
      const statusMapping = {
        'available': 'active',
        'limited': 'active', // Both available and limited are considered active
        'unavailable': 'inactive'
      };
      const backendStatus = statusMapping[data.status as keyof typeof statusMapping] || 'inactive';
      formData.append('status', backendStatus);

      // Also send the display status to the backend
      formData.append('displayStatus', data.status);

      console.log('Status being sent to backend:', backendStatus, 'from form value:', data.status);

      formData.append('isRefundable', String(isRefundable));
      formData.append('refundPolicy', isRefundable ? String(refundPolicy).trim() : 'Non-refundable');

      // Append durations as JSON string
      formData.append('durations', JSON.stringify(formattedDurations));

      // Append addons as JSON string
      formData.append('addons', JSON.stringify(formattedAddons));

      // Add existing images if in edit mode
      if (isEditMode && existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      // Append the actual image files
      images.forEach(image => {
        formData.append('images', image.file);
      });

      // Check if we're editing or creating a new service
      if (isEditMode && serviceToEdit) {
        toast.info('Updating service...');

        // Send update request
        try {
          console.log('Sending update request for service ID:', serviceToEdit._id);
          console.log('Form data being sent (partial view):', {
            title: formData.get('title'),
            description: formData.get('description'),
            categoryId: formData.get('categoryId'),
            status: formData.get('status'),
            // Don't log everything to avoid cluttering the console
          });

          const response = await axios.put(
            `http://localhost:4000/api/spa/services/${serviceToEdit._id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          console.log('Server Response:', response.data);

          if (response.data.success) {
            toast.success('Service updated successfully!');
            navigate('/admin/spa');
          } else {
            toast.error(response.data.message || 'Failed to update service');
            console.error('Update failed:', response.data);
          }
        } catch (error) {
          console.error('Error in service update request:', error);
          if (axios.isAxiosError(error) && error.response) {
            console.error('Server error status:', error.response.status);
            console.error('Server error data:', error.response.data);
            toast.error(error.response.data.message || 'Failed to update service');
          } else {
            toast.error('An unexpected error occurred during service update');
          }
        }
      } else {
        toast.info('Creating service...');

        // Send create request
        const response = await axios.post(
          'http://localhost:4000/api/spa/services',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        console.log('Server Response:', response.data);

        if (response.data.success) {
          toast.success('Service added successfully!');
          navigate('/admin/spa');
        } else {
          toast.error(response.data.message || 'Failed to add service');
          console.error('Validation failed:', response.data);
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} service:`, error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || `Failed to ${isEditMode ? 'update' : 'add'} service`;
        toast.error(errorMessage);
        console.error('Server error details:', error.response.data);

        // Log exact details for debugging
        if (error.response.data.error) {
          console.error('Detailed validation error:', error.response.data.error);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/admin/spa')} className="mr-2">
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold">Add Spa Service</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Service' : 'Add New Service'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the information for this spa service.'
              : 'Complete the form below to add a new spa service.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter service name" {...field} />
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
                            <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingCategories ? (
                            <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                          ) : categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No categories available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialist</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingSpecialists ? "Loading specialists..." : "Select specialist"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingSpecialists ? (
                            <SelectItem value="loading" disabled>Loading specialists...</SelectItem>
                          ) : specialists.length > 0 ? (
                            specialists.map((specialist) => (
                              <SelectItem key={specialist._id} value={specialist._id}>
                                {`${specialist.firstName} ${specialist.lastName}`}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No specialists available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Daily, Weekends" {...field} />
                      </FormControl>
                      <FormDescription>When this service is available</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Current status: {field.value === "available" ? "Available" : field.value === "limited" ? "Limited" : "Unavailable"}</FormDescription>
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
                      <Textarea
                        placeholder="Enter service description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Available Durations & Prices</h3>
                    <p className="text-sm text-gray-500">Add duration options with pricing</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addDuration}>
                    <Plus size={16} className="mr-1" />
                    Add Duration
                  </Button>
                </div>

                {durations.map((duration, index) => (
                  <div key={duration.id} className="flex items-end gap-4">
                    <div className="w-1/3">
                      <FormLabel htmlFor={`duration-${duration.id}`}>Duration (minutes)</FormLabel>
                      <Input
                        id={`duration-${duration.id}`}
                        type="number"
                        value={duration.duration}
                        onChange={(e) => updateDuration(duration.id, 'duration', e.target.value)}
                        placeholder="e.g., 60"
                      />
                    </div>
                    <div className="w-1/3">
                      <FormLabel htmlFor={`price-${duration.id}`}>Price ($)</FormLabel>
                      <Input
                        id={`price-${duration.id}`}
                        type="number"
                        value={duration.price}
                        onChange={(e) => updateDuration(duration.id, 'price', e.target.value)}
                        placeholder="e.g., 100"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDuration(duration.id)}
                      className="ml-2"
                      disabled={durations.length === 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Add-ons & Extras (Optional)</h3>
                    <p className="text-sm text-gray-500">Add extra services with additional pricing</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addAddon}>
                    <Plus size={16} className="mr-1" />
                    Add Extra
                  </Button>
                </div>

                {addOns.map((addon, index) => (
                  <div key={addon.id} className="flex items-end gap-4">
                    <div className="flex items-center h-10 mt-6 w-8">
                      <Checkbox
                        id={`addon-select-${addon.id}`}
                        checked={addon.selected}
                        onCheckedChange={(checked) => updateAddon(addon.id, 'selected', checked)}
                      />
                    </div>
                    <div className="w-1/2">
                      <FormLabel htmlFor={`addon-name-${addon.id}`}>Name</FormLabel>
                      <Input
                        id={`addon-name-${addon.id}`}
                        value={addon.name}
                        onChange={(e) => updateAddon(addon.id, 'name', e.target.value)}
                        placeholder="e.g., Hot Stones"
                      />
                    </div>
                    <div className="w-1/4">
                      <FormLabel htmlFor={`addon-price-${addon.id}`}>Price ($)</FormLabel>
                      <Input
                        id={`addon-price-${addon.id}`}
                        type="number"
                        value={addon.price}
                        onChange={(e) => updateAddon(addon.id, 'price', e.target.value)}
                        placeholder="e.g., 15"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeAddon(addon.id)}
                      className="ml-2"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Refund Policy</h3>
                  <p className="text-sm text-gray-500">Configure refund options for this service</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h4 className="text-base font-medium">Refundable Booking</h4>
                      <p className="text-sm text-gray-500">Allow customers to receive refunds when cancelling</p>
                    </div>
                    <Switch
                      checked={isRefundable}
                      onCheckedChange={setIsRefundable}
                    />
                  </div>

                  {isRefundable && (
                    <div>
                      <FormLabel>Refund Policy</FormLabel>
                      <Select
                        value={refundPolicy}
                        onValueChange={setRefundPolicy}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a refund policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full refund if cancelled up to 48 hours before appointment. 50% refund if cancelled up to 24 hours before appointment.">
                            Standard (48h full/24h partial)
                          </SelectItem>
                          <SelectItem value="Full refund if cancelled up to 72 hours before appointment. No refund after that.">
                            Extended (72h full/no partial)
                          </SelectItem>
                          <SelectItem value="Full refund if cancelled up to 24 hours before appointment.">
                            Limited (24h full/no partial)
                          </SelectItem>
                          <SelectItem value="No refunds available for this service.">
                            No Refunds
                          </SelectItem>
                          <SelectItem value="custom">
                            Custom
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="mt-1">
                        Or enter a custom refund policy below
                      </FormDescription>
                      {refundPolicy === "custom" && (
                        <Textarea
                          placeholder="Enter custom refund policy"
                          className="mt-2"
                          value={refundPolicy === "custom" ? "" : refundPolicy}
                          onChange={(e) => setRefundPolicy(e.target.value)}
                          rows={3}
                        />
                      )}
                    </div>
                  )}
                </div>

                {!isRefundable && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">This is a non-refundable service. No refunds will be provided for cancellations.</p>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <FormLabel>Service Images</FormLabel>
                  <FormDescription>
                    Upload images for this service. You can upload multiple images.
                  </FormDescription>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-sm font-medium mb-1">
                      Drag and drop files here or click to upload
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload high-quality images of the service
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Select Files
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {images.length > 0 || existingImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {/* Display existing images */}
                    {existingImages.map((image, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={getImageUrl(image)}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 p-1"
                          onClick={() => handleRemoveImage(index, true)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}

                    {/* Display new images */}
                    {images.map((image, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 p-1"
                          onClick={() => handleRemoveImage(index, false)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <CardFooter className="flex justify-end pt-6 px-0">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => navigate('/admin/spa')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? (isEditMode ? "Updating Service..." : "Adding Service...")
                    : (isEditMode ? "Update Service" : "Add Service")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSpaServiceForm;

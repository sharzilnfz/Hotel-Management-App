import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  Card,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle2, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  nationality: z.string().min(2, "Nationality must be at least 2 characters"),
  experienceYears: z.string().optional(),
  status: z.string().default("active"),
  languages: z.string().min(2, "Please enter at least one language"),
  photo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Interface for a category item
interface Category {
  _id: string;
  name: string;
  description?: string;
}

const AddSpecialistForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedSpecializations, setSelectedSpecializations] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
      nationality: "",
      experienceYears: "",
      status: "active",
      languages: "",
      photo: "",
    }
  });

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await axios.get("http://localhost:4000/api/categories");
        if (response.data.success) {
          setAllCategories(response.data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch categories",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploadingImage(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload image to server immediately
      const formData = new FormData();
      formData.append('image', file);

      const uploadResult = await axios.post(
        'http://localhost:4000/api/content/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (uploadResult.data.success) {
        setImageUrl(uploadResult.data.data.url);
        toast({
          title: "Image Uploaded",
          description: "Profile image uploaded successfully.",
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      // Reset image states on error
      setPhotoPreview(null);
      setSelectedFile(null);
      setImageUrl("");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const toggleSpecialization = (category: Category) => {
    setSelectedSpecializations((prev) => {
      const exists = prev.some(item => item._id === category._id);
      if (exists) {
        return prev.filter(item => item._id !== category._id);
      } else {
        return [...prev, category];
      }
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Create FormData object to send form data
      const formData = new FormData();

      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'photo') {
          formData.append(key, String(value));
        }
      });

      // Add specializations
      formData.append("specializations", JSON.stringify(selectedSpecializations));

      // Add image URL instead of file
      if (imageUrl) {
        formData.append("photo", imageUrl);
      }

      // Send request to backend API
      const response = await axios.post(
        "http://localhost:4000/api/specialists",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        setIsSuccess(true);
        toast({
          title: "Specialist Added",
          description: `${data.firstName} ${data.lastName} has been added successfully.`,
        });

        // Reset form after 2 seconds
        setTimeout(() => {
          form.reset();
          setPhotoPreview(null);
          setSelectedFile(null);
          setImageUrl("");
          setSelectedSpecializations([]);
          setIsSuccess(false);
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to add specialist");
      }
    } catch (error) {
      console.error("Error adding specialist:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add specialist",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">Specialist Added Successfully</h3>
            <p className="text-gray-500 mt-2">The new specialist has been added to the system.</p>
            <Button className="mt-6" onClick={() => setIsSuccess(false)}>
              Add Another Specialist
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-2">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <Upload size={32} />
                      </div>
                    )}
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                    disabled={isUploadingImage}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo")?.click()}
                    className="text-sm"
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? "Uploading..." : "Upload Photo"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter nationality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages Spoken*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. English, Spanish, French" {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate multiple languages with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter years of experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-1 md:col-span-2">
                  <div className="mb-6">
                    <FormLabel className="block mb-2">Specializations*</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <span className="truncate">
                            {selectedSpecializations.length === 0
                              ? "Select specializations"
                              : `${selectedSpecializations.length} selected`}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Categories</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isLoadingCategories ? (
                          <div className="px-2 py-1.5 text-sm">Loading categories...</div>
                        ) : allCategories.length > 0 ? (
                          allCategories.map((category) => (
                            <DropdownMenuCheckboxItem
                              key={category._id}
                              checked={selectedSpecializations.some(item => item._id === category._id)}
                              onCheckedChange={() => toggleSpecialization(category)}
                            >
                              {category.name}
                            </DropdownMenuCheckboxItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm">No categories available</div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {selectedSpecializations.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedSpecializations.map(spec => (
                          <Badge key={spec._id} variant="secondary" className="p-1">
                            {spec.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {selectedSpecializations.length === 0 && (
                      <p className="text-sm text-red-500 mt-2">
                        Please select at least one specialization
                      </p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialist Bio*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter specialist bio and description"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about specialist's background, certifications and expertise.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedSpecializations.length === 0}
                >
                  {isSubmitting ? "Adding..." : "Add Specialist"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default AddSpecialistForm;

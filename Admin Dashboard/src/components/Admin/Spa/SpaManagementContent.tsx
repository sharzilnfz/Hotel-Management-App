import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  BarChart,
  Award,
  Briefcase,
  FileText,
  Bell,
  Upload
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Interface for spa service - update to match backend model
interface SpaService {
  _id: string;
  title: string;
  description: string;
  categoryId: {
    _id: string;
    name: string;
  };
  images: string[];
  isPopular: boolean;
  status: string;
  displayStatus?: string; // Optional because older records might not have it
  specialist: string;
  availability: string;
  durations: {
    duration: string;
    price: number;
  }[];
  addons: {
    name: string;
    price: number;
    selected: boolean;
  }[];
  popularityScore: number;
  specialistId: string;
}

// Interface for spa specialist
interface SpaSpecialist {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  nationality: string;
  experienceYears: string;
  status: string;
  languages: string;
  specializations: {
    _id: string;
    name: string;
  }[];
  photo?: string;
}

// Interface for current user
interface CurrentUser {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

// Interface for category
interface Category {
  _id: string;
  name: string;
  description?: string;
}

// Form schema for specialist editing
const specialistFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  nationality: z.string().min(2, "Nationality must be at least 2 characters"),
  experienceYears: z.string().optional(),
  status: z.string().default("active"),
  languages: z.string().min(2, "Please enter at least one language"),
});

type SpecialistFormValues = z.infer<typeof specialistFormSchema>;

const SpaManagementContent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState("services");
  const [specialists, setSpecialists] = useState<SpaSpecialist[]>([]);
  const [services, setServices] = useState<SpaService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specialistToDelete, setSpecialistToDelete] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [deleteServiceDialogOpen, setDeleteServiceDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSpecialist, setCurrentSpecialist] = useState<SpaSpecialist | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form setup
  const form = useForm<SpecialistFormValues>({
    resolver: zodResolver(specialistFormSchema),
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
    }
  });

  // Get current user from localStorage
  useEffect(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      setCurrentUser(JSON.parse(userDataString));
    }
  }, []);

  // Fetch specialists from API
  useEffect(() => {
    const fetchSpecialists = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:4000/api/specialists");
        if (response.data.success) {
          setSpecialists(response.data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch specialists",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching specialists:", error);
        toast({
          title: "Error",
          description: "Failed to fetch specialists",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialists();
  }, [toast]);

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

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const response = await axios.get("http://localhost:4000/api/spa/services");
        if (response.data.success) {
          setServices(response.data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch services",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to fetch services",
          variant: "destructive",
        });
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, [toast]);

  // Filter services based on search query
  const filteredServices = services.filter((service) => {
    return service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.categoryId?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      service.specialist.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter specialists based on search query
  const filteredSpecialists = specialists.filter((specialist) => {
    const fullName = `${specialist.firstName} ${specialist.lastName}`.toLowerCase();
    const specializations = specialist.specializations.map(spec => spec.name).join(" ").toLowerCase();
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) ||
      specialist.nationality.toLowerCase().includes(query) ||
      specializations.includes(query) ||
      specialist.experienceYears.toString().toLowerCase().includes(query) ||
      specialist.languages.toLowerCase().includes(query) ||
      specialist.email.toLowerCase().includes(query);
  });

  // Get the count of active specialists
  const activeSpecialistsCount = specialists.filter(specialist =>
    specialist.status === "active").length;

  // Check if user can add content
  const canAddContent =
    !currentUser ||
    currentUser.accessLevel === "Full Access" ||
    currentUser.accessLevel === "Administrative" ||
    (currentUser.role === "Manager" && currentUser.department === "Spa & Wellness");

  // Helper function to get the specialist photo URL
  const getSpecialistPhotoUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://via.placeholder.com/40?text=NA';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:4000/uploads/specialists/${imagePath}`;
  };

  // Helper function to get service image URL
  const getServiceImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://via.placeholder.com/40?text=NA';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:4000/uploads/services/${imagePath}`;
  };

  // Handle editing a specialist
  const handleEditSpecialist = (specialistId: string) => {
    const specialist = specialists.find(s => s._id === specialistId);
    if (!specialist) return;

    setCurrentSpecialist(specialist);
    setSelectedSpecializations(specialist.specializations as unknown as Category[]);

    // Set photo preview if exists
    if (specialist.photo) {
      setPhotoPreview(getSpecialistPhotoUrl(specialist.photo));
    } else {
      setPhotoPreview(null);
    }

    // Reset form with specialist data
    form.reset({
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      email: specialist.email,
      phone: specialist.phone,
      bio: specialist.bio,
      nationality: specialist.nationality,
      experienceYears: specialist.experienceYears,
      status: specialist.status,
      languages: specialist.languages,
    });

    setEditDialogOpen(true);
  };

  // Toggle specialization selection
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

  // Handle photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit specialist updates
  const onSubmit = async (data: SpecialistFormValues) => {
    if (!currentSpecialist) return;
    setIsSubmitting(true);

    try {
      // Create FormData object to send file and form data
      const formData = new FormData();

      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Add specializations
      formData.append("specializations", JSON.stringify(selectedSpecializations));

      // Add photo if selected
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      // Send request to backend API
      const response = await axios.put(
        `http://localhost:4000/api/specialists/${currentSpecialist._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        // Update specialists list
        setSpecialists(specialists.map(s =>
          s._id === currentSpecialist._id ? response.data.data : s
        ));

        toast({
          title: "Success",
          description: "Specialist updated successfully",
        });

        // Close dialog and reset state
        setEditDialogOpen(false);
        setCurrentSpecialist(null);
        setSelectedFile(null);
        setPhotoPreview(null);
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update specialist",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating specialist:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update specialist",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation dialog
  const confirmDeleteSpecialist = (specialistId: string) => {
    setSpecialistToDelete(specialistId);
    setDeleteDialogOpen(true);
  };

  // Delete specialist
  const handleDeleteSpecialist = async () => {
    if (!specialistToDelete) return;

    try {
      const response = await axios.delete(`http://localhost:4000/api/specialists/${specialistToDelete}`);

      if (response.data.success) {
        // Update the specialists list
        setSpecialists(specialists.filter(specialist => specialist._id !== specialistToDelete));

        toast({
          title: "Success",
          description: "Specialist deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to delete specialist",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting specialist:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete specialist",
        variant: "destructive",
      });
    } finally {
      // Close the dialog
      setDeleteDialogOpen(false);
      setSpecialistToDelete(null);
    }
  };

  // Open delete service confirmation dialog
  const confirmDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setDeleteServiceDialogOpen(true);
  };

  // Delete service
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await axios.delete(`http://localhost:4000/api/spa/services/${serviceToDelete}`);

      if (response.data.success) {
        // Update the services list
        setServices(services.filter(service => service._id !== serviceToDelete));

        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to delete service",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete service",
        variant: "destructive",
      });
    } finally {
      // Close the dialog
      setDeleteServiceDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  // Navigate to edit service page
  const navigateToEditService = (serviceId: string) => {
    try {
      console.log("Navigating to edit service:", serviceId);
      toast({
        title: "Navigating to edit page",
        description: `Opening edit page for service ID: ${serviceId}`,
      });
      navigate(`/admin/spa/edit-service/${serviceId}`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Could not navigate to edit page. See console for details.",
        variant: "destructive",
      });
    }
  };

  // Let's also add a quick navigation test at component mount
  useEffect(() => {
    // Check if the '/admin/spa/edit-service/test' route can be navigated to
    const testRoute = () => {
      try {
        // This is just to test if the route is registered, we'll immediately go back
        const canNavigate = navigate && typeof navigate === 'function';
        console.log("Navigation function available:", canNavigate);
      } catch (error) {
        console.error("Navigation test error:", error);
      }
    };
    testRoute();
  }, [navigate]);

  // Function to determine service status display
  const getServiceStatusDisplay = (service: SpaService) => {
    // Use displayStatus field if available
    if (service.displayStatus) {
      switch (service.displayStatus) {
        case 'available':
          return { text: "Available", variant: "default" as const };
        case 'limited':
          return { text: "Limited", variant: "secondary" as const };
        case 'unavailable':
          return { text: "Unavailable", variant: "outline" as const };
        default:
          break;
      }
    }

    // Fallback to the old logic for backwards compatibility
    if (service.status === 'active') {
      // We need to determine if it's "Available" or "Limited"
      if (service.isPopular || service.popularityScore > 7) {
        // Limited services are usually popular and have higher scores
        return { text: "Limited", variant: "secondary" as const };
      }
      return { text: "Available", variant: "default" as const };
    } else {
      return { text: "Unavailable", variant: "outline" as const };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Spa Management</h1>
        {canAddContent && (
          <div className="flex gap-2">
            <Link to="/admin/spa/add-service">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add Service</span>
              </Button>
            </Link>
            <Link to="/admin/spa/add-specialist">
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add Specialist</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Appointments</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <BarChart size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <h3 className="text-2xl font-bold">$12,845</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                <Award size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Top Service</p>
                <h3 className="text-lg font-bold">Aromatherapy</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Specialists</p>
                <h3 className="text-2xl font-bold">{activeSpecialistsCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spa Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search bar positioned at top-right */}
            <div className="flex items-center justify-between">
              <div></div> {/* Empty div to push search to the right */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Main Tabs Component - Full Width */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="specialists">Specialists</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Specialist</TableHead>
                        <TableHead>Popularity</TableHead>
                        <TableHead>Status</TableHead>
                        {canAddContent && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingServices ? (
                        <TableRow>
                          <TableCell colSpan={canAddContent ? 8 : 7} className="text-center py-10 text-gray-500">
                            Loading services...
                          </TableCell>
                        </TableRow>
                      ) : filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                          <TableRow key={service._id}>
                            <TableCell className="font-medium">{service.title}</TableCell>
                            <TableCell>
                              {service.durations && service.durations.length > 0 ?
                                `${service.durations[0].duration} min` :
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {service.durations && service.durations.length > 0 ?
                                `$${service.durations[0].price}` :
                                "N/A"}
                            </TableCell>
                            <TableCell>{service.categoryId?.name || "Uncategorized"}</TableCell>
                            <TableCell>{service.specialist}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="mr-2">{service.popularityScore.toFixed(1)}</span>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-hotel-primary"
                                    style={{ width: `${service.popularityScore * 10}%` }}
                                  ></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {(() => {
                                const status = getServiceStatusDisplay(service);
                                return (
                                  <Badge variant={status.variant}>
                                    {status.text}
                                  </Badge>
                                );
                              })()}
                            </TableCell>
                            {canAddContent && (
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigateToEditService(service._id)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => confirmDeleteService(service._id)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={canAddContent ? 8 : 7} className="text-center py-10 text-gray-500">
                            No services found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="specialists" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Nationality</TableHead>
                        <TableHead>Specializations</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Languages</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        {canAddContent && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={canAddContent ? 8 : 7} className="text-center py-10 text-gray-500">
                            Loading specialists...
                          </TableCell>
                        </TableRow>
                      ) : filteredSpecialists.length > 0 ? (
                        filteredSpecialists.map((specialist) => (
                          <TableRow key={specialist._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full overflow-hidden">
                                  <img
                                    src={getSpecialistPhotoUrl(specialist.photo)}
                                    alt={`${specialist.firstName} ${specialist.lastName}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=NA';
                                    }}
                                  />
                                </div>
                                {specialist.firstName} {specialist.lastName}
                              </div>
                            </TableCell>
                            <TableCell>{specialist.nationality}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {specialist.specializations.slice(0, 2).map((specialty) => (
                                  <Badge key={specialty._id} variant="outline" className="text-xs">
                                    {specialty.name}
                                  </Badge>
                                ))}
                                {specialist.specializations.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{specialist.specializations.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{specialist.experienceYears} years</TableCell>
                            <TableCell>{specialist.languages}</TableCell>
                            <TableCell>{specialist.email}</TableCell>
                            <TableCell>
                              <Badge variant={specialist.status === "active" ? "default" : "outline"}>
                                {specialist.status}
                              </Badge>
                            </TableCell>
                            {canAddContent && (
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditSpecialist(specialist._id)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => confirmDeleteSpecialist(specialist._id)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={canAddContent ? 8 : 7} className="text-center py-10 text-gray-500">
                            No specialists found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-500">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Deep Tissue Massage</p>
                    <p className="text-sm text-gray-500">Client: Robert Brown</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">2:30 PM</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Aromatherapy Massage</p>
                    <p className="text-sm text-gray-500">Client: Sarah Johnson</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">4:00 PM</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Facial Treatment</p>
                    <p className="text-sm text-gray-500">Client: Emily Davis</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">10:15 AM</p>
                  <p className="text-xs text-gray-500">Tomorrow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Recent Insights</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-500">Export</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Most Requested Service</p>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">Aromatherapy Massage</span>
                    <span className="text-sm text-green-600 ml-2">+12% ↑</span>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <BarChart size={20} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Top Specialist by Bookings</p>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">
                      {specialists.length > 0 ? `${specialists[0].firstName} ${specialists[0].lastName}` : "Loading..."}
                    </span>
                    <span className="text-sm text-green-600 ml-2">4.9 ★</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                  <Award size={20} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Capacity Utilization</p>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">78%</span>
                    <span className="text-sm text-amber-600 ml-2">+3% ↑</span>
                  </div>
                </div>
                <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                  <FileText size={20} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Customer Satisfaction</p>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">4.8/5.0</span>
                    <span className="text-sm text-green-600 ml-2">+0.2 ↑</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <Bell size={20} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Specialist Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this specialist? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSpecialist}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Confirmation Dialog */}
      <Dialog open={deleteServiceDialogOpen} onOpenChange={setDeleteServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Service Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteServiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Specialist Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          // Reset states when dialog is closed
          setCurrentSpecialist(null);
          setSelectedFile(null);
          setPhotoPreview(null);
        }
        setEditDialogOpen(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Specialist</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Photo Upload Section */}
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
                  </div>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo")?.click()}
                    className="text-sm"
                  >
                    Upload Photo
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

              <DialogFooter className="sticky bottom-0 pt-4 bg-white">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedSpecializations.length === 0}
                >
                  {isSubmitting ? "Updating..." : "Update Specialist"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpaManagementContent;

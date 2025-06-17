import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  PlusCircle,
  Image as ImageIcon,
  Type,
  Palette,
  Layers,
  ListOrdered,
  Save,
  Eye,
  RotateCcw,
  Loader2,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getHomePageContent,
  updateHomePageContent,
  HomePageContent,
  FeaturedService,
  getRoomsPageContent,
  updateRoomsPageContent,
  RoomsPageContent,
  RoomCategory,
  getSpaPageContent,
  updateSpaPageContent,
  SpaPageContent,
  getRestaurantPageContent,
  updateRestaurantPageContent,
  RestaurantPageContent,
  getEventsPageContent,
  updateEventsPageContent,
  EventsPageContent,
  getMeetingHallPageContent,
  updateMeetingHallPageContent,
  MeetingHallPageContent,
  getNavigationContent,
  updateNavigationContent,
  NavigationContent,
  getFooterContent,
  updateFooterContent,
  FooterContent
} from "@/services/contentService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import axios from 'axios';

const ContentManagementDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // State for each content type
  const [homePageData, setHomePageData] = useState<HomePageContent | null>(null);
  const [roomsPageData, setRoomsPageData] = useState<RoomsPageContent | null>(null);
  const [spaPageData, setSpaPageData] = useState<SpaPageContent | null>(null);
  const [restaurantPageData, setRestaurantPageData] = useState<RestaurantPageContent | null>(null);
  const [eventsPageData, setEventsPageData] = useState<EventsPageContent | null>(null);
  const [meetingHallPageData, setMeetingHallPageData] = useState<MeetingHallPageContent | null>(null);
  const [navigationData, setNavigationData] = useState<NavigationContent | null>(null);
  const [footerData, setFooterData] = useState<FooterContent | null>(null);

  // Service modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<FeaturedService | undefined>(undefined);
  const [serviceForm, setServiceForm] = useState<FeaturedService>({
    title: "",
    description: "",
    icon: "",
    order: 0
  });

  // Room category modal state
  const [isRoomCategoryModalOpen, setIsRoomCategoryModalOpen] = useState(false);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState<RoomCategory | undefined>(undefined);
  const [roomCategoryForm, setRoomCategoryForm] = useState({
    name: "",
    description: "",
    order: 0
  });

  // Spa service modal state
  const [isSpaServiceModalOpen, setIsSpaServiceModalOpen] = useState(false);
  const [selectedSpaService, setSelectedSpaService] = useState(undefined);
  const [spaServiceForm, setSpaServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    order: 0
  });

  // Dish modal state
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(undefined);
  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    order: 0
  });

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(undefined);
  const [eventForm, setEventForm] = useState({
    name: "",
    description: "",
    image: "",
    order: 0
  });

  // Navigation item modal state
  const [isNavItemModalOpen, setIsNavItemModalOpen] = useState(false);
  const [isFooterNavItemModalOpen, setIsFooterNavItemModalOpen] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState(undefined);
  const [navItemForm, setNavItemForm] = useState({
    label: "",
    path: "",
    order: 0
  });

  // Social media link modal state
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState(undefined);
  const [socialMediaForm, setSocialMediaForm] = useState({
    platform: "",
    url: "",
    icon: ""
  });

  // Map state from server to UI format for Home Page
  const [activeHomePage, setActiveHomePage] = useState({
    heroTitle: "Experience Luxury at Parkside Plaza",
    heroSubtitle: "Indulge in exquisite comfort and world-class amenities",
    welcomeMessage: "Welcome to Parkside Plaza, where luxury meets comfort. Our hotel offers an unforgettable experience with stunning views, exceptional service, and premier amenities. Whether you're visiting for business or leisure, our dedicated staff is committed to making your stay memorable.",
    aboutContent: "Nestled in the heart of the city, Parkside Plaza offers a sanctuary of comfort and luxury. Our hotel features elegantly designed rooms, a renowned spa, exquisite dining options, and versatile event spaces. With our commitment to excellence, we ensure every guest experiences the pinnacle of hospitality."
  });

  // Add a file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Add file input references for other pages
  const roomsFileInputRef = useRef<HTMLInputElement>(null);
  const spaFileInputRef = useRef<HTMLInputElement>(null);
  const eventsFileInputRef = useRef<HTMLInputElement>(null);
  const meetingHallFileInputRef = useRef<HTMLInputElement>(null);

  // Add restaurant cover image state
  const [restaurantCoverImagePreview, setRestaurantCoverImagePreview] = useState<string>("");
  const [selectedRestaurantCoverImage, setSelectedRestaurantCoverImage] = useState<File | null>(null);

  // Add menu PDF state
  const [menuPDFPreview, setMenuPDFPreview] = useState<string>("");
  const [selectedMenuPDF, setSelectedMenuPDF] = useState<File | null>(null);

  // Load initial data based on the active tab
  useEffect(() => {
    if (activeTab === "home") {
      fetchHomePageData();
    } else if (activeTab === "rooms") {
      fetchRoomsPageData();
    } else if (activeTab === "spa") {
      fetchSpaPageData();
    } else if (activeTab === "restaurant") {
      fetchRestaurantPageData();
    } else if (activeTab === "events") {
      fetchEventsPageData();
    } else if (activeTab === "meeting-hall") {
      fetchMeetingHallPageData();
    } else if (activeTab === "menus") {
      fetchNavigationData();
    } else if (activeTab === "footer") {
      fetchFooterData();
    }
  }, [activeTab]);

  // Map home page data from server format to UI format
  useEffect(() => {
    if (homePageData) {
      setActiveHomePage({
        heroTitle: homePageData.hero.title,
        heroSubtitle: homePageData.hero.subtitle,
        welcomeMessage: homePageData.welcome.message,
        aboutContent: homePageData.about.content
      });
    }
  }, [homePageData]);

  // Fetch home page data
  const fetchHomePageData = async () => {
    setLoading(true);
    try {
      const data = await getHomePageContent();
      console.log("Fetched home page data:", data);
      setHomePageData(data);
    } catch (error) {
      console.error("Failed to fetch home page content:", error);
      toast({
        title: "Error",
        description: "Failed to load home page content. Using default values instead.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch rooms page data
  const fetchRoomsPageData = async () => {
    setLoading(true);
    try {
      const data = await getRoomsPageContent();
      console.log("Fetched rooms page data:", data);
      setRoomsPageData(data);
    } catch (error) {
      console.error("Failed to fetch rooms page content:", error);
      toast({
        title: "Error",
        description: "Failed to load rooms page content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch spa page data
  const fetchSpaPageData = async () => {
    setLoading(true);
    try {
      const data = await getSpaPageContent();
      console.log("Fetched spa page data:", data);
      setSpaPageData(data);
    } catch (error) {
      console.error("Failed to fetch spa page content:", error);
      toast({
        title: "Error",
        description: "Failed to load spa page content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch restaurant page data
  const fetchRestaurantPageData = async () => {
    setLoading(true);
    try {
      const data = await getRestaurantPageContent();
      console.log("Fetched restaurant page data:", data);
      setRestaurantPageData(data);
    } catch (error) {
      console.error("Failed to fetch restaurant page content:", error);
      toast({
        title: "Error",
        description: "Failed to load restaurant page content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch events page data
  const fetchEventsPageData = async () => {
    setLoading(true);
    try {
      const data = await getEventsPageContent();
      console.log("Fetched events page data:", data);
      setEventsPageData(data);
    } catch (error) {
      console.error("Failed to fetch events page content:", error);
      toast({
        title: "Error",
        description: "Failed to load events page content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch meeting hall page data
  const fetchMeetingHallPageData = async () => {
    setLoading(true);
    try {
      const data = await getMeetingHallPageContent();
      console.log("Fetched meeting hall page data:", data);
      setMeetingHallPageData(data);
    } catch (error) {
      console.error("Failed to fetch meeting hall page content:", error);
      toast({
        title: "Error",
        description: "Failed to load meeting hall page content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch navigation data
  const fetchNavigationData = async () => {
    setLoading(true);
    try {
      const data = await getNavigationContent();
      console.log("Fetched navigation data:", data);
      setNavigationData(data);
    } catch (error) {
      console.error("Failed to fetch navigation content:", error);
      toast({
        title: "Error",
        description: "Failed to load navigation content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch footer data
  const fetchFooterData = async () => {
    setLoading(true);
    try {
      const data = await getFooterContent();
      console.log("Fetched footer data:", data);
      setFooterData(data);
    } catch (error) {
      console.error("Failed to fetch footer content:", error);
      toast({
        title: "Error",
        description: "Failed to load footer content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle changes to form inputs
  const handleHomePageChange = (e) => {
    const { name, value } = e.target;
    setActiveHomePage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save content based on active tab
  const saveContent = async () => {
    switch (activeTab) {
      case "home":
        await saveHomePageContent();
        break;
      case "rooms":
        await saveRoomsPageContent();
        break;
      case "spa":
        await saveSpaPageContent();
        break;
      case "restaurant":
        await saveRestaurantPageContent();
        break;
      case "events":
        await saveEventsPageContent();
        break;
      case "meeting-hall":
        await saveMeetingHallPageContent();
        break;
      case "menus":
        await saveNavigationContent();
        break;
      case "footer":
        await saveFooterContent();
        break;
      default:
        console.error("Unknown tab:", activeTab);
    }
  };

  // Save home page content
  const saveHomePageContent = async () => {
    if (!homePageData) return;

    setLoading(true);
    try {
      // Map UI format back to server format
      const updatedContent = {
        hero: {
          title: activeHomePage.heroTitle,
          subtitle: activeHomePage.heroSubtitle,
          backgroundImage: homePageData?.hero?.backgroundImage || ""
        },
        welcome: {
          message: activeHomePage.welcomeMessage
        },
        about: {
          content: activeHomePage.aboutContent
        },
        featuredServices: homePageData?.featuredServices || []
      };

      console.log("Sending home page update:", updatedContent);

      const result = await updateHomePageContent(updatedContent);
      console.log("API response:", result);
      setHomePageData(result);

      toast({
        title: "Success",
        description: "Home page content updated successfully"
      });
    } catch (error) {
      console.error("Failed to update home page content:", error);
      toast({
        title: "Error",
        description: "Failed to update home page content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save rooms page content
  const saveRoomsPageContent = async () => {
    if (!roomsPageData) return;

    setLoading(true);
    try {
      // Get form values from the rooms page tab
      const title = (document.getElementById('roomsTitle') as HTMLInputElement)?.value;
      const description = (document.getElementById('roomsDescription') as HTMLTextAreaElement)?.value;

      const updatedContent = {
        title: title || "Luxurious Rooms & Suites",
        description: description || "Experience the ultimate in comfort and luxury with our selection of elegantly designed rooms and suites, each offering unique amenities to enhance your stay.",
        coverImage: roomsPageData.coverImage || "",
        categories: roomsPageData.categories || []
      };

      const result = await updateRoomsPageContent(updatedContent);
      setRoomsPageData(result);

      toast({
        title: "Success",
        description: "Rooms page content updated successfully"
      });
    } catch (error) {
      console.error("Failed to update rooms page content:", error);
      toast({
        title: "Error",
        description: "Failed to update rooms page content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save spa page content
  const saveSpaPageContent = async () => {
    if (!spaPageData) return;

    setLoading(true);
    try {
      const title = (document.getElementById('spaTitle') as HTMLInputElement)?.value;
      const description = (document.getElementById('spaDescription') as HTMLTextAreaElement)?.value;

      const updatedContent = {
        title: title || "Spa & Wellness",
        description: description || "Indulge in a world of relaxation...",
        coverImage: spaPageData.coverImage || "",
        services: spaPageData.services || []
      };

      const result = await updateSpaPageContent(updatedContent);
      setSpaPageData(result);

      toast({
        title: "Success",
        description: "Spa page content updated successfully"
      });
    } catch (error) {
      console.error("Failed to update spa page content:", error);
      toast({
        title: "Error",
        description: "Failed to update spa page content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle restaurant cover image upload
  const handleRestaurantCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    console.log('Selected restaurant cover file:', file);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);

      // Upload the image
      const uploadResult = await axios.post(
        'http://localhost:4000/api/content/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Restaurant cover upload result:', uploadResult.data);

      if (uploadResult.data.success) {
        // Get the image URL from the correct response property
        const imageUrl = uploadResult.data.data.url;

        // Update the restaurantPageData
        if (restaurantPageData) {
          const updatedRestaurantPageData = {
            ...restaurantPageData,
            coverImage: imageUrl
          };

          setRestaurantPageData(updatedRestaurantPageData);
          setRestaurantCoverImagePreview("");
          setSelectedRestaurantCoverImage(null);

          toast({
            title: "Image Uploaded",
            description: "Restaurant cover image has been uploaded. Don't forget to save your changes."
          });
        }
      }
    } catch (error) {
      console.error('Error uploading restaurant cover image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload restaurant cover image.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove restaurant cover image
  const removeRestaurantCoverImage = () => {
    setSelectedRestaurantCoverImage(null);
    setRestaurantCoverImagePreview("");
    
    // Also clear the existing cover image from restaurant data
    if (restaurantPageData) {
      setRestaurantPageData({
        ...restaurantPageData,
        coverImage: ""
      });
    }
  };

  // Handle menu PDF upload
  const handleMenuPDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a valid PDF file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "PDF size should be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    console.log('Selected menu PDF file:', file);

    // Create form data
    const formData = new FormData();
    formData.append('pdf', file); // Using 'pdf' field name for the specific PDF endpoint

    try {
      setLoading(true);

      // Upload the PDF using the dedicated PDF endpoint
      const uploadResult = await axios.post(
        'http://localhost:4000/api/content/restaurant/menu-pdf',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Menu PDF upload result:', uploadResult.data);

      if (uploadResult.data.success) {
        // Get the PDF URL from the response
        const pdfUrl = uploadResult.data.data.url;
        
        // Update the restaurantPageData with the response data
        if (uploadResult.data.data.restaurantContent) {
          setRestaurantPageData(uploadResult.data.data.restaurantContent);
        } else {
          // Fallback: just update the PDF URL
          setRestaurantPageData(prev => prev ? {
            ...prev,
            menuItemsPDF: pdfUrl
          } : null);
        }

        setMenuPDFPreview("");
        setSelectedMenuPDF(null);

        toast({
          title: "PDF Uploaded",
          description: "Menu PDF has been uploaded successfully and updated in the system."
        });
      }
    } catch (error) {
      console.error('Error uploading menu PDF:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload menu PDF.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove menu PDF
  const removeMenuPDF = () => {
    setSelectedMenuPDF(null);
    setMenuPDFPreview("");
    
    // Also clear the existing PDF from restaurant data
    if (restaurantPageData) {
      setRestaurantPageData({
        ...restaurantPageData,
        menuItemsPDF: ""
      });
    }
  };

  // Save restaurant page content
  const saveRestaurantPageContent = async () => {
    if (!restaurantPageData) return;

    setLoading(true);
    try {
      const title = (document.getElementById('restaurantTitle') as HTMLInputElement)?.value;
      const description = (document.getElementById('restaurantDescription') as HTMLTextAreaElement)?.value;
      const chefName = (document.getElementById('chefName') as HTMLInputElement)?.value;
      const cuisineType = (document.getElementById('cuisineType') as HTMLInputElement)?.value;
      const openingHours = (document.getElementById('restaurantHours') as HTMLTextAreaElement)?.value;

      const updatedContent = {
        title: title || "Fine Dining Experience",
        description: description || "Savor exquisite culinary creations...",
        headChef: chefName || "Chef Michael Roberts",
        cuisineType: cuisineType || "Contemporary International",
        openingHours: openingHours || "Breakfast: 6:30 AM - 10:30 PM\nLunch: 12:00 PM - 2:30 PM\nDinner: 6:00 PM - 10:30 PM",
        coverImage: restaurantPageData.coverImage || "",
        featuredDishes: restaurantPageData.featuredDishes || [],
        menuItemsPDF: restaurantPageData.menuItemsPDF || ""
      };

      const result = await updateRestaurantPageContent(updatedContent);
      setRestaurantPageData(result);

      toast({
        title: "Success",
        description: "Restaurant page content updated successfully"
      });

      // Clean up
      setSelectedRestaurantCoverImage(null);
      setRestaurantCoverImagePreview("");
      setSelectedMenuPDF(null);
      setMenuPDFPreview("");
    } catch (error) {
      console.error("Failed to update restaurant page content:", error);
      toast({
        title: "Error",
        description: "Failed to update restaurant page content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save events page content
  const saveEventsPageContent = async () => {
    if (!eventsPageData) return;

    setLoading(true);
    try {
      const title = (document.getElementById('eventsTitle') as HTMLInputElement)?.value;
      const description = (document.getElementById('eventsDescription') as HTMLTextAreaElement)?.value;

      const updatedContent = {
        title: title || "Events & Celebrations",
        description: description || "Host extraordinary events in our versatile venues, perfect for weddings, conferences, and special celebrations. Our dedicated team ensures every detail is flawlessly executed.",
        coverImage: eventsPageData.coverImage || "",
        featuredEvents: eventsPageData.featuredEvents || []
      };

      const result = await updateEventsPageContent(updatedContent);
      setEventsPageData(result);

      toast({
        title: "Success",
        description: "Events page content updated successfully"
      });
    } catch (error) {
      console.error("Failed to update events page content:", error);
      toast({
        title: "Error",
        description: "Failed to update events page content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save meeting hall page content
  const saveMeetingHallPageContent = async () => {
    if (!meetingHallPageData) return;

    setLoading(true);
    try {
      const title = (document.getElementById('meetingHallTitle') as HTMLInputElement)?.value;
      const description = (document.getElementById('meetingHallDescription') as HTMLTextAreaElement)?.value;

      const updatedContent = {
        title: title || "Meeting Spaces",
        description: description || "Host meetings and events in our versatile meeting spaces. Our dedicated team ensures every detail is flawlessly executed.",
        coverImage: meetingHallPageData.coverImage || ""
      };

      const result = await updateMeetingHallPageContent(updatedContent);
      setMeetingHallPageData(result);

      toast({
        title: "Success",
        description: "Meeting hall page content updated successfully"
      });
    } catch (error) {
      console.error("Failed to update meeting hall page content:", error);
      toast({
        title: "Error",
        description: "Failed to update meeting hall page content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save navigation content
  const saveNavigationContent = async () => {
    if (!navigationData) return;

    setLoading(true);
    try {
      // Just save the existing navigation data for now
      // In a real implementation, you would collect the updated values from the form
      const result = await updateNavigationContent(navigationData);
      setNavigationData(result);

      toast({
        title: "Success",
        description: "Navigation content updated successfully"
      });
    } catch (error) {
      console.error("Failed to update navigation content:", error);
      toast({
        title: "Error",
        description: "Failed to update navigation content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save footer content
  const saveFooterContent = async () => {
    if (!footerData) return;

    setLoading(true);
    try {
      const aboutText = (document.getElementById('footerAbout') as HTMLTextAreaElement)?.value;
      const address = (document.getElementById('footerAddress') as HTMLInputElement)?.value;
      const phone = (document.getElementById('footerPhone') as HTMLInputElement)?.value;
      const email = (document.getElementById('footerEmail') as HTMLInputElement)?.value;
      const copyrightText = (document.getElementById('copyrightText') as HTMLInputElement)?.value;

      const updatedContent = {
        aboutText: aboutText || "Parkside Plaza Hotel offers luxury accommodations...",
        contactInfo: {
          address: address || "123 Park Avenue, New York, NY 10001",
          phone: phone || "+1 (555) 123-4567",
          email: email || "info@parksideplaza.com"
        },
        copyrightText: copyrightText || "© 2025 Parkside Plaza Hotel. All Rights Reserved.",
        socialMedia: footerData.socialMedia || []
      };

      const result = await updateFooterContent(updatedContent);
      setFooterData(result);

      toast({
        title: "Success",
        description: "Footer content updated successfully"
      });
    } catch (error) {
      console.error("Failed to update footer content:", error);
      toast({
        title: "Error",
        description: "Failed to update footer content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add Service handlers
  const handleAddService = () => {
    setSelectedService(undefined);
    setServiceForm({
      title: "",
      description: "",
      icon: "",
      order: 0
    });
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: FeaturedService) => {
    setSelectedService(service);
    setServiceForm({ ...service });
    setIsServiceModalOpen(true);
  };

  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const handleServiceSave = () => {
    if (!homePageData) return;

    // Create a copy of the current featured services
    let updatedServices = [...(homePageData.featuredServices || [])];

    // Check if we're updating an existing service or adding a new one
    if (selectedService) {
      // Update existing service
      const index = updatedServices.findIndex(s =>
        s.title === selectedService.title && s.order === selectedService.order);

      if (index !== -1) {
        updatedServices[index] = serviceForm;
      }
    } else {
      // Add new service with next order number
      const maxOrder = updatedServices.length > 0
        ? Math.max(...updatedServices.map(s => s.order))
        : -1;

      serviceForm.order = maxOrder + 1;
      updatedServices.push(serviceForm);
    }

    // Update home page data with the new services
    setHomePageData({
      ...homePageData,
      featuredServices: updatedServices
    });

    toast({
      title: selectedService ? "Service Updated" : "Service Added",
      description: `The service was successfully ${selectedService ? "updated" : "added"}. Don't forget to save your changes.`
    });

    // Close the modal
    setIsServiceModalOpen(false);
  };

  // Add a function to handle hero image upload
  const handleHeroImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    console.log('Selected file:', file);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);

      // Upload the image
      const uploadResult = await axios.post(
        'http://localhost:4000/api/content/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Upload result:', uploadResult.data);

      if (uploadResult.data.success) {
        // Get the image URL from the correct response property
        const imageUrl = uploadResult.data.data.url;

        // Update the homePageData
        if (homePageData) {
          const updatedHomePageData = {
            ...homePageData,
            hero: {
              ...homePageData.hero,
              backgroundImage: imageUrl
            }
          };

          setHomePageData(updatedHomePageData);

          toast({
            title: "Image Uploaded",
            description: "Hero background image has been uploaded. Don't forget to save your changes."
          });
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload hero background image.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click
  const handleChangeImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Add a function to get the full URL for images
  const getFullImageUrl = (path: string | undefined) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    return `http://localhost:4000${path}`;
  };

  // Add Room Category handlers
  const handleAddRoomCategory = () => {
    setSelectedRoomCategory(undefined);
    setRoomCategoryForm({
      name: "",
      description: "",
      order: 0
    });
    setIsRoomCategoryModalOpen(true);
  };

  const handleEditRoomCategory = (category) => {
    setSelectedRoomCategory(category);
    setRoomCategoryForm({ ...category });
    setIsRoomCategoryModalOpen(true);
  };

  const handleRoomCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setRoomCategoryForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const handleRoomCategorySave = () => {
    if (!roomsPageData) return;

    // Create a copy of the current categories
    let updatedCategories = [...(roomsPageData.categories || [])];

    // Check if we're updating an existing category or adding a new one
    if (selectedRoomCategory) {
      // Update existing category
      const index = updatedCategories.findIndex(c =>
        c.name === selectedRoomCategory.name && c.order === selectedRoomCategory.order);

      if (index !== -1) {
        updatedCategories[index] = roomCategoryForm;
      }
    } else {
      // Add new category with next order number
      const maxOrder = updatedCategories.length > 0
        ? Math.max(...updatedCategories.map(c => c.order))
        : -1;

      roomCategoryForm.order = maxOrder + 1;
      updatedCategories.push(roomCategoryForm);
    }

    // Update rooms page data with the new categories
    setRoomsPageData({
      ...roomsPageData,
      categories: updatedCategories
    });

    toast({
      title: selectedRoomCategory ? "Category Updated" : "Category Added",
      description: `The room category was successfully ${selectedRoomCategory ? "updated" : "added"}. Don't forget to save your changes.`
    });

    // Close the modal
    setIsRoomCategoryModalOpen(false);
  };

  // Add Spa Service handlers
  const handleAddSpaService = () => {
    setSelectedSpaService(undefined);
    setSpaServiceForm({
      name: "",
      description: "",
      price: "",
      duration: "",
      order: 0
    });
    setIsSpaServiceModalOpen(true);
  };

  const handleEditSpaService = (service) => {
    setSelectedSpaService(service);
    setSpaServiceForm({ ...service });
    setIsSpaServiceModalOpen(true);
  };

  const handleSpaServiceFormChange = (e) => {
    const { name, value } = e.target;
    setSpaServiceForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const handleSpaServiceSave = () => {
    if (!spaPageData) return;

    // Create a copy of the current services
    let updatedServices = [...(spaPageData.services || [])];

    // Check if we're updating an existing service or adding a new one
    if (selectedSpaService) {
      // Update existing service
      const index = updatedServices.findIndex(s =>
        s.name === selectedSpaService.name && s.order === selectedSpaService.order);

      if (index !== -1) {
        updatedServices[index] = spaServiceForm;
      }
    } else {
      // Add new service with next order number
      const maxOrder = updatedServices.length > 0
        ? Math.max(...updatedServices.map(s => s.order))
        : -1;

      spaServiceForm.order = maxOrder + 1;
      updatedServices.push(spaServiceForm);
    }

    // Update spa page data with the new services
    setSpaPageData({
      ...spaPageData,
      services: updatedServices
    });

    toast({
      title: selectedSpaService ? "Service Updated" : "Service Added",
      description: `The spa service was successfully ${selectedSpaService ? "updated" : "added"}. Don't forget to save your changes.`
    });

    // Close the modal
    setIsSpaServiceModalOpen(false);
  };

  // Add Dish handlers
  const handleAddDish = () => {
    setSelectedDish(undefined);
    setDishForm({
      name: "",
      description: "",
      price: "",
      image: "",
      order: 0
    });
    setIsDishModalOpen(true);
  };

  const handleEditDish = (dish) => {
    setSelectedDish(dish);
    setDishForm({ ...dish });
    setIsDishModalOpen(true);
  };

  const handleDishFormChange = (e) => {
    const { name, value } = e.target;
    setDishForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const handleDishSave = () => {
    if (!restaurantPageData) return;

    // Create a copy of the current dishes
    let updatedDishes = [...(restaurantPageData.featuredDishes || [])];

    // Check if we're updating an existing dish or adding a new one
    if (selectedDish) {
      // Update existing dish
      const index = updatedDishes.findIndex(d =>
        d.name === selectedDish.name && d.order === selectedDish.order);

      if (index !== -1) {
        updatedDishes[index] = dishForm;
      }
    } else {
      // Add new dish with next order number
      const maxOrder = updatedDishes.length > 0
        ? Math.max(...updatedDishes.map(d => d.order))
        : -1;

      dishForm.order = maxOrder + 1;
      updatedDishes.push(dishForm);
    }

    // Update restaurant page data with the new dishes
    setRestaurantPageData({
      ...restaurantPageData,
      featuredDishes: updatedDishes
    });

    toast({
      title: selectedDish ? "Dish Updated" : "Dish Added",
      description: `The featured dish was successfully ${selectedDish ? "updated" : "added"}. Don't forget to save your changes.`
    });

    // Close the modal
    setIsDishModalOpen(false);
  };

  // Add Event handlers
  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setEventForm({
      name: "",
      description: "",
      image: "",
      order: 0
    });
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventForm({ ...event });
    setIsEventModalOpen(true);
  };

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const handleEventSave = () => {
    if (!eventsPageData) return;

    // Create a copy of the current events
    let updatedEvents = [...(eventsPageData.featuredEvents || [])];

    // Check if we're updating an existing event or adding a new one
    if (selectedEvent) {
      // Update existing event
      const index = updatedEvents.findIndex(e =>
        e.name === selectedEvent.name && e.order === selectedEvent.order);

      if (index !== -1) {
        updatedEvents[index] = eventForm;
      }
    } else {
      // Add new event with next order number
      const maxOrder = updatedEvents.length > 0
        ? Math.max(...updatedEvents.map(e => e.order))
        : -1;

      eventForm.order = maxOrder + 1;
      updatedEvents.push(eventForm);
    }

    // Update events page data with the new events
    setEventsPageData({
      ...eventsPageData,
      featuredEvents: updatedEvents
    });

    toast({
      title: selectedEvent ? "Event Updated" : "Event Added",
      description: `The featured event was successfully ${selectedEvent ? "updated" : "added"}. Don't forget to save your changes.`
    });

    // Close the modal
    setIsEventModalOpen(false);
  };

  // Add Navigation Item handlers
  const handleAddNavItem = (isFooter = false) => {
    setSelectedNavItem(undefined);
    setNavItemForm({
      label: "",
      path: "",
      order: 0
    });

    if (isFooter) {
      setIsFooterNavItemModalOpen(true);
    } else {
      setIsNavItemModalOpen(true);
    }
  };

  const handleEditNavItem = (item, isFooter = false) => {
    setSelectedNavItem(item);
    setNavItemForm({ ...item });

    if (isFooter) {
      setIsFooterNavItemModalOpen(true);
    } else {
      setIsNavItemModalOpen(true);
    }
  };

  const handleNavItemFormChange = (e) => {
    const { name, value } = e.target;
    setNavItemForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const handleNavItemSave = (isFooter = false) => {
    if (!navigationData) return;

    // Determine which array to update
    const navArray = isFooter ? 'footer' : 'main';
    let updatedItems = [...(navigationData[navArray] || [])];

    // Check if we're updating an existing item or adding a new one
    if (selectedNavItem) {
      // Update existing item
      const index = updatedItems.findIndex(i =>
        i.label === selectedNavItem.label && i.order === selectedNavItem.order);

      if (index !== -1) {
        updatedItems[index] = navItemForm;
      }
    } else {
      // Add new item with next order number
      const maxOrder = updatedItems.length > 0
        ? Math.max(...updatedItems.map(i => i.order))
        : -1;

      navItemForm.order = maxOrder + 1;
      updatedItems.push(navItemForm);
    }

    // Update navigation data with the new items
    setNavigationData({
      ...navigationData,
      [navArray]: updatedItems
    });

    toast({
      title: selectedNavItem ? "Navigation Item Updated" : "Navigation Item Added",
      description: `The navigation item was successfully ${selectedNavItem ? "updated" : "added"}. Don't forget to save your changes.`
    });

    // Close the modal
    if (isFooter) {
      setIsFooterNavItemModalOpen(false);
    } else {
      setIsNavItemModalOpen(false);
    }
  };

  // Add Social Media Link handlers
  const handleAddSocialMedia = () => {
    setSelectedSocialMedia(undefined);
    setSocialMediaForm({
      platform: "",
      url: "",
      icon: ""
    });
    setIsSocialMediaModalOpen(true);
  };

  const handleEditSocialMedia = (social) => {
    setSelectedSocialMedia(social);
    setSocialMediaForm({ ...social });
    setIsSocialMediaModalOpen(true);
  };

  const handleSocialMediaFormChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaSave = () => {
    if (!footerData) return;

    // Create a copy of the current social media links
    let updatedSocialMedia = [...(footerData.socialMedia || [])];

    // Check if we're updating an existing link or adding a new one
    if (selectedSocialMedia) {
      // Update existing link
      const index = updatedSocialMedia.findIndex(s =>
        s.platform === selectedSocialMedia.platform && s.url === selectedSocialMedia.url);

      if (index !== -1) {
        updatedSocialMedia[index] = socialMediaForm;
      }
    } else {
      // Add new link
      updatedSocialMedia.push(socialMediaForm);
    }

    // Update footer data with the new social media links
    setFooterData({
      ...footerData,
      socialMedia: updatedSocialMedia
    });

    toast({
      title: selectedSocialMedia ? "Social Media Link Updated" : "Social Media Link Added",
      description: `The social media link was successfully ${selectedSocialMedia ? "updated" : "added"}. Don't forget to save your changes.`
    });

    // Close the modal
    setIsSocialMediaModalOpen(false);
  };

  // Add delete handlers
  const handleDeleteService = (serviceToDelete: FeaturedService) => {
    if (!homePageData) return;

    // Create a new array without the service to delete
    const updatedServices = homePageData.featuredServices.filter(
      service => service.title !== serviceToDelete.title || service.order !== serviceToDelete.order
    );

    // Update home page data
    setHomePageData({
      ...homePageData,
      featuredServices: updatedServices
    });

    toast({
      title: "Service Deleted",
      description: "The service was successfully deleted. Don't forget to save your changes."
    });
  };

  const handleDeleteRoomCategory = (categoryToDelete) => {
    if (!roomsPageData) return;

    // Create a new array without the category to delete
    const updatedCategories = roomsPageData.categories.filter(
      category => category.name !== categoryToDelete.name || category.order !== categoryToDelete.order
    );

    // Update rooms page data
    setRoomsPageData({
      ...roomsPageData,
      categories: updatedCategories
    });

    toast({
      title: "Room Category Deleted",
      description: "The room category was successfully deleted. Don't forget to save your changes."
    });
  };

  const handleDeleteSpaService = (serviceToDelete) => {
    if (!spaPageData) return;

    // Create a new array without the service to delete
    const updatedServices = spaPageData.services.filter(
      service => service.name !== serviceToDelete.name || service.order !== serviceToDelete.order
    );

    // Update spa page data
    setSpaPageData({
      ...spaPageData,
      services: updatedServices
    });

    toast({
      title: "Spa Service Deleted",
      description: "The spa service was successfully deleted. Don't forget to save your changes."
    });
  };

  const handleDeleteDish = (dishToDelete) => {
    if (!restaurantPageData) return;

    // Create a new array without the dish to delete
    const updatedDishes = restaurantPageData.featuredDishes.filter(
      dish => dish.name !== dishToDelete.name || dish.order !== dishToDelete.order
    );

    // Update restaurant page data
    setRestaurantPageData({
      ...restaurantPageData,
      featuredDishes: updatedDishes
    });

    toast({
      title: "Dish Deleted",
      description: "The featured dish was successfully deleted. Don't forget to save your changes."
    });
  };

  const handleDeleteEvent = (eventToDelete) => {
    if (!eventsPageData) return;

    // Create a new array without the event to delete
    const updatedEvents = eventsPageData.featuredEvents.filter(
      event => event.name !== eventToDelete.name || event.order !== eventToDelete.order
    );

    // Update events page data
    setEventsPageData({
      ...eventsPageData,
      featuredEvents: updatedEvents
    });

    toast({
      title: "Event Deleted",
      description: "The featured event was successfully deleted. Don't forget to save your changes."
    });
  };

  const handleDeleteNavItem = (itemToDelete, isFooter = false) => {
    if (!navigationData) return;

    // Determine which array to update
    const navArray = isFooter ? 'footer' : 'main';
    const updatedItems = navigationData[navArray].filter(
      item => item.label !== itemToDelete.label || item.order !== itemToDelete.order
    );

    // Update navigation data
    setNavigationData({
      ...navigationData,
      [navArray]: updatedItems
    });

    toast({
      title: "Navigation Item Deleted",
      description: "The navigation item was successfully deleted. Don't forget to save your changes."
    });
  };

  const handleDeleteSocialMedia = (socialToDelete) => {
    if (!footerData) return;

    // Create a new array without the social media to delete
    const updatedSocialMedia = footerData.socialMedia.filter(
      social => social.platform !== socialToDelete.platform || social.url !== socialToDelete.url
    );

    // Update footer data
    setFooterData({
      ...footerData,
      socialMedia: updatedSocialMedia
    });

    toast({
      title: "Social Media Link Deleted",
      description: "The social media link was successfully deleted. Don't forget to save your changes."
    });
  };

  // Add Rooms page image upload handler
  const handleRoomsImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    console.log('Selected rooms page file:', file);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);

      // Upload the image
      const uploadResult = await axios.post(
        'http://localhost:4000/api/content/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Rooms page upload result:', uploadResult.data);

      if (uploadResult.data.success) {
        // Get the image URL from the correct response property
        const imageUrl = uploadResult.data.data.url;

        // Update the roomsPageData
        if (roomsPageData) {
          const updatedRoomsPageData = {
            ...roomsPageData,
            coverImage: imageUrl
          };

          setRoomsPageData(updatedRoomsPageData);

          toast({
            title: "Image Uploaded",
            description: "Rooms page cover image has been uploaded. Don't forget to save your changes."
          });
        }
      }
    } catch (error) {
      console.error('Error uploading rooms page image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload rooms page cover image.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add Spa page image upload handler
  const handleSpaImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    console.log('Selected spa page file:', file);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);

      // Upload the image
      const uploadResult = await axios.post(
        'http://localhost:4000/api/content/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Spa page upload result:', uploadResult.data);

      if (uploadResult.data.success) {
        // Get the image URL from the correct response property
        const imageUrl = uploadResult.data.data.url;

        // Update the spaPageData
        if (spaPageData) {
          const updatedSpaPageData = {
            ...spaPageData,
            coverImage: imageUrl
          };

          setSpaPageData(updatedSpaPageData);

          toast({
            title: "Image Uploaded",
            description: "Spa page cover image has been uploaded. Don't forget to save your changes."
          });
        }
      }
    } catch (error) {
      console.error('Error uploading spa page image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload spa page cover image.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add Events page image upload handler
  const handleEventsImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    console.log('Selected events page file:', file);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);

      // Upload the image
      const uploadResult = await axios.post(
        'http://localhost:4000/api/content/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Events page upload result:', uploadResult.data);

      if (uploadResult.data.success) {
        // Get the image URL from the correct response property
        const imageUrl = uploadResult.data.data.url;

        // Update the eventsPageData
        if (eventsPageData) {
          const updatedEventsPageData = {
            ...eventsPageData,
            coverImage: imageUrl
          };

          setEventsPageData(updatedEventsPageData);

          toast({
            title: "Image Uploaded",
            description: "Events page cover image has been uploaded. Don't forget to save your changes."
          });
        }
      }
    } catch (error) {
      console.error('Error uploading events page image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload events page cover image.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add Meeting Hall page image upload handler
  const handleMeetingHallImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    console.log('Selected meeting hall page file:', file);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);

      // Upload the image
      const uploadResult = await axios.post(
        'http://localhost:4000/api/content/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Meeting hall page upload result:', uploadResult.data);

      if (uploadResult.data.success) {
        // Get the image URL from the correct response property
        const imageUrl = uploadResult.data.data.url;

        // Update the meetingHallPageData
        if (meetingHallPageData) {
          const updatedMeetingHallPageData = {
            ...meetingHallPageData,
            coverImage: imageUrl
          };

          setMeetingHallPageData(updatedMeetingHallPageData);

          toast({
            title: "Image Uploaded",
            description: "Meeting hall page cover image has been uploaded. Don't forget to save your changes."
          });
        }
      }
    } catch (error) {
      console.error('Error uploading meeting hall page image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload meeting hall page cover image.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click functions
  const handleRoomsChangeImageClick = () => {
    if (roomsFileInputRef.current) {
      roomsFileInputRef.current.click();
    }
  };

  const handleSpaChangeImageClick = () => {
    if (spaFileInputRef.current) {
      spaFileInputRef.current.click();
    }
  };

  const handleEventsChangeImageClick = () => {
    if (eventsFileInputRef.current) {
      eventsFileInputRef.current.click();
    }
  };

  const handleMeetingHallChangeImageClick = () => {
    if (meetingHallFileInputRef.current) {
      meetingHallFileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
          <p className="text-gray-500">Edit website content and appearance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye size={16} />
            <span>Preview</span>
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={saveContent}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save size={16} />}
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="home" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="rooms">Rooms & Suites</TabsTrigger>
          <TabsTrigger value="spa">Spa</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="meeting-hall">Meeting Hall</TabsTrigger>
          <TabsTrigger value="menus">Menus</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Hero Section</span>
                <Button variant="ghost" size="icon">
                  <Edit size={16} />
                </Button>
              </CardTitle>
              <CardDescription>Edit the hero section on the home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  name="heroTitle"
                  value={activeHomePage.heroTitle}
                  onChange={handleHomePageChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  name="heroSubtitle"
                  value={activeHomePage.heroSubtitle}
                  onChange={handleHomePageChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Background Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center">
                    {homePageData?.hero?.backgroundImage ? (
                      <img
                        src={getFullImageUrl(homePageData.hero.backgroundImage)}
                        alt="Hero background"
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <ImageIcon size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={handleChangeImageClick}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                      Change Image
                    </Button>
                    {homePageData?.hero?.backgroundImage && (
                      <p className="text-xs text-gray-500 mt-1">
                        {homePageData.hero.backgroundImage.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Welcome Section</span>
                <Button variant="ghost" size="icon">
                  <Edit size={16} />
                </Button>
              </CardTitle>
              <CardDescription>Edit the welcome section on the home page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  rows={4}
                  value={activeHomePage.welcomeMessage}
                  onChange={handleHomePageChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>About Section</span>
                <Button variant="ghost" size="icon">
                  <Edit size={16} />
                </Button>
              </CardTitle>
              <CardDescription>Edit the about section on the home page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="aboutContent">About Content</Label>
                <Textarea
                  id="aboutContent"
                  name="aboutContent"
                  rows={4}
                  value={activeHomePage.aboutContent}
                  onChange={handleHomePageChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Featured Services</span>
                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleAddService}>
                  <PlusCircle size={14} />
                  <span>Add Service</span>
                </Button>
              </CardTitle>
              <CardDescription>Edit featured services displayed on the home page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {homePageData?.featuredServices && homePageData.featuredServices.length > 0 ?
                  homePageData.featuredServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{service.title}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <ListOrdered size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteService(service)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )) :
                  ["Luxury Rooms", "Spa & Wellness", "Fine Dining", "Meeting Spaces"].map((serviceName, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{serviceName}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <ListOrdered size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Rooms Page Header</span>
                <Button variant="ghost" size="icon">
                  <Edit size={16} />
                </Button>
              </CardTitle>
              <CardDescription>Edit the header section of the rooms page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomsTitle">Page Title</Label>
                <Input
                  id="roomsTitle"
                  defaultValue={roomsPageData?.title || "Luxurious Rooms & Suites"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomsDescription">Page Description</Label>
                <Textarea
                  id="roomsDescription"
                  rows={3}
                  defaultValue={roomsPageData?.description || "Experience the ultimate in comfort and luxury with our selection of elegantly designed rooms and suites, each offering unique amenities to enhance your stay."}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomsCoverImage">Page Cover Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center">
                    {roomsPageData?.coverImage ? (
                      <img
                        src={getFullImageUrl(roomsPageData.coverImage)}
                        alt="Rooms page cover"
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <ImageIcon size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={roomsFileInputRef}
                      onChange={handleRoomsImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={handleRoomsChangeImageClick}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                      Change Image
                    </Button>
                    {roomsPageData?.coverImage && (
                      <p className="text-xs text-gray-500 mt-1">
                        {roomsPageData.coverImage.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Room Categories</span>
                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleAddRoomCategory}>
                  <PlusCircle size={14} />
                  <span>Add Room Category</span>
                </Button>
              </CardTitle>
              <CardDescription>Manage room categories and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roomsPageData?.categories?.length > 0 ?
                  roomsPageData.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{category.name}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRoomCategory(category)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <Layers size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteRoomCategory(category)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )) :
                  ["Deluxe Room", "Executive Suite", "Presidential Suite", "Family Room"].map((room, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{room}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <Layers size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spa Page Content</CardTitle>
              <CardDescription>Edit the spa page content and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="spaTitle">Page Title</Label>
                  <Input
                    id="spaTitle"
                    defaultValue={spaPageData?.title || "Spa & Wellness"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spaDescription">Page Description</Label>
                  <Textarea
                    id="spaDescription"
                    rows={3}
                    defaultValue={spaPageData?.description || "Indulge in a world of relaxation and rejuvenation at our luxury spa. Our treatments combine ancient techniques with modern approaches to provide a truly refreshing experience."}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spaCoverImage">Page Cover Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center">
                      {spaPageData?.coverImage ? (
                        <img
                          src={getFullImageUrl(spaPageData.coverImage)}
                          alt="Spa page cover"
                          className="h-full w-full object-cover rounded"
                        />
                      ) : (
                        <ImageIcon size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={spaFileInputRef}
                        onChange={handleSpaImageUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={handleSpaChangeImageClick}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                        Change Image
                      </Button>
                      {spaPageData?.coverImage && (
                        <p className="text-xs text-gray-500 mt-1">
                          {spaPageData.coverImage.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Spa Services</Label>
                    <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleAddSpaService}>
                      <PlusCircle size={14} />
                      <span>Add Service</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {spaPageData?.services?.length > 0 ?
                      spaPageData.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{service.name}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditSpaService(service)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteSpaService(service)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      )) :
                      ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Therapy", "Aromatherapy", "Facial Treatment"].map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{service}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-6">
          {/* Restaurant Cover Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Cover Image</CardTitle>
              <CardDescription>Upload and manage the main cover image for the restaurant page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current or preview cover image */}
                {(restaurantCoverImagePreview || restaurantPageData?.coverImage) ? (
                  <div className="relative">
                    <img
                      src={restaurantCoverImagePreview || getFullImageUrl(restaurantPageData?.coverImage)}
                      alt="Restaurant cover"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeRestaurantCoverImage}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                    {selectedRestaurantCoverImage && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        New image selected
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => document.getElementById('restaurant-cover-upload')?.click()}
                  >
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload Restaurant Cover Image</p>
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB • Recommended: 1920 × 600 pixels</p>
                  </div>
                )}
                
                <input
                  id="restaurant-cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleRestaurantCoverImageUpload}
                />

                {!restaurantCoverImagePreview && !restaurantPageData?.coverImage && (
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('restaurant-cover-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Cover Image
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Menu PDF Card */}
          <Card>
            <CardHeader>
              <CardTitle>Menu PDF</CardTitle>
              <CardDescription>Upload and manage the restaurant menu PDF</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current PDF or preview */}
                {(menuPDFPreview || restaurantPageData?.menuItemsPDF) ? (
                  <div className="relative">
                    <div className="border rounded-lg p-6 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-red-100 p-2 rounded">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {restaurantPageData?.menuItemsPDF ? 
                                `Menu PDF - ${restaurantPageData.menuItemsPDF.split('/').pop()}` : 
                                'New Menu PDF Selected'
                              }
                            </p>
                            <p className="text-xs text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {restaurantPageData?.menuItemsPDF && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(getFullImageUrl(restaurantPageData.menuItemsPDF), '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeMenuPDF}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    {selectedMenuPDF && (
                      <div className="mt-2">
                        <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm">
                          New PDF selected: {selectedMenuPDF.name}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => document.getElementById('menu-pdf-upload')?.click()}
                  >
                    <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload Menu PDF</p>
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF files up to 10MB</p>
                  </div>
                )}
                
                <input
                  id="menu-pdf-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleMenuPDFUpload}
                />

                {!menuPDFPreview && !restaurantPageData?.menuItemsPDF && (
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('menu-pdf-upload')?.click()}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Menu PDF
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Content</CardTitle>
              <CardDescription>Edit the restaurant page content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurantTitle">Page Title</Label>
                  <Input
                    id="restaurantTitle"
                    defaultValue={restaurantPageData?.title || "Fine Dining Experience"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restaurantDescription">Page Description</Label>
                  <Textarea
                    id="restaurantDescription"
                    rows={3}
                    defaultValue={restaurantPageData?.description || "Savor exquisite culinary creations at our restaurant, where our talented chefs craft dishes using the finest local and international ingredients to deliver an unforgettable dining experience."}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chefName">Head Chef</Label>
                    <Input
                      id="chefName"
                      defaultValue={restaurantPageData?.headChef || "Chef Michael Roberts"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cuisineType">Cuisine Type</Label>
                    <Input
                      id="cuisineType"
                      defaultValue={restaurantPageData?.cuisineType || "Contemporary International"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restaurantHours">Opening Hours</Label>
                  <Textarea
                    id="restaurantHours"
                    rows={3}
                    defaultValue={restaurantPageData?.openingHours || "Breakfast: 6:30 AM - 10:30 AM\nLunch: 12:00 PM - 2:30 PM\nDinner: 6:00 PM - 10:30 PM"}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={saveRestaurantPageContent} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Dishes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Featured Dishes</span>
                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleAddDish}>
                  <PlusCircle size={14} />
                  <span>Add Dish</span>
                </Button>
              </CardTitle>
              <CardDescription>Manage featured dishes shown on the restaurant page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restaurantPageData?.featuredDishes?.length > 0 &&
                  restaurantPageData.featuredDishes.map((dish, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="font-medium">{dish.name}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditDish(dish)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <Layers size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteDish(dish)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Events Page Content</CardTitle>
              <CardDescription>Edit events page content and featured events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="eventsTitle">Page Title</Label>
                  <Input
                    id="eventsTitle"
                    defaultValue={eventsPageData?.title || "Events & Celebrations"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventsDescription">Page Description</Label>
                  <Textarea
                    id="eventsDescription"
                    rows={3}
                    defaultValue={eventsPageData?.description || "Host extraordinary events in our versatile venues, perfect for weddings, conferences, and special celebrations. Our dedicated team ensures every detail is flawlessly executed."}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventsCoverImage">Page Cover Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center">
                      {eventsPageData?.coverImage ? (
                        <img
                          src={getFullImageUrl(eventsPageData.coverImage)}
                          alt="Events page cover"
                          className="h-full w-full object-cover rounded"
                        />
                      ) : (
                        <ImageIcon size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={eventsFileInputRef}
                        onChange={handleEventsImageUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={handleEventsChangeImageClick}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                        Change Image
                      </Button>
                      {eventsPageData?.coverImage && (
                        <p className="text-xs text-gray-500 mt-1">
                          {eventsPageData.coverImage.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Featured Events</Label>
                    <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleAddEvent}>
                      <PlusCircle size={14} />
                      <span>Add Event</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {eventsPageData?.featuredEvents?.length > 0 ?
                      eventsPageData.featuredEvents.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{event.name}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteEvent(event)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      )) :
                      ["Wedding Packages", "Corporate Meetings", "Gala Dinners", "Birthday Celebrations"].map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{event}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meeting-hall" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Hall Page Content</CardTitle>
              <CardDescription>Edit the meeting hall page content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meetingHallTitle">Page Title</Label>
                  <Input
                    id="meetingHallTitle"
                    defaultValue={meetingHallPageData?.title || "Meeting Spaces"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingHallDescription">Page Description</Label>
                  <Textarea
                    id="meetingHallDescription"
                    rows={3}
                    defaultValue={meetingHallPageData?.description || "Host meetings and events in our versatile meeting spaces. Our dedicated team ensures every detail is flawlessly executed."}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingHallCoverImage">Page Cover Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center">
                      {meetingHallPageData?.coverImage ? (
                        <img
                          src={getFullImageUrl(meetingHallPageData.coverImage)}
                          alt="Meeting hall page cover"
                          className="h-full w-full object-cover rounded"
                        />
                      ) : (
                        <ImageIcon size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={meetingHallFileInputRef}
                        onChange={handleMeetingHallImageUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={handleMeetingHallChangeImageClick}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                        Change Image
                      </Button>
                      {meetingHallPageData?.coverImage && (
                        <p className="text-xs text-gray-500 mt-1">
                          {meetingHallPageData.coverImage.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menus" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menus</CardTitle>
              <CardDescription>Edit the website's navigation menus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Main Navigation</Label>
                    <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => handleAddNavItem(false)}>
                      <PlusCircle size={14} />
                      <span>Add Item</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {navigationData?.main?.length > 0 ?
                      navigationData.main.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{item.label}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditNavItem(item, false)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-500">
                              <ListOrdered size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteNavItem(item, false)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      )) :
                      ["Home", "Rooms & Suites", "Spa", "Restaurant", "Events", "Contact"].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{item}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditNavItem({ label: item, path: `/${item.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`, order: index }, false)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-500">
                              <ListOrdered size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Footer Navigation</Label>
                      <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => handleAddNavItem(true)}>
                        <PlusCircle size={14} />
                        <span>Add Item</span>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {navigationData?.footer?.length > 0 ?
                        navigationData.footer.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="font-medium">{item.label}</div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditNavItem(item, true)}>
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-gray-500">
                                <ListOrdered size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteNavItem(item, true)}>
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        )) :
                        ["About Us", "Careers", "Privacy Policy", "Terms of Service", "Sitemap"].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="font-medium">{item}</div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditNavItem({ label: item, path: `/${item.toLowerCase().replace(/\s+/g, '-')}`, order: index }, true)}>
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-gray-500">
                                <ListOrdered size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
              <CardDescription>Edit footer information and links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="footerAbout">About Text</Label>
                  <Textarea
                    id="footerAbout"
                    rows={3}
                    defaultValue={footerData?.aboutText || "Parkside Plaza Hotel offers luxury accommodations..."}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerAddress">Address</Label>
                    <Input
                      id="footerAddress"
                      defaultValue={footerData?.contactInfo?.address || "123 Park Avenue, New York, NY 10001"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footerPhone">Phone</Label>
                    <Input
                      id="footerPhone"
                      defaultValue={footerData?.contactInfo?.phone || "+1 (555) 123-4567"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footerEmail">Email</Label>
                    <Input
                      id="footerEmail"
                      defaultValue={footerData?.contactInfo?.email || "info@parksideplaza.com"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="copyrightText">Copyright Text</Label>
                    <Input
                      id="copyrightText"
                      defaultValue={footerData?.copyrightText || "© 2025 Parkside Plaza Hotel. All Rights Reserved."}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Social Media Links</Label>
                    <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleAddSocialMedia}>
                      <PlusCircle size={14} />
                      <span>Add Link</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {footerData?.socialMedia?.length > 0 ?
                      footerData.socialMedia.map((social, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{social.platform}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditSocialMedia(social)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteSocialMedia(social)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      )) :
                      ["Facebook", "Instagram", "Twitter", "LinkedIn"].map((social, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="font-medium">{social}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditSocialMedia({ platform: social, url: `https://${social.toLowerCase()}.com/parksideplaza`, icon: "" })}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Type size={16} />
            <span>Typography</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Palette size={16} />
            <span>Colors</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Layers size={16} />
            <span>Components</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RotateCcw size={16} />
            <span>Revert Changes</span>
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={saveContent}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save size={16} />}
            <span>Save All Changes</span>
          </Button>
        </div>
      </div>

      {/* Service Edit Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {selectedService ? "Update the service details below." : "Fill in the details for the new service."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={serviceForm.title}
                onChange={handleServiceFormChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={serviceForm.description}
                onChange={handleServiceFormChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <Input
                id="icon"
                name="icon"
                value={serviceForm.icon || ""}
                onChange={handleServiceFormChange}
                className="col-span-3"
                placeholder="e.g., room-icon, spa-icon"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleServiceSave}>
              {selectedService ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Category Edit Modal */}
      <Dialog open={isRoomCategoryModalOpen} onOpenChange={setIsRoomCategoryModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRoomCategory ? "Edit Room Category" : "Add New Room Category"}
            </DialogTitle>
            <DialogDescription>
              {selectedRoomCategory ? "Update the room category details below." : "Fill in the details for the new room category."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={roomCategoryForm.name}
                onChange={handleRoomCategoryFormChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={roomCategoryForm.description}
                onChange={handleRoomCategoryFormChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoomCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoomCategorySave}>
              {selectedRoomCategory ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Spa Service Edit Modal */}
      <Dialog open={isSpaServiceModalOpen} onOpenChange={setIsSpaServiceModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSpaService ? "Edit Spa Service" : "Add New Spa Service"}
            </DialogTitle>
            <DialogDescription>
              {selectedSpaService ? "Update the spa service details below." : "Fill in the details for the new spa service."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={spaServiceForm.name}
                onChange={handleSpaServiceFormChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={spaServiceForm.description}
                onChange={handleSpaServiceFormChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                value={spaServiceForm.price}
                onChange={handleSpaServiceFormChange}
                className="col-span-3"
                placeholder="e.g., $120"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                name="duration"
                value={spaServiceForm.duration}
                onChange={handleSpaServiceFormChange}
                className="col-span-3"
                placeholder="e.g., 60 minutes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSpaServiceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSpaServiceSave}>
              {selectedSpaService ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dish Edit Modal */}
      <Dialog open={isDishModalOpen} onOpenChange={setIsDishModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDish ? "Edit Featured Dish" : "Add New Featured Dish"}
            </DialogTitle>
            <DialogDescription>
              {selectedDish ? "Update the dish details below." : "Fill in the details for the new featured dish."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={dishForm.name}
                onChange={handleDishFormChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={dishForm.description}
                onChange={handleDishFormChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                value={dishForm.price}
                onChange={handleDishFormChange}
                className="col-span-3"
                placeholder="e.g., $35"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                value={dishForm.image}
                onChange={handleDishFormChange}
                className="col-span-3"
                placeholder="e.g., /uploads/filet-mignon.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDishModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDishSave}>
              {selectedDish ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Edit Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Featured Event" : "Add New Featured Event"}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? "Update the event details below." : "Fill in the details for the new featured event."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={eventForm.name}
                onChange={handleEventFormChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={eventForm.description}
                onChange={handleEventFormChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                value={eventForm.image}
                onChange={handleEventFormChange}
                className="col-span-3"
                placeholder="e.g., /uploads/wedding.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEventSave}>
              {selectedEvent ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Navigation Item Edit Modal */}
      <Dialog open={isFooterNavItemModalOpen} onOpenChange={setIsFooterNavItemModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedNavItem ? "Edit Footer Navigation Item" : "Add New Footer Navigation Item"}
            </DialogTitle>
            <DialogDescription>
              {selectedNavItem ? "Update the footer navigation item details below." : "Fill in the details for the new footer navigation item."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Label
              </Label>
              <Input
                id="label"
                name="label"
                value={navItemForm.label}
                onChange={handleNavItemFormChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="path" className="text-right">
                URL Path
              </Label>
              <Input
                id="path"
                name="path"
                value={navItemForm.path}
                onChange={handleNavItemFormChange}
                className="col-span-3"
                placeholder="e.g., /privacy-policy or /terms"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFooterNavItemModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleNavItemSave(true)}>
              {selectedNavItem ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Social Media Link Edit Modal */}
      <Dialog open={isSocialMediaModalOpen} onOpenChange={setIsSocialMediaModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSocialMedia ? "Edit Social Media Link" : "Add New Social Media Link"}
            </DialogTitle>
            <DialogDescription>
              {selectedSocialMedia ? "Update the social media link details below." : "Fill in the details for the new social media link."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Platform
              </Label>
              <Input
                id="platform"
                name="platform"
                value={socialMediaForm.platform}
                onChange={handleSocialMediaFormChange}
                className="col-span-3"
                placeholder="e.g., Facebook, Instagram"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                name="url"
                value={socialMediaForm.url}
                onChange={handleSocialMediaFormChange}
                className="col-span-3"
                placeholder="e.g., https://facebook.com/parksideplaza"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <Input
                id="icon"
                name="icon"
                value={socialMediaForm.icon}
                onChange={handleSocialMediaFormChange}
                className="col-span-3"
                placeholder="e.g., facebook-icon (optional)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSocialMediaModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSocialMediaSave}>
              {selectedSocialMedia ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation Item Edit Modal */}
      <Dialog open={isNavItemModalOpen} onOpenChange={setIsNavItemModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedNavItem ? "Edit Navigation Item" : "Add New Navigation Item"}
            </DialogTitle>
            <DialogDescription>
              {selectedNavItem ? "Update the navigation item details below." : "Fill in the details for the new navigation item."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Label
              </Label>
              <Input
                id="label"
                name="label"
                value={navItemForm.label}
                onChange={handleNavItemFormChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="path" className="text-right">
                URL Path
              </Label>
              <Input
                id="path"
                name="path"
                value={navItemForm.path}
                onChange={handleNavItemFormChange}
                className="col-span-3"
                placeholder="e.g., /rooms or /contact"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNavItemModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleNavItemSave(false)}>
              {selectedNavItem ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagementDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Plus, Edit, Trash2, Search, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

// Import the new modal components
import EditMenuItemModal from "./EditMenuItemModal";
import DeleteMenuItemModal from "./DeleteMenuItemModal";

// Interface for menu items from API
interface MenuItem {
  _id: string;
  name: string;
  category: { _id: string; name: string; description: string; };
  price: number;
  preparationTime: number;
  ingredients: string;
  available: boolean;
  images: string[];
  createdAt: string;
}

// Interface for restaurant tables
interface RestaurantTable {
  _id: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  reservationTime: string | null;
  customerName: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface for restaurant settings
interface RestaurantSettings {
  _id?: string;
  name: string;
  description: string;
  coverImage: string;
  headChef: string;
  cuisineType: string;
  openingHours: string;
}

// Mock data for restaurant orders
const mockOrders = [
  {
    id: "101",
    tableNumber: "12",
    items: ["Continental Breakfast", "Coffee"],
    status: "completed",
    total: 22.50,
    timestamp: "2025-04-09T08:32:00Z",
    customerName: "John Smith",
    roomNumber: "304"
  },
  {
    id: "102",
    tableNumber: "-",
    items: ["Caesar Salad", "Iced Tea"],
    status: "in-progress",
    total: 18.00,
    timestamp: "2025-04-09T12:15:00Z",
    customerName: "Jane Doe",
    roomNumber: "512"
  },
  {
    id: "103",
    tableNumber: "8",
    items: ["Filet Mignon", "Red Wine", "Chocolate Lava Cake"],
    status: "ordered",
    total: 64.50,
    timestamp: "2025-04-09T18:45:00Z",
    customerName: "Robert Johnson",
    roomNumber: "-"
  }
];

// Use hardcoded URLs to ensure they're correct
const MENU_ITEMS_ENDPOINT = "http://localhost:4000/api/restaurant/menu-items";
const TABLES_ENDPOINT = "http://localhost:4000/api/restaurant/tables";
const RESTAURANT_SETTINGS_ENDPOINT = "http://localhost:4000/api/restaurant/settings";
const MENU_CATEGORIES_ENDPOINT = "http://localhost:4000/api/restaurant/menu-categories";

const RestaurantManagementContent: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // New filters for tables
  const [tableStatusFilter, setTableStatusFilter] = useState("all");
  const [tableCapacityFilter, setTableCapacityFilter] = useState("all");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [tablesLoading, setTablesLoading] = useState(true);

  // States for edit and delete modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // New states for restaurant settings
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>({
    name: "",
    description: "",
    coverImage: "",
    headChef: "",
    cuisineType: "",
    openingHours: ""
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);

  console.log("API Endpoint:", MENU_ITEMS_ENDPOINT); // Log the endpoint

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      console.log("Fetching from:", MENU_ITEMS_ENDPOINT);
      const response = await axios.get(MENU_ITEMS_ENDPOINT);
      console.log("API Response:", response.data); // For debugging

      // Check the response structure and handle it accordingly
      if (response.data && Array.isArray(response.data)) {
        console.log("Menu items data:", response.data);
        setMenuItems(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log("Menu items data (nested):", response.data.data);
        setMenuItems(response.data.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items: " + (error instanceof Error ? error.message : String(error)));
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tables from API
  const fetchTables = async () => {
    try {
      setTablesLoading(true);
      console.log("Fetching tables from:", TABLES_ENDPOINT);
      const response = await axios.get(TABLES_ENDPOINT);
      console.log("Tables API Response:", response.data); // For debugging

      // Check the response structure and handle it accordingly
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setTables(response.data.data);
      } else {
        console.error("Unexpected API response format for tables:", response.data);
        setTables([]);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to load tables: " + (error instanceof Error ? error.message : String(error)));
      setTables([]);
    } finally {
      setTablesLoading(false);
    }
  };

  // Fetch restaurant settings
  const fetchRestaurantSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await axios.get(RESTAURANT_SETTINGS_ENDPOINT);
      if (response.data && response.data.data) {
        setRestaurantSettings(response.data.data);
        if (response.data.data.coverImage) {
          setCoverImagePreview(`http://localhost:4000${response.data.data.coverImage}`);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurant settings:", error);
      // Set default values if no settings exist
      setRestaurantSettings({
        name: "Parkside Plaza Restaurant",
        description: "Fine dining experience with contemporary international cuisine",
        coverImage: "",
        headChef: "Chef Michael Roberts",
        cuisineType: "Contemporary International",
        openingHours: "Breakfast: 6:30 AM - 10:30 AM\nLunch: 12:00 PM - 2:30 PM\nDinner: 6:00 PM - 10:30 PM"
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${MENU_CATEGORIES_ENDPOINT}?active=true`);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Sort categories by sortOrder and extract only needed fields
        const sortedCategories = response.data.data
          .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
          .map((cat: any) => ({ _id: cat._id, name: cat.name }));
        setCategories(sortedCategories);
      } else if (response.data && Array.isArray(response.data)) {
        const sortedCategories = response.data
          .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
          .map((cat: any) => ({ _id: cat._id, name: cat.name }));
        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Load menu items, tables, categories, and settings on component mount
  useEffect(() => {
    fetchMenuItems();
    fetchTables();
    fetchCategories();
    fetchRestaurantSettings();
  }, []);

  // Refetch tables when tab changes to tables
  useEffect(() => {
    if (activeTab === "tables") {
      fetchTables();
    } else if (activeTab === "settings") {
      fetchRestaurantSettings();
    }
  }, [activeTab]);

  // For testing - Add a sample menu item
  const addSampleMenuItem = async () => {
    try {
      toast.info("Adding sample menu item...");
      const sampleItem = {
        name: "Sample Menu Item",
        description: "This is a sample menu item for testing",
        category: "breakfast",
        price: 15.99,
        preparationTime: 20,
        ingredients: "Sample ingredients",
        available: true
      };

      // Try to add a sample menu item to test the API
      const response = await axios.post(MENU_ITEMS_ENDPOINT, sampleItem);
      console.log("Sample item added:", response.data);
      toast.success("Sample item added successfully!");

      // Refresh the menu items
      fetchMenuItems();
    } catch (error) {
      console.error("Error adding sample item:", error);
      toast.error("Failed to add sample item: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Handle opening the edit modal
  const handleEditMenuItem = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsEditModalOpen(true);
  };

  // Handle opening the delete modal
  const handleDeleteMenuItem = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsDeleteModalOpen(true);
  };

  // Handle successful operations
  const handleSuccess = () => {
    fetchMenuItems();
  };

  // Handle table status update
  const handleUpdateTableStatus = async (tableId: string, newStatus: "available" | "occupied" | "reserved") => {
    try {
      await axios.put(`${TABLES_ENDPOINT}/status/${tableId}`, { status: newStatus });
      toast.success(`Table status updated to ${newStatus}`);
      // Refresh the tables
      fetchTables();
    } catch (error) {
      console.error("Error updating table status:", error);
      toast.error("Failed to update table status");
    }
  };

  // Filter menu items based on search query and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category.name === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Filter orders based on search query and status
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          order.id.includes(searchQuery);
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter tables based on search query, status, and capacity
  const filteredTables = tables.filter(table => {
    // Search by table number
    const matchesSearch =
      searchQuery === "" ||
      table.number.toString().includes(searchQuery) ||
      (table.customerName && table.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by status
    const matchesStatus = tableStatusFilter === "all" || table.status === tableStatusFilter;

    // Filter by capacity
    const matchesCapacity = tableCapacityFilter === "all" ||
      (tableCapacityFilter === "1-2" && table.capacity >= 1 && table.capacity <= 2) ||
      (tableCapacityFilter === "3-4" && table.capacity >= 3 && table.capacity <= 4) ||
      (tableCapacityFilter === "5-6" && table.capacity >= 5 && table.capacity <= 6) ||
      (tableCapacityFilter === "7+" && table.capacity >= 7);

    return matchesSearch && matchesStatus && matchesCapacity;
  });

  const handleAddMenuItem = () => {
    navigate("/admin/restaurant/add-item");
  };

  const handleUpdateOrderStatus = (id: string, newStatus: string) => {
    toast.success(`Order ${id} status updated to ${newStatus}`);
  };

  // Get human-readable time from timestamp
  const getTimeFromTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    if (activeTab === "menu") {
      setCategoryFilter("all");
    } else if (activeTab === "orders") {
      setOrderStatusFilter("all");
    } else if (activeTab === "tables") {
      setTableStatusFilter("all");
      setTableCapacityFilter("all");
    }
  };

  // Handle cover image upload
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedCoverImage(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  // Remove cover image
  const removeCoverImage = () => {
    setSelectedCoverImage(null);
    setCoverImagePreview("");
    setRestaurantSettings(prev => ({ ...prev, coverImage: "" }));
  };

  // Save restaurant settings
  const saveRestaurantSettings = async () => {
    try {
      setSettingsLoading(true);

      const formData = new FormData();
      formData.append("name", restaurantSettings.name);
      formData.append("description", restaurantSettings.description);
      formData.append("headChef", restaurantSettings.headChef);
      formData.append("cuisineType", restaurantSettings.cuisineType);
      formData.append("openingHours", restaurantSettings.openingHours);

      if (selectedCoverImage) {
        formData.append("coverImage", selectedCoverImage);
      }

      const response = await axios.post(RESTAURANT_SETTINGS_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Restaurant settings updated successfully");
      
      // Update local state with response data
      if (response.data && response.data.data) {
        setRestaurantSettings(response.data.data);
        if (response.data.data.coverImage) {
          setCoverImagePreview(`http://localhost:4000${response.data.data.coverImage}`);
        }
      }
      
      setSelectedCoverImage(null);
    } catch (error) {
      console.error("Error saving restaurant settings:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to save restaurant settings");
      } else {
        toast.error("An error occurred while saving restaurant settings");
      }
    } finally {
      setSettingsLoading(false);
    }
  };

  // Add early return for debugging
  console.log("RestaurantManagementContent: Rendering, activeTab:", activeTab);

  // Temporary test render
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode - rendering basic component");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Restaurant Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/restaurant/categories")}>
            Manage Categories
          </Button>
          <Button onClick={handleAddMenuItem}>
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <div className="my-4 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "tables" ? "Search by table number..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {activeTab === "menu" && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {activeTab === "orders" && (
            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}

          {activeTab === "tables" && (
            <>
              <Select value={tableStatusFilter} onValueChange={setTableStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tableCapacityFilter} onValueChange={setTableCapacityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Capacities</SelectItem>
                  <SelectItem value="1-2">1-2 Seats</SelectItem>
                  <SelectItem value="3-4">3-4 Seats</SelectItem>
                  <SelectItem value="5-6">5-6 Seats</SelectItem>
                  <SelectItem value="7+">7+ Seats</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            </>
          )}
        </div>
        
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Loading menu items...</span>
                </div>
              ) : (
                <>
                  {/* Debug section - Remove in production */}
                  {menuItems.length === 0 && (
                    <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                      <p className="mb-2">No menu items found. This could be because:</p>
                      <ol className="list-decimal ml-5 mb-3">
                        <li>You haven't added any menu items yet</li>
                        <li>There's an issue connecting to the API ({MENU_ITEMS_ENDPOINT})</li>
                        <li>The API is returning data in an unexpected format</li>
                      </ol>
                      <Button onClick={addSampleMenuItem} variant="outline" className="mr-2">
                        Add Sample Item (Debug)
                      </Button>
                      <Button onClick={() => window.location.reload()} variant="outline">
                        Refresh Page
                      </Button>
                    </div>
                  )}

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Preparation Time</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMenuItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">No menu items found</TableCell>
                        </TableRow>
                      ) : (
                        filteredMenuItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <div className="w-12 h-12 rounded-md overflow-hidden">
                                {item.images && item.images.length > 0 ? (
                                  <img
                                    src={`http://localhost:4000${item.images[0]}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error("Image failed to load:", item.images[0]);
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
                                    No Image
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="capitalize">{item.category.name}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>{item.preparationTime} min</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {item.available ? "Yes" : "No"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditMenuItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-red-500"
                                  onClick={() => handleDeleteMenuItem(item)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Room / Table</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">No orders found</TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell>
                          {order.roomNumber !== "-" ? (
                            <span>Room {order.roomNumber}</span>
                          ) : (
                            <span>Table {order.tableNumber}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {order.items.join(", ")}
                          </div>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${order.status === "completed" ? "bg-green-100 text-green-800" :
                            order.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                            order.status === "ordered" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"}`}>
                            {order.status === "in-progress" ? "In Progress" : 
                             order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ordered">Ordered</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tables">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Restaurant Tables</CardTitle>
              <div className="text-sm text-muted-foreground">
                {filteredTables.length} tables found
              </div>
            </CardHeader>
            <CardContent>
              {tablesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Loading tables...</span>
                </div>
              ) : tables.length === 0 ? (
                <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                  <p className="mb-2">No restaurant tables found. This could be because:</p>
                  <ol className="list-decimal ml-5 mb-3">
                    <li>You haven't added any tables yet</li>
                    <li>There's an issue connecting to the API ({TABLES_ENDPOINT})</li>
                    <li>The API is returning data in an unexpected format</li>
                  </ol>
                  <Button onClick={fetchTables} variant="outline">
                    Refresh Tables
                  </Button>
                </div>
              ) : filteredTables.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No tables match your search criteria</p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTables.map((table) => (
                    <Card
                      key={table._id}
                      className={
                        table.status === "occupied" ? "bg-green-50" :
                          table.status === "reserved" ? "bg-yellow-50" :
                            "bg-white"
                      }
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${table.status === "occupied" ? "bg-green-100 text-green-800" :
                          table.status === "reserved" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"}`}>
                          {table.number}
                        </div>
                        <p className="mt-2 font-medium">Table {table.number}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {table.status}
                        </p>
                        <p className="text-xs text-gray-400">
                          {table.status === "available" ?
                            `${table.capacity} Seats` :
                            table.status === "reserved" ?
                              `Reserved for ${table.reservationTime}` :
                              `${table.customerName || 'Customer'} since ${getTimeFromTimestamp(table.updatedAt)}`
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Loading restaurant settings...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cover Image Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Restaurant Cover Image</h3>
                    
                    {/* Current cover image */}
                    {coverImagePreview ? (
                      <div className="relative">
                        <img
                          src={coverImagePreview}
                          alt="Restaurant cover"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeCoverImage}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => document.getElementById('cover-image-upload')?.click()}
                      >
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">Upload Restaurant Cover Image</p>
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    )}
                    
                    <input
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverImageChange}
                    />
                  </div>

                  {/* Restaurant Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Restaurant Name</label>
                      <Input
                        value={restaurantSettings.name}
                        onChange={(e) => setRestaurantSettings(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Restaurant name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Head Chef</label>
                      <Input
                        value={restaurantSettings.headChef}
                        onChange={(e) => setRestaurantSettings(prev => ({ ...prev, headChef: e.target.value }))}
                        placeholder="Chef name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cuisine Type</label>
                      <Input
                        value={restaurantSettings.cuisineType}
                        onChange={(e) => setRestaurantSettings(prev => ({ ...prev, cuisineType: e.target.value }))}
                        placeholder="e.g., Contemporary International"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={restaurantSettings.description}
                      onChange={(e) => setRestaurantSettings(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Restaurant description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Opening Hours</label>
                    <Textarea
                      value={restaurantSettings.openingHours}
                      onChange={(e) => setRestaurantSettings(prev => ({ ...prev, openingHours: e.target.value }))}
                      placeholder="Opening hours"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={saveRestaurantSettings} disabled={settingsLoading}>
                      {settingsLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Settings"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {selectedMenuItem && (
        <EditMenuItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          menuItemId={selectedMenuItem._id}
          onSuccess={handleSuccess}
        />
      )}

      {/* Delete Modal */}
      {selectedMenuItem && (
        <DeleteMenuItemModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          menuItemId={selectedMenuItem._id}
          menuItemName={selectedMenuItem.name}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default RestaurantManagementContent;

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Heart, Utensils, User } from "lucide-react";
import { useState, useEffect } from "react";
import AvailabilityCalendar from "@/components/Admin/Availability/AvailabilityCalendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";
import { getAllRooms, Room } from "@/services/roomService";
import { getAllSpaServices, getAllSpaSpecialists, SpaService, SpaSpecialist } from "@/services/spaService";
import { getAllRestaurantSections, RestaurantSection } from "@/services/restaurantService";

interface UserData {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

// API base URL
const API_URL = "http://localhost:4000/api";

const AvailabilityManagementPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [availableTabs, setAvailableTabs] = useState<string[]>([]);

  // Room states
  const [roomTypes, setRoomTypes] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  // Spa services states
  const [spaServices, setSpaServices] = useState<SpaService[]>([]);
  const [selectedSpaService, setSelectedSpaService] = useState<string>("");

  // Spa specialists states
  const [spaSpecialists, setSpaSpecialists] = useState<SpaSpecialist[]>([]);
  const [selectedSpaSpecialist, setSelectedSpaSpecialist] = useState<string>("");

  // Restaurant sections states
  const [restaurantSections, setRestaurantSections] = useState<RestaurantSection[]>([]);
  const [selectedRestaurantSection, setSelectedRestaurantSection] = useState<string>("");

  // Loading states
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingSpaServices, setIsLoadingSpaServices] = useState(true);
  const [isLoadingSpaSpecialists, setIsLoadingSpaSpecialists] = useState(true);
  const [isLoadingRestaurantSections, setIsLoadingRestaurantSections] = useState(true);

  // Get selected room details
  const getSelectedRoom = () => {
    const room = roomTypes.find(room => room._id === selectedRoom);
    return room ? {
      id: room._id,
      name: room.name,
      capacity: room.totalRooms
    } : { id: "", name: "Loading...", capacity: 0 };
  };

  // Get selected spa service details
  const getSelectedSpaService = () => {
    const service = spaServices.find(service => service._id === selectedSpaService);
    return service ? {
      id: service._id,
      name: service.name,
      capacity: service.capacity
    } : { id: "", name: "Loading...", capacity: 0 };
  };

  // Get selected spa specialist details
  const getSelectedSpaSpecialist = () => {
    const specialist = spaSpecialists.find(specialist => specialist._id === selectedSpaSpecialist);
    return specialist ? {
      id: specialist._id,
      name: specialist.name,
      capacity: specialist.capacity,
      role: specialist.role
    } : { id: "", name: "Loading...", capacity: 0, role: "" };
  };

  // Get selected restaurant section details
  const getSelectedRestaurantSection = () => {
    const section = restaurantSections.find(section => section._id === selectedRestaurantSection);
    return section ? {
      id: section._id,
      name: section.name,
      capacity: section.capacity
    } : { id: "", name: "Loading...", capacity: 0 };
  };

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const rooms = await getAllRooms();

      if (rooms && rooms.length > 0) {
        setRoomTypes(rooms);
        setSelectedRoom(rooms[0]._id);
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  // Fetch spa services from API
  const fetchSpaServices = async () => {
    try {
      setIsLoadingSpaServices(true);
      const services = await getAllSpaServices();

      if (services && services.length > 0) {
        setSpaServices(services);
        setSelectedSpaService(services[0]._id);
      }
    } catch (error) {
      console.error("Error fetching spa services:", error);
    } finally {
      setIsLoadingSpaServices(false);
    }
  };

  // Fetch spa specialists from API
  const fetchSpaSpecialists = async () => {
    try {
      setIsLoadingSpaSpecialists(true);
      const specialists = await getAllSpaSpecialists();

      if (specialists && specialists.length > 0) {
        setSpaSpecialists(specialists);
        setSelectedSpaSpecialist(specialists[0]._id);
      }
    } catch (error) {
      console.error("Error fetching spa specialists:", error);
    } finally {
      setIsLoadingSpaSpecialists(false);
    }
  };

  // Fetch restaurant sections from API
  const fetchRestaurantSections = async () => {
    try {
      setIsLoadingRestaurantSections(true);
      const sections = await getAllRestaurantSections();

      if (sections && sections.length > 0) {
        setRestaurantSections(sections);
        setSelectedRestaurantSection(sections[0]._id);
      }
    } catch (error) {
      console.error("Error fetching restaurant sections:", error);
    } finally {
      setIsLoadingRestaurantSections(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchRooms();
    fetchSpaServices();
    fetchSpaSpecialists();
    fetchRestaurantSections();
  }, []);

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      const user = JSON.parse(userDataString);
      setUserData(user);

      // Determine which tabs are available based on department
      const tabs: string[] = [];

      if (user.department === "Front Office" || user.department === "Housekeeping" ||
        user.department === "Management") {
        tabs.push("rooms");
      }

      if (user.department === "Spa & Wellness" || user.department === "Management") {
        tabs.push("spa");
        tabs.push("specialists"); // Add specialists tab for Spa department
      }

      if (user.department === "Food & Beverage" || user.department === "Management") {
        tabs.push("restaurant");
      }

      setAvailableTabs(tabs);

      // Set active tab to the first available one
      if (tabs.length > 0 && !activeTab) {
        setActiveTab(tabs[0]);
      }
    }
  }, [activeTab]);

  if (!userData || availableTabs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading availability data...</p>
      </div>
    );
  }

  return (
    <AuthGuard requiredDepartments={["Management", "Front Office", "Housekeeping", "Spa & Wellness", "Food & Beverage"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {userData?.department} Availability Management
          </h1>
        </div>

        <Tabs value={activeTab || availableTabs[0]} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${availableTabs.length === 1 ? 'grid-cols-1' :
            availableTabs.length === 2 ? 'grid-cols-2' :
              availableTabs.length === 3 ? 'grid-cols-3' :
                'grid-cols-4'} mb-6`}>
            {availableTabs.includes("rooms") && (
              <TabsTrigger value="rooms" className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                <span>Rooms</span>
              </TabsTrigger>
            )}
            {availableTabs.includes("spa") && (
              <TabsTrigger value="spa" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Spa Services</span>
              </TabsTrigger>
            )}
            {availableTabs.includes("specialists") && (
              <TabsTrigger value="specialists" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Spa Specialists</span>
              </TabsTrigger>
            )}
            {availableTabs.includes("restaurant") && (
              <TabsTrigger value="restaurant" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                <span>Restaurant</span>
              </TabsTrigger>
            )}
          </TabsList>

          {availableTabs.includes("rooms") && (
            <TabsContent value="rooms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Room Availability</CardTitle>
                  <CardDescription>Manage room availability by date</CardDescription>
                  <div className="mt-4">
                    <Select value={selectedRoom} onValueChange={setSelectedRoom} disabled={isLoadingRooms || roomTypes.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingRooms ? "Loading room types..." : "Select room type"} />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map(room => (
                          <SelectItem key={room._id} value={room._id}>
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="w-full max-w-none">
                  {selectedRoom ? (
                    <AvailabilityCalendar
                      serviceType="room"
                      initialCapacity={getSelectedRoom().capacity}
                      name={getSelectedRoom().name}
                      serviceId={selectedRoom}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <p>Select a room type to manage availability</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {availableTabs.includes("spa") && (
            <TabsContent value="spa" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spa Availability</CardTitle>
                  <CardDescription>Manage spa service availability by date</CardDescription>
                  <div className="mt-4">
                    <Select value={selectedSpaService} onValueChange={setSelectedSpaService} disabled={isLoadingSpaServices || spaServices.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingSpaServices ? "Loading spa services..." : "Select spa service"} />
                      </SelectTrigger>
                      <SelectContent>
                        {spaServices.map(service => (
                          <SelectItem key={service._id} value={service._id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="w-full max-w-none">
                  {selectedSpaService ? (
                    <AvailabilityCalendar
                      serviceType="spa"
                      initialCapacity={getSelectedSpaService().capacity}
                      name={getSelectedSpaService().name}
                      serviceId={selectedSpaService}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <p>{isLoadingSpaServices ? "Loading spa services..." : "No spa services available"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {availableTabs.includes("specialists") && (
            <TabsContent value="specialists" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spa Specialist Availability</CardTitle>
                  <CardDescription>Manage spa specialist availability by date</CardDescription>
                  <div className="mt-4">
                    <Select value={selectedSpaSpecialist} onValueChange={setSelectedSpaSpecialist} disabled={isLoadingSpaSpecialists || spaSpecialists.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingSpaSpecialists ? "Loading specialists..." : "Select specialist"} />
                      </SelectTrigger>
                      <SelectContent>
                        {spaSpecialists.map(specialist => (
                          <SelectItem key={specialist._id} value={specialist._id}>
                            {specialist.name} - {specialist.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="w-full max-w-none">
                  {selectedSpaSpecialist ? (
                    <AvailabilityCalendar
                      serviceType="specialist"
                      initialCapacity={getSelectedSpaSpecialist().capacity}
                      name={getSelectedSpaSpecialist().name}
                      serviceId={selectedSpaSpecialist}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <p>{isLoadingSpaSpecialists ? "Loading spa specialists..." : "No spa specialists available"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {availableTabs.includes("restaurant") && (
            <TabsContent value="restaurant" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Availability</CardTitle>
                  <CardDescription>Manage restaurant table availability by date</CardDescription>
                  <div className="mt-4">
                    <Select value={selectedRestaurantSection} onValueChange={setSelectedRestaurantSection} disabled={isLoadingRestaurantSections || restaurantSections.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingRestaurantSections ? "Loading restaurant sections..." : "Select restaurant section"} />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurantSections.map(section => (
                          <SelectItem key={section._id} value={section._id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="w-full max-w-none">
                  {selectedRestaurantSection ? (
                    <AvailabilityCalendar
                      serviceType="restaurant"
                      initialCapacity={getSelectedRestaurantSection().capacity}
                      name={getSelectedRestaurantSection().name}
                      serviceId={selectedRestaurantSection}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <p>{isLoadingRestaurantSections ? "Loading restaurant sections..." : "No restaurant sections available"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AuthGuard>
  );
};

export default AvailabilityManagementPage;

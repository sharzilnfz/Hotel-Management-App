import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Calendar, ChartBar, DollarSign, HomeIcon, Users, ArrowUpRight, Heart, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import axios from "axios";

interface AdminDashboardContentProps {
  departmentFilter?: string;
}

// Room interface
interface Room {
  _id: string;
  name: string;
  active: boolean;
  totalRooms: number;
  availableRooms: number;
  createdAt?: string;
  updatedAt?: string;
}

const AdminDashboardContent = ({ departmentFilter = "Management" }: AdminDashboardContentProps) => {
  // State for room data and stats
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomStats, setRoomStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    availableRoomsYesterday: 0,
    changeSinceYesterday: 0,
    loading: true
  });

  // Fetch room data when component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/rooms");
        if (response.data.success) {
          const roomsData = response.data.data;
          setRooms(roomsData);

          // Get today's date (start of day)
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Get yesterday's date (start of day)
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          // Filter to only get active rooms
          const activeRooms = roomsData.filter((room: Room) => room.active);

          // Calculate active room count (just the count of active room types)
          const activeRoomCount = activeRooms.length;

          // Calculate total rooms (all room types)
          const totalRoomTypeCount = roomsData.length;

          // Count rooms added today (only count active rooms)
          const activeRoomsAddedToday = roomsData.reduce((count, room) => {
            if (room.active && room.createdAt) {
              const createdAt = new Date(room.createdAt);
              if (createdAt >= today) {
                // Count new active rooms added today
                return count + 1; // Add 1 for each room type, not totalRooms
              }
            }
            return count;
          }, 0);

          // Calculate yesterday's active room count
          const activeRoomsYesterday = activeRoomCount - activeRoomsAddedToday;

          console.log({
            totalRoomTypes: totalRoomTypeCount,
            activeRoomTypes: activeRoomCount,
            activeRoomsAddedToday,
            activeRoomsYesterday
          });

          setRoomStats({
            totalRooms: totalRoomTypeCount,
            availableRooms: activeRoomCount,
            availableRoomsYesterday: activeRoomsYesterday,
            changeSinceYesterday: activeRoomsAddedToday,
            loading: false
          });
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        setRoomStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchRooms();
  }, []);

  // Function to check if a component should be visible for the current department
  const isVisibleForDepartment = (allowedDepartments: string[]) => {
    return departmentFilter === "Management" || allowedDepartments.includes(departmentFilter);
  };

  // Department-specific metrics
  const getDepartmentTitle = () => {
    if (departmentFilter === "Management") {
      return "Hotel Overview";
    }
    return `${departmentFilter} Dashboard`;
  };

  // Format the change indicator text
  const getChangeText = () => {
    if (roomStats.changeSinceYesterday > 0) {
      return `+${roomStats.changeSinceYesterday} new room${roomStats.changeSinceYesterday > 1 ? 's' : ''} added today`;
    } else if (roomStats.changeSinceYesterday < 0) {
      return `${roomStats.changeSinceYesterday} room${Math.abs(roomStats.changeSinceYesterday) > 1 ? 's' : ''} removed today`;
    } else {
      return "No new rooms today";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{getDepartmentTitle()}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 7 Days
          </Button>
          {isVisibleForDepartment(["Management", "Finance"]) && (
            <Button variant="outline" size="sm">
              <ChartBar className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Show room metrics only for relevant departments */}
        {isVisibleForDepartment(["Management", "Front Office", "Housekeeping"]) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {roomStats.loading ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{roomStats.availableRooms}</div>
                  <p className="text-xs text-muted-foreground">{getChangeText()}</p>
                  <Progress
                    value={roomStats.totalRooms > 0 ? (roomStats.availableRooms / roomStats.totalRooms) * 100 : 0}
                    className="h-1 mt-2"
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Show reservation metrics for relevant departments */}
        {isVisibleForDepartment(["Management", "Front Office", "Sales & Marketing"]) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
              <Progress value={42} className="h-1 mt-2" />
            </CardContent>
          </Card>
        )}

        {/* Show guest metrics for relevant departments */}
        {isVisibleForDepartment(["Management", "Front Office", "Housekeeping"]) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Guests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Same as yesterday</p>
              <Progress value={60} className="h-1 mt-2" />
            </CardContent>
          </Card>
        )}

        {/* Show revenue metrics for relevant departments */}
        {isVisibleForDepartment(["Management", "Finance", "Sales & Marketing"]) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$6,420</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              <Progress value={78} className="h-1 mt-2" />
            </CardContent>
          </Card>
        )}

        {/* Department-specific metrics */}
        {departmentFilter === "Spa & Wellness" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Spa Bookings Today</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
              <Progress value={60} className="h-1 mt-2" />
            </CardContent>
          </Card>
        )}

        {departmentFilter === "Food & Beverage" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Restaurant Reservations</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
              <Progress value={70} className="h-1 mt-2" />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions card - show department-specific actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {isVisibleForDepartment(["Management", "Front Office", "Housekeeping"]) && (
                <Button variant="outline" className="h-auto py-3 justify-start" asChild>
                  <Link to="/admin/rooms/add">
                    <Bed className="mr-2 h-4 w-4" />
                    <span>Add New Room</span>
                  </Link>
                </Button>
              )}

              {isVisibleForDepartment(["Management", "Front Office"]) && (
                <Button variant="outline" className="h-auto py-3 justify-start" asChild>
                  <Link to="/admin/rooms">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Manage Bookings</span>
                  </Link>
                </Button>
              )}

              {isVisibleForDepartment(["Management", "Sales & Marketing"]) && (
                <Button variant="outline" className="h-auto py-3 justify-start" asChild>
                  <Link to="/admin/events">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>Add New Event</span>
                  </Link>
                </Button>
              )}

              {isVisibleForDepartment(["Management", "Sales & Marketing"]) && (
                <Button variant="outline" className="h-auto py-3 justify-start" asChild>
                  <Link to="/admin/promo-codes">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Create Promo Code</span>
                  </Link>
                </Button>
              )}

              {departmentFilter === "Spa & Wellness" && (
                <>
                  <Button variant="outline" className="h-auto py-3 justify-start" asChild>
                    <Link to="/admin/spa/add-service">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Add New Service</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 justify-start" asChild>
                    <Link to="/admin/spa/bookings">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>View Spa Bookings</span>
                    </Link>
                  </Button>
                </>
              )}

              {departmentFilter === "Food & Beverage" && (
                <>
                  <Button variant="outline" className="h-auto py-3 justify-start" asChild>
                    <Link to="/admin/restaurant/add-item">
                      <Utensils className="mr-2 h-4 w-4" />
                      <span>Add Menu Item</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 justify-start" asChild>
                    <Link to="/admin/restaurant/orders">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>View Restaurant Orders</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity - make department specific */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest {departmentFilter !== "Management" ? departmentFilter : "system"} events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {departmentFilter === "Management" || departmentFilter === "Front Office" ? (
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-sm font-medium">New booking confirmed</p>
                    <p className="text-xs text-muted-foreground">Luxury Suite - April 15-17</p>
                    <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                  </div>
                </li>
              ) : null}

              {departmentFilter === "Management" || departmentFilter === "Food & Beverage" ? (
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-sm font-medium">Staff login</p>
                    <p className="text-xs text-muted-foreground">Restaurant Manager - Jane Smith</p>
                    <p className="text-xs text-muted-foreground mt-1">45 minutes ago</p>
                  </div>
                </li>
              ) : null}

              {departmentFilter === "Management" || departmentFilter === "Sales & Marketing" ? (
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-yellow-500"></div>
                  <div>
                    <p className="text-sm font-medium">Promo code created</p>
                    <p className="text-xs text-muted-foreground">SUMMER25 - 20% off all spa services</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </li>
              ) : null}

              {departmentFilter === "Management" || departmentFilter === "Housekeeping" ? (
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="text-sm font-medium">Room maintenance scheduled</p>
                    <p className="text-xs text-muted-foreground">Room 302 - Carpet replacement</p>
                    <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                  </div>
                </li>
              ) : null}

              {departmentFilter === "Spa & Wellness" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">New spa booking</p>
                      <p className="text-xs text-muted-foreground">Hot Stone Massage - 2:00 PM</p>
                      <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm font-medium">Inventory updated</p>
                      <p className="text-xs text-muted-foreground">Essential oils restocked</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </li>
                </>
              )}

              {departmentFilter === "Food & Beverage" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">New dinner reservation</p>
                      <p className="text-xs text-muted-foreground">Table for 4 - 7:30 PM</p>
                      <p className="text-xs text-muted-foreground mt-1">20 minutes ago</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-yellow-500"></div>
                    <div>
                      <p className="text-sm font-medium">Menu item added</p>
                      <p className="text-xs text-muted-foreground">New seafood special</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Only show these sections for management or relevant departments */}
      {isVisibleForDepartment(["Management", "Sales & Marketing"]) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program</CardTitle>
              <CardDescription>Member statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Members</span>
                  <span className="font-bold">1,254</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Platinum</span>
                    <span>128 members</span>
                  </div>
                  <Progress value={10} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gold</span>
                    <span>376 members</span>
                  </div>
                  <Progress value={30} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Silver</span>
                    <span>750 members</span>
                  </div>
                  <Progress value={60} className="h-1" />
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin/loyalty">
                    Manage Loyalty Program
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Summer Gala Dinner</p>
                    <p className="text-xs text-muted-foreground">Grand Ballroom • Tomorrow • 7:00 PM</p>
                  </div>
                  <Button variant="outline" size="sm">Details</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wine Tasting Workshop</p>
                    <p className="text-xs text-muted-foreground">Restaurant • April 12 • 5:30 PM</p>
                  </div>
                  <Button variant="outline" size="sm">Details</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wellness Weekend</p>
                    <p className="text-xs text-muted-foreground">Spa & Pool Area • April 15-16 • All Day</p>
                  </div>
                  <Button variant="outline" size="sm">Details</Button>
                </div>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin/events">
                    View All Events
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardContent;

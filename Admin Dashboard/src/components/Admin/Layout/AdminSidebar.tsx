import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bed,
  Ticket,
  Utensils,
  Award,
  Users,
  Settings,
  Tag,
  BarChart,
  Undo2,
  LogOut,
  ChevronDown,
  ChevronRight,
  FileEdit,
  Calendar as CalendarIcon,
  Flower2,
  DollarSign,
  ClipboardList,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarItemProps {
  icon: JSX.Element;
  title: string;
  path: string;
  isActive: boolean;
  hasSubmenu?: boolean;
  submenuItems?: { title: string; path: string }[];
  requiredAccessLevels?: string[];
  requiredDepartments?: string[];
}

interface UserData {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

const SidebarItem = ({
  icon,
  title,
  path,
  isActive,
  hasSubmenu = false,
  submenuItems = [],
  requiredAccessLevels = ["Full Access", "Administrative", "Standard", "Limited", "Read Only"],
  requiredDepartments = []
}: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      const user = JSON.parse(userDataString);
      setUserData(user);

      const hasAccessLevel = requiredAccessLevels.includes(user.accessLevel);
      const hasDepartmentAccess = requiredDepartments.length === 0 || requiredDepartments.includes(user.department);

      setCanView(hasAccessLevel && hasDepartmentAccess);
    }
  }, [requiredAccessLevels.join(','), requiredDepartments.join(',')]);

  if (!canView && userData) return null;

  const handleToggle = () => {
    if (hasSubmenu) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-1">
      {hasSubmenu ? (
        <button
          onClick={handleToggle}
          className={`flex items-center w-full p-3 rounded-lg transition-colors ${isActive ? "bg-hotel-primary text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <span className="mr-3">{icon}</span>
          <span className="flex-1">{title}</span>
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
      ) : (
        <Link
          to={path}
          className={`flex items-center p-3 rounded-lg transition-colors ${isActive ? "bg-hotel-primary text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <span className="mr-3">{icon}</span>
          <span>{title}</span>
        </Link>
      )}

      {hasSubmenu && isOpen && (
        <div className="pl-10 mt-1 space-y-1">
          {submenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="block py-2 px-3 text-sm text-gray-700 hover:text-hotel-primary rounded-lg hover:bg-gray-50"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      setUserData(JSON.parse(userDataString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/admin-login";
  };

  return (
    <div className="w-64 bg-white shadow-sm h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-hotel-primary">Hotel Admin</h2>
        {userData && (
          <p className="text-sm text-gray-500 mt-1">{userData.department}</p>
        )}
      </div>

      <nav className="mt-4 px-2">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          title="Dashboard"
          path="/admin"
          isActive={pathname === "/admin"}
        />

        <SidebarItem
          icon={<Bed size={20} />}
          title="Rooms"
          path="/admin/rooms"
          isActive={pathname.startsWith("/admin/rooms")}
          hasSubmenu={true}
          submenuItems={[
            { title: "All Rooms", path: "/admin/rooms" },
            { title: "Add Room", path: "/admin/rooms/add" },
            { title: "Bookings", path: "/admin/rooms/bookings" },
            { title: "Reports", path: "/admin/rooms/reports" },
          ]}
          requiredDepartments={["Management", "Front Office", "Housekeeping"]}
        />

        <SidebarItem
          icon={<ClipboardList size={20} />}
          title="Housekeeping"
          path="/admin/housekeeping"
          isActive={pathname.startsWith("/admin/housekeeping")}
          hasSubmenu={true}
          submenuItems={[
            { title: "Room Status", path: "/admin/housekeeping" },
            { title: "Task Management", path: "/admin/housekeeping/tasks" },
            { title: "Staff", path: "/admin/housekeeping/staff" },
            { title: "Supplies", path: "/admin/housekeeping/supplies" },
            { title: "Schedule", path: "/admin/housekeeping/schedule" },
            { title: "Reports", path: "/admin/housekeeping/reports" },
          ]}
          requiredDepartments={["Management", "Housekeeping"]}
        />

        <SidebarItem
          icon={<Flower2 size={20} />}
          title="Spa"
          path="/admin/spa"
          isActive={pathname.startsWith("/admin/spa")}
          hasSubmenu={true}
          submenuItems={[
            { title: "All Services", path: "/admin/spa" },
            { title: "Add Service", path: "/admin/spa/add-service" },
            { title: "Add Specialist", path: "/admin/spa/add-specialist" },
            { title: "Categories", path: "/admin/spa/categories" },
            { title: "Bookings", path: "/admin/spa/bookings" },
            { title: "Reports", path: "/admin/spa/reports" },
          ]}
          requiredDepartments={["Management", "Spa & Wellness"]}
        />

        <SidebarItem
          icon={<Ticket size={20} />}
          title="Events"
          path="/admin/events"
          isActive={pathname.startsWith("/admin/events")}
          hasSubmenu={true}
          submenuItems={[
            { title: "All Events", path: "/admin/events" },
            { title: "Add Event", path: "/admin/events/add" },
            { title: "Bookings", path: "/admin/events/bookings" },
            { title: "Reports", path: "/admin/events/reports" },
            { title: "Scanner", path: "/admin/events/scanner" },
          ]}
          requiredDepartments={["Management", "Events", "Sales & Marketing"]}
        />

        <SidebarItem
          icon={<Utensils size={20} />}
          title="Restaurant"
          path="/admin/restaurant"
          isActive={pathname.startsWith("/admin/restaurant")}
          hasSubmenu={true}
          submenuItems={[
            { title: "Menu Items", path: "/admin/restaurant" },
            { title: "Add Menu Item", path: "/admin/restaurant/add-item" },
            { title: "Categories", path: "/admin/restaurant/categories" },
            { title: "Orders", path: "/admin/restaurant/orders" },
            { title: "Tables", path: "/admin/restaurant/tables" },
            { title: "Reports", path: "/admin/restaurant/reports" },
          ]}
          requiredDepartments={["Management", "Food & Beverage"]}
        />

        <SidebarItem
          icon={<Award size={20} />}
          title="Loyalty Program"
          path="/admin/loyalty"
          isActive={pathname.startsWith("/admin/loyalty")}
          requiredAccessLevels={["Full Access", "Administrative"]}
          requiredDepartments={["Management", "Sales & Marketing"]}
        />

        <SidebarItem
          icon={<CalendarIcon size={20} />}
          title="Meeting Hall"
          path="/admin/meeting-hall"
          isActive={pathname.startsWith("/admin/meeting-hall")}
          requiredAccessLevels={["Full Access", "Administrative", "Standard"]}
          requiredDepartments={["Management", "Front Office", "Sales & Marketing"]}
        />

        <SidebarItem
          icon={<CalendarIcon size={20} />}
          title="Availability"
          path="/admin/availability"
          isActive={pathname.startsWith("/admin/availability")}
          requiredAccessLevels={["Full Access", "Administrative", "Standard"]}
          requiredDepartments={["Management", "Front Office", "Spa & Wellness", "Sales & Marketing"]}
        />

        <SidebarItem
          icon={<Tag size={20} />}
          title="Promo Codes"
          path="/admin/promo-codes"
          isActive={pathname.startsWith("/admin/promo-codes")}
          requiredAccessLevels={["Full Access", "Administrative"]}
          requiredDepartments={["Management", "Sales & Marketing", "Finance"]}
        />

        <SidebarItem
          icon={<DollarSign size={20} />}
          title="Tax Settings"
          path="/admin/tax-settings"
          isActive={pathname.startsWith("/admin/tax-settings")}
          requiredAccessLevels={["Full Access", "Administrative"]}
          requiredDepartments={["Management", "Finance"]}
        />

        <SidebarItem
          icon={<Undo2 size={20} />}
          title="Refunds"
          path="/admin/refunds"
          isActive={pathname.startsWith("/admin/refunds")}
          requiredAccessLevels={["Full Access", "Administrative"]}
          requiredDepartments={["Management", "Finance"]}
        />

        <SidebarItem
          icon={<BarChart size={20} />}
          title="Reports"
          path="/admin/reports"
          isActive={pathname.startsWith("/admin/reports")}
        // All staff can access reports now, but they will only see their department-specific reports
        />

        <SidebarItem
          icon={<Users size={20} />}
          title="Staff Management"
          path="/admin/staff"
          isActive={pathname.startsWith("/admin/staff")}
          hasSubmenu={true}
          submenuItems={[
            { title: "Staff Management", path: "/admin/staff" },
            { title: "Add Department", path: "/admin/staff/add-department" },
            { title: "Add Role", path: "/admin/staff/add-role" },
            { title: "Add Access Level", path: "/admin/staff/add-access-level" },
          ]}
          requiredAccessLevels={["Full Access", "Administrative"]}
          requiredDepartments={["Management", "Human Resources"]}
        />

        <SidebarItem
          icon={<Users size={20} />}
          title="User Management"
          path="/admin/users"
          isActive={pathname.startsWith("/admin/users")}
          requiredAccessLevels={["Full Access", "Administrative"]}
        />

        <SidebarItem
          icon={<FileEdit size={20} />}
          title="Content Management"
          path="/admin/content"
          isActive={pathname.startsWith("/admin/content")}
          requiredAccessLevels={["Full Access", "Administrative"]}
        />

        <SidebarItem
          icon={<Settings size={20} />}
          title="Settings"
          path="/admin/settings"
          isActive={pathname.startsWith("/admin/settings")}
          requiredAccessLevels={["Full Access"]}
        />

        <div className="mt-8 border-t border-gray-200 pt-4">
          <button onClick={handleLogout} className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-lg">
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;

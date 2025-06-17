
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bed, Heart, Ticket, Utensils, Award, Home, Smartphone, Globe } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BottomNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [viewMode, setViewMode] = useState<"website" | "mobile">("website");

  // Website navigation items (no loyalty or restaurant ordering)
  const websiteNavItems = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    { icon: <Bed size={20} />, label: "Rooms", path: "/rooms" },
    { icon: <Heart size={20} />, label: "Spa", path: "/spa" },
    { icon: <Ticket size={20} />, label: "Events", path: "/events" },
  ];

  // Mobile app navigation items (includes everything)
  const mobileNavItems = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    { icon: <Bed size={20} />, label: "Rooms", path: "/rooms" },
    { icon: <Heart size={20} />, label: "Spa", path: "/spa" },
    { icon: <Ticket size={20} />, label: "Events", path: "/events" },
    { icon: <Utensils size={20} />, label: "Dining", path: "/restaurant" },
    { icon: <Award size={20} />, label: "Rewards", path: "/loyalty" },
  ];

  const navItems = viewMode === "website" ? websiteNavItems : mobileNavItems;

  return (
    <div className="bg-white shadow-lg border-t border-gray-200">
      <div className="px-2 pt-2">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "website" | "mobile")}>
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="website" className="flex items-center gap-1">
              <Globe size={16} />
              <span>Website</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-1">
              <Smartphone size={16} />
              <span>Mobile App</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = 
            (item.path === "/" && pathname === "/") || 
            (item.path !== "/" && pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 ${
                isActive
                  ? "text-hotel-primary font-medium"
                  : "text-gray-500"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

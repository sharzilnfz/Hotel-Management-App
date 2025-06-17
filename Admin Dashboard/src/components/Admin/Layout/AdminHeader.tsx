import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useSearch } from "@/contexts/SearchContext";

interface UserData {
  name: string;
  email: string;
  role: string;
  department: string;
  accessLevel: string;
}

const AdminHeader = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery, setSearchTarget } = useSearch();

  useEffect(() => {
    const userDataString = localStorage.getItem("currentUser");
    if (userDataString) {
      setUserData(JSON.parse(userDataString));
    }
  }, []);

  useEffect(() => {
    // Set the search target based on the current route
    if (location.pathname.includes('/admin/rooms')) {
      setSearchTarget('rooms');
    } else {
      setSearchTarget('');
    }
  }, [location.pathname, setSearchTarget]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  return (
    <header className="bg-white shadow-sm z-10 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">Parkside Plaza Hotel</h1>
          <span className="bg-hotel-primary text-white px-2 py-0.5 rounded text-xs">Admin</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-hotel-primary focus:border-transparent w-64"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
              >
                ×
              </button>
            )}
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium">{userData?.name || "Loading..."}</p>
                <p className="text-xs text-gray-500">{userData?.role} - {userData?.department}</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <LogOut size={18} className="mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
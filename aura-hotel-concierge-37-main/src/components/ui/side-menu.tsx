
import React from "react";
import { Link } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Home, 
  Calendar,
  User, 
  Settings, 
  LogOut, 
  CreditCard,
  Globe,
  Moon,
  HelpCircle,
  X 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SideMenuProps {
  trigger: React.ReactNode;
}

export function SideMenu({ trigger }: SideMenuProps) {
  const { user, isAuthenticated, logout, toggleLanguage } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[400px]">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-playfair font-semibold text-hotel-burgundy">Menu</h2>
            <SheetClose className="p-2 rounded-full hover:bg-gray-100">
              <X size={20} className="text-gray-600" />
            </SheetClose>
          </div>

          {isAuthenticated && user && (
            <div className="mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-hotel-burgundy text-white flex items-center justify-center text-xl font-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <SheetClose asChild>
              <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
                <Home size={20} />
                <span>Home</span>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link to="/bookings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
                <Calendar size={20} />
                <span>My Bookings</span>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link to="/loyalty" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
                <CreditCard size={20} />
                <span>Loyalty Program</span>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
                <Settings size={20} />
                <span>Settings</span>
              </Link>
            </SheetClose>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 space-y-1">
            <button 
              onClick={toggleLanguage}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800"
            >
              <Globe size={20} />
              <span>Change Language</span>
              <span className="ml-auto text-sm bg-gray-100 px-2 py-1 rounded">
                {user?.language === "en" ? "EN" : "AR"}
              </span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
              <Moon size={20} />
              <span>Dark Mode</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-800">
              <HelpCircle size={20} />
              <span>Help & Support</span>
            </button>
          </div>

          {isAuthenticated ? (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <SheetClose asChild>
                <Link
                  to="/auth/login"
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-hotel-burgundy/10 text-hotel-burgundy font-medium"
                >
                  <User size={20} />
                  <span>Sign In</span>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

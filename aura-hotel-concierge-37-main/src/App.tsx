
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
import Home from "./pages/Home";
import Onboarding from "./pages/auth/Onboarding";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoomsList from "./pages/rooms/RoomsList";
import RoomDetail from "./pages/rooms/RoomDetail";
import SpaServices from "./pages/spa/SpaServices";
import BookingsList from "./pages/bookings/BookingsList";
import LoyaltyProgram from "./pages/loyalty/LoyaltyProgram";
import RestaurantPage from "./pages/restaurant/RestaurantPage";
import NotFound from "./pages/NotFound";
import EditProfile from "./pages/profile/EditProfile";
import ProfilePage from "./pages/profile/ProfilePage";
import EventsPage from "./pages/events/EventsPage";
import SettingsPage from "./pages/settings/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/onboarding" element={<Onboarding />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/rooms" element={<RoomsList />} />
              <Route path="/rooms/:roomId" element={<RoomDetail />} />
              <Route path="/spa" element={<SpaServices />} />
              <Route path="/restaurant" element={<RestaurantPage />} />
              <Route path="/bookings" element={<BookingsList />} />
              <Route path="/loyalty" element={<LoyaltyProgram />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

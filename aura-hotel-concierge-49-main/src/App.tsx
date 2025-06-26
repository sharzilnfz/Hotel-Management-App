import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Onboarding from './pages/auth/Onboarding';
import Register from './pages/auth/Register';
import BookingsList from './pages/bookings/BookingsList';
import EventsPage from './pages/events/EventsPage';
import LoyaltyProgram from './pages/loyalty/LoyaltyProgram';
import PaymentPage from './pages/payment/PaymentPage';
import EditProfile from './pages/profile/EditProfile';
import ProfilePage from './pages/profile/ProfilePage';
import RestaurantPage from './pages/restaurant/RestaurantPage';
import MultiBooking from './pages/rooms/MultiBooking';
import RoomDetail from './pages/rooms/RoomDetail';
import RoomsList from './pages/rooms/RoomsList';
import SettingsPage from './pages/settings/SettingsPage';
import SpaServices from './pages/spa/SpaServices';
import MeetingHall from './pages/venues/MeetingHall';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <BookingProvider>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/onboarding" element={<Onboarding />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/rooms" element={<RoomsList />} />
                  <Route path="/rooms/:roomId" element={<RoomDetail />} />
                  <Route
                    path="/rooms/multi-booking"
                    element={<MultiBooking />}
                  />
                  <Route path="/spa" element={<SpaServices />} />
                  <Route path="/restaurant" element={<RestaurantPage />} />
                  <Route path="/bookings" element={<BookingsList />} />
                  <Route path="/loyalty" element={<LoyaltyProgram />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/meeting-hall" element={<MeetingHall />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </div>
            </BookingProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

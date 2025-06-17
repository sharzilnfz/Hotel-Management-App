import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SearchProvider } from "@/contexts/SearchContext";
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import RoomsManagementPage from "./pages/Admin/Rooms/RoomsManagementPage";
import AddRoomPage from "./pages/Admin/Rooms/AddRoomPage";
import RoomBookingsPage from "./pages/Admin/Rooms/RoomBookingsPage";
import RoomsReportsPage from "./pages/Admin/Rooms/RoomsReportsPage";
import StaffManagementPage from "./pages/Admin/Staff/StaffManagementPage";
import AddStaffMemberPage from "./pages/Admin/Staff/AddStaffMemberPage";
import AddDepartmentPage from "./pages/Admin/Staff/AddDepartmentPage";
import AddRolePage from "./pages/Admin/Staff/AddRolePage";
import AddAccessLevelPage from "./pages/Admin/Staff/AddAccessLevelPage";
import AddSpecialistPage from "./pages/Admin/Spa/AddSpecialistPage";
import LoyaltyManagementPage from "./pages/Admin/Loyalty/LoyaltyManagementPage";
import PromoCodePage from "./pages/Admin/PromoCode/PromoCodePage";
import RefundsPage from "./pages/Admin/Refunds/RefundsPage";
import ReportsPage from "./pages/Admin/Reports/ReportsPage";
import MeetingHallPage from "./pages/Admin/MeetingHall/MeetingHallPage";
import SettingsPage from "./pages/Admin/Settings/SettingsPage";
import UsersManagementPage from "./pages/Admin/Users/UsersManagementPage";
import ContentManagementPage from "./pages/Admin/ContentManagement/ContentManagementPage";
import AvailabilityManagementPage from "./pages/Admin/Availability/AvailabilityManagementPage";
import SpaManagementPage from "./pages/Admin/Spa/SpaManagementPage";
import SpaBookingsPage from "./pages/Admin/Spa/SpaBookingsPage";
import SpaReportsPage from "./pages/Admin/Spa/SpaReportsPage";
import SpaCategoriesPage from "./pages/Admin/Spa/SpaCategoriesPage";
import AddServicePage from "./pages/Admin/Spa/AddServicePage";
import RestaurantManagementPage from "./pages/Admin/Restaurant/RestaurantManagementPage";
import AddMenuItemPage from "./pages/Admin/Restaurant/AddMenuItemPage";
import MenuCategoriesPage from "./pages/Admin/Restaurant/MenuCategoriesPage";
import RestaurantOrdersPage from "./pages/Admin/Restaurant/RestaurantOrdersPage";
import RestaurantTablesPage from "./pages/Admin/Restaurant/RestaurantTablesPage";
import RestaurantReportsPage from "./pages/Admin/Restaurant/RestaurantReportsPage";
import EventsManagementPage from "./pages/Admin/Events/EventsManagementPage";
import AddEventPage from "./pages/Admin/Events/AddEventPage";
// import EditEventPage from "./pages/Admin/Events/EditEventPage";
import EventsReportsPage from "./pages/Admin/Events/EventsReportsPage";
import EventsScannerPage from "./pages/Admin/Events/EventsScannerPage";
import EventsBookingsPage from "./pages/Admin/Events/EventsBookingsPage";
import TaxSettingsPage from "./pages/Admin/Tax/TaxSettingsPage";
import SpaPage from "./pages/SpaPage";
import EventsPage from "./pages/EventsPage";
import RoomsPage from "./pages/RoomsPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import DownloadAppPage from "./pages/DownloadAppPage";
import NotFound from "./pages/NotFound";
import HousekeepingPage from "./pages/Admin/Housekeeping/HousekeepingPage";
import TaskManagementPage from "./pages/Admin/Housekeeping/TaskManagementPage";
import { default as HousekeepingStaffPage } from "./pages/Admin/Housekeeping/StaffManagementPage";
import HousekeepingSuppliesPage from "./pages/Admin/Housekeeping/SuppliesPage";
import HousekeepingSchedulePage from "./pages/Admin/Housekeeping/SchedulePage";
import HousekeepingReportsPage from "./pages/Admin/Housekeeping/ReportsPage";
import EditRoomPage from "./pages/Admin/Rooms/EditRoomPage";
import EditServicePage from "./pages/Admin/Spa/EditServicePage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SearchProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Navigate to="/admin-login" replace />} />

              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="rooms" element={<RoomsManagementPage />} />
                <Route path="rooms/add" element={<AddRoomPage />} />
                <Route path="rooms/edit/:id" element={<EditRoomPage />} />
                <Route path="rooms/bookings" element={<RoomBookingsPage />} />
                <Route path="rooms/reports" element={<RoomsReportsPage />} />

                <Route path="housekeeping" element={<HousekeepingPage />} />
                <Route path="housekeeping/tasks" element={<TaskManagementPage />} />
                <Route path="housekeeping/staff" element={<HousekeepingStaffPage />} />
                <Route path="housekeeping/supplies" element={<HousekeepingSuppliesPage />} />
                <Route path="housekeeping/schedule" element={<HousekeepingSchedulePage />} />
                <Route path="housekeeping/reports" element={<HousekeepingReportsPage />} />

                <Route path="spa" element={<SpaManagementPage />} />
                <Route path="spa/add-specialist" element={<AddSpecialistPage />} />
                <Route path="spa/add-service" element={<AddServicePage />} />
                <Route path="spa/edit-service/:id" element={<EditServicePage />} />
                <Route path="spa/bookings" element={<SpaBookingsPage />} />
                <Route path="spa/categories" element={<SpaCategoriesPage />} />
                <Route path="spa/reports" element={<SpaReportsPage />} />
                <Route path="staff" element={<StaffManagementPage />} />
                <Route path="staff/add" element={<AddStaffMemberPage />} />
                <Route path="staff/add-department" element={<AddDepartmentPage />} />
                <Route path="staff/add-role" element={<AddRolePage />} />
                <Route path="staff/add-access-level" element={<AddAccessLevelPage />} />
                <Route path="events" element={<EventsManagementPage />} />
                <Route path="events/add" element={<AddEventPage />} />
                {/* <Route path="events/edit/:id" element={<EditEventPage />} /> */}
                <Route path="events/reports" element={<EventsReportsPage />} />
                <Route path="events/scanner" element={<EventsScannerPage />} />
                <Route path="events/bookings" element={<EventsBookingsPage />} />
                <Route path="restaurant" element={<RestaurantManagementPage />} />
                <Route path="restaurant/add-item" element={<AddMenuItemPage />} />
                <Route path="restaurant/categories" element={<MenuCategoriesPage />} />
                <Route path="restaurant/orders" element={<RestaurantOrdersPage />} />
                <Route path="restaurant/tables" element={<RestaurantTablesPage />} />
                <Route path="restaurant/reports" element={<RestaurantReportsPage />} />
                <Route path="loyalty" element={<LoyaltyManagementPage />} />
                <Route path="meeting-hall" element={<MeetingHallPage />} />
                <Route path="availability" element={<AvailabilityManagementPage />} />
                <Route path="availability/meeting-hall" element={<Navigate to="/admin/meeting-hall" replace />} />
                <Route path="promo-codes" element={<PromoCodePage />} />
                <Route path="refunds" element={<RefundsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="tax-settings" element={<TaxSettingsPage />} />
                <Route path="users" element={<UsersManagementPage />} />
                <Route path="content" element={<ContentManagementPage />} />
              </Route>

              <Route path="/spa" element={<SpaPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/download-app" element={<DownloadAppPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </SearchProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

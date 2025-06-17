import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomStatusDashboard from "@/components/Admin/Housekeeping/RoomStatusDashboard";
import StaffManagement from "@/components/Admin/Housekeeping/StaffManagement";
import TaskManagement from "@/components/Admin/Housekeeping/TaskManagement";
import SuppliesManagement from "@/components/Admin/Housekeeping/SuppliesManagement";
import ScheduleManagement from "@/components/Admin/Housekeeping/ScheduleManagement";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const HousekeepingPage = () => {
  const [activeTab, setActiveTab] = useState("room-status");

  return (
    <AuthGuard requiredDepartments={["Management", "Housekeeping"]}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Housekeeping Management</h1>
        </div>

        <Tabs defaultValue="room-status" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="room-status">Room Status</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="supplies">Supplies</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="room-status">
            <RoomStatusDashboard />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagement />
          </TabsContent>

          <TabsContent value="staff">
            <StaffManagement />
          </TabsContent>

          <TabsContent value="supplies">
            <SuppliesManagement />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleManagement />
          </TabsContent>

          <TabsContent value="reports">
            <div className="text-center py-8">
              <p className="text-gray-500">Reports content will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
};

export default HousekeepingPage;

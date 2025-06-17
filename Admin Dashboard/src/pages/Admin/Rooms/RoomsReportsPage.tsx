
import RoomsReportsContent from "@/components/Admin/Rooms/RoomsReportsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const RoomsReportsPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Front Office", "Housekeeping"]}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Room Analytics & Reports</h1>
        <RoomsReportsContent />
      </div>
    </AuthGuard>
  );
};

export default RoomsReportsPage;

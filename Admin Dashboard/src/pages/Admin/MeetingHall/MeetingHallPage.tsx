
import MeetingHallContent from "@/components/Admin/MeetingHall/MeetingHallContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const MeetingHallPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Front Office", "Sales & Marketing"]}>
      <div className="container mx-auto">
        <MeetingHallContent />
      </div>
    </AuthGuard>
  );
};

export default MeetingHallPage;

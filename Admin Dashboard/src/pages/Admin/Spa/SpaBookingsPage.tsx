
import SpaBookingsContent from "@/components/Admin/Spa/SpaBookingsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const SpaBookingsPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Spa & Wellness"]}>
      <div className="container mx-auto">
        <SpaBookingsContent />
      </div>
    </AuthGuard>
  );
};

export default SpaBookingsPage;


import RefundsContent from "@/components/Admin/Refunds/RefundsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const RefundsPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Finance"]} requiredRoles={["Administrator"]}>
      <div className="container mx-auto">
        <RefundsContent />
      </div>
    </AuthGuard>
  );
};

export default RefundsPage;

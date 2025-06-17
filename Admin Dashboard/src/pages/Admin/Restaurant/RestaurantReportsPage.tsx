
import RestaurantReportsContent from "@/components/Admin/Restaurant/RestaurantReportsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const RestaurantReportsPage = () => {
  return (
    <AuthGuard>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Restaurant Analytics & Reports</h1>
        <RestaurantReportsContent />
      </div>
    </AuthGuard>
  );
};

export default RestaurantReportsPage;

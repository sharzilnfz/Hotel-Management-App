
import MenuCategories from "@/components/Restaurant/MenuCategories";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RestaurantPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Hotel Restaurant</h1>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Mobile App Feature</AlertTitle>
        <AlertDescription>
          Restaurant ordering is only available in the mobile app version, not on the website.
        </AlertDescription>
      </Alert>
      
      <MenuCategories />
    </div>
  );
};

export default RestaurantPage;

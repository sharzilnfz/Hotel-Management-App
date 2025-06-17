
import LoyaltyManagementContent from "@/components/Admin/Loyalty/LoyaltyManagementContent";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const LoyaltyManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Sales & Marketing"]}>
      <div className="container mx-auto">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mobile App Feature</AlertTitle>
          <AlertDescription>
            Loyalty program features are only available in the mobile app version, not on the website.
          </AlertDescription>
        </Alert>
        <LoyaltyManagementContent />
      </div>
    </AuthGuard>
  );
};

export default LoyaltyManagementPage;

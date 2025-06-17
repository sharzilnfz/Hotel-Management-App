
import PromoCodeContent from "@/components/Admin/PromoCode/PromoCodeContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const PromoCodePage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Sales & Marketing"]}>
      <div className="container mx-auto">
        <PromoCodeContent />
      </div>
    </AuthGuard>
  );
};

export default PromoCodePage;


import React from 'react';
import SpaReportsContent from "@/components/Admin/Spa/SpaReportsContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const SpaReportsPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Spa & Wellness"]}>
      <div className="container mx-auto">
        <SpaReportsContent />
      </div>
    </AuthGuard>
  );
};

export default SpaReportsPage;

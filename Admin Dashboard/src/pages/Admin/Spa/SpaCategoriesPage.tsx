
import React from 'react';
import SpaCategoriesContent from "@/components/Admin/Spa/SpaCategoriesContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const SpaCategoriesPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Spa & Wellness"]}>
      <div className="container mx-auto">
        <SpaCategoriesContent />
      </div>
    </AuthGuard>
  );
};

export default SpaCategoriesPage;

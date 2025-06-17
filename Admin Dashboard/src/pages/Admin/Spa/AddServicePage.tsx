
import React from 'react';
import AddSpaServiceForm from "@/components/Admin/Spa/AddSpaServiceForm";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const AddServicePage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Spa & Wellness"]}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
        <AddSpaServiceForm />
      </div>
    </AuthGuard>
  );
};

export default AddServicePage;

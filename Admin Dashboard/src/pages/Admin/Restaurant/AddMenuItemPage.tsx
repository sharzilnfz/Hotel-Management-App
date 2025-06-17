
import React from 'react';
import AddMenuItemForm from '@/components/Admin/Restaurant/AddMenuItemForm';
import AuthGuard from '@/components/Admin/Auth/AuthGuard';

const AddMenuItemPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Food & Beverage"]}>
      <div className="container mx-auto py-6">
        <AddMenuItemForm />
      </div>
    </AuthGuard>
  );
};

export default AddMenuItemPage;

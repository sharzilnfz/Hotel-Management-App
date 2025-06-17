
import React from 'react';
import RestaurantManagementContent from '@/components/Admin/Restaurant/RestaurantManagementContent';
import AuthGuard from '@/components/Admin/Auth/AuthGuard';

const RestaurantManagementPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Food & Beverage"]}>
      <div className="container mx-auto">
        <RestaurantManagementContent />
      </div>
    </AuthGuard>
  );
};

export default RestaurantManagementPage;

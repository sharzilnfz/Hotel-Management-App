
import React from 'react';
import RestaurantOrdersContent from '@/components/Admin/Restaurant/RestaurantOrdersContent';
import AuthGuard from '@/components/Admin/Auth/AuthGuard';

const RestaurantOrdersPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Food & Beverage"]}>
      <div className="container mx-auto">
        <RestaurantOrdersContent />
      </div>
    </AuthGuard>
  );
};

export default RestaurantOrdersPage;


import React from 'react';
import RestaurantTablesContent from '@/components/Admin/Restaurant/RestaurantTablesContent';
import AuthGuard from '@/components/Admin/Auth/AuthGuard';

const RestaurantTablesPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Food & Beverage"]}>
      <div className="container mx-auto">
        <RestaurantTablesContent />
      </div>
    </AuthGuard>
  );
};

export default RestaurantTablesPage;

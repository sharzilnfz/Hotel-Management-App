
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Plus, Trash2 } from 'lucide-react';

export const PaymentMethods = () => {
  const [savedMethods, setSavedMethods] = useState([
    { id: 1, type: 'visa', last4: '4242', expiryDate: '12/24' },
  ]);

  const handleDelete = (id: number) => {
    setSavedMethods(methods => methods.filter(method => method.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Saved Payment Methods</h3>
        <Button variant="outline" size="sm">
          <Plus size={16} className="mr-2" />
          Add New
        </Button>
      </div>

      <div className="space-y-3">
        {savedMethods.map(method => (
          <Card key={method.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-hotel-burgundy" />
                <div>
                  <p className="font-medium">•••• {method.last4}</p>
                  <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDelete(method.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Add New Payment Method</h4>
        <div className="grid gap-3">
          <Button variant="outline" className="justify-start">
            <CreditCard className="mr-2 h-4 w-4" /> Add Credit/Debit Card
          </Button>
          <Button variant="outline" className="justify-start">
            <CreditCard className="mr-2 h-4 w-4" /> Connect PayPal
          </Button>
        </div>
      </div>
    </div>
  );
};

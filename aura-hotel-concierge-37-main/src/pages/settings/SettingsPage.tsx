
import React from 'react';
import { MobileLayout } from "@/components/ui/mobile-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethods } from './components/PaymentMethods';
import { MoreOptions } from './components/MoreOptions';

const SettingsPage = () => {
  return (
    <MobileLayout title="Preferences" showBackButton>
      <div className="p-6">
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="w-full mb-6 bg-gradient-to-r from-hotel-pearl to-hotel-cream border-2 border-hotel-beige/30 rounded-2xl p-1 shadow-elegant">
            <TabsTrigger 
              value="payments" 
              className="flex-1 rounded-xl font-montserrat font-medium border-2 border-hotel-beige/50 bg-white/80 text-hotel-charcoal hover:bg-hotel-cream/50 data-[state=active]:bg-hotel-burgundy-dark data-[state=active]:text-hotel-sand-dark data-[state=active]:border-hotel-burgundy-dark transition-all duration-300"
            >
              Payment Methods
            </TabsTrigger>
            <TabsTrigger 
              value="more" 
              className="flex-1 rounded-xl font-montserrat font-medium border-2 border-hotel-beige/50 bg-white/80 text-hotel-charcoal hover:bg-hotel-cream/50 data-[state=active]:bg-hotel-burgundy-dark data-[state=active]:text-hotel-sand-dark data-[state=active]:border-hotel-burgundy-dark transition-all duration-300"
            >
              More Options
            </TabsTrigger>
          </TabsList>
          <TabsContent value="payments">
            <PaymentMethods />
          </TabsContent>
          <TabsContent value="more">
            <MoreOptions />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;

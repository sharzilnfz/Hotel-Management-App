
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Globe, DollarSign, MessageSquare } from 'lucide-react';

export const MoreOptions = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-500">Get notified about your bookings</p>
            </div>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">WhatsApp Updates</p>
              <p className="text-sm text-gray-500">Receive booking confirmations</p>
            </div>
          </div>
          <Switch />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Language</p>
              <p className="text-sm text-gray-500">Choose your preferred language</p>
            </div>
          </div>
          <Select defaultValue="en">
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Currency</p>
              <p className="text-sm text-gray-500">Set your preferred currency</p>
            </div>
          </div>
          <Select defaultValue="usd">
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Smartphone, Globe, Gift, UtensilsCrossed, Package } from "lucide-react";

const PlatformVisibilitySettings = () => {
  const { toast } = useToast();
  
  const [visibilitySettings, setVisibilitySettings] = useState({
    // Loyalty Program
    loyaltyProgramWeb: true,
    loyaltyProgramApp: true,
    
    // Restaurant Features
    restaurantFeaturesWeb: true,
    restaurantFeaturesApp: true,
    
    // Event Add-ons
    eventAddonsWeb: true,
    eventAddonsApp: true
  });
  
  const handleToggleChange = (setting: string) => {
    setVisibilitySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleSaveChanges = () => {
    // In a real application, you would save these settings to your backend
    toast({
      title: "Settings Saved",
      description: "Platform visibility settings have been updated successfully."
    });
  };
  
  const getFeatureStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 border-green-300">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500">
        Inactive
      </Badge>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Platform Visibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-gray-500 mb-4">
          Control which features are active or inactive on the website and mobile app.
        </div>
        
        {/* Loyalty Program */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Gift className="h-5 w-5 mr-2 text-purple-500" />
            <h3 className="text-lg font-medium">Loyalty Program</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <Label htmlFor="loyaltyProgramWeb" className="font-medium">Website</Label>
                  <p className="text-sm text-gray-500">Control loyalty program visibility on website</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getFeatureStatusBadge(visibilitySettings.loyaltyProgramWeb)}
                <Switch
                  id="loyaltyProgramWeb"
                  checked={visibilitySettings.loyaltyProgramWeb}
                  onCheckedChange={() => handleToggleChange("loyaltyProgramWeb")}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <Label htmlFor="loyaltyProgramApp" className="font-medium">Mobile App</Label>
                  <p className="text-sm text-gray-500">Control loyalty program visibility on mobile app</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getFeatureStatusBadge(visibilitySettings.loyaltyProgramApp)}
                <Switch
                  id="loyaltyProgramApp"
                  checked={visibilitySettings.loyaltyProgramApp}
                  onCheckedChange={() => handleToggleChange("loyaltyProgramApp")}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Restaurant Features */}
        <div className="space-y-4">
          <div className="flex items-center">
            <UtensilsCrossed className="h-5 w-5 mr-2 text-amber-500" />
            <h3 className="text-lg font-medium">Restaurant Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <Label htmlFor="restaurantFeaturesWeb" className="font-medium">Website</Label>
                  <p className="text-sm text-gray-500">Control restaurant features on website</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getFeatureStatusBadge(visibilitySettings.restaurantFeaturesWeb)}
                <Switch
                  id="restaurantFeaturesWeb"
                  checked={visibilitySettings.restaurantFeaturesWeb}
                  onCheckedChange={() => handleToggleChange("restaurantFeaturesWeb")}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <Label htmlFor="restaurantFeaturesApp" className="font-medium">Mobile App</Label>
                  <p className="text-sm text-gray-500">Control restaurant features on mobile app</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getFeatureStatusBadge(visibilitySettings.restaurantFeaturesApp)}
                <Switch
                  id="restaurantFeaturesApp"
                  checked={visibilitySettings.restaurantFeaturesApp}
                  onCheckedChange={() => handleToggleChange("restaurantFeaturesApp")}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Event Add-ons */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-indigo-500" />
            <h3 className="text-lg font-medium">Event Add-ons</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <Label htmlFor="eventAddonsWeb" className="font-medium">Website</Label>
                  <p className="text-sm text-gray-500">Control event add-ons visibility on website</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getFeatureStatusBadge(visibilitySettings.eventAddonsWeb)}
                <Switch
                  id="eventAddonsWeb"
                  checked={visibilitySettings.eventAddonsWeb}
                  onCheckedChange={() => handleToggleChange("eventAddonsWeb")}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <Label htmlFor="eventAddonsApp" className="font-medium">Mobile App</Label>
                  <p className="text-sm text-gray-500">Control event add-ons visibility on mobile app</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getFeatureStatusBadge(visibilitySettings.eventAddonsApp)}
                <Switch
                  id="eventAddonsApp"
                  checked={visibilitySettings.eventAddonsApp}
                  onCheckedChange={() => handleToggleChange("eventAddonsApp")}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformVisibilitySettings;

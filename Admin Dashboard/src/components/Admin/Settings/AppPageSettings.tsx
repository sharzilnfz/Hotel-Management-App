
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Smartphone, Upload } from "lucide-react";

const AppPageSettings = () => {
  const { toast } = useToast();
  const [appSettings, setAppSettings] = useState({
    appDescription: "Download our Parkside Plaza Hotel app for a seamless booking experience. Manage your reservations, access exclusive deals, and enjoy a personalized stay with features designed to enhance your hotel experience.",
    footerText: "Download the app now and manage your bookings anytime, anywhere.",
    iosAppUrl: "https://apps.apple.com/us/app/parkside-plaza-hotel/id123456789",
    androidAppUrl: "https://play.google.com/store/apps/details?id=com.parksideplaza.hotel",
    iosIconPath: "/images/ios-download.png",
    androidIconPath: "/images/android-download.png"
  });

  const [previewImages, setPreviewImages] = useState({
    ios: null,
    android: null
  });

  const handleAppSettingChange = (e) => {
    const { name, value } = e.target;
    setAppSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconUpload = (platform, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create URL for preview
    const previewUrl = URL.createObjectURL(file);
    setPreviewImages((prev) => ({
      ...prev,
      [platform]: previewUrl
    }));

    // In a real application, you would upload the file to a server here
    // For this demo, we'll just update the state with a fake path
    const pathKey = platform === "ios" ? "iosIconPath" : "androidIconPath";
    
    // Simulate processing delay
    setTimeout(() => {
      toast({
        title: "Icon Uploaded",
        description: `The ${platform === "ios" ? "iOS" : "Android"} app icon has been uploaded successfully.`
      });

      setAppSettings((prev) => ({
        ...prev,
        [pathKey]: `/images/${platform}-download-${Date.now()}.png`
      }));
    }, 1000);
  };

  const handleSaveSettings = () => {
    // In a real application, you would save the settings to a database here
    toast({
      title: "Settings Saved",
      description: "Your app page settings have been saved successfully."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>App Page Content</CardTitle>
          <CardDescription>
            Manage the content for the "Download Our App" page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="appDescription">App Description</Label>
            <Textarea
              id="appDescription"
              name="appDescription"
              rows={5}
              value={appSettings.appDescription}
              onChange={handleAppSettingChange}
              placeholder="Describe the benefits and features of your app"
            />
            <p className="text-sm text-gray-500">
              This text will appear at the top of the Download App page
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footerText">Footer Text / Call to Action</Label>
            <Textarea
              id="footerText"
              name="footerText"
              rows={3}
              value={appSettings.footerText}
              onChange={handleAppSettingChange}
              placeholder="Add a compelling call to action for users to download your app"
            />
            <p className="text-sm text-gray-500">
              This text will appear at the bottom of the Download App page
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Download Links</CardTitle>
          <CardDescription>
            Configure the app store links for iOS and Android
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="ios" className="w-full">
            <TabsList>
              <TabsTrigger value="ios" className="flex items-center">
                <Apple className="h-4 w-4 mr-2" />
                iOS App
              </TabsTrigger>
              <TabsTrigger value="android" className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                Android App
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ios" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="iosAppUrl">App Store URL</Label>
                <Input
                  id="iosAppUrl"
                  name="iosAppUrl"
                  value={appSettings.iosAppUrl}
                  onChange={handleAppSettingChange}
                  placeholder="https://apps.apple.com/us/app/your-app-id"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="iosIcon">App Store Icon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    {previewImages.ios ? (
                      <img 
                        src={previewImages.ios} 
                        alt="iOS App Icon Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Apple size={32} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="relative" onClick={() => document.getElementById('iosIconInput').click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Icon
                      <input
                        id="iosIconInput"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleIconUpload("ios", e)}
                      />
                    </Button>
                    <p className="text-xs text-gray-500">
                      Recommended: 160x160px PNG or SVG
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="android" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="androidAppUrl">Google Play URL</Label>
                <Input
                  id="androidAppUrl"
                  name="androidAppUrl"
                  value={appSettings.androidAppUrl}
                  onChange={handleAppSettingChange}
                  placeholder="https://play.google.com/store/apps/details?id=your.app.package"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="androidIcon">Google Play Icon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    {previewImages.android ? (
                      <img 
                        src={previewImages.android} 
                        alt="Android App Icon Preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Smartphone size={32} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="relative" onClick={() => document.getElementById('androidIconInput').click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Icon
                      <input
                        id="androidIconInput"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleIconUpload("android", e)}
                      />
                    </Button>
                    <p className="text-xs text-gray-500">
                      Recommended: 160x160px PNG or SVG
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how the download section will appear on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Download Our App</h3>
              <p className="text-gray-600">{appSettings.appDescription}</p>
              
              <div className="flex flex-wrap justify-center gap-6 my-8">
                <div className="text-center">
                  <div className="h-16 w-48 bg-black rounded-lg flex items-center justify-center text-white hover:bg-gray-800 cursor-pointer">
                    <Apple className="h-7 w-7 mr-2" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-lg font-semibold">App Store</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="h-16 w-48 bg-black rounded-lg flex items-center justify-center text-white hover:bg-gray-800 cursor-pointer">
                    <Smartphone className="h-7 w-7 mr-2" />
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-lg font-semibold">Google Play</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 font-medium">{appSettings.footerText}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>
    </div>
  );
};

export default AppPageSettings;

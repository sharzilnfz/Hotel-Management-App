
import { Button } from "@/components/ui/button";
import { Apple, Smartphone } from "lucide-react";

const DownloadAppPage = () => {
  // In a real app, these would be loaded from an API or context
  const appSettings = {
    appDescription: "Download our Parkside Plaza Hotel app for a seamless booking experience. Manage your reservations, access exclusive deals, and enjoy a personalized stay with features designed to enhance your hotel experience.",
    footerText: "Download the app now and manage your bookings anytime, anywhere.",
    iosAppUrl: "https://apps.apple.com/us/app/parkside-plaza-hotel/id123456789",
    androidAppUrl: "https://play.google.com/store/apps/details?id=com.parksideplaza.hotel"
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Download Our Mobile App
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {appSettings.appDescription}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-12">
          <a 
            href={appSettings.iosAppUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <div className="h-16 w-48 bg-black rounded-lg flex items-center justify-center text-white">
              <Apple className="h-8 w-8 mr-2" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </div>
          </a>
          
          <a 
            href={appSettings.androidAppUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <div className="h-16 w-48 bg-black rounded-lg flex items-center justify-center text-white">
              <Smartphone className="h-8 w-8 mr-2" />
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </div>
          </a>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 mt-1">✓</div>
                  <span>Easy booking and reservation management</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 mt-1">✓</div>
                  <span>Exclusive in-app offers and discounts</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 mt-1">✓</div>
                  <span>Digital room key and contactless check-in</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 mt-1">✓</div>
                  <span>Real-time service requests and support</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 mt-1">✓</div>
                  <span>Loyalty program tracking and rewards</span>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/3 flex justify-center">
              <div className="w-48 h-96 bg-gray-200 rounded-3xl shadow-lg overflow-hidden">
                {/* App screenshot would go here */}
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-center">App Screenshot</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center my-12">
          <p className="text-xl text-gray-700 font-medium mb-8">{appSettings.footerText}</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <a 
              href={appSettings.iosAppUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <div className="h-16 w-48 bg-black rounded-lg flex items-center justify-center text-white">
                <Apple className="h-8 w-8 mr-2" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </div>
            </a>
            
            <a 
              href={appSettings.androidAppUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <div className="h-16 w-48 bg-black rounded-lg flex items-center justify-center text-white">
                <Smartphone className="h-8 w-8 mr-2" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppPage;

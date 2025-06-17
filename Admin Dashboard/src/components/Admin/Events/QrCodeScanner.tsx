
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Html5Qrcode } from "html5-qrcode";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  success: boolean;
  eventId?: string;
  eventTitle?: string;
  bookingId?: string;
  customerName?: string;
  timestamp: Date;
  message: string;
}

const QrCodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (scanner) {
        scanner.stop().catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, [scanner]);

  const startScanner = async () => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    setScanner(html5QrCode);
    setScanning(true);

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      setScanning(false);
      uiToast({
        title: "Error",
        description: "Could not start the QR scanner. Please ensure camera permissions are granted.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = async () => {
    if (scanner) {
      try {
        await scanner.stop();
        setScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const markBookingAsAttended = (bookingId: string, customerName: string, eventTitle: string) => {
    // In a real app, this would be an API call to update the booking status
    // For now, we'll just show a success message
    toast.success(`${customerName} has been marked as attended for ${eventTitle}`);
    
    // This is a mock function - in a real app, this would make an API call to your backend
    return Promise.resolve(true);
  };

  const onScanSuccess = (decodedText: string) => {
    console.log(`QR Code scanned: ${decodedText}`);
    
    // Temporarily stop scanning to prevent multiple scans of the same code
    scanner?.pause();
    
    // Process the QR code data
    let result: ScanResult = {
      success: false,
      timestamp: new Date(),
      message: "Invalid QR code format"
    };
    
    // Check if this is a hotel event QR code 
    // Expected format: HOTEL_EVENT:eventId:bookingId:customerName:eventTitle
    if (decodedText.startsWith("HOTEL_EVENT:")) {
      const parts = decodedText.split(":");
      if (parts.length >= 5) {
        const eventId = parts[1];
        const bookingId = parts[2];
        const customerName = parts[3];
        const eventTitle = parts.slice(4).join(":");
        
        // Mark the booking as attended
        markBookingAsAttended(bookingId, customerName, eventTitle)
          .then(() => {
            // Update scan results with success
            result = {
              success: true,
              eventId,
              eventTitle,
              bookingId,
              customerName,
              timestamp: new Date(),
              message: `${customerName} has been checked in for: ${eventTitle}`
            };
            
            // Add to results
            setScanResults(prev => [result, ...prev]);
            
            // Show toast with result
            uiToast({
              title: "Check-in Successful",
              description: result.message,
              variant: "default",
            });
          })
          .catch(error => {
            // Handle error
            console.error("Error marking booking as attended:", error);
            result = {
              success: false,
              eventId,
              eventTitle,
              bookingId,
              customerName,
              timestamp: new Date(),
              message: "Failed to mark as attended: " + (error.message || "Unknown error")
            };
            
            // Add to results
            setScanResults(prev => [result, ...prev]);
            
            // Show toast with result
            uiToast({
              title: "Check-in Failed",
              description: result.message,
              variant: "destructive",
            });
          });
      } else {
        // Invalid format
        setScanResults(prev => [result, ...prev]);
        uiToast({
          title: "Invalid QR Code",
          description: result.message,
          variant: "destructive",
        });
      }
    } else {
      // Not a hotel event QR code
      setScanResults(prev => [result, ...prev]);
      uiToast({
        title: "Invalid QR Code",
        description: result.message,
        variant: "destructive",
      });
    }
    
    // Resume scanning after a brief pause
    setTimeout(() => {
      scanner?.resume();
    }, 2000);
  };

  const onScanFailure = (error: string) => {
    // This is called frequently when no QR is detected, so we don't need to handle each failure
    console.debug(`QR scan error: ${error}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="qr-reader" style={{ width: "100%" }} />
            <div className="flex justify-center mt-4">
              {!scanning ? (
                <Button onClick={startScanner}>Start Scanner</Button>
              ) : (
                <Button variant="destructive" onClick={stopScanner}>Stop Scanner</Button>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              {scanning
                ? "Point the camera at a valid event QR code"
                : "Click 'Start Scanner' to begin scanning event QR codes"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {scanResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No scans yet. Scan a QR code to see results here.
                </div>
              ) : (
                scanResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md flex items-start gap-3 ${
                      result.success
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        result.success ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {result.success ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          result.success ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {result.success ? "Success" : "Failed"}
                      </p>
                      <p className="text-sm">
                        {result.message}
                      </p>
                      {result.customerName && (
                        <p className="text-xs text-gray-700 mt-1">
                          Customer: {result.customerName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {result.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QrCodeScanner;

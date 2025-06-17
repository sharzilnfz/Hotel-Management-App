
import QrCodeScanner from "@/components/Admin/Events/QrCodeScanner";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const EventsScannerPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Events"]}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Event Check-in Scanner</h1>
        <p className="mb-6 text-gray-600">
          Scan attendee QR codes to check them in for events. Each successful scan will be recorded.
        </p>
        <QrCodeScanner />
      </div>
    </AuthGuard>
  );
};

export default EventsScannerPage;

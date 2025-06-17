
import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-hotel-light">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default AppLayout;

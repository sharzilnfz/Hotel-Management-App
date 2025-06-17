import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Clock, User, Utensils, Search, Bell, Star, Award, Flower2, LayoutGrid } from "lucide-react";
import { SideMenu } from "@/components/ui/side-menu";

interface MobileLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  showLogo?: boolean;
  showBottomNav?: boolean;
  hideHeader?: boolean;
}
export function MobileLayout({
  children,
  showBackButton = false,
  title,
  showLogo = true,
  showBottomNav = true,
  hideHeader = false
}: MobileLayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const navItems = [{
    path: "/",
    label: "Home",
    icon: <Home size={20} strokeWidth={2.5} />
  }, {
    path: "/rooms",
    label: "Rooms",
    icon: <Star size={20} strokeWidth={2.5} />
  }, {
    path: "/restaurant",
    label: "Dining",
    icon: <Utensils size={20} strokeWidth={2.5} />
  }, {
    path: "/spa",
    label: "Spa",
    icon: <Flower2 size={20} strokeWidth={2.5} />
  }, {
    path: "/events",
    label: "Events",
    icon: <Calendar size={20} strokeWidth={2.5} />
  }];

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };
  return <div className="flex flex-col min-h-screen bg-gradient-to-br from-hotel-light via-hotel-pearl to-hotel-cream">
      {!hideHeader && <header className="sticky top-0 z-50 relative">
          {/* Classic Luxury Background */}
          <div className="bg-white/95 backdrop-blur-xl border-b border-hotel-beige/30 shadow-lg relative">
            {/* Subtle luxury accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-hotel-gold/30 via-hotel-gold to-hotel-gold/30"></div>
            
            {/* Content */}
            <div className="relative px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {showBackButton && <motion.button onClick={() => window.history.back()} className="w-10 h-10 flex items-center justify-center text-hotel-charcoal bg-hotel-pearl/80 hover:bg-hotel-beige/80 rounded-xl border border-hotel-beige/50 transition-all duration-200 shadow-sm" whileTap={{
                scale: 0.95
              }} whileHover={{
                scale: 1.02
              }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.button>}
                  {showLogo && <div className="flex items-center gap-3">
                      <img alt="Parkside Plaza Hotel" src="/lovable-uploads/e00f85de-b767-4bf4-bc3a-9ba4cf0e2a9d.png" className="h-14 w-auto object-contain" />
                    </div>}
                  {title && <h1 className="text-xl font-playfair font-bold text-hotel-burgundy tracking-tight">
                      {title}
                    </h1>}
                </div>
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="w-10 h-10 flex items-center justify-center text-hotel-charcoal bg-hotel-pearl/80 hover:bg-hotel-beige/80 rounded-xl border border-hotel-beige/50 transition-all duration-200 shadow-sm">
                    <User size={16} strokeWidth={2} />
                  </Link>
                  <SideMenu trigger={<button className="w-10 h-10 flex items-center justify-center text-hotel-charcoal bg-hotel-pearl/80 hover:bg-hotel-beige/80 rounded-xl border border-hotel-beige/50 transition-all duration-200 shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>} />
                </div>
              </div>
            </div>
            
            {/* Bottom subtle shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-hotel-beige/10 to-transparent"></div>
          </div>
        </header>}

      <main className="flex-1 overflow-auto pb-28">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial="initial" animate="animate" exit="exit" variants={pageVariants} className="min-h-[calc(100vh-180px)]">
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {showBottomNav && <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 border-t-2 border-hotel-beige/20 shadow-luxury backdrop-blur-xl py-3 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center px-2">
              {navItems.map(item => {
            const active = isActive(item.path);
            return <Link key={item.path} to={item.path} className="relative flex flex-col items-center py-2 px-3 min-w-[60px]">
                    <motion.div className={`flex flex-col items-center justify-center rounded-2xl p-3 transition-all duration-300 ${active ? "bg-luxury-gradient text-white shadow-luxury" : "text-hotel-charcoal/70 hover:text-hotel-burgundy"}`} initial={false} animate={active ? {
                scale: 1.1,
                y: -2
              } : {
                scale: 1,
                y: 0
              }} whileHover={{
                scale: active ? 1.1 : 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                      <div className="mb-1">
                        {item.icon}
                      </div>
                      <span className={`text-xs font-medium font-montserrat ${active ? "text-hotel-gold" : "text-current"}`}>
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>;
          })}
            </div>
          </div>
        </nav>}
    </div>;
}

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  path: string;
}
interface ServiceMenuProps {
  items: MenuItem[];
}
export function ServiceMenu({
  items
}: ServiceMenuProps) {
  return <div className="grid gap-5">
      {items.map((item, index) => <Link to={item.path} key={item.id} className="block">
          <motion.div initial={{
        opacity: 0,
        y: 15
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1,
        duration: 0.4
      }} className="group flex items-center gap-5 hotel-card p-6 border-2 border-hotel-beige/30 hover:border-hotel-gold/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-luxury">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-hotel-burgundy to-hotel-burgundy-light flex items-center justify-center text-white shrink-0 shadow-elegant group-hover:shadow-luxury transition-all duration-300 group-hover:scale-110 bg-gray-800">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-playfair font-bold text-hotel-burgundy mb-1 group-hover:text-hotel-burgundy-dark transition-colors text-lg">
                {item.title}
              </h3>
              <p className="text-hotel-charcoal/70 font-montserrat leading-relaxed text-xs">
                {item.description}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-hotel-gold-light to-hotel-gold text-hotel-burgundy group-hover:shadow-gold transition-all duration-300 group-hover:scale-110">
              <ChevronRight size={18} strokeWidth={2.5} />
            </div>
          </motion.div>
        </Link>)}
    </div>;
}
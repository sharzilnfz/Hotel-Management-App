import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
export function SpaPageHeader() {
  return <div className="mb-8">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-hotel-burgundy/10 rounded-full">
            <Sparkles className="w-8 h-8 text-hotel-burgundy" />
          </div>
        </div>
        <h1 className="font-playfair font-bold text-hotel-burgundy mb-2 text-xl">
          Luxury Spa Services
        </h1>
        <p className="text-hotel-charcoal/70 text-xs text-center">
          Rejuvenate your body and soul with our premium spa treatments
        </p>
      </motion.div>
    </div>;
}
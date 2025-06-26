import React from "react";
import { motion } from "framer-motion";
import { ServiceCard } from "@/components/spa/ServiceCard";
interface SpaServiceSelectorProps {
  services: any[];
  onServiceSelect: (service: any) => void;
}
export function SpaServiceSelector({
  services,
  onServiceSelect
}: SpaServiceSelectorProps) {
  return <div className="space-y-4">
      <h2 className="font-semibold mb-4 text-center text-hotel-sand text-[hotel-sand-dark]">
        Choose Your Service
      </h2>
      {services.map((service, index) => <motion.div key={service.id} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: index * 0.1
    }}>
          <ServiceCard {...service} onSelect={() => onServiceSelect(service)} />
        </motion.div>)}
    </div>;
}
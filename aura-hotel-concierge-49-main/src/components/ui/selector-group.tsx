import React from "react";
import { Card } from "@/components/ui/card";
interface SelectorOption {
  id: string;
  label: string;
  sublabel?: string;
  price?: number;
}
interface SelectorGroupProps {
  title: string;
  icon: React.ReactNode;
  options: SelectorOption[];
  selectedId?: string;
  onSelect: (option: SelectorOption) => void;
  columns?: number;
}
export function SelectorGroup({
  title,
  icon,
  options,
  selectedId,
  onSelect,
  columns = 3
}: SelectorGroupProps) {
  const gridClass = columns === 1 ? "grid grid-cols-1 gap-3" : `grid grid-cols-${columns} gap-3`;
  return <div className="space-y-4">
      <h4 className="text-sm font-medium flex items-center font-montserrat text-hotel-sand mx-[4px]">
        {icon} {title}
      </h4>
      <div className={gridClass}>
        {options.map(option => <button key={option.id} onClick={() => onSelect(option)} className={`group relative p-4 rounded-2xl text-center transition-all duration-300 border-2 ${selectedId === option.id ? "bg-luxury-gradient text-white border-hotel-gold shadow-luxury transform scale-105" : "bg-hotel-pearl hover:bg-hotel-cream border-hotel-beige hover:border-hotel-gold hover:shadow-gold hover:transform hover:scale-102"} ${columns === 1 ? "text-left flex items-center" : ""}`}>
            {columns === 1 ? <>
                <div className="w-10 h-10 bg-hotel-burgundy/10 rounded-full flex items-center justify-center mr-3 relative z-10">
                  <div className={`w-4 h-4 rounded-full ${selectedId === option.id ? "bg-hotel-gold" : "bg-hotel-burgundy"}`} />
                </div>
                <div className="relative z-10">
                  <div className="font-medium font-montserrat text-hotel-charcoal bg-[hotel-sand-dark] bg-transparent px-0 py-0 my-0">
                    {option.label}
                  </div>
                  {option.sublabel && <div className={`text-xs mt-1 font-medium ${selectedId === option.id ? "text-hotel-gold" : "text-hotel-burgundy"}`}>
                      {option.sublabel}
                    </div>}
                </div>
              </> : <div className="relative z-10">
                <div className="font-semibold font-montserrat text-sm">
                  {option.label}
                </div>
                {option.sublabel && <div className={`text-xs mt-1 font-medium ${selectedId === option.id ? "text-hotel-gold" : "text-hotel-burgundy"}`}>
                    {option.sublabel}
                  </div>}
                {option.price && <div className={`text-xs mt-1 font-medium ${selectedId === option.id ? "text-hotel-gold" : "text-hotel-burgundy"}`}>
                    ${option.price}
                  </div>}
              </div>}
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
          </button>)}
      </div>
    </div>;
}
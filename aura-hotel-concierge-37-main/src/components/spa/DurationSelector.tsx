
import React from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Duration {
  minutes: number;
  price: number;
}

interface DurationSelectorProps {
  durations: Duration[];
  selectedDuration?: Duration;
  onSelect: (duration: Duration) => void;
}

export function DurationSelector({ durations, selectedDuration, onSelect }: DurationSelectorProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-hotel-charcoal flex items-center font-montserrat">
        <Clock size={18} className="mr-2 text-hotel-gold" /> Choose Duration
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {durations.map((duration) => (
          <button
            key={duration.minutes}
            onClick={() => onSelect(duration)}
            className={`group relative p-4 rounded-2xl text-center transition-all duration-300 border-2 ${
              selectedDuration?.minutes === duration.minutes
                ? "bg-luxury-gradient text-white border-hotel-gold shadow-luxury transform scale-105"
                : "bg-hotel-pearl hover:bg-hotel-cream border-hotel-beige hover:border-hotel-gold hover:shadow-gold hover:transform hover:scale-102"
            }`}
          >
            <div className="relative z-10">
              <div className="font-semibold font-montserrat text-sm">
                {duration.minutes} min
              </div>
              <div className={`text-xs mt-1 font-medium ${
                selectedDuration?.minutes === duration.minutes
                  ? "text-hotel-gold"
                  : "text-hotel-burgundy"
              }`}>
                ${duration.price}
              </div>
            </div>
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

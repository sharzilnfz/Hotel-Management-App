
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  durations: string;
  fromPrice: number;
  onSelect?: () => void;
}

export function ServiceCard({ title, description, durations, fromPrice, onSelect }: ServiceCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden border-2 border-hotel-beige/30 hover:border-hotel-gold/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-luxury">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-playfair text-xl font-bold text-hotel-burgundy group-hover:text-hotel-burgundy-dark transition-colors">
            {title}
          </h3>
          <div className="text-right">
            <div className="text-sm font-montserrat font-medium text-hotel-charcoal/70 mb-1">From</div>
            <div className="text-2xl font-bold text-hotel-burgundy">${fromPrice}</div>
          </div>
        </div>
        
        <p className="text-hotel-charcoal/70 font-montserrat text-sm leading-relaxed mb-4">
          {description}
        </p>
        
        <div className="flex items-center text-hotel-charcoal/60 font-montserrat text-sm">
          <Clock size={16} className="mr-2 text-hotel-gold" />
          <span>{durations}</span>
        </div>
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
      </CardContent>
    </Card>
  );
}

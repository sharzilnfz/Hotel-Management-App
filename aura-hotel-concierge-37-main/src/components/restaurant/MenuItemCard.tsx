
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function MenuItemCard({ 
  name, 
  description, 
  price, 
  image, 
  quantity = 0, 
  onAdd, 
  onRemove 
}: MenuItemCardProps) {
  return (
    <Card className="group overflow-hidden border-2 border-hotel-beige/30 hover:border-hotel-gold/50 transition-all duration-300 hover:shadow-luxury">
      <div className="flex h-32">
        <div className="w-1/3 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-playfair font-bold text-hotel-burgundy text-lg mb-2 group-hover:text-hotel-burgundy-dark transition-colors">
              {name}
            </h4>
            <p className="text-xs text-hotel-charcoal/70 font-montserrat leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-xl font-bold text-hotel-burgundy font-montserrat">
              ${price}
            </div>
            <div className="flex items-center gap-3">
              {quantity > 0 ? (
                <>
                  <button 
                    onClick={onRemove}
                    className="w-8 h-8 rounded-full bg-hotel-beige hover:bg-hotel-sand flex items-center justify-center transition-colors duration-200"
                  >
                    <Minus size={14} className="text-hotel-burgundy" />
                  </button>
                  <span className="w-6 text-center font-semibold text-hotel-burgundy font-montserrat">
                    {quantity}
                  </span>
                  <button 
                    onClick={onAdd}
                    className="w-8 h-8 rounded-full bg-luxury-gradient text-white flex items-center justify-center shadow-elegant hover:shadow-luxury transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus size={14} />
                  </button>
                </>
              ) : (
                <Button 
                  onClick={onAdd}
                  size="sm"
                  className="bg-luxury-gradient hover:bg-luxury-gradient/90 text-white rounded-full px-4 py-2 text-xs font-semibold shadow-elegant hover:shadow-luxury transition-all duration-200 transform hover:scale-105"
                >
                  <Plus size={12} className="mr-1" /> Add
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>
    </Card>
  );
}

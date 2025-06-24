import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
export interface ExtraItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  maxQuantity?: number;
}
interface ExtrasSelectorProps {
  title: string;
  items: ExtraItem[];
  selectedExtras: {
    id: string;
    quantity: number;
  }[];
  onExtrasChange: (extras: {
    id: string;
    quantity: number;
  }[]) => void;
  className?: string;
}
export function ExtrasSelector({
  title,
  items,
  selectedExtras,
  onExtrasChange,
  className = ""
}: ExtrasSelectorProps) {
  const handleToggleExtra = (extraId: string) => {
    const existing = selectedExtras.find(e => e.id === extraId);
    if (existing) {
      // Remove the extra
      onExtrasChange(selectedExtras.filter(e => e.id !== extraId));
    } else {
      // Add the extra with quantity 1
      onExtrasChange([...selectedExtras, {
        id: extraId,
        quantity: 1
      }]);
    }
  };
  const handleQuantityChange = (extraId: string, change: number) => {
    const updatedExtras = selectedExtras.map(extra => {
      if (extra.id === extraId) {
        const newQuantity = Math.max(1, extra.quantity + change);
        const item = items.find(i => i.id === extraId);
        const maxQuantity = item?.maxQuantity || 10;
        return {
          ...extra,
          quantity: Math.min(newQuantity, maxQuantity)
        };
      }
      return extra;
    });
    onExtrasChange(updatedExtras);
  };
  const isSelected = (extraId: string) => {
    return selectedExtras.some(e => e.id === extraId);
  };
  const getQuantity = (extraId: string) => {
    return selectedExtras.find(e => e.id === extraId)?.quantity || 1;
  };
  if (items.length === 0) return null;
  return <Card className={className}>
      <CardHeader>
        <CardTitle className="text-hotel-burgundy text-base mx-[12px]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(item => <div key={item.id} className="p-3 border border-hotel-beige/40 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3 flex-1">
                <Checkbox id={item.id} checked={isSelected(item.id)} onCheckedChange={() => handleToggleExtra(item.id)} className="mt-0.5" />
                <div className="flex-1">
                  <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                    {item.name}
                  </label>
                  {item.description && <p className="text-xs text-hotel-charcoal/70 mt-1">{item.description}</p>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ${item.price}
                </Badge>
                {item.category && <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>}
              </div>
              
              {isSelected(item.id) && <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleQuantityChange(item.id, -1)} className="h-7 w-7 p-0">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-6 text-center">
                    {getQuantity(item.id)}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => handleQuantityChange(item.id, 1)} className="h-7 w-7 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>}
            </div>
          </div>)}
      </CardContent>
    </Card>;
}
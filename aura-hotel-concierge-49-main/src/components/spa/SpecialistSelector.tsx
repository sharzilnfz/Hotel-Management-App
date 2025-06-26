
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Specialist {
  name: string;
  photo: string;
}

interface SpecialistSelectorProps {
  specialists: Specialist[];
  selectedSpecialist: string;
  onSpecialistSelect: (specialist: string) => void;
}

export function SpecialistSelector({
  specialists,
  selectedSpecialist,
  onSpecialistSelect
}: SpecialistSelectorProps) {
  return (
    <div className="space-y-3">
      {specialists.map((specialist) => (
        <button
          key={specialist.name}
          onClick={() => onSpecialistSelect(specialist.name)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
            selectedSpecialist === specialist.name
              ? "bg-hotel-burgundy text-white border-hotel-burgundy"
              : "bg-white text-hotel-charcoal border-hotel-beige hover:border-hotel-burgundy"
          }`}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={specialist.photo} alt={specialist.name} />
            <AvatarFallback className="bg-hotel-burgundy text-white">
              {specialist.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="font-medium">{specialist.name}</div>
            <div className={`text-sm ${
              selectedSpecialist === specialist.name ? 'text-white/80' : 'text-hotel-charcoal/60'
            }`}>
              Certified Therapist
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

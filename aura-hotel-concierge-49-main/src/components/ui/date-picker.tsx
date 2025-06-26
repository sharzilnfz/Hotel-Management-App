import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  fromDate?: Date;
}
export function DatePicker({
  date,
  setDate,
  label = "Select date",
  placeholder = "Pick a date",
  className,
  fromDate
}: DatePickerProps) {
  return <div className={className}>
      {label && <label className="block text-sm font-semibold mb-3 text-hotel-sand text-hotel-sand-dark tracking-wide mx-[12px]">
          {label}
        </label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className={cn("w-full h-14 justify-start text-left font-montserrat bg-gradient-to-br from-hotel-pearl to-hotel-cream border-2 border-hotel-beige/50 hover:bg-gradient-to-br hover:from-hotel-cream hover:to-hotel-pearl hover:border-hotel-gold/70 focus:border-hotel-gold rounded-2xl shadow-elegant hover:shadow-luxury transition-all duration-300", !date && "text-hotel-charcoal/50")}>
            <CalendarIcon className="mr-3 h-5 w-5 text-hotel-burgundy" strokeWidth={2} />
            {date ? <span className="font-medium text-hotel-charcoal">
                {format(date, "PPP")}
              </span> : <span className="font-medium">{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto bg-white border-2 border-hotel-beige/30 shadow-luxury rounded-2xl">
          <Calendar mode="single" selected={date} onSelect={setDate} disabled={date => fromDate ? date < fromDate : false} initialFocus className="p-4 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>;
}
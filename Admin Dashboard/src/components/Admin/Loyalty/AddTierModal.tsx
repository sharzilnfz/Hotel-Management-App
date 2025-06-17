import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Omit } from "@/types/utils";
import { LoyaltyTier } from "@/services/loyaltyService";

interface AddTierModalProps {
  onAddTier: (tier: Omit<LoyaltyTier, '_id'>) => void;
}

const AddTierModal = ({ onAddTier }: AddTierModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [pointsRequired, setPointsRequired] = useState("");
  const [benefits, setBenefits] = useState("");
  const [color, setColor] = useState("#6d4c41"); // Default bronze color
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name || !pointsRequired) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const benefitsList = benefits
      .split("\n")
      .filter(benefit => benefit.trim() !== "");

    // Store hex color directly in database instead of converting to Tailwind class
    onAddTier({
      name,
      pointsRequired: parseInt(pointsRequired),
      benefits: benefitsList,
      color: color, // Store the actual hex color
    });

    // Reset form and close modal
    setName("");
    setPointsRequired("");
    setBenefits("");
    setColor("#6d4c41");
    setOpen(false);

    toast({
      title: "Success",
      description: `${name} tier has been added successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Tier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Loyalty Tier</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tierName" className="text-right">
              Tier Name
            </Label>
            <Input
              id="tierName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Diamond"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pointsRequired" className="text-right">
              Points Required
            </Label>
            <Input
              id="pointsRequired"
              type="number"
              value={pointsRequired}
              onChange={(e) => setPointsRequired(e.target.value)}
              className="col-span-3"
              placeholder="e.g. 15000"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tierColor" className="text-right">
              Tier Color
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="tierColor"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <span className="text-sm text-gray-500">{color}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="benefits" className="text-right pt-2">
              Benefits
            </Label>
            <Textarea
              id="benefits"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              className="col-span-3"
              placeholder="Add each benefit on a new line&#10;e.g. 25% discount on dining&#10;Airport transfer&#10;Suite upgrade"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Tier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTierModal;

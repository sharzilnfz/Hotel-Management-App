import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoyaltyTier } from "@/services/loyaltyService";

interface EditTierModalProps {
  tier: LoyaltyTier;
  onUpdateTier: (updatedTier: Partial<LoyaltyTier>) => void;
}

const EditTierModal = ({ tier, onUpdateTier }: EditTierModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [pointsRequired, setPointsRequired] = useState("");
  const [benefits, setBenefits] = useState("");
  const [color, setColor] = useState("#6d4c41");
  const { toast } = useToast();

  useEffect(() => {
    if (tier) {
      setName(tier.name);
      setPointsRequired(tier.pointsRequired.toString());
      setBenefits(tier.benefits.join("\n"));
      // If color is already hex, use it directly
      setColor(tier.color.startsWith('#') ? tier.color : '#6d4c41');
    }
  }, [tier]);

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

    onUpdateTier({
      name,
      pointsRequired: parseInt(pointsRequired),
      benefits: benefitsList,
      color: color, // Store the actual hex color
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Loyalty Tier</DialogTitle>
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
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Tier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTierModal;

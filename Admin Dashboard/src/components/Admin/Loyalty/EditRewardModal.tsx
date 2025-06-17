import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoyaltyReward } from "@/services/loyaltyService";

interface EditRewardModalProps {
  reward: LoyaltyReward;
  onUpdateReward: (updatedReward: Partial<LoyaltyReward>) => void;
}

const EditRewardModal = ({ reward, onUpdateReward }: EditRewardModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [pointsCost, setPointsCost] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const { toast } = useToast();

  const categories = ["Dining", "Room", "Wellness", "Transportation", "Experience", "Other"];

  useEffect(() => {
    if (reward) {
      setName(reward.name);
      setPointsCost(reward.pointsCost.toString());
      setDescription(reward.description);
      setCategory(reward.category);
      setStatus(reward.status);
    }
  }, [reward]);

  const handleSubmit = () => {
    if (!name || !pointsCost || !description || !category) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    onUpdateReward({
      name,
      pointsCost: parseInt(pointsCost),
      description,
      category,
      status,
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
          <DialogTitle>Edit Reward</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rewardName" className="text-right">
              Reward Name
            </Label>
            <Input
              id="rewardName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pointsCost" className="text-right">
              Points Cost
            </Label>
            <Input
              id="pointsCost"
              type="number"
              value={pointsCost}
              onChange={(e) => setPointsCost(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select 
              value={status} 
              onValueChange={setStatus}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Reward</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRewardModal;

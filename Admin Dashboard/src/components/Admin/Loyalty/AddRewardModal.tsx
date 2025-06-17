import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Omit } from "@/types/utils";
import { LoyaltyReward } from "@/services/loyaltyService";

interface AddRewardModalProps {
  onAddReward: (reward: Omit<LoyaltyReward, '_id'>) => void;
}

const AddRewardModal = ({ onAddReward }: AddRewardModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [pointsCost, setPointsCost] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dining");
  const [status, setStatus] = useState("Active");
  const { toast } = useToast();

  const categories = ["Dining", "Room", "Wellness", "Transportation", "Experience", "Other"];

  const handleSubmit = () => {
    if (!name || !pointsCost || !description || !category) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    onAddReward({
      name,
      pointsCost: parseInt(pointsCost),
      description,
      category,
      status,
    });

    // Reset form and close modal
    setName("");
    setPointsCost("");
    setDescription("");
    setCategory("Dining");
    setStatus("Active");
    setOpen(false);

    toast({
      title: "Success",
      description: `${name} reward has been added successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Reward
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Reward</DialogTitle>
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
              placeholder="e.g. Free Breakfast"
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
              placeholder="e.g. 500"
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
              placeholder="Describe the reward..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Reward</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRewardModal;

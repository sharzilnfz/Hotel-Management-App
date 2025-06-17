
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const MenuItem = ({
  id,
  name,
  description,
  price,
  imageUrl
}: MenuItemProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [orderType, setOrderType] = useState("room-service");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { toast } = useToast();

  const handleAddToCart = () => {
    // In a real app, this would add the item to the user's cart
    toast({
      title: "Added to Order",
      description: `${quantity} ${name}(s) have been added to your order.`,
    });
    setShowOrderOptions(false);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col sm:flex-row">
      <div
        className="h-32 sm:h-auto sm:w-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <div className="text-lg font-semibold text-hotel-primary">${price}</div>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <Button 
          onClick={() => setShowOrderOptions(!showOrderOptions)}
          className="w-full sm:w-auto bg-hotel-primary hover:bg-opacity-90 text-white"
        >
          {showOrderOptions ? "Hide Options" : "Order Now"}
        </Button>
        
        {showOrderOptions && (
          <div className="mt-4 border-t border-gray-200 pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Order Type</label>
              <RadioGroup value={orderType} onValueChange={setOrderType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="room-service" id="room-service" />
                  <Label htmlFor="room-service">Room Service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="restaurant" id="restaurant" />
                  <Label htmlFor="restaurant">Dine In</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="takeaway" id="takeaway" />
                  <Label htmlFor="takeaway">Takeaway</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="mx-4 text-lg font-medium w-6 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Special Instructions (Optional)</label>
              <Textarea
                placeholder="Any allergies or special requests?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between font-semibold">
                <span>Total price:</span>
                <span>${(price * quantity).toFixed(2)}</span>
              </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              className="w-full bg-hotel-primary hover:bg-opacity-90"
            >
              Add to Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItem;

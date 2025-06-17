import React, { useState } from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { useBooking, MenuItem } from "@/contexts/BookingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookingConfirmation } from "@/components/ui/booking-confirmation";
import { toast } from "sonner";
import { Utensils, CreditCard, Wallet, Plus, Minus, Home, Truck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

type PaymentMethod = "card" | "cash";
type OrderType = "dine-in" | "room-service" | "delivery";
type OrderItem = { menuItemId: string; quantity: number; };

interface OrderDetails {
  table?: string;
  roomNumber?: string;
  address?: string;
  additionalComments?: string;
}

const RestaurantPage = () => {
  const { menuItems, bookRestaurant } = useBooking();
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [additionalComments, setAdditionalComments] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);

  const tables = Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Table ${i + 1}`,
    capacity: i < 10 ? 4 : 6
  }));

  const addToOrder = (menuItemId: string) => {
    const existingItemIndex = selectedItems.findIndex(item => item.menuItemId === menuItemId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { menuItemId, quantity: 1 }]);
    }
  };

  const removeFromOrder = (menuItemId: string) => {
    const existingItemIndex = selectedItems.findIndex(item => item.menuItemId === menuItemId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      if (updatedItems[existingItemIndex].quantity > 1) {
        updatedItems[existingItemIndex].quantity -= 1;
      } else {
        updatedItems.splice(existingItemIndex, 1);
      }
      setSelectedItems(updatedItems);
    }
  };

  const getOrderTotal = () => {
    return selectedItems.reduce((total, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  };

  const validateOrder = () => {
    if (orderType === "dine-in" && !selectedTable) {
      toast.error("Please select a table");
      return false;
    }

    if (orderType === "room-service" && !roomNumber) {
      toast.error("Please enter your room number");
      return false;
    }

    if (orderType === "delivery" && !deliveryAddress) {
      toast.error("Please enter delivery address");
      return false;
    }

    if (selectedItems.length === 0) {
      toast.error("Please add items to your order");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateOrder()) return;

    try {
      const orderDetails: any = {
        items: selectedItems,
        additionalComments,
      };

      if (orderType === "dine-in") {
        orderDetails.roomNumber = selectedTable; // Using roomNumber field to store table number
      } else if (orderType === "room-service") {
        orderDetails.roomNumber = roomNumber;
      } else if (orderType === "delivery") {
        orderDetails.address = deliveryAddress;
      }

      const booking = bookRestaurant(orderType, orderDetails);
      
      setConfirmation({
        confirmationCode: booking.confirmationCode,
        type: orderType,
        location: orderType === "dine-in" 
          ? `Table ${selectedTable}` 
          : orderType === "room-service"
            ? `Room ${roomNumber}`
            : deliveryAddress,
        paymentMethod,
        items: selectedItems.map(item => {
          const menuItem = menuItems.find(m => m.id === item.menuItemId);
          return {
            name: menuItem?.name,
            quantity: item.quantity,
            price: menuItem?.price
          };
        }),
        additionalComments,
        total: getOrderTotal()
      });
      
      setShowConfirmation(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    }
  };

  const resetOrder = () => {
    setOrderType("dine-in");
    setSelectedTable("");
    setRoomNumber("");
    setDeliveryAddress("");
    setSelectedItems([]);
    setPaymentMethod("card");
    setAdditionalComments("");
    setShowConfirmation(false);
    setConfirmation(null);
  };

  // Filter menu items by category
  const mainCourses = menuItems.filter(item => item.category === "mains");
  const desserts = menuItems.filter(item => item.category === "desserts");

  if (showConfirmation) {
    return (
      <MobileLayout title="Restaurant" showBackButton>
        <div className="p-4">
          <BookingConfirmation
            bookingType="restaurant"
            confirmationCode={confirmation.confirmationCode}
            title={`${orderType === "dine-in" ? "Dine-in" : orderType === "room-service" ? "Room Service" : "Delivery"} Order`}
            date={new Date().toLocaleDateString()}
            location={confirmation.location}
            details={`Payment: ${confirmation.paymentMethod === 'card' ? 'Credit Card' : 'Cash'}`}
            name="Guest" // Default name for now
            contact="N/A" // Default contact for now
            email="N/A" // Default email for now
          />
          
          <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-playfair font-medium text-hotel-burgundy mb-3">Order Details</h3>
            {confirmation.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            
            {confirmation.additionalComments && (
              <div className="mt-4 pt-2 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Additional Comments:</h4>
                <p className="text-sm text-gray-600 mt-1">{confirmation.additionalComments}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
              <div className="font-semibold">Total</div>
              <div className="font-bold text-hotel-burgundy">${confirmation.total.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={resetOrder}
              className="bg-hotel-burgundy hover:bg-hotel-burgundy/90 text-white"
            >
              Place New Order
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Restaurant" showBackButton>
      <div className="p-4 pb-32">
        {/* Order Type Selection */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-lg font-playfair font-medium text-hotel-burgundy mb-3">Order Type</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setOrderType("dine-in")}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border ${
                orderType === "dine-in" 
                  ? "bg-hotel-burgundy text-white border-hotel-burgundy" 
                  : "border-gray-200"
              }`}
            >
              <Utensils size={20} />
              <span className="text-sm">Dine-in</span>
            </button>
            <button
              onClick={() => setOrderType("room-service")}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border ${
                orderType === "room-service" 
                  ? "bg-hotel-burgundy text-white border-hotel-burgundy" 
                  : "border-gray-200"
              }`}
            >
              <Home size={20} />
              <span className="text-sm">Room Service</span>
            </button>
            <button
              onClick={() => setOrderType("delivery")}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border ${
                orderType === "delivery" 
                  ? "bg-hotel-burgundy text-white border-hotel-burgundy" 
                  : "border-gray-200"
              }`}
            >
              <Truck size={20} />
              <span className="text-sm">Delivery</span>
            </button>
          </div>
        </div>
        
        {/* Location Selection */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-lg font-playfair font-medium text-hotel-burgundy mb-3">
            {orderType === "dine-in" 
              ? "Select Table" 
              : orderType === "room-service" 
                ? "Room Number"
                : "Delivery Address"
            }
          </h3>
          
          {orderType === "dine-in" && (
            <Select 
              value={selectedTable}
              onValueChange={setSelectedTable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name} ({table.capacity} seats)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {orderType === "room-service" && (
            <Input
              type="text"
              placeholder="Enter your room number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          )}
          
          {orderType === "delivery" && (
            <div className="space-y-4">
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-gray-400" size={24} />
                <span className="ml-2 text-gray-500">Map will be implemented here</span>
              </div>
              <Input
                type="text"
                placeholder="Enter delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
          )}
        </div>
        
        {/* Menu Items */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-lg font-playfair font-medium text-hotel-burgundy mb-3">Main Courses</h3>
          <div className="grid gap-4">
            {mainCourses.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex h-24">
                  <div className="w-1/3 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-hotel-burgundy">{item.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-hotel-burgundy">${item.price}</div>
                      <div className="flex items-center gap-2">
                        {selectedItems.find(i => i.menuItemId === item.id) ? (
                          <>
                            <button 
                              onClick={() => removeFromOrder(item.id)}
                              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center">
                              {selectedItems.find(i => i.menuItemId === item.id)?.quantity || 0}
                            </span>
                            <button 
                              onClick={() => addToOrder(item.id)}
                              className="w-7 h-7 rounded-full bg-hotel-burgundy text-white flex items-center justify-center"
                            >
                              <Plus size={14} />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => addToOrder(item.id)}
                            className="px-3 py-1 rounded-full bg-hotel-burgundy text-white text-xs flex items-center gap-1"
                          >
                            <Plus size={12} /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-lg font-playfair font-medium text-hotel-burgundy mb-3">Desserts</h3>
          <div className="grid gap-4">
            {desserts.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex h-24">
                  <div className="w-1/3 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-hotel-burgundy">{item.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-hotel-burgundy">${item.price}</div>
                      <div className="flex items-center gap-2">
                        {selectedItems.find(i => i.menuItemId === item.id) ? (
                          <>
                            <button 
                              onClick={() => removeFromOrder(item.id)}
                              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center">
                              {selectedItems.find(i => i.menuItemId === item.id)?.quantity || 0}
                            </span>
                            <button 
                              onClick={() => addToOrder(item.id)}
                              className="w-7 h-7 rounded-full bg-hotel-burgundy text-white flex items-center justify-center"
                            >
                              <Plus size={14} />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => addToOrder(item.id)}
                            className="px-3 py-1 rounded-full bg-hotel-burgundy text-white text-xs flex items-center gap-1"
                          >
                            <Plus size={12} /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Comments */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-lg font-playfair font-medium text-hotel-burgundy mb-3">Additional Comments</h3>
          <Textarea
            placeholder="Any special requests or notes?"
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Payment Method and Order Summary */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-16 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Payment Method</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg border ${
                    paymentMethod === "card" 
                      ? "bg-hotel-burgundy text-white border-hotel-burgundy" 
                      : "border-gray-200"
                  }`}
                >
                  <CreditCard size={18} />
                  <span>Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg border ${
                    paymentMethod === "cash" 
                      ? "bg-hotel-burgundy text-white border-hotel-burgundy" 
                      : "border-gray-200"
                  }`}
                >
                  <Wallet size={18} />
                  <span>{orderType === "delivery" ? "Cash on Delivery" : "Cash"}</span>
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">Order Total</div>
              <div className="font-bold text-hotel-burgundy">${getOrderTotal().toFixed(2)}</div>
            </div>
            
            <Button 
              className="w-full bg-hotel-burgundy hover:bg-hotel-burgundy/90"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default RestaurantPage;

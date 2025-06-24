import React, { useState } from "react";
import { MobileLayout } from "@/components/ui/mobile-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MenuItemCard } from "@/components/restaurant/MenuItemCard";
import { ExtrasSelector } from "@/components/ui/extras-selector";
import { Utensils, MapPin, Home, Users, Star, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GuestInfoForm } from "@/components/events/GuestInfoForm";
import { useNavigate } from "react-router-dom";
type OrderType = "dine-in" | "room" | "delivery";
const RestaurantPage = () => {
  const {
    menuItems,
    getDiningExtras,
    getDiningAddons
  } = useBooking();
  const {
    user,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<{
    id: string;
    quantity: number;
  }[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{
    id: string;
    quantity: number;
  }[]>([]);
  const [additionalComment, setAdditionalComment] = useState<string>("");
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);
  const {
    toast
  } = useToast();
  const mainItems = menuItems.filter(item => item.category === "mains");
  const dessertItems = menuItems.filter(item => item.category === "desserts");
  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem => cartItem.id === item.id ? {
          ...cartItem,
          quantity: cartItem.quantity + 1
        } : cartItem);
      }
      return [...prev, {
        ...item,
        quantity: 1
      }];
    });
  };
  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1
            };
          } else {
            return null;
          }
        }
        return item;
      }).filter(item => item !== null);
    });
  };
  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== itemId));
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? {
      ...item,
      quantity
    } : item));
  };
  const getItemQuantity = (itemId: number) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };
  const calculateExtrasTotal = () => {
    const diningExtras = getDiningExtras();
    const diningAddons = getDiningAddons();
    const extrasTotal = selectedExtras.reduce((total, selected) => {
      const extra = diningExtras.find(e => e.id === selected.id);
      return total + (extra ? extra.price * selected.quantity : 0);
    }, 0);
    const addonsTotal = selectedAddons.reduce((total, selected) => {
      const addon = diningAddons.find(a => a.id === selected.id);
      return total + (addon ? addon.price * selected.quantity : 0);
    }, 0);
    return extrasTotal + addonsTotal;
  };
  const getCartTotal = () => {
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return cartTotal + calculateExtrasTotal();
  };
  const handleOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before ordering",
        variant: "destructive"
      });
      return;
    }

    // Validation based on order type
    if (orderType === "dine-in" && !tableNumber) {
      toast({
        title: "Table number required",
        description: "Please enter your table number",
        variant: "destructive"
      });
      return;
    }
    if (orderType === "room" && !roomNumber) {
      toast({
        title: "Room number required",
        description: "Please enter your room number",
        variant: "destructive"
      });
      return;
    }
    if (orderType === "delivery" && !deliveryAddress) {
      toast({
        title: "Delivery address required",
        description: "Please enter your delivery address",
        variant: "destructive"
      });
      return;
    }

    // Store booking data and show guest form
    setPendingBookingData({
      orderType,
      tableNumber,
      roomNumber,
      deliveryAddress,
      cart,
      selectedExtras,
      selectedAddons,
      additionalComment,
      totalPrice: getCartTotal()
    });
    setShowGuestForm(true);
  };
  const handleGuestInfoSubmit = (guestInfo: any) => {
    if (!pendingBookingData) return;
    let orderDetails = "";
    if (pendingBookingData.orderType === "dine-in") {
      orderDetails = `Table ${pendingBookingData.tableNumber}`;
    } else if (pendingBookingData.orderType === "room") {
      orderDetails = `Room ${pendingBookingData.roomNumber}`;
    } else {
      orderDetails = `Delivery to ${pendingBookingData.deliveryAddress}`;
    }

    // Navigate to payment page with booking data
    const bookingData = {
      bookingType: "dining",
      title: `${pendingBookingData.orderType.charAt(0).toUpperCase() + pendingBookingData.orderType.slice(1)} Order`,
      date: new Date().toLocaleDateString(),
      time: "ASAP",
      details: orderDetails,
      location: "Hotel Restaurant",
      guestInfo,
      totalPrice: pendingBookingData.totalPrice,
      selectedExtras: pendingBookingData.selectedExtras,
      selectedAddons: pendingBookingData.selectedAddons,
      diningData: {
        date: new Date(),
        time: "ASAP",
        partySize: 1,
        selectedExtras: pendingBookingData.selectedExtras,
        selectedAddons: pendingBookingData.selectedAddons,
        cart: pendingBookingData.cart,
        orderType: pendingBookingData.orderType,
        orderDetails: pendingBookingData
      }
    };
    navigate('/payment', {
      state: {
        bookingData
      }
    });

    // Reset form
    setTableNumber("");
    setRoomNumber("");
    setDeliveryAddress("");
    setCart([]);
    setSelectedExtras([]);
    setSelectedAddons([]);
    setAdditionalComment("");
    setShowGuestForm(false);
    setPendingBookingData(null);
  };
  const handleGuestFormCancel = () => {
    setShowGuestForm(false);
    setPendingBookingData(null);
  };

  // Show guest form if active
  if (showGuestForm && pendingBookingData) {
    const title = `${pendingBookingData.orderType.charAt(0).toUpperCase() + pendingBookingData.orderType.slice(1)} Order`;
    return <MobileLayout title="Guest Information" showBackButton>
        <GuestInfoForm eventTitle={title} onSubmit={handleGuestInfoSubmit} onCancel={handleGuestFormCancel} />
      </MobileLayout>;
  }
  return <MobileLayout title="Restaurant" showBackButton>
      <div className="max-w-md mx-auto p-4">
        <div className="mb-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-hotel-burgundy/10 rounded-full">
                <Utensils className="w-8 h-8 text-hotel-burgundy" />
              </div>
            </div>
            <h1 className="font-playfair font-bold text-hotel-burgundy mb-2 text-xl">
              Fine Dining Restaurant
            </h1>
            <p className="text-gray-500 text-xs text-center">
              Experience culinary excellence with our award-winning cuisine
            </p>
          </motion.div>
        </div>

        {/* Order Type Selection */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-hotel-pearl rounded-lg">
          <button onClick={() => setOrderType("dine-in")} className={`py-2 px-3 rounded-md text-sm font-medium transition-all flex flex-col items-center gap-1 ${orderType === "dine-in" ? "bg-hotel-burgundy text-white shadow-sm" : "text-hotel-charcoal hover:bg-hotel-cream"}`}>
            <Users className="w-4 h-4" />
            Dine-in
          </button>
          <button onClick={() => setOrderType("room")} className={`py-2 px-3 rounded-md text-sm font-medium transition-all flex flex-col items-center gap-1 ${orderType === "room" ? "bg-hotel-burgundy text-white shadow-sm" : "text-hotel-charcoal hover:bg-hotel-cream"}`}>
            <Home className="w-4 h-4" />
            Room
          </button>
          <button onClick={() => setOrderType("delivery")} className={`py-2 px-3 rounded-md text-sm font-medium transition-all flex flex-col items-center gap-1 ${orderType === "delivery" ? "bg-hotel-burgundy text-white shadow-sm" : "text-hotel-charcoal hover:bg-hotel-cream"}`}>
            <MapPin className="w-4 h-4" />
            Delivery
          </button>
        </div>

        {/* Order Details Based on Type */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-hotel-burgundy text-base">
              {orderType === "dine-in" && <Users className="w-5 h-5 mr-2" />}
              {orderType === "room" && <Home className="w-5 h-5 mr-2" />}
              {orderType === "delivery" && <MapPin className="w-5 h-5 mr-2" />}
              {orderType === "dine-in" && "Table Information"}
              {orderType === "room" && "Room Information"}
              {orderType === "delivery" && "Delivery Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderType === "dine-in" && <div>
                <label className="block text-sm font-medium text-hotel-sand-dark mb-2 mx-[13px] bg-transparent">
                  Table Number
                </label>
                <Input type="text" value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="Enter table number" className="w-full" />
              </div>}

            {orderType === "room" && <div>
                <label className="block text-sm font-medium text-hotel-charcoal mb-2">
                  Room Number
                </label>
                <Input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="Enter room number" className="w-full" />
              </div>}

            {orderType === "delivery" && <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-hotel-charcoal mb-2">
                    Delivery Address
                  </label>
                  <Textarea value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="Enter your delivery address" className="w-full min-h-[80px]" />
                </div>
                <div className="bg-hotel-beige/30 rounded-lg p-4 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-hotel-charcoal/60" />
                  <p className="text-sm text-hotel-charcoal/60">
                    Map location selector coming soon
                  </p>
                </div>
              </div>}
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold mb-4 text-hotel-sand text-base mx-[12px]">Main Courses</h2>
            <div className="space-y-3">
              {mainItems.map((item, index) => <motion.div key={item.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }}>
                  <MenuItemCard name={item.name} description={item.description} price={item.price} image={item.image} quantity={getItemQuantity(item.id)} onAdd={() => addToCart(item)} onRemove={() => removeFromCart(item.id)} />
                </motion.div>)}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-hotel-charcoal mb-4 mx-[12px] text-hotel-sand-dark text-base">Desserts</h2>
            <div className="space-y-3">
              {dessertItems.map((item, index) => <motion.div key={item.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: (mainItems.length + index) * 0.1
            }}>
                  <MenuItemCard name={item.name} description={item.description} price={item.price} image={item.image} quantity={getItemQuantity(item.id)} onAdd={() => addToCart(item)} onRemove={() => removeFromCart(item.id)} />
                </motion.div>)}
            </div>
          </div>

          {/* Dining Extras */}
          <ExtrasSelector title="Dining Extras" items={getDiningExtras()} selectedExtras={selectedExtras} onExtrasChange={setSelectedExtras} />

          {/* Dining Add-ons */}
          <ExtrasSelector title="Dining Add-ons" items={getDiningAddons()} selectedExtras={selectedAddons} onExtrasChange={setSelectedAddons} />

          {/* Additional Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-hotel-burgundy text-base mx-[12px] px-0 my-0 py-0 font-semibold">Additional Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={additionalComment} onChange={e => setAdditionalComment(e.target.value)} placeholder="Any special requests or dietary requirements? (Optional)" className="w-full min-h-[80px]" />
            </CardContent>
          </Card>

          {/* Cart Summary */}
          {(cart.length > 0 || calculateExtrasTotal() > 0) && <Card className="bg-hotel-burgundy/5 border-hotel-burgundy/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-hotel-charcoal mb-3">Your Order</h3>
                <div className="space-y-2 mb-4">
                  {cart.map(item => <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="text-sm">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-hotel-beige flex items-center justify-center text-sm">
                          -
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-hotel-burgundy text-white flex items-center justify-center text-sm">
                          +
                        </button>
                        <span className="text-sm w-12 text-right">${item.price * item.quantity}</span>
                      </div>
                    </div>)}
                  {calculateExtrasTotal() > 0 && <div className="flex justify-between text-sm pt-2 border-t border-hotel-burgundy/20">
                      <span>Extras & Add-ons</span>
                      <span>${calculateExtrasTotal()}</span>
                    </div>}
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-hotel-burgundy/20">
                  <span>Total</span>
                  <span className="text-hotel-burgundy">${getCartTotal()}</span>
                </div>
              </CardContent>
            </Card>}

          <Button onClick={handleOrder} disabled={cart.length === 0} className="w-full bg-hotel-burgundy-dark font-semibold h-12 text-hotel-sand py-[10px] text-lg text-center bg-red-900 hover:bg-red-800">
            {cart.length > 0 || calculateExtrasTotal() > 0 ? `Place Order - $${getCartTotal()}` : "Add Items to Cart"}
          </Button>
        </div>
      </div>
    </MobileLayout>;
};
export default RestaurantPage;
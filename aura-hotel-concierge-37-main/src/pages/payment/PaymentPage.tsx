import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileLayout } from "@/components/ui/mobile-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, Check, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useBooking } from "@/contexts/BookingContext";
import { format } from "date-fns";
import { BookingConfirmation } from "@/components/ui/booking-confirmation";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookRoom, bookSpaService, bookEvent, bookDining, getRoomExtras, getRoomAddons, getSpaExtras, getSpaAddons, getEventExtras, getEventAddons, getDiningExtras, getDiningAddons } = useBooking();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);

  // Get booking data passed from previous page
  const bookingData = location.state?.bookingData;

  // Mock saved payment methods (in real app, fetch from user's account)
  const savedPaymentMethods = [
    { id: '1', type: 'visa', last4: '4242', expiryDate: '12/24', isDefault: true },
    { id: '2', type: 'mastercard', last4: '8888', expiryDate: '06/25', isDefault: false },
  ];

  if (!bookingData) {
    return (
      <MobileLayout title="Payment" showBackButton>
        <div className="p-4 text-center">
          <p>No booking data found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </MobileLayout>
    );
  }

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Select payment method",
        description: "Please select a payment method to continue",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let booking;
      let extras: any[] = [];
      let addons: any[] = [];

      // Handle different booking types
      if (bookingData.bookingType === "room" && bookingData.roomData) {
        const roomData = bookingData.roomData;
        booking = bookRoom(
          roomData.room.id,
          roomData.checkIn,
          roomData.checkOut
        );

        // Convert selected extras and addons
        const roomExtras = getRoomExtras();
        const roomAddons = getRoomAddons();
        
        extras = roomData.selectedExtras?.map((selected: any) => {
          const extra = roomExtras.find(e => e.id === selected.id);
          return {
            id: selected.id,
            name: extra?.name,
            price: extra ? extra.price * selected.quantity : 0
          };
        }) || [];

        addons = roomData.selectedAddons?.map((selected: any) => {
          const addon = roomAddons.find(a => a.id === selected.id);
          return {
            id: selected.id,
            name: addon?.name,
            price: addon ? addon.price * selected.quantity : 0
          };
        }) || [];

      } else if (bookingData.bookingType === "spa" && bookingData.spaData) {
        const spaData = bookingData.spaData;
        booking = bookSpaService(
          spaData.selectedService.id,
          spaData.selectedDate,
          spaData.selectedTime,
          spaData.selectedDuration
        );

        // Convert selected extras and addons
        const spaExtras = getSpaExtras();
        const spaAddons = getSpaAddons();
        
        extras = spaData.selectedExtras?.map((selected: any) => {
          const extra = spaExtras.find(e => e.id === selected.id);
          return {
            id: selected.id,
            name: extra?.name,
            price: extra ? extra.price * selected.quantity : 0
          };
        }) || [];

        addons = spaData.selectedAddons?.map((selected: any) => {
          const addon = spaAddons.find(a => a.id === selected.id);
          return {
            id: selected.id,
            name: addon?.name,
            price: addon ? addon.price * selected.quantity : 0
          };
        }) || [];

      } else if (bookingData.bookingType === "event" && bookingData.eventData) {
        const eventData = bookingData.eventData;
        booking = bookEvent(
          eventData.eventId,
          eventData.tickets
        );

        // Convert selected extras and addons for events
        const eventExtras = getEventExtras();
        const eventAddons = getEventAddons();
        
        extras = eventData.selectedExtras?.map((selected: any) => {
          const extra = eventExtras.find(e => e.id === selected.id);
          return {
            id: selected.id,
            name: extra?.name,
            price: extra ? extra.price * selected.quantity : 0
          };
        }) || [];

        addons = eventData.selectedAddons?.map((selected: any) => {
          const addon = eventAddons.find(a => a.id === selected.id);
          return {
            id: selected.id,
            name: addon?.name,
            price: addon ? addon.price * selected.quantity : 0
          };
        }) || [];

      } else if (bookingData.bookingType === "dining" && bookingData.diningData) {
        const diningData = bookingData.diningData;
        booking = bookDining(
          diningData.date,
          diningData.time,
          diningData.partySize
        );

        // Convert selected extras and addons for dining
        const diningExtras = getDiningExtras();
        const diningAddons = getDiningAddons();
        
        extras = diningData.selectedExtras?.map((selected: any) => {
          const extra = diningExtras.find(e => e.id === selected.id);
          return {
            id: selected.id,
            name: extra?.name,
            price: extra ? extra.price * selected.quantity : 0
          };
        }) || [];

        addons = diningData.selectedAddons?.map((selected: any) => {
          const addon = diningAddons.find(a => a.id === selected.id);
          return {
            id: selected.id,
            name: addon?.name,
            price: addon ? addon.price * selected.quantity : 0
          };
        }) || [];
      }

      // Set booking confirmation
      setBookingConfirmation({
        bookingType: bookingData.bookingType,
        confirmationCode: booking?.confirmationCode || `${bookingData.bookingType.toUpperCase()}-${Date.now()}`,
        title: bookingData.title,
        date: bookingData.date,
        time: bookingData.time,
        details: bookingData.details,
        location: bookingData.location,
        name: `${bookingData.guestInfo.firstName} ${bookingData.guestInfo.lastName}`,
        contact: bookingData.guestInfo.phone,
        email: bookingData.guestInfo.email,
        extras,
        addons,
        totalPrice: bookingData.totalPrice,
        loyaltyPoints: Math.floor(bookingData.totalPrice),
        paymentMethod: selectedPaymentMethod === 'new' ? 'New Card' : `•••• ${savedPaymentMethods.find(m => m.id === selectedPaymentMethod)?.last4}`
      });
      
      toast({
        title: "Payment successful",
        description: "Your booking has been confirmed!"
      });
      
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show confirmation if payment is complete
  if (bookingConfirmation) {
    return (
      <MobileLayout hideHeader>
        <div className="p-4 min-h-screen flex items-center justify-center">
          <BookingConfirmation {...bookingConfirmation} />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Payment" showBackButton>
      <div className="p-4 space-y-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-hotel-burgundy">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-hotel-charcoal/70">Service</span>
                <span className="font-medium">{bookingData.title}</span>
              </div>
              {bookingData.date && (
                <div className="flex justify-between">
                  <span className="text-hotel-charcoal/70">Date</span>
                  <span className="font-medium">{bookingData.date}</span>
                </div>
              )}
              {bookingData.time && (
                <div className="flex justify-between">
                  <span className="text-hotel-charcoal/70">Time</span>
                  <span className="font-medium">{bookingData.time}</span>
                </div>
              )}
              {bookingData.details && (
                <div className="flex justify-between">
                  <span className="text-hotel-charcoal/70">Details</span>
                  <span className="font-medium">{bookingData.details}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-hotel-burgundy/20">
                <span className="font-semibold text-hotel-charcoal">Total Amount</span>
                <span className="font-bold text-hotel-burgundy text-lg">${bookingData.totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-hotel-burgundy">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Saved Payment Methods */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-hotel-charcoal">Saved Payment Methods</h4>
              {savedPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'border-hotel-burgundy bg-hotel-burgundy/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-hotel-burgundy" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">•••• {method.last4}</p>
                          {method.isDefault && (
                            <span className="text-xs bg-hotel-gold/20 text-hotel-gold px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <Check className="h-5 w-5 text-hotel-burgundy" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Payment Method */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPaymentMethod === 'new'
                  ? 'border-hotel-burgundy bg-hotel-burgundy/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentMethod('new')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Plus className="h-6 w-6 text-hotel-burgundy" />
                  <div>
                    <p className="font-medium">Add New Payment Method</p>
                    <p className="text-sm text-gray-500">Credit or debit card</p>
                  </div>
                </div>
                {selectedPaymentMethod === 'new' && (
                  <Check className="h-5 w-5 text-hotel-burgundy" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Your payment information is encrypted and secure
            </p>
          </CardContent>
        </Card>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={!selectedPaymentMethod || isProcessing}
          className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold"
        >
          {isProcessing ? "Processing..." : `Pay $${bookingData.totalPrice}`}
        </Button>
      </div>
    </MobileLayout>
  );
};

export default PaymentPage;

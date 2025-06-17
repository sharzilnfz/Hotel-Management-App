import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateConfirmationCode } from '@/lib/booking-utils';

export interface SpaService {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  durations: {
    minutes: number;
    price: number;
  }[];
  image: string;
  specialists: string[];
}

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  amenities: string[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  price: number;
  image: string;
  capacity: number;
  availableTickets: number;
  location: string;
  type: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface BookingExtra {
  id: string;
  name?: string;
  price?: number;
}

interface BookingContextProps {
  spaServices: SpaService[];
  getSpaService: (id: number) => SpaService | undefined;
  bookSpa: (serviceId: number, date: Date, time: string, specialist: string, extras?: BookingExtra[], addons?: BookingExtra[]) => any;
  rooms: Room[];
  getRoom: (id: string) => Room | undefined;
  bookRoom: (roomId: string, checkIn: Date, checkOut: Date, guests: number, extras?: BookingExtra[], addons?: BookingExtra[]) => any;
  events: Event[];
  bookEvent: (eventId: number, tickets: number, extras?: BookingExtra[], addons?: BookingExtra[]) => any;
  menuItems: MenuItem[];
  bookRestaurant: (orderType: string, orderDetails: any, extras?: BookingExtra[], addons?: BookingExtra[]) => any;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [spaServices, setSpaServices] = useState<SpaService[]>([
    {
      id: 1,
      name: "Hot Stone Massage",
      description: "A deeply relaxing massage using heated stones to soothe muscles.",
      basePrice: 90,
      durations: [
        { minutes: 30, price: 60 },
        { minutes: 60, price: 90 },
        { minutes: 90, price: 120 }
      ],
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      specialists: ["Alice Johnson", "Bob Williams", "Catherine Davis"]
    },
    {
      id: 2,
      name: "Aromatherapy Facial",
      description: "A rejuvenating facial using essential oils to nourish and hydrate the skin.",
      basePrice: 75,
      durations: [
        { minutes: 30, price: 50 },
        { minutes: 60, price: 75 },
        { minutes: 90, price: 100 }
      ],
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      specialists: ["Catherine Davis", "David Miller"]
    },
    {
      id: 3,
      name: "Deep Tissue Massage",
      description: "A therapeutic massage targeting deeper layers of muscle tissue.",
      basePrice: 110,
      durations: [
        { minutes: 30, price: 70 },
        { minutes: 60, price: 110 },
        { minutes: 90, price: 150 }
      ],
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      specialists: ["Bob Williams", "Alice Johnson"]
    },
    {
      id: 4,
      name: "Swedish Massage",
      description: "Classic massage for relaxation and improved circulation.",
      basePrice: 80,
      durations: [
        { minutes: 30, price: 55 },
        { minutes: 60, price: 80 },
        { minutes: 90, price: 110 }
      ],
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      specialists: ["Eve Taylor", "Bob Williams"]
    },
    {
      id: 5,
      name: "Reflexology",
      description: "Acupressure massage on feet to promote overall wellness.",
      basePrice: 65,
      durations: [
        { minutes: 30, price: 45 },
        { minutes: 60, price: 65 },
        { minutes: 90, price: 90 }
      ],
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      specialists: ["David Miller", "Eve Taylor"]
    }
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "room-1",
      name: "Deluxe King Room",
      description: "Spacious room with king-sized bed and city view",
      price: 180,
      capacity: 2,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      amenities: ["wifi", "breakfast", "bathroom", "tv"]
    },
    {
      id: "room-2",
      name: "Family Suite",
      description: "Perfect for families with separate living area",
      price: 260,
      capacity: 4,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      amenities: ["wifi", "breakfast", "bathroom", "tv", "ac"]
    },
    {
      id: "room-3",
      name: "Executive Suite",
      description: "Luxurious suite with premium amenities and services",
      price: 320,
      capacity: 2,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      amenities: ["wifi", "breakfast", "bathroom", "tv", "ac", "parking"]
    }
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "menu-1",
      name: "Grilled Salmon",
      description: "Fresh salmon fillet with seasonal vegetables",
      price: 24,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "mains"
    },
    {
      id: "menu-2",
      name: "Beef Wellington",
      description: "Tender fillet of beef wrapped in puff pastry",
      price: 32,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "mains"
    },
    {
      id: "menu-3",
      name: "Mushroom Risotto",
      description: "Creamy arborio rice with wild mushrooms",
      price: 18,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "mains"
    },
    {
      id: "menu-4",
      name: "Chocolate Fondant",
      description: "Warm chocolate cake with a molten center",
      price: 10,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "desserts"
    },
    {
      id: "menu-5",
      name: "Crème Brûlée",
      description: "Classic vanilla custard with caramelized sugar",
      price: 9,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "desserts"
    }
  ]);

  const getSpaService = (id: number): SpaService | undefined => {
    return spaServices.find(service => service.id === id);
  };

  const getRoom = (id: string): Room | undefined => {
    return rooms.find(room => room.id === id);
  };

  const bookSpa = (serviceId: number, date: Date, time: string, specialist: string, extras: BookingExtra[] = [], addons: BookingExtra[] = []) => {
    const confirmationCode = generateConfirmationCode("SP");
    return {
      confirmationCode,
      serviceId,
      date,
      time,
      specialist,
      extras,
      addons,
      totalPrice: calculateTotalPrice(getSpaService(serviceId)?.basePrice || 0, extras, addons)
    };
  };

  const bookRoom = (roomId: string, checkIn: Date, checkOut: Date, guests: number, extras: BookingExtra[] = [], addons: BookingExtra[] = []) => {
    const confirmationCode = generateConfirmationCode("RM");
    return {
      confirmationCode,
      roomId,
      checkIn,
      checkOut,
      guests,
      extras,
      addons,
      totalPrice: calculateTotalPrice(getRoom(roomId)?.price || 0, extras, addons)
    };
  };

  const bookEvent = (eventId: number, tickets: number, extras: BookingExtra[] = [], addons: BookingExtra[] = []) => {
    const confirmationCode = generateConfirmationCode("EV");
    const event = events.find(e => e.id === eventId);
    const basePrice = event ? event.price * tickets : 0;
    
    return {
      confirmationCode,
      eventId,
      tickets,
      date: new Date(),
      extras,
      addons,
      totalPrice: calculateTotalPrice(basePrice, extras, addons)
    };
  };

  const bookRestaurant = (orderType: string, orderDetails: any, extras: BookingExtra[] = [], addons: BookingExtra[] = []) => {
    const confirmationCode = generateConfirmationCode("RS");
    return {
      confirmationCode,
      orderType,
      orderDetails,
      date: new Date(),
      extras,
      addons,
      totalPrice: calculateTotalPrice(orderDetails.basePrice || 0, extras, addons)
    };
  };

  // Helper function to calculate total price including extras and addons
  const calculateTotalPrice = (basePrice: number, extras: BookingExtra[] = [], addons: BookingExtra[] = []): number => {
    const extrasTotal = extras.reduce((total, extra) => total + (extra.price || 0), 0);
    const addonsTotal = addons.reduce((total, addon) => total + (addon.price || 0), 0);
    return basePrice + extrasTotal + addonsTotal;
  };

  const events = [
    {
      id: 1,
      title: "Summer Jazz Night",
      description: "An evening of smooth jazz under the stars",
      date: new Date(2024, 3, 20), // April 20, 2024
      time: "19:00",
      price: 75,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      capacity: 100,
      availableTickets: 50,
      location: "Hotel Garden",
      type: "music"
    },
    {
      id: 2,
      title: "Wine Tasting Experience",
      description: "Discover premium wines from around the world",
      date: new Date(2024, 3, 25), // April 25, 2024
      time: "18:00",
      price: 120,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      capacity: 40,
      availableTickets: 15,
      location: "Wine Cellar",
      type: "culinary"
    },
    {
      id: 3,
      title: "Gala Dinner",
      description: "Annual charity gala dinner with live entertainment",
      date: new Date(2024, 4, 5), // May 5, 2024
      time: "20:00",
      price: 200,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      capacity: 150,
      availableTickets: 75,
      location: "Grand Ballroom",
      type: "special"
    }
  ];

  return (
    <BookingContext.Provider value={{
      spaServices,
      getSpaService,
      bookSpa,
      rooms,
      getRoom,
      bookRoom,
      events,
      bookEvent,
      menuItems,
      bookRestaurant,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

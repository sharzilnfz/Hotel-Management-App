
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
  specialists: {
    name: string;
    photo: string;
    nationality: string;
    bio: string;
    specializations: string[];
    yearsOfExperience: number;
  }[];
}

export interface Room {
  id: number;
  title: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  amenities: string[];
  location?: string;
  beds?: string;
  guests?: string;
  bathrooms?: string;
  rating?: string;
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
  id: number;
  title: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: string;
}

export interface BookingExtra {
  id: string;
  name?: string;
  price?: number;
}

export interface ExtraItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  maxQuantity?: number;
}

interface BookingContextProps {
  spaServices: SpaService[];
  getSpaService: (id: number) => SpaService | undefined;
  bookSpa: (serviceId: number, date: Date, time: string, specialist: string, extras?: BookingExtra[], addons?: BookingExtra[]) => any;
  bookSpaService: (serviceId: number, date: Date, time: string, duration: number) => any;
  rooms: Room[];
  getRoom: (id: number) => Room | undefined;
  bookRoom: (roomId: number, checkIn: Date, checkOut: Date) => any;
  events: Event[];
  bookEvent: (eventId: number, tickets: number, extras?: BookingExtra[], addons?: BookingExtra[]) => any;
  menuItems: MenuItem[];
  bookRestaurant: (orderType: string, orderDetails: any, extras?: BookingExtra[], addons?: BookingExtra[]) => any;
  bookDining: (date: Date, time: string, partySize: number) => any;
  getRoomExtras: () => ExtraItem[];
  getSpaExtras: () => ExtraItem[];
  getEventExtras: () => ExtraItem[];
  getDiningExtras: () => ExtraItem[];
  getRoomAddons: () => ExtraItem[];
  getSpaAddons: () => ExtraItem[];
  getEventAddons: () => ExtraItem[];
  getDiningAddons: () => ExtraItem[];
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
      specialists: [
        { 
          name: "Alice Johnson", 
          photo: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face",
          nationality: "American",
          bio: "Alice is a certified massage therapist with expertise in hot stone therapy and deep tissue work. She believes in the healing power of touch and creates a serene environment for her clients.",
          specializations: ["Hot Stone Massage", "Deep Tissue", "Swedish Massage"],
          yearsOfExperience: 8
        },
        { 
          name: "Bob Williams", 
          photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
          nationality: "British",
          bio: "Bob specializes in therapeutic massage techniques and sports therapy. His strong hands and intuitive understanding of muscle tension make him highly sought after.",
          specializations: ["Sports Massage", "Trigger Point Therapy", "Hot Stone Massage"],
          yearsOfExperience: 12
        },
        { 
          name: "Catherine Davis", 
          photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
          nationality: "Canadian",
          bio: "Catherine combines traditional massage techniques with aromatherapy and energy work. She creates a holistic healing experience for mind, body, and spirit.",
          specializations: ["Aromatherapy", "Hot Stone Massage", "Energy Healing"],
          yearsOfExperience: 6
        }
      ]
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
      specialists: [
        { 
          name: "Catherine Davis", 
          photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
          nationality: "Canadian",
          bio: "Catherine combines traditional massage techniques with aromatherapy and energy work. She creates a holistic healing experience for mind, body, and spirit.",
          specializations: ["Aromatherapy", "Facial Treatments", "Essential Oil Therapy"],
          yearsOfExperience: 6
        },
        { 
          name: "David Miller", 
          photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
          nationality: "Australian",
          bio: "David is a licensed esthetician and aromatherapy specialist. He has extensive knowledge of essential oils and their therapeutic properties for skin care.",
          specializations: ["Aromatherapy Facials", "Anti-aging Treatments", "Organic Skincare"],
          yearsOfExperience: 9
        }
      ]
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
      specialists: [
        { 
          name: "Bob Williams", 
          photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
          nationality: "British",
          bio: "Bob specializes in therapeutic massage techniques and sports therapy. His strong hands and intuitive understanding of muscle tension make him highly sought after.",
          specializations: ["Deep Tissue Massage", "Sports Therapy", "Myofascial Release"],
          yearsOfExperience: 12
        },
        { 
          name: "Alice Johnson", 
          photo: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face",
          nationality: "American",
          bio: "Alice is a certified massage therapist with expertise in hot stone therapy and deep tissue work. She believes in the healing power of touch and creates a serene environment for her clients.",
          specializations: ["Deep Tissue Massage", "Therapeutic Massage", "Pain Management"],
          yearsOfExperience: 8
        }
      ]
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
      specialists: [
        { 
          name: "Eve Taylor", 
          photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
          nationality: "Swedish",
          bio: "Eve brings authentic Swedish massage techniques from her homeland. She focuses on relaxation and stress relief through gentle, flowing movements.",
          specializations: ["Swedish Massage", "Relaxation Therapy", "Stress Relief"],
          yearsOfExperience: 7
        },
        { 
          name: "Bob Williams", 
          photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
          nationality: "British",
          bio: "Bob specializes in therapeutic massage techniques and sports therapy. His strong hands and intuitive understanding of muscle tension make him highly sought after.",
          specializations: ["Swedish Massage", "Classic Massage", "Circulation Therapy"],
          yearsOfExperience: 12
        }
      ]
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
      specialists: [
        { 
          name: "David Miller", 
          photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=100&h=100&fit=crop&crop=face",
          nationality: "Australian",
          bio: "David is a licensed esthetician and aromatherapy specialist. He has extensive knowledge of essential oils and their therapeutic properties for skin care.",
          specializations: ["Reflexology", "Pressure Point Therapy", "Holistic Wellness"],
          yearsOfExperience: 9
        },
        { 
          name: "Eve Taylor", 
          photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
          nationality: "Swedish",
          bio: "Eve brings authentic Swedish massage techniques from her homeland. She focuses on relaxation and stress relief through gentle, flowing movements.",
          specializations: ["Reflexology", "Foot Therapy", "Wellness Coaching"],
          yearsOfExperience: 7
        }
      ]
    }
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      title: "Deluxe King Room",
      name: "Deluxe King Room",
      description: "Spacious room with king-sized bed and city view",
      price: 180,
      capacity: 2,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      amenities: ["wifi", "breakfast", "bathroom", "tv"],
      location: "Luxury Hotel",
      beds: "King Bed",
      guests: "2 Guests",
      bathrooms: "1 Bathroom",
      rating: "4.8"
    },
    {
      id: 2,
      title: "Family Suite",
      name: "Family Suite",
      description: "Perfect for families with separate living area",
      price: 260,
      capacity: 4,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      amenities: ["wifi", "breakfast", "bathroom", "tv", "ac"],
      location: "Luxury Hotel",
      beds: "2 Queen Beds",
      guests: "4 Guests", 
      bathrooms: "2 Bathrooms",
      rating: "4.9"
    },
    {
      id: 3,
      title: "Executive Suite",
      name: "Executive Suite",
      description: "Luxurious suite with premium amenities and services",
      price: 320,
      capacity: 2,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      amenities: ["wifi", "breakfast", "bathroom", "tv", "ac", "parking"],
      location: "Luxury Hotel",
      beds: "King Bed",
      guests: "2 Guests",
      bathrooms: "1 Luxury Bathroom",
      rating: "5.0"
    }
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      title: "Grilled Salmon",
      name: "Grilled Salmon",
      description: "Fresh salmon fillet with seasonal vegetables",
      price: 24,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "mains",
      rating: "4.8"
    },
    {
      id: 2,
      title: "Beef Wellington",
      name: "Beef Wellington",
      description: "Tender fillet of beef wrapped in puff pastry",
      price: 32,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "mains",
      rating: "4.9"
    },
    {
      id: 3,
      title: "Mushroom Risotto",
      name: "Mushroom Risotto",
      description: "Creamy arborio rice with wild mushrooms",
      price: 18,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "mains",
      rating: "4.7"
    },
    {
      id: 4,
      title: "Chocolate Fondant",
      name: "Chocolate Fondant",
      description: "Warm chocolate cake with a molten center",
      price: 10,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "desserts",
      rating: "4.6"
    },
    {
      id: 5,
      title: "Crème Brûlée",
      name: "Crème Brûlée",
      description: "Classic vanilla custard with caramelized sugar",
      price: 9,
      image: "/lovable-uploads/e2a8b7e5-39b1-43d6-b1e5-9c84548e01b4.png",
      category: "desserts",
      rating: "4.5"
    }
  ]);

  const getSpaService = (id: number): SpaService | undefined => {
    return spaServices.find(service => service.id === id);
  };

  const getRoom = (id: number): Room | undefined => {
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

  const bookSpaService = (serviceId: number, date: Date, time: string, duration: number) => {
    const confirmationCode = generateConfirmationCode("SP");
    const service = getSpaService(serviceId);
    const durationPrice = service?.durations.find(d => d.minutes === duration)?.price || service?.basePrice || 0;
    
    return {
      confirmationCode,
      serviceId,
      date,
      time,
      duration,
      totalPrice: durationPrice
    };
  };

  const bookRoom = (roomId: number, checkIn: Date, checkOut: Date) => {
    const confirmationCode = generateConfirmationCode("RM");
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const room = getRoom(roomId);
    const totalPrice = room ? room.price * nights : 0;
    
    return {
      confirmationCode,
      roomId,
      checkIn,
      checkOut,
      totalPrice
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

  const bookDining = (date: Date, time: string, partySize: number) => {
    const confirmationCode = generateConfirmationCode("DN");
    return {
      confirmationCode,
      date,
      time,
      partySize,
      totalPrice: 0
    };
  };

  // Helper function to calculate total price including extras and addons
  const calculateTotalPrice = (basePrice: number, extras: BookingExtra[] = [], addons: BookingExtra[] = []): number => {
    const extrasTotal = extras.reduce((total, extra) => total + (extra.price || 0), 0);
    const addonsTotal = addons.reduce((total, addon) => total + (addon.price || 0), 0);
    return basePrice + extrasTotal + addonsTotal;
  };

  // Room Extras and Add-ons
  const getRoomExtras = (): ExtraItem[] => [
    { id: "late-checkout", name: "Late Checkout", description: "Checkout until 2 PM", price: 25, category: "convenience" },
    { id: "early-checkin", name: "Early Check-in", description: "Check-in from 12 PM", price: 20, category: "convenience" },
    { id: "airport-pickup", name: "Airport Pickup", description: "Private car transfer", price: 65, category: "transport" },
    { id: "extra-towels", name: "Extra Towels", description: "Additional bath towels", price: 15, maxQuantity: 5, category: "amenities" },
    { id: "room-upgrade", name: "Room Upgrade", description: "Subject to availability", price: 50, category: "upgrade" }
  ];

  const getRoomAddons = (): ExtraItem[] => [
    { id: "champagne", name: "Welcome Champagne", description: "Bottle of champagne on arrival", price: 45, category: "dining" },
    { id: "flowers", name: "Fresh Flowers", description: "Bouquet of seasonal flowers", price: 30, category: "decor" },
    { id: "chocolate", name: "Gourmet Chocolates", description: "Selection of artisan chocolates", price: 25, category: "dining" },
    { id: "spa-kit", name: "Luxury Spa Kit", description: "Premium bath amenities", price: 35, category: "amenities" }
  ];

  // Spa Extras and Add-ons
  const getSpaExtras = (): ExtraItem[] => [
    { id: "aromatherapy", name: "Aromatherapy Enhancement", description: "Essential oil blend", price: 15, category: "enhancement" },
    { id: "hot-stones", name: "Hot Stone Add-on", description: "Additional heated stones", price: 20, category: "enhancement" },
    { id: "scalp-massage", name: "Scalp Massage", description: "15-minute scalp treatment", price: 25, category: "treatment" },
    { id: "foot-soak", name: "Foot Soak", description: "Relaxing herbal foot bath", price: 18, category: "treatment" }
  ];

  const getSpaAddons = (): ExtraItem[] => [
    { id: "robes", name: "Luxury Robe", description: "Take-home spa robe", price: 85, category: "retail" },
    { id: "candles", name: "Aromatherapy Candles", description: "Set of 3 scented candles", price: 35, category: "retail" },
    { id: "tea-service", name: "Herbal Tea Service", description: "Post-treatment relaxation tea", price: 12, category: "refreshment" }
  ];

  // Event Extras and Add-ons
  const getEventExtras = (): ExtraItem[] => [
    { id: "vip-seating", name: "VIP Seating", description: "Premium front-row seats", price: 40, category: "seating" },
    { id: "meet-greet", name: "Meet & Greet", description: "Private artist meet & greet", price: 75, category: "experience" },
    { id: "photo-package", name: "Photo Package", description: "Professional event photos", price: 50, category: "photography" },
    { id: "drink-tokens", name: "Drink Tokens", description: "3 complimentary drinks", price: 30, maxQuantity: 3, category: "dining" }
  ];

  const getEventAddons = (): ExtraItem[] => [
    { id: "event-poster", name: "Signed Event Poster", description: "Limited edition memorabilia", price: 25, category: "merchandise" },
    { id: "gift-bag", name: "Exclusive Gift Bag", description: "Event-themed goodies", price: 35, category: "merchandise" },
    { id: "priority-parking", name: "Priority Parking", description: "Reserved parking spot", price: 20, category: "convenience" }
  ];

  // Dining Extras and Add-ons
  const getDiningExtras = (): ExtraItem[] => [
    { id: "wine-pairing", name: "Wine Pairing", description: "Sommelier selected wines", price: 45, category: "beverage" },
    { id: "chef-special", name: "Chef's Special", description: "Off-menu signature dish", price: 35, category: "food" },
    { id: "birthday-dessert", name: "Birthday Dessert", description: "Special celebration dessert", price: 18, category: "celebration" },
    { id: "table-flowers", name: "Table Centerpiece", description: "Fresh floral arrangement", price: 25, category: "decor" }
  ];

  const getDiningAddons = (): ExtraItem[] => [
    { id: "recipe-card", name: "Recipe Card", description: "Chef's signature recipe", price: 15, category: "souvenir" },
    { id: "wine-bottle", name: "Take-Home Wine", description: "Bottle from your meal", price: 55, category: "beverage" },
    { id: "chef-photo", name: "Chef Photo", description: "Photo with the head chef", price: 20, category: "experience" }
  ];

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
      bookSpaService,
      rooms,
      getRoom,
      bookRoom,
      events,
      bookEvent,
      menuItems,
      bookRestaurant,
      bookDining,
      getRoomExtras,
      getSpaExtras,
      getEventExtras,
      getDiningExtras,
      getRoomAddons,
      getSpaAddons,
      getEventAddons,
      getDiningAddons,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

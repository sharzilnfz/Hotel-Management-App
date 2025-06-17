
import { useState } from "react";
import FeaturedCard from "./FeaturedCard";
import ServiceCard from "./ServiceCard";
import { Bed, Heart, Ticket, Utensils, Award, User } from "lucide-react";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  const [greeting, setGreeting] = useState("Welcome to");
  
  // In a real app, we would fetch these from an API
  const featuredItems = [
    {
      id: "f1",
      title: "Luxury Suite",
      description: "Experience ultimate comfort with our premium suites",
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "room"
    },
    {
      id: "f2",
      title: "Gourmet Dinner",
      description: "Enjoy our chef's special 5-course meal",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "dining"
    },
    {
      id: "f3",
      title: "Summer Concert",
      description: "Live music by the poolside every weekend",
      imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "event"
    },
  ];

  const services = [
    {
      icon: <Bed size={24} />,
      title: "Rooms",
      description: "Book your perfect stay",
      path: "/rooms",
      color: "bg-blue-100"
    },
    {
      icon: <Heart size={24} />,
      title: "Spa",
      description: "Relax and rejuvenate",
      path: "/spa",
      color: "bg-green-100"
    },
    {
      icon: <Ticket size={24} />,
      title: "Events",
      description: "Explore our events",
      path: "/events",
      color: "bg-purple-100"
    },
    {
      icon: <Utensils size={24} />,
      title: "Dining",
      description: "Savor our cuisine",
      path: "/restaurant",
      color: "bg-orange-100"
    },
    {
      icon: <Award size={24} />,
      title: "Rewards",
      description: "Loyalty benefits",
      path: "/loyalty",
      color: "bg-red-100"
    }
  ];

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="hotel-gradient text-white px-4 pt-12 pb-8 relative">
        <div className="flex flex-col space-y-1">
          <p className="text-lg opacity-90">{greeting}</p>
          <h1 className="text-3xl font-semibold">Parkside Plaza</h1>
          <p className="text-sm opacity-80 mt-1">Your luxury getaway awaits</p>
        </div>
        <div className="absolute top-4 right-4">
          <Link to="/admin-login" className="flex items-center px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm text-white transition-colors">
            <User size={14} className="mr-1" />
            Admin Access
          </Link>
        </div>
      </div>

      {/* Featured Items */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Featured</h2>
          <Link to="/rooms" className="text-sm text-hotel-primary font-medium">
            View All
          </Link>
        </div>
        
        <div className="flex overflow-x-auto pb-4 space-x-4 hide-scrollbar">
          {featuredItems.map((item) => (
            <FeaturedCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              type={item.type}
            />
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Services</h2>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              path={service.path}
              color={service.color}
            />
          ))}
        </div>
      </div>
      
      {/* Footer with admin link */}
      <div className="mt-8 text-center pb-4 flex flex-col items-center gap-2">
        <Link to="/admin-login" className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
          <User size={16} className="mr-2 text-hotel-primary" />
          Admin Portal
        </Link>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Parkside Plaza Hotel. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;

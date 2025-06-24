
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/pagination";

const onboardingSlides = [
  {
    id: 1,
    title: "Welcome to Parkside Plaza",
    description: "Experience luxury and comfort at its finest. Your perfect stay awaits.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: 2,
    title: "Seamless Booking Experience",
    description: "Book rooms, spa treatments, and restaurant tables with just a few taps.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: 3,
    title: "Exclusive Benefits",
    description: "Earn loyalty points with every booking and enjoy exclusive member rewards.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=500",
  }
];

const Onboarding = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const isLastSlide = activeSlide === onboardingSlides.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 relative">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="h-full"
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        >
          {onboardingSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="h-full flex flex-col">
                <div 
                  className="h-2/3 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="h-full w-full bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="h-1/3 flex flex-col items-center justify-center p-6 text-center">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-playfair text-hotel-burgundy font-semibold mb-3"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-gray-600 mb-6"
                  >
                    {slide.description}
                  </motion.p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="p-6 bg-white">
        {isLastSlide ? (
          <div className="space-y-3">
            <Link to="/auth/login">
              <Button className="w-full py-3">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="outline" className="w-full py-3">
                Create Account
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full py-3">
                Continue as Guest
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <Link to="/" className="text-gray-500">
              Skip
            </Link>
            <Button
              onClick={() => setActiveSlide(activeSlide + 1)}
              size="icon"
              className="rounded-full shadow-lg"
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

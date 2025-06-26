
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface PromoItem {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

interface PromotionalBannerProps {
  items: PromoItem[];
}

export function PromotionalBanner({ items }: PromotionalBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl h-80 w-full shadow-luxury bg-gradient-to-br from-hotel-cream to-hotel-pearl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${items[currentIndex].image})` }}
          >
            {/* Luxury gradient overlay matching hotel theme */}
            <div className="absolute inset-0 bg-gradient-to-tr from-hotel-burgundy/85 via-hotel-charcoal/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-hotel-burgundy/70"></div>
            
            {/* Content positioned below arrows and above indicators */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-8 pt-16 pb-20">
              <div className="max-w-sm">
                <motion.div
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-4"
                >
                  <h2 className="font-playfair text-3xl font-bold text-white mb-3 leading-tight drop-shadow-xl">
                    {items[currentIndex].title}
                  </h2>
                  <p className="text-hotel-cream/95 text-base mb-6 leading-relaxed font-montserrat font-light drop-shadow-lg">
                    {items[currentIndex].description}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Button positioned above indicators */}
            <div className="absolute bottom-16 left-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link
                  to={items[currentIndex].link}
                  className="inline-flex items-center px-6 py-3 bg-hotel-gold/90 backdrop-blur-md text-hotel-burgundy rounded-2xl text-sm font-bold font-montserrat border-2 border-hotel-gold hover:bg-hotel-gold hover:border-hotel-gold-light transform hover:scale-105 transition-all duration-300 shadow-luxury"
                >
                  {items[currentIndex].buttonText}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - matching hotel theme */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-hotel-gold/20 backdrop-blur-md rounded-full flex items-center justify-center text-hotel-gold border-2 border-hotel-gold/30 hover:bg-hotel-gold/30 hover:border-hotel-gold hover:scale-110 transition-all duration-300 z-30 shadow-gold"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-hotel-gold/20 backdrop-blur-md rounded-full flex items-center justify-center text-hotel-gold border-2 border-hotel-gold/30 hover:bg-hotel-gold/30 hover:border-hotel-gold hover:scale-110 transition-all duration-300 z-30 shadow-gold"
        aria-label="Next slide"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>

      {/* Indicator System - positioned at bottom with hotel theme colors */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-400 ${
              index === currentIndex
                ? "w-8 h-3 bg-hotel-gold rounded-full shadow-gold border border-hotel-gold-light"
                : "w-3 h-3 bg-hotel-gold/40 rounded-full hover:bg-hotel-gold/70 hover:scale-125 border border-hotel-gold/20"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative corner accents with hotel theme */}
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-hotel-gold/40 rounded-tr-xl z-20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-hotel-gold/40 rounded-bl-xl z-20"></div>
    </div>
  );
}

import { MobileLayout } from '@/components/ui/mobile-layout';
import {
  PromoItem,
  PromotionalBanner,
} from '@/components/ui/promotional-banner';
import { ServiceMenu } from '@/components/ui/service-menu';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Award,
  Bed,
  Calendar,
  Flower2,
  LayoutGrid,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const promoItems: PromoItem[] = [
  {
    id: 'promo1',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=500',
    title: 'Summer Getaway',
    description: '30% off on all suites for stays in June',
    buttonText: 'Book Now',
    link: '/rooms',
  },
  {
    id: 'promo2',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500',
    title: 'Spa Weekend',
    description: 'Book any treatment and get a free 30min massage',
    buttonText: 'View Offers',
    link: '/spa',
  },
  {
    id: 'promo3',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=500',
    title: 'Gourmet Experience',
    description: '5-course tasting menu with wine pairing',
    buttonText: 'Reserve',
    link: '/restaurant',
  },
];

const serviceItems = [
  {
    id: 'service1',
    title: 'Luxury Suites',
    description: 'Experience ultimate comfort',
    icon: <Bed size={26} strokeWidth={2} />,
    path: '/rooms',
  },
  {
    id: 'service2',
    title: 'Wellness Spa',
    description: 'Rejuvenate your senses',
    icon: <Flower2 size={26} strokeWidth={2} />,
    path: '/spa',
  },
  {
    id: 'service3',
    title: 'Exclusive Events',
    description: 'Memorable experiences await',
    icon: <Calendar size={26} strokeWidth={2} />,
    path: '/events',
  },
  {
    id: 'service4',
    title: 'Fine Dining',
    description: 'Culinary excellence served',
    icon: <UtensilsCrossed size={26} strokeWidth={2} />,
    path: '/restaurant',
  },
  {
    id: 'service5',
    title: 'Meeting Hall',
    description: 'Perfect venue for occasions',
    icon: <LayoutGrid size={26} strokeWidth={2} />,
    path: '/meeting-hall',
  },
  {
    id: 'service6',
    title: 'Elite Rewards',
    description: 'Exclusive member benefits',
    icon: <Award size={26} strokeWidth={2} />,
    path: '/loyalty',
  },
];

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  // Function to get tier-based colors
  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'gold':
        return {
          background:
            'bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-700',
          overlay: 'bg-gradient-to-br from-yellow-400/20 to-amber-600/30',
          badge: 'bg-yellow-400/90 text-yellow-900',
          accent: 'bg-yellow-300/40',
        };
      case 'platinum':
        return {
          background:
            'bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800',
          overlay: 'bg-gradient-to-br from-slate-300/20 to-slate-700/30',
          badge: 'bg-slate-200/90 text-slate-900',
          accent: 'bg-slate-300/40',
        };
      case 'silver':
        return {
          background:
            'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700',
          overlay: 'bg-gradient-to-br from-gray-300/20 to-gray-600/30',
          badge: 'bg-gray-200/90 text-gray-900',
          accent: 'bg-gray-300/40',
        };
      default: // standard
        return {
          background:
            'bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800',
          overlay: 'bg-gradient-to-br from-rose-400/20 to-rose-700/30',
          badge: 'bg-rose-200/90 text-rose-900',
          accent: 'bg-rose-300/40',
        };
    }
  };

  return (
    <MobileLayout showLogo>
      <div className="p-6 pb-32">
        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div
              className={`relative overflow-hidden ${
                getTierColors(user.tier || 'standard').background
              } rounded-3xl shadow-2xl h-32`}
            >
              {/* Background pattern overlay */}
              <div
                className={`absolute inset-0 ${
                  getTierColors(user.tier || 'standard').overlay
                }`}
              ></div>

              {/* Decorative elements */}
              <div
                className={`absolute top-2 right-2 w-16 h-16 ${
                  getTierColors(user.tier || 'standard').accent
                } rounded-full opacity-30`}
              ></div>
              <div
                className={`absolute bottom-2 left-2 w-8 h-8 ${
                  getTierColors(user.tier || 'standard').accent
                } rounded-full opacity-20`}
              ></div>

              <div className="relative p-6 h-full flex items-center">
                <div className="flex-1">
                  <h2 className="text-lg font-playfair font-bold text-white mb-1">
                    Welcome back,{' '}
                    {user.name ? user.name.split(' ')[0] : 'Guest'}!
                  </h2>
                  <p className="text-white/90 font-montserrat text-sm">
                    {user.loyaltyPoints || 0} points •{' '}
                    {user.tier
                      ? user.tier.charAt(0).toUpperCase() + user.tier.slice(1)
                      : 'Standard'}{' '}
                    Member
                  </p>
                </div>
                <div className="ml-4">
                  <div
                    className={`${
                      getTierColors(user.tier || 'standard').badge
                    } px-4 py-2 rounded-xl font-bold text-sm font-montserrat uppercase tracking-wider shadow-lg`}
                  >
                    {user.tier || 'standard'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PromotionalBanner items={promoItems} />
        </motion.div>

        <motion.div
          className="my-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-playfair font-bold text-hotel-burgundy flex-1">
              Luxury Services
            </h2>
            <div className="w-12 h-[2px] bg-gold-gradient rounded-full"></div>
          </div>
          <ServiceMenu items={serviceItems} />
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-playfair font-bold text-hotel-burgundy">
              Your Reservations
            </h2>
            <Link
              to="/bookings"
              className="text-sm text-hotel-burgundy font-semibold font-montserrat hover:text-hotel-gold transition-colors"
            >
              View All
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="hotel-card p-8 text-center border-2 border-hotel-beige/40">
              <div className="py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-hotel-pearl to-hotel-beige flex items-center justify-center">
                  <Calendar
                    size={40}
                    className="text-hotel-burgundy/60"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-playfair font-semibold text-hotel-burgundy mb-2">
                  No Upcoming Reservations
                </h3>
                <p className="text-hotel-charcoal/70 font-montserrat mb-6">
                  Book your next luxury experience with us
                </p>
                <Link to="/rooms">
                  <button className="bg-luxury-gradient text-white py-3 px-8 rounded-2xl font-semibold font-montserrat shadow-luxury hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-hotel-burgundy/20">
                    Reserve Now
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="hotel-card p-8 text-center border-2 border-hotel-beige/40">
              <div className="py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-hotel-pearl to-hotel-beige flex items-center justify-center">
                  <Award
                    size={40}
                    className="text-hotel-burgundy/60"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-playfair font-semibold text-hotel-burgundy mb-2">
                  Join Our Elite Club
                </h3>
                <p className="text-hotel-charcoal/70 font-montserrat mb-6">
                  Sign in to access exclusive reservations and earn luxury
                  rewards
                </p>
                <Link to="/auth/login">
                  <button className="bg-luxury-gradient text-white py-3 px-8 rounded-2xl font-semibold font-montserrat shadow-luxury hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-hotel-burgundy/20">
                    Join Now
                  </button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Home;

import mongoose from "mongoose";

// Home Page Content Schema
const homePageSchema = new mongoose.Schema({
    hero: {
        title: {
            type: String,
            default: "Experience Luxury at Parkside Plaza"
        },
        subtitle: {
            type: String,
            default: "Indulge in exquisite comfort and world-class amenities"
        },
        backgroundImage: {
            type: String,
            default: ""
        },
        backgroundImage2: {
            type: String,
            default: ""
        },
        backgroundImage3: {
            type: String,
            default: ""
        }
    },
    welcome: {
        message: {
            type: String,
            default: "Welcome to Parkside Plaza, where luxury meets comfort. Our hotel offers an unforgettable experience with stunning views, exceptional service, and premier amenities. Whether you're visiting for business or leisure, our dedicated staff is committed to making your stay memorable."
        }
    },
    about: {
        content: {
            type: String,
            default: "Nestled in the heart of the city, Parkside Plaza offers a sanctuary of comfort and luxury. Our hotel features elegantly designed rooms, a renowned spa, exquisite dining options, and versatile event spaces. With our commitment to excellence, we ensure every guest experiences the pinnacle of hospitality."
        }
    },
    featuredServices: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
        order: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Rooms Page Content Schema
const roomsPageSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Luxurious Rooms & Suites"
    },
    description: {
        type: String,
        default: "Experience the ultimate in comfort and luxury with our selection of elegantly designed rooms and suites, each offering unique amenities to enhance your stay."
    },
    coverImage: {
        type: String,
        default: ""
    },
    categories: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Spa Page Content Schema
const spaPageSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Spa & Wellness"
    },
    description: {
        type: String,
        default: "Indulge in a world of relaxation and rejuvenation at our luxury spa. Our treatments combine ancient techniques with modern approaches to provide a truly refreshing experience."
    },
    coverImage: {
        type: String,
        default: ""
    },
    services: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: String,
            default: ""
        },
        duration: {
            type: String,
            default: ""
        },
        order: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Restaurant Page Content Schema
const restaurantPageSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Fine Dining Experience"
    },
    subtitle: {
        type: String,
        default: "Enjoy your time in our Hotel with pleasure."
    },
    description: {
        type: String,
        default: "Savor exquisite culinary creations at our restaurant, where our talented chefs craft dishes using the finest local and international ingredients to deliver an unforgettable dining experience."
    },
    coverImage: {
        type: String,
        default: ""
    },
    menuItemsPDF: {
        type: String,
        default: ""
    },
    headChef: {
        type: String,
        default: "Chef Michael Roberts"
    },
    cuisineType: {
        type: String,
        default: "Contemporary International"
    },
    openingHours: {
        type: String,
        default: "Breakfast: 6:30 AM - 10:30 AM\nLunch: 12:00 PM - 2:30 PM\nDinner: 6:00 PM - 10:30 PM"
    },
    featuredDishes: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
        order: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Events Page Content Schema
const eventsPageSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Events & Celebrations"
    },
    description: {
        type: String,
        default: "Host extraordinary events in our versatile venues, perfect for weddings, conferences, and special celebrations. Our dedicated team ensures every detail is flawlessly executed."
    },
    coverImage: {
        type: String,
        default: ""
    },
    featuredEvents: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ""
        },
        order: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Meeting Hall Page Content Schema
const meetingHallPageSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Meeting Halls & Conference Rooms"
    },
    description: {
        type: String,
        default: "Host successful meetings, conferences, and corporate events in our modern, well-equipped meeting halls designed to inspire productivity and collaboration."
    },
    coverImage: {
        type: String,
        default: ""
    },
    features: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: ""
        },
        order: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Navigation Menus Schema
const navigationSchema = new mongoose.Schema({
    main: [{
        label: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    }],
    footer: [{
        label: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Footer Content Schema
const footerSchema = new mongoose.Schema({
    aboutText: {
        type: String,
        default: "Parkside Plaza Hotel offers luxury accommodations with world-class amenities and exceptional service in the heart of the city."
    },
    contactInfo: {
        address: {
            type: String,
            default: "123 Park Avenue, New York, NY 10001"
        },
        phone: {
            type: String,
            default: "+1 (555) 123-4567"
        },
        email: {
            type: String,
            default: "info@parksideplaza.com"
        }
    },
    copyrightText: {
        type: String,
        default: "© 2025 Parkside Plaza Hotel. All Rights Reserved."
    },
    socialMedia: [{
        platform: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: ""
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// About Page Content Schema
const aboutPageSchema = new mongoose.Schema({
    hero: {
        title: {
            type: String,
            default: "About The Hotel"
        },
        subtitle: {
            type: String,
            default: "Enjoy your time in our Hotel with pleasure."
        },
        backgroundImage: {
            type: String,
            default: ""
        }
    },
    about: {
        title: {
            type: String,
            default: "About Our Hotel"
        },
        subtitle: {
            type: String,
            default: "Enjoy your time in our Hotel"
        },
        content: {
            type: String,
            default: "Qed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur."
        },
        welcomeMessage: {
            type: String,
            default: "Fames massa tortor sit nisl sit. Duis nulla tempus quisque et diam condimentum nisl. Rhoncus quisque elementum nulla lorem at turpis vitae quisque. Vulputate duis vel et odio hendrerit magna. Nec lacus dui egestas sit. Vulputate tincidunt viverra viverra etiam porta facilisis."
        }
    },
    stats: [{
        number: {
            type: Number,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    }],
    team: [{
        name: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ""
        },
        socialLinks: [{
            platform: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            icon: {
                type: String,
                default: ""
            }
        }],
        order: {
            type: Number,
            required: true
        }
    }],
    gallery: [{
        image: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create separate models for each content type
const HomePage = mongoose.model("HomePageContent", homePageSchema);
const RoomsPage = mongoose.model("RoomsPageContent", roomsPageSchema);
const SpaPage = mongoose.model("SpaPageContent", spaPageSchema);
const RestaurantPage = mongoose.model("RestaurantPageContent", restaurantPageSchema);
const EventsPage = mongoose.model("EventsPageContent", eventsPageSchema);
const MeetingHallPage = mongoose.model("MeetingHallPageContent", meetingHallPageSchema);
const Navigation = mongoose.model("NavigationContent", navigationSchema);
const Footer = mongoose.model("FooterContent", footerSchema);
const AboutPage = mongoose.model("AboutPageContent", aboutPageSchema);

// Export all content models
export {
    HomePage,
    RoomsPage,
    SpaPage,
    RestaurantPage,
    EventsPage,
    MeetingHallPage,
    Navigation,
    Footer,
    AboutPage
}; 
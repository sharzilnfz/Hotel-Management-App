// Restaurant page data

// Restaurant info
export const restaurantInfo = {
    title: "Special selection",
    heading: "About Our Restaurant",
    description1: "Ged ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.Ut enim ad minima Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    description2: "Fames massa tortor sit nisl sit. Duis nulla tempus quisque et diam condimentum nisl. Rhoncus quisque elementum nulla lorem at turpis vitae quisque. Vulputate duis vel et odio hendrerit magna. Nec lacus dui egestas sit. Vulputate tincidunt viverra viverra etiam porta facilisis.    Fames massa tortor sit nisl sit. Duis nulla tempus quisque et diam condimentum nisl. Rhoncus quisque elementum nulla lorem at turpis vitae quisque. Vulputate duis vel et odio hendrerit magna. Nec lacus dui egestas sit. Vulputate tincidunt viverra viverra etiam porta facilisis.",
    images: [
        "/src/assets/images/all/1.jpg",
        "/src/assets/images/all/1.jpg",
        "/src/assets/images/all/1.jpg"
    ]
};

// Restaurant services
export const restaurantServices = [
    {
        title: "Gourmet Breakfast",
        name: "Breakfast Buffet",
        location: "Lobby Level",
        icon: "fa-thin fa-croissant",
        hours: {
            days: "Monday - Sunday",
            time: "06:00 am - 22:30 pm"
        },
        background: "/src/assets/images/bg/1.jpg"
    },
    {
        title: "Lunch and Dinner",
        name: "The Restaurant",
        location: "Location: The 2nd Floor East Wing",
        icon: "fa-thin fa-salad",
        hours: {
            days: "Monday - Sunday",
            time: "06:00 am - 22:30 pm"
        },
        background: "/src/assets/images/bg/1.jpg"
    },
    {
        title: "Bar, Lunch, Dinner",
        name: "Japanese Sushi Bar",
        location: "Terrace",
        icon: "fa-thin fa-sushi",
        hours: {
            days: "Monday - Sunday",
            time: "06:00 am - 22:30 pm"
        },
        background: "/src/assets/images/bg/1.jpg"
    }
];

// Menu categories
export const menuCategories = [
    { id: "tab-1", name: "Main Dishes", active: true },
    { id: "tab-2", name: "Starters", active: false },
    { id: "tab-3", name: "Desserts", active: false },
    { id: "tab-4", name: "Drinks", active: false }
];

// Menu items by category
export const menuItems = {
    "tab-1": [
        {
            name: "Soft Shell Crab",
            price: 29,
            description: "Our tender, juicy filet paired with a steamed lobster tail.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Miso Chicken",
            price: 12,
            description: "Fusce a tellus tellus. Praesent neque arcu, efficitur sit amet.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: "15%"
        },
        {
            name: "Salmon Riverland",
            price: 14,
            description: "Pellentesque eros mi, faucibus tempor scelerisque nec, efficitur nunc.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Victoria's Filet Mignon",
            price: 35,
            description: "Seasoned with an herb crust, served with au just to order.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Salmon Riverland",
            price: 14,
            description: "Pellentesque eros mi, faucibus tempor scelerisque nec, efficitur nunc.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        }
    ],
    "tab-2": [
        {
            name: "Fried Potatoes",
            price: 12,
            description: "Fusce a tellus tellus. Praesent neque arcu, efficitur sit amet.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Slow-Roasted Prime Rib",
            price: 104,
            description: "Pellentesque eros mi, faucibus tempor scelerisque nec, efficitur nunc.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: "10%"
        },
        {
            name: "Prime Cuts of Beef",
            price: 27,
            description: "Seasoned with an herb crust, served with au just to order.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Salmon Riverland",
            price: 14,
            description: "Pellentesque eros mi, faucibus tempor scelerisque nec, efficitur nunc.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Victoria's Filet Mignon",
            price: 35,
            description: "Seasoned with an herb crust, served with au just to order.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        }
    ],
    "tab-3": [
        {
            name: "Doner Burger",
            price: 29,
            description: "Our tender, juicy filet paired with a steamed lobster tail.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: "40%"
        },
        {
            name: "Cayenne Shrimp",
            price: 37,
            description: "Fusce a tellus tellus. Praesent neque arcu, efficitur sit amet.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Meatball Tagliatelle",
            price: 54,
            description: "Pellentesque eros mi, faucibus tempor scelerisque nec, efficitur nunc.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: "25%"
        },
        {
            name: "Tarte Tatin",
            price: 35,
            description: "Seasoned with an herb crust, served with au just to order.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        }
    ],
    "tab-4": [
        {
            name: "Creme Brulee",
            price: 29,
            description: "Our tender, juicy filet paired with a steamed lobster tail.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Chapel Down",
            price: 12,
            description: "Fusce a tellus tellus. Praesent neque arcu, efficitur sit amet.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Lobster With Melted Mozarella",
            price: 107,
            description: "Pellentesque eros mi, faucibus tempor scelerisque nec, efficitur nunc.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: null
        },
        {
            name: "Butterfly Fried Shrimps Platter",
            price: 19,
            description: "Seasoned with an herb crust, served with au just to order.",
            image: "/src/assets/images/menu/thumbnails/1.jpg",
            discount: "50%"
        }
    ]
}; 
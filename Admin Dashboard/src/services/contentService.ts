import axios from 'axios';

const API_URL = 'http://localhost:4000/api/content';

// Types for the content data
export interface HeroSection {
    title: string;
    subtitle: string;
    backgroundImage?: string;
}

export interface WelcomeSection {
    message: string;
}

export interface AboutSection {
    content: string;
}

export interface FeaturedService {
    title: string;
    description: string;
    icon?: string;
    order: number;
}

export interface HomePageContent {
    hero: HeroSection;
    welcome: WelcomeSection;
    about: AboutSection;
    featuredServices: FeaturedService[];
}

export interface RoomCategory {
    name: string;
    description: string;
    order: number;
}

export interface RoomsPageContent {
    title: string;
    description: string;
    coverImage?: string;
    categories: RoomCategory[];
}

export interface SpaService {
    name: string;
    description: string;
    price: string;
    duration: string;
    order: number;
}

export interface SpaPageContent {
    title: string;
    description: string;
    coverImage?: string;
    services: SpaService[];
}

export interface FeaturedDish {
    name: string;
    description: string;
    price: string;
    image?: string;
    order: number;
}

export interface RestaurantPageContent {
    title: string;
    description: string;
    headChef: string;
    cuisineType: string;
    openingHours: string;
    coverImage?: string;
    featuredDishes: FeaturedDish[];
    menuItemsPDF?: string;
}

export interface FeaturedEvent {
    name: string;
    description: string;
    image?: string;
    order: number;
}

export interface EventsPageContent {
    title: string;
    description: string;
    coverImage?: string;
    featuredEvents: FeaturedEvent[];
}

export interface MeetingHallPageContent {
    title: string;
    description: string;
    coverImage?: string;
}

export interface NavigationItem {
    label: string;
    path: string;
    order: number;
}

export interface NavigationContent {
    main: NavigationItem[];
    footer: NavigationItem[];
}

export interface SocialMediaLink {
    platform: string;
    url: string;
    icon?: string;
}

export interface ContactInfo {
    address: string;
    phone: string;
    email: string;
}

export interface FooterContent {
    aboutText: string;
    contactInfo: ContactInfo;
    copyrightText: string;
    socialMedia: SocialMediaLink[];
}

export interface ContentData {
    homePage: HomePageContent;
    roomsPage: RoomsPageContent;
    spaPage: SpaPageContent;
    restaurantPage: RestaurantPageContent;
    eventsPage: EventsPageContent;
    meetingHallPage: MeetingHallPageContent;
    navigation: NavigationContent;
    footer: FooterContent;
    lastUpdated: Date;
}

// Get all content
export const getAllContent = async (): Promise<ContentData> => {
    const response = await axios.get(API_URL);
    return response.data.data;
};

// Home page content
export const getHomePageContent = async (): Promise<HomePageContent> => {
    const response = await axios.get(`${API_URL}/home`);
    return response.data.data;
};

export const updateHomePageContent = async (data: Partial<HomePageContent>): Promise<HomePageContent> => {
    try {
        console.log('Calling API:', `${API_URL}/home`);
        console.log('With data:', JSON.stringify(data, null, 2));
        
        const response = await axios.put(`${API_URL}/home`, data);
        console.log('API Response:', response.data);
        
        return response.data.data;
    } catch (error) {
        console.error('API Error in updateHomePageContent:', error);
        if (axios.isAxiosError(error)) {
            console.error('Request:', error.config);
            console.error('Response:', error.response?.data);
        }
        throw error;
    }
};

// Rooms page content
export const getRoomsPageContent = async (): Promise<RoomsPageContent> => {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data.data;
};

export const updateRoomsPageContent = async (data: Partial<RoomsPageContent>): Promise<RoomsPageContent> => {
    const response = await axios.put(`${API_URL}/rooms`, data);
    return response.data.data;
};

// Spa page content
export const getSpaPageContent = async (): Promise<SpaPageContent> => {
    const response = await axios.get(`${API_URL}/spa`);
    return response.data.data;
};

export const updateSpaPageContent = async (data: Partial<SpaPageContent>): Promise<SpaPageContent> => {
    const response = await axios.put(`${API_URL}/spa`, data);
    return response.data.data;
};

// Restaurant page content
export const getRestaurantPageContent = async (): Promise<RestaurantPageContent> => {
    const response = await axios.get(`${API_URL}/restaurant`);
    return response.data.data;
};

export const updateRestaurantPageContent = async (data: Partial<RestaurantPageContent>): Promise<RestaurantPageContent> => {
    const response = await axios.put(`${API_URL}/restaurant`, data);
    return response.data.data;
};

// Events page content
export const getEventsPageContent = async (): Promise<EventsPageContent> => {
    const response = await axios.get(`${API_URL}/events`);
    return response.data.data;
};

export const updateEventsPageContent = async (data: Partial<EventsPageContent>): Promise<EventsPageContent> => {
    const response = await axios.put(`${API_URL}/events`, data);
    return response.data.data;
};

// Meeting Hall page content
export const getMeetingHallPageContent = async (): Promise<MeetingHallPageContent> => {
    const response = await axios.get(`${API_URL}/meeting-hall`);
    return response.data.data;
};

export const updateMeetingHallPageContent = async (data: Partial<MeetingHallPageContent>): Promise<MeetingHallPageContent> => {
    const response = await axios.put(`${API_URL}/meeting-hall`, data);
    return response.data.data;
};

// Navigation content
export const getNavigationContent = async (): Promise<NavigationContent> => {
    const response = await axios.get(`${API_URL}/navigation`);
    return response.data.data;
};

export const updateNavigationContent = async (data: Partial<NavigationContent>): Promise<NavigationContent> => {
    const response = await axios.put(`${API_URL}/navigation`, data);
    return response.data.data;
};

// Footer content
export const getFooterContent = async (): Promise<FooterContent> => {
    const response = await axios.get(`${API_URL}/footer`);
    return response.data.data;
};

export const updateFooterContent = async (data: Partial<FooterContent>): Promise<FooterContent> => {
    const response = await axios.put(`${API_URL}/footer`, data);
    return response.data.data;
}; 
import axios from 'axios';

// Define API base URL using environment variable or fallback to localhost
const API_URL = 'http://localhost:4000/api';

// Room interface
export interface Room {
    _id: string;
    name: string;
    type: string;
    category: string;
    bedType: string;
    capacity: number;
    price: number;
    totalRooms: number;
    availableRooms: number;
    description: string;
    isRefundable: boolean;
    refundPolicy: string;
    breakfastIncluded: boolean;
    checkInTime: string;
    checkOutTime: string;
    amenities: string[];
    payNow: boolean;
    payAtHotel: boolean;
    discount: {
        name: string;
        type: string;
        value: number;
        capacity: number;
        active: boolean;
        publishWebsite: boolean;
        publishApp: boolean;
    };
    cancellationPolicy: string;
    publishWebsite: boolean;
    publishApp: boolean;
    active: boolean;
    images: string[];
}

// Get all rooms
export const getAllRooms = async (): Promise<Room[]> => {
    try {
        const response = await axios.get(`${API_URL}/rooms`);
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
};

// Get room by ID
export const getRoomById = async (id: string): Promise<Room | null> => {
    try {
        const response = await axios.get(`${API_URL}/rooms/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching room with ID ${id}:`, error);
        return null;
    }
}; 
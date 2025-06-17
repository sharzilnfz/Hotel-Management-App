import axios from 'axios';

// Define API base URL with hardcoded value
const API_URL = 'http://localhost:4000/api';

// Restaurant Table interface
export interface RestaurantSection {
    _id: string;
    number: number;
    capacity: number;
    status: string;
    reservationTime: string | null;
    customerName: string | null;
    name?: string; // Added for UI display purposes
}

// Get all restaurant tables
export const getAllRestaurantSections = async (): Promise<RestaurantSection[]> => {
    try {
        const response = await axios.get(`${API_URL}/restaurant/tables`);
        if (response.data.success) {
            return response.data.data.map((table: any) => ({
                ...table,
                name: `Table ${table.number} (${table.capacity} seats)`
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching restaurant tables:', error);
        // Using static data as fallback for now
        return [
            { _id: "1", number: 1, capacity: 4, status: "available", reservationTime: null, customerName: null, name: "Table 1 (4 seats)" },
            { _id: "2", number: 2, capacity: 2, status: "available", reservationTime: null, customerName: null, name: "Table 2 (2 seats)" },
            { _id: "3", number: 3, capacity: 6, status: "available", reservationTime: null, customerName: null, name: "Table 3 (6 seats)" },
            { _id: "4", number: 4, capacity: 8, status: "available", reservationTime: null, customerName: null, name: "Table 4 (8 seats)" },
            { _id: "5", number: 5, capacity: 4, status: "available", reservationTime: null, customerName: null, name: "Table 5 (4 seats)" }
        ];
    }
}; 
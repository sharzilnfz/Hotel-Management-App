import api from './api';

/**
 * Service for handling all Room related API calls
 */
const roomService = {
    /**
     * Get all rooms
     * @param {Object} params - Optional query parameters (filters, etc.)
     * @returns {Promise} Promise with room data
     */
    getAllRooms: async (params = {}) => {
        try {
            const response = await api.get('/rooms', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching rooms:', error);
            throw error;
        }
    },

    /**
     * Get room by ID
     * @param {string} id - Room ID
     * @returns {Promise} Promise with room data
     */
    getRoomById: async (id) => {
        try {
            const response = await api.get(`/rooms/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching room with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get rooms by category
     * @param {string} category - Room category
     * @returns {Promise} Promise with filtered room data
     */
    getRoomsByCategory: async (category) => {
        try {
            const response = await api.get('/rooms', {
                params: { category }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching rooms with category ${category}:`, error);
            throw error;
        }
    },

    /**
     * Get active rooms (rooms that are available for booking)
     * @returns {Promise} Promise with active room data
     */
    getActiveRooms: async () => {
        try {
            // Assuming the API supports filtering by active status
            const response = await api.get('/rooms', {
                params: { active: true }
            });

            // If API doesn't support filtering, filter on client side
            if (!response.data.filtered) {
                const allRooms = response.data.data;
                return {
                    ...response.data,
                    data: allRooms.filter(room => room.active)
                };
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching active rooms:', error);
            throw error;
        }
    },

    /**
     * Search rooms by various criteria
     * @param {Object} searchParams - Search parameters (name, price range, capacity, etc.)
     * @returns {Promise} Promise with search results
     */
    searchRooms: async (searchParams) => {
        try {
            const response = await api.get('/rooms', {
                params: searchParams
            });
            return response.data;
        } catch (error) {
            console.error('Error searching rooms:', error);
            throw error;
        }
    },

    /**
     * Check room availability for given dates
     * @param {string} roomId - Room ID
     * @param {Date} checkIn - Check-in date
     * @param {Date} checkOut - Check-out date
     * @returns {Promise} Promise with availability data
     */
    checkRoomAvailability: async (roomId, checkIn, checkOut) => {
        try {
            const response = await api.get(`/rooms/${roomId}/availability`, {
                params: {
                    checkIn: checkIn.toISOString(),
                    checkOut: checkOut.toISOString()
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error checking room availability:', error);
            throw error;
        }
    }
};

export default roomService; 
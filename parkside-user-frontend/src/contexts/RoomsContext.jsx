import { createContext, useState, useEffect, useCallback } from 'react';
import roomService from '../services/roomService';

export const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
    // State for all rooms data
    const [rooms, setRooms] = useState([]);
    const [featuredRooms, setFeaturedRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomCategories, setRoomCategories] = useState([]);
    const [initialized, setInitialized] = useState(false);

    // Fetch all rooms
    const fetchRooms = useCallback(async (force = false) => {
        if (!force && initialized && rooms.length > 0) {
            console.log('Rooms already loaded, skipping fetch');
            return; // Avoid refetching if already loaded
        }

        console.log('Fetching rooms from API...');
        setLoading(true);
        setError(null);
        try {
            const response = await roomService.getAllRooms();
            if (response.success) {
                const allRooms = response.data;
                setRooms(allRooms);

                console.log('All rooms from API:', allRooms);

                // Extract unique categories for filtering
                const categories = [...new Set(allRooms.map(room => room.category))];
                setRoomCategories(categories);

                // Set featured rooms - be less restrictive with filtering
                const featured = allRooms
                    .filter(room => {
                        console.log(`Room ${room.name}: active=${room.active}, images=${room.images ? room.images.length : 'none'}`);
                        // More lenient filtering - just check if room has at least some data
                        return room.active !== false && room.images && room.images.length > 0;
                    })
                    .slice(0, 6); // Only take first 6 for featured section
                
                console.log('Featured rooms after filtering:', featured);
                setFeaturedRooms(featured);
                setInitialized(true);
            } else {
                throw new Error(response.message || 'Failed to fetch rooms');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch rooms');
            console.error('Error in fetchRooms:', err);
        } finally {
            setLoading(false);
        }
    }, [initialized, rooms.length]);

    // Fetch room by ID
    const fetchRoomById = useCallback(async (id) => {
        try {
            const response = await roomService.getRoomById(id);
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || `Failed to fetch room with id ${id}`);
            }
        } catch (err) {
            console.error(`Error fetching room ${id}:`, err);
            throw err;
        }
    }, []);

    // Fetch rooms by category
    const fetchRoomsByCategory = useCallback(async (category) => {
        try {
            const response = await roomService.getRoomsByCategory(category);
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || `Failed to fetch rooms in category ${category}`);
            }
        } catch (err) {
            console.error(`Error fetching rooms in category ${category}:`, err);
            throw err;
        }
    }, []);

    // Search rooms
    const searchRooms = useCallback(async (searchParams) => {
        try {
            const response = await roomService.searchRooms(searchParams);
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || 'Search failed');
            }
        } catch (err) {
            console.error('Search error:', err);
            throw err;
        }
    }, []);

    // Initial fetch on component mount
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // Format price with currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    // Get room image URL
    const getRoomImageUrl = (room) => {
        if (!room || !room.images || room.images.length === 0) {
            return '/placeholder-room.jpg'; // Default placeholder
        }

        const imagePath = room.images[0];

        // Check if the image is already a full URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // Otherwise, construct the URL to the backend
        return `http://localhost:4000/uploads/rooms/${imagePath}`;
    };

    // Context value
    const value = {
        rooms,
        featuredRooms,
        loading,
        error,
        roomCategories,
        initialized,
        fetchRooms,
        fetchRoomById,
        fetchRoomsByCategory,
        searchRooms,
        formatPrice,
        getRoomImageUrl
    };

    return (
        <RoomsContext.Provider value={value}>
            {children}
        </RoomsContext.Provider>
    );
};

export default RoomsProvider; 
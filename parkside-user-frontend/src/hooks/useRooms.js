import { useContext } from 'react';
import { RoomsContext } from '../contexts/RoomsContext';

/**
 * Custom hook to access the Rooms context
 * @returns {Object} Rooms context with all data and methods
 */
const useRooms = () => {
    const context = useContext(RoomsContext);

    if (!context) {
        throw new Error('useRooms must be used within a RoomsProvider');
    }

    return context;
};

export default useRooms; 
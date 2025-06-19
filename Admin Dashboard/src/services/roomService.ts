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

// Add create room data interface
export interface CreateRoomData {
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
  refundPolicy?: string;
  breakfastIncluded: boolean;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  extras: Array<{ name: string; price: number }>;
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

// Create a new room
export const createRoom = async (
  roomData: CreateRoomData,
  images?: File[]
): Promise<Room> => {
  try {
    const formData = new FormData();

    // Append room data
    Object.entries(roomData).forEach(([key, value]) => {
      if (key === 'amenities' || key === 'extras' || key === 'discount') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });

    // Append images
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    console.log('Sending room data to backend:', formData);

    const response = await axios.post(`${API_URL}/rooms`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to create room - invalid response format');
    }
  } catch (error) {
    console.error('Error creating room:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           `Server error: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something else happened
        throw new Error(`Request failed: ${error.message}`);
      }
    } else {
      // Non-axios error
      throw new Error(error.message || 'Failed to create room');
    }
  }
};

// Update room
export const updateRoom = async (
  id: string,
  roomData: Partial<CreateRoomData>,
  images?: File[],
  existingImages?: string[]
): Promise<Room> => {
  try {
    const formData = new FormData();

    // Append room data
    Object.entries(roomData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'amenities' || key === 'extras' || key === 'discount') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append existing images to keep
    if (existingImages) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    // Append new images
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await axios.put(`${API_URL}/rooms/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update room');
    }
  } catch (error) {
    console.error('Error updating room:', error);
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to update room'
    );
  }
};

// Delete room
export const deleteRoom = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${API_URL}/rooms/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete room');
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to delete room'
    );
  }
};

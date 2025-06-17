import { MenuItem } from "@/types/restaurant"; // You'll need to create this type

const API_URL = import.meta.env.VITE_API_URL;
const MENU_ITEMS_ENDPOINT = `${API_URL}/api/restaurant/menu-items`;

// Get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
    try {
        const response = await fetch(MENU_ITEMS_ENDPOINT);

        if (!response.ok) {
            throw new Error('Failed to fetch menu items');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
    }
};

// Get menu item by ID
export const getMenuItemById = async (id: string): Promise<MenuItem> => {
    try {
        const response = await fetch(`${MENU_ITEMS_ENDPOINT}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch menu item');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching menu item:', error);
        throw error;
    }
};

// Create a new menu item
export const createMenuItem = async (formData: FormData): Promise<MenuItem> => {
    try {
        const response = await fetch(MENU_ITEMS_ENDPOINT, {
            method: 'POST',
            body: formData,
            // No need to set Content-Type as it's automatically set with FormData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create menu item');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error creating menu item:', error);
        throw error;
    }
};

// Update a menu item
export const updateMenuItem = async (id: string, formData: FormData): Promise<MenuItem> => {
    try {
        const response = await fetch(`${MENU_ITEMS_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update menu item');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error updating menu item:', error);
        throw error;
    }
};

// Delete a menu item
export const deleteMenuItem = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${MENU_ITEMS_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete menu item');
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
        throw error;
    }
}; 
import { StaffMember } from "@/types/staff"; // You'll need to create this type

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const STAFF_ENDPOINT = `${API_URL}/api/staff`;

// Get all staff members
export const getAllStaff = async (): Promise<StaffMember[]> => {
    try {
        const response = await fetch(STAFF_ENDPOINT);

        if (!response.ok) {
            throw new Error("Failed to fetch staff members");
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Check the response structure and return the array properly
        if (data.data && Array.isArray(data.data)) {
            return data.data;
        } else if (Array.isArray(data)) {
            return data;
        } else {
            console.error("Unexpected API response format:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching staff members:", error);
        throw error;
    }
};

// Get staff member by ID
export const getStaffById = async (id: string): Promise<StaffMember> => {
    try {
        const response = await fetch(`${STAFF_ENDPOINT}/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch staff member");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching staff member:", error);
        throw error;
    }
};

// Create a new staff member
export const createStaffMember = async (formData: FormData): Promise<StaffMember> => {
    try {
        const response = await fetch(STAFF_ENDPOINT, {
            method: "POST",
            body: formData,
            // No need to set Content-Type as it's automatically set with FormData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create staff member");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error creating staff member:", error);
        throw error;
    }
};

// Update a staff member
export const updateStaffMember = async (id: string, formData: FormData): Promise<StaffMember> => {
    try {
        const response = await fetch(`${STAFF_ENDPOINT}/${id}`, {
            method: "PATCH",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update staff member");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error updating staff member:", error);
        throw error;
    }
};

// Delete a staff member
export const deleteStaffMember = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${STAFF_ENDPOINT}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete staff member");
        }
    } catch (error) {
        console.error("Error deleting staff member:", error);
        throw error;
    }
}; 
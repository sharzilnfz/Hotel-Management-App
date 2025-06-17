import { User } from "@/types/user"; // We'll create this type next

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const USERS_ENDPOINT = `${API_URL}/api/users`;

// Get all guest users
export const getAllGuests = async (): Promise<User[]> => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/guests`);

        if (!response.ok) {
            throw new Error("Failed to fetch guest users");
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching guest users:", error);
        throw error;
    }
};

// Get all staff users
export const getAllStaffUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/staff`);

        if (!response.ok) {
            throw new Error("Failed to fetch staff users");
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching staff users:", error);
        throw error;
    }
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await fetch(USERS_ENDPOINT);

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Get user by ID
export const getUserById = async (id: string): Promise<User> => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

// Create a new user
export const createUser = async (userData: Partial<User>): Promise<User> => {
    try {
        const response = await fetch(USERS_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create user");
        }

        const data = await response.json();
        return data.data || data.user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Update a user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update user");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete user");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

// Update user status
export const updateUserStatus = async (id: string, status: "Active" | "Inactive"): Promise<User> => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update user status");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error updating user status:", error);
        throw error;
    }
};

// Update loyalty points
export const updateLoyaltyPoints = async (id: string, points: number): Promise<User> => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${id}/loyalty`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ points }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update loyalty points");
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error updating loyalty points:", error);
        throw error;
    }
};

// Login user
export const loginUser = async (userName: string, password: string) => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Login failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// Signup user
export const signupUser = async (userData: {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    isStaff?: boolean;
    department?: string;
}) => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Signup failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
}; 
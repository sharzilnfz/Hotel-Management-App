import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/loyalty';

// Types
export interface LoyaltyTier {
    _id: string;
    name: string;
    pointsRequired: number;
    benefits: string[];
    color: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoyaltyReward {
    _id: string;
    name: string;
    pointsCost: number;
    description: string;
    category: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoyaltySettings {
    _id: string;
    pointsExpiration: number;
    pointsPerDollar: number;
    welcomeBonus: number;
    birthdayBonus: number;
    promoCodesApplicable: boolean;
    discountAvailable: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Tiers API
export const getAllTiers = async (): Promise<LoyaltyTier[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tiers`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch tiers');
    } catch (error) {
        console.error('Error fetching loyalty tiers:', error);
        throw error;
    }
};

export const getTierById = async (id: string): Promise<LoyaltyTier> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tiers/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch tier');
    } catch (error) {
        console.error('Error fetching loyalty tier:', error);
        throw error;
    }
};

export const createTier = async (tier: Omit<LoyaltyTier, '_id'>): Promise<LoyaltyTier> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/tiers`, tier);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create tier');
    } catch (error) {
        console.error('Error creating loyalty tier:', error);
        throw error;
    }
};

export const updateTier = async (id: string, tier: Partial<LoyaltyTier>): Promise<LoyaltyTier> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/tiers/${id}`, tier);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update tier');
    } catch (error) {
        console.error('Error updating loyalty tier:', error);
        throw error;
    }
};

export const deleteTier = async (id: string): Promise<void> => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/tiers/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete tier');
        }
    } catch (error) {
        console.error('Error deleting loyalty tier:', error);
        throw error;
    }
};

// Rewards API
export const getAllRewards = async (filters?: { category?: string; status?: string; search?: string }): Promise<LoyaltyReward[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (filters?.category) queryParams.append('category', filters.category);
        if (filters?.status) queryParams.append('status', filters.status);
        if (filters?.search) queryParams.append('search', filters.search);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await axios.get(`${API_BASE_URL}/rewards${queryString}`);

        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch rewards');
    } catch (error) {
        console.error('Error fetching loyalty rewards:', error);
        throw error;
    }
};

export const getRewardById = async (id: string): Promise<LoyaltyReward> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rewards/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch reward');
    } catch (error) {
        console.error('Error fetching loyalty reward:', error);
        throw error;
    }
};

export const createReward = async (reward: Omit<LoyaltyReward, '_id'>): Promise<LoyaltyReward> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/rewards`, reward);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create reward');
    } catch (error) {
        console.error('Error creating loyalty reward:', error);
        throw error;
    }
};

export const updateReward = async (id: string, reward: Partial<LoyaltyReward>): Promise<LoyaltyReward> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/rewards/${id}`, reward);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update reward');
    } catch (error) {
        console.error('Error updating loyalty reward:', error);
        throw error;
    }
};

export const deleteReward = async (id: string): Promise<void> => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/rewards/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete reward');
        }
    } catch (error) {
        console.error('Error deleting loyalty reward:', error);
        throw error;
    }
};

// Settings API
export const getSettings = async (): Promise<LoyaltySettings> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/settings`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch settings');
    } catch (error) {
        console.error('Error fetching loyalty settings:', error);
        throw error;
    }
};

export const updateSettings = async (settings: Partial<LoyaltySettings>): Promise<LoyaltySettings> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/settings`, settings);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to update settings');
    } catch (error) {
        console.error('Error updating loyalty settings:', error);
        throw error;
    }
}; 
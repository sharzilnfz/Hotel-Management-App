import axios from 'axios';

// Define API base URL with hardcoded value
const API_URL = 'http://localhost:4000/api';

// Spa Service interface (simplified)
export interface SpaService {
    _id: string;
    title: string;
    description: string;
    categoryId: string;
    status: string;
    displayStatus: string;
    specialist: string;
    specialistId: string;
    availability: string;
    durations: { duration: string; price: number; }[];
    addons?: { name: string; price: number; selected: boolean; }[];
    isRefundable: boolean;
    isPopular: boolean;
    images: string[];
    capacity?: number; // Added for availability purposes
    name?: string; // Added for backwards compatibility with UI
}

// Spa Specialist interface (simplified)
export interface SpaSpecialist {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    status: string;
    languages: string;
    specializations?: { id: number; name: string; }[];
    photo: string;
    experienceYears: string;
    nationality: string;
    capacity?: number; // Added for availability purposes
    role?: string; // Added for backwards compatibility with UI
    name?: string; // Added for backwards compatibility with UI
}

// Get all spa services
export const getAllSpaServices = async (): Promise<SpaService[]> => {
    try {
        const response = await axios.get(`${API_URL}/spa/services`);
        if (response.data.success) {
            // Transform the data to include name and capacity for UI
            return response.data.data.map((service: SpaService) => ({
                ...service,
                name: service.title,
                // Estimate capacity based on service type - replace with actual calculation if needed
                capacity: 5
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching spa services:', error);
        // Using static data as fallback for now
        return [
            { _id: "1", title: "Swedish Massage", name: "Swedish Massage", description: "Relaxing massage", specialist: "Emily Wilson", specialistId: "1", status: "active", displayStatus: "available", categoryId: "1", availability: "Daily", durations: [{ duration: "60 min", price: 80 }], isRefundable: true, isPopular: true, images: [], capacity: 5 },
            { _id: "2", title: "Deep Tissue Massage", name: "Deep Tissue Massage", description: "Therapeutic massage", specialist: "Michael Chen", specialistId: "2", status: "active", displayStatus: "available", categoryId: "1", availability: "Daily", durations: [{ duration: "60 min", price: 90 }], isRefundable: true, isPopular: false, images: [], capacity: 3 },
            { _id: "3", title: "Hot Stone Therapy", name: "Hot Stone Therapy", description: "Therapeutic massage with hot stones", specialist: "Sophia Rodriguez", specialistId: "3", status: "active", displayStatus: "available", categoryId: "1", availability: "Mon-Fri", durations: [{ duration: "90 min", price: 110 }], isRefundable: true, isPopular: true, images: [], capacity: 2 },
            { _id: "4", title: "Facial Treatment", name: "Facial Treatment", description: "Facial cleaning and massage", specialist: "Olivia Johnson", specialistId: "4", status: "active", displayStatus: "available", categoryId: "2", availability: "Daily", durations: [{ duration: "45 min", price: 65 }], isRefundable: true, isPopular: false, images: [], capacity: 4 },
            { _id: "5", title: "Body Scrub", name: "Body Scrub", description: "Full body exfoliation", specialist: "Thomas Martin", specialistId: "5", status: "active", displayStatus: "available", categoryId: "3", availability: "Weekends", durations: [{ duration: "50 min", price: 75 }], isRefundable: true, isPopular: true, images: [], capacity: 3 }
        ];
    }
};

// Get all spa specialists
export const getAllSpaSpecialists = async (): Promise<SpaSpecialist[]> => {
    try {
        const response = await axios.get(`${API_URL}/specialists`);
        if (response.data.success) {
            // Transform the data to include name, role and capacity for UI
            return response.data.data.map((specialist: SpaSpecialist) => ({
                ...specialist,
                name: `${specialist.firstName} ${specialist.lastName}`,
                role: specialist.specializations?.length ? specialist.specializations[0].name : "Therapist",
                // Estimate capacity based on specialist - replace with actual calculation if needed
                capacity: 8
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching spa specialists:', error);
        // Using static data as fallback for now
        return [
            { _id: "1", firstName: "Emily", lastName: "Wilson", name: "Emily Wilson", role: "Senior Massage Therapist", bio: "Experienced therapist with over 10 years of practice", email: "emily@example.com", phone: "123-456-7890", status: "active", languages: "English, Spanish", nationality: "USA", experienceYears: "10", photo: "", capacity: 8 },
            { _id: "2", firstName: "Michael", lastName: "Chen", name: "Michael Chen", role: "Massage Therapist", bio: "Specialized in traditional Chinese massage techniques", email: "michael@example.com", phone: "123-456-7891", status: "active", languages: "English, Chinese", nationality: "China", experienceYears: "8", photo: "", capacity: 8 },
            { _id: "3", firstName: "Sophia", lastName: "Rodriguez", name: "Sophia Rodriguez", role: "Wellness Specialist", bio: "Holistic wellness expert focusing on mind-body balance", email: "sophia@example.com", phone: "123-456-7892", status: "active", languages: "English, Spanish", nationality: "Mexico", experienceYears: "6", photo: "", capacity: 6 },
            { _id: "4", firstName: "Olivia", lastName: "Johnson", name: "Olivia Johnson", role: "Esthetician", bio: "Certified esthetician specialized in facial treatments", email: "olivia@example.com", phone: "123-456-7893", status: "active", languages: "English", nationality: "Canada", experienceYears: "7", photo: "", capacity: 7 },
            { _id: "5", firstName: "Thomas", lastName: "Martin", name: "Thomas Martin", role: "Body Treatment Specialist", bio: "Expert in exfoliation and body wraps", email: "thomas@example.com", phone: "123-456-7894", status: "active", languages: "English, French", nationality: "France", experienceYears: "5", photo: "", capacity: 5 }
        ];
    }
}; 
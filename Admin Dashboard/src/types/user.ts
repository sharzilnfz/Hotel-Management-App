export interface User {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    phone: string;
    status: "Active" | "Inactive";
    role: "Guest" | "VIP Guest" | "Administrator" | "Manager" | "Front Desk";
    department?: string;
    registeredDate: Date | string;
    lastVisit?: Date | string | null;
    lastLogin?: Date | string | null;
    loyaltyPoints: number;
    isStaff: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
} 
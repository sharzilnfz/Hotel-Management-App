export interface StaffMember {
    _id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    accessLevel: string;
    startDate: string;
    emergencyContact?: string;
    address?: string;
    photo: string;
    active?: boolean;
    createdAt: string;
    updatedAt: string;
    employmentLength?: string;
} 
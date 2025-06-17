export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    category: 'breakfast' | 'lunch' | 'dinner' | 'dessert';
    price: number;
    preparationTime: number;
    ingredients: string;
    available: boolean;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface MenuItemFormData {
    name: string;
    description: string;
    category: string;
    price: number;
    preparationTime: number;
    ingredients: string;
    available: boolean;
} 
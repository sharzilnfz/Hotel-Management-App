import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Plus } from "lucide-react";

// Define MenuItem interface
interface MenuItem {
    _id: string;
    name: string;
    category: string;
    price: number;
    preparationTime: number;
    available: boolean;
    images: string[];
    createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const MENU_ITEMS_ENDPOINT = `${API_URL}/api/restaurant/menu-items`;

const MenuItemList = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // Fetch menu items
    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(MENU_ITEMS_ENDPOINT);
            setMenuItems(response.data.data);
        } catch (error) {
            console.error("Error fetching menu items:", error);
            toast.error("Failed to load menu items");
        } finally {
            setLoading(false);
        }
    };

    // Delete menu item
    const deleteMenuItem = async (id: string) => {
        try {
            await axios.delete(`${MENU_ITEMS_ENDPOINT}/${id}`);
            toast.success("Menu item deleted successfully");
            fetchMenuItems(); // Refresh the list
        } catch (error) {
            console.error("Error deleting menu item:", error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Failed to delete menu item");
            } else {
                toast.error("An error occurred while deleting the menu item");
            }
        }
    };

    // Format category for display
    const formatCategory = (category: string) => {
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Menu Items</h2>
                <Button onClick={() => navigate("/admin/restaurant/add-menu-item")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Restaurant Menu</CardTitle>
                    <CardDescription>
                        Manage your restaurant's menu items
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">Loading menu items...</div>
                    ) : menuItems.length === 0 ? (
                        <div className="text-center py-4">No menu items found. Add your first menu item!</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Prep Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {menuItems.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            {item.images.length > 0 ? (
                                                <img
                                                    src={`${API_URL}${item.images[0]}`}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                    No img
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{formatCategory(item.category)}</TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                        <TableCell>{item.preparationTime} mins</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={item.available ? "default" : "outline"}
                                                className={item.available ? "bg-green-500" : ""}
                                            >
                                                {item.available ? "Available" : "Unavailable"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => navigate(`/admin/restaurant/edit-menu-item/${item._id}`)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-red-500"
                                                            onClick={() => setItemToDelete(item._id)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the menu item.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-500 hover:bg-red-600"
                                                                onClick={() => {
                                                                    if (itemToDelete) {
                                                                        deleteMenuItem(itemToDelete);
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MenuItemList; 
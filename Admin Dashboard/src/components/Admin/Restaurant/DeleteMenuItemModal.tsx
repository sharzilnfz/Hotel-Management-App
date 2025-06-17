import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteMenuItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuItemId: string | null;
    menuItemName: string;
    onSuccess: () => void;
}

const MENU_ITEMS_ENDPOINT = "http://localhost:4000/api/restaurant/menu-items";

const DeleteMenuItemModal: React.FC<DeleteMenuItemModalProps> = ({
    isOpen,
    onClose,
    menuItemId,
    menuItemName,
    onSuccess,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!menuItemId) {
            onClose();
            return;
        }

        try {
            setIsDeleting(true);
            await axios.delete(`${MENU_ITEMS_ENDPOINT}/${menuItemId}`);

            toast.success("Menu item deleted successfully");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error deleting menu item:", error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Failed to delete menu item");
            } else {
                toast.error("An error occurred while deleting the menu item");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to delete <strong>{menuItemName}</strong>. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteMenuItemModal; 
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
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

interface DeleteStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    staffId: string;
    staffName: string;
    onSuccess: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const STAFF_ENDPOINT = `${API_URL}/api/staff`;

const DeleteStaffModal = ({
    isOpen,
    onClose,
    staffId,
    staffName,
    onSuccess,
}: DeleteStaffModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            console.log("Deleting staff with ID:", staffId);
            console.log("Delete endpoint:", `${API_URL}/api/staff/${staffId}`);

            // Using direct axios call instead of the instance
            const response = await axios({
                method: 'DELETE',
                url: `${API_URL}/api/staff/${staffId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Delete response:", response.data);

            toast.success("Staff member deleted successfully");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error deleting staff:", error);

            // Detailed axios error logging
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                const responseData = error.response?.data;

                console.error(`Status code: ${statusCode}`);
                console.error("Response data:", responseData);

                const errorMessage = responseData?.message ||
                    error.message ||
                    "Failed to delete staff member";

                toast.error(errorMessage);
            } else {
                toast.error("Failed to delete staff member");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete{" "}
                        <span className="font-semibold">{staffName}</span> from the staff
                        database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteStaffModal; 
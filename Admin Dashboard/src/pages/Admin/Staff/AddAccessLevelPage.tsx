import AddAccessLevelContent from "@/components/Admin/Staff/AddAccessLevelContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const AddAccessLevelPage = () => {
    return (
        <AuthGuard requiredDepartments={["Management", "Human Resources"]}>
            <div className="container mx-auto">
                <AddAccessLevelContent />
            </div>
        </AuthGuard>
    );
};

export default AddAccessLevelPage; 
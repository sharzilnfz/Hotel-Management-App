import AddRoleContent from "@/components/Admin/Staff/AddRoleContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const AddRolePage = () => {
    return (
        <AuthGuard requiredDepartments={["Management", "Human Resources"]}>
            <div className="container mx-auto">
                <AddRoleContent />
            </div>
        </AuthGuard>
    );
};

export default AddRolePage; 
import AddDepartmentContent from "@/components/Admin/Staff/AddDepartmentContent";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const AddDepartmentPage = () => {
    return (
        <AuthGuard requiredDepartments={["Management", "Human Resources"]}>
            <div className="container mx-auto">
                <AddDepartmentContent />
            </div>
        </AuthGuard>
    );
};

export default AddDepartmentPage; 
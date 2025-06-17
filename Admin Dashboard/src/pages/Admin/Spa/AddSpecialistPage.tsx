
import AddSpecialistForm from "@/components/Admin/Spa/AddSpecialistForm";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const AddSpecialistPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Spa & Wellness", "Human Resources"]}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Spa Specialist</h1>
        <AddSpecialistForm />
      </div>
    </AuthGuard>
  );
};

export default AddSpecialistPage;

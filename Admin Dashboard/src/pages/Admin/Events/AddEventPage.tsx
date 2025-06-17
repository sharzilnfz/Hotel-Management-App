
import AddEventForm from "@/components/Admin/Events/AddEventForm";
import AuthGuard from "@/components/Admin/Auth/AuthGuard";

const AddEventPage = () => {
  return (
    <AuthGuard requiredDepartments={["Management", "Events"]}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Event</h1>
        <AddEventForm />
      </div>
    </AuthGuard>
  );
};

export default AddEventPage;

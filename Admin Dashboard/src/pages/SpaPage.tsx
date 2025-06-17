
import SpaServicesList from "@/components/Spa/SpaServicesList";

const SpaPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Spa Services</h1>
      <SpaServicesList />
    </div>
  );
};

export default SpaPage;

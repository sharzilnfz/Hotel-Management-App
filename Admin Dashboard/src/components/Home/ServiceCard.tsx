
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
}

const ServiceCard = ({ icon, title, description, path, color }: ServiceCardProps) => {
  return (
    <Link
      to={path}
      className="flex flex-col items-center p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
    >
      <div className={`${color} p-3 rounded-full mb-3`}>
        <div className="text-hotel-primary">{icon}</div>
      </div>
      <h3 className="text-base font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-xs text-gray-600 text-center">{description}</p>
    </Link>
  );
};

export default ServiceCard;

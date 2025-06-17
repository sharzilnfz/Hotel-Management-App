
import { Link } from "react-router-dom";

interface FeaturedCardProps {
  title: string;
  description: string;
  imageUrl: string;
  type: string;
}

const FeaturedCard = ({ title, description, imageUrl, type }: FeaturedCardProps) => {
  const getLink = () => {
    switch (type) {
      case "room":
        return "/rooms";
      case "dining":
        return "/restaurant";
      case "event":
        return "/events";
      case "spa":
        return "/spa";
      default:
        return "/";
    }
  };

  return (
    <Link
      to={getLink()}
      className="flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-md bg-white animate-fade-in"
    >
      <div
        className="h-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default FeaturedCard;

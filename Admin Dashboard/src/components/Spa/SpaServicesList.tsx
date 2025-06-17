
import SpaServiceCard from "./SpaServiceCard";

const SpaServicesList = () => {
  // In a real app, this would be fetched from an API
  const spaServices = [
    {
      id: "s1",
      name: "Classic Massage",
      description: "A traditional full-body massage designed to relax muscles and improve circulation.",
      duration: 60,
      price: 120,
      imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "s2",
      name: "Hot Stone Therapy",
      description: "Heated stones are placed on specific parts of your body to enhance relaxation and release tension.",
      duration: 90,
      price: 180,
      imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "s3",
      name: "Aromatherapy Facial",
      description: "A rejuvenating facial treatment using essential oils to cleanse, exfoliate, and hydrate your skin.",
      duration: 45,
      price: 95,
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "s4",
      name: "Deluxe Spa Package",
      description: "A complete spa experience including massage, facial, and body scrub for ultimate relaxation.",
      duration: 120,
      price: 250,
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {spaServices.map(service => (
        <SpaServiceCard
          key={service.id}
          id={service.id}
          name={service.name}
          description={service.description}
          duration={service.duration}
          price={service.price}
          imageUrl={service.imageUrl}
        />
      ))}
    </div>
  );
};

export default SpaServicesList;

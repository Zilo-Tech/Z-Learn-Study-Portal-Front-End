import { FeatureCard } from "./feature-card";

export const FeaturesSection = () => {
  const features = [
    {
      image: "/images/features/personalized-learning.jpg",
      title: "Personalized Learning Paths",
      description: "Our AI algorithms analyze your learning style and recommend courses that match your goals."
    },
    {
      image: "/images/features/expert-instructors.jpg",
      title: "Expert Instructors",
      description: "Learn from industry-leading experts who are passionate about teaching."
    },
    {
      image: "/images/features/verified-certificates.jpg",
      title: "Verified Certificates",
      description: "Earn verified certificates upon completion of courses to showcase your skills."
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Choose Z-Learn?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the future of learning with our innovative platform.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard  
            key={index}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { 
  FileSearch, 
  CheckCircle, 
  Zap,
  Clock,
  BarChart3,
  Shield,
  MessageCircle, // Added icon for chat feature
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features = () => {
  const features = [
    {
      icon: <FileSearch className="w-full h-full" />,
      title: "Smart Movie Discovery",
      description: "Discover movies that match your mood, interests, and preferences."
    },
    {
      icon: <CheckCircle className="w-full h-full" />,
      title: "Personalized Recommendations",
      description: "Get movie recommendations tailored just for you."
    },
    {
      icon: <Zap className="w-full h-full" />,
      title: "Quick Movie Search",
      description: "Find your favorite movies in seconds using powerful search and filter options."
    },
    {
      icon: <Clock className="w-full h-full" />,
      title: "Time-Saving Filters",
      description: "Save time by filtering movies based on genre, release year, rating, and more."
    },
    {
      icon: <BarChart3 className="w-full h-full" />,
      title: "Movie Insights",
      description: "Access detailed analytics on movies like box office, user rating and trends."
    },
    {
      icon: <MessageCircle className="w-full h-full" />,  // New feature icon
      title: "Movie Chat Agent",
      description: "Chat with our friendly virtual agent for assistance."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enhance Your Movie Experience</h2>
          <p className="text-xl text-gray-700">
            Let MovieMonk guide you to the perfect movie with features designed for an effortless discovery process.
          </p>
        </div>

        {/* Grid container with fixed card height */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col h-full"> {/* Ensure cards stretch to the same height */}
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
                className="animate-slide-up h-full" // Ensure the card stretches to fill height
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

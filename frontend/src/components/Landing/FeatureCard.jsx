import React from 'react';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0,
  className
}) => {
  return (
    <div 
      className={`
        feature-card
        transform transition-all duration-700 ease-in-out
        hover:shadow-md
        ${className}
      `}
    >
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border">
        <div className="feature-icon mb-4 p-3 border-2 border-green-600 text-green-600 rounded-full w-16 h-16">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-md text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;

import React from 'react';

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  ctaText?: string;
}

export const FeatureCard = ({ image, title, description, ctaText = "Learn more" }: FeatureCardProps) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg  border border-gray-200 overflow-hidden  transition-all duration-300">
      {/* Image container with Cisco-style aspect ratio */}
      <div className="relative pt-[56.25%] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Content container */}
      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow">
          {description}
        </p>
        
        {/* Cisco-style CTA */}
        <div className="mt-auto">
          <a 
            href="#"
            className="inline-flex items-center text-brand font-medium group"
            aria-label={`Learn more about ${title}`}
          >
            {ctaText}
            <svg 
              className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
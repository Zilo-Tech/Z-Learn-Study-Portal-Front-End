"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[80vh] overflow-hidden">
      {/* Video background with real educational content */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        >
          {/* Using a real educational/tech video from Pixabay */}
          <source src="https://cdn.pixabay.com/video/2022/12/11/142834-778693311_large.mp4" type="video/mp4" />
          {/* Fallback video from another CDN */}
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1c9a91a6d&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-blue-900/50"></div>
      </div>

      {/* Play/Pause Button - Top Right Corner */}
      <motion.button
        onClick={togglePlay}
        className="absolute top-6 right-6 z-20 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 border border-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isPlaying ? (
          <Pause size={24} className="ml-0.5" />
        ) : (
          <Play size={24} className="ml-0.5" />
        )}
      </motion.button>

      {/* Content */}
      <div className="relative z-10 px-6 py-20 text-center max-w-6xl mx-auto">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform Your Skills with <span className="text-blue-400">AI-Driven</span> Learning
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Z-Learn delivers cutting-edge, personalized education powered by artificial intelligence to accelerate your career growth.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            <motion.button 
              className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Courses
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Video Info Badge */}
        <motion.div
          className="absolute bottom-6 left-6 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-gray-400'}`}></div>
            <span>{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
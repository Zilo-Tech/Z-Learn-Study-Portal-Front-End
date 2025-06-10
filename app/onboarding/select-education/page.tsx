"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const courses = {
  cybershield: {
      title: 'CyberShield',
      description: 'Master cybersecurity fundamentals and protect against digital threats',
      icon: '🛡️',
      levels: [
          {
              id: 'beginner',
              title: 'Beginner',
              description: 'Perfect for those new to cybersecurity. Learn the fundamentals and build a strong foundation.',
              icon: '🔰'
          },
          {
              id: 'intermediate',
              title: 'Intermediate',
              description: 'For those with basic knowledge. Deepen your understanding and practical skills.',
              icon: '⚡'
          },
          {
              id: 'advanced',
              title: 'Advanced',
              description: 'For experienced professionals. Master complex concepts and advanced techniques.',
              icon: '🚀'
          }
      ]
  },
  'ai-mastery': {
      title: 'AI Mastery',
      description: 'Learn artificial intelligence and machine learning from the ground up',
      icon: '🤖',
      levels: [
          {
              id: 'beginner',
              title: 'Beginner',
              description: 'Start your AI journey with fundamental concepts and basic implementations.',
              icon: '🎯'
          },
          {
              id: 'intermediate',
              title: 'Intermediate',
              description: 'Dive deeper into machine learning algorithms and neural networks.',
              icon: '🧠'
          },
          {
              id: 'advanced',
              title: 'Advanced',
              description: 'Master advanced AI concepts and build complex models.',
              icon: '⚡'
          }
      ]
  },
  'cloud-architect': {
      title: 'Cloud Architect',
      description: 'Design and deploy scalable cloud solutions',
      icon: '☁️',
      levels: [
          {
              id: 'beginner',
              title: 'Beginner',
              description: 'Learn cloud fundamentals and basic deployment strategies.',
          },
          {
              id: 'intermediate',
              title: 'Intermediate',
              description: 'Master cloud services and architecture patterns.',
          },
          {
              id: 'advanced',
              title: 'Advanced',
              description: 'Design and implement complex cloud solutions.',
              icon: '🌩️'
          }
      ]
  }
};

export default function EducationLevelPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  

  const educationLevels = [
    { id: 'primary', label: 'Primary Education' },
    { id: 'secondary', label: 'Secondary Education' },
    { id: 'college', label: 'College/University' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-[#0d141c] text-3xl font-bold leading-tight text-center sm:text-4xl mb-8">
          What is your level of Education?
        </h1>
        <p className="text-[#49709c] text-center mb-10 max-w-lg mx-auto">
          Select your current education level to personalize your experience
        </p>

        <RadioGroup 
          value={selectedLevel} 
          onValueChange={setSelectedLevel}
          className="space-y-4 max-w-md mx-auto"
        >
          {educationLevels.map((level) => (
            <motion.div
              key={level.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Label
                htmlFor={level.id}
                className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedLevel === level.id
                    ? 'border-brand bg-brand/5'
                    : 'border-[#cedae8] hover:border-blue-200'
                }`}
              >
                <RadioGroupItem 
                  value={level.id} 
                  id={level.id} 
                  className="h-6 w-6 border-2 border-bg-blue-50 data-[state=checked]:border-brand"
                />
                <span className="text-[#0d141c] font-medium">{level.label}</span>
              </Label>
            </motion.div>
          ))}
        </RadioGroup>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedLevel ? 1 : 0.5 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            disabled={!selectedLevel}
            className={`px-8 py-6 text-lg ${selectedLevel ? 'bg-brand' : 'bg-gray-200'}`}
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
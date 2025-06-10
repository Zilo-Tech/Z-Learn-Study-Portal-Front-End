"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';



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
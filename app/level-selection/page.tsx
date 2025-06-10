'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
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
      { id: 'beginner', title: 'Beginner', description: 'Perfect for those new to cybersecurity.', icon: '🔰' },
      { id: 'intermediate', title: 'Intermediate', description: 'Deepen your understanding.', icon: '⚡' },
      { id: 'advanced', title: 'Advanced', description: 'Master complex techniques.', icon: '🚀' },
    ]
  },
  'ai-mastery': {
    title: 'AI Mastery',
    description: 'Learn artificial intelligence and machine learning from the ground up',
    icon: '🤖',
    levels: [
      { id: 'beginner', title: 'Beginner', description: 'Start your AI journey.', icon: '🎯' },
      { id: 'intermediate', title: 'Intermediate', description: 'Explore neural networks.', icon: '🧠' },
      { id: 'advanced', title: 'Advanced', description: 'Build complex models.', icon: '⚡' },
    ]
  },
  'cloud-architect': {
    title: 'Cloud Architect',
    description: 'Design and deploy scalable cloud solutions',
    icon: '☁️',
    levels: [
      { id: 'beginner', title: 'Beginner', description: 'Learn cloud fundamentals.', icon: '🌤️' },
      { id: 'intermediate', title: 'Intermediate', description: 'Master cloud services.', icon: '⛈️' },
      { id: 'advanced', title: 'Advanced', description: 'Implement complex solutions.', icon: '🌩️' },
    ]
  }
};

function LevelSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    if (!courseId || !courses[courseId as keyof typeof courses]) {
      router.push('/courses');
    }
  }, [courseId, router]);

  if (!courseId || !courses[courseId as keyof typeof courses]) return null;

  const course = courses[courseId as keyof typeof courses];

  const handleContinue = () => {
    if (selectedLevel) {
      router.push(`/assessment/course/${courseId}?level=${selectedLevel}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
          {course.levels.map((level) => (
            <motion.div key={level.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                <span className="text-[#0d141c] font-medium">
                   {level.title}
                </span>
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
            onClick={handleContinue}
            disabled={!selectedLevel}
            className={`px-8 py-6 text-lg hover:bg-brand ${selectedLevel ? 'bg-brand' : 'bg-gray-200'}`}
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LevelSelection() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <LevelSelectionContent />
    </Suspense>
  );
}

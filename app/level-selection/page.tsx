'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

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
                icon: '🌤️'
            },
            {
                id: 'intermediate',
                title: 'Intermediate',
                description: 'Master cloud services and architecture patterns.',
                icon: '⛈️'
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

function LevelSelectionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('course');

    if (!courseId || !courses[courseId as keyof typeof courses]) {
        router.push('/courses');
        return null;
    }

    const course = courses[courseId as keyof typeof courses];

    const handleLevelSelect = (levelId: string) => {
        router.push(`/course/${courseId}?level=${levelId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-6xl mb-6">{course.icon}</div>
                    <h1 className="text-[#0d141c] text-4xl font-bold mb-6">{course.title}</h1>
                    <p className="text-[#49709c] text-xl">{course.description}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {course.levels.map((level) => (
                        <motion.button
                            key={level.id}
                            onClick={() => handleLevelSelect(level.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white rounded-xl shadow-lg p-8 text-left hover:shadow-xl transition-shadow"
                        >
                            <div className="text-4xl mb-4">{level.icon}</div>
                            <h2 className="text-[#0d141c] text-2xl font-semibold mb-2">{level.title}</h2>
                            <p className="text-[#49709c]">{level.description}</p>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function LevelSelection() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#0d141c] mb-4">Loading...</h1>
                </div>
            </div>
        }>
            <LevelSelectionContent />
        </Suspense>
    );
}
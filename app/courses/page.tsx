'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const courses = [
    {
        id: 'cybershield',
        title: 'CyberShield',
        description: 'Master cybersecurity fundamentals and protect against digital threats',
        icon: '🛡️',
        level: 'Beginner to Advanced',
        duration: '8 weeks',
        features: ['Interactive Labs', 'Real-world Projects', 'Industry Certification'],
        color: 'from-blue-500 to-blue-600'
    },
    {
        id: 'ai-mastery',
        title: 'AI Mastery',
        description: 'Learn artificial intelligence and machine learning from the ground up',
        icon: '🤖',
        level: 'Intermediate',
        duration: '12 weeks',
        features: ['Hands-on Projects', 'ML Model Building', 'AI Ethics'],
        color: 'from-purple-500 to-purple-600'
    },
    {
        id: 'cloud-architect',
        title: 'Cloud Architect',
        description: 'Design and deploy scalable cloud solutions',
        icon: '☁️',
        level: 'Advanced',
        duration: '10 weeks',
        features: ['AWS/Azure/GCP', 'Serverless Architecture', 'Cloud Security'],
        color: 'from-green-500 to-green-600'
    }
];

const tips = [
    "💡 Complete daily challenges to earn bonus points",
    "🎯 Set your learning goals to track progress",
    "🏆 Earn badges for completing modules",
    "👥 Join study groups to learn with peers",
    "📱 Access course content on any device"
];

export default function CoursesPage() {
    const router = useRouter();
    const [currentTip, setCurrentTip] = useState(0);

    // Rotate tips every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCourseSelect = (courseId: string) => {
        setTimeout(() => {
            router.push(`/level-selection?course=${courseId}`);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-[#0d141c] text-4xl font-bold mb-6">Explore Our Courses</h1>
                    <p className="text-[#49709c] text-xl max-w-2xl mx-auto">
                        Choose from our expert-led courses and start your learning journey today
                    </p>
                </motion.div>

                {/* Tips Section */}
                <motion.div 
                    className="max-w-2xl mx-auto mb-12 bg-white rounded-xl shadow-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-center justify-center space-x-3">
                        <div className="text-2xl">💡</div>
                        <motion.p 
                            key={currentTip}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-[#49709c] text-lg font-medium"
                        >
                            {tips[currentTip]}
                        </motion.p>
                    </div>
                </motion.div>

                {/* Courses Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative group cursor-pointer`}
                            onClick={() => handleCourseSelect(course.id)}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${course.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            <div className="bg-white rounded-xl shadow-lg p-8 h-full transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                    {course.icon}
                                </div>
                                <h3 className="text-[#0d141c] text-2xl font-bold mb-4">{course.title}</h3>
                                <p className="text-[#49709c] mb-6">{course.description}</p>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-[#49709c]">
                                        <span className="font-medium mr-2">Level:</span>
                                        {course.level}
                                    </div>
                                    <div className="flex items-center text-sm text-[#49709c]">
                                        <span className="font-medium mr-2">Duration:</span>
                                        {course.duration}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {course.features.map((feature, i) => (
                                        <div key={i} className="flex items-center text-sm text-[#49709c]">
                                            <span className="mr-2">✓</span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex items-center text-[#0c77f2] font-medium group-hover:translate-x-2 transition-transform duration-300">
                                    Start Learning
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Community Section */}
                <motion.div 
                    className="mt-16 bg-gradient-to-r from-[#0c77f2] to-blue-600 rounded-xl shadow-lg p-8 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Join Our Learning Community</h2>
                        <p className="text-lg mb-8 opacity-90">
                            Connect with fellow learners, share experiences, and grow together
                        </p>
                        <div className="flex justify-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-[#0c77f2] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                            >
                                Join Community
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                            >
                                Learn More
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
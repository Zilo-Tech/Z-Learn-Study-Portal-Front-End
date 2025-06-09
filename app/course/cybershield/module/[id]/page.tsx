'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

type ModuleContent = {
    title: string;
    content: string;
    assessment: {
        question: string;
        options: { value: string; label: string }[];
        correctAnswer: string;
    }[];
};

const mockModuleContent: ModuleContent = {
    title: "Introduction to Cybersecurity",
    content: `Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.

Implementing effective cybersecurity measures is particularly challenging today because there are more devices than people, and attackers are becoming more innovative.`,
    assessment: [
        {
            question: "What is the main goal of cybersecurity?",
            options: [
                { value: "a", label: "To make systems faster" },
                { value: "b", label: "To protect systems and data from digital attacks" },
                { value: "c", label: "To reduce internet costs" },
                { value: "d", label: "To increase system storage" }
            ],
            correctAnswer: "b"
        },
        {
            question: "Why is implementing cybersecurity challenging today?",
            options: [
                { value: "a", label: "Because systems are too old" },
                { value: "b", label: "Because there are more devices than people and attackers are more innovative" },
                { value: "c", label: "Because internet is too slow" },
                { value: "d", label: "Because systems are too complex" }
            ],
            correctAnswer: "b"
        }
    ]
};

export default function ModulePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const level = searchParams.get('level');
    const [showAssessment, setShowAssessment] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);

    if (!level) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#0d141c] mb-4">Please select a level first</h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/level-selection')}
                        className="bg-[#0c77f2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0c77f2]/90 transition-colors"
                    >
                        Go to Level Selection
                    </motion.button>
                </div>
            </div>
        );
    }

    const handleAnswer = (answer: string) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestion < mockModuleContent.assessment.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        return answers.filter((answer, index) => 
            answer === mockModuleContent.assessment[index].correctAnswer
        ).length;
    };

    if (showResults) {
        const score = calculateScore();
        const passed = score >= mockModuleContent.assessment.length / 2;
        
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <motion.div 
                        className="bg-white rounded-xl shadow-lg p-8 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-6xl mb-6">{passed ? '🎉' : '📚'}</div>
                        <h2 className="text-3xl font-bold text-[#0d141c] mb-6">
                            {passed ? 'Congratulations!' : 'Keep Learning!'}
                        </h2>
                        <p className="text-xl text-[#49709c] mb-8">
                            You scored {score} out of {mockModuleContent.assessment.length}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/course/cybershield')}
                            className="bg-[#0c77f2] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#0c77f2]/90 transition-colors"
                        >
                            {passed ? 'Continue to Next Module' : 'Review Module'}
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (showAssessment) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <motion.div 
                        className="bg-white rounded-xl shadow-lg p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-[#49709c]">
                                    Question {currentQuestion + 1} of {mockModuleContent.assessment.length}
                                </span>
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-[#0c77f2]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentQuestion + 1) / mockModuleContent.assessment.length) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-[#0d141c] text-2xl font-semibold mb-8">
                            {mockModuleContent.assessment[currentQuestion].question}
                        </h2>

                        <div className="space-y-4">
                            {mockModuleContent.assessment[currentQuestion].options.map((option) => (
                                <motion.button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-4 text-left rounded-lg border border-[#cedae8] hover:border-[#0c77f2] hover:bg-[#0c77f2]/5 transition-all duration-300"
                                >
                                    <span className="text-[#0d141c] font-medium">{option.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-[#0d141c] text-4xl font-bold mb-6">{mockModuleContent.title}</h1>
                </motion.div>

                <motion.div 
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="prose prose-lg max-w-none text-[#49709c]">
                        {mockModuleContent.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-6 leading-relaxed">{paragraph}</p>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAssessment(true)}
                        className="bg-[#0c77f2] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#0c77f2]/90 transition-colors"
                    >
                        Take Assessment
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
} 
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';

const assessmentQuestions = [
    {
        question: "What is the primary purpose of a firewall?",
        options: [
            { value: "a", label: "To block all incoming traffic" },
            { value: "b", label: "To monitor and control network traffic based on security rules" },
            { value: "c", label: "To encrypt data transmission" },
            { value: "d", label: "To store backup data" }
        ],
        correctAnswer: "b"
    },
    {
        question: "Which of the following is NOT a common type of cyber attack?",
        options: [
            { value: "a", label: "Phishing" },
            { value: "b", label: "DDoS" },
            { value: "c", label: "SQL Injection" },
            { value: "d", label: "Data Backup" }
        ],
        correctAnswer: "d"
    }
];

function CyberShieldCourseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const level = searchParams.get('level');
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

        if (currentQuestion < assessmentQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        return answers.filter((answer, index) => 
            answer === assessmentQuestions[index].correctAnswer
        ).length;
    };

    if (showResults) {
        const score = calculateScore();
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <motion.div 
                        className="bg-white rounded-xl shadow-lg p-8 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-[#0d141c] mb-6">Assessment Complete!</h2>
                        <p className="text-xl text-[#49709c] mb-8">
                            You scored {score} out of {assessmentQuestions.length}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/course/cybershield/module/1?level=${level}`)}
                            className="bg-[#0c77f2] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#0c77f2]/90 transition-colors"
                        >
                            Start Learning
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-[#0d141c] text-4xl font-bold mb-6">CyberShield Course</h1>
                    <p className="text-[#49709c] text-xl">Let&apos;s assess your current knowledge level</p>
                </motion.div>

                <motion.div 
                    className="bg-white rounded-xl shadow-lg p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-[#49709c]">
                                Question {currentQuestion + 1} of {assessmentQuestions.length}
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[#0c77f2]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-[#0d141c] text-2xl font-semibold mb-8">
                        {assessmentQuestions[currentQuestion].question}
                    </h2>

                    <div className="space-y-4">
                        {assessmentQuestions[currentQuestion].options.map((option) => (
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

export default function CyberShieldCourse() {
    return (
        <Suspense>
            <CyberShieldCourseContent />
        </Suspense>
    );
}
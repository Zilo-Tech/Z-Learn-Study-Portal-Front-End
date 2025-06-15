'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';
import AgentChatBox from '@/components/agent-chat/AgentChatBox';

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
    const [showLesson, setShowLesson] = useState(true);

    // Mock lessons content (multiple lessons)
    const lessons = [
        {
            title: 'Lesson 1: What is Cybersecurity?',
            icon: '🛡️',
            content: `Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.\n\nThese cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.`
        },
        {
            title: 'Lesson 2: Types of Cyber Attacks',
            icon: '💻',
            content: `Common cyber attacks include phishing, malware, ransomware, DDoS attacks, and social engineering.\n\nUnderstanding these threats is the first step in defending against them.`
        },
        {
            title: 'Lesson 3: Best Practices for Protection',
            icon: '🔒',
            content: `Use strong passwords, enable two-factor authentication, keep software updated, and be cautious with emails and links.\n\nRegularly back up important data and educate yourself about new threats.`
        }
    ];
    const [lessonIndex, setLessonIndex] = useState(0);

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

    if (showLesson) {
        const lesson = lessons[lessonIndex];
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-2xl w-full mx-auto">
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-10 text-center border border-[#d6e2eb]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col items-center mb-6">
                            <span className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">Pre-Lesson {lessonIndex + 1}</span>
                            <span className="text-5xl mb-2">{lesson.icon}</span>
                            <h2 className="text-3xl font-bold text-[#003b5c] mb-2">{lesson.title}</h2>
                        </div>
                        <div className="prose prose-lg text-[#49709c] mb-8 text-left mx-auto max-w-xl">
                            {lesson.content.split('\n\n').map((p, i) => (
                                <p key={i} className="mb-4 leading-relaxed">{p}</p>
                            ))}
                        </div>
                        {/* Agent chat */}
                        <div className="bg-gray-50 rounded-lg shadow p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-2">Chat with Z-Learn Agent</h3>
                            <AgentChatBox _mockMode />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                            <button
                                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50"
                                onClick={() => setLessonIndex(i => Math.max(0, i - 1))}
                                disabled={lessonIndex === 0}
                            >
                                Previous
                            </button>
                            {lessonIndex < lessons.length - 1 ? (
                                <button
                                    className="px-8 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90 transition-colors"
                                    onClick={() => setLessonIndex(i => i + 1)}
                                >
                                    Next Lesson
                                </button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowLesson(false)}
                                    className="px-8 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90 transition-colors shadow-md text-lg"
                                >
                                    Start Assessment
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
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
        // Get courseId from the URL (e.g., /assessment/course/[courseId])
        const pathParts = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
        // Find the courseId after 'course'
        const courseIndex = pathParts.findIndex(p => p === 'course');
        const courseId = courseIndex !== -1 && pathParts.length > courseIndex + 1 ? pathParts[courseIndex + 1] : 'cybershield';
        return (
            <div className="min-h-screen mt-10 bg-gradient-to-b from-[#f4f8fb] to-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        className="bg-white border border-[#d6e2eb] rounded-2xl  p-10 text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-semibold text-[#003b5c] mb-6 tracking-tight">
                            Assessment Complete!
                        </h2>
                        <p className="text-lg text-[#4a6c8c] mb-10">
                            You scored <span className="font-bold text-brand">{score}</span> out of <span className="font-bold text-brand">{assessmentQuestions.length}</span>
                        </p>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/courses/${courseId}/modules`)}
                            className="bg-brand hover:bg-brand/90 text-white px-10 py-4 rounded-xl text-lg font-medium "
                        >
                            Go to Modules
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
                    className="bg-white rounded-xl  p-8"
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
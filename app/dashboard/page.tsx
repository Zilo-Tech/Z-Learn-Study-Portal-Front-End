'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const mockLeaderboard = [
  { name: 'Alice', score: 95 },
  { name: 'Bob', score: 90 },
  { name: 'Charlie', score: 85 },
  { name: 'Dave', score: 80 },
  { name: 'Eve', score: 75 },
];
const mockTips = [
  'Take a short break every 25 minutes to stay focused.',
  'Review your notes daily to reinforce learning.',
  'Join study groups to discuss and deepen your understanding.',
  'Set specific goals for each study session.',
  'Use flashcards for quick revision.',
];

const mockProgress = {
  completedCourses: 3,
  inProgressCourses: 2,
  totalHoursLearned: 45,
  certificatesEarned: 2
};

const mockRecommendedCourses = [
  {
    id: 'ai-mastery',
    title: 'AI Mastery',
    description: 'Master the fundamentals of artificial intelligence',
    progress: 0,
    icon: '🤖'
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architecture',
    description: 'Learn cloud computing and architecture',
    progress: 0,
    icon: '☁️'
  }
];

const mockLearningStats = [
  { label: 'Daily Goal', value: '2 hours', progress: 75 },
  { label: 'Weekly Streak', value: '7 days', progress: 100 },
  { label: 'Monthly Progress', value: '85%', progress: 85 }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#0d141c] mb-4">Dashboard</h1>
          <p className="text-[#49709c] text-xl">Track your progress and stay motivated!</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-[#cedae8] p-1">
            {['overview', 'progress', 'achievements'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[#0c77f2] text-white'
                    : 'text-[#49709c] hover:bg-[#0c77f2]/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-[#0d141c] mb-6">Learning Progress</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0c77f2]">{mockProgress.completedCourses}</div>
                  <div className="text-[#49709c] text-sm">Completed Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0c77f2]">{mockProgress.inProgressCourses}</div>
                  <div className="text-[#49709c] text-sm">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0c77f2]">{mockProgress.totalHoursLearned}</div>
                  <div className="text-[#49709c] text-sm">Hours Learned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0c77f2]">{mockProgress.certificatesEarned}</div>
                  <div className="text-[#49709c] text-sm">Certificates</div>
                </div>
              </div>
            </motion.div>

            {/* Recommended Courses */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-[#0d141c] mb-6">Recommended for You</h2>
              <div className="space-y-4">
                {mockRecommendedCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-[#cedae8] hover:border-[#0c77f2] transition-colors"
                  >
                    <div className="text-4xl">{course.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-[#0d141c] font-semibold">{course.title}</h3>
                      <p className="text-[#49709c] text-sm">{course.description}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#0c77f2] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0c77f2]/90 transition-colors"
                    >
                      Start
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Learning Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-[#0d141c] mb-6">Learning Stats</h2>
              <div className="space-y-6">
                {mockLearningStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#49709c]">{stat.label}</span>
                      <span className="text-[#0d141c] font-semibold">{stat.value}</span>
                    </div>
                    <div className="w-full h-2 bg-[#e7edf4] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#0c77f2]"
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-[#0d141c] mb-6">Top Learners</h2>
              <div className="space-y-4">
                {mockLeaderboard.map((user, index) => (
                  <div key={user.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-[#0d141c] font-medium">{index + 1}.</span>
                      <span className="text-[#0d141c]">{user.name}</span>
                    </div>
                    <span className="text-[#0c77f2] font-bold">{user.score}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-[#0d141c] mb-6">Daily Tips</h2>
              <div className="space-y-4">
                {mockTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-[#0c77f2]">💡</span>
                    <p className="text-[#49709c]">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 
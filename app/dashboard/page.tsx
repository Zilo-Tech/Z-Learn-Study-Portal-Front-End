'use client';

import { Logo } from '@/components/ui/logo';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend 
} from 'recharts';

// Mock data for the charts
const timeData = {
  daily: [
    { name: '6AM', progress: 10 },
    { name: '9AM', progress: 30 },
    { name: '12PM', progress: 50 },
    { name: '3PM', progress: 70 },
    { name: '6PM', progress: 90 },
    { name: '9PM', progress: 60 },
    { name: '12AM', progress: 30 }
  ],
  weekly: [
    { name: 'Mon', progress: 40 },
    { name: 'Tue', progress: 60 },
    { name: 'Wed', progress: 80 },
    { name: 'Thu', progress: 90 },
    { name: 'Fri', progress: 75 },
    { name: 'Sat', progress: 50 },
    { name: 'Sun', progress: 30 }
  ],
  monthly: [
    { name: 'Week 1', progress: 30 },
    { name: 'Week 2', progress: 50 },
    { name: 'Week 3', progress: 70 },
    { name: 'Week 4', progress: 90 }
  ]
};

const mockLeaderboard = [
  { rank: 1, name: 'Alice', score: 95, progress: 95 },
  { rank: 2, name: 'Bob', score: 90, progress: 90 },
  { rank: 3, name: 'Charlie', score: 85, progress: 85 },
  { rank: 4, name: 'Dave', score: 80, progress: 80 },
  { rank: 5, name: 'Eve', score: 75, progress: 75 },
];

const mockTips = [
  'Take a short break every 25 minutes to stay focused.',
  'Review your notes daily to reinforce learning.',
  'Join study groups to discuss and deepen your understanding.',
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
    icon: '🧠'
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const {data: session} = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white s transition-all duration-300 fixed h-full`}>
        <div className="logo p-4">
          <Logo />
        </div>
        <div className="p-4 flex items-center justify-between border-b">
  
        </div>
        
        <div className="p-4">
          <div className="flex items-center p-3 mb-4 rounded-lg bg-gray-100">
            <div className="p-2 px-4 truncate w-[100x] rounded-full bg-brand flex items-center justify-center text-white font-bold">
              {session?.user?.name?.charAt(0) || 'G'}
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'Guest'}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            )}
          </div>

          <nav className="mt-6">
            {['dashboard', 'courses', 'progress', 'achievements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {tab === 'dashboard' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  )}
                  {tab === 'courses' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  )}
                  {tab === 'progress' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  )}
                  {tab === 'achievements' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                {sidebarOpen && (
                  <span className="ml-3">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name || 'Guest'}! Here's your learning overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg  p-6 border">
              <div className="flex items-center">
                <div className="p-3 rounded-full border mr-4">
                  <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Courses</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockProgress.completedCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg  p-6 border">
              <div className="flex items-center">
                <div className="p-3 rounded-full border mr-4">
                  <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockProgress.inProgressCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg  p-6 border">
              <div className="flex items-center">
                <div className="p-3 rounded-full border mr-4">
                  <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Hours Learned</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockProgress.totalHoursLearned}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg  p-6 border">
              <div className="flex items-center">
                <div className="p-3 rounded-full border mr-4">
                  <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Certificates</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockProgress.certificatesEarned}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Chart */}
              <div className="bg-white rounded-lg  p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
                  <div className="flex space-x-2">
                    {['daily', 'weekly', 'monthly'].map((frame) => (
                      <button
                        key={frame}
                        onClick={() => setTimeFrame(frame)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          timeFrame === frame
                            ? 'bg-brand text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {frame.charAt(0).toUpperCase() + frame.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeData[timeFrame]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="progress" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.1} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommended Courses */}
              <div className="bg-white rounded-lg  overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recommended Courses</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockRecommendedCourses.map((course) => (
                    <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3 mr-4">
                            <span className="text-2xl">{course.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                            <p className="text-gray-500 mt-1">{course.description}</p>
                          </div>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md -sm text-white bg-brand hover:bg-brand/90 focus:outline-none">
                          Start Course
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (1/3 width) */}
            <div className="space-y-8">
              {/* Activity Breakdown */}
              <div className="bg-white rounded-lg  p-6 border">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Breakdown</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Videos', hours: 12 },
                        { name: 'Reading', hours: 8 },
                        { name: 'Exercises', hours: 15 },
                        { name: 'Projects', hours: 7 },
                        { name: 'Quizzes', hours: 3 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Learning Tips */}
              <div className="bg-white rounded-lg  p-6 border">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Tips</h2>
                <ul className="space-y-4">
                  {mockTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="h-5 w-5 rounded-full border flex items-center justify-center">
                          <svg className="h-3 w-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-600">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Leaderboard */}
              <div className="bg-white rounded-lg  p-6 border">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Learners</h2>
                <div className="space-y-4">
                  {mockLeaderboard.map((user) => (
                    <div key={user.rank} className="flex items-center">
                      <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        user.rank === 1 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : user.rank === 2 
                            ? 'bg-gray-100 text-gray-800' 
                            : user.rank === 3 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-blue-100 text-brand/90'
                      }`}>
                        {user.rank}
                      </span>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <div className="mt-1 flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className="bg-brand h-1.5 rounded-full" 
                              style={{ width: `${user.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-500">{user.score}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { Logo } from '@/components/ui/logo';
import { BookOpenText, ChevronLeft, ChevronRight, LayoutDashboard, List } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// Mock data
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

const mockCourses = [
  {
    id: 'ai-mastery',
    title: 'AI Mastery',
    description: 'Master the fundamentals of artificial intelligence',
    progress: 65,
    level: 'Intermediate',
    type: 'Course | AI Learning',
    image: '/images/ai-course.jpg',
    careerPath: 'AI Specialist'
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architecture',
    description: 'Learn cloud computing and architecture',
    progress: 30,
    level: 'Beginner',
    type: 'Course | Instructor-led',
    image: '/images/cloud-course.jpg'
  },
  {
    id: 'networking-essentials',
    title: 'Networking Essentials',
    description: 'Build foundational networking skills',
    progress: 80,
    level: 'Beginner',
    type: 'Course | AI Learning',
    image: '/images/networking-course.jpg'
  }
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [contentFilter, setContentFilter] = useState<'in-progress' | 'completed'>('in-progress');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-md transition-all duration-300 fixed h-full z-10`}>
        <div  className="p-4 flex items-center justify-between border-b">
          {sidebarOpen ? (
            <Logo />
          ) : (
            <Link href="/" className="text-xl font-bold text-gray-800">ZL</Link>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </button>
        </div>
        
        {/* User Profile */}
        <div className="p-4">
          <div className="flex items-center p-3 mb-4 rounded-lg bg-gray-100">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold">
              {session?.user?.name?.charAt(0) || 'G'}
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {session?.user?.name || 'Guest'}
                </p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            )}
          </div>

          {/* Navigation - Synchronized with content */}
          <nav className="mt-6">
            {[
              { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
              { id: 'courses', icon: <BookOpenText className="w-5 h-5" />, label: 'Courses' },
              { id: 'progress', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ), label: 'Progress' },
              { id: 'achievements', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ), label: 'Achievements' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  // Sync content filter when switching tabs
                  if (item.id === 'courses') setContentFilter('in-progress');
                }}
                className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-brand text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {sidebarOpen && (
                  <span className="ml-3">{item.label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content - Synchronized with sidebar */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <BookOpenText className="text-brand mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dashboard' && 'My Learning Dashboard'}
              {activeTab === 'courses' && 'My Courses'}
              {activeTab === 'progress' && 'Learning Progress'}
              {activeTab === 'achievements' && 'My Achievements'}
            </h1>
          </div>

          {/* Conditional rendering based on active tab */}
          {activeTab === 'dashboard' && <DashboardContent 
            contentFilter={contentFilter}
            setContentFilter={setContentFilter}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            courses={mockCourses}
          />}

          {activeTab === 'courses' && <CoursesContent 
            contentFilter={contentFilter}
            setContentFilter={setContentFilter}
            courses={mockCourses}
          />}

          {activeTab === 'progress' && <ProgressContent 
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
          />}

          {activeTab === 'achievements' && <AchievementsContent />}
        </div>
      </main>
    </div>
  );
}

// Dashboard Content Component
const DashboardContent = ({ 
  contentFilter, 
  setContentFilter,
  timeFrame,
  setTimeFrame,
  courses 
}: {
  contentFilter: 'in-progress' | 'completed',
  setContentFilter: (filter: 'in-progress' | 'completed') => void,
  timeFrame: 'daily' | 'weekly' | 'monthly',
  setTimeFrame: (frame: 'daily' | 'weekly' | 'monthly') => void,
  courses: typeof mockCourses
}) => {
  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 w-fit">
        <button
          onClick={() => setContentFilter('in-progress')}
          className={`px-4 py-3 font-medium text-sm ${
            contentFilter === 'in-progress' 
              ? 'text-brand border-b-2 border-brand' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          In-Progress
        </button>
        <button
          onClick={() => setContentFilter('completed')}
          className={`px-4 py-3 font-medium text-sm ${
            contentFilter === 'completed' 
              ? 'text-brand border-b-2 border-brand' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
        </button>
      </div>

    
      {/* Courses Section */}
      <CourseListView 
        contentFilter={contentFilter}
        courses={courses}
      />

        {/* Progress Chart */}
        <div className="bg-white rounded-lg mt-20 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Learning Progress</h2>
          <div className="flex space-x-2">
            {['daily', 'weekly', 'monthly'].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame as 'daily' | 'weekly' | 'monthly')}
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
        
        <div className="h-64">
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
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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

    </>
  );
};

// Courses Content Component
const CoursesContent = ({ 
  contentFilter, 
  setContentFilter,
  courses 
}: {
  contentFilter: 'in-progress' | 'completed',
  setContentFilter: (filter: 'in-progress' | 'completed') => void,
  courses: typeof mockCourses
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 w-fit">
        <button
          onClick={() => setContentFilter('in-progress')}
          className={`px-4 py-3 font-medium text-sm ${
            contentFilter === 'in-progress' 
              ? 'text-brand border-b-2 border-brand' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          In-Progress
        </button>
        <button
          onClick={() => setContentFilter('completed')}
          className={`px-4 py-3 font-medium text-sm ${
            contentFilter === 'completed' 
              ? 'text-brand border-b-2 border-brand' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-end mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <div className="relative">
            <input
              type="search"
              placeholder="Search courses..."
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All</option>
              <option>AI Learning</option>
              <option>Instructor-led</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                aria-label="Grid view"
              >
                <LayoutDashboard className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <CourseListView 
        contentFilter={contentFilter}
        viewMode={viewMode}
        courses={courses}
      />
    </>
  );
};

// Course List View Component (Reusable)
const CourseListView = ({ 
  contentFilter,
  viewMode = 'grid',
  courses 
}: {
  contentFilter: 'in-progress' | 'completed',
  viewMode?: 'grid' | 'list',
  courses: typeof mockCourses
}) => {
  const filteredCourses = courses.filter(course => 
    contentFilter === 'in-progress' ? course.progress < 100 : course.progress >= 100
  );

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {contentFilter === 'in-progress' ? 'Your Active Courses' : 'Completed Courses'}
      </h2>
      
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <p className="text-gray-500">
            {contentFilter === 'in-progress' 
              ? 'You have no active courses. Explore our catalog to get started!'
              : 'You have no completed courses yet.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseListItem key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
};

// Course Card Component
const CourseCard = ({ course }: { course: typeof mockCourses[0] }) => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden hover:border-md transition-border">
      {/* Course Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium">
          {course.level}
        </div>
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Course Body */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-sm text-gray-500">{course.type}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{course.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand h-2 rounded-full" 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Career Path */}
        {course.careerPath && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="text-brand text-sm font-medium hover:text-blue-800">
              Part of career path: {course.careerPath}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Course List Item Component
const CourseListItem = ({ course }: { course: typeof mockCourses[0] }) => {
  return (
    <div className="bg-white rounded-lg border p-6 hover:border-md transition-border">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4 w-32 h-24 bg-gray-200 rounded-md overflow-hidden">
          <div className="relative h-full w-full bg-gradient-to-r from-blue-400 to-brand"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{course.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{course.type}</span>
            <span className="mx-2">•</span>
            <span>{course.level}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand h-2 rounded-full" 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Content Component
const ProgressContent = ({ 
  timeFrame,
  setTimeFrame
}: {
  timeFrame: 'daily' | 'weekly' | 'monthly',
  setTimeFrame: (frame: 'daily' | 'weekly' | 'monthly') => void
}) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Detailed Progress</h2>
        <div className="flex space-x-2">
          {['daily', 'weekly', 'monthly'].map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame as 'daily' | 'weekly' | 'monthly')}
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
      
      <div className="h-96">
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
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
  );
};

// Achievements Content Component
const AchievementsContent = () => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Achievements</h2>
      <div className="text-center py-12">
        <p className="text-gray-500">You haven&apos;t earned any achievements yet.</p>
        <p className="text-sm text-gray-400 mt-2">Complete courses to unlock achievements!</p>
      </div>
    </div>
  );
};
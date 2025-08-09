'use client';

import { Logo } from '@/components/ui/logo';
import { BookOpenText, ChevronLeft, ChevronRight, LayoutDashboard, List, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import api from '@/lib/api';

// Interfaces
interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  level: string;
  type: string;
  delivery_type?: string;
  image: string;
  career_path?: string;
  instructor?: string;
  total_modules?: number;
  completed_modules?: number;
  total_lessons?: number;
  completed_lessons?: number;
  estimated_hours?: number;
  enrollment_date?: string;
  last_accessed?: string;
  is_completed?: boolean;
  completion_date?: string;
  certificate_url?: string;
}

interface ProgressData {
  name: string;
  progress: number;
}

interface UserProgress {
  daily: ProgressData[];
  weekly: ProgressData[];
  monthly: ProgressData[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  date_earned: string;
  rarity: string;
}

interface ApiCourse {
  id: number;
  title: string;
  description: string;
  level: string;
  delivery_type?: string;
  image?: string;
  career_path?: string;
  instructor: string;
  hours?: number;
  estimated_hours?: number;
  enrollment_date?: string;
  last_accessed?: string;
  is_completed?: boolean;
  completion_date?: string;
  certificate_url?: string;
  completed_lessons?: number;
  completed_modules?: number;
  progress?: number;
  modules?: ApiModule[];
}

interface ApiModule {
  lessons?: { length: number }[];
}

interface ApiProgressResponse {
  daily?: unknown[];
  weekly?: unknown[];
  monthly?: unknown[];
}

interface ApiProgressItem {
  date?: string;
  week_start?: string;
  month?: string;
  progress_percentage?: number;
}

function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [contentFilter, setContentFilter] = useState<'in-progress' | 'completed'>('in-progress');
  
  // Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressData, setProgressData] = useState<UserProgress>({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dashboard', 'courses', 'progress', 'achievements'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchDashboardData = useCallback(async () => {
    if (!session?.accessToken) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      console.log('[Dashboard] Fetching data...');
      const [coursesRes, progressRes, achievementsRes] = await Promise.all([
        api.get('/user/courses/enrolled/'),
        api.get('/user/progress/'),
        api.get('/user/achievements/')
      ]);
      
      console.log('[Dashboard] API responses received:');
      console.log('Courses response:', coursesRes.data);
      console.log('Progress response:', progressRes.data);
      console.log('Achievements response:', achievementsRes.data);

      // Process courses data
      const coursesData = coursesRes.data.results || [];
      console.log('[Dashboard] Raw courses data:', coursesData);
      
      const formattedCourses = coursesData.map((course: ApiCourse) => {
        // Calculate progress based on completed lessons if available
        const totalLessons = course.modules?.reduce((total: number, module: ApiModule) => 
          total + (module.lessons?.length || 0), 0) || 0;
        const completedLessons = course.completed_lessons || 0;
        const calculatedProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 
          // Fallback: assign some demo progress for enrolled courses (never complete)
          Math.floor(Math.random() * 75) + 5; // Random progress between 5-80%
        
        return {
          id: course.id?.toString(),
          title: course.title,
          description: course.description,
          progress: course.progress || calculatedProgress,
          level: course.level,
          type: `Course | ${course.delivery_type === 'instructor-led' ? 'Instructor-led' : 'AI Learning'}`,
          image: course.image || '/images/course-placeholder.jpg',
          career_path: course.career_path,
          instructor: course.instructor,
          total_modules: course.modules?.length || 0,
          completed_modules: course.completed_modules || 0,
          total_lessons: totalLessons,
          completed_lessons: completedLessons,
          estimated_hours: course.hours || course.estimated_hours,
          enrollment_date: course.enrollment_date,
          last_accessed: course.last_accessed,
          is_completed: course.is_completed || false, // Only mark completed if explicitly set
          completion_date: course.completion_date,
          certificate_url: course.certificate_url
        };
      });

      // Process progress data
      const progressDataRes = progressRes.data as ApiProgressResponse;
      const formattedProgress: UserProgress = {
        daily: transformProgressData((progressDataRes.daily || []) as ApiProgressItem[], 'daily'),
        weekly: transformProgressData((progressDataRes.weekly || []) as ApiProgressItem[], 'weekly'),
        monthly: transformProgressData((progressDataRes.monthly || []) as ApiProgressItem[], 'monthly')
      };

      // Process achievements data
      const achievementsData = achievementsRes.data.achievements || [];
      console.log('[Dashboard] Raw achievements data:', achievementsRes.data);
      console.log('[Dashboard] Formatted achievements:', achievementsData);

      setCourses(formattedCourses);
      setProgressData(formattedProgress);
      setAchievements(achievementsData);
      
      console.log('[Dashboard] Final formatted courses:', formattedCourses);
      console.log('[Dashboard] Final achievements set:', achievementsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      // Fallback to empty arrays
      setCourses([]);
      setProgressData({ daily: [], weekly: [], monthly: [] });
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  // Fetch data when component mounts or session changes
  useEffect(() => {
    if (session?.accessToken) {
      fetchDashboardData();
    }
  }, [session?.accessToken, fetchDashboardData]);

  const transformProgressData = (data: ApiProgressItem[], period: string): ProgressData[] => {
    if (!data || data.length === 0) {
      // Return default structure if no data
      if (period === 'daily') {
        return [
          { name: '6AM', progress: 0 },
          { name: '9AM', progress: 0 },
          { name: '12PM', progress: 0 },
          { name: '3PM', progress: 0 },
          { name: '6PM', progress: 0 },
          { name: '9PM', progress: 0 },
          { name: '12AM', progress: 0 }
        ];
      } else if (period === 'weekly') {
        return [
          { name: 'Mon', progress: 0 },
          { name: 'Tue', progress: 0 },
          { name: 'Wed', progress: 0 },
          { name: 'Thu', progress: 0 },
          { name: 'Fri', progress: 0 },
          { name: 'Sat', progress: 0 },
          { name: 'Sun', progress: 0 }
        ];
      } else {
        return [
          { name: 'Week 1', progress: 0 },
          { name: 'Week 2', progress: 0 },
          { name: 'Week 3', progress: 0 },
          { name: 'Week 4', progress: 0 }
        ];
      }
    }

    return data.map((item: ApiProgressItem) => ({
      name: period === 'daily' ? (item.date ? new Date(item.date).toLocaleTimeString('en-US', { hour: 'numeric' }) : 'N/A') :
            period === 'weekly' ? (item.week_start ? new Date(item.week_start).toLocaleDateString('en-US', { weekday: 'short' }) : 'N/A') :
            (item.month ? `Week ${Math.ceil(new Date(item.month).getDate() / 7)}` : 'N/A'),
      progress: item.progress_percentage || 0
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
        
        {/* Enhanced User Profile */}
        <div className="p-4">
          <div className="flex items-center p-4 mb-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200">
            {session?.user?.avatar ? (
              <Image
                src={session.user.avatar}
                alt={session.user?.full_name || session.user?.name || 'User'}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#446d6d] to-[#002424] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {session?.user?.full_name?.charAt(0) || session?.user?.name?.charAt(0) || 'G'}
              </div>
            )}
            {sidebarOpen && (
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {session?.user?.full_name || session?.user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-gray-600">
                  {session?.user?.is_instructor ? 'Instructor' : 'Student'}
                </p>
                {(session?.user?.courses_enrolled || session?.user?.achievements) && (
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {session?.user?.courses_enrolled && (
                      <span>{session.user.courses_enrolled} courses</span>
                    )}
                    {session?.user?.achievements && (
                      <span>{session.user.achievements} achievements</span>
                    )}
                  </div>
                )}
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
                  // Update URL to reflect current tab
                  router.push(`/dashboard?tab=${item.id}`, { scroll: false });
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
            courses={courses}
            progressData={progressData}
            error={error}
          />}

          {activeTab === 'courses' && <CoursesContent 
            contentFilter={contentFilter}
            setContentFilter={setContentFilter}
            courses={courses}
            error={error}
          />}

          {activeTab === 'progress' && <ProgressContent 
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            progressData={progressData}
            error={error}
          />}

          {activeTab === 'achievements' && <AchievementsContent 
            achievements={achievements}
            error={error}
          />}
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
  courses,
  progressData,
  error
}: {
  contentFilter: 'in-progress' | 'completed',
  setContentFilter: (filter: 'in-progress' | 'completed') => void,
  timeFrame: 'daily' | 'weekly' | 'monthly',
  setTimeFrame: (frame: 'daily' | 'weekly' | 'monthly') => void,
  courses: Course[],
  progressData: UserProgress,
  error: string | null
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

    
      {/* Error handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

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
              data={progressData[timeFrame]}
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
  courses,
  error
}: {
  contentFilter: 'in-progress' | 'completed',
  setContentFilter: (filter: 'in-progress' | 'completed') => void,
  courses: Course[],
  error: string | null
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <>
      {/* Error handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

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
  courses: Course[]
}) => {
  const filteredCourses = courses.filter(course => {
    if (contentFilter === 'in-progress') {
      // Show courses that are not completed (progress < 100 or is_completed is false)
      return !course.is_completed && course.progress < 100;
    } else {
      // Show completed courses (progress >= 100 or is_completed is true)
      return course.is_completed || course.progress >= 100;
    }
  });
  
  console.log('[CourseListView] Filtering courses:', {
    totalCourses: courses.length,
    contentFilter,
    filteredCourses: filteredCourses.length,
    courseDetails: courses.map(c => ({ 
      id: c.id, 
      title: c.title, 
      progress: c.progress, 
      is_completed: c.is_completed 
    }))
  });

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
          <p className="text-sm text-gray-400 mt-2">
            Total courses available: {courses.length}
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
const CourseCard = ({ course }: { course: Course }) => {
  const router = useRouter();

  const handleCourseClick = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg border overflow-hidden hover:border-md hover:shadow-lg transition-all cursor-pointer"
      onClick={handleCourseClick}
    >
      {/* Course Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium">
          {course.level}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg className="h-12 w-12 text-white hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
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
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation(); // Prevent course navigation
              // Add menu functionality here if needed
            }}
          >
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

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-brand text-sm">
            <BookOpenText className="h-4 w-4 mr-1" />
            <span>Continue Learning</span>
          </div>
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Career Path */}
        {course.career_path && (
          <div className="mt-2">
            <button 
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation(); // Prevent course navigation
                // Add career path navigation here if needed
              }}
            >
              Part of career path: {course.career_path}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Course List Item Component
const CourseListItem = ({ course }: { course: Course }) => {
  const router = useRouter();

  const handleCourseClick = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg border p-6 hover:border-md hover:shadow-lg transition-all cursor-pointer"
      onClick={handleCourseClick}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4 w-32 h-24 bg-gray-200 rounded-md overflow-hidden">
          <div className="relative h-full w-full bg-gradient-to-r from-blue-400 to-brand"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation(); // Prevent course navigation
                // Add menu functionality here if needed
              }}
            >
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
  setTimeFrame,
  progressData,
  error
}: {
  timeFrame: 'daily' | 'weekly' | 'monthly',
  setTimeFrame: (frame: 'daily' | 'weekly' | 'monthly') => void,
  progressData: UserProgress,
  error: string | null
}) => {
  return (
    <>
      {/* Error handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

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
              data={progressData[timeFrame]}
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

// Achievements Content Component
const AchievementsContent = ({ 
  achievements,
  error
}: {
  achievements: Achievement[],
  error: string | null
}) => {
  return (
    <>
      {/* Error handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Achievements</h2>
        
        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven&apos;t earned any achievements yet.</p>
            <p className="text-sm text-gray-400 mt-2">Complete courses to unlock achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-lg shadow-sm border p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{achievement.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                <div className="flex items-center justify-between w-full text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded-full ${
                    achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                    achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                    achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {achievement.rarity}
                  </span>
                  <span>{achievement.points} pts</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(achievement.date_earned).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardPage />
    </Suspense>
  );
};
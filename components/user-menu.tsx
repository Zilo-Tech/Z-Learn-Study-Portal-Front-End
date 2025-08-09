'use client';

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  LogOut, 
  ChevronRight, 
  LayoutDashboard,
  BookOpen,
  Award,
  TrendingUp,
  Settings,
  ChevronDown,
  GraduationCap,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";

interface UserStats {
  courses_enrolled: number;
  courses_completed: number;
  achievements: number;
  total_learning_time?: number;
  current_streak?: number;
}

const UserMenu = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const userDisplayName = session?.user?.full_name || session?.user?.name || session?.user?.email || 'User';
  const userRole = session?.user?.is_instructor ? 'Instructor' : 'Student';

  const fetchUserStats = useCallback(async () => {
    if (!session?.accessToken) return;
    
    try {
      setLoading(true);
      console.log('[UserMenu] Fetching user stats...');
      
      // Fetch dashboard summary which includes user stats
      const response = await api.get('/user/dashboard/summary/');
      console.log('[UserMenu] Dashboard summary response:', response.data);
      
      const stats: UserStats = {
        courses_enrolled: response.data.user?.courses_enrolled || 0,
        courses_completed: response.data.user?.courses_completed || 0,
        achievements: response.data.user?.achievements || 0,
        total_learning_time: response.data.user?.total_learning_time || 0,
        current_streak: response.data.user?.current_streak || 0
      };
      
      setUserStats(stats);
      console.log('[UserMenu] User stats set:', stats);
    } catch (error) {
      console.error('[UserMenu] Error fetching user stats:', error);
      // Fallback to session data if available
      setUserStats({
        courses_enrolled: session?.user?.courses_enrolled || 0,
        courses_completed: session?.user?.courses_completed || 0,
        achievements: session?.user?.achievements || 0
      });
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, session?.user?.courses_enrolled, session?.user?.courses_completed, session?.user?.achievements]);

  // Fetch user statistics when menu is opened
  useEffect(() => {
    if (isOpen && session?.accessToken && !userStats) {
      fetchUserStats();
    }
  }, [isOpen, session?.accessToken, userStats, fetchUserStats]);

  // Use dynamic stats if available, otherwise fall back to session data
  const displayStats = userStats || {
    courses_enrolled: session?.user?.courses_enrolled || 0,
    courses_completed: session?.user?.courses_completed || 0,
    achievements: session?.user?.achievements || 0
  };

  if (!session) return null;

  return (
    <div className="relative">
      {/* User Profile Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
      >
        {/* User Avatar */}
        <div className="relative">
          {session.user?.avatar ? (
            <Image
              src={session.user.avatar}
              alt={userDisplayName}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#446d6d] to-[#002424] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {getInitials(userDisplayName)}
            </div>
          )}
          {/* Online status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        {/* User Info - Desktop Only */}
        <div className="hidden md:flex flex-col items-start">
          <span className="font-semibold text-gray-900 text-sm leading-tight">
            {userDisplayName.split(' ')[0]} {/* First name only */}
          </span>
          <span className="text-xs text-gray-500 leading-tight">
            {userRole}
          </span>
        </div>
        
        <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
      </button>

      {/* Enhanced Profile Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 w-96 transition-all duration-300 border-l border-gray-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-[#446d6d] to-[#002424] p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Profile</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            {session.user?.avatar ? (
              <Image
                src={session.user.avatar}
                alt={userDisplayName}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-3 border-white shadow-lg">
                {getInitials(userDisplayName)}
              </div>
            )}
            
            {/* User Info */}
            <div className="flex-1">
              <h4 className="font-bold text-lg leading-tight">{userDisplayName}</h4>
              <p className="text-blue-100 text-sm">{userRole} at Z-Learn</p>
              <p className="text-blue-200 text-xs mt-1">{session.user?.email}</p>
            </div>
          </div>
          
          {/* User Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="font-bold text-lg flex items-center justify-center">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  displayStats.courses_enrolled
                )}
              </div>
              <div className="text-xs text-blue-200">Enrolled</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg flex items-center justify-center">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  displayStats.courses_completed
                )}
              </div>
              <div className="text-xs text-blue-200">Completed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg flex items-center justify-center">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  displayStats.achievements
                )}
              </div>
              <div className="text-xs text-blue-200">Achievements</div>
            </div>
          </div>

          {/* Additional Stats (if available) */}
          {userStats?.current_streak && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">Current Streak:</span>
                <span className="text-white font-semibold">{userStats.current_streak} days</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-280px)]">
          {/* Dashboard Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">Dashboard</span>
            </div>
            <div className="space-y-1">
              <Link 
                href="/dashboard" 
                className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-gray-900">My Learning</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
              <Link 
                href="/dashboard?tab=achievements" 
                className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-gray-900">Achievements</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
              <Link 
                href="/dashboard?tab=progress" 
                className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-gray-900">Progress</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
            </div>
          </div>

          {/* Courses Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">Courses</span>
            </div>
            <div className="space-y-1">
              <Link href="/courses" className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                  <span className="text-gray-700 group-hover:text-gray-900">Browse Courses</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
              </Link>
              <Link 
                href="/dashboard?tab=courses" 
                className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                  <span className="text-gray-700 group-hover:text-gray-900">My Enrollments</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
              </Link>
            </div>
          </div>

          {/* Profile Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900">Account</span>
            </div>
            <div className="space-y-1">
              <Link href="/profile/edit" className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                  <span className="text-gray-700 group-hover:text-gray-900">Update Profile</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
              </Link>
              <Link href="/settings" className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                  <span className="text-gray-700 group-hover:text-gray-900">Settings</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
              </Link>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className="h-5 w-5 group-hover:text-red-700" />
            <span className="font-medium group-hover:text-red-700">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;
"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calendar, 
  Trophy, 
  Clock,
  Users,
  MessageSquare,
  Target,
  ChevronRight,
  Play,
  Award,
  Brain,
  AlertCircle
} from 'lucide-react';

interface DashboardData {
  enrolled_courses: number;
  completed_courses: number;
  upcoming_sessions_count: number;
  total_study_hours: number;
  achievements_count: number;
  current_streak: number;
  progress_percentage: number;
  recent_courses: Array<{
    id: number;
    title: string;
    progress: number;
    last_accessed: string;
  }>;
  upcoming_sessions: Array<{
    id: number;
    tutor_name: string;
    subject: string;
    date: string;
    time: string;
  }>;
  recent_achievements: Array<{
    id: number;
    title: string;
    description: string;
    earned_date: string;
    icon: string;
  }>;
}

export default function StudentDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/dashboard/');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      // Mock data for development
      setDashboardData({
        enrolled_courses: 5,
        completed_courses: 12,
        upcoming_sessions_count: 3,
        total_study_hours: 84,
        achievements_count: 15,
        current_streak: 7,
        progress_percentage: 68,
        recent_courses: [
          {
            id: 1,
            title: 'Advanced Mathematics',
            progress: 75,
            last_accessed: '2024-01-12T10:30:00Z'
          },
          {
            id: 2,
            title: 'Physics Fundamentals',
            progress: 45,
            last_accessed: '2024-01-11T14:15:00Z'
          },
          {
            id: 3,
            title: 'Computer Science Basics',
            progress: 90,
            last_accessed: '2024-01-10T16:45:00Z'
          }
        ],
        upcoming_sessions: [
          {
            id: 1,
            tutor_name: 'Dr. Sarah Johnson',
            subject: 'Mathematics',
            date: '2024-01-15',
            time: '10:00'
          },
          {
            id: 2,
            tutor_name: 'Prof. Michael Chen',
            subject: 'Physics',
            date: '2024-01-16',
            time: '14:30'
          },
          {
            id: 3,
            tutor_name: 'Ms. Emily Davis',
            subject: 'Chemistry',
            date: '2024-01-17',
            time: '11:00'
          }
        ],
        recent_achievements: [
          {
            id: 1,
            title: 'Week Streak Champion',
            description: 'Studied for 7 consecutive days',
            earned_date: '2024-01-12T00:00:00Z',
            icon: '🔥'
          },
          {
            id: 2,
            title: 'Mathematics Master',
            description: 'Completed 10 math assignments',
            earned_date: '2024-01-10T00:00:00Z',
            icon: '🧮'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Brain className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Your learning dashboard</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Brain className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Your learning dashboard</p>
          </div>
        </div>
        
        <Card className="p-12 text-center">
          <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-500">Start learning to see your progress</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Brain className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.enrolled_courses}</p>
              <p className="text-xs text-gray-500 mt-1">{dashboardData.completed_courses} completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.upcoming_sessions_count}</p>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Study Hours</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.total_study_hours}</p>
              <p className="text-xs text-gray-500 mt-1">Total time</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Trophy className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.current_streak}</p>
              <p className="text-xs text-gray-500 mt-1">Days in a row</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-2xl font-bold text-emerald-600">{dashboardData.progress_percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${dashboardData.progress_percentage}%` }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-medium text-gray-900">{dashboardData.enrolled_courses}</p>
            <p className="text-gray-500">Active</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">{dashboardData.completed_courses}</p>
            <p className="text-gray-500">Completed</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">{dashboardData.achievements_count}</p>
            <p className="text-gray-500">Achievements</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">{dashboardData.total_study_hours}h</p>
            <p className="text-gray-500">Study Time</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Courses */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
            <Button variant="outline" size="sm">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recent_courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{course.progress}%</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last accessed {formatDate(course.last_accessed)}
                  </p>
                </div>
                
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white ml-4">
                  <Play className="h-4 w-4 mr-1" />
                  Continue
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            <Button variant="outline" size="sm">
              Schedule More
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.upcoming_sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{session.subject}</h4>
                  <p className="text-sm text-gray-600">with {session.tutor_name}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{formatDate(session.date)}</span>
                    <span>{formatTime(session.time)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
          <Button variant="outline" size="sm">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {dashboardData.recent_achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div>
                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Earned {formatDate(achievement.earned_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button className="h-20 bg-emerald-600 hover:bg-emerald-700 text-white flex-col space-y-2">
          <BookOpen className="h-6 w-6" />
          <span>Browse Courses</span>
        </Button>
        
        <Button className="h-20 bg-blue-600 hover:bg-blue-700 text-white flex-col space-y-2">
          <Users className="h-6 w-6" />
          <span>Find Tutors</span>
        </Button>
        
        <Button className="h-20 bg-purple-600 hover:bg-purple-700 text-white flex-col space-y-2">
          <Target className="h-6 w-6" />
          <span>Practice Tests</span>
        </Button>
        
        <Button className="h-20 bg-amber-600 hover:bg-amber-700 text-white flex-col space-y-2">
          <Award className="h-6 w-6" />
          <span>Achievements</span>
        </Button>
      </div>
    </div>
  );
}
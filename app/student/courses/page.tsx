"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Target, 
  CheckCircle2,
  Calendar,
  Award
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  last_accessed: string;
  total_lessons: number;
  completed_lessons: number;
  instructor: string;
  category: string;
  level: string;
  duration: number;
  image?: string;
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/courses/enrolled/');
      setCourses(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      // Mock data for development
      setCourses([
        {
          id: 1,
          title: 'Advanced Mathematics',
          description: 'Comprehensive course covering calculus, algebra, and trigonometry',
          progress: 75,
          last_accessed: '2024-01-12T10:30:00Z',
          total_lessons: 24,
          completed_lessons: 18,
          instructor: 'Dr. Sarah Johnson',
          category: 'Mathematics',
          level: 'Advanced',
          duration: 120
        },
        {
          id: 2,
          title: 'Physics Fundamentals',
          description: 'Introduction to classical mechanics and thermodynamics',
          progress: 45,
          last_accessed: '2024-01-11T14:15:00Z',
          total_lessons: 18,
          completed_lessons: 8,
          instructor: 'Prof. Michael Chen',
          category: 'Physics',
          level: 'Intermediate',
          duration: 90
        },
        {
          id: 3,
          title: 'Computer Science Basics',
          description: 'Programming fundamentals and data structures',
          progress: 90,
          last_accessed: '2024-01-10T16:45:00Z',
          total_lessons: 20,
          completed_lessons: 18,
          instructor: 'Ms. Emily Davis',
          category: 'Computer Science',
          level: 'Beginner',
          duration: 100
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-emerald-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBgColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-600';
    if (progress >= 60) return 'bg-blue-600';
    if (progress >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600">Track your learning progress</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <BookOpen className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Track your learning progress</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.filter(c => c.progress > 0 && c.progress < 100).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.filter(c => c.progress === 100).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, c) => sum + c.duration, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <BookOpen className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {courses.length === 0 && !loading && !error && (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
          <p className="text-gray-500 mb-6">Start your learning journey by enrolling in courses</p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Browse Courses
          </Button>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="space-y-4">
              {/* Course Header */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              </div>

              {/* Course Meta */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-1 text-gray-500 mb-1">
                    <Target className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                  <p className="font-medium text-gray-900">{course.category}</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-1 text-gray-500 mb-1">
                    <Award className="h-4 w-4" />
                    <span>Level</span>
                  </div>
                  <p className="font-medium text-gray-900">{course.level}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Progress</span>
                  <span className={`text-sm font-bold ${getProgressColor(course.progress)}`}>
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{course.completed_lessons} of {course.total_lessons} lessons</span>
                  <span>{course.duration} hours</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="text-sm">
                <div className="flex items-center space-x-1 text-gray-500 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Instructor</span>
                </div>
                <p className="font-medium text-gray-900">{course.instructor}</p>
              </div>

              {/* Last Accessed */}
              <div className="text-sm">
                <div className="flex items-center space-x-1 text-gray-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Last Accessed</span>
                </div>
                <p className="font-medium text-gray-900">
                  {formatDate(course.last_accessed)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 mr-2"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                
                <Button 
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
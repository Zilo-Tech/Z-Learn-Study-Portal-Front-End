"use client";
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, PlayCircle, Clock, CheckCircle } from 'lucide-react';

export default function ModulesPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : Array.isArray(params.courseId) ? params.courseId[0] : '';
  const level = searchParams.get('level');
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        const res = await axios.get(`https://z-learn-study-portal-backend.onrender.com/api/courses/${courseId}/details/`);
        setCourse(res.data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course modules...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <button 
            onClick={() => router.push('/courses')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-1">{course.description}</p>
              {level && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Level: {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/courses')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Courses
            </button>
          </div>
        </div>
      </div>

      {/* Modules Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {course.modules && course.modules.length > 0 ? (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Modules</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Complete each module in order to master the concepts and earn your certificate.
              </p>
            </div>

            <div className="grid gap-6">
              {course.modules.map((module: any, index: number) => (
                <div key={module.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Module Number */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {index + 1}
                        </div>
                      </div>

                      {/* Module Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h3>
                            {module.description && (
                              <p className="text-gray-600 text-lg">{module.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{module.lessons?.length || 0} lessons</span>
                          </div>
                        </div>

                        {/* Lessons Preview */}
                        {module.lessons && module.lessons.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <BookOpen className="w-5 h-5 mr-2" />
                              Lessons ({module.lessons.length})
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {module.lessons.slice(0, 4).map((lesson: any, lessonIndex: number) => (
                                <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                    {lessonIndex + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                                    {lesson.content && (
                                      <p className="text-sm text-gray-500 truncate">
                                        {lesson.content.slice(0, 50)}...
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {module.lessons.length > 4 && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-500">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                                    +{module.lessons.length - 4}
                                  </div>
                                  <span className="text-sm">more lessons...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              const firstLessonId = module.lessons?.[0]?.id || '1';
                              router.push(`/courses/${courseId}/modules/${module.id}/lessons/${firstLessonId}${level ? `?level=${level}` : ''}`);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                          >
                            <PlayCircle className="w-5 h-5" />
                            Start Module
                          </button>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4" />
                            <span>0/{module.lessons?.length || 0} completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Modules Available</h3>
            <p className="text-gray-600 mb-6">This course doesn't have any modules yet.</p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Other Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

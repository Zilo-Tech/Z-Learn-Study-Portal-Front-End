import { notFound } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Star, Clock, Users, Award, BookOpen, PlayCircle } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  content?: string;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  originalPrice?: number;
  is_free: boolean;
  rating: number;
  reviews?: number;
  students_count: number;
  instructor: string;
  hours?: number;
  features?: string[];
  modules?: Module[];
}

// Fix: Use the correct signature for Next.js App Router dynamic route with Promise params
export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = await params;
  console.log('[CourseDetailPage] params (raw):', resolvedParams);
  let course: CourseDetail | null = null;
  try {
    // Use direct axios call to avoid localStorage/server issues
    const res = await axios.get(`https://z-learn-study-portal-backend.onrender.com/api/courses/${resolvedParams.courseId}/details/`);
    console.log('[CourseDetailPage] API response:', res);
    course = res.data;
  } catch (err) {
    console.error('[CourseDetailPage] API error:', err);
    return notFound();
  }

  // Defensive: treat empty object or missing title as not found
  if (!course || typeof course !== 'object' || Array.isArray(course) || !course.title) {
    console.warn('[CourseDetailPage] Invalid course data:', course);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="text-lg font-semibold">{course.rating}</span>
                  <span className="text-blue-200">({course.reviews || 0} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span>{course.duration}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-200" />
                  <span>Instructor: {course.instructor}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`/level-selection?course=${course.id || resolvedParams.courseId}`}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                >
                  <PlayCircle className="w-6 h-6 inline mr-2" />
                  Enroll Now
                </Link>
                
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold">
                    {course.is_free ? (
                      <span className="text-green-300">FREE</span>
                    ) : (
                      <span>${course.price}</span>
                    )}
                  </div>
                  {!course.is_free && course.originalPrice && (
                    <div className="text-blue-200 line-through text-lg">
                      ${course.originalPrice}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Course Level</span>
                    <span className="font-semibold">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Duration</span>
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Total Hours</span>
                    <span className="font-semibold">{course.hours || 'N/A'} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Certificate</span>
                    <Award className="w-5 h-5 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Modules */}
            {course.modules && course.modules.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                  Course Modules
                </h2>
                <div className="space-y-6">
                  {course.modules.map((module: Module, index: number) => (
                    <div key={module.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title}</h3>
                          {module.description && (
                            <p className="text-gray-600 mb-4">{module.description}</p>
                          )}
                          {module.lessons && module.lessons.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-700 mb-2">Lessons ({module.lessons.length})</h4>
                              <ul className="space-y-2">
                                {module.lessons.map((lesson: Lesson) => (
                                  <li key={lesson.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <PlayCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-900">{lesson.title}</span>
                                      {lesson.content && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                          {lesson.content.slice(0, 120)}
                                          {lesson.content.length > 120 ? '...' : ''}
                                        </p>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Features */}
            {course.features && course.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">What You&apos;ll Learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Course Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {course.is_free ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span>${course.price}</span>
                    )}
                  </div>
                  {!course.is_free && course.originalPrice && (
                    <div className="text-gray-500 line-through text-lg">
                      ${course.originalPrice}
                    </div>
                  )}
                </div>

                <Link 
                  href={`/level-selection?course=${course.id || resolvedParams.courseId}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center block mb-6"
                >
                  <PlayCircle className="w-6 h-6 inline mr-2" />
                  Start Learning
                </Link>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Instructor</span>
                    <span className="font-semibold">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Level</span>
                    <span className="font-semibold">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold">{course.category}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-gray-500">({course.reviews || 0})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Badge */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 text-center">
                <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Certificate of Completion</h3>
                <p className="text-sm text-gray-600">
                  Earn a verified certificate upon successful completion of this course.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

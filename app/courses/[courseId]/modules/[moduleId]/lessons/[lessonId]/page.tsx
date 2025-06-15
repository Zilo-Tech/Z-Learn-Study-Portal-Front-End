"use client";
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  MessageCircle,
  PlayCircle,
  FileText,
  Brain,
  HelpCircle
} from 'lucide-react';
import AgentChatBox from '@/components/agent-chat/AgentChatBox';

interface Course {
  id: string;
  title: string;
  description: string;
  modules?: Module[];
}

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content?: string;
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;
  const level = searchParams.get('level');
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        const res = await axios.get(`https://z-learn-study-portal-backend.onrender.com/api/courses/${courseId}/details/`);
        const courseData: Course = res.data;
        setCourse(courseData);

        // Find the current module
        const foundModule = courseData.modules?.find((m: Module) => m.id.toString() === moduleId);
        if (!foundModule) {
          setError('Module not found');
          return;
        }
        setCurrentModule(foundModule);

        // Find the current lesson
        const lesson = foundModule.lessons?.find((l: Lesson) => l.id.toString() === lessonId);
        if (!lesson) {
          setError('Lesson not found');
          return;
        }
        setCurrentLesson(lesson);

        // Set all lessons for navigation
        setAllLessons(foundModule.lessons || []);
        const lessonIndex = foundModule.lessons?.findIndex((l: Lesson) => l.id.toString() === lessonId) || 0;
        setCurrentLessonIndex(lessonIndex);

      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load lesson data');
      } finally {
        setLoading(false);
      }
    }

    if (courseId && moduleId && lessonId) {
      fetchCourseData();
    }
  }, [courseId, moduleId, lessonId]);

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      router.push(`/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}${level ? `?level=${level}` : ''}`);
    } else {
      // Go to module assessment or next module
      router.push(`/courses/${courseId}/modules/${moduleId}/assessment${level ? `?level=${level}` : ''}`);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      router.push(`/courses/${courseId}/modules/${moduleId}/lessons/${prevLesson.id}${level ? `?level=${level}` : ''}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Lesson not found'}</p>
          <button 
            onClick={() => router.push(`/courses/${courseId}/modules`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  const isLastLesson = currentLessonIndex === allLessons.length - 1;
  const isFirstLesson = currentLessonIndex === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/courses/${courseId}/modules${level ? `?level=${level}` : ''}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Modules</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="font-semibold text-gray-900">{currentModule?.title}</h1>
                <p className="text-sm text-gray-600">
                  Lesson {currentLessonIndex + 1} of {allLessons.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {level && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>~5 min read</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(((currentLessonIndex + 1) / allLessons.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentLessonIndex + 1) / allLessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentLesson.title}</h1>
                
                {!lessonCompleted && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800">Ready to learn? Let&apos;s dive in!</span>
                  </div>
                )}

                {lessonCompleted && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-6">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">Lesson completed! Great job!</span>
                  </div>
                )}
              </div>

              {/* Lesson Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {currentLesson.content || 'No content available for this lesson.'}
                </div>
              </div>

              {/* Lesson Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setLessonCompleted(!lessonCompleted)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      lessonCompleted 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {lessonCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>

                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-xl font-semibold transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {showChat ? 'Hide' : 'Show'} AI Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            {showChat && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  AI Learning Assistant
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <AgentChatBox 
                    _sessionId={`${courseId}-${moduleId}-lesson${lessonId}`} 
                    _mockMode={false}
                    lessonId={lessonId}
                    courseId={courseId}
                    moduleId={moduleId}
                    lessonContent={currentLesson.content}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    Ask Question
                  </button>
                  <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    <FileText className="w-4 h-4" />
                    Summarize
                  </button>
                  <button className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    <Brain className="w-4 h-4" />
                    Quiz Me
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePreviousLesson}
                  disabled={isFirstLesson}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isFirstLesson
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous Lesson
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {currentLessonIndex + 1} of {allLessons.length} lessons
                  </p>
                </div>

                <button
                  onClick={handleNextLesson}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {isLastLesson ? 'Take Assessment' : 'Next Lesson'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Lesson Navigation */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Module Lessons
                </h3>
                <div className="space-y-2">
                  {allLessons.map((lesson: Lesson, index: number) => (
                    <button
                      key={lesson.id}
                      onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}${level ? `?level=${level}` : ''}`)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        lesson.id.toString() === lessonId
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          lesson.id.toString() === lessonId
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium truncate">{lesson.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Course Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Course:</span>
                    <p className="font-medium text-gray-900">{course?.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Module:</span>
                    <p className="font-medium text-gray-900">{currentModule?.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Progress:</span>
                    <p className="font-medium text-gray-900">
                      {currentLessonIndex + 1}/{allLessons.length} lessons
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

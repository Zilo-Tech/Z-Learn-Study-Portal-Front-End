"use client";
import { useRouter, useParams } from 'next/navigation';

const mockModules = [
  { id: 'intro', title: 'Introduction to AI', lessons: 3 },
  { id: 'applications', title: 'AI Applications', lessons: 2 },
  { id: 'ethics', title: 'Ethics in AI', lessons: 2 }
];

export default function ModulesPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : Array.isArray(params.courseId) ? params.courseId[0] : 'ai-mastery';
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Modules for {courseId.replace(/-/g, ' ')}</h1>
      <div className="space-y-4">
        {mockModules.map((mod) => (
          <div key={mod.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{mod.title}</h2>
              <p className="text-gray-500 text-sm">{mod.lessons} Lessons</p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => router.push(`/courses/${courseId}/modules/${mod.id}/lessons/1`)}
            >
              Start Module
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

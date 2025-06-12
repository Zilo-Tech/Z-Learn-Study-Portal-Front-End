"use client";
import { useRouter } from 'next/navigation';

export default function AssessmentCompletePage() {
  const router = useRouter();
  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Assessment Complete!</h1>
      <p className="mb-8 text-gray-600">Congratulations! You have completed the onboarding assessment. You can now explore the course modules and start learning.</p>
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        onClick={() => router.push('/courses/ai-mastery/modules')}
      >
        Go to Modules
      </button>
    </div>
  );
}

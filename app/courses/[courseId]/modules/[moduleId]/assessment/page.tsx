"use client";
import { useParams } from 'next/navigation';

const mockQuestions = [
  { q: 'What is AI?', a: 'Simulation of human intelligence by machines.' },
  { q: 'Name a type of AI.', a: 'Narrow AI.' }
];

export default function ModuleAssessmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Module Assessment</h1>
      <p className="mb-4 text-gray-600">Course: <span className="font-semibold">{courseId}</span> | Module: <span className="font-semibold">{moduleId}</span></p>
      <div className="space-y-6">
        {mockQuestions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4">
            <div className="font-semibold mb-2">Q{idx + 1}: {q.q}</div>
            <div className="text-gray-500 text-sm">A: {q.a}</div>
          </div>
        ))}
      </div>
      <button className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Finish Module</button>
    </div>
  );
}

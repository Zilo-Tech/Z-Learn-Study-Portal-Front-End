"use client";
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import AgentChatBox from '@/components/agent-chat/AgentChatBox';

const mockLessons = [
  { id: 1, title: 'What is AI?', content: 'AI is the simulation of human intelligence by machines.' },
  { id: 2, title: 'History of AI', content: 'AI has evolved from simple rule-based systems to deep learning.' },
  { id: 3, title: 'Types of AI', content: 'Narrow AI, General AI, and Superintelligent AI.' }
];

const miniAssessments = [
  {
    question: 'What does AI stand for?',
    options: [
      { value: 'a', label: 'Artificial Intelligence' },
      { value: 'b', label: 'Automated Input' },
      { value: 'c', label: 'Analog Interface' }
    ],
    correctAnswer: 'a'
  },
  {
    question: 'Which is a type of AI?',
    options: [
      { value: 'a', label: 'Narrow AI' },
      { value: 'b', label: 'Wide AI' },
      { value: 'c', label: 'Open AI' }
    ],
    correctAnswer: 'a'
  }
];

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;
  const lessonId = parseInt(params.lessonId as string, 10) || 1;
  const lesson = mockLessons.find(l => l.id === lessonId) || mockLessons[0];
  const isLastLesson = lessonId === mockLessons.length;
  const [showMiniAssessment, setShowMiniAssessment] = useState(false);
  const [miniAnswer, setMiniAnswer] = useState<string | null>(null);
  const [miniFeedback, setMiniFeedback] = useState<string | null>(null);

  const handleMiniAssessment = (answer: string) => {
    setMiniAnswer(answer);
    if (miniAssessments[lessonId - 1] && answer === miniAssessments[lessonId - 1].correctAnswer) {
      setMiniFeedback('Correct!');
    } else {
      setMiniFeedback('Try again!');
    }
  };

  if (showMiniAssessment && miniAssessments[lessonId - 1]) {
    const mini = miniAssessments[lessonId - 1];
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h2 className="text-xl font-bold mb-4">Quick Check</h2>
        <p className="mb-4">{mini.question}</p>
        <div className="space-y-2">
          {mini.options.map(opt => (
            <button
              key={opt.value}
              className={`w-full px-4 py-2 rounded border ${miniAnswer === opt.value ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'} mb-2`}
              onClick={() => handleMiniAssessment(opt.value)}
              disabled={!!miniFeedback}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {miniFeedback && (
          <div className="mt-4">
            <span className={miniFeedback === 'Correct!' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{miniFeedback}</span>
            {miniFeedback === 'Correct!' && (
              <button
                className="ml-4 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                onClick={() => {
                  setShowMiniAssessment(false);
                  setMiniAnswer(null);
                  setMiniFeedback(null);
                  if (!isLastLesson) {
                    router.push(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId + 1}`);
                  } else {
                    router.push(`/courses/${courseId}/modules/${moduleId}/assessment`);
                  }
                }}
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{lesson.title}</h1>
      <p className="text-gray-700 mb-4">{lesson.content}</p>
      <div className="bg-gray-50 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Chat with Z-Learn Agent</h2>
        <AgentChatBox _sessionId={`${courseId}-${moduleId}-lesson${lessonId}`} _mockMode />
        <div className="flex gap-2 mt-4">
          <button className="bg-blue-500 text-white px-3 py-1 rounded">Ask Agent</button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">Summarize</button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">Quiz Me</button>
        </div>
      </div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        onClick={() => {
          if (miniAssessments[lessonId - 1]) {
            setShowMiniAssessment(true);
          } else if (!isLastLesson) {
            router.push(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId + 1}`);
          } else {
            router.push(`/courses/${courseId}/modules/${moduleId}/assessment`);
          }
        }}
      >
        {isLastLesson ? 'Take Module Assessment' : 'Continue to Quick Check'}
      </button>
    </div>
  );
}

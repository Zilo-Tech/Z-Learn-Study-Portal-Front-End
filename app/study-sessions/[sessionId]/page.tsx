import React from 'react';
import AgentChatBox from '@/components/agent-chat/AgentChatBox';
import LessonContent from '@/components/lessons/LessonContent';

const mockLesson = {
  title: 'Introduction to AI-Powered Learning',
  content: 'Explore how AI can personalize your study sessions and help you master new skills efficiently.'
};

const followUpOptions = [
  'Review Key Concepts',
  'Take a Practice Quiz',
  'Ask the Agent a Question',
  'End Session'
];

interface PageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

const StudySessionPage = async ({ params }: PageProps) => {
  const { sessionId } = await params;
  
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Study Session</h1>
      <p className="text-gray-600 mb-4">Session ID: <span className="font-mono">{sessionId}</span></p>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <LessonContent lesson={mockLesson} />
      </div>
      <div className="bg-gray-50 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Chat with Z-Learn Agent</h2>
        <AgentChatBox _sessionId={sessionId} _mockMode />
      </div>
      <div className="flex flex-wrap gap-3">
        {followUpOptions.map(option => (
          <button
            key={option}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudySessionPage;

"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
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

const mockCourseMap: Record<string, { title: string }> = {
  'ai-mastery-session': { title: 'AI Mastery' },
  'web-design-session': { title: 'Modern Web Design' }
};

const StudySessionPage = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : Array.isArray(params.sessionId) ? params.sessionId[0] : '';
  const course = mockCourseMap[sessionId] || { title: 'Unknown Course' };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Study Session</h1>
      <p className="text-gray-600 mb-2">Course: <span className="font-semibold">{course.title}</span></p>
      <p className="text-gray-600 mb-4">Session ID: <span className="font-mono">{sessionId}</span></p>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <LessonContent lesson={mockLesson} />
      </div>
      <div className="bg-gray-50 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Chat with Z-Learn Agent</h2>
        <AgentChatBox _sessionId={sessionId} _mockMode />
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        {followUpOptions.map(option => (
          <button
            key={option}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        onClick={() => router.push(`/messages?course=${course.title}&session=${sessionId}`)}
      >
        View Messages
      </button>
    </div>
  );
};

export default StudySessionPage;

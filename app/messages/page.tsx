"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const mockMessages = [
  { sender: 'user', text: 'Hi, I need help with this lesson.' },
  { sender: 'agent', text: 'Of course! What would you like to know?' },
  { sender: 'user', text: 'Can you summarize the key points?' },
  { sender: 'agent', text: 'Here are the main takeaways: ...' }
];

function MessagesContent() {
  const searchParams = useSearchParams();
  const course = searchParams.get('course') || 'Unknown Course';
  const session = searchParams.get('session') || 'Unknown Session';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Messages</h1>
      <p className="text-gray-600 mb-2">Course: <span className="font-semibold">{course}</span></p>
      <p className="text-gray-600 mb-6">Session ID: <span className="font-mono">{session}</span></p>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {mockMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className={`px-3 py-2 rounded-lg text-sm max-w-xs break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>{msg.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}

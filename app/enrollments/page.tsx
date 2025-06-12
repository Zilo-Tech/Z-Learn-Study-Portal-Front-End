"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const mockEnrollments = [
  { id: 'ai-mastery', title: 'AI Mastery', instructor: 'Jane Doe', progress: 60 },
  { id: 'web-design', title: 'Modern Web Design', instructor: 'John Smith', progress: 30 }
];

const EnrollmentList = () => {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Enrollments</h1>
      <div className="space-y-6">
        {mockEnrollments.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${course.progress}%`}}></div>
              </div>
              <span className="text-sm text-gray-500">Progress: {course.progress}%</span>
            </div>
            <button
              className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => router.push(`/study-sessions/${course.id}-session`)}
            >
              Start Study Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollmentList;

import React from 'react';

interface LessonContentProps {
  lesson?: { title: string; content: string };
}

const LessonContent = ({ lesson }: LessonContentProps) => (
  <div className="space-y-2">
    <h2 className="text-2xl font-semibold mb-1">{lesson?.title || 'Lesson Title'}</h2>
    <p className="text-gray-700 mb-4">{lesson?.content || 'Lesson content goes here.'}</p>
    <div className="flex gap-2">
      <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Previous</button>
      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Next</button>
    </div>
  </div>
);

export default LessonContent;

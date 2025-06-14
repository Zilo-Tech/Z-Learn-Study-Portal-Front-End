import React from 'react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  date: string;
}

const AchievementList = ({ achievements }: { achievements: Achievement[] }) => (
  <div>
    <h2>Achievements</h2>
    <p>Displays user badges, credits, and milestones.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {achievements.map(a => (
        <div key={a.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
          <div className="text-4xl mb-2">{a.icon}</div>
          <div className="font-semibold text-lg mb-1">{a.title}</div>
          <div className="text-gray-500 text-sm mb-2">{a.description}</div>
          <div className="text-xs text-gray-400">{a.date}</div>
        </div>
      ))}
    </div>
  </div>
);

export default AchievementList;

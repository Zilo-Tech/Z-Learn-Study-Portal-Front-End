import React from 'react';
import AchievementList from '@/components/achievements/AchievementList';

const mockAchievements = [
  { id: 1, title: 'AI Explorer', description: 'Completed your first AI-powered course', icon: '🤖', date: '2025-06-01' },
  { id: 2, title: 'Streak Master', description: 'Studied 7 days in a row', icon: '🔥', date: '2025-06-05' },
  { id: 3, title: 'Quiz Whiz', description: 'Scored 100% on a practice quiz', icon: '🏅', date: '2025-06-10' },
  { id: 4, title: 'Community Helper', description: 'Answered 5 peer questions', icon: '💬', date: '2025-06-11' },
];

const AchievementsPage = () => (
  <div className="max-w-4xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-2">Your Achievements</h1>
    <p className="text-gray-600 mb-6">List of badges, credits, and milestones you have earned.</p>
    <AchievementList achievements={mockAchievements} />
  </div>
);

export default AchievementsPage;

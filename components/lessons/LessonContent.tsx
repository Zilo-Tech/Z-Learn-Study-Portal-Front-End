import React, { useState } from 'react';
import LessonAssessmentModal from './LessonAssessmentModal';
import api from '@/lib/api';

interface AssessmentQuestion {
  id: number;
  text: string;
  choices: string[];
  correct_answer: string;
  explanation?: string;
}
interface Assessment {
  id: number;
  course: number;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

interface LessonContentProps {
  lesson?: { title: string; content: string; id?: number; course_id?: number };
  onContinue?: () => void;
}

const LessonContent = ({ lesson, onContinue }: LessonContentProps) => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    if (!lesson?.id) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch assessment for this lesson
      const res = await api.post(`/lessons/${lesson.id}/generate-quiz/`);
      setAssessment(res.data.assessment ? res.data.assessment : res.data);
      setShowAssessment(true);
    } catch {
      setError('Failed to load assessment.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentContinue = () => {
    setShowAssessment(false);
    if (onContinue) onContinue();
  };

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold mb-1">{lesson?.title || 'Lesson Title'}</h2>
      <p className="text-gray-700 mb-4">{lesson?.content || 'Lesson content goes here.'}</p>
      <div className="flex gap-2">
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Previous</button>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? 'Loading Quiz...' : 'Next'}
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {showAssessment && assessment && (
        <LessonAssessmentModal
          open={showAssessment}
          onClose={() => setShowAssessment(false)}
          assessment={assessment}
          onContinue={handleAssessmentContinue}
        />
      )}
    </div>
  );
};

export default LessonContent;

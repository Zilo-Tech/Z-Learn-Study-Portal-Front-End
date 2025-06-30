import React, { useState } from 'react';

interface AssessmentQuestion {
  id: number;
  text: string;
  choices: string[];
  correct_answer: string; // Now a letter (e.g., 'A', 'B', 'C', ...)
  explanation?: string;
}

interface Assessment {
  id: number;
  course: number;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

interface LessonAssessmentModalProps {
  open: boolean;
  onClose: () => void;
  assessment: Assessment;
  onContinue: () => void;
}

const getChoiceLetter = (choice: string) => {
  // Extracts 'A', 'B', etc. from 'A) ...'
  const match = choice.match(/^(\w)\)/);
  return match ? match[1] : '';
};

const LessonAssessmentModal: React.FC<LessonAssessmentModalProps> = ({ open, onClose, assessment, onContinue }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!open) return null;

  const handleSelect = (questionId: number, choice: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: choice }));
  };

  const handleSubmit = () => {
    let correct = 0;
    assessment.questions.forEach(q => {
      const selectedLetter = getChoiceLetter(answers[q.id] || '');
      if (selectedLetter === q.correct_answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-0 sm:p-8 flex flex-col max-h-[90vh] min-h-[300px]"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <div className="px-6 pt-8 pb-4 flex-1 flex flex-col overflow-y-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">{assessment.title}</h2>
          <p className="mb-6 text-gray-600 text-center">{assessment.description}</p>
          <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="flex-1 flex flex-col gap-6 overflow-y-auto">
            {assessment.questions.map(q => (
              <div key={q.id} className="mb-2">
                <div className="font-medium mb-2 text-base">{q.text}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.choices.map(choice => {
                    const isSelected = answers[q.id] === choice;
                    const selectedLetter = getChoiceLetter(choice);
                    const isCorrect = submitted && selectedLetter === q.correct_answer;
                    const isWrong = submitted && isSelected && selectedLetter !== q.correct_answer;
                    return (
                      <label key={choice} className={`block px-4 py-3 rounded-xl border cursor-pointer transition-colors text-base
                        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                        ${submitted && isCorrect ? 'border-green-500 bg-green-50' : ''}
                        ${submitted && isWrong ? 'border-red-500 bg-red-50' : ''}
                        hover:border-blue-400 hover:bg-blue-50
                      `}>
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={choice}
                          disabled={submitted}
                          checked={isSelected}
                          onChange={() => handleSelect(q.id, choice)}
                          className="mr-2 accent-blue-600"
                        />
                        {choice}
                        {submitted && isCorrect && <span className="ml-2 text-green-600 font-bold">✔</span>}
                        {submitted && isWrong && <span className="ml-2 text-red-600 font-bold">✗</span>}
                      </label>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <div className="mt-2 text-sm text-blue-700 bg-blue-50 rounded p-2">
                    <span className="font-semibold">Explanation:</span> {q.explanation}
                  </div>
                )}
              </div>
            ))}
            {!submitted ? (
              <button
                type="submit"
                className="w-full py-3 px-4 bg-brand text-white rounded-xl font-semibold mt-4 hover:bg-brand/90 transition-colors text-lg shadow"
              >
                Submit Answers
              </button>
            ) : (
              <div className="mt-6 text-center">
                <div className="text-lg font-semibold mb-2">Score: {score} / {assessment.questions.length}</div>
                <button
                  onClick={onContinue}
                  className="mt-2 w-full py-3 px-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors text-lg shadow"
                >
                  Continue Learning
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LessonAssessmentModal;

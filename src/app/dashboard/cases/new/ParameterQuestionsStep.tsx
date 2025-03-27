'use client';

import { useState, useEffect } from 'react';
import { ParameterQuestion, ParameterQuestionSet, ParameterSelections, LearningObjective } from '@/types/case';
import { generateCaseParameterQuestions } from '@/lib/api/ai-service';
import { toast } from 'react-hot-toast';

interface ParameterQuestionsStepProps {
  objectives: LearningObjective[];
  onComplete: (parameterSelections: ParameterSelections) => void;
  onBack: () => void;
}

export default function ParameterQuestionsStep({
  objectives,
  onComplete,
  onBack
}: ParameterQuestionsStepProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionSet, setQuestionSet] = useState<ParameterQuestionSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selections, setSelections] = useState<ParameterSelections>({});
  
  // Fetch parameter questions based on learning objectives
  useEffect(() => {
    async function fetchQuestions() {
      if (objectives.length === 0) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Extract just the text from learning objectives
        const objectiveTexts = objectives.map(obj => obj.text);
        const result = await generateCaseParameterQuestions(objectiveTexts);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        if (!result.questions || !Array.isArray(result.questions)) {
          throw new Error('Invalid response format: missing questions array');
        }
        
        setQuestionSet({ questions: result.questions });
      } catch (err) {
        console.error('Error generating parameter questions:', err);
        setError('Failed to generate case parameter questions. Please try again.');
        toast.error('Failed to generate questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchQuestions();
  }, [objectives]);
  
  // Handle option selection
  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelections({
      ...selections,
      [questionId]: optionId
    });
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (!questionSet) return;
    
    if (currentQuestionIndex < questionSet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, proceed to completion
      onComplete(selections);
    }
  };
  
  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // At first question, go back to previous step
      onBack();
    }
  };
  
  // Determine if current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (!questionSet) return false;
    const currentQuestion = questionSet.questions[currentQuestionIndex];
    return !!selections[currentQuestion.id];
  };
  
  // Render the current question
  const renderCurrentQuestion = () => {
    if (!questionSet || questionSet.questions.length === 0) return null;
    
    const currentQuestion = questionSet.questions[currentQuestionIndex];
    const selectedOptionId = selections[currentQuestion.id];
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 text-sm font-medium text-primary-600">
          {currentQuestion.category}
        </div>
        
        <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
        
        <div className="mb-6">
          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <div key={option.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={option.id}
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={selectedOptionId === option.id}
                    onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={option.id} className="font-medium text-gray-700">
                    {option.text}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary-50 border border-primary-100 rounded-md p-4 mb-6">
          <h4 className="font-medium text-primary-800 mb-1">Why this matters:</h4>
          <p className="text-sm text-primary-700">{currentQuestion.rationale}</p>
        </div>
        
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questionSet.questions.length}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={goToPreviousQuestion}
              className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {currentQuestionIndex === 0 ? 'Back' : 'Previous'}
            </button>
            <button
              onClick={goToNextQuestion}
              disabled={!isCurrentQuestionAnswered()}
              className="btn-primary"
            >
              {currentQuestionIndex === questionSet.questions.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Generating Case Parameters</h2>
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Analyzing learning objectives and generating parameter questions...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Case Parameters</h2>
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex justify-between">
            <button 
              onClick={onBack} 
              className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button 
              onClick={() => {
                setIsLoading(true);
                setError(null);
                // Extract just the text from learning objectives
                const objectiveTexts = objectives.map(obj => obj.text);
                generateCaseParameterQuestions(objectiveTexts)
                  .then(result => {
                    if (result.error) throw new Error(result.error);
                    setQuestionSet({ questions: result.questions });
                    setIsLoading(false);
                  })
                  .catch(err => {
                    setError('Failed to generate questions. Please try again.');
                    setIsLoading(false);
                  });
              }} 
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render questions
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Define Case Parameters</h2>
      
      {/* Progress bar */}
      {questionSet && (
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500" 
              style={{ 
                width: `${(Object.keys(selections).length / questionSet.questions.length) * 100}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Parameters Defined</span>
            <span>{Object.keys(selections).length} of {questionSet.questions.length}</span>
          </div>
        </div>
      )}
      
      {renderCurrentQuestion()}
    </div>
  );
} 
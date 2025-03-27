'use client';

import { useState } from 'react';
import { LearningObjective, ParameterSelections } from '@/types/case';
import ParameterQuestionsStep from '../dashboard/cases/new/ParameterQuestionsStep';

export default function TestParametersPage() {
  // Sample learning objectives for testing
  const sampleObjectives: LearningObjective[] = [
    {
      id: '1',
      text: 'Recognize the clinical presentation of an acute exacerbation of COPD.',
      category: 'clinical',
      isRefined: true
    },
    {
      id: '2',
      text: 'Demonstrate appropriate management of hypoxemia in a COPD patient.',
      category: 'clinical',
      isRefined: true
    },
    {
      id: '3',
      text: 'Communicate effectively with the patient about management options and disease progression.',
      category: 'communication',
      isRefined: true
    }
  ];
  
  const [parameterSelections, setParameterSelections] = useState<ParameterSelections>({});
  const [completed, setCompleted] = useState(false);
  
  const handleParameterComplete = (selections: ParameterSelections) => {
    setParameterSelections(selections);
    setCompleted(true);
    console.log('Parameter selections:', selections);
  };
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="pb-5 border-b border-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Test Parameter Questions</h1>
        <p className="mt-2 text-gray-600">
          This page tests the parameter questions generation and selection interface.
        </p>
      </div>
      
      {!completed ? (
        <ParameterQuestionsStep 
          objectives={sampleObjectives}
          onComplete={handleParameterComplete}
          onBack={() => console.log('Back button clicked')}
        />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Parameter Selections Complete</h2>
          <p className="mb-4">The following parameter selections were made:</p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6 overflow-auto">
            <pre className="text-sm">{JSON.stringify(parameterSelections, null, 2)}</pre>
          </div>
          
          <button
            onClick={() => setCompleted(false)}
            className="btn-primary"
          >
            Test Again
          </button>
        </div>
      )}
    </div>
  );
} 
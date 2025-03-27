'use client';

import { useState } from 'react';
import Link from 'next/link';
import { analyzeObjectives } from '@/lib/api/ai-service';
import { LearningObjective } from '@/types/case';
import { toast } from 'react-hot-toast';
import ObjectivesAnalysisStep from './ObjectivesAnalysisStep';

// Step identifiers for the workflow
type CreationStep =
  | 'method'
  | 'templates'
  | 'importCase'
  | 'objectives'
  | 'aiAnalysis'
  | 'refinement'
  | 'finalObjectives'
  | 'parameters'
  | 'answers'
  | 'drafting'
  | 'review'
  | 'complete';

export default function NewCasePage() {
  const [currentStep, setCurrentStep] = useState<CreationStep>('method');
  const [creationMethod, setCreationMethod] = useState<'scratch' | 'template' | 'import' | null>(null);
  const [objectives, setObjectives] = useState<LearningObjective[]>([]);
  const [suggestedObjectives, setSuggestedObjectives] = useState<LearningObjective[]>([]);
  const [finalObjectives, setFinalObjectives] = useState<LearningObjective[]>([]);
  const [newObjective, setNewObjective] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to handle method selection
  const handleMethodSelect = (method: 'scratch' | 'template' | 'import') => {
    setCreationMethod(method);
    if (method === 'scratch') {
      setCurrentStep('objectives');
    } else if (method === 'template') {
      setCurrentStep('templates');
    } else {
      setCurrentStep('importCase');
    }
  };

  // Function to add a new learning objective
  const addObjective = () => {
    if (newObjective.trim()) {
      const objective: LearningObjective = {
        id: Date.now().toString(),
        text: newObjective.trim(),
        category: 'clinical',
        isRefined: false,
      };
      setObjectives([...objectives, objective]);
      setNewObjective('');
    }
  };

  // Function to proceed to the AI analysis step
  const proceedToAnalysis = () => {
    if (objectives.length === 0) {
      toast.error('Please add at least one learning objective');
      return;
    }
    setCurrentStep('aiAnalysis');
  };

  // Function to handle completed analysis
  const handleAnalysisComplete = (refinedObjectives: LearningObjective[]) => {
    setFinalObjectives(refinedObjectives);
    setCurrentStep('finalObjectives');
  };

  // Function to render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'method':
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Select Case Creation Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => handleMethodSelect('scratch')}
                className="flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50"
              >
                <svg className="w-16 h-16 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="text-lg font-medium">Start from Scratch</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Create a completely new case with custom learning objectives
                </p>
              </button>
              
              <button
                onClick={() => handleMethodSelect('template')}
                className="flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50"
              >
                <svg className="w-16 h-16 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <h3 className="text-lg font-medium">Use Template</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Start with a pre-built template for common clinical scenarios
                </p>
              </button>
              
              <button
                onClick={() => handleMethodSelect('import')}
                className="flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50"
              >
                <svg className="w-16 h-16 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <h3 className="text-lg font-medium">Import Existing</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Import and modify an existing case from your library
                </p>
              </button>
            </div>
          </div>
        );
      
      case 'objectives':
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Define Learning Objectives</h2>
            <p className="text-gray-600 mb-6">
              Enter the learning objectives for your simulation case. These will guide the AI in creating appropriate case elements.
            </p>
            
            <div className="space-y-4 mb-6">
              {objectives.map((objective, index) => (
                <div key={objective.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-700">{index + 1}. {objective.text}</span>
                  <button 
                    onClick={() => setObjectives(objectives.filter(o => o.id !== objective.id))}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3 mb-8">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Enter a learning objective..."
                className="flex-grow input"
                onKeyDown={(e) => e.key === 'Enter' && addObjective()}
              />
              <button onClick={addObjective} className="btn-primary">
                Add
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mb-8">
              <h3 className="text-md font-medium text-blue-800 mb-2">Tips for effective learning objectives:</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1 text-sm">
                <li>Use measurable verbs (analyze, evaluate, demonstrate)</li>
                <li>Be specific about what the learner should accomplish</li>
                <li>Focus on outcomes rather than processes</li>
                <li>Ensure objectives align with desired competencies</li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button onClick={() => setCurrentStep('method')} className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                Back
              </button>
              <button 
                onClick={proceedToAnalysis} 
                className="btn-primary"
                disabled={objectives.length === 0}
              >
                Analyze Objectives
              </button>
            </div>
          </div>
        );
      
      case 'aiAnalysis':
        return (
          <ObjectivesAnalysisStep
            objectives={objectives}
            onComplete={handleAnalysisComplete}
            onBack={() => setCurrentStep('objectives')}
          />
        );
      
      case 'finalObjectives':
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Final Learning Objectives</h2>
            <p className="text-gray-600 mb-6">
              These are the final learning objectives that will guide your simulation case design.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <h3 className="text-md font-medium text-green-800 mb-2">Selected Objectives:</h3>
              <ul className="space-y-2">
                {finalObjectives.map((obj, index) => (
                  <li key={obj.id} className="flex items-baseline">
                    <span className="text-green-500 mr-2">{index + 1}.</span>
                    <span className="text-green-700">{obj.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button onClick={() => setCurrentStep('aiAnalysis')} className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                Back to AI Analysis
              </button>
              <button 
                onClick={() => setCurrentStep('parameters')} 
                className="btn-primary"
              >
                Continue to Case Parameters
              </button>
            </div>
          </div>
        );
        
      // Placeholder for other steps
      default:
        return (
          <div className="max-w-3xl mx-auto text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Step Under Development</h2>
            <p className="text-gray-600 mb-8">
              This part of the workflow is currently under development.
            </p>
            <Link href="/dashboard" className="btn-primary">
              Return to Dashboard
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="pb-12">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Simulation Case</h1>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8 px-4">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
            <div
              style={{ width: 
                currentStep === 'method' ? '10%' : 
                currentStep === 'templates' || currentStep === 'importCase' || currentStep === 'objectives' ? '20%' :
                currentStep === 'aiAnalysis' || currentStep === 'refinement' ? '40%' :
                currentStep === 'finalObjectives' || currentStep === 'parameters' ? '60%' :
                currentStep === 'answers' || currentStep === 'drafting' ? '80%' : '100%'
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
            ></div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-white shadow rounded-lg p-6">
        {renderStepContent()}
      </div>
    </div>
  );
} 
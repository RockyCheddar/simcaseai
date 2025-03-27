'use client';

import { useState } from 'react';
import { generateCase } from '@/lib/api/ai-service';
import { CaseParameters, LearningObjective } from '@/types/case';
import MarkdownPreview from '@/components/MarkdownPreview';
import { toast } from 'react-hot-toast';

export default function TestCaseGenerationPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCase, setGeneratedCase] = useState<{ text: string; title: string } | null>(null);
  
  // Sample case parameters for testing
  const sampleParameters: CaseParameters = {
    demographics: {
      ageRange: '65-75 years',
      gender: 'Male',
      occupation: 'Retired teacher',
      socialContext: 'Lives with spouse',
      relevantHistory: ['20-year smoking history', 'Sedentary lifestyle']
    },
    clinicalContext: {
      setting: 'Emergency Department',
      acuityLevel: 'Urgent',
      availableResources: [
        'Basic vital sign equipment',
        'Emergency medications',
        'Oxygen therapy',
        'ECG monitor',
        'Access to laboratory testing'
      ],
      timelineSpan: '4 hours'
    },
    complexity: {
      primaryConditionSeverity: 'Moderate',
      comorbidities: ['Hypertension', 'Type 2 Diabetes'],
      communicationChallenges: ['Mild hearing impairment'],
      abnormalFindings: ['Wheezing', 'Accessory muscle use']
    },
    educationalElements: {
      documentationTypes: ['Emergency department notes', 'Nursing assessment', 'Medication administration record'],
      learnerDecisionPoints: ['Initial assessment', 'Medication choices', 'Discharge planning'],
      criticalActions: ['Oxygen administration', 'Bronchodilator therapy', 'Patient education'],
      assessmentFocus: ['Respiratory assessment', 'Medication knowledge']
    },
    recommendedVitalSigns: {
      heartRate: { min: 90, max: 110 },
      respiratoryRate: { min: 22, max: 28 },
      bloodPressure: {
        systolic: { min: 140, max: 160 },
        diastolic: { min: 85, max: 95 }
      },
      temperature: { min: 37.0, max: 37.8 },
      oxygenSaturation: { min: 88, max: 92 },
      consciousness: 'Alert'
    },
    learningObjectives: [
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
    ]
  };
  
  const handleGenerateCase = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateCase(sampleParameters);
      setGeneratedCase(result);
      toast.success('Case generated successfully!');
    } catch (error) {
      console.error('Error generating case:', error);
      toast.error('Failed to generate case. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="pb-5 border-b border-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Test Case Generation</h1>
        <p className="mt-2 text-gray-600">
          This page tests the simulation case generation using sample parameters.
        </p>
      </div>
      
      {!generatedCase ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generate a Sample Case</h2>
          <p className="mb-6 text-gray-700">
            Click the button below to generate a sample simulation case for a COPD exacerbation scenario.
          </p>
          
          {isGenerating ? (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-600">Generating your case, please wait...</p>
            </div>
          ) : (
            <button
              onClick={handleGenerateCase}
              className="btn-primary"
              disabled={isGenerating}
            >
              Generate Sample Case
            </button>
          )}
        </div>
      ) : (
        <div>
          <MarkdownPreview 
            markdown={generatedCase.text} 
            title={generatedCase.title}
          />
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setGeneratedCase(null)}
              className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Generate Another Case
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
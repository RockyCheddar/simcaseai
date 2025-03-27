'use client';

import { useState } from 'react';
import { LearningObjective, ParameterSelections, CaseParameters } from '@/types/case';
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
  const [caseParameters, setCaseParameters] = useState<CaseParameters | null>(null);
  const [completed, setCompleted] = useState(false);
  
  const handleParameterComplete = (selections: ParameterSelections, mappedParameters: CaseParameters) => {
    setParameterSelections(selections);
    setCaseParameters(mappedParameters);
    setCompleted(true);
    console.log('Parameter selections:', selections);
    console.log('Mapped parameters:', mappedParameters);
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
          
          {/* Mapped parameters section */}
          {caseParameters && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Mapped Case Parameters</h3>
              <div className="space-y-4">
                {/* Demographics */}
                <div>
                  <h4 className="font-semibold text-primary-600">Demographics</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><span className="font-medium">Age:</span> {caseParameters.demographics.ageRange}</p>
                    {caseParameters.demographics.gender && <p><span className="font-medium">Gender:</span> {caseParameters.demographics.gender}</p>}
                    {caseParameters.demographics.socialContext && <p><span className="font-medium">Social Context:</span> {caseParameters.demographics.socialContext}</p>}
                  </div>
                </div>
                
                {/* Clinical Context */}
                <div>
                  <h4 className="font-semibold text-primary-600">Clinical Context</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><span className="font-medium">Setting:</span> {caseParameters.clinicalContext.setting}</p>
                    <p><span className="font-medium">Acuity:</span> {caseParameters.clinicalContext.acuityLevel}</p>
                  </div>
                </div>
                
                {/* Vital Signs */}
                <div>
                  <h4 className="font-semibold text-primary-600">Recommended Vital Signs</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="font-medium">HR:</span> {caseParameters.recommendedVitalSigns.heartRate.min}-{caseParameters.recommendedVitalSigns.heartRate.max} bpm</p>
                      <p><span className="font-medium">RR:</span> {caseParameters.recommendedVitalSigns.respiratoryRate.min}-{caseParameters.recommendedVitalSigns.respiratoryRate.max} /min</p>
                      <p><span className="font-medium">BP:</span> {caseParameters.recommendedVitalSigns.bloodPressure.systolic.min}-{caseParameters.recommendedVitalSigns.bloodPressure.systolic.max}/{caseParameters.recommendedVitalSigns.bloodPressure.diastolic.min}-{caseParameters.recommendedVitalSigns.bloodPressure.diastolic.max} mmHg</p>
                      <p><span className="font-medium">SpO2:</span> {caseParameters.recommendedVitalSigns.oxygenSaturation.min}-{caseParameters.recommendedVitalSigns.oxygenSaturation.max}%</p>
                      <p><span className="font-medium">Temp:</span> {caseParameters.recommendedVitalSigns.temperature.min}-{caseParameters.recommendedVitalSigns.temperature.max}°C</p>
                      <p><span className="font-medium">Level of Consciousness:</span> {caseParameters.recommendedVitalSigns.consciousness}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-medium mb-3">Raw Parameter Selections</h3>
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
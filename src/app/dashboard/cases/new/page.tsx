'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LearningObjective, ParameterSelections, CaseParameters } from '@/types/case';
import { toast } from 'react-hot-toast';
import ObjectivesAnalysisStep from './ObjectivesAnalysisStep';
import ParameterQuestionsStep from './ParameterQuestionsStep';
import MarkdownPreview from '@/components/MarkdownPreview';
import AIGenerationLoader from '@/components/AIGenerationLoader';
import { useRouter } from 'next/navigation';
import useAICase from '@/hooks/useAICase';
import { Tab } from '@headlessui/react';
import CaseTabs from '@/components/CaseTabs';
import { DynamicSection } from '@/utils/contentClassifier';

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
  | 'drafting'
  | 'generating'
  | 'preview'
  | 'review'
  | 'complete';

// Define StructuredCaseData interface 
interface StructuredCaseData {
  title: string;
  rawText: string;
  overview: {
    caseSummary?: string;
    status?: string;
    createdDate?: string;
    updatedDate?: string;
    clinicalSetting?: string;
    learningObjectives?: string[];
  };
  patientInfo: {
    name?: string;
    age?: string;
    gender?: string;
    occupation?: string;
    chiefComplaint?: string;
    briefHistory?: string;
    conditions?: string[];
    medications?: { name: string; dosage: string }[];
    allergies?: { allergen: string; reaction: string }[];
    livingSituation?: string;
    socialContext?: string;
    [key: string]: any;
  };
  presentation: {
    vitalSigns?: any[];
    physicalExam?: any[];
    diagnosticStudies?: any[];
    doctorNotes?: any[];
    [key: string]: any;
  };
  treatment: {
    initialManagement?: any[];
    treatmentPlan?: any;
    progressionScenarios?: any[];
    clinicalCourse?: any;
    [key: string]: any;
  };
  simulation: {
    nursingCompetencies?: any[];
    questionsToConsider?: any[];
    gradingRubric?: any[];
    skillsAssessment?: any[];
    debriefingPoints?: string[];
    teachingPlan?: string;
    [key: string]: any;
  };
  dynamicSections: {
    overview: DynamicSection[];
    'patient-info': DynamicSection[];
    presentation: DynamicSection[];
    treatment: DynamicSection[];
    simulation: DynamicSection[];
  };
}

export default function NewCasePage() {
  const [currentStep, setCurrentStep] = useState<CreationStep>('method');
  const [creationMethod, setCreationMethod] = useState<'scratch' | 'template' | 'import' | null>(null);
  const [objectives, setObjectives] = useState<LearningObjective[]>([]);
  const [suggestedObjectives, setSuggestedObjectives] = useState<LearningObjective[]>([]);
  const [finalObjectives, setFinalObjectives] = useState<LearningObjective[]>([]);
  const [parameterSelections, setParameterSelections] = useState<ParameterSelections>({});
  const [caseParameters, setCaseParameters] = useState<CaseParameters | null>(null);
  const [generatedCase, setGeneratedCase] = useState<StructuredCaseData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newObjective, setNewObjective] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Use our new AI hook
  const { generateCase } = useAICase();

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

  // Function to move to parameters step
  const proceedToParameters = () => {
    setCurrentStep('parameters');
  };

  // Function to handle completed parameter questions
  const handleParametersComplete = (selections: ParameterSelections, mappedParameters: CaseParameters) => {
    setParameterSelections(selections);
    setCaseParameters(mappedParameters);
    setCurrentStep('drafting'); // Or the next appropriate step
    toast.success('Case parameters defined successfully!');
  };

  // Function to generate the case
  const handleGenerateCase = async () => {
    if (!caseParameters) {
      toast.error('Case parameters are missing');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');

    try {
      const result = await generateCase(caseParameters);
      setGeneratedCase(result);
      setCurrentStep('preview');
      toast.success('Case generated successfully!');
    } catch (error) {
      console.error('Error generating case:', error);
      toast.error('Failed to generate case. Please try again.');
      setCurrentStep('drafting');
    } finally {
      setIsGenerating(false);
    }
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
            <h2 className="text-xl font-semibold mb-6">Refined Learning Objectives</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="text-gray-700 mb-4">
                The AI has refined your learning objectives to ensure they are specific, measurable, and aligned with healthcare education best practices.
              </p>
              
              <h3 className="text-md font-medium mb-3">Final Learning Objectives:</h3>
              <ul className="space-y-3">
                {finalObjectives.map((obj, index) => (
                  <li key={obj.id} className="flex items-baseline">
                    <span className="text-primary-600 mr-2">{index + 1}.</span>
                    <span className="text-gray-800">{obj.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setCurrentStep('aiAnalysis')} 
                className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Analysis
              </button>
              <button 
                onClick={proceedToParameters} 
                className="btn-primary"
              >
                Define Case Parameters
              </button>
            </div>
          </div>
        );
        
      case 'parameters':
        return (
          <ParameterQuestionsStep
            objectives={finalObjectives}
            onComplete={handleParametersComplete}
            onBack={() => setCurrentStep('finalObjectives')}
          />
        );
      
      case 'drafting':
        // Display the mapped parameters for review
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Case Parameters Defined</h2>
            
            {caseParameters && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <p className="text-gray-700 mb-6">
                  Based on your selections, the following parameters will be used to generate your simulation case:
                </p>
                
                <div className="space-y-6">
                  {/* Demographics section */}
                  <div>
                    <h3 className="text-md font-semibold mb-2 text-primary-600">Patient Demographics</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Age Range:</span>
                          <p className="text-gray-800">{caseParameters.demographics.ageRange}</p>
                        </div>
                        {caseParameters.demographics.gender && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Gender:</span>
                            <p className="text-gray-800">{caseParameters.demographics.gender}</p>
                          </div>
                        )}
                        {caseParameters.demographics.occupation && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Occupation:</span>
                            <p className="text-gray-800">{caseParameters.demographics.occupation}</p>
                          </div>
                        )}
                        {caseParameters.demographics.socialContext && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Social Context:</span>
                            <p className="text-gray-800">{caseParameters.demographics.socialContext}</p>
                          </div>
                        )}
                      </div>
                      
                      {caseParameters.demographics.relevantHistory && caseParameters.demographics.relevantHistory.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-500">Relevant History:</span>
                          <ul className="list-disc pl-5 mt-1 text-gray-800">
                            {caseParameters.demographics.relevantHistory.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Clinical Context section */}
                  <div>
                    <h3 className="text-md font-semibold mb-2 text-primary-600">Clinical Context</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Setting:</span>
                          <p className="text-gray-800">{caseParameters.clinicalContext.setting}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Acuity Level:</span>
                          <p className="text-gray-800">{caseParameters.clinicalContext.acuityLevel}</p>
                        </div>
                        {caseParameters.clinicalContext.timelineSpan && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Timeline:</span>
                            <p className="text-gray-800">{caseParameters.clinicalContext.timelineSpan}</p>
                          </div>
                        )}
                      </div>
                      
                      {caseParameters.clinicalContext.availableResources.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-500">Available Resources:</span>
                          <ul className="list-disc pl-5 mt-1 text-gray-800">
                            {caseParameters.clinicalContext.availableResources.map((resource, index) => (
                              <li key={index}>{resource}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Complexity section */}
                  <div>
                    <h3 className="text-md font-semibold mb-2 text-primary-600">Presentation Complexity</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Primary Condition Severity:</span>
                        <p className="text-gray-800">{caseParameters.complexity.primaryConditionSeverity}</p>
                      </div>
                      
                      {caseParameters.complexity.comorbidities.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-500">Comorbidities:</span>
                          <ul className="list-disc pl-5 mt-1 text-gray-800">
                            {caseParameters.complexity.comorbidities.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {caseParameters.complexity.communicationChallenges.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-500">Communication Challenges:</span>
                          <ul className="list-disc pl-5 mt-1 text-gray-800">
                            {caseParameters.complexity.communicationChallenges.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Vital Signs section */}
                  <div>
                    <h3 className="text-md font-semibold mb-2 text-primary-600">Recommended Vital Signs</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Heart Rate:</span>
                          <p className="text-gray-800">{caseParameters.recommendedVitalSigns.heartRate.min}-{caseParameters.recommendedVitalSigns.heartRate.max} bpm</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Respiratory Rate:</span>
                          <p className="text-gray-800">{caseParameters.recommendedVitalSigns.respiratoryRate.min}-{caseParameters.recommendedVitalSigns.respiratoryRate.max} /min</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Blood Pressure:</span>
                          <p className="text-gray-800">{caseParameters.recommendedVitalSigns.bloodPressure.systolic.min}-{caseParameters.recommendedVitalSigns.bloodPressure.systolic.max}/{caseParameters.recommendedVitalSigns.bloodPressure.diastolic.min}-{caseParameters.recommendedVitalSigns.bloodPressure.diastolic.max} mmHg</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Temperature:</span>
                          <p className="text-gray-800">{caseParameters.recommendedVitalSigns.temperature.min}-{caseParameters.recommendedVitalSigns.temperature.max}°C</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Oxygen Saturation:</span>
                          <p className="text-gray-800">{caseParameters.recommendedVitalSigns.oxygenSaturation.min}-{caseParameters.recommendedVitalSigns.oxygenSaturation.max}%</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Consciousness:</span>
                          <p className="text-gray-800">{caseParameters.recommendedVitalSigns.consciousness}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={() => setCurrentStep('parameters')} 
                    className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Back to Parameters
                  </button>
                  <button 
                    onClick={handleGenerateCase} 
                    className="btn-primary"
                    disabled={isGenerating}
                  >
                    Generate Case
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'generating':
        return (
          <div className="max-w-3xl mx-auto">
            <AIGenerationLoader mode="case" />
          </div>
        );
      
      case 'preview':
        return (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Your Generated Simulation Case</h2>
            
            {generatedCase ? (
              <div className="mb-6">
                <CaseTabs 
                  tabs={[
                    { name: 'Overview', current: true },
                    { name: 'Patient Info', current: false },
                    { name: 'Presentation', current: false },
                    { name: 'Treatment', current: false },
                    { name: 'Simulation Learning', current: false },
                  ]}
                  caseData={generatedCase}
                />
                
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={() => setCurrentStep('drafting')} 
                    className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Back to Parameters
                  </button>
                  <button 
                    onClick={() => {
                      try {
                        // Create a full case data object
                        const fullCaseData = {
                          id: generatedCase.title ? generatedCase.title.replace(/\s+/g, '-').toLowerCase() : `case-${Date.now()}`,
                          title: generatedCase.title,
                          rawText: generatedCase.rawText,
                          status: "complete",
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          overview: generatedCase.overview,
                          patientInfo: generatedCase.patientInfo,
                          presentation: generatedCase.presentation,
                          treatment: generatedCase.treatment,
                          simulation: generatedCase.simulation,
                          dynamicSections: generatedCase.dynamicSections,
                          parameters: caseParameters
                        };
                        
                        // Save to localStorage
                        localStorage.setItem(`case-${fullCaseData.id}`, JSON.stringify(fullCaseData));
                        toast.success('Case saved successfully!');
                        
                        // Redirect to the case detail page with the new case ID
                        router.push(`/dashboard/cases/${fullCaseData.id}`);
                      } catch (error) {
                        console.error('Error saving case:', error);
                        toast.error('Failed to save case. Please try again.');
                      }
                    }} 
                    className="btn-primary"
                  >
                    Save Case
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
                <p className="text-red-700 mb-4">No case was generated. Please try again.</p>
                <button
                  onClick={() => setCurrentStep('drafting')}
                  className="btn-primary"
                >
                  Back to Parameters
                </button>
              </div>
            )}
          </div>
        );
        
      case 'complete':
        return (
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Simulation Case Created!</h2>
              <p className="text-gray-600 mb-8">
                Your simulation case has been successfully created and saved.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/dashboard/cases" className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  View All Cases
                </Link>
                <Link href="/dashboard" className="btn-primary">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Unknown Step</h2>
            <p>Please go back to the beginning and try again.</p>
            <button 
              onClick={() => setCurrentStep('method')} 
              className="btn-primary mt-4"
            >
              Start Over
            </button>
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
                currentStep === 'aiAnalysis' || currentStep === 'finalObjectives' ? '40%' :
                currentStep === 'parameters' ? '60%' :
                currentStep === 'drafting' || currentStep === 'generating' ? '80%' :
                currentStep === 'preview' || currentStep === 'complete' ? '100%' : '0%'
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
            ></div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`${currentStep === 'preview' ? 'bg-transparent' : 'bg-white shadow rounded-lg'} p-6`}>
        {renderStepContent()}
      </div>
    </div>
  );
} 
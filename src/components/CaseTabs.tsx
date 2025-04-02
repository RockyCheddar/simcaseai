import { Tab } from '@headlessui/react';
import { classNames } from '@/utils/classNames';
import { DynamicSection } from '@/utils/contentClassifier';

import OverviewTab from './OverviewTab';
import PatientInfoTab from './PatientInfoTab';
import PresentationTab from './PresentationTab';
import TreatmentTab from './TreatmentTab';
import SimulationLearningTab from './SimulationLearningTab';

interface TabDefinition {
  name: string;
  current: boolean;
}

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
    initialAssessment?: string;
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

interface CaseTabsProps {
  tabs: TabDefinition[];
  caseData: StructuredCaseData;
  children?: React.ReactNode;
}

export default function CaseTabs({ tabs, caseData, children }: CaseTabsProps) {
  return (
    <div className="w-full">
      <Tab.Group>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'w-1/5 border-b-2 py-4 px-1 text-center text-sm font-medium'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </nav>
        </div>
        <div className="mt-4">
          <Tab.Panels>
            {/* Overview Tab */}
            <Tab.Panel>
              <OverviewTab 
                caseData={{
                  status: caseData.overview.status || 'Draft',
                  createdDate: caseData.overview.createdDate || new Date().toISOString(),
                  updatedDate: caseData.overview.updatedDate || new Date().toISOString(),
                  clinicalSetting: caseData.overview.clinicalSetting || '',
                  learningObjectives: caseData.overview.learningObjectives || [],
                  patientName: caseData.patientInfo.name || '',
                  patientAge: caseData.patientInfo.age || '',
                  patientGender: caseData.patientInfo.gender || '',
                  ageRange: caseData.patientInfo.age || '',
                  occupation: caseData.patientInfo.occupation || '',
                  socialContext: caseData.patientInfo.socialContext || '',
                  caseSummary: caseData.overview.caseSummary || '',
                }}
                dynamicSections={caseData.dynamicSections.overview}
              />
            </Tab.Panel>
            
            {/* Patient Info Tab */}
            <Tab.Panel>
              <PatientInfoTab 
                patientData={{
                  name: caseData.patientInfo.name || '',
                  age: caseData.patientInfo.age || '',
                  gender: caseData.patientInfo.gender || '',
                  occupation: caseData.patientInfo.occupation || '',
                  chiefComplaint: caseData.patientInfo.chiefComplaint || '',
                  briefHistory: caseData.patientInfo.briefHistory || '',
                  conditions: caseData.patientInfo.conditions || [],
                  medications: caseData.patientInfo.medications || [],
                  allergies: caseData.patientInfo.allergies || [],
                  livingSituation: caseData.patientInfo.livingSituation || '',
                  smokingHistory: caseData.patientInfo.smokingHistory || '',
                  alcoholUse: caseData.patientInfo.alcoholUse || '',
                  drugUse: caseData.patientInfo.drugUse || '',
                  familyHistory: caseData.patientInfo.familyHistory || [],
                }}
                dynamicSections={caseData.dynamicSections['patient-info']}
              />
            </Tab.Panel>
            
            {/* Presentation Tab */}
            <Tab.Panel>
              <PresentationTab 
                presentationData={{
                  vitalSigns: caseData.presentation.vitalSigns || [],
                  physicalExam: caseData.presentation.physicalExam || [],
                  diagnosticStudies: caseData.presentation.diagnosticStudies || [],
                  doctorNotes: caseData.presentation.doctorNotes || [],
                  initialAssessment: caseData.presentation.initialAssessment || '',
                }}
                dynamicSections={caseData.dynamicSections.presentation}
              />
            </Tab.Panel>
            
            {/* Treatment Tab */}
            <Tab.Panel>
              <TreatmentTab 
                treatmentData={{
                  initialManagement: caseData.treatment.initialManagement || [],
                  treatmentPlan: caseData.treatment.treatmentPlan || {
                    medications: [],
                    procedures: [],
                    monitoring: [],
                    consults: [],
                    patientEducation: []
                  },
                  progressionScenarios: caseData.treatment.progressionScenarios || [],
                  clinicalCourse: caseData.treatment.clinicalCourse || {
                    outcomes: []
                  }
                }}
                dynamicSections={caseData.dynamicSections.treatment}
              />
            </Tab.Panel>
            
            {/* Simulation Learning Tab */}
            <Tab.Panel>
              <SimulationLearningTab 
                simulationData={{
                  nursingCompetencies: caseData.simulation.nursingCompetencies || [],
                  questionsToConsider: caseData.simulation.questionsToConsider || [],
                  gradingRubric: caseData.simulation.gradingRubric || [],
                  skillsAssessment: caseData.simulation.skillsAssessment || [],
                  debriefingPoints: caseData.simulation.debriefingPoints || [],
                  teachingPlan: caseData.simulation.teachingPlan || ''
                }}
                dynamicSections={caseData.dynamicSections.simulation}
              />
            </Tab.Panel>
            
            {/* Render any custom panels */}
            {children}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
} 
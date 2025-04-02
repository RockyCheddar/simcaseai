'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import CaseTabs from '@/components/CaseTabs';
import MarkdownPreview from '@/components/MarkdownPreview';
import AIGenerationLoader from '@/components/AIGenerationLoader';
import { CaseParameters, LearningObjective } from '@/types/case';
import { DynamicSection } from '@/utils/contentClassifier';

// Mock case data
const sampleCase = {
  id: "case-12345",
  title: "Acute Respiratory Distress: Management of COPD Exacerbation",
  status: "complete",
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  objectives: [
    "Identify clinical signs of COPD exacerbation requiring immediate intervention",
    "Demonstrate appropriate oxygen therapy administration for patients with COPD",
    "Formulate an evidence-based treatment plan including bronchodilators and corticosteroids",
    "Communicate effectively with a distressed patient with respiratory difficulty"
  ],
  caseData: {
    vitalSigns: {
      heartRate: "106",
      respiratoryRate: "28",
      bloodPressure: "152/88",
      temperature: "37.5",
      oxygenSaturation: "88"
    },
    physicalExam: {
      generalAppearance: "Elderly male in moderate respiratory distress, sitting upright, leaning forward on stretcher",
      respiratory: "Bilateral wheezing and prolonged expiratory phase, accessory muscle use, decreased breath sounds at bases",
      cardiovascular: "Tachycardic, regular rhythm, no murmurs",
      extremities: "No edema, capillary refill < 3 seconds"
    },
    labResults: {
      "WBC": "12.5 x 10^9/L",
      "Hemoglobin": "14.2 g/dL",
      "Platelets": "250 x 10^9/L",
      "Sodium": "138 mEq/L",
      "Potassium": "4.0 mEq/L",
      "Chloride": "102 mEq/L",
      "Bicarbonate": "28 mEq/L",
      "BUN": "18 mg/dL",
      "Creatinine": "1.1 mg/dL",
      "Glucose": "110 mg/dL"
    },
    learningObjectives: [
      { text: "Identify clinical signs of COPD exacerbation requiring immediate intervention" },
      { text: "Demonstrate appropriate oxygen therapy administration for patients with COPD" },
      { text: "Formulate an evidence-based treatment plan including bronchodilators and corticosteroids" },
      { text: "Communicate effectively with a distressed patient with respiratory difficulty" }
    ],
    demographics: {
      ageRange: "65-75 years",
      gender: "Male",
      occupation: "Retired factory worker",
      socialContext: "Lives alone, limited social support",
      relevantHistory: ["40-year smoking history", "COPD diagnosed 8 years ago"]
    },
    clinicalContext: {
      setting: "Emergency Department",
      acuityLevel: "Moderate to Severe",
      timelineSpan: "First 4 hours of presentation",
      availableResources: ["Oxygen therapy equipment", "Nebulizers", "IV access", "Basic laboratory tests", "Chest X-ray"]
    },
    complexity: {
      primaryConditionSeverity: "Moderate",
      comorbidities: ["Hypertension", "Type 2 Diabetes", "Osteoarthritis"],
      communicationChallenges: ["Anxiety due to breathlessness", "Hard of hearing"],
      abnormalFindings: ["Wheezing", "Decreased oxygen saturation", "Tachypnea"]
    },
    recommendedVitalSigns: {
      heartRate: { min: 95, max: 115 },
      respiratoryRate: { min: 24, max: 32 },
      bloodPressure: { 
        systolic: { min: 145, max: 160 }, 
        diastolic: { min: 85, max: 95 } 
      },
      temperature: { min: 37.2, max: 38.0 },
      oxygenSaturation: { min: 86, max: 90 },
      consciousness: "Alert but anxious"
    },
    educationalElements: {
      documentationTypes: ["Emergency department notes", "Medication administration records", "Respiratory therapy notes"],
      learnerDecisionPoints: ["Oxygen therapy approach", "Medication selection and dosing", "Admission vs. discharge decision"],
      criticalActions: ["Appropriate oxygen titration", "Bronchodilator administration", "Corticosteroid administration"],
      assessmentFocus: ["Respiratory assessment", "Response to treatment", "Patient education"]
    },
    patientInfo: {
      name: "Harold Jenkins",
      age: "72 years",
      gender: "Male",
      occupation: "Retired factory worker (sheet metal)",
      chiefComplaint: "I can't catch my breath... worse than usual",
      briefHistory: "Patient experienced gradually worsening shortness of breath over the past 3 days. This morning he noted increased cough with thick yellow sputum and couldn't walk to the bathroom without severe breathlessness. A neighbor called EMS when patient was found sitting in his recliner in obvious respiratory distress.",
      pastMedicalHistory: "COPD diagnosed 8 years ago, hypertension, type 2 diabetes, osteoarthritis of knees",
      medications: ["Albuterol inhaler 2 puffs q4-6h PRN", "Tiotropium 18 mcg inhaled daily", "Fluticasone/salmeterol 250/50 mcg inhaled BID", "Lisinopril 10 mg daily", "Metformin 1000 mg BID", "Acetaminophen 500 mg PRN for pain"],
      allergies: ["Penicillin (rash)"],
    },
    socialHistory: {
      livingArrangements: "Lives alone in a single-story home. Retired factory worker with 40-year smoking history (1 pack per day), quit 5 years ago. Occasional alcohol use. No illicit drug use.",
      smokingHistory: "40-year smoking history",
      alcoholUse: "Occasional alcohol use",
      familyHistory: ["Father died of emphysema, mother had heart disease."]
    },
    copdHistory: {
      diagnosis: "COPD diagnosed 8 years ago",
      previousExacerbations: "No previous exacerbations mentioned",
      pulmonaryFunction: "No pulmonary function tests mentioned",
      oxygenUse: "No oxygen use mentioned"
    }
  },
  content: `
# Acute Respiratory Distress: Management of COPD Exacerbation

## Learning Objectives
1. Identify clinical signs of COPD exacerbation requiring immediate intervention
2. Demonstrate appropriate oxygen therapy administration for patients with COPD
3. Formulate an evidence-based treatment plan including bronchodilators and corticosteroids
4. Communicate effectively with a distressed patient with respiratory difficulty

## Patient Information
- Name: Harold Jenkins
- Age: 72 years
- Gender: Male
- Occupation: Retired factory worker (sheet metal)
- Chief complaint: "I can't catch my breath... worse than usual"
- Brief history of present illness: Patient experienced gradually worsening shortness of breath over the past 3 days. This morning he noted increased cough with thick yellow sputum and couldn't walk to the bathroom without severe breathlessness. A neighbor called EMS when patient was found sitting in his recliner in obvious respiratory distress.
- Past medical history: COPD diagnosed 8 years ago, hypertension, type 2 diabetes, osteoarthritis of knees
- Medications: 
  - Albuterol inhaler 2 puffs q4-6h PRN
  - Tiotropium 18 mcg inhaled daily
  - Fluticasone/salmeterol 250/50 mcg inhaled BID
  - Lisinopril 10 mg daily
  - Metformin 1000 mg BID
  - Acetaminophen 500 mg PRN for pain
- Allergies: Penicillin (rash)
- Social history: Lives alone in a single-story home. Retired factory worker with 40-year smoking history (1 pack per day), quit 5 years ago. Occasional alcohol use. No illicit drug use.
- Family history: Father died of emphysema, mother had heart disease.

## Initial Presentation
- Vital signs:
  - Heart Rate: 106 bpm
  - Respiratory Rate: 28 breaths/min
  - Blood Pressure: 152/88 mmHg
  - Temperature: 37.5°C
  - Oxygen Saturation: 88% on room air
  - Consciousness: Alert but anxious
- Physical examination findings:
  - General: Elderly male in moderate respiratory distress, sitting upright, leaning forward on stretcher
  - HEENT: No nasal flaring, no cyanosis
  - Respiratory: Bilateral wheezing and prolonged expiratory phase, accessory muscle use, decreased breath sounds at bases
  - Cardiovascular: Tachycardic, regular rhythm, no murmurs
  - Abdomen: Soft, non-tender, no distension
  - Extremities: No edema, capillary refill < 3 seconds
- Initial assessment: Acute exacerbation of COPD, moderate severity

## Progression Scenarios

### Scenario 1: Appropriate Management
- Intervention: Low-flow oxygen (2L/min) via nasal cannula, nebulized albuterol and ipratropium, oral prednisone, and reassessment
- Response: After 30 minutes, respiratory rate decreases to 24/min, oxygen saturation improves to 92%, patient reports feeling "a little better"
- Vital sign changes: HR decreases to 98 bpm, RR to 24/min, oxygen saturation improves to 92%
- Further management: Continue bronchodilator therapy, monitor oxygen saturation carefully, consider antibiotics based on sputum characteristics

### Scenario 2: Inadequate Oxygen Management
- Intervention: High-flow oxygen (6L/min) via face mask
- Response: Initial improvement in comfort, but after 30 minutes increasing drowsiness
- Vital sign changes: HR stable at 104 bpm, RR decreases to 18/min, oxygen saturation 96% but patient becomes increasingly somnolent
- Concerns: CO2 retention due to excessive oxygen therapy
- Corrective action: Reduce oxygen flow to maintain saturation 88-92%, consider ABG to assess for hypercapnia

### Scenario 3: Deterioration Requiring Escalation
- Trigger: Minimal response to initial therapy, increasing work of breathing
- Vital sign changes: HR increases to 120 bpm, RR 34/min, BP 165/95 mmHg, oxygen saturation drops to 84% despite oxygen therapy
- Assessment: Severe exacerbation requiring escalation of care
- Interventions: Consider non-invasive ventilation (BiPAP), notify critical care team, prepare for possible ICU transfer

## Case Documentation

### Emergency Department Note
CHIEF COMPLAINT: Shortness of breath, worse than baseline

HISTORY OF PRESENT ILLNESS: 72-year-old male with history of COPD presents with 3 days of worsening dyspnea and increased cough with yellow sputum. Patient reports using his albuterol inhaler without relief. Denies fever, chest pain, or lower extremity swelling.

MEDICATIONS: Reviewed and documented as above.

PHYSICAL EXAMINATION:
Vitals: HR 106, RR 28, BP 152/88, Temp 37.5°C, SpO2 88% on RA
General: Moderate respiratory distress, sitting upright
Respiratory: Diffuse wheezing, prolonged expiration, accessory muscle use
Cardiovascular: Tachycardic, regular rhythm
Remainder of exam as documented above.

DIAGNOSTIC DATA:
- CXR: Hyperinflation, flattened diaphragms, no infiltrates or effusions
- Labs: WBC 12.5, otherwise within normal limits
- ABG pending

ASSESSMENT AND PLAN: COPD exacerbation, moderate severity
1. Oxygen: Start 2L NC, titrate to SpO2 88-92%
2. Bronchodilators: Albuterol/ipratropium nebulizer q20min x 3
3. Steroids: Prednisone 40mg PO
4. Antibiotics: Azithromycin 500mg PO based on sputum production
5. Reassess after initial treatment

### Medication Administration Record
Date/Time: [Current]
Albuterol 2.5mg/Ipratropium 0.5mg nebulized - GIVEN @ 0900
Prednisone 40mg PO - GIVEN @ 0910
Azithromycin 500mg PO - GIVEN @ 0915
Albuterol 2.5mg/Ipratropium 0.5mg nebulized - GIVEN @ 0920
Albuterol 2.5mg/Ipratropium 0.5mg nebulized - GIVEN @ 0940

### Respiratory Therapy Note
Patient receiving oxygen via NC at 2 LPM with SpO2 ranging 88-92%. Multiple nebulizer treatments provided with moderate improvement in wheezing and work of breathing. Patient coached on pursed-lip breathing technique with good compliance. Will continue to monitor closely and assess need for additional respiratory support.

## Educational Notes

### Teaching Points
1. Oxygen management in COPD exacerbation:
   - Target SpO2 88-92% to prevent hypercapnic respiratory failure
   - Low-flow oxygen delivery systems preferred initially
   - Monitor for signs of CO2 retention (drowsiness, confusion)

2. Pharmacological management:
   - Short-acting bronchodilators (albuterol, ipratropium) are first-line
   - Systemic corticosteroids reduce inflammation and recovery time
   - Antibiotics indicated with purulent sputum or signs of infection

3. Assessment of exacerbation severity:
   - Use of accessory muscles, inability to speak in full sentences
   - Response to initial therapy
   - ABG findings when available

### Common Pitfalls
- Excessive oxygen administration causing CO2 retention
- Underestimating severity of exacerbation
- Inadequate reassessment after interventions
- Poor communication with anxious patients

### Key Decision Points
- Oxygen titration strategy
- Selection and dosing of bronchodilators
- Need for antibiotic therapy
- Disposition (admission vs. discharge) decision

## Debriefing Guide

### Discussion Questions
1. What clinical findings helped you identify this as a COPD exacerbation requiring immediate intervention?
2. How did you determine the appropriate oxygen delivery method and flow rate?
3. What was your rationale for medication selection and dosing?
4. How did you adapt your communication to accommodate the patient's breathlessness and anxiety?
5. What factors influenced your disposition decision?

### Expected Outcomes
- Appropriate oxygen therapy maintaining SpO2 88-92%
- Improvement in work of breathing after bronchodilator therapy
- Comprehensive treatment plan addressing all aspects of COPD exacerbation
- Clear patient education about management and follow-up

### Reflection Areas
- Communication with distressed patients
- Clinical decision-making regarding escalation of care
- Oxygen management in patients with chronic CO2 retention
- Multidisciplinary approach to COPD management
`
};

// Add these new components after the existing imports
function VitalSignCard({ label, value, unit }: { label: string; value: string | number; unit: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{unit}</p>
      </div>
    </div>
  );
}

interface PatientInfoField {
  label: string;
  value: string;
}

interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  occupation: string;
  chiefComplaint: string;
  briefHistory: string;
  pastMedicalHistory: string;
  medications: string[];
  allergies: string[];
}

interface SocialHistory {
  livingArrangements: string;
  smokingHistory: string;
  alcoholUse: string;
  familyHistory: string[];
}

interface COPDHistory {
  diagnosis: string;
  previousExacerbations: string;
  pulmonaryFunction: string;
  oxygenUse: string;
}

interface ConditionTests {
  [testName: string]: string;
}

interface ConditionHistory {
  title: string;
  diagnosis: string;
  previousEvents?: string;
  tests?: ConditionTests;
  currentManagement?: string;
  additionalFields?: {
    [fieldName: string]: string;
  };
}

interface CaseData {
  id: string;
  title: string;
  text: string;
  demographics: Record<string, string | string[]>;
  clinicalContext: {
    availableResources: string[];
  };
  complexity: {
    abnormalFindings: string[];
  };
  recommendedVitalSigns: Record<string, string | number | { min: number; max: number }>;
  learningObjectives: LearningObjective[];
}

interface LabResults {
  [key: string]: string;
}

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

// Add EditableVitalSignCard component
function EditableVitalSignCard({ 
  label, 
  value, 
  unit, 
  isEditing, 
  onChange 
}: { 
  label: string; 
  value: string | number; 
  unit: string; 
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  if (!isEditing) {
    return <VitalSignCard label={label} value={value} unit={unit} />;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        />
        <p className="text-xs text-gray-500">{unit}</p>
      </div>
    </div>
  );
}

// Add EditableField component
function EditableField({ 
  value, 
  isEditing, 
  onChange,
  multiline = false
}: { 
  value: string; 
  isEditing: boolean;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  if (!isEditing) {
    return <p className="mt-1 text-sm text-gray-900">{value}</p>;
  }

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
    />
  );
}

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [regeneratingTab, setRegeneratingTab] = useState<string | null>(null);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<CaseData | null>(null);

  useEffect(() => {
    // In a real app, you would fetch the case data from your API
    // For now, we'll simulate loading and use the data from localStorage
    const loadCaseData = () => {
      try {
        const savedCase = localStorage.getItem(`case-${params.id}`);
        if (savedCase) {
          setCaseData(JSON.parse(savedCase));
        }
      } catch (error) {
        console.error('Error loading case data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCaseData();
  }, [params.id]);

  // Function to simulate regenerating tab content
  const regenerateTabContent = async (tabName: string) => {
    setRegeneratingTab(tabName);
    
    // Simulate API call with a delay
    try {
      // In a real application, you would call your AI service here
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      toast.success(`${tabName} content has been regenerated`);
    } catch (error) {
      toast.error(`Failed to regenerate ${tabName} content`);
    } finally {
      setRegeneratingTab(null);
    }
  };

  // Function to simulate regenerating section content
  const regenerateSection = async (sectionName: string) => {
    setRegeneratingSection(sectionName);
    
    // Simulate API call with a delay
    try {
      // In a real application, you would call your AI service here
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(`${sectionName} has been regenerated`);
    } catch (error) {
      toast.error(`Failed to regenerate ${sectionName}`);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Function to render regenerate button for each tab
  const renderRegenerateButton = (tabName: string) => {
    return (
      <button
        onClick={() => regenerateTabContent(tabName)}
        disabled={regeneratingTab !== null || regeneratingSection !== null}
        className="ml-auto flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
      >
        <svg className="mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Regenerate
      </button>
    );
  };

  // Function to render regenerate button for a section
  const renderSectionRegenerateButton = (sectionName: string) => {
    return (
      <button
        onClick={() => regenerateSection(sectionName)}
        disabled={regeneratingTab !== null || regeneratingSection !== null}
        className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        title={`Regenerate ${sectionName}`}
      >
        <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Case Not Found</h2>
          <p className="text-gray-600 mb-4">The requested case could not be found.</p>
          <button
            onClick={() => router.push('/dashboard/cases')}
            className="btn-primary"
          >
            Return to Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Case: {caseData.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Complete
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push(`/dashboard/cases/${params.id}/edit`)}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit Case
            </button>
            <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
              Delete
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <Tab.Group>
            {caseData ? (
              <CaseTabs 
                tabs={[
                  { name: 'Overview', current: true },
                  { name: 'Patient Info', current: false },
                  { name: 'Presentation', current: false },
                  { name: 'Treatment', current: false },
                  { name: 'Simulation Learning', current: false },
                ]}
                caseData={{
                  title: caseData.title,
                  rawText: caseData.text || '',
                  overview: {
                    caseSummary: caseData.text?.substring(0, 300) || '',
                    status: 'Complete',
                    createdDate: new Date().toISOString(),
                    updatedDate: new Date().toISOString(),
                    clinicalSetting: caseData.demographics?.clinicalSetting as string || '',
                    learningObjectives: Array.isArray(caseData.learningObjectives) 
                      ? caseData.learningObjectives.map((obj: any) => obj.text) 
                      : [],
                  },
                  patientInfo: {
                    name: caseData.demographics?.name as string || '',
                    age: caseData.demographics?.age as string || '',
                    gender: caseData.demographics?.gender as string || '',
                    occupation: caseData.demographics?.occupation as string || '',
                    chiefComplaint: '',
                    briefHistory: '',
                    conditions: [],
                    medications: [],
                    allergies: [],
                    socialContext: caseData.demographics?.socialContext as string || '',
                  },
                  presentation: {
                    vitalSigns: Object.entries(caseData.recommendedVitalSigns || {}).map(([name, value]) => ({
                      name,
                      value: typeof value === 'object' && 'min' in value ? `${value.min}-${value.max}` : String(value),
                      unit: name === 'heartRate' ? 'bpm' : 
                           name === 'respiratoryRate' ? '/min' : 
                           name === 'bloodPressure' ? 'mmHg' : 
                           name === 'temperature' ? '°C' : 
                           name === 'oxygenSaturation' ? '%' : '',
                      isAbnormal: false
                    })),
                    physicalExam: caseData.complexity?.abnormalFindings?.map((finding: string) => ({
                      system: 'General',
                      findings: finding,
                      isAbnormal: true
                    })) || [],
                    diagnosticStudies: [],
                    doctorNotes: [],
                  },
                  treatment: {
                    initialManagement: [],
                    treatmentPlan: {
                      medications: [],
                      procedures: [],
                      monitoring: [],
                      consults: [],
                      patientEducation: []
                    },
                    progressionScenarios: [],
                    clinicalCourse: {
                      outcomes: []
                    }
                  },
                  simulation: {
                    nursingCompetencies: [],
                    questionsToConsider: [],
                    gradingRubric: [],
                    skillsAssessment: [],
                    debriefingPoints: [],
                    teachingPlan: ''
                  },
                  dynamicSections: {
                    overview: [],
                    'patient-info': [],
                    presentation: [],
                    treatment: [],
                    simulation: []
                  }
                }}
              >
                {/* We can keep this empty since our updated CaseTabs component handles children internally */}
              </CaseTabs>
            ) : (
              <div>Loading case data...</div>
            )}
          </Tab.Group>
        </div>
      </div>
    </div>
  );
} 
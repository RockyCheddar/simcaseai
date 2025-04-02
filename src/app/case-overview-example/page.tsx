'use client';

import React, { useState } from 'react';
import OverviewTab from '@/components/OverviewTab';
import PatientInfoTab from '@/components/PatientInfoTab';
import PresentationTab from '@/components/PresentationTab';
import TreatmentTab from '@/components/TreatmentTab';
import SimulationLearningTab from '@/components/SimulationLearningTab';
import { DynamicSection } from '@/utils/contentClassifier';

// Sample data for Overview tab
const sampleCaseData = {
  status: 'Complete',
  createdDate: '2023-04-01T00:00:00',
  updatedDate: '2023-04-05T00:00:00',
  clinicalSetting: 'Emergency Department',
  learningObjectives: [
    'Identify clinical signs of respiratory distress',
    'Demonstrate appropriate oxygen therapy techniques',
    'Formulate evidence-based treatment plan',
    'Communicate effectively with distressed patients'
  ],
  patientName: 'Harold Jenkins',
  patientAge: '72 years',
  patientGender: 'Male',
  ageRange: '65-75 years',
  occupation: 'Retired factory worker',
  socialContext: 'Lives alone, limited family support',
  caseSummary: 'Patient presented to the Emergency Department with acute onset shortness of breath after experiencing chest pain for 3 days. Initial assessment showed moderate respiratory distress with oxygen saturation of 89% on room air. Patient has history of COPD and coronary artery disease. This case focuses on assessment and management of acute respiratory distress in a patient with complex comorbidities.'
};

// Sample data for patient information tab
const samplePatientData = {
  name: 'Harold Jenkins',
  age: '72 years',
  gender: 'Male',
  occupation: 'Retired factory worker (sheet metal)',
  
  chiefComplaint: 'I can\'t catch my breath... worse than usual',
  
  briefHistory: 'Patient experienced gradually worsening shortness of breath over the past 3 days. This morning he noted increased cough with thick yellow sputum and couldn\'t walk to the bathroom without severe breathlessness. A neighbor called EMS when patient was found sitting in his recliner in obvious respiratory distress.',
  
  conditions: [
    'COPD diagnosed 8 years ago',
    'Hypertension',
    'Type 2 diabetes',
    'Osteoarthritis of knees'
  ],
  
  medications: [
    { name: 'Albuterol inhaler', dosage: '2 puffs q4-6h PRN' },
    { name: 'Tiotropium', dosage: '18 mcg inhaled daily' },
    { name: 'Fluticasone/salmeterol', dosage: '250/50 mcg inhaled BID' },
    { name: 'Lisinopril', dosage: '10 mg daily' },
    { name: 'Metformin', dosage: '1000 mg BID' },
    { name: 'Acetaminophen', dosage: '500 mg PRN for pain' }
  ],
  
  allergies: [
    { allergen: 'Penicillin', reaction: 'rash' }
  ],
  
  livingSituation: 'Lives alone in a single-story home',
  smokingHistory: '40-year smoking history (1 pack per day), quit 5 years ago',
  alcoholUse: 'Occasional alcohol use',
  drugUse: 'No illicit drug use',
  familyHistory: [
    'Father died of emphysema',
    'Mother had heart disease'
  ],
  
  copdDiagnosis: 'COPD diagnosed 8 years ago',
  previousExacerbations: '3 hospitalizations in the past 5 years',
  pulmonaryFunctionTests: 'FEV1 45% of predicted, consistent with severe COPD',
  oxygenUse: 'PRN oxygen at home for exertional dyspnea'
};

// Sample data for presentation tab
const samplePresentationData = {
  vitalSigns: [
    { 
      name: 'Heart Rate', 
      value: '106', 
      unit: 'bpm', 
      normalRange: '60-100',
      isAbnormal: true 
    },
    { 
      name: 'Respiratory Rate', 
      value: '28', 
      unit: 'breaths/min', 
      normalRange: '12-20',
      isAbnormal: true 
    },
    { 
      name: 'Blood Pressure', 
      value: '152/88', 
      unit: 'mmHg', 
      normalRange: '<140/90',
      isAbnormal: true 
    },
    { 
      name: 'Temperature', 
      value: '37.5', 
      unit: '°C', 
      normalRange: '36.5-37.5',
      isAbnormal: false 
    },
    { 
      name: 'O₂ Saturation', 
      value: '88', 
      unit: '%', 
      normalRange: '95-100',
      isAbnormal: true 
    }
  ],
  
  physicalExam: [
    {
      system: 'General Appearance',
      findings: 'Elderly male in moderate respiratory distress, sitting upright, leaning forward on stretcher',
      isAbnormal: true
    },
    {
      system: 'Respiratory',
      findings: 'Bilateral wheezing and prolonged expiratory phase, accessory muscle use, decreased breath sounds at bases',
      isAbnormal: true
    },
    {
      system: 'Cardiovascular',
      findings: 'Tachycardic, regular rhythm, no murmurs',
      isAbnormal: true
    },
    {
      system: 'HEENT',
      findings: 'No nasal flaring, no cyanosis',
      isAbnormal: false
    },
    {
      system: 'Abdomen',
      findings: 'Soft, non-tender, no distension',
      isAbnormal: false
    },
    {
      system: 'Extremities',
      findings: 'No edema, capillary refill < 3 seconds',
      isAbnormal: false
    }
  ],
  
  diagnosticStudies: [
    {
      name: 'White Blood Cell (WBC)',
      result: '12.5',
      normalRange: '4.5-11.0 x 10⁹/L',
      date: '04/01/2023',
      isAbnormal: true
    },
    {
      name: 'Hemoglobin',
      result: '14.2',
      normalRange: '13.5-17.5 g/dL',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'Platelets',
      result: '250',
      normalRange: '150-450 x 10⁹/L',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'Sodium',
      result: '138',
      normalRange: '135-145 mEq/L',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'Potassium',
      result: '4.0',
      normalRange: '3.5-5.0 mEq/L',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'Chloride',
      result: '102',
      normalRange: '96-106 mEq/L',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'Bicarbonate',
      result: '28',
      normalRange: '22-29 mEq/L',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'BUN',
      result: '18',
      normalRange: '7-20 mg/dL',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'Creatinine',
      result: '1.1',
      normalRange: '0.7-1.3 mg/dL',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'Glucose',
      result: '110',
      normalRange: '70-99 mg/dL',
      date: '04/01/2023',
      isAbnormal: true
    },
    {
      name: 'Chest X-ray',
      result: 'Hyperinflation, flattened diaphragms, no infiltrates or effusions',
      date: '04/01/2023',
      isAbnormal: true
    },
    {
      name: 'ABG pH',
      result: '7.35',
      normalRange: '7.35-7.45',
      date: '04/01/2023',
      isAbnormal: false
    },
    {
      name: 'ABG pO2',
      result: '58',
      normalRange: '75-100 mmHg',
      date: '04/01/2023',
      isAbnormal: true
    },
    {
      name: 'ABG pCO2',
      result: '48',
      normalRange: '35-45 mmHg',
      date: '04/01/2023',
      isAbnormal: true
    }
  ],
  
  doctorNotes: [
    {
      provider: 'Dr. Sarah Johnson, ED Physician',
      date: 'April 1, 2023 10:15 AM',
      content: 'Patient presents with acute exacerbation of COPD. History of gradually worsening shortness of breath over past 3 days with increased productive cough. Clinical presentation consistent with moderate COPD exacerbation. Initial management with controlled oxygen therapy, bronchodilators, and systemic corticosteroids. Antibiotics started empirically for purulent sputum. Will reassess after initial interventions.'
    },
    {
      provider: 'Dr. Michael Chen, Pulmonology',
      date: 'April 1, 2023 11:45 AM',
      content: 'ED consult for COPD exacerbation. Patient shows mild improvement after initial treatment. Still has significant wheezing and accessory muscle use. Recommend continuing current management with close monitoring of oxygen saturation to avoid CO2 retention. Would consider adding methylprednisolone if no significant improvement in next 2 hours. Patient likely will require admission for continued treatment and observation.'
    }
  ]
};

// Sample data for treatment tab
const sampleTreatmentData = {
  initialManagement: [
    {
      action: "Administer controlled oxygen therapy via nasal cannula at 2L/min",
      rationale: "Provide supplemental oxygen while avoiding excessive oxygen that could suppress respiratory drive in COPD patient",
      timing: "Immediate"
    },
    {
      action: "Administer nebulized albuterol 2.5mg with ipratropium 0.5mg",
      rationale: "Combined short-acting bronchodilators to relieve bronchospasm",
      timing: "Within 15 minutes of arrival"
    },
    {
      action: "Give IV methylprednisolone 125mg",
      rationale: "Reduce airway inflammation and improve airflow",
      timing: "Within 30 minutes of arrival"
    },
    {
      action: "Start IV azithromycin 500mg",
      rationale: "Empiric antibiotic therapy for purulent sputum indicating possible infection",
      timing: "Within first hour"
    }
  ],
  treatmentPlan: {
    medications: [
      {
        action: "Albuterol/ipratropium nebulizer treatments every 4-6 hours",
        rationale: "Continue bronchodilation therapy"
      },
      {
        action: "Oral prednisone 40mg daily for 5 days",
        rationale: "Transition from IV steroids to complete anti-inflammatory course"
      },
      {
        action: "Azithromycin 250mg daily for 4 more days",
        rationale: "Complete 5-day course of antibiotic therapy"
      },
      {
        action: "Resume home COPD medications as tolerated",
        rationale: "Maintain baseline therapy once acute exacerbation controlled"
      }
    ],
    procedures: [
      {
        action: "Placement of peripheral IV line",
        rationale: "Access for medication administration"
      },
      {
        action: "Serial arterial blood gas measurements",
        rationale: "Monitor response to therapy and assess for CO2 retention"
      }
    ],
    monitoring: [
      {
        action: "Continuous pulse oximetry",
        rationale: "Monitor oxygen saturation, target 88-92%"
      },
      {
        action: "Respiratory rate every 1-2 hours",
        rationale: "Assess work of breathing and response to therapy"
      },
      {
        action: "Daily chest auscultation",
        rationale: "Monitor for improvement in air entry and wheezing"
      }
    ],
    consults: [
      {
        action: "Pulmonology consultation",
        rationale: "Specialist input for management of severe COPD exacerbation"
      },
      {
        action: "Respiratory therapy evaluation",
        rationale: "Optimize bronchodilator delivery and consider additional respiratory support if needed"
      }
    ],
    patientEducation: [
      {
        action: "COPD exacerbation management",
        rationale: "Review early warning signs and when to seek medical care"
      },
      {
        action: "Proper inhaler technique",
        rationale: "Ensure effective medication delivery at home"
      },
      {
        action: "Smoking cessation reinforcement",
        rationale: "Emphasize benefits of continued abstinence"
      }
    ]
  },
  progressionScenarios: [
    {
      title: "Optimal Response",
      intervention: "Standard therapy as outlined above",
      response: "Patient shows significant improvement within 24 hours with decreased work of breathing, reduced wheezing, and improved oxygen saturation to 93% on 2L/min oxygen",
      vitalSignChanges: "HR decreases to 88, RR to 20, BP normalizes to 138/78",
      additionalNotes: "Ready for transition to oral steroids and consideration of discharge planning within 48-72 hours"
    },
    {
      title: "Inadequate Response",
      intervention: "Standard therapy as outlined above",
      response: "Minimal improvement after 24 hours, persistent tachypnea and accessory muscle use",
      vitalSignChanges: "HR remains elevated at 100-110, RR 24-26, increasing CO2 on ABG",
      additionalNotes: "Consider BiPAP, higher level of care, review antibiotic coverage and possible additional imaging"
    },
    {
      title: "Clinical Deterioration",
      intervention: "Standard therapy with delayed specialist input",
      response: "Worsening respiratory distress, fatigue, confusion developing",
      vitalSignChanges: "Rising CO2 levels > 60 mmHg, falling pH < 7.30, O2 sat decreasing despite supplemental oxygen",
      additionalNotes: "ICU transfer needed, consideration of non-invasive or invasive ventilation"
    }
  ],
  clinicalCourse: {
    timeline: "Day 1: Initial assessment and treatment in ED, admission to medical floor\nDay 2: Continued nebulizer treatments, slight improvement in respiratory status\nDay 3: Transitioned to inhaler therapy, oxygen requirement decreased\nDay 4: Ambulating with portable oxygen, discharge planning initiated\nDay 5: Discharged home with oral steroid taper and follow-up appointment",
    complications: [
      "Transient hypokalemia from beta-agonist therapy",
      "Mild hyperglycemia from corticosteroids"
    ],
    outcomes: [
      {
        category: "Clinical Outcome",
        description: "Return to baseline respiratory status within 5 days of admission"
      },
      {
        category: "Functional Outcome",
        description: "Able to perform basic activities of daily living with same level of oxygen support as prior to admission"
      },
      {
        category: "Patient Experience",
        description: "Expressed satisfaction with care but anxiety about future exacerbations"
      }
    ],
    disposition: "Discharge home with home health support for first week",
    followUp: "Pulmonology follow-up in 2 weeks, PCP appointment in 1 week"
  }
};

// Sample data for simulation learning tab
const sampleSimulationData = {
  nursingCompetencies: [
    {
      category: "Assessment",
      skills: [
        "Accurately assess respiratory status including rate, pattern, effort, and breath sounds",
        "Perform focused assessment for signs of hypoxia and respiratory distress",
        "Recognize abnormal physical findings and laboratory values",
        "Evaluate effectiveness of therapeutic interventions"
      ]
    },
    {
      category: "Interventions",
      skills: [
        "Administer oxygen therapy appropriately for COPD patient",
        "Correctly administer nebulizer treatments",
        "Position patient appropriately to optimize breathing mechanics",
        "Respond appropriately to changes in clinical status"
      ]
    },
    {
      category: "Communication",
      skills: [
        "Effectively communicate with interprofessional team",
        "Document assessments and interventions accurately",
        "Provide clear instructions to patient and family",
        "Utilize therapeutic communication with anxious patient"
      ]
    }
  ],
  questionsToConsider: [
    {
      question: "What are the key differences in oxygen management for COPD patients compared to other causes of respiratory distress?",
      relevance: "Understanding the unique pathophysiology of COPD and CO2 retention risk"
    },
    {
      question: "How would you prioritize interventions for this patient in the first 30 minutes?",
      relevance: "Develops clinical reasoning and prioritization skills"
    },
    {
      question: "What factors would indicate the need for escalation of care to ICU setting?",
      relevance: "Enhances recognition of clinical deterioration requiring higher level of care"
    },
    {
      question: "How would you modify your education plan based on this patient's anxiety level and learning needs?",
      relevance: "Promotes individualized patient education approach"
    }
  ],
  gradingRubric: [
    {
      criterion: "Initial Assessment",
      excellent: "Comprehensive assessment completed within 5 minutes, all critical elements identified",
      satisfactory: "Complete assessment within 10 minutes with most critical elements identified",
      needsImprovement: "Incomplete assessment or missing critical elements",
      weight: 20
    },
    {
      criterion: "Oxygen Management",
      excellent: "Appropriate oxygen delivery device selected, target saturation identified and maintained",
      satisfactory: "Appropriate oxygen initiated but without clear saturation targets",
      needsImprovement: "Inappropriate oxygen delivery or failure to monitor response",
      weight: 15
    },
    {
      criterion: "Medication Administration",
      excellent: "All medications given correctly with proper technique and patient education",
      satisfactory: "Medications given correctly but with minimal patient education",
      needsImprovement: "Errors in medication administration or technique",
      weight: 20
    },
    {
      criterion: "Team Communication",
      excellent: "Clear, concise SBAR communication with physician and team members",
      satisfactory: "Adequate communication but lacking structure or some key information",
      needsImprovement: "Poor or incomplete communication affecting patient care",
      weight: 15
    },
    {
      criterion: "Response to Changes",
      excellent: "Prompt recognition and appropriate response to all clinical changes",
      satisfactory: "Recognition of major changes with appropriate response, minor delays",
      needsImprovement: "Failure to recognize or respond appropriately to clinical changes",
      weight: 30
    }
  ],
  skillsAssessment: [
    {
      category: "knowledge" as "knowledge",
      title: "COPD Exacerbation Management",
      description: "Knowledge of pathophysiology and treatment principles",
      criteria: [
        "Explains pathophysiology of COPD exacerbation",
        "Identifies drug classes and mechanisms of action",
        "Understands oxygen management principles for COPD patients",
        "Recognizes complications of therapy"
      ]
    },
    {
      category: "skills" as "skills",
      title: "Respiratory Assessment",
      description: "Physical assessment and monitoring skills",
      criteria: [
        "Performs systematic respiratory assessment",
        "Correctly auscultates lung sounds and identifies abnormalities",
        "Sets up and manages oxygen delivery appropriately",
        "Administers nebulizer treatments with proper technique"
      ]
    },
    {
      category: "criticalThinking" as "criticalThinking",
      title: "Clinical Decision Making",
      description: "Analysis and intervention based on assessment data",
      criteria: [
        "Interprets assessment findings appropriately",
        "Prioritizes interventions based on clinical presentation",
        "Anticipates potential complications",
        "Adjusts care plan based on patient response"
      ]
    },
    {
      category: "communication" as "communication",
      title: "Patient and Team Communication",
      description: "Effective communication with patient and healthcare team",
      criteria: [
        "Provides clear, concise handoff using SBAR format",
        "Communicates findings to physician with appropriate urgency",
        "Explains procedures and treatments to patient at appropriate level",
        "Documents assessment findings and interventions accurately"
      ]
    }
  ],
  debriefingPoints: [
    "What went well in this simulation? What challenges did you face?",
    "How did you determine the appropriate oxygen therapy for this patient?",
    "What clinical indicators helped you evaluate the patient's response to treatment?",
    "How did time management and prioritization affect your care delivery?",
    "What would you do differently if faced with this situation again?",
    "How will you apply what you learned to your clinical practice?"
  ],
  teachingPlan: "This simulation utilizes a progressive case approach where the patient's condition evolves based on interventions chosen. The session begins with pre-briefing and orientation to the simulation environment (15 minutes), followed by the active simulation (20-30 minutes). A structured debriefing follows using the Plus-Delta method to identify strengths and areas for improvement. Participants will then engage in guided reflection using the provided debriefing points. The session concludes with review of evidence-based practice guidelines for COPD exacerbation management."
};

// Sample dynamic sections for demonstration
const sampleDynamicSections: Record<string, DynamicSection[]> = {
  overview: [
    {
      title: "AI-Generated Case Background",
      content: "This respiratory distress case represents a common presentation in emergency settings, particularly among elderly patients with underlying COPD. The case highlights the complex interplay between chronic pulmonary disease, potential infection, and comorbidities that can complicate diagnosis and management.",
      contentType: "text"
    },
    {
      title: "Educational Context",
      content: [
        "Suitable for senior nursing students",
        "Appropriate for internal medicine residents",
        "Can be adapted for interprofessional education scenarios",
        "Highlights both acute management and long-term care planning"
      ],
      contentType: "list"
    }
  ],
  "patient-info": [
    {
      title: "Additional History Elements",
      content: [
        "Patient reports increased stress due to recent death of spouse (6 months ago)",
        "Has been less compliant with medications due to financial concerns",
        "Previously participated in pulmonary rehabilitation but stopped attending 3 months ago",
        "Recent weight loss of approximately 5kg over past 2 months"
      ],
      contentType: "list"
    }
  ],
  treatment: [
    {
      title: "Alternative Treatment Considerations",
      content: "While the standard therapy outlined in the case represents evidence-based practice, individual patient factors may necessitate modifications. For patients with contraindications to corticosteroids, alternative anti-inflammatory approaches may be considered. Similarly, antibiotic selection might be adjusted based on local resistance patterns or patient-specific factors such as allergies or recent antibiotic exposure.",
      contentType: "text"
    },
    {
      title: "Discharge Planning Checklist",
      content: [
        "Verify patient understands medication changes and regimen",
        "Confirm availability of home oxygen if prescribed",
        "Schedule follow-up appointments with primary care and specialists",
        "Assess home environment for respiratory triggers",
        "Connect with pulmonary rehabilitation services",
        "Evaluate need for home health services"
      ],
      contentType: "steps"
    }
  ],
  simulation: [
    {
      title: "Preparation Tips for Simulation Facilitators",
      content: [
        "Review GOLD guidelines for COPD management before session",
        "Prepare simulation room with appropriate equipment (oxygen delivery devices, nebulizers)",
        "Brief standardized patient on respiratory distress portrayal techniques",
        "Set up vital sign changes according to progression scenarios",
        "Prepare debriefing room with video recording capabilities if available"
      ],
      contentType: "list"
    }
  ]
};

export default function CaseOverviewExample() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get the appropriate dynamic sections for the active tab
  const currentDynamicSections = sampleDynamicSections[activeTab] || [];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Case Study: Respiratory Distress Management</h1>
        
        {/* Tabs navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <a 
              href="#" 
              className={`border-b-2 py-4 px-1 text-center text-sm font-medium ${
                activeTab === 'overview' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
              aria-current={activeTab === 'overview' ? 'page' : undefined}
            >
              Overview
            </a>
            <a 
              href="#" 
              className={`border-b-2 py-4 px-1 text-center text-sm font-medium ${
                activeTab === 'patient-info' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveTab('patient-info'); }}
              aria-current={activeTab === 'patient-info' ? 'page' : undefined}
            >
              Patient Information
            </a>
            <a 
              href="#" 
              className={`border-b-2 py-4 px-1 text-center text-sm font-medium ${
                activeTab === 'presentation' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveTab('presentation'); }}
              aria-current={activeTab === 'presentation' ? 'page' : undefined}
            >
              Presentation
            </a>
            <a 
              href="#" 
              className={`border-b-2 py-4 px-1 text-center text-sm font-medium ${
                activeTab === 'treatment' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveTab('treatment'); }}
              aria-current={activeTab === 'treatment' ? 'page' : undefined}
            >
              Treatment
            </a>
            <a 
              href="#" 
              className={`border-b-2 py-4 px-1 text-center text-sm font-medium ${
                activeTab === 'simulation' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={(e) => { e.preventDefault(); setActiveTab('simulation'); }}
              aria-current={activeTab === 'simulation' ? 'page' : undefined}
            >
              Simulation Learning
            </a>
          </nav>
        </div>
        
        {/* Tab content */}
        {activeTab === 'overview' && <OverviewTab caseData={sampleCaseData} dynamicSections={currentDynamicSections} />}
        {activeTab === 'patient-info' && <PatientInfoTab patientData={samplePatientData} dynamicSections={currentDynamicSections} />}
        {activeTab === 'presentation' && <PresentationTab presentationData={samplePresentationData} dynamicSections={currentDynamicSections} />}
        {activeTab === 'treatment' && <TreatmentTab treatmentData={sampleTreatmentData} dynamicSections={currentDynamicSections} />}
        {activeTab === 'simulation' && <SimulationLearningTab simulationData={sampleSimulationData} dynamicSections={currentDynamicSections} />}
      </div>
    </div>
  );
} 
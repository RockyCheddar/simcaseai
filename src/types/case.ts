export interface LearningObjective {
  id: string;
  text: string;
  category: 'clinical' | 'technical' | 'teamwork' | 'communication';
  isRefined: boolean;
  aiSuggested?: boolean;
}

export interface CaseParameter {
  id: string;
  name: string;
  value: string | number | boolean | string[];
  category: 'patient' | 'clinical' | 'scenario' | 'educational';
}

export interface CaseTemplate {
  id: string;
  title: string;
  description: string;
  specialty: string;
  defaultObjectives: LearningObjective[];
  parameters: CaseParameter[];
}

export interface PatientProfile {
  age: number;
  gender: string;
  occupation?: string;
  medicalHistory: string[];
  allergies?: string[];
  medications?: string[];
  socialHistory?: string;
  familyHistory?: string;
}

export interface ClinicalData {
  vitalSigns?: Record<string, number | string>;
  labResults?: Record<string, number | string>;
  imagingResults?: Record<string, string>;
  assessmentFindings?: Record<string, string>;
}

export interface CaseComponent {
  id: string;
  type: 'patient_profile' | 'history' | 'physical_exam' | 'labs' | 'imaging' | 'diagnosis' | 'treatment' | 'outcome';
  title: string;
  content: Record<string, any>;
  order: number;
}

export interface SimulationCase {
  id: string;
  title: string;
  description: string;
  learningObjectives: LearningObjective[];
  patientProfile: PatientProfile;
  clinicalData: ClinicalData;
  components: CaseComponent[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: 'draft' | 'review' | 'published';
  templateId?: string;
}

export interface EdEHRData {
  caseId: string;
  patientData: Record<string, any>;
  ehrRecords: Record<string, any>;
  medications: Record<string, any>;
  labResults: Record<string, any>;
  imagingResults: Record<string, any>;
  version: string;
}

export interface FacultyGuide {
  caseId: string;
  overview: string;
  objectives: LearningObjective[];
  setupInstructions: string;
  facilitationGuide: string;
  debriefingQuestions: string[];
  assessmentCriteria: Record<string, any>;
}

export interface StudentMaterials {
  caseId: string;
  briefing: string;
  resources: string[];
  worksheets?: Record<string, any>;
  instructions: string;
}

export interface AssessmentRubric {
  caseId: string;
  criteria: {
    id: string;
    objective: string;
    excellent: string;
    satisfactory: string;
    needsImprovement: string;
    weight: number;
  }[];
}

export interface ParameterOption {
  id: string;
  text: string;
}

export interface ParameterQuestion {
  id: string;
  category: string;
  question: string;
  options: ParameterOption[];
  rationale: string;
}

export interface ParameterQuestionSet {
  questions: ParameterQuestion[];
}

export interface ParameterSelections {
  [questionId: string]: string; // Maps question ID to selected option ID
} 
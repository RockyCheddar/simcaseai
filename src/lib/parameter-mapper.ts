import { 
  ParameterQuestion, 
  ParameterQuestionSet, 
  ParameterSelections,
  CaseParameters,
  VitalSigns,
  PatientDemographics,
  ClinicalContext,
  PresentationComplexity,
  EducationalElements,
  LearningObjective,
  ParameterOption
} from '@/types/case';

// Maps age ranges to appropriate vital sign ranges
const AGE_VITAL_SIGNS_MAP: Record<string, VitalSigns> = {
  'pediatric': {
    heartRate: { min: 70, max: 120 },
    respiratoryRate: { min: 20, max: 30 },
    bloodPressure: { 
      systolic: { min: 90, max: 110 }, 
      diastolic: { min: 55, max: 75 } 
    },
    temperature: { min: 36.5, max: 37.5 },
    oxygenSaturation: { min: 95, max: 100 },
    consciousness: 'Alert'
  },
  'young-adult': {
    heartRate: { min: 60, max: 100 },
    respiratoryRate: { min: 12, max: 20 },
    bloodPressure: { 
      systolic: { min: 110, max: 130 }, 
      diastolic: { min: 70, max: 80 } 
    },
    temperature: { min: 36.5, max: 37.5 },
    oxygenSaturation: { min: 95, max: 100 },
    consciousness: 'Alert'
  },
  'middle-aged': {
    heartRate: { min: 60, max: 100 },
    respiratoryRate: { min: 12, max: 20 },
    bloodPressure: { 
      systolic: { min: 120, max: 140 }, 
      diastolic: { min: 70, max: 90 } 
    },
    temperature: { min: 36.5, max: 37.5 },
    oxygenSaturation: { min: 95, max: 100 },
    consciousness: 'Alert'
  },
  'elderly': {
    heartRate: { min: 60, max: 90 },
    respiratoryRate: { min: 12, max: 20 },
    bloodPressure: { 
      systolic: { min: 130, max: 150 }, 
      diastolic: { min: 70, max: 90 } 
    },
    temperature: { min: 36.0, max: 37.5 },
    oxygenSaturation: { min: 92, max: 98 },
    consciousness: 'Alert'
  }
};

// Maps condition severity to vital sign adjustments
const SEVERITY_VITAL_SIGN_ADJUSTMENTS: Record<string, Partial<VitalSigns>> = {
  'mild': {
    heartRate: { min: 0, max: 10 }, // Add to normal range
    respiratoryRate: { min: 0, max: 2 },
    oxygenSaturation: { min: -2, max: 0 } // Subtract from normal range
  },
  'moderate': {
    heartRate: { min: 10, max: 20 },
    respiratoryRate: { min: 2, max: 6 },
    oxygenSaturation: { min: -5, max: -2 }
  },
  'severe': {
    heartRate: { min: 20, max: 40 },
    respiratoryRate: { min: 6, max: 12 },
    oxygenSaturation: { min: -15, max: -5 }
  },
  'critical': {
    heartRate: { min: 30, max: 60 },
    respiratoryRate: { min: 10, max: 20 },
    oxygenSaturation: { min: -30, max: -10 },
    consciousness: 'Altered'
  }
};

// Maps clinical settings to available resources and documentation types
const SETTING_RESOURCES_MAP: Record<string, { resources: string[], documents: string[] }> = {
  'primary-care': {
    resources: [
      'Basic vital sign equipment',
      'Basic medication administration',
      'Limited diagnostic testing',
      'Referral capabilities'
    ],
    documents: [
      'Outpatient progress notes',
      'Medication list',
      'Basic lab results',
      'Referral forms'
    ]
  },
  'emergency-department': {
    resources: [
      'Advanced monitoring equipment',
      'Emergency medications',
      'Rapid diagnostic testing',
      'Resuscitation equipment',
      'Specialist consultation'
    ],
    documents: [
      'Emergency department notes',
      'Triage assessment',
      'Diagnostic imaging reports',
      'EKG results',
      'Consultant notes'
    ]
  },
  'inpatient-ward': {
    resources: [
      'Continuous monitoring',
      'IV medication administration',
      'Nursing support',
      'Daily physician rounds',
      'Rehabilitation services'
    ],
    documents: [
      'Admission history and physical',
      'Progress notes',
      'Nursing flowsheets',
      'Medication administration records',
      'Discharge planning'
    ]
  },
  'intensive-care': {
    resources: [
      'Advanced continuous monitoring',
      'Ventilator support',
      'Invasive hemodynamic monitoring',
      'Vasoactive medications',
      'Continuous specialist care'
    ],
    documents: [
      'ICU flowsheets',
      'Ventilator settings',
      'Hourly assessments',
      'Invasive monitoring data',
      'Multidisciplinary notes'
    ]
  },
  'rural-setting': {
    resources: [
      'Limited diagnostic equipment',
      'Basic emergency supplies',
      'Telehealth capabilities',
      'Limited specialist access',
      'Transfer protocols'
    ],
    documents: [
      'Basic clinical notes',
      'Transfer forms',
      'Telehealth consultation notes',
      'Limited diagnostic results'
    ]
  }
};

/**
 * Maps a selected parameter option to demographic attributes
 */
function mapDemographicParameter(
  question: ParameterQuestion, 
  selectedOptionId: string,
  demographics: PatientDemographics
): PatientDemographics {
  // Find the selected option
  const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
  if (!selectedOption) return demographics;
  
  const optionText = selectedOption.text.toLowerCase();
  
  // Map based on question content
  if (question.question.includes('age')) {
    demographics.ageRange = selectedOption.text;
  } else if (question.question.includes('gender')) {
    demographics.gender = selectedOption.text;
  } else if (question.question.includes('occupation')) {
    demographics.occupation = selectedOption.text;
  } else if (question.question.includes('social') || question.question.includes('living')) {
    demographics.socialContext = selectedOption.text;
  } else if (question.question.includes('history') || question.question.includes('background')) {
    // Initialize history array if it doesn't exist
    if (!demographics.relevantHistory) {
      demographics.relevantHistory = [];
    }
    demographics.relevantHistory.push(selectedOption.text);
  }
  
  return demographics;
}

/**
 * Maps a selected parameter option to clinical context attributes
 */
function mapClinicalContextParameter(
  question: ParameterQuestion, 
  selectedOptionId: string,
  context: ClinicalContext
): ClinicalContext {
  // Find the selected option
  const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
  if (!selectedOption) return context;
  
  const optionText = selectedOption.text.toLowerCase();
  
  // Map based on question content
  if (question.question.includes('setting') || question.question.includes('location')) {
    context.setting = selectedOption.text;
    
    // Add default resources and documentation based on setting
    const settingKey = optionText.includes('primary') ? 'primary-care' :
                      optionText.includes('emergency') ? 'emergency-department' :
                      optionText.includes('inpatient') || optionText.includes('hospital') ? 'inpatient-ward' :
                      optionText.includes('icu') || optionText.includes('intensive') ? 'intensive-care' :
                      optionText.includes('rural') ? 'rural-setting' : 'primary-care';
    
    if (SETTING_RESOURCES_MAP[settingKey]) {
      context.availableResources = SETTING_RESOURCES_MAP[settingKey].resources;
    }
  } else if (question.question.includes('acuity') || question.question.includes('urgency')) {
    context.acuityLevel = selectedOption.text;
  } else if (question.question.includes('resources') || question.question.includes('equipment')) {
    // Initialize resources array if it doesn't exist
    if (!context.availableResources) {
      context.availableResources = [];
    }
    context.availableResources.push(selectedOption.text);
  } else if (question.question.includes('timeline') || question.question.includes('duration')) {
    context.timelineSpan = selectedOption.text;
  }
  
  return context;
}

/**
 * Maps a selected parameter option to complexity attributes
 */
function mapComplexityParameter(
  question: ParameterQuestion, 
  selectedOptionId: string,
  complexity: PresentationComplexity
): PresentationComplexity {
  // Find the selected option
  const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
  if (!selectedOption) return complexity;
  
  const optionText = selectedOption.text.toLowerCase();
  
  // Map based on question content
  if (question.question.includes('severity') || question.question.includes('acuity')) {
    complexity.primaryConditionSeverity = selectedOption.text;
  } else if (question.question.includes('comorbid') || question.question.includes('additional condition')) {
    // Initialize comorbidities array if it doesn't exist
    if (!complexity.comorbidities) {
      complexity.comorbidities = [];
    }
    complexity.comorbidities.push(selectedOption.text);
  } else if (question.question.includes('communication') || question.question.includes('barrier')) {
    // Initialize communication challenges array if it doesn't exist
    if (!complexity.communicationChallenges) {
      complexity.communicationChallenges = [];
    }
    complexity.communicationChallenges.push(selectedOption.text);
  } else if (question.question.includes('abnormal') || question.question.includes('finding')) {
    // Initialize abnormal findings array if it doesn't exist
    if (!complexity.abnormalFindings) {
      complexity.abnormalFindings = [];
    }
    complexity.abnormalFindings.push(selectedOption.text);
  }
  
  return complexity;
}

/**
 * Maps a selected parameter option to educational elements
 */
function mapEducationalParameter(
  question: ParameterQuestion, 
  selectedOptionId: string,
  elements: EducationalElements
): EducationalElements {
  // Find the selected option
  const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
  if (!selectedOption) return elements;
  
  const optionText = selectedOption.text.toLowerCase();
  
  // Map based on question content
  if (question.question.includes('documentation') || question.question.includes('record')) {
    // Initialize documentation types array if it doesn't exist
    if (!elements.documentationTypes) {
      elements.documentationTypes = [];
    }
    
    // Add default documentation based on option text
    if (optionText.includes('all')) {
      elements.documentationTypes = [
        'History and Physical',
        'Progress Notes',
        'Nursing Assessment',
        'Medication Administration Record',
        'Laboratory Results',
        'Diagnostic Imaging Reports',
        'Consultant Notes'
      ];
    } else {
      elements.documentationTypes.push(selectedOption.text);
    }
  } else if (question.question.includes('decision') || question.question.includes('intervention point')) {
    // Initialize decision points array if it doesn't exist
    if (!elements.learnerDecisionPoints) {
      elements.learnerDecisionPoints = [];
    }
    elements.learnerDecisionPoints.push(selectedOption.text);
  } else if (question.question.includes('action') || question.question.includes('critical')) {
    // Initialize critical actions array if it doesn't exist
    if (!elements.criticalActions) {
      elements.criticalActions = [];
    }
    elements.criticalActions.push(selectedOption.text);
  } else if (question.question.includes('assessment') || question.question.includes('evaluate')) {
    // Initialize assessment focus array if it doesn't exist
    if (!elements.assessmentFocus) {
      elements.assessmentFocus = [];
    }
    elements.assessmentFocus.push(selectedOption.text);
  }
  
  return elements;
}

/**
 * Calculate vital signs based on demographics and condition severity
 */
function calculateVitalSigns(demographics: PatientDemographics, complexity: PresentationComplexity): VitalSigns {
  // Get base vital signs for age range
  let ageKey = 'middle-aged'; // Default
  
  const ageRange = demographics.ageRange?.toLowerCase() || '';
  if (ageRange.includes('pediatric') || ageRange.includes('child') || ageRange.includes('0-18')) {
    ageKey = 'pediatric';
  } else if (ageRange.includes('young') || ageRange.includes('18-30') || ageRange.includes('20-40')) {
    ageKey = 'young-adult';
  } else if (ageRange.includes('middle') || ageRange.includes('30-50') || ageRange.includes('40-65')) {
    ageKey = 'middle-aged';
  } else if (ageRange.includes('elder') || ageRange.includes('senior') || ageRange.includes('65+') || ageRange.includes('70+')) {
    ageKey = 'elderly';
  }
  
  // Get base vital signs
  const baseVitalSigns = { ...AGE_VITAL_SIGNS_MAP[ageKey] };
  
  // Adjust for severity
  let severityKey = 'mild'; // Default
  const severity = complexity.primaryConditionSeverity?.toLowerCase() || '';
  
  if (severity.includes('mild')) {
    severityKey = 'mild';
  } else if (severity.includes('moderate')) {
    severityKey = 'moderate';
  } else if (severity.includes('severe')) {
    severityKey = 'severe';
  } else if (severity.includes('critical')) {
    severityKey = 'critical';
  }
  
  // Apply severity adjustments
  const adjustments = SEVERITY_VITAL_SIGN_ADJUSTMENTS[severityKey];
  
  if (adjustments.heartRate) {
    baseVitalSigns.heartRate.min += adjustments.heartRate.min;
    baseVitalSigns.heartRate.max += adjustments.heartRate.max;
  }
  
  if (adjustments.respiratoryRate) {
    baseVitalSigns.respiratoryRate.min += adjustments.respiratoryRate.min;
    baseVitalSigns.respiratoryRate.max += adjustments.respiratoryRate.max;
  }
  
  if (adjustments.oxygenSaturation) {
    baseVitalSigns.oxygenSaturation.min += adjustments.oxygenSaturation.min;
    baseVitalSigns.oxygenSaturation.max += adjustments.oxygenSaturation.max;
    
    // Ensure O2 saturation doesn't go below 70% or above 100%
    baseVitalSigns.oxygenSaturation.min = Math.max(70, baseVitalSigns.oxygenSaturation.min);
    baseVitalSigns.oxygenSaturation.max = Math.min(100, baseVitalSigns.oxygenSaturation.max);
  }
  
  if (adjustments.consciousness) {
    baseVitalSigns.consciousness = adjustments.consciousness;
  }
  
  // Adjust for comorbidities (simplified version)
  if (complexity.comorbidities && complexity.comorbidities.length > 0) {
    // For each comorbidity, make a small adjustment to vital signs
    complexity.comorbidities.forEach(comorbidity => {
      const comText = comorbidity.toLowerCase();
      
      if (comText.includes('hypertension')) {
        baseVitalSigns.bloodPressure.systolic.min += 20;
        baseVitalSigns.bloodPressure.systolic.max += 30;
        baseVitalSigns.bloodPressure.diastolic.min += 10;
        baseVitalSigns.bloodPressure.diastolic.max += 15;
      } else if (comText.includes('diabetes')) {
        // No direct vital sign changes
      } else if (comText.includes('copd') || comText.includes('respiratory')) {
        baseVitalSigns.respiratoryRate.min += 2;
        baseVitalSigns.respiratoryRate.max += 4;
        baseVitalSigns.oxygenSaturation.min -= 3;
        baseVitalSigns.oxygenSaturation.max -= 2;
      } else if (comText.includes('heart') || comText.includes('cardiac')) {
        baseVitalSigns.heartRate.min += 5;
        baseVitalSigns.heartRate.max += 15;
      } else if (comText.includes('fever') || comText.includes('infection')) {
        baseVitalSigns.temperature.min += 1.0;
        baseVitalSigns.temperature.max += 1.5;
        baseVitalSigns.heartRate.min += 10;
        baseVitalSigns.heartRate.max += 20;
      }
    });
  }
  
  return baseVitalSigns;
}

/**
 * Maps parameter selections to case parameters using the question set for context
 */
export function mapParametersToCase(
  questions: ParameterQuestion[],
  selections: ParameterSelections,
  learningObjectives: LearningObjective[]
): CaseParameters {
  // Initialize empty case parameters
  const caseParameters: CaseParameters = {
    demographics: {
      ageRange: ''
    },
    clinicalContext: {
      setting: '',
      acuityLevel: '',
      availableResources: [],
      timelineSpan: ''
    },
    complexity: {
      primaryConditionSeverity: '',
      comorbidities: [],
      communicationChallenges: [],
      abnormalFindings: []
    },
    educationalElements: {
      documentationTypes: [],
      learnerDecisionPoints: [],
      criticalActions: [],
      assessmentFocus: []
    },
    recommendedVitalSigns: {
      heartRate: { min: 60, max: 100 },
      respiratoryRate: { min: 12, max: 20 },
      bloodPressure: { 
        systolic: { min: 120, max: 140 }, 
        diastolic: { min: 70, max: 85 } 
      },
      temperature: { min: 36.5, max: 37.5 },
      oxygenSaturation: { min: 95, max: 100 },
      consciousness: 'Alert'
    },
    learningObjectives: [...learningObjectives]
  };
  
  // Process each question and selected option
  questions.forEach(question => {
    const selectedOptionId = selections[question.id];
    
    // Skip if no selection was made for this question
    if (!selectedOptionId) return;
    
    // Map based on question category
    switch (question.category) {
      case 'Patient Demographics':
        caseParameters.demographics = mapDemographicParameter(
          question, 
          selectedOptionId, 
          caseParameters.demographics
        );
        break;
        
      case 'Clinical Context':
        caseParameters.clinicalContext = mapClinicalContextParameter(
          question, 
          selectedOptionId, 
          caseParameters.clinicalContext
        );
        break;
        
      case 'Presentation Complexity':
        caseParameters.complexity = mapComplexityParameter(
          question, 
          selectedOptionId, 
          caseParameters.complexity
        );
        break;
        
      case 'Educational Elements':
        caseParameters.educationalElements = mapEducationalParameter(
          question, 
          selectedOptionId, 
          caseParameters.educationalElements
        );
        break;
        
      default:
        console.warn(`Unknown question category: ${question.category}`);
    }
  });
  
  // Calculate recommended vital signs based on demographics and complexity
  caseParameters.recommendedVitalSigns = calculateVitalSigns(
    caseParameters.demographics, 
    caseParameters.complexity
  );
  
  return caseParameters;
}

/**
 * Gets the selected option text for a given question ID
 */
export function getSelectedOptionText(
  questions: ParameterQuestion[],
  selections: ParameterSelections,
  questionId: string
): string | null {
  const question = questions.find(q => q.id === questionId);
  if (!question) return null;
  
  const selectedOptionId = selections[questionId];
  if (!selectedOptionId) return null;
  
  const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
  return selectedOption ? selectedOption.text : null;
} 
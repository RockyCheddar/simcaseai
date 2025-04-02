import { useState } from 'react';
import { DynamicSection, parseContentToDynamicSections, classifyContent, enhancedParsePatientInfoSection } from '@/utils/contentClassifier';

// Define structured case data interface
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

/**
 * Client-side hook for generating simulation cases
 */
export function useAICase() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCase, setGeneratedCase] = useState<StructuredCaseData | null>(null);

  /**
   * Parse the markdown text into structured sections for the tabs
   */
  const parseGeneratedCaseText = (text: string, title: string): StructuredCaseData => {
    // Default structure
    const structuredData: StructuredCaseData = {
      title,
      rawText: text,
      overview: {
        caseSummary: '',
        status: 'Draft',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        clinicalSetting: '',
        learningObjectives: []
      },
      patientInfo: {},
      presentation: {},
      treatment: {},
      simulation: {},
      dynamicSections: {
        overview: [],
        'patient-info': [],
        presentation: [],
        treatment: [],
        simulation: []
      }
    };

    // Extract learning objectives
    const learningObjectivesMatch = text.match(/## Learning Objectives\s*\n([\s\S]*?)(?=##|$)/);
    if (learningObjectivesMatch && learningObjectivesMatch[1]) {
      structuredData.overview.learningObjectives = learningObjectivesMatch[1]
        .split('\n')
        .filter(line => line.trim().match(/^\d+\.\s+/))
        .map(line => line.replace(/^\d+\.\s+/, '').trim());
    }

    // Extract patient information
    const patientInfoMatch = text.match(/## Patient Information\s*\n([\s\S]*?)(?=##|$)/);
    if (patientInfoMatch && patientInfoMatch[1]) {
      const patientInfoText = patientInfoMatch[1];
      
      // Use the enhanced parser for better structured data
      const parsedPatientInfo = enhancedParsePatientInfoSection(patientInfoText);
      structuredData.patientInfo = { ...parsedPatientInfo };
      
      // Add dynamic sections for patient info
      const patientInfoSections = parseContentToDynamicSections(patientInfoMatch[1]);
      structuredData.dynamicSections['patient-info'] = patientInfoSections;
    }

    // Extract initial presentation
    const presentationMatch = text.match(/## (?:Initial )?Presentation\s*\n([\s\S]*?)(?=##|$)/);
    if (presentationMatch && presentationMatch[1]) {
      // Add dynamic sections for presentation
      const presentationSections = parseContentToDynamicSections(presentationMatch[1]);
      structuredData.dynamicSections.presentation = presentationSections;
      
      // Extract vital signs
      const vitalSignsMatch = presentationMatch[1].match(/(?:Vital [Ss]igns|Vitals).*?:([\s\S]*?)(?=\n\n|\n- [^\n]*:|$)/);
      if (vitalSignsMatch) {
        const vitalSignLines = vitalSignsMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
        structuredData.presentation.vitalSigns = vitalSignLines.map(line => {
          const [name, value] = line.replace(/^-\s*/, '').split(':').map(s => s.trim());
          return { name, value, unit: '', isAbnormal: false };
        });
      }
    }

    // Extract treatment information
    const treatmentMatch = text.match(/## (?:Treatment|Management|Interventions)\s*\n([\s\S]*?)(?=##|$)/i);
    if (treatmentMatch && treatmentMatch[1]) {
      // Add dynamic sections for treatment
      const treatmentSections = parseContentToDynamicSections(treatmentMatch[1]);
      structuredData.dynamicSections.treatment = treatmentSections;
    }

    // Extract progression scenarios
    const progressionMatch = text.match(/## Progression Scenarios\s*\n([\s\S]*?)(?=##|$)/);
    if (progressionMatch && progressionMatch[1]) {
      // Add to treatment tab
      const progressionSections = parseContentToDynamicSections(progressionMatch[1]);
      structuredData.dynamicSections.treatment.push(...progressionSections);
      
      // Attempt to parse progression scenarios as structured data
      const scenarios = progressionMatch[1].split(/\d+\.\s+/).filter(s => s.trim());
      structuredData.treatment.progressionScenarios = scenarios.map(scenario => {
        const lines = scenario.split('\n').filter(line => line.trim());
        const title = lines[0]?.trim() || 'Scenario';
        const content = lines.slice(1).join('\n');
        
        return {
          title,
          intervention: 'See scenario details',
          response: content,
          additionalNotes: ''
        };
      });
    }

    // Extract educational notes and debriefing
    const educationalNotesMatch = text.match(/## Educational Notes\s*\n([\s\S]*?)(?=##|$)/i);
    const debriefingMatch = text.match(/## Debriefing Guide\s*\n([\s\S]*?)(?=##|$)/i);
    
    if (educationalNotesMatch && educationalNotesMatch[1]) {
      const educationalSections = parseContentToDynamicSections(educationalNotesMatch[1]);
      structuredData.dynamicSections.simulation.push(...educationalSections);
    }
    
    if (debriefingMatch && debriefingMatch[1]) {
      const debriefingSections = parseContentToDynamicSections(debriefingMatch[1]);
      structuredData.dynamicSections.simulation.push(...debriefingSections);
      
      // Extract debriefing points
      const points = debriefingMatch[1]
        .split('\n')
        .filter(line => line.trim().match(/^-\s+/))
        .map(line => line.replace(/^-\s+/, '').trim());
      
      if (points.length > 0) {
        structuredData.simulation.debriefingPoints = points;
      }
    }

    // Add a summary section to overview
    const caseSummaryFromText = text.substring(0, 500).replace(/#+\s*.*?\n/g, '').trim();
    if (caseSummaryFromText) {
      structuredData.overview.caseSummary = caseSummaryFromText;
      structuredData.dynamicSections.overview.push({
        title: "Case Summary",
        content: caseSummaryFromText.substring(0, 300) + (caseSummaryFromText.length > 300 ? '...' : ''),
        contentType: "text"
      });
    }

    // Process any remaining sections as dynamic content
    const remainingSections = text.split(/##\s+/g).slice(1); // Skip the first element which is before any ##
    remainingSections.forEach(sectionText => {
      const lines = sectionText.split('\n').filter(l => l.trim());
      if (lines.length === 0) return;
      
      const sectionTitle = lines[0].trim();
      const sectionContent = lines.slice(1).join('\n').trim();
      
      if (!sectionTitle || !sectionContent) return;
      
      // Skip sections we've already processed
      const knownSections = [
        'Learning Objectives', 'Patient Information', 'Initial Presentation', 
        'Presentation', 'Treatment', 'Management', 'Interventions',
        'Progression Scenarios', 'Educational Notes', 'Debriefing Guide'
      ];
      
      if (knownSections.some(s => sectionTitle.includes(s))) return;
      
      // Classify the content to determine which tab it belongs to
      const tabCategory = classifyContent(sectionTitle + ' ' + sectionContent);
      
      const dynamicSection: DynamicSection = {
        title: sectionTitle,
        content: sectionContent,
        contentType: sectionContent.includes('\n- ') ? 'list' : 'text'
      };
      
      structuredData.dynamicSections[tabCategory].push(dynamicSection);
    });

    return structuredData;
  };

  /**
   * Generates a complete educational simulation case based on the provided parameters
   */
  const generateCase = async (caseParameters: any): Promise<StructuredCaseData> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Format the prompt for generating a complete case
      const prompt = `
        You are an expert in healthcare simulation case design. Create a comprehensive simulation case based on the following parameters:
        
        LEARNING OBJECTIVES:
        ${caseParameters.learningObjectives.map((obj: any, i: number) => `${i + 1}. ${obj.text}`).join('\n')}
        
        PATIENT DEMOGRAPHICS:
        - Age Range: ${caseParameters.demographics.ageRange}
        ${caseParameters.demographics.gender ? `- Gender: ${caseParameters.demographics.gender}` : ''}
        ${caseParameters.demographics.occupation ? `- Occupation: ${caseParameters.demographics.occupation}` : ''}
        ${caseParameters.demographics.socialContext ? `- Social Context: ${caseParameters.demographics.socialContext}` : ''}
        ${caseParameters.demographics.relevantHistory && caseParameters.demographics.relevantHistory.length > 0 
          ? `- Relevant History: ${caseParameters.demographics.relevantHistory.join(', ')}` 
          : ''}
        
        CLINICAL CONTEXT:
        - Setting: ${caseParameters.clinicalContext.setting}
        - Acuity Level: ${caseParameters.clinicalContext.acuityLevel}
        ${caseParameters.clinicalContext.timelineSpan ? `- Timeline: ${caseParameters.clinicalContext.timelineSpan}` : ''}
        - Available Resources:
          ${caseParameters.clinicalContext.availableResources.map((resource: string) => `* ${resource}`).join('\n      ')}
        
        PRESENTATION COMPLEXITY:
        - Primary Condition Severity: ${caseParameters.complexity.primaryConditionSeverity}
        ${caseParameters.complexity.comorbidities.length > 0 
          ? `- Comorbidities: ${caseParameters.complexity.comorbidities.join(', ')}` 
          : ''}
        ${caseParameters.complexity.communicationChallenges?.length > 0 
          ? `- Communication Challenges: ${caseParameters.complexity.communicationChallenges.join(', ')}` 
          : ''}
        ${caseParameters.complexity.abnormalFindings?.length > 0 
          ? `- Abnormal Findings: ${caseParameters.complexity.abnormalFindings.join(', ')}` 
          : ''}
        
        VITAL SIGNS RANGE:
        - Heart Rate: ${caseParameters.recommendedVitalSigns.heartRate.min}-${caseParameters.recommendedVitalSigns.heartRate.max} bpm
        - Respiratory Rate: ${caseParameters.recommendedVitalSigns.respiratoryRate.min}-${caseParameters.recommendedVitalSigns.respiratoryRate.max} /min
        - Blood Pressure: ${caseParameters.recommendedVitalSigns.bloodPressure.systolic.min}-${caseParameters.recommendedVitalSigns.bloodPressure.systolic.max}/${caseParameters.recommendedVitalSigns.bloodPressure.diastolic.min}-${caseParameters.recommendedVitalSigns.bloodPressure.diastolic.max} mmHg
        - Temperature: ${caseParameters.recommendedVitalSigns.temperature.min}-${caseParameters.recommendedVitalSigns.temperature.max}°C
        - Oxygen Saturation: ${caseParameters.recommendedVitalSigns.oxygenSaturation.min}-${caseParameters.recommendedVitalSigns.oxygenSaturation.max}%
        - Consciousness: ${caseParameters.recommendedVitalSigns.consciousness}
        
        EDUCATIONAL ELEMENTS:
        ${caseParameters.educationalElements?.documentationTypes?.length > 0 
          ? `- Documentation Types: ${caseParameters.educationalElements.documentationTypes.join(', ')}` 
          : ''}
        ${caseParameters.educationalElements?.learnerDecisionPoints?.length > 0 
          ? `- Decision Points: ${caseParameters.educationalElements.learnerDecisionPoints.join(', ')}` 
          : ''}
        ${caseParameters.educationalElements?.criticalActions?.length > 0 
          ? `- Critical Actions: ${caseParameters.educationalElements.criticalActions.join(', ')}` 
          : ''}
        ${caseParameters.educationalElements?.assessmentFocus?.length > 0 
          ? `- Assessment Focus: ${caseParameters.educationalElements.assessmentFocus.join(', ')}` 
          : ''}
        
        Create a detailed simulation case document formatted in Markdown with the following sections:
        
        1. ## Case Title
           - Create a descriptive and educational title for the case
        
        2. ## Learning Objectives
           - List the learning objectives
        
        3. ## Patient Information
           - Name (fictional): Create a realistic fictional full name (first and last name) appropriate for the demographics
           - Age, gender, occupation
           - Chief complaint
           - Brief history of present illness
           - Past medical history
           - Medications
           - Allergies
           - Social history
           - Family history
        
        4. ## Initial Presentation
           - Vital signs (within the ranges specified)
           - Physical examination findings
           - Initial assessment
        
        5. ## Progression Scenarios
           - Include at least 3 possible progression points
           - For each progression, describe changes in condition, vital signs, and appropriate interventions
        
        6. ## Treatment Plan
           - Initial management steps
           - Medications
           - Procedures
           - Monitoring parameters
        
        7. ## Case Documentation
           - Include sample documentation based on the specified documentation types
           - Laboratory results (if applicable)
           - Diagnostic findings (if applicable)
        
        8. ## Educational Notes
           - Specific teaching points related to the case
           - Common pitfalls or challenges
           - Key decision points and critical actions
        
        9. ## Simulation Learning
           - Essential skills to be practiced
           - Assessment criteria
           - Suggested simulation setup
        
        10. ## Debriefing Guide
           - Questions to discuss with learners
           - Expected outcomes
           - Areas for reflection
        
        The case should be medically accurate, educationally sound, and highly detailed to support simulation-based education.
        Make sure the case is realistic and reflects the complexity level specified in the parameters.
      `;
      
      const system = "You are an expert in healthcare simulation design with years of experience creating realistic, educationally sound simulation scenarios for healthcare education.";
      
      console.log('Making direct API call to Claude endpoint for case generation');
      
      // Create an AbortController with a longer timeout for complex case generation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 110000); // 110 second client-side timeout
      
      try {
        const response = await fetch('/api/ai/claude', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            temperature: 0.7,
            max_tokens: 4000,
            system
          }),
          signal: controller.signal
        });
        
        // Clear the timeout since we got a response
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error:", errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
          throw new Error('Invalid response format from API route');
        }
        
        const responseText = data.content[0].text;
        
        // Extract a title from the response
        const titleMatch = responseText.match(/# (.+)|## Case Title\s*\n+(.+)/m);
        const title = titleMatch 
          ? (titleMatch[1] || titleMatch[2]).trim() 
          : "Healthcare Simulation Case";
        
        // Parse the generated text into structured data
        const structuredData = parseGeneratedCaseText(responseText, title);
        
        setGeneratedCase(structuredData);
        return structuredData;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to generate case';
        setError(errorMessage);
        console.error('Error generating case:', err);
        
        // Generate a basic fallback case
        return generateFallbackCase(caseParameters);
      } finally {
        setIsGenerating(false);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate case';
      setError(errorMessage);
      console.error('Error generating case:', err);
      
      // Generate a basic fallback case
      return generateFallbackCase(caseParameters);
    }
  };

  /**
   * Generates a simple fallback case when the API call fails
   */
  const generateFallbackCase = (caseParameters: any): StructuredCaseData => {
    console.log('Using fallback case structure due to API error');
    
    // Create a basic title based on the learning objectives
    const condition = caseParameters.complexity?.primaryCondition || 
                     "Medical Condition";
    const title = `Simulation Case: ${condition}`;
    
    // Generate a basic case structure
    const caseText = `
  # ${title}
  
  ## Learning Objectives
  ${caseParameters.learningObjectives.map((obj: any, i: number) => `${i + 1}. ${obj.text}`).join('\n')}
  
  ## Patient Information
  - Name: Sarah Johnson
  - Age: ${caseParameters.demographics?.ageRange || "Adult"}
  - Gender: ${caseParameters.demographics?.gender || "Not specified"}
  ${caseParameters.demographics?.occupation ? `- Occupation: ${caseParameters.demographics.occupation}` : ''}
  - Chief Complaint: Symptoms related to ${condition}
  - History of Present Illness: Recent onset of symptoms consistent with ${condition}
  - Past Medical History: ${caseParameters.complexity?.comorbidities?.join(', ') || "None significant"}
  - Medications: Appropriate for existing conditions
  - Allergies: None known
  ${caseParameters.demographics?.socialContext ? `- Social History: ${caseParameters.demographics.socialContext}` : ''}
  
  ## Initial Presentation
  - Vital Signs:
    - Heart Rate: ${caseParameters.recommendedVitalSigns?.heartRate?.min || "80"} bpm
    - Respiratory Rate: ${caseParameters.recommendedVitalSigns?.respiratoryRate?.min || "16"} /min
    - Blood Pressure: ${caseParameters.recommendedVitalSigns?.bloodPressure?.systolic?.min || "120"}/${caseParameters.recommendedVitalSigns?.bloodPressure?.diastolic?.min || "80"} mmHg
    - Temperature: ${caseParameters.recommendedVitalSigns?.temperature?.min || "37.0"}°C
    - Oxygen Saturation: ${caseParameters.recommendedVitalSigns?.oxygenSaturation?.min || "98"}%
    - Consciousness: ${caseParameters.recommendedVitalSigns?.consciousness || "Alert"}
  - Physical Examination Findings: Normal examination with findings consistent with the presenting condition.
  - Initial Assessment: Patient is stable and requires further evaluation.
  
  ## Progression Scenarios
  1. Improvement Scenario
     - The patient shows improvement with appropriate interventions.
     - Vital signs normalize.
     
  2. Deterioration Scenario
     - If appropriate interventions are not taken, the patient's condition worsens.
     - Vital signs deteriorate.
     
  3. Complication Scenario
     - A complication develops related to the primary condition.
     - Requires additional interventions.
  
  ## Treatment Plan
  - Initial steps: Assessment and stabilization
  - Medications: As appropriate for the condition
  - Monitoring: Vital signs and response to treatment
  
  ## Case Documentation
  - Basic documentation templates provided
  - Laboratory results: Within normal ranges except those relevant to the condition
  - Diagnostic findings: Consistent with the condition
  
  ## Educational Notes
  - This case addresses the specified learning objectives
  - Focus on key decision points: ${caseParameters.educationalElements?.learnerDecisionPoints?.join(', ') || "assessment, diagnosis, and treatment"}
  - Critical actions: ${caseParameters.educationalElements?.criticalActions?.join(', ') || "proper assessment and management"}
  
  ## Simulation Learning
  - Skills to practice: Assessment, communication, clinical reasoning
  - Setup: Standard simulation room with appropriate monitoring equipment
  
  ## Debriefing Guide
  - What was your initial approach to this case?
  - What were the key findings that influenced your decision-making?
  - How did you prioritize interventions?
  - What would you do differently next time?
  - How does this case relate to your clinical practice?
  `;
    
    return parseGeneratedCaseText(caseText, title);
  };

  return {
    generateCase,
    isGenerating,
    error,
    generatedCase,
    parseGeneratedCaseText
  };
}

export default useAICase; 
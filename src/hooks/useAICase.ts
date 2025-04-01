import { useState } from 'react';

/**
 * Client-side hook for generating simulation cases
 */
export function useAICase() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCase, setGeneratedCase] = useState<{ text: string; title: string } | null>(null);

  /**
   * Generates a complete educational simulation case based on the provided parameters
   */
  const generateCase = async (caseParameters: any): Promise<{ text: string; title: string; }> => {
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
        
        6. ## Case Documentation
           - Include sample documentation based on the specified documentation types
           - Laboratory results (if applicable)
           - Diagnostic findings (if applicable)
        
        7. ## Educational Notes
           - Specific teaching points related to the case
           - Common pitfalls or challenges
           - Key decision points and critical actions
        
        8. ## Debriefing Guide
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
        
        const result = {
          text: responseText,
          title: title
        };
        
        setGeneratedCase(result);
        return result;
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
  const generateFallbackCase = (caseParameters: any): { text: string; title: string } => {
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
  
  ## Case Documentation
  - Basic documentation templates provided
  - Laboratory results: Within normal ranges except those relevant to the condition
  - Diagnostic findings: Consistent with the condition
  
  ## Educational Notes
  - This case addresses the specified learning objectives
  - Focus on key decision points: ${caseParameters.educationalElements?.learnerDecisionPoints?.join(', ') || "assessment, diagnosis, and treatment"}
  - Critical actions: ${caseParameters.educationalElements?.criticalActions?.join(', ') || "proper assessment and management"}
  
  ## Debriefing Guide
  - What was your initial approach to this case?
  - What were the key findings that influenced your decision-making?
  - How did you prioritize interventions?
  - What would you do differently next time?
  - How does this case relate to your clinical practice?
  `;
  
    return {
      text: caseText,
      title: title
    };
  };

  return {
    generateCase,
    isGenerating,
    error,
    generatedCase,
  };
}

export default useAICase; 
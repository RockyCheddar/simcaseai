import { callClaude } from './providers/claude';
import { callChatGPT } from './providers/chatgpt';
import { callPerplexity } from './providers/perplexity';

export type AIProvider = 'claude' | 'chatgpt' | 'perplexity' | 'test';

export interface AIResponse {
  text: string;
  provider: AIProvider;
  timestamp: string;
  modelUsed?: string;
}

export interface AIOptions {
  prompt: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  system?: string;
  testMode?: boolean;
}

// Utility to select the optimal AI provider based on the task
export function selectOptimalProvider(task: string): AIProvider {
  // Logic to determine which AI model is best for this task
  if (task.includes('complex medical') || task.includes('clinical accuracy')) {
    return 'claude'; // Claude may be better for complex medical content
  } else if (task.includes('fact check') || task.includes('research')) {
    return 'perplexity'; // Perplexity is good for research tasks
  } else {
    return 'claude'; // Default to Claude instead of ChatGPT since we have that key
  }
}

// Test mode response to avoid API calls during development/testing
function getTestResponse(prompt: string, provider: AIProvider): AIResponse {
  console.log("Using TEST MODE - no actual API call made");
  return {
    text: `This is a test response to: "${prompt}"\n\nNo actual AI API was called. This is a mock response for testing purposes.`,
    provider,
    timestamp: new Date().toISOString(),
    modelUsed: `${provider}-test-mode`
  };
}

// Main function to generate AI responses using the appropriate provider
export async function generateAIResponse(options: AIOptions): Promise<AIResponse> {
  const { 
    prompt, 
    provider = selectOptimalProvider(prompt), 
    temperature = 0.7, 
    maxTokens = 4000,
    system,
    testMode = false
  } = options;
  
  console.log(`Using AI provider: ${provider}`);
  
  // If test mode is enabled, return mock response immediately
  if (testMode) {
    return getTestResponse(prompt, provider);
  }
  
  try {
    // Call the appropriate provider API
    switch (provider) {
      case 'claude':
        return await callClaude({
          prompt,
          temperature,
          max_tokens: maxTokens,
          system
        });
      
      case 'chatgpt':
        return await callChatGPT({
          prompt,
          temperature,
          max_tokens: maxTokens,
          system
        });
      
      case 'perplexity':
        return await callPerplexity({
          prompt,
          temperature,
          max_tokens: maxTokens,
          system
        });
      
      case 'test':
        return getTestResponse(prompt, 'test');
        
      default:
        // If provider is not recognized, use Claude as fallback
        console.log(`Unknown provider ${provider}, falling back to Claude`);
        return await callClaude({
          prompt,
          temperature,
          max_tokens: maxTokens,
          system
        });
    }
  } catch (error) {
    console.error(`Error generating AI response with ${provider}:`, error);
    
    // Don't try to fallback to ChatGPT if we don't have the key
    if (provider === 'chatgpt') {
      throw error;
    }
    
    // If Claude fails, try Perplexity
    if (provider === 'claude') {
      console.log('Falling back to Perplexity after Claude failure');
      return generateAIResponse({
        ...options,
        provider: 'perplexity'
      });
    }
    
    // If Perplexity fails, try Claude
    if (provider === 'perplexity') {
      console.log('Falling back to Claude after Perplexity failure');
      return generateAIResponse({
        ...options,
        provider: 'claude'
      });
    }
    
    throw error;
  }
}

export async function analyzeObjectives(objectives: string[]): Promise<string[]> {
  // Format the prompt for analyzing learning objectives
  const prompt = `
    As a medical education expert, please analyze and refine the following learning objectives for a healthcare simulation case:
    
    ${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}
    
    For each objective, provide a refined version that:
    1. Uses specific, measurable action verbs (e.g., identify, demonstrate, analyze)
    2. Clearly specifies the expected outcome
    3. Aligns with healthcare professional competencies
    4. Is concise and focused on a single learning point
    
    Return ONLY the refined objectives, one per line, numbered to match the original list.
  `;
  
  const provider = selectOptimalProvider('complex medical analysis');
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider,
      system: "You are an expert in medical education and healthcare simulation design with expertise in creating effective learning objectives that align with professional competencies."
    });
    
    // Parse the response text into separate objectives
    const refinedObjectives = response.text
      .split('\n')
      .filter(line => line.trim().match(/^\d+\.\s/)) // Only lines starting with a number and period
      .map(line => line.replace(/^\d+\.\s+/, '').trim()); // Remove the numbering
    
    return refinedObjectives;
  } catch (error) {
    console.error('Error analyzing objectives:', error);
    return objectives.map(obj => `Refined: ${obj}`); // Fallback
  }
}

export async function generateCaseParameters(objectives: string[]): Promise<Record<string, any>> {
  // Format the prompt for generating case parameters
  const prompt = `
    Based on the following learning objectives for a healthcare simulation case:
    
    ${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}
    
    Generate appropriate patient and clinical parameters that would create an effective simulation case to meet these objectives.
    
    Include:
    1. Patient demographics (age, gender, relevant background)
    2. Chief complaint
    3. Key medical history elements
    4. Important physical findings
    5. Initial vital signs
    6. Key contextual factors
    
    Format the response as a structured JSON object with these categories.
  `;
  
  const provider = selectOptimalProvider('clinical accuracy');
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider,
      system: "You are a clinical expert in creating realistic patient scenarios for healthcare education. Generate detailed, medically accurate case parameters that align with specified learning objectives."
    });
    
    // Parse the JSON from the response
    // Look for JSON in the response using a regex to extract JSON objects
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If we can't extract JSON, return a simple object with the text
    return {
      rawResponse: response.text,
      error: "Failed to parse structured parameters"
    };
  } catch (error) {
    console.error('Error generating case parameters:', error);
    // Fallback with mock data
    return {
      patientAge: 45,
      patientGender: 'female',
      chiefComplaint: 'shortness of breath',
      medicalHistory: ['hypertension', 'type 2 diabetes'],
      error: "Error occurred during generation"
    };
  }
}

export async function generateCaseComponents(parameters: Record<string, any>): Promise<Record<string, any>> {
  // Format the prompt for generating case components
  const prompt = `
    Using the following patient parameters:
    
    ${JSON.stringify(parameters, null, 2)}
    
    Generate a comprehensive healthcare simulation case with the following components:
    
    1. Detailed patient profile
    2. Initial assessment findings
    3. Diagnostic results (labs, imaging, etc.)
    4. Expected interventions and decision points
    5. Progression scenarios (improvement and deterioration paths)
    6. Debriefing points
    
    Format the response as a structured JSON object with these categories.
  `;
  
  const provider = selectOptimalProvider('complex medical content');
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider,
      temperature: 0.5, // Lower temperature for more consistent results
      system: "You are a medical simulation expert who creates detailed, clinically accurate simulation cases. Generate structured content that follows best practices in simulation design."
    });
    
    // Parse the JSON from the response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If we can't extract JSON, return a simple object with the text
    return {
      rawResponse: response.text,
      error: "Failed to parse structured components"
    };
  } catch (error) {
    console.error('Error generating case components:', error);
    // Fallback with mock structure
    return {
      patientProfile: { /* details */ },
      initialAssessment: { /* details */ },
      diagnostics: { /* details */ },
      treatmentOptions: { /* details */ },
      error: "Error occurred during generation"
    };
  }
}

export async function generateEdEHRJson(caseData: Record<string, any>): Promise<string> {
  // Format the prompt for generating EdEHR-compatible JSON
  const prompt = `
    Convert the following healthcare simulation case data into EdEHR-compatible JSON format:
    
    ${JSON.stringify(caseData, null, 2)}
    
    Ensure the output follows all EdEHR data structure requirements and includes all necessary fields for:
    - Patient demographics
    - Medical history
    - Medications
    - Laboratory results
    - Imaging studies
    - Clinical notes
    
    Return ONLY the valid JSON with no additional explanation or text.
  `;
  
  const provider = selectOptimalProvider('data formatting');
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider,
      system: "You are a technical expert in healthcare data standards and EHR systems. Generate valid, well-structured JSON that meets the EdEHR format requirements."
    });
    
    // Extract just the JSON part from the response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    
    // If no JSON is found, return the raw text
    return response.text;
  } catch (error) {
    console.error('Error generating EdEHR JSON:', error);
    // Return a simple JSON string as fallback
    return JSON.stringify(caseData, null, 2);
  }
}

export async function generateFacultyGuide(caseData: Record<string, any>): Promise<string> {
  // Format the prompt for generating a faculty guide
  const prompt = `
    Create a comprehensive faculty guide for the following healthcare simulation case:
    
    ${JSON.stringify(caseData, null, 2)}
    
    The guide should include:
    
    1. Case overview and educational objectives
    2. Setup instructions (equipment, environment, actors)
    3. Facilitation notes with timing guidelines
    4. Expected student actions and decision points
    5. Common pitfalls and how to address them
    6. Debriefing guide with key discussion questions
    
    Format the guide in Markdown with clear headings, bullet points, and tables where appropriate.
  `;
  
  const provider = selectOptimalProvider('educational content');
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider,
      system: "You are an experienced healthcare simulation educator who creates comprehensive faculty guides. Generate detailed, instructionally sound content that helps faculty effectively run simulations."
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating faculty guide:', error);
    return `# Faculty Guide\n\n## Case Overview\n\n...`; // Fallback
  }
}

export async function generateStudentMaterials(caseData: Record<string, any>): Promise<string> {
  // Format the prompt for generating student materials
  const prompt = `
    Create student materials for the following healthcare simulation case:
    
    ${JSON.stringify(caseData, null, 2)}
    
    Include:
    
    1. Pre-briefing information
    2. Available patient data at the start
    3. Any role-specific instructions
    4. Resources they can access during the simulation
    5. Worksheets or documentation templates (if applicable)
    
    Ensure the materials provide enough information for students to engage with the case but don't reveal the expected outcomes or interventions.
    Format the materials in Markdown with clear sections.
  `;
  
  const provider = selectOptimalProvider('educational content');
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider,
      system: "You are an educational expert who creates clear, concise student materials for healthcare simulations. Generate content that provides appropriate guidance without revealing critical thinking pathways."
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating student materials:', error);
    return `# Student Instructions\n\n## Case Introduction\n\n...`; // Fallback
  }
}

export async function generateAssessmentRubrics(objectives: string[]): Promise<string> {
  // Format the prompt for generating assessment rubrics
  const prompt = `
    Create detailed assessment rubrics for evaluating student performance in a healthcare simulation based on these learning objectives:
    
    ${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}
    
    For each objective, provide:
    
    1. Clear criteria for performance assessment
    2. Descriptors for different levels of performance (Excellent, Satisfactory, Needs Improvement)
    3. Observable behaviors that demonstrate achievement
    4. Suggested weighting/importance
    
    Format the rubrics in Markdown with tables for each objective.
  `;
  
  const provider = selectOptimalProvider('educational assessment');
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider,
      system: "You are an expert in healthcare education assessment who creates detailed, fair evaluation rubrics aligned with learning objectives. Generate rubrics that facilitate objective assessment of competencies."
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating assessment rubrics:', error);
    return `# Assessment Rubric\n\n## Learning Objectives\n\n...`; // Fallback
  }
}

export async function generateCaseParameterQuestions(objectives: string[]): Promise<Record<string, any>> {
  // Format the prompt for generating case parameter questions
  const prompt = `
    As a medical education expert, analyze these learning objectives for a healthcare simulation case:
    
    ${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}
    
    Generate 5-8 critical parameter questions that faculty should answer to create an effective simulation case.
    For each question:
    1. Create a clear, specific question related to the learning objectives
    2. Provide 3-5 multiple-choice options
    3. Include a brief rationale explaining why this parameter matters educationally
    
    Questions should cover these categories:
    - Patient Demographics (age, social context, relevant background)
    - Clinical Context (setting, timing, available resources)
    - Presentation Complexity (severity, comorbidities, communication challenges)
    - Educational Elements (documentation types, abnormal findings, decision points)
    
    Structure the response as a JSON object with this format:
    {
      "questions": [
        {
          "id": "q1",
          "category": "Patient Demographics",
          "question": "What is the age range of the patient?",
          "options": [
            {"id": "q1_a", "text": "18-30 years"},
            {"id": "q1_b", "text": "31-50 years"},
            {"id": "q1_c", "text": "51-70 years"},
            {"id": "q1_d", "text": "71+ years"}
          ],
          "rationale": "Patient age affects clinical presentation, treatment options, and comorbidity likelihood."
        },
        // more questions...
      ]
    }
  `;
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider: 'claude', // Explicitly use Claude for this task
      system: "You are an expert in medical education and healthcare simulation design. Your role is to help faculty create realistic, educationally sound simulation cases by generating thoughtful questions that will define key case parameters.",
      maxTokens: 4000 // Ensure we have enough tokens for a comprehensive response
    });
    
    // Extract and parse the JSON from the response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedQuestions = JSON.parse(jsonMatch[0]);
        return parsedQuestions;
      } catch (parseError) {
        console.error('Error parsing question JSON:', parseError);
        return { 
          error: "Failed to parse response format",
          rawResponse: response.text
        };
      }
    }
    
    // Fallback if JSON parsing fails
    return {
      error: "Failed to generate properly formatted questions",
      rawResponse: response.text
    };
  } catch (error) {
    console.error('Error generating case parameter questions:', error);
    return {
      error: "Error occurred while generating questions",
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Generates a complete educational simulation case based on the provided parameters
 */
export async function generateCase(caseParameters: any): Promise<{ text: string; title: string; }> {
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
    ${caseParameters.complexity.communicationChallenges.length > 0 
      ? `- Communication Challenges: ${caseParameters.complexity.communicationChallenges.join(', ')}` 
      : ''}
    ${caseParameters.complexity.abnormalFindings.length > 0 
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
    ${caseParameters.educationalElements.documentationTypes.length > 0 
      ? `- Documentation Types: ${caseParameters.educationalElements.documentationTypes.join(', ')}` 
      : ''}
    ${caseParameters.educationalElements.learnerDecisionPoints.length > 0 
      ? `- Decision Points: ${caseParameters.educationalElements.learnerDecisionPoints.join(', ')}` 
      : ''}
    ${caseParameters.educationalElements.criticalActions.length > 0 
      ? `- Critical Actions: ${caseParameters.educationalElements.criticalActions.join(', ')}` 
      : ''}
    ${caseParameters.educationalElements.assessmentFocus.length > 0 
      ? `- Assessment Focus: ${caseParameters.educationalElements.assessmentFocus.join(', ')}` 
      : ''}
    
    Create a detailed simulation case document formatted in Markdown with the following sections:
    
    1. ## Case Title
       - Create a descriptive and educational title for the case
    
    2. ## Learning Objectives
       - List the learning objectives
    
    3. ## Patient Information
       - Name (fictional)
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
  
  try {
    const response = await generateAIResponse({
      prompt,
      provider: 'claude', // Explicitly use Claude for this complex task
      system: "You are an expert in healthcare simulation design with years of experience creating realistic, educationally sound simulation scenarios for healthcare education.",
      maxTokens: 4000 // Ensure we have enough tokens for a comprehensive response
    });
    
    // Extract a title from the response (assuming the first line is the title or contains the title)
    const titleMatch = response.text.match(/# (.+)|## Case Title\s*\n+(.+)/m);
    const title = titleMatch 
      ? (titleMatch[1] || titleMatch[2]).trim() 
      : "Healthcare Simulation Case";
    
    return {
      text: response.text,
      title: title
    };
  } catch (error) {
    console.error('Error generating case:', error);
    throw new Error(`Failed to generate case: ${error instanceof Error ? error.message : String(error)}`);
  }
} 
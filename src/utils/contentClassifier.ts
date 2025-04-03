/**
 * Tab category types
 */
export type TabCategory = 'overview' | 'patient-info' | 'presentation' | 'treatment' | 'simulation';

/**
 * Dynamic section structure for flexible content
 */
export interface DynamicSection {
  title: string;
  content: string | string[];
  contentType?: 'text' | 'list' | 'table' | 'steps';
  importance?: 'normal' | 'high' | 'low';
}

/**
 * Interface for diagnostic studies
 */
export interface DiagnosticStudy {
  name: string;
  result: string;
  normalRange: string;
  date: string;
  isAbnormal: boolean;
}

/**
 * Content classifier - determines which tab is most appropriate for given content
 */
export function classifyContent(content: string): TabCategory {
  // Convert to lowercase for case-insensitive matching
  const lowerContent = content.toLowerCase();
  
  // Educational/simulation related keywords - check these first as they are more specific
  if (lowerContent.match(/simulation|learning|education|competency|objective|skill|training|assessment|evaluation|scenario|debriefing|teaching|pitfall|decision point|key point|key decision|critical action|questions to discuss|expected outcome|anticipated outcome/i)) {
    return 'simulation';
  }
  
  // Treatment related keywords
  if (lowerContent.match(/treatment|medication|therapy|prescri|dosage|intervention|management|care plan|drug|administer|dose|regimen/i)) {
    return 'treatment';
  }
  
  // Patient information related keywords
  if (lowerContent.match(/history|demographic|allerg|medication history|past medical|family history|social|living situation|occupation|patient background/i)) {
    return 'patient-info';
  }
  
  // Presentation related keywords
  if (lowerContent.match(/vital sign|lab|diagnostic|symptom|physical exam|assessment|finding|presentation|chief complaint|imaging|result/i)) {
    return 'presentation';
  }
  
  // If no specific match is found, default to overview
  return 'overview';
}

/**
 * Parse patient information section text into structured fields
 */
export function parsePatientInfoText(text: string): Record<string, any> {
  const patientInfo: Record<string, any> = {};
  
  // Extract name
  const nameMatch = text.match(/(?:\*\*)?Name(?:\s+\(fictional\))?(?:\*\*)?:\s*(.*?)(?:\n|$)/i);
  if (nameMatch) patientInfo.name = nameMatch[1].trim();
  
  // Extract age
  const ageMatch = text.match(/(?:\*\*)?Age(?:\*\*)?:\s*(.*?)(?:\n|$)/i);
  if (ageMatch) patientInfo.age = ageMatch[1].trim();
  
  // Extract gender
  const genderMatch = text.match(/(?:\*\*)?Gender(?:\*\*)?:\s*(.*?)(?:\n|$)/i);
  if (genderMatch) patientInfo.gender = genderMatch[1].trim();
  
  // Extract occupation
  const occupationMatch = text.match(/(?:\*\*)?Occupation(?:\*\*)?:\s*(.*?)(?:\n|$)/i);
  if (occupationMatch) patientInfo.occupation = occupationMatch[1].trim();
  
  // Extract chief complaint
  const chiefComplaintMatch = text.match(/(?:\*\*)?Chief[- ]?complaint(?:\*\*)?:\s*(.*?)(?:\n|$)/i);
  if (chiefComplaintMatch) patientInfo.chiefComplaint = chiefComplaintMatch[1].trim();
  
  // Extract brief history
  const briefHistoryMatch = text.match(/(?:\*\*)?Brief history of present illness(?:\*\*)?:\s*(.*?)(?=\n\*\*|\n-|\n\n|$)/i);
  if (briefHistoryMatch) patientInfo.briefHistory = briefHistoryMatch[1].trim();
  
  // Extract past medical history
  let medicalHistoryMatch = text.match(/(?:\*\*)?Past medical history(?:\*\*)?:?\s*([\s\S]*?)(?=\n\*\*|\n\n|$)/i);
  if (medicalHistoryMatch) {
    const medHistoryText = medicalHistoryMatch[1].trim();
    // Check if it's a list format
    if (medHistoryText.includes('\n')) {
      patientInfo.conditions = medHistoryText
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);
    } else {
      patientInfo.conditions = [medHistoryText];
    }
  }
  
  // Extract medications
  let medicationsMatch = text.match(/(?:\*\*)?Medications(?:\*\*)?:?\s*([\s\S]*?)(?=\n\*\*|\n\n|$)/i);
  if (medicationsMatch) {
    const medsText = medicationsMatch[1].trim();
    if (medsText.includes('\n')) {
      patientInfo.medications = medsText
        .split('\n')
        .map(line => {
          const med = line.replace(/^-\s*/, '').trim();
          const medParts = med.match(/(.*?)\s+(\d+\w+(?:\s+\w+)*(?:\s+\([^)]+\))?)$/);
          if (medParts) {
            return { name: medParts[1].trim(), dosage: medParts[2].trim() };
          }
          return { name: med, dosage: '' };
        })
        .filter(med => med.name.length > 0);
    } else if (medsText.length > 0) {
      patientInfo.medications = [{ name: medsText, dosage: '' }];
    } else {
      patientInfo.medications = [];
    }
  }
  
  // Extract allergies
  let allergiesMatch = text.match(/(?:\*\*)?Allergies(?:\*\*)?:?\s*([\s\S]*?)(?=\n\*\*|\n\n|$)/i);
  if (allergiesMatch) {
    const allergiesText = allergiesMatch[1].trim();
    if (allergiesText.toLowerCase().includes('no known')) {
      patientInfo.allergies = [];
    } else if (allergiesText.includes('\n')) {
      patientInfo.allergies = allergiesText
        .split('\n')
        .map(line => {
          const allergy = line.replace(/^-\s*/, '').trim();
          const allergyParts = allergy.match(/(.*?)\s+\((.*)\)$/);
          if (allergyParts) {
            return { allergen: allergyParts[1].trim(), reaction: allergyParts[2].trim() };
          }
          return { allergen: allergy, reaction: '' };
        })
        .filter(allergy => allergy.allergen.length > 0);
    } else if (allergiesText.length > 0) {
      const allergyParts = allergiesText.match(/(.*?)\s+\((.*)\)$/);
      if (allergyParts) {
        patientInfo.allergies = [{ allergen: allergyParts[1].trim(), reaction: allergyParts[2].trim() }];
      } else {
        patientInfo.allergies = [{ allergen: allergiesText, reaction: '' }];
      }
    }
  }
  
  // Extract social history
  let socialHistoryMatch = text.match(/(?:\*\*)?Social history(?:\*\*)?:?\s*([\s\S]*?)(?=\n\*\*|\n\n|$)/i);
  if (socialHistoryMatch) {
    const socialText = socialHistoryMatch[1].trim();
    if (socialText.includes('\n')) {
      const socialItems = socialText
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);
      
      // Try to identify specific social history elements
      for (const item of socialItems) {
        if (item.toLowerCase().includes('live') || item.toLowerCase().includes('home')) {
          patientInfo.livingSituation = item;
        } else if (item.toLowerCase().includes('smok')) {
          patientInfo.smokingHistory = item;
        } else if (item.toLowerCase().includes('alcohol')) {
          patientInfo.alcoholUse = item;
        } else if (item.toLowerCase().includes('drug')) {
          patientInfo.drugUse = item;
        } else {
          // Add to general social context if not specifically identified
          patientInfo.socialContext = patientInfo.socialContext 
            ? `${patientInfo.socialContext}; ${item}` 
            : item;
        }
      }
    } else {
      patientInfo.socialContext = socialText;
    }
  }
  
  // Extract family history
  let familyHistoryMatch = text.match(/(?:\*\*)?Family history(?:\*\*)?:?\s*([\s\S]*?)(?=\n\*\*|\n\n|$)/i);
  if (familyHistoryMatch) {
    const familyText = familyHistoryMatch[1].trim();
    if (familyText.includes('\n')) {
      patientInfo.familyHistory = familyText
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);
    } else {
      patientInfo.familyHistory = [familyText];
    }
  }
  
  return patientInfo;
}

/**
 * Function to parse unstructured content into dynamic sections
 */
export function parseContentToDynamicSections(content: string): DynamicSection[] {
  const sections: DynamicSection[] = [];
  
  // Split by double newlines which typically indicate paragraph/section breaks
  const contentParts = content.split(/\n\s*\n/);
  
  contentParts.forEach(part => {
    if (!part.trim()) return;
    
    // Try to find a title in the content (typically first line ending with colon or all caps)
    const lines = part.split('\n');
    let title = lines[0].trim();
    let sectionContent: string | string[] = lines.slice(1).join('\n').trim();
    let contentType: DynamicSection['contentType'] = 'text';
    
    // If first line doesn't look like a title, generate one
    if (!title.endsWith(':') && !title.match(/^[A-Z\s]+$/) && !title.match(/^\*\*.*\*\*$/)) {
      // Generate a title from first few words or use generic title
      title = title.split(' ').slice(0, 3).join(' ') + '...';
      sectionContent = part.trim();
    } else {
      // Remove colon from title if present
      title = title.replace(/:$/, '').replace(/^\*\*|\*\*$/g, '');
    }
    
    // Determine content type
    if (sectionContent.match(/^\s*[•\-*]\s+/m)) {
      // Content has bullet points - treat as list
      contentType = 'list';
      sectionContent = sectionContent
        .split(/\n/)
        .map(line => line.replace(/^\s*[•\-*]\s+/, '').trim())
        .filter(line => line.length > 0);
    } else if (sectionContent.match(/^(\d+\.|\(\d+\))\s+/m)) {
      // Content has numbered points - treat as steps
      contentType = 'steps';
      sectionContent = sectionContent
        .split(/\n/)
        .map(line => line.replace(/^(\d+\.|\(\d+\))\s+/, '').trim())
        .filter(line => line.length > 0);
    }
    
    sections.push({
      title,
      content: sectionContent,
      contentType
    });
  });
  
  return sections;
}

// Update the parse function in the parseGeneratedCaseText function to use the new patient info parser
export function enhancedParsePatientInfoSection(patientInfoText: string): Record<string, any> {
  // First try to parse with the more detailed parser
  const detailedInfo = parsePatientInfoText(patientInfoText);
  
  // If detailed parsing didn't get much, fall back to the simpler approach
  if (Object.keys(detailedInfo).length < 3) {
    const patientInfoSections = parseContentToDynamicSections(patientInfoText);
    const fallbackInfo: Record<string, any> = {};
    
    patientInfoSections.forEach(section => {
      const key = section.title.toLowerCase();
      if (key.includes('name')) fallbackInfo.name = Array.isArray(section.content) ? section.content[0] : section.content;
      else if (key.includes('age')) fallbackInfo.age = Array.isArray(section.content) ? section.content[0] : section.content;
      else if (key.includes('gender')) fallbackInfo.gender = Array.isArray(section.content) ? section.content[0] : section.content;
      else if (key.includes('occupation')) fallbackInfo.occupation = Array.isArray(section.content) ? section.content[0] : section.content;
      else if (key.includes('chief') || key.includes('complaint')) fallbackInfo.chiefComplaint = Array.isArray(section.content) ? section.content[0] : section.content;
      else if (key.includes('history') && key.includes('present')) fallbackInfo.briefHistory = Array.isArray(section.content) ? section.content.join('. ') : section.content;
    });
    
    // Merge the fallback info with any detailed info we did get
    return { ...fallbackInfo, ...detailedInfo };
  }
  
  return detailedInfo;
}

/**
 * Parse presentation section text into structured data
 */
export function parsePresentationData(text: string): Record<string, any> {
  console.log("--- Starting parsePresentationData ---"); // LOG START
  console.log("Input Text Snippet:", text.substring(0, 500)); // LOG INPUT
  
  const presentationData: Record<string, any> = {
    vitalSigns: [],
    physicalExam: [],
    diagnosticStudies: [],
    doctorNotes: [],
    initialAssessment: ''
  };
  
  // --- Vital Signs Parsing --- 
  let vitalSignsText = '';
  // Try to find a dedicated vital signs section (more flexible matching)
  const vitalSignsMatch = text.match(/(?:\*\*)?(?:Vital [Ss]igns?|Vitals)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n## |\n\s*-\s*[A-Z]|$)/i);
  if (vitalSignsMatch && vitalSignsMatch[1]) {
    vitalSignsText = vitalSignsMatch[1].trim();
  } else {
    // Look for list formats if no dedicated section found
    const bulletVitalSignsMatch = text.match(/-\s*\*\*(?:Vital [Ss]igns?|Vitals)\*\*\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n\s*-\s*[A-Z]|$)/i);
    if (bulletVitalSignsMatch) {
      const followingText = text.substring(text.indexOf(bulletVitalSignsMatch[0]) + bulletVitalSignsMatch[0].length);
      const bulletPoints = followingText.match(/(?:^|\n)\s*[•\-*]\s*([^\n]*)/g);
      if (bulletPoints) {
        vitalSignsText = bulletPoints.join('\n');
      }
    } else {
      const boldVitalSignsMatch = text.match(/\*\*(?:Vital [Ss]igns?|Vitals)\*\*\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n\s*-\s*[A-Z]|$)/i);
      if (boldVitalSignsMatch && boldVitalSignsMatch[1]) {
        vitalSignsText = boldVitalSignsMatch[1].trim();
      }
    }
  }

  if (vitalSignsText) {
    const vitalSignLines = vitalSignsText.split('\n')
      .filter(line => line.trim())
      .map(line => line.trim().replace(/^[•\-*]\s+/, '').replace(/\*\*/g, ''));
    
    vitalSignLines.forEach(line => {
      // Enhanced RegEx for vital signs (case-insensitive, flexible spacing/wording)
      const heartRateMatch = line.match(/(?:heart rate|hr|pulse)\s*:\s*(\d+)(?:\s*(bpm))?/i);
      const respRateMatch = line.match(/(?:respiratory rate|resp rate|resp|rr)\s*:\s*(\d+)(?:\s*(?:breaths?\/min|\/min))?/i);
      const bpMatch = line.match(/(?:blood pressure|bp)\s*:\s*(\d+)\/(\d+)(?:\s*(mmHg))?/i);
      const tempMatch = line.match(/(?:temperature|temp)\s*:\s*(\d+\.?\d*)\s*(?:[°˚]?([CF]))?/i);
      const o2SatMatch = line.match(/(?:oxygen saturation|o2 sat|o2|spo2|sat)\s*:\s*(\d+)\s*(%)?/i);
      const consciousnessMatch = line.match(/(?:consciousness|mental status|alertness)\s*:\s*(.+)/i);
      const newsMatch = line.match(/(?:news2 score|news)\s*:\s*(.+)/i);

      if (heartRateMatch) {
        const [_, value, unit] = heartRateMatch;
        presentationData.vitalSigns.push({ name: 'Heart Rate', value, unit: unit || 'bpm', isAbnormal: parseInt(value) > 100 || parseInt(value) < 60 });
      } else if (respRateMatch) {
        const [_, value, unit] = respRateMatch;
        presentationData.vitalSigns.push({ name: 'Respiratory Rate', value, unit: unit || 'breaths/min', isAbnormal: parseInt(value) > 20 || parseInt(value) < 12 });
      } else if (bpMatch) {
        const [_, systolic, diastolic, unit] = bpMatch;
        presentationData.vitalSigns.push({ name: 'Blood Pressure', value: `${systolic}/${diastolic}`, unit: unit || 'mmHg', isAbnormal: parseInt(systolic) > 140 || parseInt(systolic) < 90 || parseInt(diastolic) > 90 || parseInt(diastolic) < 60 });
      } else if (tempMatch) {
        let [_, value, unit] = tempMatch;
        let tempValue = parseFloat(value);
        let tempUnit = (unit && unit.toUpperCase() === 'F') ? '°F' : '°C';
        let isAbnormal = false;
        if (tempUnit === '°F') {
          isAbnormal = tempValue > 99.5 || tempValue < 96.8; // Approx F ranges
        } else {
          isAbnormal = tempValue > 37.5 || tempValue < 36.0;
        }
        presentationData.vitalSigns.push({ name: 'Temperature', value, unit: tempUnit, isAbnormal });
      } else if (o2SatMatch) {
        const [_, value, unit] = o2SatMatch;
        presentationData.vitalSigns.push({ name: 'Oxygen Saturation', value, unit: unit || '%', isAbnormal: parseInt(value) < 95 });
      } else if (consciousnessMatch) {
        const [_, value] = consciousnessMatch;
        presentationData.vitalSigns.push({ name: 'Consciousness', value: value.trim(), unit: '', isAbnormal: !value.toLowerCase().includes('alert') && !value.toLowerCase().includes('normal') });
      } else if (newsMatch) {
        const [_, value] = newsMatch;
        presentationData.vitalSigns.push({ name: 'NEWS2 Score', value: value.trim(), unit: '', isAbnormal: !value.includes('0') && !value.includes('1') });
      } else {
        // Fallback for generic "name: value" format
        const separatorMatch = line.match(/(.*?)\s*:\s*(.*)/);
        if (separatorMatch) {
          let [_, name, value] = separatorMatch;
          name = name.trim().replace(/\*\*/g, '');
          value = value.trim();
          let unit = '';
          const unitMatch = value.match(/(\d+\.?\d*)\s*([a-zA-Z%°\/]+)?/);
          if (unitMatch && unitMatch[2]) {
            unit = unitMatch[2].trim();
            value = unitMatch[1].trim();
          }
          if (name.length > 0 && value.length > 0) {
              presentationData.vitalSigns.push({ name, value, unit, isAbnormal: isLikelyAbnormal(value) });
          }
        } else if (line.length > 3) { // Avoid adding very short/irrelevant lines
          // If it doesn't match any known pattern but is substantial
          presentationData.vitalSigns.push({ name: 'Other', value: line, unit: '', isAbnormal: false });
        }
      }
    });
  }
  
  // --- Lab Results Parsing --- 
  // Enhanced parser for different lab line formats
  const parseLabLine = (line: string): DiagnosticStudy | null => {
    // Try Format: Test: Value [Units] [Reference Range] [(Flag)] or variations
    // Example: WBC: 18.5 x 10^9/L [Reference: 4.0-11.0] (High)
    // Example: Hemoglobin: 14.8 g/dL [Reference: 13.5-17.5]
    // Example: Neutrophils: 82% [40-75%] (High)
    const labPattern = /^(?:[•\-*]\s*)?([^:]+?)\s*:\s*(.+)/i;
    const match = line.match(labPattern);

    if (match) {
        let [_, name, remaining] = match;
        name = name.trim();
        remaining = remaining.trim();

        let valuePart = '';
        let normalRange = '';
        let abnormalFlag = '';
        let units = '';

        // Extract Flag (e.g., (High), (Low))
        const flagMatch = remaining.match(/\((High|Low|Abnormal|Elevated|Decreased)\)$/i);
        if (flagMatch) {
            abnormalFlag = flagMatch[1];
            remaining = remaining.replace(flagMatch[0], '').trim();
        }
        
        // Extract Reference Range (e.g., [Reference: 1.0-2.0], [1.0-11.0], 40-75%)
        // Try bracket format first
        let refMatch = remaining.match(/\[(?:Reference\s*:\s*)?([^\].]+)\]$/i);
        if (refMatch) {
            normalRange = refMatch[1].trim();
            remaining = remaining.replace(refMatch[0], '').trim();
        } else {
             // Try simple range format at the end (e.g., 4.5-5.9)
             refMatch = remaining.match(/((?:\d+\.?\d*\s*-\s*\d+\.?\d*\s*%?))$/i);
             if (refMatch) {
                normalRange = refMatch[1].trim();
                remaining = remaining.replace(refMatch[0], '').trim();
             }
        }

        // Whatever is left is likely the value + units
        valuePart = remaining.trim();
        
        let result = valuePart; // Use the full remaining part as the result initially
        let valueNumericStr = valuePart.match(/^(\d+\.?\d*)/)?.[1] || '';

        // Attempt to infer abnormality if flag is missing but range and value are present
        let isAbnormal = /high|low|abnormal|elevated|decreased/i.test(abnormalFlag);
        if (!isAbnormal && normalRange && valueNumericStr) {
            const valueNumeric = parseFloat(valueNumericStr);
            const rangeMatch = normalRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
            if (!isNaN(valueNumeric) && rangeMatch) {
                const lowerBound = parseFloat(rangeMatch[1]);
                const upperBound = parseFloat(rangeMatch[2]);
                if (!isNaN(lowerBound) && !isNaN(upperBound)) {
                    isAbnormal = valueNumeric < lowerBound || valueNumeric > upperBound;
                }
            }
        }

        return {
            name: name,
            result: result + (abnormalFlag ? ` (${abnormalFlag})` : ''), // Display flag with result
            normalRange: normalRange,
            isAbnormal: isAbnormal,
            date: new Date().toISOString().split('T')[0]
        };
    }

    return null; // Return null if no match at all
};

  // Look for a laboratory results section more broadly - ENHANCED Regex
  const labSectionHeaders = [
    'Laboratory Results?',
    'Lab Results?',
    'Labs',
    'Diagnostics',
    'Diagnostic Studies',
    'Studies',
    'Complete Blood Count',
    '(Comprehensive |Basic )?Metabolic Panel',
    'CMP',
    'BMP'
  ].join('|');
  
  const labResultsMatch = text.match(new RegExp(`(?:\\*\\*)?(?:${labSectionHeaders})(?:\\*\\*)?:?\\s*([\\s\\S]*?)(?=\n\n|\n\\s*\n|\n\\*\\*|\n## |$)`, 'i'));
  
  if (labResultsMatch && labResultsMatch[1]) {
    const labResultsText = labResultsMatch[1].trim().replace(/\*\*/g, '');
    console.log("--- Lab Section Found ---"); // LOG SECTION FOUND
    console.log("Lab Text:", labResultsText); // LOG LAB TEXT
    
    const labLines = labResultsText.split('\n')
      .filter(line => line.trim() && line.trim().length > 3) 
      .map(line => line.trim());
    
    console.log("Processing Lab Lines:", labLines.length); // LOG LINE COUNT
    let isParsingLabs = false; 
    labLines.forEach((line, index) => {
      console.log(`Line ${index}:`, line); // LOG EACH LINE
      
      // Skip common headers/metadata lines within the lab section
      if (line.match(/^(?:Results|Specimen|Collection|Date|Time|Panel)/i) || 
          line.match(/^\s*(?:${labSectionHeaders})/i) ||
          line.match(/^[-=]+$/) || 
          !line.includes(':')) { 
          console.log(`Skipping header/irrelevant line ${index}`); // LOG SKIP
          if (line.match(/^\s*(?:${labSectionHeaders})/i)) {
              isParsingLabs = true; // Start parsing after a known header
              console.log(`Detected Header - isParsingLabs set to true`); // LOG PARSING START
          }
          return;
      }
      
      if (isParsingLabs || line.match(/^\s*[A-Z]/i)) {
          const parsedLab = parseLabLine(line);
          console.log(`Parse Result ${index}:`, parsedLab); // LOG PARSE RESULT
          if (parsedLab) {
            if (!presentationData.diagnosticStudies.some((existing: DiagnosticStudy) => existing.name === parsedLab.name)) {
                presentationData.diagnosticStudies.push(parsedLab);
                console.log(`Added Lab: ${parsedLab.name}`); // LOG ADDED
            }
          } 
      }
    });
  } else {
      console.log("--- Lab Section NOT Found --- Using labSectionHeaders:", labSectionHeaders); // LOG SECTION NOT FOUND
  }
  
  // --- Physical Examination Parsing --- 
  // Ensure this block exists and section matching is robust
  const physicalExamMatch = text.match(/(?:\*\*)?(?:Physical [Ee]xamination|Physical [Ee]xam)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n## |$)/i);
  if (physicalExamMatch && physicalExamMatch[1]) {
    const physicalExamText = physicalExamMatch[1].trim().replace(/\*\*/g, '');
    presentationData.physicalExam = []; // Clear previous attempts if section is found

    // Check if there's a direct list of systems and findings
    if (physicalExamText.includes(':') && physicalExamText.includes('\n')) {
        const systemLines = physicalExamText.split('\n')
            .filter(line => line.trim() && line.includes(':')) // Ensure line has a colon
            .map(line => line.trim().replace(/^[•\-*]\s+/, ''));
        
        systemLines.forEach(line => {
            const systemMatch = line.match(/^([^:]+?)\s*:\s*(.*)/);
            if (systemMatch) {
                const [_, systemName, findings] = systemMatch;
                if (systemName.trim().length > 0 && findings.trim().length > 0) {
                    presentationData.physicalExam.push({
                        system: systemName.trim(),
                        findings: findings.trim(),
                        isAbnormal: isLikelyAbnormal(findings.trim())
                    });
                }
            }
        });
        // If parsing yielded results, assume this format is correct
        if (presentationData.physicalExam.length > 0) { 
             // Successfully parsed system: finding format
        } else {
             // Fallback if colon format failed despite colons being present
             parsePhysicalExamLineByLine(physicalExamText, presentationData.physicalExam);
        }
    } else {
        // Fallback: Parse line by line, inferring system
        parsePhysicalExamLineByLine(physicalExamText, presentationData.physicalExam);
    }
  }
  
  // --- Initial Assessment Parsing --- 
  // Ensure this block exists and is robust
  const initialAssessmentMatch = text.match(/(?:\*\*)?(?:Initial [Aa]ssessment|Assessment)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n## |$)/i);
  if (initialAssessmentMatch && initialAssessmentMatch[1]) {
    presentationData.initialAssessment = initialAssessmentMatch[1].trim().replace(/^[•\-*]\s+/, '');
  }
  
  // --- Fallback Diagnostic Studies Parsing --- 
  // (Keep existing fallback logic but ensure it logs if run)
  const diagnosticStudiesMatch = text.match(/(?:\*\*)?(?:Diagnostic [Ss]tudies|Imaging Results?)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n## |$)/i);
  if (diagnosticStudiesMatch && diagnosticStudiesMatch[1]) {
      console.log("--- Fallback Diagnostic Section Found ---"); // LOG FALLBACK RUN
      // ... existing fallback logic ...
  }
  
  console.log("--- Finished parsePresentationData ---"); // LOG END
  console.log("Final diagnosticStudies:", presentationData.diagnosticStudies); // LOG FINAL DATA
  return presentationData;
}

/**
 * Helper function to parse physical exam line by line, inferring system
 */
function parsePhysicalExamLineByLine(physicalExamText: string, physicalExamArray: any[]) {
    const examLines = physicalExamText.split('\n')
        .filter(line => line.trim() && line.trim().length > 3) // Ignore short/empty lines
        .map(line => line.trim().replace(/^[•\-*]\s+/, ''));
      
    examLines.forEach(line => {
        // Try to infer system from the line content
        let system = 'General'; // Default
        const lineLower = line.toLowerCase();

        // Filter out NEWS score lines explicitly
        if (lineLower.includes('news score') || lineLower.match(/(systolic bp|heart rate|respiratory rate|oxygen saturation|temperature)\s*\(\d+/i)) {
             console.log("Skipping NEWS score related line in PE:", line);
             return; // Skip this line
        }

        if (lineLower.includes('respiratory') || lineLower.includes('lung') || 
            lineLower.includes('breath') || lineLower.includes('chest') || lineLower.includes('auscultation')) {
          system = 'Respiratory';
        } else if (lineLower.includes('cardiovascular') || lineLower.includes('heart') || 
                  lineLower.includes('cardiac') || lineLower.includes('pulse') || lineLower.includes('murmur') || lineLower.includes('rhythm')) {
          system = 'Cardiovascular';
        } else if (lineLower.includes('neuro') || lineLower.includes('mental status') || 
                  lineLower.includes('gcs') || lineLower.includes('consciousness') || lineLower.includes('oriented') || lineLower.includes('reflex')) {
          system = 'Neurological';
        } else if (lineLower.includes('abdom') || lineLower.includes('bowel') || 
                  lineLower.includes('gi') || lineLower.includes('tender') || lineLower.includes('distended')) {
          system = 'Abdominal'; // Be careful with 'tender' - might need context
        } else if (lineLower.includes('skin') || lineLower.includes('integumentary') || lineLower.includes('mucous membrane')) {
          system = 'Skin/Mucous Membranes';
        } else if (lineLower.includes('extremit') || lineLower.includes('musculoskeletal') || 
                  lineLower.includes('msk') || lineLower.includes('edema') || lineLower.includes('pulses')) {
          system = 'Extremities/Musculoskeletal';
        } else if (lineLower.includes('heent') || lineLower.includes('head') || lineLower.includes('eye') || lineLower.includes('ear') || lineLower.includes('nose') || lineLower.includes('throat')) {
          system = 'HEENT';
        } else if (lineLower.includes('general appearance') || lineLower.includes('appears') || lineLower.includes('stated age')) {
             system = 'General Appearance';
        } else if (lineLower.includes('impression') || lineLower.includes('plan')) {
             console.log("Skipping Impression/Plan line in PE:", line);
             return; // Skip impression/plan lines often misplaced here
        }
        
        // Avoid adding duplicates
        if (!physicalExamArray.some(e => e.findings === line)) {
             physicalExamArray.push({
                 system,
                 findings: line,
                 isAbnormal: isLikelyAbnormal(line)
             });
        }
    });
}

/**
 * Helper function to determine if a finding is likely abnormal based on keywords
 */
function isLikelyAbnormal(text: string): boolean {
  const abnormalKeywords = [
    'abnormal', 'elevated', 'increased', 'decreased', 'reduced', 'impaired',
    'distress', 'pain', 'tender', 'swelling', 'edema', 'redness', 'pale',
    'cyanosis', 'jaundice', 'tachycardia', 'bradycardia', 'tachypnea',
    'hypotension', 'hypertension', 'fever', 'hypothermia', 'dyspnea',
    'irregular', 'murmur', 'rales', 'crackles', 'wheezing', 'rhonchi',
    'diminished', 'absent', 'delayed', 'positive', 'negative', 'deficit',
    'weakness', 'paralysis', 'altered', 'confusion', 'disorientation'
  ];
  
  return abnormalKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
} 
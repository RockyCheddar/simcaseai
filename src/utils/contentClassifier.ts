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
  if (lowerContent.match(/simulation|learning|education|competency|objective|skill|training|assessment|evaluation|scenario|debriefing|teaching|pitfall|decision point|key point|key decision|critical action/i)) {
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
  const presentationData: Record<string, any> = {
    vitalSigns: [],
    physicalExam: [],
    diagnosticStudies: [],
    doctorNotes: [],
    initialAssessment: ''
  };
  
  // Extract vital signs - check for multiple formats
  // Format 1: "Vital Signs:" followed by a list with "- name: value"
  // Format 2: "- **Vital signs**" followed by bullet points with values
  // Format 3: "**Vital signs**" followed by a list of values 
  
  // First, try to find a dedicated vital signs section
  let vitalSignsText = '';
  
  // Try format 1: Look for "Vital Signs:" header
  const vitalSignsMatch = text.match(/(?:\*\*)?(?:Vital [Ss]igns|Vitals)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n\s*-\s*[A-Z]|$)/i);
  if (vitalSignsMatch && vitalSignsMatch[1]) {
    vitalSignsText = vitalSignsMatch[1].trim();
  } else {
    // Try format 2: Look for "- **Vital signs**" bullet point
    const bulletVitalSignsMatch = text.match(/-\s*\*\*(?:Vital [Ss]igns|Vitals)\*\*\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n\s*-\s*[A-Z]|$)/i);
    if (bulletVitalSignsMatch) {
      // This could be the start of a list, but we need to look for the following bullet points
      const followingText = text.substring(text.indexOf(bulletVitalSignsMatch[0]) + bulletVitalSignsMatch[0].length);
      const bulletPoints = followingText.match(/(?:^|\n)\s*-\s*([^\n]*)/g);
      if (bulletPoints) {
        vitalSignsText = bulletPoints.join('\n');
      }
    } else {
      // Try format 3: Look for a bold "**Vital signs**" header
      const boldVitalSignsMatch = text.match(/\*\*(?:Vital [Ss]igns|Vitals)\*\*\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n\s*-\s*[A-Z]|$)/i);
      if (boldVitalSignsMatch && boldVitalSignsMatch[1]) {
        vitalSignsText = boldVitalSignsMatch[1].trim();
      }
    }
  }
  
  // If we found vital signs text, process it
  if (vitalSignsText) {
    // Split into lines and process each one
    const vitalSignLines = vitalSignsText.split('\n')
      .filter(line => line.trim())
      .map(line => line.trim().replace(/^[•\-*]\s+/, '').replace(/\*\*/g, ''));
    
    // Process each vital sign line
    vitalSignLines.forEach(line => {
      // Check for common vital sign patterns
      const heartRateMatch = line.match(/(?:heart rate|hr|pulse):\s*(\d+)(?:\s*(\w+))?/i);
      const respRateMatch = line.match(/(?:respiratory rate|resp rate|resp|rr):\s*(\d+)(?:\s*(\w+))?/i);
      const bpMatch = line.match(/(?:blood pressure|bp):\s*(\d+)\/(\d+)(?:\s*(\w+))?/i);
      const tempMatch = line.match(/(?:temperature|temp):\s*(\d+\.?\d*)(?:\s*(\w+|\°\w))?/i);
      const o2SatMatch = line.match(/(?:oxygen saturation|o2 sat|o2|spo2|sat):\s*(\d+)(?:\s*(\w+|\%))?/i);
      const consciousnessMatch = line.match(/(?:consciousness|mental status|alert):\s*(.+)/i);
      const newsMatch = line.match(/(?:news2 score|news):\s*(.+)/i);
      
      // Handle specific vital sign formats
      if (heartRateMatch) {
        const [_, value, unit] = heartRateMatch;
        presentationData.vitalSigns.push({
          name: 'Heart Rate',
          value,
          unit: unit || 'bpm',
          isAbnormal: parseInt(value) > 100 || parseInt(value) < 60
        });
      } else if (respRateMatch) {
        const [_, value, unit] = respRateMatch;
        presentationData.vitalSigns.push({
          name: 'Respiratory Rate',
          value,
          unit: unit || 'breaths/min',
          isAbnormal: parseInt(value) > 20 || parseInt(value) < 12
        });
      } else if (bpMatch) {
        const [_, systolic, diastolic, unit] = bpMatch;
        presentationData.vitalSigns.push({
          name: 'Blood Pressure',
          value: `${systolic}/${diastolic}`,
          unit: unit || 'mmHg',
          isAbnormal: parseInt(systolic) > 140 || parseInt(systolic) < 90 || parseInt(diastolic) > 90 || parseInt(diastolic) < 60
        });
      } else if (tempMatch) {
        const [_, value, unit] = tempMatch;
        presentationData.vitalSigns.push({
          name: 'Temperature',
          value,
          unit: unit || '°C',
          isAbnormal: parseFloat(value) > 37.5 || parseFloat(value) < 36
        });
      } else if (o2SatMatch) {
        const [_, value, unit] = o2SatMatch;
        presentationData.vitalSigns.push({
          name: 'Oxygen Saturation',
          value,
          unit: unit || '%',
          isAbnormal: parseInt(value) < 95
        });
      } else if (consciousnessMatch) {
        const [_, value] = consciousnessMatch;
        presentationData.vitalSigns.push({
          name: 'Consciousness',
          value,
          unit: '',
          isAbnormal: !value.toLowerCase().includes('alert') && !value.toLowerCase().includes('normal')
        });
      } else if (newsMatch) {
        const [_, value] = newsMatch;
        presentationData.vitalSigns.push({
          name: 'NEWS2 Score',
          value,
          unit: '',
          isAbnormal: !value.includes('0') && !value.includes('1')
        });
      } else {
        // Check for "name: value" format
        const separatorMatch = line.match(/(.*?):\s*(.*)/);
        if (separatorMatch) {
          let [_, name, value] = separatorMatch;
          name = name.trim().replace(/\*\*/g, '');
          value = value.trim();
          
          // Try to extract unit from the value
          let unit = '';
          
          // Use regex to extract potential units
          const unitMatch = value.match(/(\d+\.?\d*)\s*([a-zA-Z%°\/]+)?/);
          if (unitMatch && unitMatch[2]) {
            unit = unitMatch[2].trim();
            value = unitMatch[1].trim();
          }
          
          // Determine if abnormal based on name
          let isAbnormal = false;
          
          // Determine if this is a well-known vital sign and set appropriate units and abnormal flags
          if (name.toLowerCase().includes('heart') || name.toLowerCase().includes('pulse')) {
            unit = unit || 'bpm';
            isAbnormal = parseInt(value) > 100 || parseInt(value) < 60;
          } else if (name.toLowerCase().includes('resp')) {
            unit = unit || 'breaths/min';
            isAbnormal = parseInt(value) > 20 || parseInt(value) < 12;
          } else if (name.toLowerCase().includes('pressure') || name.toLowerCase().includes('bp')) {
            unit = unit || 'mmHg';
            // Check if it's a systolic/diastolic format
            const bpValues = value.match(/(\d+)\/(\d+)/);
            if (bpValues) {
              isAbnormal = parseInt(bpValues[1]) > 140 || parseInt(bpValues[1]) < 90 || 
                           parseInt(bpValues[2]) > 90 || parseInt(bpValues[2]) < 60;
            }
          } else if (name.toLowerCase().includes('temp')) {
            unit = unit || '°C';
            isAbnormal = parseFloat(value) > 37.5 || parseFloat(value) < 36;
          } else if (name.toLowerCase().includes('oxygen') || name.toLowerCase().includes('o2') || name.toLowerCase().includes('sat')) {
            unit = unit || '%';
            isAbnormal = parseInt(value) < 95;
          }
          
          presentationData.vitalSigns.push({
            name,
            value,
            unit,
            isAbnormal
          });
        } else if (line.length > 0) {
          // If it doesn't match any pattern but has content, add as an "Other" vital sign
          presentationData.vitalSigns.push({
            name: 'Other',
            value: line,
            unit: '',
            isAbnormal: false
          });
        }
      }
    });
  }
  
  // Additional function to parse lab results with reference ranges
  const parseLabLine = (line: string): DiagnosticStudy | null => {
    // Format: - [Test]: [Value] [(High/Low)] [Reference: Range]
    const labPattern = /^(?:-\s*)?([^:]+):\s*([^[\(]+)(?:\s*\(([^)]+)\))?(?:\s*\[Reference:?\s*([^\]]+)\])?/i;
    const match = line.match(labPattern);
    
    if (match) {
      const [_, name, value, abnormalFlag, referenceRange] = match;
      const isAbnormal = abnormalFlag ? 
                        /high|elevated|low|decreased|abnormal/i.test(abnormalFlag) : 
                        false;
      
      return {
        name: name.trim().replace(/^-\s*/, ''),
        result: value.trim() + (abnormalFlag ? ` (${abnormalFlag})` : ''),
        normalRange: referenceRange ? referenceRange.trim() : '',
        isAbnormal,
        date: new Date().toISOString().split('T')[0]
      };
    }
    
    // Alternative format: Test: Value (Reference: Range)
    const altPattern = /^(?:-\s*)?([^:]+):\s*([^(]+)(?:\s*\((?:Reference:?\s*([^)]+)|([^)]+))\))?/i;
    const altMatch = line.match(altPattern);
    
    if (altMatch) {
      const [_, name, value, referenceRange, abnormalFlag] = altMatch;
      const isAbnormal = abnormalFlag ? 
                        /high|elevated|low|decreased|abnormal/i.test(abnormalFlag) : 
                        false;
      
      return {
        name: name.trim().replace(/^-\s*/, ''),
        result: value.trim(),
        normalRange: referenceRange ? referenceRange.trim() : '',
        isAbnormal: isAbnormal || isLikelyAbnormal(value),
        date: new Date().toISOString().split('T')[0]
      };
    }
    
    return null;
  };
  
  // Look for a laboratory results section
  const labResultsMatch = text.match(/(?:\*\*)?(?:Laboratory Results|Lab Results|Labs|Comprehensive Metabolic Panel|Complete Blood Count)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n## |$)/i);
  
  if (labResultsMatch && labResultsMatch[1]) {
    const labResultsText = labResultsMatch[1].trim().replace(/\*\*/g, '');
    
    // Check for structured lab results
    const labLines = labResultsText.split('\n')
      .filter(line => line.trim())
      .map(line => line.trim().replace(/^[•\-*]\s+/, ''));
    
    // Process each lab line
    labLines.forEach(line => {
      // Special handling for dates and headers
      if (line.match(/^(?:Results|Specimen|Collection) (?:Date|Time):/i) || 
          line.match(/^Complete Blood Count:?$/i) || 
          line.match(/^Metabolic Panel:?$/i) ||
          line.match(/^Comprehensive Metabolic Panel:?$/i) ||
          line.match(/^Chemistry Panel:?$/i) ||
          line.match(/^\.\.\.$/) ||
          line.length < 3) {
        // Skip headers and decorative lines
        return;
      }
      
      const parsedLab = parseLabLine(line);
      if (parsedLab) {
        presentationData.diagnosticStudies.push(parsedLab);
      }
      // If not a standard lab format, still try to extract info
      else if (line.includes(':')) {
        const [name, result] = line.split(':').map(part => part.trim());
        if (name && result) {
          presentationData.diagnosticStudies.push({
            name,
            result,
            normalRange: '',
            isAbnormal: isLikelyAbnormal(result),
            date: new Date().toISOString().split('T')[0]
          });
        }
      }
    });
  }
  
  // Extract physical examination findings
  const physicalExamMatch = text.match(/(?:\*\*)?(?:Physical [Ee]xamination|Physical [Ee]xam)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n## |$)/i);
  if (physicalExamMatch && physicalExamMatch[1]) {
    const physicalExamText = physicalExamMatch[1].trim().replace(/\*\*/g, '');
    
    // Check if there's a direct list of systems and findings
    if (physicalExamText.includes(':') && physicalExamText.includes('\n')) {
      // Try to identify systems and findings
      const systemLines = physicalExamText.split('\n')
        .filter(line => line.trim())
        .map(line => line.trim().replace(/^[•\-*]\s+/, ''));
      
      let currentSystem = 'General';
      
      systemLines.forEach(line => {
        // Check if this line defines a new system
        const systemMatch = line.match(/^(.*?):\s*(.*)/);
        if (systemMatch) {
          const [_, systemName, findings] = systemMatch;
          
          // Update current system
          currentSystem = systemName.trim();
          
          // If there are findings on this line, add them
          if (findings && findings.trim()) {
            presentationData.physicalExam.push({
              system: currentSystem,
              findings: findings.trim(),
              isAbnormal: isLikelyAbnormal(findings.trim())
            });
          }
        } else {
          // This is a continuation of findings for the current system
          presentationData.physicalExam.push({
            system: currentSystem,
            findings: line,
            isAbnormal: isLikelyAbnormal(line)
          });
        }
      });
    } else {
      // Alternative format: Look for a list of physical exam findings without explicit system headers
      const examLines = physicalExamText.split('\n')
        .filter(line => line.trim())
        .map(line => line.trim().replace(/^[•\-*]\s+/, ''));
      
      examLines.forEach(line => {
        // Try to infer system from the line content
        let system = 'General';
        
        if (line.toLowerCase().includes('respiratory') || 
            line.toLowerCase().includes('lung') || 
            line.toLowerCase().includes('breath') ||
            line.toLowerCase().includes('chest')) {
          system = 'Respiratory';
        } else if (line.toLowerCase().includes('cardiovascular') || 
                  line.toLowerCase().includes('heart') || 
                  line.toLowerCase().includes('cardiac') ||
                  line.toLowerCase().includes('pulse')) {
          system = 'Cardiovascular';
        } else if (line.toLowerCase().includes('neuro') || 
                  line.toLowerCase().includes('mental status') ||
                  line.toLowerCase().includes('gcs') ||
                  line.toLowerCase().includes('consciousness')) {
          system = 'Neurological';
        } else if (line.toLowerCase().includes('abdom') || 
                  line.toLowerCase().includes('bowel') || 
                  line.toLowerCase().includes('gi')) {
          system = 'Abdominal';
        } else if (line.toLowerCase().includes('skin') || 
                  line.toLowerCase().includes('integumentary')) {
          system = 'Skin';
        } else if (line.toLowerCase().includes('extremity') || 
                  line.toLowerCase().includes('musculoskeletal') || 
                  line.toLowerCase().includes('msk')) {
          system = 'Musculoskeletal';
        }
        
        presentationData.physicalExam.push({
          system,
          findings: line,
          isAbnormal: isLikelyAbnormal(line)
        });
      });
    }
  } else {
    // Try to find physical exam findings in bullet points without a formal section
    const examBulletPoints = text.match(/(?:^|\n)\s*-\s*(?:General|Respiratory|Cardiovascular|Abdominal|Neurological|Skin|HEENT):[^\n]+/g);
    if (examBulletPoints) {
      examBulletPoints.forEach(line => {
        const systemMatch = line.match(/-\s*(.*?):\s*(.*)/);
        if (systemMatch) {
          const [_, system, findings] = systemMatch;
          presentationData.physicalExam.push({
            system: system.trim(),
            findings: findings.trim(),
            isAbnormal: isLikelyAbnormal(findings.trim())
          });
        }
      });
    }
  }
  
  // Extract initial assessment
  const initialAssessmentMatch = text.match(/(?:\*\*)?(?:Initial [Aa]ssessment|Assessment)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n## |$)/i);
  if (initialAssessmentMatch && initialAssessmentMatch[1]) {
    presentationData.initialAssessment = initialAssessmentMatch[1].trim();
  }
  
  // Extract diagnostic studies (labs, imaging, etc.)
  const diagnosticStudiesMatch = text.match(/(?:\*\*)?(?:Diagnostic [Ss]tudies|Laboratory|Labs|Imaging)(?:\*\*)?:?\s*([\s\S]*?)(?=\n\n|\n\s*\n|\n\*\*|\n## |$)/i);
  if (diagnosticStudiesMatch && diagnosticStudiesMatch[1]) {
    const diagnosticText = diagnosticStudiesMatch[1].trim().replace(/\*\*/g, '');
    
    // Check if it's in a list format
    if (diagnosticText.includes('\n')) {
      const diagnosticLines = diagnosticText.split('\n')
        .filter(line => line.trim())
        .map(line => line.trim().replace(/^[•\-*]\s+/, ''));
      
      diagnosticLines.forEach(line => {
        const resultMatch = line.match(/(.*?):\s*(.*)/);
        if (resultMatch) {
          const [_, testName, result] = resultMatch;
          
          // Try to determine normal range and if abnormal
          let normalRange = '';
          let isAbnormal = false;
          
          // Look for patterns like "Result (Normal: X-Y)" or "Result (elevated)"
          const normalRangeMatch = result.match(/(.*?)\s*\((?:normal(?:ly)?:?\s*(.*?)|(?:elevated|abnormal|high|low))\)/i);
          if (normalRangeMatch) {
            // Has explicit normal range or abnormality indicator
            if (normalRangeMatch[2]) {
              normalRange = normalRangeMatch[2].trim();
            }
            
            // If it says elevated/abnormal/high/low, mark as abnormal
            if (result.match(/\b(?:elevated|abnormal|high|low)\b/i)) {
              isAbnormal = true;
            }
          } else {
            // Check for common lab tests and set abnormal based on values
            const testNameLower = testName.toLowerCase();
            
            if (testNameLower.includes('wbc') || testNameLower.includes('white blood cell')) {
              const numValue = parseFloat(result.replace(/[^\d.]/g, ''));
              normalRange = '4.5-11.0 × 10^9/L';
              isAbnormal = numValue < 4.5 || numValue > 11.0;
            } else if (testNameLower.includes('hgb') || testNameLower.includes('hemoglobin')) {
              const numValue = parseFloat(result.replace(/[^\d.]/g, ''));
              normalRange = '13.5-17.5 g/dL (male), 12.0-15.5 g/dL (female)';
              isAbnormal = numValue < 12.0 || numValue > 17.5;
            } else if (testNameLower.includes('oxygen') || testNameLower.includes('o2')) {
              const numValue = parseFloat(result.replace(/[^\d.]/g, ''));
              normalRange = '95-100%';
              isAbnormal = numValue < 95;
            } else if (testNameLower.includes('glucose')) {
              const numValue = parseFloat(result.replace(/[^\d.]/g, ''));
              normalRange = '70-100 mg/dL (fasting)';
              isAbnormal = numValue < 70 || numValue > 140;
            } else if (testNameLower.includes('potassium') || testNameLower.includes('k+')) {
              const numValue = parseFloat(result.replace(/[^\d.]/g, ''));
              normalRange = '3.5-5.0 mEq/L';
              isAbnormal = numValue < 3.5 || numValue > 5.0;
            }
            
            // For all other tests, check if result contains abnormal keywords
            if (!isAbnormal) {
              isAbnormal = isLikelyAbnormal(result);
            }
          }
          
          presentationData.diagnosticStudies.push({
            name: testName.trim(),
            result: result.trim(),
            normalRange,
            isAbnormal,
            date: new Date().toISOString().split('T')[0] // Use current date
          });
        } else {
          // Handle lines without the test: result format
          const testParts = line.split(' - ');
          if (testParts.length > 1) {
            // Format: "Test Name - Result"
            presentationData.diagnosticStudies.push({
              name: testParts[0].trim(),
              result: testParts.slice(1).join(' - ').trim(),
              normalRange: '',
              isAbnormal: isLikelyAbnormal(testParts.slice(1).join(' - ')),
              date: new Date().toISOString().split('T')[0]
            });
          } else {
            // Generic finding
            presentationData.diagnosticStudies.push({
              name: 'Finding',
              result: line,
              normalRange: '',
              isAbnormal: isLikelyAbnormal(line),
              date: new Date().toISOString().split('T')[0]
            });
          }
        }
      });
    } else if (diagnosticText.length > 0) {
      // Just one line, treat as general finding
      presentationData.diagnosticStudies.push({
        name: 'Finding',
        result: diagnosticText,
        normalRange: '',
        isAbnormal: isLikelyAbnormal(diagnosticText),
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
  
  return presentationData;
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
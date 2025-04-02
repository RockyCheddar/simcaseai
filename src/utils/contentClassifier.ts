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
 * Content classifier - determines which tab is most appropriate for given content
 */
export function classifyContent(content: string): TabCategory {
  // Convert to lowercase for case-insensitive matching
  const lowerContent = content.toLowerCase();
  
  // Treatment related keywords
  if (lowerContent.match(/treatment|medication|therapy|prescri|dosage|intervention|management|care plan|drug|administer|dose|regimen/i)) {
    return 'treatment';
  }
  
  // Simulation learning related keywords
  if (lowerContent.match(/simulation|learning|education|competency|objective|skill|training|assessment|evaluation|scenario|debriefing|teaching/i)) {
    return 'simulation';
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
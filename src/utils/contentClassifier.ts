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
    if (!title.endsWith(':') && !title.match(/^[A-Z\s]+$/)) {
      // Generate a title from first few words or use generic title
      title = title.split(' ').slice(0, 3).join(' ') + '...';
      sectionContent = part.trim();
    } else {
      // Remove colon from title if present
      title = title.replace(/:$/, '');
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
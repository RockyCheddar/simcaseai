import React from 'react';
import { DynamicSection } from '@/utils/contentClassifier';

interface DynamicContentSectionProps {
  sections: DynamicSection[];
}

const DynamicContentSection: React.FC<DynamicContentSectionProps> = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return null;
  }
  
  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Generated content from case analysis</p>
      </div>
      <div className="border-t border-gray-200">
        <div className="divide-y divide-gray-200">
          {sections.map((section, index) => (
            <div key={index} className="px-4 py-5 sm:px-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">{section.title}</h4>
              
              {/* Render based on content type */}
              {renderSectionContent(section)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function renderSectionContent(section: DynamicSection) {
  // If content is a string (text type)
  if (typeof section.content === 'string') {
    return (
      <p className="text-sm text-gray-700 whitespace-pre-line">{section.content}</p>
    );
  }
  
  // If content is an array (list or steps type)
  if (Array.isArray(section.content)) {
    // If it's a step-by-step list
    if (section.contentType === 'steps') {
      return (
        <ol className="list-decimal pl-5 space-y-2">
          {section.content.map((item, itemIndex) => (
            <li key={itemIndex} className="text-sm text-gray-700">{item}</li>
          ))}
        </ol>
      );
    }
    
    // If it's a regular bullet list
    return (
      <ul className="list-disc pl-5 space-y-1">
        {section.content.map((item, itemIndex) => (
          <li key={itemIndex} className="text-sm text-gray-700">{item}</li>
        ))}
      </ul>
    );
  }
  
  // Fallback for any other content type
  return null;
}

export default DynamicContentSection; 
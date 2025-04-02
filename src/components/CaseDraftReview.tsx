import React from 'react';
import { DynamicSection, parseContentToDynamicSections, classifyContent } from '@/utils/contentClassifier';

interface CaseDraftReviewProps {
  draftContent: string;
  onConfirm: () => void;
  onEdit: (editedContent: string) => void;
  isLoading?: boolean;
}

const CaseDraftReview: React.FC<CaseDraftReviewProps> = ({
  draftContent,
  onConfirm,
  onEdit,
  isLoading = false
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(draftContent);
  
  // Parse the draft content into sections for display
  const sections = React.useMemo(() => {
    return parseContentToDynamicSections(draftContent);
  }, [draftContent]);
  
  // When user wants to edit the content
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  // When user saves their edits
  const handleSaveEdits = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };
  
  // When user cancels editing
  const handleCancelEdit = () => {
    setEditedContent(draftContent);
    setIsEditing(false);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Case Draft Review</h1>
          <div className="flex space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Draft
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Confirm & Create Case'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdits}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Information alert about the draft */}
        <div className="rounded-md bg-blue-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Review the draft case</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Please review this initial draft of the case. You can edit it if needed before confirming to generate the complete case with all tabs.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {isEditing ? (
          <div className="mb-6">
            <label htmlFor="caseContent" className="block text-sm font-medium text-gray-700 mb-2">
              Edit Case Content
            </label>
            <textarea
              id="caseContent"
              rows={20}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  {typeof section.content === 'string' ? (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{section.content}</p>
                  ) : section.contentType === 'steps' ? (
                    <ol className="list-decimal pl-5 space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-700">{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-700">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDraftReview; 
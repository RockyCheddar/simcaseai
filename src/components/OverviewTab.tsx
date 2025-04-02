import React from 'react';
import { DynamicSection } from '@/utils/contentClassifier';
import DynamicContentSection from './DynamicContentSection';

interface CaseData {
  status: string;
  createdDate: string;
  updatedDate: string;
  clinicalSetting: string;
  learningObjectives: string[];
  patientName: string;
  patientAge: string;
  patientGender: string;
  ageRange: string;
  occupation: string;
  socialContext: string;
  caseSummary: string;
}

interface OverviewTabProps {
  caseData: Partial<CaseData>;
  dynamicSections?: DynamicSection[];
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function OverviewTab({ caseData, dynamicSections = [] }: OverviewTabProps) {
  // Destructure the necessary data with defaults
  const { 
    status = 'Unknown',
    createdDate,
    updatedDate,
    clinicalSetting = 'Not specified',
    learningObjectives = [],
    patientName = 'Unknown',
    patientAge = 'Unknown',
    patientGender = 'Unknown',
    ageRange = 'Not specified',
    occupation = 'Not specified',
    socialContext = 'Not specified',
    caseSummary = 'No summary available'
  } = caseData;
  
  return (
    <div className="space-y-6">
      {/* Case Summary */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Case Summary</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Brief overview of the clinical case</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <p className="text-sm text-gray-700">{caseSummary}</p>
        </div>
      </div>
      
      {/* Case Metadata */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Case Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Administrative information</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900">{status}</dd>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="text-sm text-gray-900">{formatDate(createdDate)}</dd>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="text-sm text-gray-900">{formatDate(updatedDate)}</dd>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Clinical Setting</dt>
              <dd className="text-sm text-gray-900">{clinicalSetting}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Learning Objectives */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Learning Objectives</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Key educational goals for this case</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <ul className="list-disc pl-5 space-y-2">
            {learningObjectives.map((objective, index) => (
              <li key={index} className="text-sm text-gray-700">{objective}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Patient Brief */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Patient Brief</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Brief patient demographic information</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{patientName}</dd>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="text-sm text-gray-900">{patientAge}</dd>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="text-sm text-gray-900">{patientGender}</dd>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Age Range</dt>
              <dd className="text-sm text-gray-900">{ageRange}</dd>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Occupation</dt>
              <dd className="text-sm text-gray-900">{occupation}</dd>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Social Context</dt>
              <dd className="text-sm text-gray-900">{socialContext}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Dynamic Sections */}
      {dynamicSections.length > 0 && (
        <DynamicContentSection sections={dynamicSections} />
      )}
    </div>
  );
}

export default OverviewTab; 
import React from 'react';
import { DynamicSection } from '@/utils/contentClassifier';
import DynamicContentSection from './DynamicContentSection';

// Interface for vital signs
interface VitalSign {
  name: string;
  value: string;
  unit: string;
  normalRange?: string;
  isAbnormal?: boolean;
}

// Interface for physical exam findings
interface PhysicalExamFinding {
  system: string;
  findings: string;
  isAbnormal?: boolean;
}

// Interface for diagnostic studies
interface DiagnosticStudy {
  name: string;
  result: string;
  normalRange?: string;
  date: string;
  isAbnormal?: boolean;
}

// Interface for doctor's notes
interface DoctorNote {
  provider: string;
  date: string;
  content: string;
}

// Main interface for presentation data
interface PresentationData {
  vitalSigns: VitalSign[];
  physicalExam: PhysicalExamFinding[];
  diagnosticStudies: DiagnosticStudy[];
  doctorNotes?: DoctorNote[];
  initialAssessment?: string;
}

interface PresentationTabProps {
  presentationData: PresentationData;
  dynamicSections?: DynamicSection[];
}

function PresentationTab({ presentationData, dynamicSections = [] }: PresentationTabProps) {
  const { vitalSigns, physicalExam, diagnosticStudies, doctorNotes, initialAssessment } = presentationData;
  
  return (
    <div className="space-y-6">
      {/* Vital Signs Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Initial Vital Signs</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Patient vital signs at presentation</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vitalSigns.map((vital, index) => (
              <div 
                key={`${vital.name}-${index}`} 
                className={`overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 ${
                  vital.isAbnormal ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <dt className="truncate text-sm font-medium text-gray-500">{vital.name}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {vital.value}
                  {vital.unit && <span className="ml-1 text-sm font-normal text-gray-500">{vital.unit}</span>}
                </dd>
                {vital.normalRange && (
                  <p className="mt-1 text-xs text-gray-500">Normal: {vital.normalRange}</p>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Physical Examination Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Physical Examination</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed findings from physical assessment</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            {physicalExam.map((finding, index) => (
              <div key={index} className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">{finding.system}</dt>
                <dd className={`mt-1 text-sm sm:col-span-2 sm:mt-0 ${
                  finding.isAbnormal ? 'text-red-700 font-medium' : 'text-gray-900'
                }`}>
                  {finding.findings}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Initial Assessment Section (if available) */}
      {initialAssessment && (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">Initial Assessment</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Clinician's initial impression</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-900 whitespace-pre-line">{initialAssessment}</p>
          </div>
        </div>
      )}

      {/* Diagnostic Studies Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Diagnostic Studies</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Laboratory and imaging results</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="mt-2 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                          Test
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Result
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Normal Range
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {diagnosticStudies.map((study, index) => (
                        <tr key={index} className={study.isAbnormal ? 'bg-red-50' : 'even:bg-gray-50'}>
                          <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-3">
                            {study.name}
                          </td>
                          <td className={`px-3 py-4 text-sm ${
                            study.isAbnormal ? 'text-red-700 font-medium' : 'text-gray-500'
                          }`}>
                            {study.result}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {study.normalRange || 'N/A'}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {study.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor's Notes Section (if available) */}
      {doctorNotes && doctorNotes.length > 0 && (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">Doctor's Notes</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Clinical observations and assessments</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6 space-y-6">
              {doctorNotes.map((note, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{note.provider}</h4>
                    <span className="text-xs text-gray-500">{note.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Generated content from case analysis</p>
        </div>
        <div className="border-t border-gray-200">
          {/* Dynamic Sections */}
          {dynamicSections.length > 0 && (
            <DynamicContentSection sections={dynamicSections} />
          )}
        </div>
      </div>
    </div>
  );
}

export default PresentationTab; 
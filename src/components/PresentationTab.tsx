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
  
  // Function to find a specific vital sign by name (case insensitive)
  const findVitalSign = (name: string): VitalSign | undefined => {
    const searchTerms = name.toLowerCase().split('|');
    return vitalSigns.find(vs => 
      searchTerms.some(term => vs.name.toLowerCase().includes(term))
    );
  };
  
  // Standard vital signs to display in a fixed order
  const standardVitalSigns = [
    { 
      id: 'heart-rate', 
      name: 'Heart Rate',
      searchTerms: 'heart|pulse|hr',
      defaultValue: { name: 'Heart Rate', value: '', unit: 'bpm', isAbnormal: false, normalRange: '' }
    },
    { 
      id: 'respiratory-rate', 
      name: 'Respiratory Rate',
      searchTerms: 'respiratory|resp|rr', 
      defaultValue: { name: 'Respiratory Rate', value: '', unit: 'breaths/min', isAbnormal: false, normalRange: '' }
    },
    { 
      id: 'blood-pressure', 
      name: 'Blood Pressure',
      searchTerms: 'blood pressure|bp', 
      defaultValue: { name: 'Blood Pressure', value: '', unit: 'mmHg', isAbnormal: false, normalRange: '' }
    },
    { 
      id: 'temperature', 
      name: 'Temperature',
      searchTerms: 'temp|temperature', 
      defaultValue: { name: 'Temperature', value: '', unit: '°C', isAbnormal: false, normalRange: '' }
    },
    { 
      id: 'oxygen-saturation', 
      name: 'Oxygen Saturation',
      searchTerms: 'oxygen|o2|sat|saturation|spo2', 
      defaultValue: { name: 'Oxygen Saturation', value: '', unit: '%', isAbnormal: false, normalRange: '' }
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Vital Signs Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Initial Vital Signs</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Patient vital signs at presentation</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {standardVitalSigns.map((standardVS) => {
              // Find the matching vital sign in the data
              const matchedVS = findVitalSign(standardVS.searchTerms) || standardVS.defaultValue;
              
              return (
                <div 
                  key={standardVS.id}
                  className={`overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 ${
                    matchedVS.isAbnormal ? 'ring-2 ring-red-500' : ''
                  }`}
                >
                  <dt className="truncate text-sm font-medium text-gray-500">{standardVS.name}</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                    {matchedVS.value || '—'}
                    {matchedVS.value && matchedVS.unit && 
                      <span className="ml-1 text-sm font-normal text-gray-500">{matchedVS.unit}</span>
                    }
                  </dd>
                  {matchedVS.normalRange && (
                    <p className="mt-1 text-xs text-gray-500">Normal: {matchedVS.normalRange}</p>
                  )}
                </div>
              );
            })}
          </dl>
          
          {/* Additional vital signs beyond the standard 5 */}
          {vitalSigns.length > 5 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-500">Additional Vital Signs</h4>
              <dl className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {vitalSigns.filter(vs => 
                  !standardVitalSigns.some(std => 
                    vs.name.toLowerCase().includes(std.searchTerms.split('|')[0])
                  )
                ).map((vital, index) => (
                  <div 
                    key={`additional-vs-${index}`}
                    className={`overflow-hidden rounded-lg bg-white px-4 py-3 shadow-sm ${
                      vital.isAbnormal ? 'ring-1 ring-red-500' : ''
                    }`}
                  >
                    <dt className="truncate text-sm font-medium text-gray-500">{vital.name}</dt>
                    <dd className="mt-1 text-xl font-medium tracking-tight text-gray-900">
                      {vital.value}
                      {vital.unit && <span className="ml-1 text-sm font-normal text-gray-500">{vital.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
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
            {/* Group lab results by panels if possible */}
            {(() => {
              // Attempt to group labs by type
              const panels: Record<string, DiagnosticStudy[]> = {
                'Complete Blood Count': [],
                'Metabolic Panel': [],
                'Liver Function': [],
                'Coagulation': [],
                'Cardiac': [],
                'Imaging': [],
                'Other': []
              };
              
              // Categorize studies into panels
              diagnosticStudies.forEach(study => {
                const name = study.name.toLowerCase();
                if (name.includes('wbc') || name.includes('rbc') || name.includes('hemoglobin') || 
                    name.includes('hematocrit') || name.includes('platelet') || name.includes('blood count')) {
                  panels['Complete Blood Count'].push(study);
                } else if (name.includes('sodium') || name.includes('potassium') || name.includes('chloride') || 
                          name.includes('co2') || name.includes('bun') || name.includes('creatinine') || 
                          name.includes('glucose')) {
                  panels['Metabolic Panel'].push(study);
                } else if (name.includes('ast') || name.includes('alt') || name.includes('bilirubin') || 
                          name.includes('albumin') || name.includes('phosphatase') || name.includes('liver')) {
                  panels['Liver Function'].push(study);
                } else if (name.includes('pt') || name.includes('inr') || name.includes('ptt') || 
                          name.includes('fibrinogen')) {
                  panels['Coagulation'].push(study);
                } else if (name.includes('troponin') || name.includes('ck') || name.includes('bnp') || 
                          name.includes('cardiac')) {
                  panels['Cardiac'].push(study);
                } else if (name.includes('x-ray') || name.includes('ct') || name.includes('mri') || 
                          name.includes('ultrasound') || name.includes('imaging')) {
                  panels['Imaging'].push(study);
                } else {
                  panels['Other'].push(study);
                }
              });
              
              // Only render panels that have studies
              return (
                <div className="space-y-8">
                  {Object.entries(panels).map(([panelName, studies]) => 
                    studies.length > 0 ? (
                      <div key={panelName} className="space-y-3">
                        <h4 className="text-base font-medium text-gray-700">{panelName}</h4>
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
                                  {studies.map((study, index) => (
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
                    ) : null
                  )}
                </div>
              );
            })()}
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

      {/* Dynamic Content Section - Filter out content that should be in other tabs */}
      {dynamicSections.filter(section => 
        !section.title.toLowerCase().includes('pitfall') && 
        !section.title.toLowerCase().includes('decision point') &&
        !section.title.toLowerCase().includes('key decision')
      ).length > 0 && (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Generated content from case analysis</p>
          </div>
          <div className="border-t border-gray-200">
            <DynamicContentSection 
              sections={dynamicSections.filter(section => 
                !section.title.toLowerCase().includes('pitfall') && 
                !section.title.toLowerCase().includes('decision point') &&
                !section.title.toLowerCase().includes('key decision')
              )} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PresentationTab; 
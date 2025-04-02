import React from 'react';
import { DynamicSection } from '@/utils/contentClassifier';
import DynamicContentSection from './DynamicContentSection';

// Interface for treatment steps
interface TreatmentStep {
  action: string;
  rationale?: string;
  timing?: string;
}

// Interface for progression scenarios
interface ProgressionScenario {
  title: string;
  intervention: string;
  response: string;
  vitalSignChanges?: string;
  additionalNotes?: string;
}

// Interface for outcomes
interface Outcome {
  category: string;
  description: string;
}

// Main interface for treatment data
interface TreatmentData {
  initialManagement: TreatmentStep[];
  treatmentPlan: {
    medications?: TreatmentStep[];
    procedures?: TreatmentStep[];
    monitoring?: TreatmentStep[];
    consults?: TreatmentStep[];
    patientEducation?: TreatmentStep[];
  };
  progressionScenarios: ProgressionScenario[];
  clinicalCourse: {
    timeline?: string;
    complications?: string[];
    outcomes: Outcome[];
    disposition?: string;
    followUp?: string;
  };
}

interface TreatmentTabProps {
  treatmentData: TreatmentData;
  dynamicSections?: DynamicSection[];
}

function TreatmentTab({ treatmentData, dynamicSections = [] }: TreatmentTabProps) {
  const { initialManagement, treatmentPlan, progressionScenarios, clinicalCourse } = treatmentData;
  
  return (
    <div className="space-y-6">
      {/* Initial Management Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Initial Management</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">First steps in patient care</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {initialManagement.map((step, index) => (
              <li key={index} className="px-4 py-4">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center mr-3 mt-1 sm:mt-0">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{step.action}</p>
                    {step.rationale && (
                      <p className="mt-1 text-sm text-gray-500">{step.rationale}</p>
                    )}
                    {step.timing && (
                      <p className="mt-1 text-xs font-medium text-gray-400">{step.timing}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Treatment Plan Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Treatment Plan</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Comprehensive management approach</p>
        </div>
        <div className="border-t border-gray-200">
          {/* Medications */}
          {treatmentPlan.medications && treatmentPlan.medications.length > 0 && (
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Medications</h4>
              <ul className="space-y-3">
                {treatmentPlan.medications.map((med, index) => (
                  <li key={index} className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm font-medium text-gray-900">{med.action}</p>
                    {med.rationale && (
                      <p className="mt-1 text-sm text-gray-500">{med.rationale}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Procedures */}
          {treatmentPlan.procedures && treatmentPlan.procedures.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Procedures</h4>
              <ul className="space-y-3">
                {treatmentPlan.procedures.map((procedure, index) => (
                  <li key={index} className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm font-medium text-gray-900">{procedure.action}</p>
                    {procedure.rationale && (
                      <p className="mt-1 text-sm text-gray-500">{procedure.rationale}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monitoring */}
          {treatmentPlan.monitoring && treatmentPlan.monitoring.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Monitoring</h4>
              <ul className="space-y-3">
                {treatmentPlan.monitoring.map((item, index) => (
                  <li key={index} className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    {item.rationale && (
                      <p className="mt-1 text-sm text-gray-500">{item.rationale}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Consults */}
          {treatmentPlan.consults && treatmentPlan.consults.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Consults</h4>
              <ul className="space-y-3">
                {treatmentPlan.consults.map((consult, index) => (
                  <li key={index} className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm font-medium text-gray-900">{consult.action}</p>
                    {consult.rationale && (
                      <p className="mt-1 text-sm text-gray-500">{consult.rationale}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patient Education */}
          {treatmentPlan.patientEducation && treatmentPlan.patientEducation.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Patient Education</h4>
              <ul className="space-y-3">
                {treatmentPlan.patientEducation.map((item, index) => (
                  <li key={index} className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    {item.rationale && (
                      <p className="mt-1 text-sm text-gray-500">{item.rationale}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Progression Scenarios Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Progression Scenarios</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Potential clinical pathways based on interventions</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {progressionScenarios.map((scenario, index) => (
              <div key={index} className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Scenario {index + 1}: {scenario.title}</h4>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h5 className="text-xs font-medium uppercase text-gray-500 mb-1">Intervention</h5>
                    <p className="text-sm text-gray-900">{scenario.intervention}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium uppercase text-gray-500 mb-1">Response</h5>
                    <p className="text-sm text-gray-900">{scenario.response}</p>
                  </div>
                  {scenario.vitalSignChanges && (
                    <div>
                      <h5 className="text-xs font-medium uppercase text-gray-500 mb-1">Vital Sign Changes</h5>
                      <p className="text-sm text-gray-900">{scenario.vitalSignChanges}</p>
                    </div>
                  )}
                  {scenario.additionalNotes && (
                    <div>
                      <h5 className="text-xs font-medium uppercase text-gray-500 mb-1">Additional Notes</h5>
                      <p className="text-sm text-gray-900">{scenario.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Course and Outcome Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Clinical Course & Outcome</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Patient's response to treatment and eventual outcome</p>
        </div>
        <div className="border-t border-gray-200">
          {/* Timeline */}
          {clinicalCourse.timeline && (
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Timeline</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">{clinicalCourse.timeline}</p>
            </div>
          )}

          {/* Complications */}
          {clinicalCourse.complications && clinicalCourse.complications.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Complications</h4>
              <ul className="list-disc pl-5 space-y-1">
                {clinicalCourse.complications.map((complication, index) => (
                  <li key={index} className="text-sm text-gray-700">{complication}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Outcomes */}
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Outcomes</h4>
            <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
              {clinicalCourse.outcomes.map((outcome, index) => (
                <div key={index} className="bg-gray-50 rounded-md p-3">
                  <dt className="text-xs font-medium uppercase text-gray-500">{outcome.category}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{outcome.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Disposition and Follow-up */}
          <div className="px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 border-t border-gray-200">
            {clinicalCourse.disposition && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Disposition</h4>
                <p className="text-sm text-gray-700">{clinicalCourse.disposition}</p>
              </div>
            )}
            {clinicalCourse.followUp && (
              <div className="mt-4 sm:mt-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Follow-up</h4>
                <p className="text-sm text-gray-700">{clinicalCourse.followUp}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Sections */}
      {dynamicSections.length > 0 && (
        <DynamicContentSection sections={dynamicSections} />
      )}
    </div>
  );
}

export default TreatmentTab; 
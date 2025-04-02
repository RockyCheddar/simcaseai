import React from 'react';
import { DynamicSection } from '@/utils/contentClassifier';
import DynamicContentSection from './DynamicContentSection';

interface Medication {
  name: string;
  dosage: string;
}

interface Allergy {
  allergen: string;
  reaction: string;
}

interface PatientData {
  // General Patient Info
  name: string;
  age: string;
  gender: string;
  occupation?: string;
  
  // Chief Complaint
  chiefComplaint: string;
  
  // Brief History of Present Illness
  briefHistory: string;
  
  // Past Medical History
  conditions: string[];
  medications: Medication[];
  allergies: Allergy[];
  
  // Social History
  livingSituation: string;
  smokingHistory: string;
  alcoholUse: string;
  drugUse: string;
  familyHistory: string[];
  
  // COPD History (if applicable)
  copdDiagnosis?: string;
  previousExacerbations?: string;
  pulmonaryFunctionTests?: string;
  oxygenUse?: string;
}

interface PatientInfoTabProps {
  patientData: PatientData;
  dynamicSections?: DynamicSection[];
}

function PatientInfoTab({ patientData, dynamicSections = [] }: PatientInfoTabProps) {
  const {
    name,
    age,
    gender,
    occupation,
    chiefComplaint,
    briefHistory,
    conditions,
    medications,
    allergies,
    livingSituation,
    smokingHistory,
    alcoholUse,
    drugUse,
    familyHistory,
    copdDiagnosis,
    previousExacerbations,
    pulmonaryFunctionTests,
    oxygenUse
  } = patientData;

  // Check if COPD history is available
  const hasCopdHistory = copdDiagnosis || previousExacerbations || pulmonaryFunctionTests || oxygenUse;

  return (
    <div className="space-y-6">
      {/* General Patient Info */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">General Patient Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic demographic details</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{name}</dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{age}</dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{gender}</dd>
            </div>
            {occupation && (
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Occupation</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{occupation}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Chief Complaint & Present Illness */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Presenting Complaint</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Chief complaint and history of present illness</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Chief Complaint</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <blockquote className="italic border-l-4 border-gray-200 pl-4 py-2">
                  "{chiefComplaint}"
                </blockquote>
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Brief History of Present Illness</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{briefHistory}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Past Medical History */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Past Medical History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Medical conditions, medications, and allergies</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Conditions</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul className="list-disc pl-5 space-y-1">
                  {conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Medications</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul className="list-disc pl-5 space-y-1">
                  {medications.map((medication, index) => (
                    <li key={index}>{medication.name} - {medication.dosage}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Allergies</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul className="list-disc pl-5 space-y-1">
                  {allergies.map((allergy, index) => (
                    <li key={index}>{allergy.allergen} ({allergy.reaction})</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Social History */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Social History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Living situation and lifestyle factors</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Living Situation</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{livingSituation}</dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Smoking History</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{smokingHistory}</dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Alcohol Use</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{alcoholUse}</dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Drug Use</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{drugUse}</dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Family History</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul className="list-disc pl-5 space-y-1">
                  {familyHistory.map((history, index) => (
                    <li key={index}>{history}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* COPD History (if applicable) */}
      {hasCopdHistory && (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">COPD History</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Specific details related to COPD</p>
          </div>
          <div className="border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              {copdDiagnosis && (
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Diagnosis</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{copdDiagnosis}</dd>
                </div>
              )}
              {previousExacerbations && (
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Previous Exacerbations</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{previousExacerbations}</dd>
                </div>
              )}
              {pulmonaryFunctionTests && (
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Pulmonary Function Tests</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{pulmonaryFunctionTests}</dd>
                </div>
              )}
              {oxygenUse && (
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Oxygen Use</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{oxygenUse}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

      {/* Dynamic Sections */}
      {dynamicSections.length > 0 && (
        <DynamicContentSection sections={dynamicSections} />
      )}
    </div>
  );
}

export default PatientInfoTab; 
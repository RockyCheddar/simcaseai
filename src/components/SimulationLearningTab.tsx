import React from 'react';
import { DynamicSection } from '@/utils/contentClassifier';
import DynamicContentSection from './DynamicContentSection';

// Interface for nursing competencies
interface NursingCompetency {
  category: string;
  skills: string[];
}

// Interface for questions to consider
interface Question {
  question: string;
  relevance?: string;
}

// Interface for grading criteria
interface GradingCriterion {
  criterion: string;
  excellent: string;
  satisfactory: string;
  needsImprovement: string;
  weight?: number;
}

// Interface for skills assessment 
interface SkillAssessment {
  category: 'knowledge' | 'skills' | 'criticalThinking' | 'communication';
  title: string;
  description: string;
  criteria: string[];
}

// Main interface for simulation learning data
interface SimulationLearningData {
  nursingCompetencies: NursingCompetency[];
  questionsToConsider: Question[];
  gradingRubric: GradingCriterion[];
  skillsAssessment: SkillAssessment[];
  debriefingPoints?: string[];
  teachingPlan?: string;
}

interface SimulationLearningTabProps {
  simulationData: SimulationLearningData;
  dynamicSections?: DynamicSection[];
}

function SimulationLearningTab({ simulationData, dynamicSections = [] }: SimulationLearningTabProps) {
  const { nursingCompetencies, questionsToConsider, gradingRubric, skillsAssessment, debriefingPoints, teachingPlan } = simulationData;
  
  // Group skills assessment by category
  const knowledgeAssessments = skillsAssessment.filter(a => a.category === 'knowledge');
  const skillsAssessments = skillsAssessment.filter(a => a.category === 'skills');
  const criticalThinkingAssessments = skillsAssessment.filter(a => a.category === 'criticalThinking');
  const communicationAssessments = skillsAssessment.filter(a => a.category === 'communication');
  
  // Extract Common Pitfalls and Key Decision Points from dynamic sections
  const commonPitfallsSections = dynamicSections.filter(section => 
    section.title.toLowerCase().includes('pitfall') ||
    section.title.toLowerCase().includes('common error')
  );
  
  const keyDecisionPointsSections = dynamicSections.filter(section => 
    section.title.toLowerCase().includes('decision point') ||
    section.title.toLowerCase().includes('key decision')
  );
  
  // Remaining dynamic sections after removing pitfalls and decision points
  const remainingDynamicSections = dynamicSections.filter(section => 
    !commonPitfallsSections.includes(section) && 
    !keyDecisionPointsSections.includes(section)
  );
  
  return (
    <div className="space-y-6">
      {/* Nursing Competencies Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Nursing Competencies</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Core competencies to be practiced in this simulation</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            {nursingCompetencies.map((competency, index) => (
              <div key={index} className="px-4 py-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">{competency.category}</dt>
                <dd className="mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {competency.skills.map((skill, skillIndex) => (
                      <li key={skillIndex} className="text-sm text-gray-700">{skill}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Questions to Consider Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Questions to Consider</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Key questions for discussion and reflection</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {questionsToConsider.map((q, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="text-sm font-medium text-gray-900">{index + 1}. {q.question}</div>
                {q.relevance && (
                  <div className="mt-1 text-sm text-gray-500 italic">{q.relevance}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Decision Points Section (from dynamic content) */}
      {keyDecisionPointsSections.length > 0 && (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">Key Decision Points</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Critical decision-making moments in the simulation</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {keyDecisionPointsSections.map((section, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                {section.title !== "Key Decision Points" && (
                  <h4 className="text-base font-medium text-gray-700 mb-2">{section.title}</h4>
                )}
                {Array.isArray(section.content) ? (
                  <ol className="list-decimal pl-5 space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700">{item}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-gray-700 whitespace-pre-line">{section.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Pitfalls Section (from dynamic content) */}
      {commonPitfallsSections.length > 0 && (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">Common Pitfalls</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Frequent errors and challenges to address</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {commonPitfallsSections.map((section, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                {section.title !== "Common Pitfalls" && (
                  <h4 className="text-base font-medium text-gray-700 mb-2">{section.title}</h4>
                )}
                {Array.isArray(section.content) ? (
                  <ol className="list-decimal pl-5 space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700">{item}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-gray-700 whitespace-pre-line">{section.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Rubric Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Grading Rubric</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Assessment criteria and performance standards</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Criterion</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Excellent</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Satisfactory</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Needs Improvement</th>
                  {gradingRubric.some(r => r.weight !== undefined) && (
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Weight</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {gradingRubric.map((criteria, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{criteria.criterion}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{criteria.excellent}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{criteria.satisfactory}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{criteria.needsImprovement}</td>
                    {gradingRubric.some(r => r.weight !== undefined) && (
                      <td className="px-3 py-4 text-sm text-gray-500">{criteria.weight || '-'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Skills Assessment Section */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">Skills Assessment</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Expected competencies across knowledge, skills, critical thinking, and communication</p>
        </div>
        <div className="border-t border-gray-200">
          {/* Knowledge Section */}
          {knowledgeAssessments.length > 0 && (
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Knowledge</h4>
              <div className="space-y-6">
                {knowledgeAssessments.map((assessment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">{assessment.title}</h5>
                    <p className="text-sm text-gray-700 mb-3">{assessment.description}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {assessment.criteria.map((criterion, criterionIndex) => (
                        <li key={criterionIndex} className="text-sm text-gray-700">{criterion}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {skillsAssessments.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Skills</h4>
              <div className="space-y-6">
                {skillsAssessments.map((assessment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">{assessment.title}</h5>
                    <p className="text-sm text-gray-700 mb-3">{assessment.description}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {assessment.criteria.map((criterion, criterionIndex) => (
                        <li key={criterionIndex} className="text-sm text-gray-700">{criterion}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Thinking Section */}
          {criticalThinkingAssessments.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Critical Thinking</h4>
              <div className="space-y-6">
                {criticalThinkingAssessments.map((assessment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">{assessment.title}</h5>
                    <p className="text-sm text-gray-700 mb-3">{assessment.description}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {assessment.criteria.map((criterion, criterionIndex) => (
                        <li key={criterionIndex} className="text-sm text-gray-700">{criterion}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communication Section */}
          {communicationAssessments.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Communication</h4>
              <div className="space-y-6">
                {communicationAssessments.map((assessment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">{assessment.title}</h5>
                    <p className="text-sm text-gray-700 mb-3">{assessment.description}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {assessment.criteria.map((criterion, criterionIndex) => (
                        <li key={criterionIndex} className="text-sm text-gray-700">{criterion}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debriefing Points Section (if available) */}
      {debriefingPoints && debriefingPoints.length > 0 && (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">Debriefing Points</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Key discussion points for post-simulation reflection</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <ul className="list-disc pl-5 space-y-2">
              {debriefingPoints.map((point, index) => (
                <li key={index} className="text-sm text-gray-700">{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Teaching Plan Section (if available) */}
      {teachingPlan && (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900">Teaching Plan</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Overall educational approach for this simulation</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-700 whitespace-pre-line">{teachingPlan}</p>
          </div>
        </div>
      )}

      {/* Remaining Dynamic Sections */}
      {remainingDynamicSections.length > 0 && (
        <DynamicContentSection sections={remainingDynamicSections} />
      )}
    </div>
  );
}

export default SimulationLearningTab; 
'use client';

import React, { useState, useEffect } from 'react';
import { LearningObjective } from '@/types/case';
import AIAnalysisDisplay from '@/components/ai/AIAnalysisDisplay';
import { AIResponse } from '@/lib/api/interfaces';
import { toast } from 'react-hot-toast';

// Direct client-side API call function
async function analyzeObjectivesClientSide(objectives: string[]): Promise<string[]> {
  // Format the prompt for analyzing learning objectives
  const prompt = `
    As a medical education expert, please analyze and refine the following learning objectives for a healthcare simulation case:
    
    ${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}
    
    For each objective, provide a refined version that:
    1. Uses specific, measurable action verbs (e.g., identify, demonstrate, analyze)
    2. Clearly specifies the expected outcome
    3. Aligns with healthcare professional competencies
    4. Is concise and focused on a single learning point
    
    Return ONLY the refined objectives, one per line, numbered to match the original list.
  `;
  
  const system = "You are an expert in medical education and healthcare simulation design with expertise in creating effective learning objectives that align with professional competencies.";
  
  try {
    // Direct API call to Claude endpoint
    console.log('Calling Claude API route from client');
    const response = await fetch('/api/ai/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        temperature: 0.7,
        max_tokens: 4000,
        system
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from API route');
    }

    // Parse the response text into separate objectives
    const responseText = data.content[0].text;
    const refinedObjectives = responseText
      .split('\n')
      .filter((line: string) => line.trim().match(/^\d+\.\s/)) // Only lines starting with a number and period
      .map((line: string) => line.replace(/^\d+\.\s+/, '').trim()); // Remove the numbering
    
    return refinedObjectives;
  } catch (error) {
    console.error('Error analyzing objectives:', error);
    throw error;
  }
}

interface ObjectivesAnalysisStepProps {
  objectives: LearningObjective[];
  onComplete: (refinedObjectives: LearningObjective[]) => void;
  onBack: () => void;
}

export default function ObjectivesAnalysisStep({
  objectives, 
  onComplete,
  onBack
}: ObjectivesAnalysisStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResponse, setAnalysisResponse] = useState<AIResponse | null>(null);
  const [suggestedObjectives, setSuggestedObjectives] = useState<LearningObjective[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);

  // Start analysis when the component mounts
  useEffect(() => {
    const runAnalysis = async () => {
      if (objectives.length === 0) return;
      
      setIsAnalyzing(true);
      setError(null);
      
      try {
        // Extract just the text for analysis
        const objectiveTexts = objectives.map(obj => obj.text);
        
        // Use the client-side implementation instead of the ai-service function
        console.log('Starting client-side objectives analysis');
        const refinedTexts = await analyzeObjectivesClientSide(objectiveTexts);
        console.log('Analysis complete', refinedTexts);
        
        // Create new learning objective objects from the refined texts
        const refined: LearningObjective[] = refinedTexts.map((text, index) => ({
          id: `refined-${Date.now()}-${index}`,
          text,
          category: 'clinical',
          isRefined: true,
          aiSuggested: true
        }));
        
        setSuggestedObjectives(refined);
        
        // By default, select all suggested objectives
        setSelectedObjectives(refined.map(obj => obj.id));
      } catch (err) {
        console.error('Error analyzing objectives:', err);
        setError('Failed to analyze objectives. Please try again.');
        toast.error('AI analysis failed. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    runAnalysis();
  }, [objectives]);

  const handleObjectiveToggle = (id: string) => {
    if (selectedObjectives.includes(id)) {
      setSelectedObjectives(selectedObjectives.filter(objId => objId !== id));
    } else {
      setSelectedObjectives([...selectedObjectives, id]);
    }
  };

  const handleContinue = () => {
    // Get the selected objectives
    const selectedObjs = suggestedObjectives.filter(obj => 
      selectedObjectives.includes(obj.id)
    );
    
    // Call the onComplete callback with the selected objectives
    onComplete(selectedObjs);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">AI Analysis of Learning Objectives</h2>
      
      {/* Original objectives */}
      <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
        <h3 className="text-md font-medium mb-2">Your Original Objectives:</h3>
        <ul className="space-y-2">
          {objectives.map((obj, index) => (
            <li key={obj.id} className="flex items-baseline">
              <span className="text-gray-500 mr-2">{index + 1}.</span>
              <span>{obj.text}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* AI analysis result */}
      {(isAnalyzing || error || suggestedObjectives.length > 0) && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">AI Suggestions:</h3>
          {isAnalyzing ? (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                <span className="ml-3">AI is analyzing your objectives...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="mt-2 text-sm text-red-600 underline"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
              <p className="text-sm text-primary-700 mb-4">
                The AI has refined your objectives to make them more specific, measurable, and aligned with best practices in healthcare education. Select the objectives you'd like to keep.
              </p>
              <ul className="space-y-3">
                {suggestedObjectives.map((obj) => (
                  <li key={obj.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={obj.id}
                      checked={selectedObjectives.includes(obj.id)}
                      onChange={() => handleObjectiveToggle(obj.id)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor={obj.id} className="ml-3 text-primary-700">
                      {obj.text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button 
          onClick={onBack} 
          className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Back to Objectives
        </button>
        <button 
          onClick={handleContinue} 
          disabled={isAnalyzing || selectedObjectives.length === 0}
          className="btn-primary"
        >
          Continue with Selected Objectives
        </button>
      </div>
    </div>
  );
} 
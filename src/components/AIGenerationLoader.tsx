'use client';

import { useState, useEffect } from 'react';

interface AIGenerationLoaderProps {
  mode: 'case' | 'tab' | 'section';
  tabName?: string;
  sectionName?: string;
}

export default function AIGenerationLoader({ mode, tabName, sectionName }: AIGenerationLoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Messages for different generation modes
  const caseMessages = [
    "Analyzing clinical scenario...",
    "Consulting medical literature...",
    "Creating realistic patient profile...",
    "Generating case details...",
    "Formulating learning objectives...",
    "Designing assessment criteria...",
    "Finalizing case content..."
  ];
  
  const tabMessages: Record<string, string[]> = {
    "Overview": [
      "Defining learning objectives...",
      "Crafting case summary...",
      "Setting clinical context...",
      "Establishing patient demographics..."
    ],
    "Patient Info": [
      "Building patient history...",
      "Creating medication profile...",
      "Developing social history...",
      "Setting up condition history..."
    ],
    "Presentation": [
      "Calculating vital signs...",
      "Documenting physical examination findings...",
      "Generating laboratory results...",
      "Formulating diagnostic studies..."
    ],
    "Treatment": [
      "Developing initial management plan...",
      "Creating treatment protocols...",
      "Establishing clinical course...",
      "Outlining expected outcomes..."
    ],
    "Simulation Learning": [
      "Defining nursing competencies...",
      "Creating assessment criteria...",
      "Generating discussion questions...",
      "Establishing learning outcomes..."
    ]
  };
  
  const sectionMessages: Record<string, string[]> = {
    "vitalSigns": ["Analyzing patient data...", "Computing realistic vital signs..."],
    "physicalExam": ["Documenting examination findings...", "Creating detailed assessment notes..."],
    "labResults": ["Processing laboratory values...", "Interpreting diagnostic results..."],
    "treatment": ["Researching evidence-based interventions...", "Formulating personalized treatment plan..."],
    "objectives": ["Identifying key learning goals...", "Aligning with educational standards..."],
  };
  
  // Determine which message set to use
  const messages = mode === 'case' 
    ? caseMessages 
    : mode === 'tab' && tabName 
      ? tabMessages[tabName] || caseMessages
      : mode === 'section' && sectionName 
        ? sectionMessages[sectionName] || caseMessages
        : caseMessages;
  
  useEffect(() => {
    // Cycle through messages
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [messages]);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative w-16 h-16">
        {/* Outer spinning circle */}
        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-blue-400 rounded-full animate-spin"></div>
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-3 bg-blue-100 rounded-full animate-pulse"></div>
        
        {/* Center dot */}
        <div className="absolute inset-6 bg-blue-500 rounded-full"></div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          {mode === 'case' 
            ? "Generating Case" 
            : mode === 'tab' 
              ? `Generating ${tabName} Content` 
              : `Updating ${sectionName}`}
        </h3>
        
        <p className="text-sm text-gray-600 animate-fade-in-out">
          {messages[messageIndex]}
        </p>
        
        <p className="text-xs text-gray-500 mt-4">
          This may take up to a minute...
        </p>
      </div>
    </div>
  );
} 
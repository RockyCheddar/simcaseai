'use client';

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownToPdf } from '@/utils/pdfGenerator';

interface MarkdownPreviewProps {
  markdown: string;
  title?: string;
  caseData?: any; // Optional full case data object for JSON export
}

export default function MarkdownPreview({ markdown, title = 'Document', caseData }: MarkdownPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Extract patient info from markdown for the summary card
  const extractPatientInfo = (): { 
    patientName: string; 
    age: string; 
    gender: string; 
    chiefComplaint: string;
    briefSummary: string;
  } => {
    // Default values if extraction fails
    const defaultInfo = {
      patientName: 'Patient',
      age: 'N/A',
      gender: 'N/A',
      chiefComplaint: 'N/A',
      briefSummary: 'Healthcare simulation case'
    };
    
    try {
      // Extract patient name
      const nameMatch = markdown.match(/Name:\s*([^\n]+)/i);
      const patientName = nameMatch ? nameMatch[1].trim() : defaultInfo.patientName;
      
      // Extract age
      const ageMatch = markdown.match(/Age:?\s*([^\n,]+)/i);
      const age = ageMatch ? ageMatch[1].trim() : defaultInfo.age;
      
      // Extract gender
      const genderMatch = markdown.match(/Gender:?\s*([^\n,]+)/i);
      const gender = genderMatch ? genderMatch[1].trim() : defaultInfo.gender;
      
      // Extract chief complaint
      const complaintMatch = markdown.match(/Chief\s*[Cc]omplaint:?\s*([^\n]+)/i);
      const chiefComplaint = complaintMatch ? complaintMatch[1].trim() : defaultInfo.chiefComplaint;
      
      // Extract brief summary - first paragraph after present illness
      const briefMatch = markdown.match(/[Hh]istory\s*of\s*[Pp]resent\s*[Ii]llness:?\s*([^\n]+)/i);
      const briefSummary = briefMatch ? briefMatch[1].trim() : defaultInfo.briefSummary;
      
      return { patientName, age, gender, chiefComplaint, briefSummary };
    } catch (err) {
      console.error('Error extracting patient info:', err);
      return defaultInfo;
    }
  };
  
  const patientInfo = extractPatientInfo();
  
  // Function to copy markdown to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  // Function to download as PDF
  const downloadAsPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfBlob = await markdownToPdf(markdown, title);
      const url = URL.createObjectURL(pdfBlob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF: ', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  // Function to download as JSON
  const downloadAsJSON = () => {
    try {
      // Use the caseData if provided, otherwise create a simple object from markdown
      const jsonData = caseData || {
        title,
        content: markdown,
        patientInfo: extractPatientInfo(),
        generatedAt: new Date().toISOString()
      };
      
      const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(jsonBlob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating JSON: ', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with title and action buttons */}
      <div className="bg-primary-700 text-white px-4 py-2 flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded hover:bg-opacity-30 transition"
            aria-label="Copy to clipboard"
            disabled={isGeneratingPdf}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadAsPDF}
            className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded hover:bg-opacity-30 transition flex items-center"
            aria-label="Download as PDF"
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Download PDF'}
          </button>
          <button
            onClick={downloadAsJSON}
            className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded hover:bg-opacity-30 transition"
            aria-label="Download as JSON"
          >
            Download JSON
          </button>
        </div>
      </div>
      
      {/* Patient info card */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex flex-wrap md:flex-nowrap">
          <div className="w-full md:w-1/3 pr-4 mb-3 md:mb-0">
            <h4 className="font-semibold text-lg text-primary-700 mb-2">{patientInfo.patientName}</h4>
            <div className="text-sm grid grid-cols-2 gap-x-2">
              <span className="font-medium text-gray-500">Age:</span>
              <span>{patientInfo.age}</span>
              <span className="font-medium text-gray-500">Gender:</span>
              <span>{patientInfo.gender}</span>
              <span className="font-medium text-gray-500">Chief Complaint:</span>
              <span>{patientInfo.chiefComplaint}</span>
            </div>
          </div>
          <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 border-gray-200">
            <h4 className="font-medium text-gray-500 mb-1 text-sm">Case Summary</h4>
            <p className="text-sm">{patientInfo.briefSummary}</p>
          </div>
        </div>
      </div>
      
      {/* Download buttons below patient card */}
      <div className="px-4 py-2 bg-gray-100 flex justify-end space-x-3">
        <button
          onClick={downloadAsPDF}
          className="btn-sm bg-primary-600 text-white hover:bg-primary-700 flex items-center"
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Download PDF
            </>
          )}
        </button>
        <button
          onClick={downloadAsJSON}
          className="btn-sm bg-gray-600 text-white hover:bg-gray-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download JSON
        </button>
      </div>
      
      {/* Markdown content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto" ref={contentRef}>
        <div className="prose max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({node, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !className;
                return !isInline ? (
                  <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownToPdf } from '@/utils/pdfGenerator';

interface MarkdownPreviewProps {
  markdown: string;
  title?: string;
}

export default function MarkdownPreview({ markdown, title = 'Document' }: MarkdownPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
        </div>
      </div>
      
      <div className="p-6 max-h-[80vh] overflow-y-auto" ref={contentRef}>
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 
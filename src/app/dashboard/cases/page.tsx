'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Sample cases data
const sampleCases = [
  {
    id: "case-12345",
    title: "Acute Respiratory Distress: Management of COPD Exacerbation",
    status: "complete",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    objectives: [
      "Identify clinical signs of COPD exacerbation requiring immediate intervention",
      "Demonstrate appropriate oxygen therapy administration for patients with COPD",
      "Formulate an evidence-based treatment plan including bronchodilators and corticosteroids",
      "Communicate effectively with a distressed patient with respiratory difficulty"
    ]
  },
  {
    id: "case-23456",
    title: "Pediatric Diabetic Ketoacidosis: Assessment and Management",
    status: "draft",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    objectives: [
      "Recognize the clinical presentation of diabetic ketoacidosis in pediatric patients",
      "Implement appropriate fluid resuscitation and insulin therapy",
      "Monitor for and prevent complications of DKA treatment",
      "Effectively communicate with pediatric patients and their families"
    ]
  },
  {
    id: "case-34567",
    title: "Postpartum Hemorrhage: Early Recognition and Management",
    status: "in-review",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    objectives: [
      "Identify risk factors for postpartum hemorrhage",
      "Demonstrate appropriate assessment techniques for blood loss estimation",
      "Implement first-line interventions for postpartum hemorrhage",
      "Coordinate effective team-based response in obstetric emergencies"
    ]
  }
];

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // In a real application, you would fetch cases from an API
    // For demonstration, we're using sample data
    setTimeout(() => {
      setCases(sampleCases);
      setIsLoading(false);
    }, 1000); // Simulate loading
  }, []);

  const filteredCases = filterStatus === 'all' 
    ? cases 
    : cases.filter(c => c.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Draft
          </span>
        );
      case 'in-review':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            In Review
          </span>
        );
      case 'complete':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Complete
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="pb-12">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Simulation Cases</h1>
        <div className="mt-3 sm:mt-0">
          <Link href="/dashboard/cases/new" className="btn-primary">
            Create New Case
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filterStatus === 'all' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Cases
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filterStatus === 'draft' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Drafts
              </button>
              <button
                onClick={() => setFilterStatus('in-review')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filterStatus === 'in-review' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                In Review
              </button>
              <button
                onClick={() => setFilterStatus('complete')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filterStatus === 'complete' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Complete
              </button>
            </div>
            
            <div className="mt-2 sm:mt-0">
              <input
                type="text"
                placeholder="Search cases..."
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-10 text-center">
            <div className="animate-pulse flex justify-center">
              <div className="h-6 w-6 bg-primary-600 rounded-full"></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Loading cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No cases found matching your criteria.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredCases.map((caseItem) => (
              <li key={caseItem.id}>
                <Link href={`/dashboard/cases/${caseItem.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-md font-medium text-primary-700 truncate">{caseItem.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        {getStatusBadge(caseItem.status)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Updated {formatDate(caseItem.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap">
                        {caseItem.objectives.slice(0, 2).map((objective: string, index: number) => (
                          <span key={index} className="mr-2 mb-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                            {objective.length > 50 ? objective.substring(0, 50) + '...' : objective}
                          </span>
                        ))}
                        {caseItem.objectives.length > 2 && (
                          <span className="mr-2 mb-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            +{caseItem.objectives.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
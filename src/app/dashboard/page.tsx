'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data for cases
const mockCases = [
  {
    id: '1',
    title: 'Acute Myocardial Infarction Case',
    status: 'published',
    updatedAt: '2023-10-15T14:30:00Z',
    objectives: ['Recognize symptoms of acute MI', 'Apply ACLS protocols', 'Interpret ECG changes'],
  },
  {
    id: '2',
    title: 'Pediatric Asthma Exacerbation',
    status: 'draft',
    updatedAt: '2023-10-12T09:15:00Z',
    objectives: ['Assess pediatric respiratory distress', 'Calculate appropriate medication dosing', 'Develop patient education plan'],
  },
  {
    id: '3',
    title: 'Type 2 Diabetes Initial Diagnosis',
    status: 'review',
    updatedAt: '2023-10-10T16:45:00Z',
    objectives: ['Interpret lab results', 'Develop initial treatment plan', 'Provide lifestyle modification counseling'],
  },
];

export default function Dashboard() {
  const [recentCases, setRecentCases] = useState(mockCases);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Draft</span>;
      case 'review':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Review</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link href="/dashboard/cases/new" className="btn-primary">
            Create New Case
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-600 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Cases</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">3</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/cases" className="font-medium text-primary-700 hover:text-primary-900">
                View all cases
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-600 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Published Cases</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">1</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/cases?status=published" className="font-medium text-primary-700 hover:text-primary-900">
                View published cases
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Review</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">1</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/cases?status=review" className="font-medium text-primary-700 hover:text-primary-900">
                View cases in review
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Cases</h2>
          <Link href="/dashboard/cases" className="text-sm font-medium text-primary-700 hover:text-primary-900">
            View all
          </Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {isLoading ? (
            <div className="p-10 text-center">
              <div className="animate-pulse flex justify-center">
                <div className="h-6 w-6 bg-primary-600 rounded-full"></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Loading cases...</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentCases.map((caseItem) => (
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
                          {caseItem.objectives.slice(0, 2).map((objective, index) => (
                            <span key={index} className="mr-2 mb-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                              {objective}
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
    </div>
  );
} 
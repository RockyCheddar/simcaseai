'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function EditCasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [caseTitle, setCaseTitle] = useState('');

  useEffect(() => {
    // In a real app, you would fetch the case data
    // For demo purposes, we'll simulate loading
    setTimeout(() => {
      setCaseTitle("Acute Respiratory Distress: Management of COPD Exacerbation");
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const handleSave = () => {
    toast.success("Case updated successfully!");
    router.push(`/dashboard/cases/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Case</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="mb-6 text-gray-600">
          This is a placeholder for the case editing interface. In a full implementation, you would see all case details here for editing.
        </p>
        
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Case Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
            value={caseTitle}
            onChange={(e) => setCaseTitle(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link 
            href={`/dashboard/cases/${params.id}`}
            className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button 
            onClick={handleSave} 
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 
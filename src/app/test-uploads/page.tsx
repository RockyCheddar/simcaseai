'use client';

import { useState } from 'react';
import { UploadButton, UploadDropzone, type UploadFileResponse } from '@/lib/uploadthing';

export default function TestUploadsPage() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadedDocUrls, setUploadedDocUrls] = useState<string[]>([]);
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="pb-5 border-b border-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Test File Uploads</h1>
        <p className="mt-2 text-gray-600">
          This page demonstrates file uploads using UploadThing for images and documents.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Uploads Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload an image file (max 4MB). Supported formats: JPEG, PNG, GIF.
          </p>
          
          <div className="mb-6">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: UploadFileResponse[] | undefined) => {
                if (res) {
                  const urls = res.map((file: UploadFileResponse) => file.url);
                  setUploadedUrls((prev) => [...prev, ...urls]);
                  console.log("Files uploaded:", res);
                  alert("Upload Completed");
                }
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                alert(`Upload error: ${error.message}`);
              }}
            />
          </div>
          
          {uploadedUrls.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-2">Uploaded Images:</h3>
              <div className="grid grid-cols-2 gap-2">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Document Uploads Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload documents like PDFs (max 16MB), images (max 8MB), or text files (max 2MB).
          </p>
          
          <div className="mb-6">
            <UploadDropzone
              endpoint="documentUploader"
              onClientUploadComplete={(res: UploadFileResponse[] | undefined) => {
                if (res) {
                  const urls = res.map((file: UploadFileResponse) => file.url);
                  setUploadedDocUrls((prev) => [...prev, ...urls]);
                  console.log("Documents uploaded:", res);
                  alert("Upload Completed");
                }
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                alert(`Upload error: ${error.message}`);
              }}
            />
          </div>
          
          {uploadedDocUrls.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-2">Uploaded Documents:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {uploadedDocUrls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline break-all"
                    >
                      Document {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
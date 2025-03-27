import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            SimCase AI
          </h1>
          <p className="text-xl sm:text-2xl opacity-90 mb-10 max-w-3xl mx-auto">
            Intelligent simulation case generation for healthcare education
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/test-case-generation" 
              className="inline-flex items-center justify-center rounded-md px-6 py-3 bg-white text-primary-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
            >
              Try Case Generation
            </Link>
            <Link 
              href="/dashboard/cases/new" 
              className="inline-flex items-center justify-center rounded-md px-6 py-3 bg-primary-600 text-white font-medium shadow-sm hover:bg-primary-500 transition-colors"
            >
              Create Full Case
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Key System Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">AI-Powered Case Generation</h3>
              <p className="text-gray-600">
                Create realistic, medically accurate simulation cases with advanced AI models.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Learning Objective Analysis</h3>
              <p className="text-gray-600">
                Refine and optimize learning objectives to ensure educational effectiveness.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Professional Documentation</h3>
              <p className="text-gray-600">
                Generate professional PDF documents ready for immediate use in simulation sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Try Our Demo Features
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience the power of SimCase AI through our interactive demos. Each feature showcases a different aspect of our simulation case generation system.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-2 bg-primary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Case Generation</h3>
                <p className="text-gray-600 mb-4">
                  Generate a complete healthcare simulation case from predefined parameters. See how our AI creates realistic, educationally valuable content.
                </p>
                <Link
                  href="/test-case-generation"
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  Try Case Generation
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-2 bg-primary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Learning Objective Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Test our AI's ability to analyze and refine learning objectives for healthcare simulation cases.
                </p>
                <Link
                  href="/test-ai"
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  Try Objective Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-2 bg-primary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Parameter Questions</h3>
                <p className="text-gray-600 mb-4">
                  Experience our guided approach to defining simulation case parameters through targeted questions.
                </p>
                <Link
                  href="/test-parameters"
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  Try Parameter Questions
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-2 bg-primary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">File Uploads</h3>
                <p className="text-gray-600 mb-4">
                  Test our file upload capabilities for incorporating images and documents into simulation cases.
                </p>
                <Link
                  href="/test-uploads"
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  Try File Uploads
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/dashboard/cases/new"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 bg-primary-600 text-white font-medium shadow-sm hover:bg-primary-500 transition-colors"
            >
              Experience Full Workflow
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-white text-lg font-semibold mb-4">SimCase AI</h3>
              <p className="max-w-xs">
                Revolutionizing healthcare simulation education with artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/cases/new" className="hover:text-white">
                    Create Case
                  </Link>
                </li>
                <li>
                  <Link href="/test-case-generation" className="hover:text-white">
                    Case Generation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-sm">
            <p>© {new Date().getFullYear()} SimCase AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 
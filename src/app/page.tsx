import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-700">SimCase AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Healthcare Simulation Case Generator
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Create realistic, AI-powered healthcare simulation cases with customized learning objectives
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/login" className="btn-primary px-8 py-3 text-base font-medium">
                Get Started
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Case Generation</h3>
              <p className="text-gray-600">
                Harness multiple AI models to create realistic, clinically accurate simulation cases.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learning Objective Focus</h3>
              <p className="text-gray-600">
                Start with your educational goals and let AI create perfect cases to match your objectives.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">EdEHR Compatible</h3>
              <p className="text-gray-600">
                Generate cases compatible with educational EHR systems for seamless integration.
              </p>
            </div>
          </div>

          <div className="card mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold mb-3">
                  1
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Define Objectives</h4>
                <p className="text-gray-600 text-sm">Input your learning objectives and let AI suggest refinements</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold mb-3">
                  2
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Generate Case</h4>
                <p className="text-gray-600 text-sm">AI creates patient profiles, clinical data, and learning activities</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold mb-3">
                  3
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Review & Edit</h4>
                <p className="text-gray-600 text-sm">Customize the case to meet your specific requirements</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold mb-3">
                  4
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Export & Deploy</h4>
                <p className="text-gray-600 text-sm">Download materials or integrate directly with EdEHR</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2023 SimCase AI. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white">Terms</a>
              <a href="#" className="text-gray-300 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
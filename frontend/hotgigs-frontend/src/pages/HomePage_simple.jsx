import React from 'react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Welcome to HotGigs.ai
        </h1>
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-8">
            Your AI-powered job search platform
          </p>
          <div className="bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Find Your Dream Job
            </h2>
            <p className="text-blue-700">
              Connect with top employers and discover opportunities that match your skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage


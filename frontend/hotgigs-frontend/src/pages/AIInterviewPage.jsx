import React, { useState } from 'react'
import { MessageSquare, Play, Pause, Square, Mic, MicOff, Camera, CameraOff, Settings, Clock, CheckCircle, AlertCircle, Star, RotateCcw } from 'lucide-react'

const AIInterviewPage = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [responses, setResponses] = useState([])
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)

  const interviewQuestions = [
    {
      id: 1,
      question: "Tell me about yourself and your professional background.",
      category: "General",
      timeLimit: 120
    },
    {
      id: 2,
      question: "What interests you about this position and our company?",
      category: "Motivation",
      timeLimit: 90
    },
    {
      id: 3,
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      category: "Problem Solving",
      timeLimit: 180
    },
    {
      id: 4,
      question: "Where do you see yourself in 5 years?",
      category: "Career Goals",
      timeLimit: 90
    },
    {
      id: 5,
      question: "Do you have any questions for us?",
      category: "Engagement",
      timeLimit: 60
    }
  ]

  const handleStartInterview = () => {
    setInterviewStarted(true)
    setCurrentQuestion(0)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // Save response logic here
  }

  const handleFinishInterview = () => {
    setInterviewStarted(false)
    setCurrentQuestion(0)
    // Process interview results
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Interview Assistant</h1>
              <p className="text-gray-600">Practice your interview skills with our AI-powered interview system</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">How it works</h3>
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Answer 5 common interview questions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Record your responses via audio/video</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Get AI-powered feedback and scoring</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Improve your interview performance</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Interview Questions</h3>
                <div className="space-y-2">
                  {interviewQuestions.map((q, index) => (
                    <div key={q.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{q.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">Before you start</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Make sure your microphone and camera are working properly. Find a quiet space with good lighting.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartInterview}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start AI Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = interviewQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">AI Interview in Progress</h1>
                <p className="text-blue-100">Question {currentQuestion + 1} of {interviewQuestions.length}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono">{currentQ.timeLimit}s</span>
                </div>
                <div className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                  {currentQ.category}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-2">
            <div 
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / interviewQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Section */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {currentQ.question}
              </h2>
              <p className="text-gray-600">
                Take your time to think, then click record when you're ready to answer.
              </p>
            </div>

            {/* Video/Audio Controls */}
            <div className="bg-gray-100 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-3 rounded-full ${micEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                  {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`p-3 rounded-full ${cameraEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                  {cameraEnabled ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
                </button>

                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`px-6 py-3 rounded-lg font-semibold ${
                    isRecording 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-5 h-5 mr-2 inline" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2 inline" />
                      Start Recording
                    </>
                  )}
                </button>
              </div>

              {isRecording && (
                <div className="text-center mt-4">
                  <div className="inline-flex items-center text-red-600">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                    Recording in progress...
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous Question
              </button>

              <div className="flex space-x-4">
                <button
                  onClick={handleFinishInterview}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Finish Interview
                </button>
                
                {currentQuestion < interviewQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleFinishInterview}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Complete Interview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInterviewPage


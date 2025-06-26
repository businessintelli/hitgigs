import React, { useState } from 'react'
import { Award, Clock, CheckCircle, XCircle, AlertCircle, Star, Target, TrendingUp, BarChart3, Play, Pause, RotateCcw, Eye, Download, Share2 } from 'lucide-react'

const SkillAssessmentPage = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [assessmentStarted, setAssessmentStarted] = useState(false)
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes

  const availableAssessments = [
    {
      id: 'react',
      title: 'React Development',
      description: 'Test your React.js knowledge and best practices',
      duration: 30,
      questions: 25,
      difficulty: 'Intermediate',
      skills: ['React', 'JSX', 'Hooks', 'State Management', 'Components'],
      icon: '⚛️',
      color: 'blue'
    },
    {
      id: 'javascript',
      title: 'JavaScript Fundamentals',
      description: 'Comprehensive JavaScript assessment covering ES6+ features',
      duration: 45,
      questions: 35,
      difficulty: 'Beginner to Advanced',
      skills: ['ES6+', 'Async/Await', 'Closures', 'Prototypes', 'DOM'],
      icon: '🟨',
      color: 'yellow'
    },
    {
      id: 'nodejs',
      title: 'Node.js Backend',
      description: 'Server-side JavaScript and API development',
      duration: 40,
      questions: 30,
      difficulty: 'Intermediate',
      skills: ['Express.js', 'APIs', 'Database', 'Authentication', 'Middleware'],
      icon: '🟢',
      color: 'green'
    },
    {
      id: 'css',
      title: 'CSS & Styling',
      description: 'Modern CSS, Flexbox, Grid, and responsive design',
      duration: 25,
      questions: 20,
      difficulty: 'Beginner to Intermediate',
      skills: ['Flexbox', 'Grid', 'Responsive', 'Animations', 'Preprocessors'],
      icon: '🎨',
      color: 'purple'
    }
  ]

  const sampleQuestions = [
    {
      id: 1,
      question: "What is the correct way to create a functional component in React?",
      type: "multiple-choice",
      options: [
        "function MyComponent() { return <div>Hello</div>; }",
        "const MyComponent = () => { return <div>Hello</div>; }",
        "class MyComponent extends React.Component { render() { return <div>Hello</div>; } }",
        "Both A and B are correct"
      ],
      correctAnswer: 3,
      explanation: "Both function declarations and arrow functions are valid ways to create functional components in React."
    },
    {
      id: 2,
      question: "Which Hook is used to manage state in functional components?",
      type: "multiple-choice",
      options: [
        "useEffect",
        "useState",
        "useContext",
        "useReducer"
      ],
      correctAnswer: 1,
      explanation: "useState is the primary Hook for managing local state in functional components."
    }
  ]

  const assessmentResults = {
    score: 85,
    totalQuestions: 25,
    correctAnswers: 21,
    timeSpent: 1245, // seconds
    skillBreakdown: [
      { skill: 'React Fundamentals', score: 90, level: 'Advanced' },
      { skill: 'Hooks & State', score: 85, level: 'Intermediate' },
      { skill: 'Component Design', score: 80, level: 'Intermediate' },
      { skill: 'Performance', score: 75, level: 'Intermediate' },
      { skill: 'Testing', score: 70, level: 'Beginner' }
    ],
    recommendations: [
      "Focus on React testing patterns and best practices",
      "Learn advanced performance optimization techniques",
      "Practice with complex state management scenarios"
    ],
    certificateEligible: true
  }

  const handleStartAssessment = (assessment) => {
    setSelectedAssessment(assessment)
    setAssessmentStarted(true)
    setCurrentQuestion(0)
    setAnswers({})
    setTimeRemaining(assessment.duration * 60)
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setAssessmentCompleted(true)
      setAssessmentStarted(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getLevelColor = (level) => {
    if (level === 'Advanced') return 'text-green-600 bg-green-100'
    if (level === 'Intermediate') return 'text-blue-600 bg-blue-100'
    return 'text-orange-600 bg-orange-100'
  }

  if (assessmentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
              <p className="text-gray-600">Here are your results for the React Development assessment</p>
            </div>

            {/* Score Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{assessmentResults.score}%</div>
                <div className="text-blue-800 font-semibold">Overall Score</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {assessmentResults.correctAnswers}/{assessmentResults.totalQuestions}
                </div>
                <div className="text-green-800 font-semibold">Correct Answers</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatTime(assessmentResults.timeSpent)}
                </div>
                <div className="text-purple-800 font-semibold">Time Spent</div>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skill Breakdown</h3>
              <div className="space-y-4">
                {assessmentResults.skillBreakdown.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${skill.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{skill.score}%</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations for Improvement</h3>
              <div className="space-y-3">
                {assessmentResults.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate */}
            {assessmentResults.certificateEligible && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Certificate Eligible!</h4>
                      <p className="text-gray-600">You scored above 80% and qualify for a certificate</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  setAssessmentCompleted(false)
                  setSelectedAssessment(null)
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Take Another Assessment
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (assessmentStarted && selectedAssessment) {
    const currentQ = sampleQuestions[currentQuestion]
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{selectedAssessment.title} Assessment</h1>
                  <p className="text-blue-100">Question {currentQuestion + 1} of {sampleQuestions.length}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-mono">{formatTime(timeRemaining)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 h-2">
              <div 
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question */}
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {currentQ.question}
                </h2>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        answers[currentQ.id] === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={index}
                        checked={answers[currentQ.id] === index}
                        onChange={() => handleAnswerSelect(currentQ.id, index)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQ.id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQ.id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setAssessmentStarted(false)
                      setSelectedAssessment(null)
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Exit Assessment
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={answers[currentQ.id] === undefined}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion === sampleQuestions.length - 1 ? 'Finish' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Assessment Center</h1>
            <p className="text-gray-600">Test your technical skills and get certified</p>
          </div>
        </div>

        {/* Available Assessments */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {availableAssessments.map((assessment) => (
            <div key={assessment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{assessment.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{assessment.title}</h3>
                      <p className="text-gray-600 mt-1">{assessment.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <div className="font-semibold text-gray-900">{assessment.duration} min</div>
                    <div className="text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <div className="font-semibold text-gray-900">{assessment.questions}</div>
                    <div className="text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Star className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <div className="font-semibold text-gray-900">{assessment.difficulty}</div>
                    <div className="text-gray-600">Level</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {assessment.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleStartAssessment(assessment)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Assessment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Assessment Guidelines</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Each assessment has a time limit - manage your time wisely</li>
                <li>• You can navigate between questions during the assessment</li>
                <li>• Scoring 80% or above qualifies you for a certificate</li>
                <li>• Results include detailed skill breakdown and improvement recommendations</li>
                <li>• You can retake assessments to improve your score</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillAssessmentPage


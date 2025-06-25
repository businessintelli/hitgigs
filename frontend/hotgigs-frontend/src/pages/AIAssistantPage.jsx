import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Send, 
  Mic, 
  MicOff, 
  Download, 
  Copy, 
  Trash2, 
  MessageSquare, 
  Bot, 
  User,
  Sparkles,
  FileText,
  BarChart3,
  Users,
  Briefcase,
  Search,
  Settings,
  RefreshCw
} from 'lucide-react'

const AIAssistantPage = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Sample conversation starters based on user role
  const getConversationStarters = () => {
    const baseStarters = [
      "Show me my dashboard overview",
      "What are the latest platform updates?",
      "Help me understand the analytics",
      "Generate a report for this month"
    ]

    switch (user?.user_type) {
      case 'candidate':
        return [
          "Find jobs that match my profile",
          "Analyze my resume and suggest improvements",
          "What are my application statuses?",
          "Show me salary trends for my skills",
          "Help me prepare for interviews"
        ]
      case 'company':
        return [
          "Show me our hiring pipeline",
          "Generate a job description for a developer role",
          "What's our time-to-hire metric?",
          "Find top candidates for our open positions",
          "Create a hiring report for this quarter"
        ]
      case 'freelance_recruiter':
        return [
          "Show me my active placements",
          "Find candidates for client requirements",
          "What's my commission forecast?",
          "Generate a client report",
          "Help me track my recruitment metrics"
        ]
      default:
        return baseStarters
    }
  }

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: 1,
      type: 'ai',
      content: `Hello ${user?.first_name || 'there'}! I'm your AI assistant for HotGigs.ai. I can help you with:

• **Data Analysis**: Query any platform data using natural language
• **Report Generation**: Create custom reports and insights
• **Job Matching**: Find the best candidates or jobs
• **Resume Analysis**: Analyze and optimize resumes
• **Market Intelligence**: Get salary trends and hiring insights
• **Workflow Automation**: Streamline your recruitment processes

What would you like to explore today?`,
      timestamp: new Date(),
      suggestions: getConversationStarters()
    }
    setMessages([welcomeMessage])
    scrollToBottom()
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Simulate AI response (in real implementation, this would call the backend API)
      const aiResponse = await generateAIResponse(inputMessage, user)
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        data: aiResponse.data,
        actions: aiResponse.actions
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (message, user) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const lowerMessage = message.toLowerCase()

    // Job-related queries
    if (lowerMessage.includes('job') || lowerMessage.includes('position')) {
      if (user?.user_type === 'candidate') {
        return {
          content: `Based on your profile, I found **5 highly relevant positions** that match your skills and experience:

**🎯 Top Matches:**
• **Senior Full Stack Developer** at TechCorp - 95% match
• **React Developer** at StartupXYZ - 92% match  
• **Software Engineer** at InnovateLab - 88% match

**📊 Market Insights:**
• Average salary range: $120K - $160K
• 23% increase in demand for your skills
• Best application time: Tuesday-Thursday mornings

Would you like me to help you apply to any of these positions or analyze your resume for better matching?`,
          data: {
            jobs: [
              { title: 'Senior Full Stack Developer', company: 'TechCorp', match: 95, salary: '$140K-160K' },
              { title: 'React Developer', company: 'StartupXYZ', match: 92, salary: '$120K-140K' },
              { title: 'Software Engineer', company: 'InnovateLab', match: 88, salary: '$130K-150K' }
            ]
          },
          actions: ['Apply to Jobs', 'Analyze Resume', 'View Salary Trends']
        }
      } else {
        return {
          content: `Here's your current hiring pipeline overview:

**📈 Active Positions:** 8 open roles
**👥 Total Candidates:** 156 in pipeline
**⏱️ Average Time-to-Hire:** 18 days
**🎯 Top Performing Role:** Senior Developer (12 applications this week)

**🔥 Urgent Attention Needed:**
• **Product Manager** role - 45 days open, needs better job description
• **DevOps Engineer** - Only 3 qualified candidates, consider expanding search

Would you like me to generate optimized job descriptions or find more candidates for specific roles?`,
          data: {
            openRoles: 8,
            totalCandidates: 156,
            avgTimeToHire: 18,
            urgentRoles: ['Product Manager', 'DevOps Engineer']
          },
          actions: ['Generate Job Description', 'Find Candidates', 'View Analytics']
        }
      }
    }

    // Resume analysis queries
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return {
        content: `I've analyzed your resume and here's my assessment:

**📊 Overall Score: 8.2/10** ⭐

**✅ Strengths:**
• Strong technical skills alignment (React, Node.js, Python)
• Quantified achievements with impact metrics
• Progressive career growth demonstrated

**⚠️ Areas for Improvement:**
• Add more industry-specific keywords (increase ATS compatibility by 15%)
• Include soft skills examples (leadership, communication)
• Optimize summary section for better first impression

**🎯 Recommended Actions:**
1. Add keywords: "Agile", "Microservices", "Cloud Architecture"
2. Quantify 2 more achievements with specific numbers
3. Include a brief leadership example

Would you like me to generate an optimized version of your resume?`,
        data: {
          score: 8.2,
          strengths: ['Technical skills', 'Quantified achievements', 'Career progression'],
          improvements: ['Keywords', 'Soft skills', 'Summary optimization'],
          keywords: ['Agile', 'Microservices', 'Cloud Architecture']
        },
        actions: ['Optimize Resume', 'Download Analysis', 'Compare with Job Requirements']
      }
    }

    // Analytics and reporting queries
    if (lowerMessage.includes('report') || lowerMessage.includes('analytics') || lowerMessage.includes('dashboard')) {
      return {
        content: `I've generated your comprehensive analytics report:

**📊 Key Performance Metrics (Last 30 Days):**

${user?.user_type === 'candidate' ? `
• **Applications Sent:** 12 (+3 from last month)
• **Interview Invitations:** 4 (33% response rate)
• **Profile Views:** 89 (+15% increase)
• **Job Match Score:** Improved by 12%
` : user?.user_type === 'company' ? `
• **New Applications:** 234 (+18% from last month)
• **Interviews Conducted:** 45
• **Hires Made:** 8 (18% conversion rate)
• **Time-to-Hire:** 16 days (2 days faster)
` : `
• **Active Placements:** 12
• **New Clients:** 3
• **Commission Earned:** $18,500
• **Candidate Pipeline:** 67 active candidates
`}

**🎯 Insights & Recommendations:**
• Your performance is trending upward
• Consider focusing on ${user?.user_type === 'candidate' ? 'senior-level positions for better match rates' : user?.user_type === 'company' ? 'technical roles where you have the highest success rate' : 'enterprise clients for higher-value placements'}

Would you like me to create a detailed PDF report or set up automated weekly insights?`,
        data: {
          metrics: user?.user_type === 'candidate' ? 
            { applications: 12, interviews: 4, profileViews: 89, matchScore: 12 } :
            user?.user_type === 'company' ?
            { applications: 234, interviews: 45, hires: 8, timeToHire: 16 } :
            { placements: 12, clients: 3, commission: 18500, pipeline: 67 }
        },
        actions: ['Download PDF Report', 'Set Up Alerts', 'View Detailed Analytics']
      }
    }

    // Default response for other queries
    return {
      content: `I understand you're asking about "${message}". Here are some ways I can help:

**🤖 AI Capabilities:**
• **Natural Language Queries** - Ask me anything about your data
• **Smart Recommendations** - Get personalized suggestions
• **Report Generation** - Create custom reports and insights
• **Data Analysis** - Analyze trends and patterns
• **Workflow Automation** - Streamline your processes

**💡 Try asking me:**
• "Show me my top performing metrics"
• "Find candidates with Python skills"
• "Generate a hiring report for Q1"
• "What are the salary trends in tech?"
• "Help me optimize my job posting"

What specific information or task would you like help with?`,
      actions: ['View Help Guide', 'Explore Features', 'Contact Support']
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser')
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content)
    // Show toast notification (you could implement a toast system)
    alert('Message copied to clipboard!')
  }

  const clearConversation = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      setMessages([])
      setConversationHistory([])
    }
  }

  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'AI Assistant'} (${msg.timestamp.toLocaleString()}):\n${msg.content}\n\n`
    ).join('')
    
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hotgigs-ai-conversation-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="ai-assistant-page">
      {/* Header */}
      <div className="ai-header">
        <div className="header-content">
          <div className="header-info">
            <div className="ai-avatar">
              <Bot size={24} />
            </div>
            <div className="header-text">
              <h1>AI Assistant</h1>
              <p>Your intelligent companion for HotGigs.ai</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={exportConversation}>
              <Download size={16} />
              Export
            </button>
            <button className="btn btn-outline" onClick={clearConversation}>
              <Trash2 size={16} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages-area">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">
                    {message.type === 'user' ? user?.first_name || 'You' : 'AI Assistant'}
                  </span>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className={`message-text ${message.isError ? 'error' : ''}`}>
                  {message.content.split('\n').map((line, index) => (
                    <div key={index}>
                      {line.includes('**') ? (
                        <div dangerouslySetInnerHTML={{
                          __html: line
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/•/g, '•')
                        }} />
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="message-suggestions">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {message.actions && (
                  <div className="message-actions">
                    {message.actions.map((action, index) => (
                      <button key={index} className="action-btn">
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Controls */}
                <div className="message-controls">
                  <button 
                    className="control-btn"
                    onClick={() => copyMessage(message.content)}
                    title="Copy message"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="message ai">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your HotGigs.ai data..."
              className="message-input"
              rows="1"
              disabled={isLoading}
            />
            <div className="input-actions">
              <button
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={handleVoiceInput}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ai-assistant-page {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .ai-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 24px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ai-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .header-text h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .header-text p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .message {
          display: flex;
          gap: 12px;
          max-width: 80%;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message.ai {
          align-self: flex-start;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message.user .message-avatar {
          background: #06b6d4;
          color: white;
        }

        .message.ai .message-avatar {
          background: #8b5cf6;
          color: white;
        }

        .message-content {
          flex: 1;
          position: relative;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .message-sender {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .message-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .message-text {
          background: white;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          line-height: 1.6;
          color: #374151;
          white-space: pre-wrap;
        }

        .message.user .message-text {
          background: #06b6d4;
          color: white;
          border-color: #06b6d4;
        }

        .message-text.error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        .message-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .suggestion-chip {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .suggestion-chip:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .message-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .action-btn {
          background: #06b6d4;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #0891b2;
        }

        .message-controls {
          position: absolute;
          top: 8px;
          right: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .message-content:hover .message-controls {
          opacity: 1;
        }

        .control-btn {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 4px;
          cursor: pointer;
          color: #6b7280;
        }

        .control-btn:hover {
          background: white;
          color: #374151;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          background: #06b6d4;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        .typing-text {
          font-size: 14px;
          color: #6b7280;
        }

        .input-area {
          background: white;
          border-top: 1px solid #e2e8f0;
          padding: 20px 24px;
        }

        .input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          max-width: 100%;
        }

        .message-input {
          flex: 1;
          min-height: 44px;
          max-height: 120px;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 14px;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
        }

        .message-input:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .message-input:disabled {
          background: #f9fafb;
          color: #9ca3af;
        }

        .input-actions {
          display: flex;
          gap: 8px;
        }

        .voice-btn, .send-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .voice-btn {
          background: #f1f5f9;
          color: #64748b;
        }

        .voice-btn:hover {
          background: #e2e8f0;
          color: #475569;
        }

        .voice-btn.listening {
          background: #dc2626;
          color: white;
          animation: pulse 1s infinite;
        }

        .send-btn {
          background: #06b6d4;
          color: white;
        }

        .send-btn:hover:not(:disabled) {
          background: #0891b2;
        }

        .send-btn:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f9fafb;
        }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .ai-header {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .messages-area {
            padding: 16px;
          }

          .message {
            max-width: 95%;
          }

          .input-area {
            padding: 16px;
          }

          .message-suggestions {
            flex-direction: column;
          }

          .message-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default AIAssistantPage


import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle, 
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronRight,
  User,
  Building,
  Briefcase,
  Settings,
  CreditCard,
  Shield
} from 'lucide-react'

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    {
      icon: <User className="h-8 w-8 text-blue-600" />,
      title: "Getting Started",
      description: "Learn the basics of using HotGigs.ai",
      articles: 12
    },
    {
      icon: <Briefcase className="h-8 w-8 text-green-600" />,
      title: "Job Search",
      description: "Find and apply to your dream jobs",
      articles: 18
    },
    {
      icon: <Building className="h-8 w-8 text-purple-600" />,
      title: "For Employers",
      description: "Post jobs and manage candidates",
      articles: 15
    },
    {
      icon: <Settings className="h-8 w-8 text-orange-600" />,
      title: "Account Settings",
      description: "Manage your profile and preferences",
      articles: 10
    },
    {
      icon: <CreditCard className="h-8 w-8 text-red-600" />,
      title: "Billing & Plans",
      description: "Subscription and payment information",
      articles: 8
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Privacy & Security",
      description: "Keep your data safe and secure",
      articles: 6
    }
  ]

  const popularArticles = [
    {
      title: "How to create an effective profile",
      category: "Getting Started",
      views: "15.2k views",
      readTime: "5 min read"
    },
    {
      title: "Understanding AI job matching",
      category: "Job Search",
      views: "12.8k views",
      readTime: "7 min read"
    },
    {
      title: "How to post your first job",
      category: "For Employers",
      views: "9.5k views",
      readTime: "4 min read"
    },
    {
      title: "Setting up job alerts",
      category: "Job Search",
      views: "8.3k views",
      readTime: "3 min read"
    },
    {
      title: "Managing your subscription",
      category: "Billing & Plans",
      views: "7.1k views",
      readTime: "6 min read"
    }
  ]

  const faqs = [
    {
      question: "How does the AI job matching work?",
      answer: "Our AI analyzes your skills, experience, preferences, and career goals to match you with relevant job opportunities. It considers factors like job requirements, company culture, location preferences, and salary expectations to provide personalized recommendations."
    },
    {
      question: "Is HotGigs.ai free to use?",
      answer: "Yes! Job seekers can use HotGigs.ai completely free. This includes creating a profile, searching jobs, applying to positions, and receiving AI-powered job recommendations. Employers have both free and premium plans available."
    },
    {
      question: "How do I improve my job match score?",
      answer: "To improve your match score: 1) Complete your profile with detailed skills and experience, 2) Keep your profile updated, 3) Be specific about your job preferences, 4) Add relevant certifications and education, 5) Use keywords from your target industry."
    },
    {
      question: "Can I apply to jobs directly through the platform?",
      answer: "Yes, you can apply to most jobs directly through HotGigs.ai. Some positions may redirect you to the company's website for application. We also provide application tracking so you can monitor your progress."
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Settings > Account > Delete Account. Please note that this action is permanent and cannot be undone. All your data will be permanently removed from our systems."
    },
    {
      question: "What should I do if I forgot my password?",
      answer: "Click 'Forgot Password' on the login page and enter your email address. We'll send you a password reset link. If you don't receive the email, check your spam folder or contact our support team."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our support team through: 1) Live chat (available 24/7), 2) Email at support@hotgigs.ai, 3) Phone at 1-800-HOTGIGS, or 4) Submit a ticket through your account dashboard."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security seriously. We use enterprise-grade encryption, comply with GDPR and other privacy regulations, and never sell your personal information to third parties. Your data is stored securely and only used to improve your job search experience."
    }
  ]

  const supportOptions = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      action: "Start Chat"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 2 hours",
      action: "Send Email"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      availability: "Mon-Fri, 9AM-6PM EST",
      action: "Call Now"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      availability: "Available anytime",
      action: "Watch Now"
    }
  ]

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Help Center
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              How can we help you?
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Find answers to your questions, learn how to use HotGigs.ai effectively, 
              and get the support you need to succeed.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find help articles organized by topic
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="mb-4">{category.icon}</div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{category.articles} articles</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-gray-600">
              Most viewed help articles this month
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {popularArticles.map((article, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="flex items-center gap-1">
                          <HelpCircle className="h-4 w-4" />
                          {article.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Need More Help?
            </h2>
            <p className="text-xl text-gray-600">
              Our support team is here to assist you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportOptions.map((option, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {option.icon}
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock className="h-4 w-4" />
                      {option.availability}
                    </div>
                    <Button className="w-full">{option.action}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Our support team is available 24/7 to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HelpCenterPage


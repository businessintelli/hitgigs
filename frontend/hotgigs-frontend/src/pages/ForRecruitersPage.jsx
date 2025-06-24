import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  UserCheck, 
  Brain, 
  Clock, 
  TrendingUp, 
  Network, 
  Briefcase, 
  Award, 
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Target
} from 'lucide-react'

const ForRecruitersPage = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Candidate Discovery",
      description: "Leverage advanced AI to discover hidden talent and passive candidates that traditional methods miss."
    },
    {
      icon: <UserCheck className="h-8 w-8 text-green-600" />,
      title: "Smart Candidate Screening",
      description: "Automatically screen and rank candidates based on job requirements, saving hours of manual review."
    },
    {
      icon: <Network className="h-8 w-8 text-purple-600" />,
      title: "Relationship Management",
      description: "Build and maintain relationships with candidates through our comprehensive CRM system."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Performance Analytics",
      description: "Track your placement success, client satisfaction, and revenue metrics with detailed analytics."
    },
    {
      icon: <Clock className="h-8 w-8 text-red-600" />,
      title: "Automated Workflows",
      description: "Streamline your recruitment process with automated follow-ups, interview scheduling, and status updates."
    },
    {
      icon: <Award className="h-8 w-8 text-indigo-600" />,
      title: "Client Portal",
      description: "Provide clients with real-time updates on candidate progress and maintain transparent communication."
    }
  ]

  const benefits = [
    "Increase placement rate by 40%",
    "Reduce time-per-placement by 50%",
    "Access to exclusive candidate pool",
    "Advanced search and filtering",
    "Automated candidate outreach",
    "Commission tracking and reporting"
  ]

  const tools = [
    {
      title: "Candidate Sourcing",
      description: "Advanced search across multiple platforms and databases",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Pipeline Management",
      description: "Visual pipeline to track candidates through each stage",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: "Client Management",
      description: "Comprehensive CRM for managing client relationships",
      icon: <Briefcase className="h-6 w-6" />
    },
    {
      title: "Communication Hub",
      description: "Centralized communication with candidates and clients",
      icon: <Users className="h-6 w-6" />
    }
  ]

  const testimonials = [
    {
      name: "Jessica Martinez",
      role: "Senior Technical Recruiter",
      company: "TalentPro Recruiting",
      quote: "HotGigs.ai has revolutionized how I source candidates. The AI recommendations are incredibly accurate.",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Executive Recruiter",
      company: "Elite Search Partners",
      quote: "I've increased my placement rate by 35% since using HotGigs.ai. The platform is a game-changer.",
      rating: 5
    },
    {
      name: "Rachel Kim",
      role: "Recruitment Consultant",
      company: "Global Talent Solutions",
      quote: "The automated workflows save me 10+ hours per week. I can focus on building relationships instead of admin work.",
      rating: 5
    }
  ]

  const stats = [
    { number: "40%", label: "Higher Placement Rate" },
    { number: "50%", label: "Faster Time-to-Fill" },
    { number: "10M+", label: "Candidate Profiles" },
    { number: "95%", label: "Client Satisfaction" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              For Recruiters
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Supercharge Your Recruitment with AI
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover, engage, and place top talent faster than ever before. Our AI-powered platform 
              gives you the edge you need to succeed in today's competitive recruitment landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Modern Recruiters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed to help you find, engage, and place the best candidates faster.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Complete Recruitment Toolkit
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Everything you need to manage your recruitment process from sourcing to placement.
              </p>
              <div className="space-y-6">
                {tools.map((tool, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                      <p className="text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Top Recruiters
            </h2>
            <p className="text-xl text-gray-600">
              See how recruiters are transforming their careers with HotGigs.ai
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>
                    {testimonial.role} at {testimonial.company}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Flexible Plans for Every Recruiter
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your recruitment volume and goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Solo</CardTitle>
                <div className="text-4xl font-bold text-gray-900">
                  $49<span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <CardDescription>Perfect for independent recruiters</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Up to 50 candidate searches/month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Basic AI matching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Email support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                </ul>
                <Button className="w-full">Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card className="border-purple-500 shadow-xl scale-105 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="text-4xl font-bold text-gray-900">
                  $149<span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <CardDescription>For growing recruitment practices</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Unlimited candidate searches</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Advanced AI matching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">CRM integration</span>
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Agency</CardTitle>
                <div className="text-4xl font-bold text-gray-900">
                  Custom
                </div>
                <CardDescription>For recruitment agencies and teams</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Everything in Professional</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Multi-user collaboration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">White-label options</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                </ul>
                <Button className="w-full">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Accelerate Your Recruitment?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of recruiters who are placing more candidates, faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ForRecruitersPage


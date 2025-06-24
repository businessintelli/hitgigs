import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Heart, 
  Users, 
  Globe, 
  Award, 
  TrendingUp,
  Lightbulb,
  Shield,
  ArrowRight,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react'

const AboutUsPage = () => {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Innovation First",
      description: "We constantly push the boundaries of what's possible in recruitment technology, leveraging AI to create smarter solutions."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "People-Centric",
      description: "Every feature we build is designed with real people in mind - both job seekers and employers deserve better experiences."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Trust & Transparency",
      description: "We believe in building trust through transparency, security, and ethical AI practices that benefit everyone."
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "Global Impact",
      description: "Our mission extends worldwide - connecting talent across borders and creating opportunities for everyone."
    }
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former VP of Engineering at LinkedIn with 15+ years in tech recruitment and AI.",
      image: "SC",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Ex-Google AI researcher specializing in machine learning and natural language processing.",
      image: "MR",
      social: { linkedin: "#", github: "#" }
    },
    {
      name: "Emily Johnson",
      role: "VP of Product",
      bio: "Product leader with 12+ years building user-centric platforms at Airbnb and Uber.",
      image: "EJ",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "David Kim",
      role: "Head of AI",
      bio: "PhD in Computer Science from Stanford, former research scientist at OpenAI.",
      image: "DK",
      social: { linkedin: "#", github: "#" }
    },
    {
      name: "Lisa Thompson",
      role: "VP of Sales",
      bio: "Sales leader with 10+ years helping companies scale their recruitment efforts.",
      image: "LT",
      social: { linkedin: "#" }
    },
    {
      name: "Alex Patel",
      role: "Head of Design",
      bio: "Design leader focused on creating intuitive, accessible experiences for all users.",
      image: "AP",
      social: { linkedin: "#", twitter: "#" }
    }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to revolutionize recruitment through AI"
    },
    {
      year: "2021",
      title: "First AI Model",
      description: "Launched our first AI-powered candidate matching algorithm"
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Raised $15M to accelerate product development and team growth"
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Expanded to serve companies and candidates in 50+ countries"
    },
    {
      year: "2024",
      title: "10M+ Users",
      description: "Reached 10 million users and 100,000+ successful placements"
    },
    {
      year: "2025",
      title: "AI Innovation",
      description: "Launched next-generation AI with advanced natural language processing"
    }
  ]

  const stats = [
    { number: "10M+", label: "Active Users" },
    { number: "100K+", label: "Successful Placements" },
    { number: "50+", label: "Countries Served" },
    { number: "95%", label: "Customer Satisfaction" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              About HotGigs.ai
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Connecting Talent with Opportunity
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              We're on a mission to transform how people find jobs and how companies find talent. 
              Through the power of AI, we're making recruitment more efficient, fair, and human.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Join Our Mission
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that finding the right job or the right candidate shouldn't be left to chance. 
                Traditional recruitment methods are outdated, inefficient, and often biased.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                That's why we built HotGigs.ai - to leverage artificial intelligence and create a more 
                intelligent, fair, and effective way to connect talent with opportunity.
              </p>
              <p className="text-lg text-gray-600">
                Our platform doesn't just match keywords; it understands skills, potential, and cultural fit 
                to create meaningful connections that benefit both candidates and employers.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="text-center">
                <Lightbulb className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  A world where every person finds meaningful work that matches their skills and aspirations, 
                  and every company builds teams that drive innovation and success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do, from product development to customer relationships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">{value.icon}</div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From startup to industry leader - here's how we've grown
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold min-w-[80px] text-center">
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind HotGigs.ai
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {member.image}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-semibold">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-3">
                    {member.social.linkedin && (
                      <Button variant="outline" size="sm">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    )}
                    {member.social.twitter && (
                      <Button variant="outline" size="sm">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                    {member.social.github && (
                      <Button variant="outline" size="sm">
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recognition & Awards
            </h2>
            <p className="text-xl text-gray-600">
              We're honored to be recognized by industry leaders
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Best AI Innovation</h3>
              <p className="text-sm text-gray-600">TechCrunch Awards 2024</p>
            </Card>
            <Card className="text-center p-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Fastest Growing Startup</h3>
              <p className="text-sm text-gray-600">Forbes 2024</p>
            </Card>
            <Card className="text-center p-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Best HR Technology</h3>
              <p className="text-sm text-gray-600">HR Tech Awards 2024</p>
            </Card>
            <Card className="text-center p-6">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Global Impact Award</h3>
              <p className="text-sm text-gray-600">World Economic Forum 2024</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Join Us in Shaping the Future of Work
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Whether you're looking for your next opportunity or building your dream team, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Explore Opportunities
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Partner With Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUsPage


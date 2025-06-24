import React from 'react'
import { Users, Target, Award, Globe, TrendingUp, Shield } from 'lucide-react'

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      description: 'Former VP of Engineering at Google with 15+ years in tech leadership.',
      icon: <Users size={24} color="#2563eb" />
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      description: 'AI/ML expert with PhD from Stanford, previously at OpenAI.',
      icon: <Target size={24} color="#16a34a" />
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      description: 'Product strategy leader with experience at LinkedIn and Microsoft.',
      icon: <Award size={24} color="#9333ea" />
    }
  ]

  const stats = [
    { label: 'Active Job Seekers', value: '50,000+', icon: <Users size={24} /> },
    { label: 'Partner Companies', value: '2,500+', icon: <Globe size={24} /> },
    { label: 'Successful Placements', value: '15,000+', icon: <TrendingUp size={24} /> },
    { label: 'Countries Served', value: '25+', icon: <Shield size={24} /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              About <span className="text-blue-600">HotGigs.ai</span>
            </h1>
            <p className="text-xl text-gray-600 mt-6">
              We're revolutionizing the job search experience by combining artificial intelligence 
              with human expertise to connect talented professionals with their dream opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At HotGigs.ai, we believe that finding the right job shouldn't be a matter of luck. 
                Our mission is to democratize access to career opportunities by leveraging cutting-edge 
                AI technology to match candidates with positions that truly fit their skills, 
                experience, and aspirations.
              </p>
              <p className="text-lg text-gray-600">
                We're building a future where every professional can find meaningful work that 
                aligns with their goals, and every company can discover the talent they need to thrive.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="card text-center">
                  <div className="icon-container bg-blue-100">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at HotGigs.ai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="icon-container bg-blue-100">
                <TrendingUp size={24} color="#2563eb" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what's possible in recruitment 
                technology, always staying ahead of industry trends.
              </p>
            </div>

            <div className="card text-center">
              <div className="icon-container bg-green-100">
                <Shield size={24} color="#16a34a" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust</h3>
              <p className="text-gray-600">
                We prioritize transparency, data security, and ethical AI practices 
                to build lasting trust with our users and partners.
              </p>
            </div>

            <div className="card text-center">
              <div className="icon-container bg-purple-100">
                <Users size={24} color="#9333ea" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Empowerment</h3>
              <p className="text-gray-600">
                We believe in empowering individuals to take control of their careers 
                and helping companies build diverse, talented teams.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the experienced leaders driving HotGigs.ai forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="icon-container bg-gray-100">
                  {member.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have discovered their perfect job match with HotGigs.ai
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-lg" style={{backgroundColor: '#ffffff', color: '#2563eb'}}>
              Start Your Journey
            </button>
            <button className="btn btn-lg" style={{border: '2px solid #ffffff', color: '#ffffff', backgroundColor: 'transparent'}}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage


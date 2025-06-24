import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: <Mail size={24} color="#2563eb" />,
      title: 'Email Us',
      details: 'support@hotgigs.ai',
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone size={24} color="#16a34a" />,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri 9AM-6PM PST'
    },
    {
      icon: <MapPin size={24} color="#9333ea" />,
      title: 'Visit Us',
      details: 'San Francisco, CA',
      description: '123 Tech Street, Suite 100'
    },
    {
      icon: <MessageCircle size={24} color="#d97706" />,
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Chat with our support team'
    }
  ]

  const faqs = [
    {
      question: 'How does HotGigs.ai matching work?',
      answer: 'Our AI analyzes your skills, experience, and preferences to match you with relevant job opportunities from our partner companies.'
    },
    {
      question: 'Is HotGigs.ai free to use?',
      answer: 'Yes! Job seekers can use our platform completely free. We only charge companies for premium recruitment services.'
    },
    {
      question: 'How do I update my profile?',
      answer: 'Simply log into your account and navigate to the profile section where you can update your information, skills, and preferences.'
    },
    {
      question: 'Can I apply to multiple jobs?',
      answer: 'Absolutely! You can apply to as many positions as you like. Our system will track all your applications in your dashboard.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Get in <span className="text-blue-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 mt-6">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="card text-center">
                <div className="icon-container bg-gray-100">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-blue-600 font-medium mb-1">{info.details}</p>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Form and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="input"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div>
              {/* Office Hours */}
              <div className="card mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Office Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>

              {/* Global Presence */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe size={20} />
                  Global Presence
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">North America</h4>
                    <p className="text-sm text-gray-600">San Francisco, New York, Toronto</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Europe</h4>
                    <p className="text-sm text-gray-600">London, Berlin, Amsterdam</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Asia Pacific</h4>
                    <p className="text-sm text-gray-600">Singapore, Tokyo, Sydney</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about HotGigs.ai
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage


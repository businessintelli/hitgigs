import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  Globe, 
  Mail,
  Calendar,
  FileText
} from 'lucide-react'

const PrivacyPolicyPage = () => {
  const lastUpdated = "January 15, 2025"

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <FileText className="h-5 w-5" />,
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, such as when you create an account, update your profile, apply for jobs, or contact us. This may include your name, email address, phone number, resume, work history, education, skills, and preferences."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you use our services, including your IP address, browser type, operating system, referring URLs, access times, and pages viewed."
        },
        {
          subtitle: "Device Information",
          text: "We may collect information about the device you use to access our services, including hardware model, operating system version, unique device identifiers, and mobile network information."
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: <UserCheck className="h-5 w-5" />,
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide, maintain, and improve our services, including matching you with relevant job opportunities and helping employers find suitable candidates."
        },
        {
          subtitle: "Communication",
          text: "We may use your information to send you technical notices, updates, security alerts, and support messages, as well as job recommendations and promotional communications."
        },
        {
          subtitle: "Personalization",
          text: "We use AI and machine learning to personalize your experience, improve our matching algorithms, and provide more relevant job recommendations."
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: <Globe className="h-5 w-5" />,
      content: [
        {
          subtitle: "With Employers",
          text: "When you apply for a job, we share your profile information and application materials with the relevant employer. You control what information is included in your public profile."
        },
        {
          subtitle: "Service Providers",
          text: "We may share your information with third-party service providers who perform services on our behalf, such as hosting, analytics, and customer support."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of HotGigs.ai, our users, or others."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption to protect sensitive information during transmission and storage. All data is encrypted both in transit and at rest."
        },
        {
          subtitle: "Access Controls",
          text: "We limit access to your personal information to employees and contractors who need it to perform their job functions and have agreed to keep it confidential."
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      icon: <Eye className="h-5 w-5" />,
      content: [
        {
          subtitle: "Access and Update",
          text: "You can access and update your personal information through your account settings. You can also request a copy of the personal information we hold about you."
        },
        {
          subtitle: "Data Portability",
          text: "You have the right to receive your personal information in a structured, commonly used, and machine-readable format and to transmit it to another service."
        },
        {
          subtitle: "Deletion",
          text: "You can request that we delete your personal information, subject to certain exceptions such as legal requirements or legitimate business interests."
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: <Shield className="h-5 w-5" />,
      content: [
        {
          subtitle: "Cookie Usage",
          text: "We use cookies and similar tracking technologies to collect and store information about your interactions with our services. This helps us improve functionality and provide personalized experiences."
        },
        {
          subtitle: "Cookie Controls",
          text: "You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our services."
        },
        {
          subtitle: "Third-Party Tracking",
          text: "We may allow third-party analytics and advertising partners to collect information about your online activities through cookies and similar technologies."
        }
      ]
    }
  ]

  const principles = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Transparency",
      description: "We're clear about what data we collect and how we use it"
    },
    {
      icon: <Lock className="h-8 w-8 text-green-600" />,
      title: "Security",
      description: "Your data is protected with enterprise-grade security measures"
    },
    {
      icon: <UserCheck className="h-8 w-8 text-purple-600" />,
      title: "Control",
      description: "You have full control over your personal information"
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: "Compliance",
      description: "We comply with GDPR, CCPA, and other privacy regulations"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Privacy Policy
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Your Privacy Matters
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              We're committed to protecting your personal information and being transparent 
              about how we collect, use, and share your data.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <Calendar className="h-5 w-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Privacy Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide how we handle your personal information
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">{principle.icon}</div>
                  <CardTitle className="text-xl">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {principle.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
              <p className="text-lg text-gray-600">
                This Privacy Policy describes how HotGigs.ai ("we," "our," or "us") collects, uses, 
                and shares information about you when you use our website, mobile application, and 
                related services (collectively, the "Services").
              </p>
            </div>

            {/* Table of Contents */}
            <Card className="mb-12 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {sections.map((section, index) => (
                    <a
                      key={index}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {section.icon}
                      <span className="text-blue-600 hover:text-blue-800">{section.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policy Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={index} id={section.id}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    {section.icon}
                    {section.title}
                  </h3>
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">{item.subtitle}</h4>
                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Sections */}
            <div className="mt-16 space-y-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">International Data Transfers</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure that such transfers comply with applicable data protection laws and that 
                  appropriate safeguards are in place to protect your information.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Data Retention</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to provide our services, 
                  comply with legal obligations, resolve disputes, and enforce our agreements. When we 
                  no longer need your information, we securely delete or anonymize it.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Children's Privacy</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our services are not intended for children under 16 years of age. We do not knowingly 
                  collect personal information from children under 16. If we become aware that we have 
                  collected personal information from a child under 16, we will take steps to delete 
                  such information.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Changes to This Policy</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new Privacy Policy on our website and updating 
                  the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>privacy@hotgigs.ai</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-semibold">Data Protection Officer</p>
                        <p>HotGigs.ai, Inc.</p>
                        <p>123 Innovation Drive</p>
                        <p>San Francisco, CA 94105</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GDPR Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">GDPR Compliance</CardTitle>
                <CardDescription>
                  Your rights under the General Data Protection Regulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  If you are located in the European Economic Area (EEA), you have certain rights 
                  under the General Data Protection Regulation (GDPR), including:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The right to access your personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The right to rectify inaccurate personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The right to erase your personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The right to restrict processing of your personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The right to data portability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The right to object to processing</span>
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  To exercise these rights, please contact us at privacy@hotgigs.ai. We will respond 
                  to your request within 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicyPage


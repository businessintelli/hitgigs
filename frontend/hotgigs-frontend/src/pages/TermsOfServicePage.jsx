import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle, 
  Users, 
  CreditCard,
  Calendar,
  Mail,
  Gavel
} from 'lucide-react'

const TermsOfServicePage = () => {
  const lastUpdated = "January 15, 2025"

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <FileText className="h-5 w-5" />,
      content: "By accessing or using HotGigs.ai's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services."
    },
    {
      id: "description",
      title: "Description of Service",
      icon: <Users className="h-5 w-5" />,
      content: "HotGigs.ai is an AI-powered job matching platform that connects job seekers with employers. Our services include job posting, candidate matching, application management, and related recruitment tools. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time."
    },
    {
      id: "user-accounts",
      title: "User Accounts and Registration",
      icon: <Shield className="h-5 w-5" />,
      content: "To use certain features of our services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration and keep your account information updated."
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: <Scale className="h-5 w-5" />,
      content: "You agree not to use our services for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services. Prohibited activities include but are not limited to: posting false or misleading information, harassment, spam, unauthorized access attempts, and violation of intellectual property rights."
    },
    {
      id: "content-policy",
      title: "Content and Intellectual Property",
      icon: <FileText className="h-5 w-5" />,
      content: "You retain ownership of content you submit to our platform, but grant us a license to use, modify, and distribute such content as necessary to provide our services. You represent that you have the right to submit such content and that it does not violate any third-party rights."
    },
    {
      id: "payment-terms",
      title: "Payment and Billing",
      icon: <CreditCard className="h-5 w-5" />,
      content: "Certain features of our services require payment. By purchasing a subscription or service, you agree to pay all applicable fees. All payments are non-refundable unless otherwise specified. We reserve the right to change our pricing at any time with appropriate notice."
    },
    {
      id: "privacy",
      title: "Privacy and Data Protection",
      icon: <Shield className="h-5 w-5" />,
      content: "Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to the collection and use of your information as described in our Privacy Policy."
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: "Our services are provided 'as is' without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any content or job matches. We are not responsible for the actions of users or the outcome of any employment relationships formed through our platform."
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <Scale className="h-5 w-5" />,
      content: "To the maximum extent permitted by law, HotGigs.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of our services."
    },
    {
      id: "termination",
      title: "Termination",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: "We may terminate or suspend your account and access to our services at any time, with or without notice, for any reason, including violation of these Terms. Upon termination, your right to use our services will cease immediately, and we may delete your account and data."
    }
  ]

  const keyPoints = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "User Responsibilities",
      description: "Maintain account security and provide accurate information"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Data Protection",
      description: "Your data is protected under our comprehensive Privacy Policy"
    },
    {
      icon: <Scale className="h-8 w-8 text-purple-600" />,
      title: "Fair Use",
      description: "Use our platform responsibly and respect other users"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-orange-600" />,
      title: "Transparent Billing",
      description: "Clear pricing with no hidden fees or surprise charges"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Terms of Service
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              These terms govern your use of HotGigs.ai and outline the rights and responsibilities 
              of all users of our platform.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <Calendar className="h-5 w-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Points
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here are the most important aspects of our Terms of Service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyPoints.map((point, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">{point.icon}</div>
                  <CardTitle className="text-xl">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {point.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service Agreement</h2>
              <p className="text-lg text-gray-600">
                This Terms of Service Agreement ("Agreement") is entered into between you and 
                HotGigs.ai, Inc. ("Company," "we," "our," or "us") and governs your use of our 
                website, mobile application, and related services.
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

            {/* Terms Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={index} id={section.id}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    {section.icon}
                    {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Additional Detailed Sections */}
            <div className="mt-16 space-y-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Prohibited Activities</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When using our services, you agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="space-y-2 text-gray-600 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Post false, misleading, or discriminatory job listings or profile information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Harass, abuse, or harm other users of the platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Attempt to gain unauthorized access to our systems or other users' accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Use automated tools to scrape or collect data from our platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Violate any applicable laws or regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Infringe upon the intellectual property rights of others</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">User-Generated Content</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You are solely responsible for any content you submit, post, or display on our platform. 
                  By submitting content, you represent and warrant that:
                </p>
                <ul className="space-y-2 text-gray-600 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>You own or have the necessary rights to use and authorize us to use the content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The content is accurate and not misleading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The content does not violate any third-party rights or applicable laws</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>The content is not defamatory, obscene, or otherwise objectionable</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Indemnification</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You agree to indemnify, defend, and hold harmless HotGigs.ai, its officers, directors, 
                  employees, and agents from and against any claims, liabilities, damages, losses, and 
                  expenses arising out of or in any way connected with your use of our services or 
                  violation of these Terms.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Governing Law and Dispute Resolution</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the 
                  State of California, without regard to its conflict of law provisions. Any disputes 
                  arising under these Terms shall be resolved through binding arbitration in accordance 
                  with the rules of the American Arbitration Association.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Changes to Terms</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. We will notify users of 
                  material changes by posting the updated Terms on our website and updating the 
                  "Last Updated" date. Your continued use of our services after such changes 
                  constitutes acceptance of the new Terms.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Severability</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If any provision of these Terms is found to be unenforceable or invalid, that 
                  provision will be limited or eliminated to the minimum extent necessary so that 
                  these Terms will otherwise remain in full force and effect.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>legal@hotgigs.ai</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Gavel className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-semibold">Legal Department</p>
                        <p>HotGigs.ai, Inc.</p>
                        <p>123 Innovation Drive</p>
                        <p>San Francisco, CA 94105</p>
                        <p>United States</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl border-l-4 border-l-orange-500">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl">Important Notice</CardTitle>
                <CardDescription>
                  Please read these terms carefully before using our services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  By using HotGigs.ai, you acknowledge that you have read, understood, and agree to be 
                  bound by these Terms of Service. If you do not agree to these terms, please do not 
                  use our services.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  These terms constitute a legally binding agreement between you and HotGigs.ai. 
                  We recommend that you print or save a copy of these terms for your records.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  For questions about these terms or our services, please contact our legal team 
                  at legal@hotgigs.ai.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsOfServicePage


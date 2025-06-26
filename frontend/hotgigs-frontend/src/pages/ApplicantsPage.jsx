import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc, 
  ChevronDown, 
  ChevronRight, 
  X, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  Send, 
  Copy, 
  ExternalLink, 
  FileText, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  UserPlus, 
  MessageSquare, 
  Video, 
  FileDown, 
  Bookmark, 
  Share2, 
  TrendingUp, 
  Target, 
  Zap, 
  Bot, 
  Sparkles, 
  Activity, 
  BarChart3, 
  PieChart, 
  Users, 
  Building, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Globe, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Archive, 
  Folder, 
  Tag, 
  Filter as FilterIcon, 
  Settings, 
  Plus, 
  Minus 
} from 'lucide-react'

const ApplicantsPage = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState([])
  const [filteredApplicants, setFilteredApplicants] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // list or grid
  const [showFilters, setShowFilters] = useState(false)
  const [selectedApplicants, setSelectedApplicants] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [jobDetails, setJobDetails] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    experience: 'all',
    location: '',
    skills: '',
    education: 'all',
    availability: 'all',
    salaryRange: 'all',
    rating: 'all',
    source: 'all',
    appliedDate: 'all'
  })
  
  const [sortBy, setSortBy] = useState('date_desc')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadJobDetails()
    loadApplicants()
  }, [jobId])

  useEffect(() => {
    filterAndSortApplicants()
  }, [applicants, filters, sortBy, searchTerm])

  const loadJobDetails = async () => {
    try {
      // Simulate API call to load job details
      const jobData = {
        id: jobId,
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        department: 'Engineering',
        location: 'San Francisco, CA',
        postedDate: '2024-01-15',
        status: 'Active',
        totalApplications: 45,
        newApplications: 8,
        shortlisted: 12,
        interviewed: 5,
        hired: 1,
        rejected: 19
      }
      setJobDetails(jobData)
    } catch (error) {
      console.error('Failed to load job details:', error)
    }
  }

  const loadApplicants = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to load applicants
      const sampleApplicants = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          currentTitle: 'Senior Frontend Developer',
          currentCompany: 'StartupXYZ',
          experience: '6 years',
          education: 'BS Computer Science - Stanford University',
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'AWS', 'GraphQL', 'Redux', 'Next.js'],
          expectedSalary: 150000,
          currentSalary: 130000,
          noticePeriod: '2 weeks',
          availability: 'Immediate',
          status: 'New',
          rating: 4.5,
          matchScore: 92,
          appliedDate: '2024-01-20',
          lastActivity: '2024-01-20',
          source: 'Company Website',
          resumeUrl: '/resumes/john-smith-resume.pdf',
          portfolioUrl: 'https://johnsmith.dev',
          linkedinUrl: 'https://linkedin.com/in/johnsmith',
          githubUrl: 'https://github.com/johnsmith',
          coverLetter: 'I am excited to apply for the Senior React Developer position...',
          notes: [],
          tags: ['Frontend Expert', 'React Specialist', 'Strong Portfolio'],
          interviews: [],
          assessments: [
            {
              type: 'Technical Assessment',
              score: 85,
              completedDate: '2024-01-21',
              status: 'Completed'
            }
          ],
          documents: [
            { name: 'Resume', type: 'pdf', url: '/resumes/john-smith-resume.pdf', uploadDate: '2024-01-20' },
            { name: 'Portfolio', type: 'link', url: 'https://johnsmith.dev', uploadDate: '2024-01-20' }
          ],
          timeline: [
            { date: '2024-01-20', action: 'Applied', details: 'Application submitted via company website' },
            { date: '2024-01-21', action: 'Assessment Sent', details: 'Technical assessment sent to candidate' },
            { date: '2024-01-21', action: 'Assessment Completed', details: 'Scored 85/100 on technical assessment' }
          ],
          preferences: {
            remoteWork: true,
            relocation: false,
            travelWillingness: 'Minimal',
            workingHours: 'Flexible'
          },
          background: {
            yearsOfExperience: 6,
            previousCompanies: ['StartupXYZ', 'TechCorp', 'DevStudio'],
            industries: ['Technology', 'E-commerce', 'SaaS'],
            teamSize: '5-10 people',
            managementExperience: false
          },
          personalInfo: {
            age: 28,
            gender: 'Male',
            nationality: 'American',
            languages: ['English', 'Spanish'],
            visaStatus: 'Citizen',
            securityClearance: false
          },
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/johnsmith',
            github: 'https://github.com/johnsmith',
            twitter: 'https://twitter.com/johnsmith',
            portfolio: 'https://johnsmith.dev'
          },
          aiInsights: {
            strengths: ['Strong React expertise', 'Excellent portfolio', 'Good cultural fit'],
            concerns: ['Salary expectations might be high', 'Limited backend experience'],
            recommendations: ['Schedule technical interview', 'Discuss salary expectations early'],
            culturalFit: 85,
            technicalFit: 92,
            overallRecommendation: 'Strong Hire'
          }
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 234-5678',
          location: 'New York, NY',
          currentTitle: 'Full Stack Developer',
          currentCompany: 'BigTech Corp',
          experience: '4 years',
          education: 'MS Computer Science - MIT',
          skills: ['React', 'Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS'],
          expectedSalary: 140000,
          currentSalary: 120000,
          noticePeriod: '4 weeks',
          availability: '2 weeks',
          status: 'Shortlisted',
          rating: 4.8,
          matchScore: 88,
          appliedDate: '2024-01-18',
          lastActivity: '2024-01-22',
          source: 'LinkedIn',
          resumeUrl: '/resumes/sarah-johnson-resume.pdf',
          portfolioUrl: 'https://sarahjohnson.dev',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          githubUrl: 'https://github.com/sarahjohnson',
          coverLetter: 'With my full-stack development experience and passion for React...',
          notes: [
            { date: '2024-01-22', author: 'HR Manager', content: 'Excellent technical background, moving to interview stage' }
          ],
          tags: ['Full Stack', 'MIT Graduate', 'BigTech Experience'],
          interviews: [
            {
              type: 'Phone Screening',
              date: '2024-01-23',
              time: '2:00 PM',
              interviewer: 'Mike Chen',
              status: 'Scheduled'
            }
          ],
          assessments: [
            {
              type: 'Coding Challenge',
              score: 92,
              completedDate: '2024-01-19',
              status: 'Completed'
            }
          ],
          documents: [
            { name: 'Resume', type: 'pdf', url: '/resumes/sarah-johnson-resume.pdf', uploadDate: '2024-01-18' },
            { name: 'Cover Letter', type: 'pdf', url: '/covers/sarah-johnson-cover.pdf', uploadDate: '2024-01-18' },
            { name: 'Portfolio', type: 'link', url: 'https://sarahjohnson.dev', uploadDate: '2024-01-18' }
          ],
          timeline: [
            { date: '2024-01-18', action: 'Applied', details: 'Application submitted via LinkedIn' },
            { date: '2024-01-19', action: 'Coding Challenge Sent', details: 'Full-stack coding challenge sent' },
            { date: '2024-01-19', action: 'Challenge Completed', details: 'Scored 92/100 on coding challenge' },
            { date: '2024-01-22', action: 'Shortlisted', details: 'Moved to shortlist for phone screening' },
            { date: '2024-01-23', action: 'Interview Scheduled', details: 'Phone screening scheduled with Mike Chen' }
          ],
          preferences: {
            remoteWork: true,
            relocation: true,
            travelWillingness: 'Moderate',
            workingHours: 'Standard'
          },
          background: {
            yearsOfExperience: 4,
            previousCompanies: ['BigTech Corp', 'StartupABC'],
            industries: ['Technology', 'Finance', 'Healthcare'],
            teamSize: '10-20 people',
            managementExperience: false
          },
          personalInfo: {
            age: 26,
            gender: 'Female',
            nationality: 'American',
            languages: ['English', 'French'],
            visaStatus: 'Citizen',
            securityClearance: false
          },
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            github: 'https://github.com/sarahjohnson',
            portfolio: 'https://sarahjohnson.dev'
          },
          aiInsights: {
            strengths: ['Strong technical skills', 'MIT education', 'BigTech experience'],
            concerns: ['Might be overqualified', 'Relocation requirements'],
            recommendations: ['Fast-track interview process', 'Discuss growth opportunities'],
            culturalFit: 90,
            technicalFit: 88,
            overallRecommendation: 'Strong Hire'
          }
        },
        {
          id: 3,
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          phone: '+1 (555) 345-6789',
          location: 'Seattle, WA',
          currentTitle: 'React Developer',
          currentCompany: 'WebDev Solutions',
          experience: '3 years',
          education: 'BS Software Engineering - University of Washington',
          skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Git', 'Jest', 'Webpack'],
          expectedSalary: 110000,
          currentSalary: 95000,
          noticePeriod: '2 weeks',
          availability: 'Immediate',
          status: 'Interviewed',
          rating: 4.2,
          matchScore: 78,
          appliedDate: '2024-01-15',
          lastActivity: '2024-01-24',
          source: 'Indeed',
          resumeUrl: '/resumes/michael-chen-resume.pdf',
          portfolioUrl: 'https://michaelchen.dev',
          linkedinUrl: 'https://linkedin.com/in/michaelchen',
          githubUrl: 'https://github.com/michaelchen',
          coverLetter: 'I am passionate about React development and would love to contribute...',
          notes: [
            { date: '2024-01-24', author: 'Tech Lead', content: 'Good technical skills but needs more senior-level experience' }
          ],
          tags: ['React Developer', 'Local Candidate', 'Junior-Mid Level'],
          interviews: [
            {
              type: 'Technical Interview',
              date: '2024-01-24',
              time: '10:00 AM',
              interviewer: 'Alex Johnson',
              status: 'Completed',
              feedback: 'Good technical foundation but lacks senior-level experience',
              rating: 3.5
            }
          ],
          assessments: [
            {
              type: 'React Assessment',
              score: 78,
              completedDate: '2024-01-16',
              status: 'Completed'
            }
          ],
          documents: [
            { name: 'Resume', type: 'pdf', url: '/resumes/michael-chen-resume.pdf', uploadDate: '2024-01-15' },
            { name: 'Portfolio', type: 'link', url: 'https://michaelchen.dev', uploadDate: '2024-01-15' }
          ],
          timeline: [
            { date: '2024-01-15', action: 'Applied', details: 'Application submitted via Indeed' },
            { date: '2024-01-16', action: 'Assessment Sent', details: 'React-specific assessment sent' },
            { date: '2024-01-16', action: 'Assessment Completed', details: 'Scored 78/100 on React assessment' },
            { date: '2024-01-20', action: 'Interview Scheduled', details: 'Technical interview scheduled' },
            { date: '2024-01-24', action: 'Interview Completed', details: 'Technical interview completed with mixed feedback' }
          ],
          preferences: {
            remoteWork: false,
            relocation: false,
            travelWillingness: 'None',
            workingHours: 'Standard'
          },
          background: {
            yearsOfExperience: 3,
            previousCompanies: ['WebDev Solutions', 'FreelanceWork'],
            industries: ['Technology', 'E-commerce'],
            teamSize: '3-5 people',
            managementExperience: false
          },
          personalInfo: {
            age: 25,
            gender: 'Male',
            nationality: 'American',
            languages: ['English', 'Mandarin'],
            visaStatus: 'Citizen',
            securityClearance: false
          },
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/michaelchen',
            github: 'https://github.com/michaelchen',
            portfolio: 'https://michaelchen.dev'
          },
          aiInsights: {
            strengths: ['Local candidate', 'Good React foundation', 'Eager to learn'],
            concerns: ['Limited senior experience', 'Narrow skill set', 'May not meet requirements'],
            recommendations: ['Consider for mid-level position', 'Provide mentorship opportunities'],
            culturalFit: 80,
            technicalFit: 65,
            overallRecommendation: 'Consider with Reservations'
          }
        },
        {
          id: 4,
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 456-7890',
          location: 'Austin, TX',
          currentTitle: 'Senior Frontend Engineer',
          currentCompany: 'InnovateTech',
          experience: '7 years',
          education: 'MS Computer Science - UT Austin',
          skills: ['React', 'Vue.js', 'Angular', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
          expectedSalary: 160000,
          currentSalary: 145000,
          noticePeriod: '4 weeks',
          availability: '1 month',
          status: 'Offer Extended',
          rating: 4.9,
          matchScore: 95,
          appliedDate: '2024-01-12',
          lastActivity: '2024-01-25',
          source: 'Referral',
          resumeUrl: '/resumes/emily-rodriguez-resume.pdf',
          portfolioUrl: 'https://emilyrodriguez.dev',
          linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
          githubUrl: 'https://github.com/emilyrodriguez',
          coverLetter: 'I was referred by my colleague and am very interested in this opportunity...',
          notes: [
            { date: '2024-01-25', author: 'Hiring Manager', content: 'Excellent candidate, offer extended. Waiting for response.' }
          ],
          tags: ['Senior Level', 'Referral', 'Top Candidate', 'Offer Extended'],
          interviews: [
            {
              type: 'Phone Screening',
              date: '2024-01-15',
              time: '3:00 PM',
              interviewer: 'Sarah Wilson',
              status: 'Completed',
              feedback: 'Excellent communication and technical knowledge',
              rating: 5.0
            },
            {
              type: 'Technical Interview',
              date: '2024-01-18',
              time: '2:00 PM',
              interviewer: 'David Kim',
              status: 'Completed',
              feedback: 'Outstanding technical skills and problem-solving ability',
              rating: 4.8
            },
            {
              type: 'Cultural Fit',
              date: '2024-01-22',
              time: '11:00 AM',
              interviewer: 'Lisa Wang',
              status: 'Completed',
              feedback: 'Perfect cultural fit, strong team player',
              rating: 5.0
            },
            {
              type: 'Final Interview',
              date: '2024-01-24',
              time: '4:00 PM',
              interviewer: 'CTO',
              status: 'Completed',
              feedback: 'Impressed with leadership potential and technical vision',
              rating: 4.9
            }
          ],
          assessments: [
            {
              type: 'System Design',
              score: 95,
              completedDate: '2024-01-17',
              status: 'Completed'
            },
            {
              type: 'Coding Challenge',
              score: 98,
              completedDate: '2024-01-16',
              status: 'Completed'
            }
          ],
          documents: [
            { name: 'Resume', type: 'pdf', url: '/resumes/emily-rodriguez-resume.pdf', uploadDate: '2024-01-12' },
            { name: 'Cover Letter', type: 'pdf', url: '/covers/emily-rodriguez-cover.pdf', uploadDate: '2024-01-12' },
            { name: 'Portfolio', type: 'link', url: 'https://emilyrodriguez.dev', uploadDate: '2024-01-12' },
            { name: 'References', type: 'pdf', url: '/references/emily-rodriguez-refs.pdf', uploadDate: '2024-01-20' }
          ],
          timeline: [
            { date: '2024-01-12', action: 'Applied', details: 'Application submitted via employee referral' },
            { date: '2024-01-13', action: 'Application Reviewed', details: 'Fast-tracked due to referral' },
            { date: '2024-01-15', action: 'Phone Screening', details: 'Excellent phone screening with Sarah Wilson' },
            { date: '2024-01-16', action: 'Assessments Sent', details: 'Coding challenge and system design sent' },
            { date: '2024-01-17', action: 'Assessments Completed', details: 'Outstanding scores on all assessments' },
            { date: '2024-01-18', action: 'Technical Interview', details: 'Impressive technical interview performance' },
            { date: '2024-01-22', action: 'Cultural Fit Interview', details: 'Perfect cultural alignment demonstrated' },
            { date: '2024-01-24', action: 'Final Interview', details: 'CTO interview completed successfully' },
            { date: '2024-01-25', action: 'Offer Extended', details: 'Competitive offer package extended' }
          ],
          preferences: {
            remoteWork: true,
            relocation: true,
            travelWillingness: 'High',
            workingHours: 'Flexible'
          },
          background: {
            yearsOfExperience: 7,
            previousCompanies: ['InnovateTech', 'TechGiant', 'StartupUnicorn'],
            industries: ['Technology', 'FinTech', 'E-commerce', 'SaaS'],
            teamSize: '15-25 people',
            managementExperience: true
          },
          personalInfo: {
            age: 30,
            gender: 'Female',
            nationality: 'American',
            languages: ['English', 'Spanish', 'Portuguese'],
            visaStatus: 'Citizen',
            securityClearance: false
          },
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/emilyrodriguez',
            github: 'https://github.com/emilyrodriguez',
            twitter: 'https://twitter.com/emilyrodriguez',
            portfolio: 'https://emilyrodriguez.dev'
          },
          aiInsights: {
            strengths: ['Exceptional technical skills', 'Strong leadership potential', 'Perfect cultural fit', 'Employee referral'],
            concerns: ['High salary expectations', 'Might be overqualified for some aspects'],
            recommendations: ['Extend competitive offer immediately', 'Discuss growth and leadership opportunities'],
            culturalFit: 98,
            technicalFit: 95,
            overallRecommendation: 'Must Hire'
          }
        },
        {
          id: 5,
          name: 'David Wilson',
          email: 'david.wilson@email.com',
          phone: '+1 (555) 567-8901',
          location: 'Denver, CO',
          currentTitle: 'Frontend Developer',
          currentCompany: 'DesignTech',
          experience: '2 years',
          education: 'BS Computer Science - Colorado State University',
          skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'jQuery'],
          expectedSalary: 85000,
          currentSalary: 70000,
          noticePeriod: '2 weeks',
          availability: 'Immediate',
          status: 'Rejected',
          rating: 3.2,
          matchScore: 45,
          appliedDate: '2024-01-10',
          lastActivity: '2024-01-20',
          source: 'Company Website',
          resumeUrl: '/resumes/david-wilson-resume.pdf',
          portfolioUrl: 'https://davidwilson.dev',
          linkedinUrl: 'https://linkedin.com/in/davidwilson',
          githubUrl: 'https://github.com/davidwilson',
          coverLetter: 'I am a junior developer looking to grow my skills...',
          notes: [
            { date: '2024-01-20', author: 'HR Manager', content: 'Skills do not match senior-level requirements. Rejected.' }
          ],
          tags: ['Junior Level', 'Skills Gap', 'Rejected'],
          interviews: [],
          assessments: [
            {
              type: 'Basic Assessment',
              score: 45,
              completedDate: '2024-01-11',
              status: 'Completed'
            }
          ],
          documents: [
            { name: 'Resume', type: 'pdf', url: '/resumes/david-wilson-resume.pdf', uploadDate: '2024-01-10' }
          ],
          timeline: [
            { date: '2024-01-10', action: 'Applied', details: 'Application submitted via company website' },
            { date: '2024-01-11', action: 'Assessment Sent', details: 'Basic skills assessment sent' },
            { date: '2024-01-11', action: 'Assessment Completed', details: 'Low score on skills assessment' },
            { date: '2024-01-15', action: 'Application Reviewed', details: 'Skills gap identified during review' },
            { date: '2024-01-20', action: 'Rejected', details: 'Does not meet senior-level requirements' }
          ],
          preferences: {
            remoteWork: false,
            relocation: false,
            travelWillingness: 'None',
            workingHours: 'Standard'
          },
          background: {
            yearsOfExperience: 2,
            previousCompanies: ['DesignTech', 'FreelanceWork'],
            industries: ['Technology', 'Design'],
            teamSize: '2-5 people',
            managementExperience: false
          },
          personalInfo: {
            age: 24,
            gender: 'Male',
            nationality: 'American',
            languages: ['English'],
            visaStatus: 'Citizen',
            securityClearance: false
          },
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/davidwilson',
            github: 'https://github.com/davidwilson',
            portfolio: 'https://davidwilson.dev'
          },
          aiInsights: {
            strengths: ['Eager to learn', 'Local candidate', 'Good attitude'],
            concerns: ['Insufficient experience', 'Limited skill set', 'Does not meet requirements'],
            recommendations: ['Consider for junior positions', 'Provide feedback for improvement'],
            culturalFit: 70,
            technicalFit: 35,
            overallRecommendation: 'Not Suitable'
          }
        }
      ]

      setApplicants(sampleApplicants)
    } catch (error) {
      console.error('Failed to load applicants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortApplicants = () => {
    let filtered = [...applicants]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(applicant =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.currentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        applicant.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(applicant => applicant.status === filters.status)
    }

    // Apply experience filter
    if (filters.experience !== 'all') {
      const expYears = parseInt(filters.experience)
      filtered = filtered.filter(applicant => {
        const applicantExp = parseInt(applicant.experience)
        if (filters.experience === '0-2') return applicantExp <= 2
        if (filters.experience === '3-5') return applicantExp >= 3 && applicantExp <= 5
        if (filters.experience === '6-10') return applicantExp >= 6 && applicantExp <= 10
        if (filters.experience === '10+') return applicantExp > 10
        return true
      })
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(applicant =>
        applicant.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Apply skills filter
    if (filters.skills) {
      const skillsArray = filters.skills.toLowerCase().split(',').map(s => s.trim())
      filtered = filtered.filter(applicant =>
        skillsArray.some(skill =>
          applicant.skills.some(applicantSkill => applicantSkill.toLowerCase().includes(skill))
        )
      )
    }

    // Apply education filter
    if (filters.education !== 'all') {
      filtered = filtered.filter(applicant => {
        const education = applicant.education.toLowerCase()
        if (filters.education === 'bachelor') return education.includes('bs ') || education.includes('bachelor')
        if (filters.education === 'master') return education.includes('ms ') || education.includes('master')
        if (filters.education === 'phd') return education.includes('phd') || education.includes('doctorate')
        return true
      })
    }

    // Apply availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter(applicant => {
        if (filters.availability === 'immediate') return applicant.availability === 'Immediate'
        if (filters.availability === 'within_month') return applicant.availability.includes('week') || applicant.availability === 'Immediate'
        return true
      })
    }

    // Apply salary range filter
    if (filters.salaryRange !== 'all') {
      const [min, max] = filters.salaryRange.split('-').map(Number)
      filtered = filtered.filter(applicant => {
        const salary = applicant.expectedSalary
        if (max) {
          return salary >= min && salary <= max
        } else {
          return salary >= min
        }
      })
    }

    // Apply rating filter
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter(applicant => applicant.rating >= minRating)
    }

    // Apply source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(applicant => applicant.source === filters.source)
    }

    // Apply applied date filter
    if (filters.appliedDate !== 'all') {
      const today = new Date()
      const filterDate = new Date()
      
      if (filters.appliedDate === 'today') {
        filterDate.setDate(today.getDate())
      } else if (filters.appliedDate === 'week') {
        filterDate.setDate(today.getDate() - 7)
      } else if (filters.appliedDate === 'month') {
        filterDate.setMonth(today.getMonth() - 1)
      }
      
      filtered = filtered.filter(applicant => 
        new Date(applicant.appliedDate) >= filterDate
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.appliedDate) - new Date(a.appliedDate)
        case 'date_asc':
          return new Date(a.appliedDate) - new Date(b.appliedDate)
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'rating_desc':
          return b.rating - a.rating
        case 'rating_asc':
          return a.rating - b.rating
        case 'match_desc':
          return b.matchScore - a.matchScore
        case 'match_asc':
          return a.matchScore - b.matchScore
        case 'salary_desc':
          return b.expectedSalary - a.expectedSalary
        case 'salary_asc':
          return a.expectedSalary - b.expectedSalary
        default:
          return 0
      }
    })

    setFilteredApplicants(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSelectApplicant = (applicantId) => {
    const newSelected = new Set(selectedApplicants)
    if (newSelected.has(applicantId)) {
      newSelected.delete(applicantId)
    } else {
      newSelected.add(applicantId)
    }
    setSelectedApplicants(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedApplicants.size === paginatedApplicants.length) {
      setSelectedApplicants(new Set())
    } else {
      setSelectedApplicants(new Set(paginatedApplicants.map(a => a.id)))
    }
  }

  const handleViewApplicant = (applicantId) => {
    navigate(`/candidates/${applicantId}`)
  }

  const handleUpdateStatus = (applicantId, newStatus) => {
    setApplicants(prev => 
      prev.map(applicant => 
        applicant.id === applicantId 
          ? { ...applicant, status: newStatus, lastActivity: new Date().toISOString().split('T')[0] }
          : applicant
      )
    )
  }

  const handleScheduleInterview = (applicantId) => {
    navigate(`/interviews/schedule?applicant=${applicantId}&job=${jobId}`)
  }

  const handleDownloadResume = (applicant) => {
    // Simulate resume download
    const link = document.createElement('a')
    link.href = applicant.resumeUrl
    link.download = `${applicant.name.replace(' ', '_')}_Resume.pdf`
    link.click()
  }

  const formatSalary = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'new': return 'blue'
      case 'shortlisted': return 'green'
      case 'interviewed': return 'purple'
      case 'offer extended': return 'orange'
      case 'hired': return 'green'
      case 'rejected': return 'red'
      default: return 'gray'
    }
  }

  const getRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={12} className="text-yellow-400 fill-current" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={12} className="text-yellow-400 fill-current opacity-50" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={12} className="text-gray-300" />)
    }

    return stars
  }

  // Pagination
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex)

  const renderApplicantCard = (applicant) => (
    <div key={applicant.id} className="applicant-card card hover:shadow-lg transition-all duration-200">
      {/* Selection Checkbox */}
      <div className="applicant-selection">
        <input
          type="checkbox"
          checked={selectedApplicants.has(applicant.id)}
          onChange={() => handleSelectApplicant(applicant.id)}
          className="checkbox"
        />
      </div>

      {/* Applicant Header */}
      <div className="applicant-header">
        <div className="applicant-info">
          <div className="applicant-name-section">
            <h3 className="text-xl font-semibold text-gray-900">{applicant.name}</h3>
            <div className="applicant-badges">
              <span className={`status-badge ${getStatusColor(applicant.status)}`}>
                {applicant.status}
              </span>
              {applicant.source === 'Referral' && (
                <span className="badge bg-purple-100 text-purple-800">
                  <UserPlus size={12} />
                  Referral
                </span>
              )}
            </div>
          </div>
          
          <div className="applicant-title-company">
            <p className="text-gray-600 font-medium">{applicant.currentTitle}</p>
            <span className="text-sm text-gray-500">{applicant.currentCompany}</span>
          </div>
        </div>

        <div className="applicant-scores">
          <div className="match-score">
            <div className="score-circle">
              <span className="score-value">{applicant.matchScore}%</span>
            </div>
            <span className="score-label">Match</span>
          </div>
          
          <div className="rating-section">
            <div className="rating-stars">
              {getRatingStars(applicant.rating)}
            </div>
            <span className="rating-value">{applicant.rating}</span>
          </div>
        </div>
      </div>

      {/* Applicant Details */}
      <div className="applicant-details grid grid-cols-2 gap-4 mb-4">
        <div className="detail-item">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">{applicant.location}</span>
        </div>
        
        <div className="detail-item">
          <Briefcase size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">{applicant.experience} experience</span>
        </div>
        
        <div className="detail-item">
          <GraduationCap size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">{applicant.education.split(' - ')[0]}</span>
        </div>
        
        <div className="detail-item">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">Applied {formatDate(applicant.appliedDate)}</span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="contact-info mb-4">
        <div className="contact-row">
          <Mail size={14} className="text-gray-400" />
          <a href={`mailto:${applicant.email}`} className="text-sm text-blue-600 hover:text-blue-800">
            {applicant.email}
          </a>
        </div>
        <div className="contact-row">
          <Phone size={14} className="text-gray-400" />
          <a href={`tel:${applicant.phone}`} className="text-sm text-gray-600">
            {applicant.phone}
          </a>
        </div>
      </div>

      {/* Skills */}
      <div className="applicant-skills mb-4">
        <div className="flex flex-wrap gap-2">
          {applicant.skills.slice(0, 6).map((skill, index) => (
            <span key={index} className="skill-tag badge bg-blue-100 text-blue-800 text-xs">
              {skill}
            </span>
          ))}
          {applicant.skills.length > 6 && (
            <span className="text-sm text-gray-500">
              +{applicant.skills.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Salary and Availability */}
      <div className="salary-availability grid grid-cols-2 gap-4 mb-4">
        <div className="salary-info">
          <span className="text-sm text-gray-500">Expected Salary:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatSalary(applicant.expectedSalary)}
          </span>
        </div>
        <div className="availability-info">
          <span className="text-sm text-gray-500">Availability:</span>
          <span className="text-sm font-medium text-gray-900">{applicant.availability}</span>
        </div>
      </div>

      {/* AI Insights */}
      {applicant.aiInsights && (
        <div className="ai-insights mb-4">
          <div className="ai-header">
            <Bot size={14} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-600">AI Insights</span>
          </div>
          <div className="ai-recommendation">
            <span className="text-sm text-gray-600">{applicant.aiInsights.overallRecommendation}</span>
          </div>
          <div className="ai-scores grid grid-cols-2 gap-2 mt-2">
            <div className="ai-score">
              <span className="text-xs text-gray-500">Cultural Fit:</span>
              <span className="text-xs font-medium">{applicant.aiInsights.culturalFit}%</span>
            </div>
            <div className="ai-score">
              <span className="text-xs text-gray-500">Technical Fit:</span>
              <span className="text-xs font-medium">{applicant.aiInsights.technicalFit}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Interview Status */}
      {applicant.interviews.length > 0 && (
        <div className="interview-status mb-4">
          <div className="interview-header">
            <Video size={14} className="text-green-600" />
            <span className="text-sm font-medium text-green-600">Interviews</span>
          </div>
          <div className="interview-list">
            {applicant.interviews.slice(0, 2).map((interview, index) => (
              <div key={index} className="interview-item">
                <span className="text-sm text-gray-600">{interview.type}</span>
                <span className={`text-sm ${interview.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}>
                  {interview.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment Scores */}
      {applicant.assessments.length > 0 && (
        <div className="assessment-scores mb-4">
          <div className="assessment-header">
            <Award size={14} className="text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Assessments</span>
          </div>
          <div className="assessment-list">
            {applicant.assessments.map((assessment, index) => (
              <div key={index} className="assessment-item">
                <span className="text-sm text-gray-600">{assessment.type}</span>
                <span className="text-sm font-medium text-gray-900">{assessment.score}/100</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {applicant.tags.length > 0 && (
        <div className="applicant-tags mb-4">
          <div className="flex flex-wrap gap-2">
            {applicant.tags.map((tag, index) => (
              <span key={index} className="tag badge bg-gray-100 text-gray-800 text-xs">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="applicant-actions flex justify-between items-center">
        <div className="primary-actions flex gap-2">
          <button 
            className="btn btn-primary btn-sm flex items-center gap-2"
            onClick={() => handleViewApplicant(applicant.id)}
          >
            <Eye size={14} />
            View Profile
          </button>
          
          <button 
            className="btn btn-secondary btn-sm flex items-center gap-2"
            onClick={() => handleDownloadResume(applicant)}
          >
            <FileDown size={14} />
            Resume
          </button>
        </div>
        
        <div className="secondary-actions flex gap-2">
          <div className="status-dropdown">
            <select
              value={applicant.status}
              onChange={(e) => handleUpdateStatus(applicant.id, e.target.value)}
              className="input-sm"
            >
              <option value="New">New</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Offer Extended">Offer Extended</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => handleScheduleInterview(applicant.id)}
          >
            <Video size={14} />
          </button>
          
          <div className="dropdown">
            <button className="btn btn-secondary btn-sm">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {paginatedApplicants.map(applicant => renderApplicantCard(applicant))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {paginatedApplicants.map(applicant => renderApplicantCard(applicant))}
    </div>
  )

  return (
    <div className="applicants-page">
      {/* Job Header */}
      {jobDetails && (
        <div className="job-header-section mb-6">
          <div className="card p-6">
            <div className="flex justify-between items-start">
              <div className="job-info">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{jobDetails.title}</h1>
                <p className="text-gray-600 mb-4">
                  {jobDetails.company} • {jobDetails.department} • {jobDetails.location}
                </p>
                
                <div className="job-stats grid grid-cols-6 gap-4">
                  <div className="stat-item text-center">
                    <div className="stat-value text-lg font-semibold text-blue-600">{jobDetails.totalApplications}</div>
                    <div className="stat-label text-xs text-gray-500">Total</div>
                  </div>
                  <div className="stat-item text-center">
                    <div className="stat-value text-lg font-semibold text-green-600">{jobDetails.newApplications}</div>
                    <div className="stat-label text-xs text-gray-500">New</div>
                  </div>
                  <div className="stat-item text-center">
                    <div className="stat-value text-lg font-semibold text-purple-600">{jobDetails.shortlisted}</div>
                    <div className="stat-label text-xs text-gray-500">Shortlisted</div>
                  </div>
                  <div className="stat-item text-center">
                    <div className="stat-value text-lg font-semibold text-orange-600">{jobDetails.interviewed}</div>
                    <div className="stat-label text-xs text-gray-500">Interviewed</div>
                  </div>
                  <div className="stat-item text-center">
                    <div className="stat-value text-lg font-semibold text-green-600">{jobDetails.hired}</div>
                    <div className="stat-label text-xs text-gray-500">Hired</div>
                  </div>
                  <div className="stat-item text-center">
                    <div className="stat-value text-lg font-semibold text-red-600">{jobDetails.rejected}</div>
                    <div className="stat-label text-xs text-gray-500">Rejected</div>
                  </div>
                </div>
              </div>
              
              <div className="job-actions flex items-center gap-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/jobs/${jobId}`)}
                >
                  <Eye size={16} />
                  View Job
                </button>
                
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/jobs/${jobId}/edit`)}
                >
                  <Edit size={16} />
                  Edit Job
                </button>
                
                <button
                  className="btn btn-secondary"
                  onClick={loadApplicants}
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="search-filters-section mb-6">
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="search-box flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3" size={16} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Search applicants by name, email, title, company, or skills..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-controls flex items-center gap-3">
              <select
                className="input-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="rating_asc">Lowest Rated</option>
                <option value="match_desc">Best Match</option>
                <option value="match_asc">Worst Match</option>
                <option value="salary_desc">Highest Salary</option>
                <option value="salary_asc">Lowest Salary</option>
              </select>
              
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="advanced-filters pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="input"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">All Status</option>
                    <option value="New">New</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <select
                    className="input"
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                  >
                    <option value="all">All Experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, State"
                    className="input"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="React, Python, etc."
                    className="input"
                    value={filters.skills}
                    onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <select
                    className="input"
                    value={filters.education}
                    onChange={(e) => setFilters(prev => ({ ...prev, education: e.target.value }))}
                  >
                    <option value="all">All Education</option>
                    <option value="bachelor">Bachelor's</option>
                    <option value="master">Master's</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    className="input"
                    value={filters.availability}
                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                  >
                    <option value="all">Any Availability</option>
                    <option value="immediate">Immediate</option>
                    <option value="within_month">Within a Month</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <select
                    className="input"
                    value={filters.salaryRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                  >
                    <option value="all">Any Salary</option>
                    <option value="50000-80000">$50k - $80k</option>
                    <option value="80000-120000">$80k - $120k</option>
                    <option value="120000-160000">$120k - $160k</option>
                    <option value="160000-200000">$160k - $200k</option>
                    <option value="200000">$200k+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    className="input"
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                  >
                    <option value="all">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary and View Toggle */}
      <div className="results-header mb-6">
        <div className="flex justify-between items-center">
          <div className="results-summary flex items-center gap-4">
            <p className="text-gray-600">
              Showing {paginatedApplicants.length} of {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            
            {selectedApplicants.size > 0 && (
              <div className="selected-actions flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedApplicants.size} selected
                </span>
                <button className="btn btn-secondary btn-sm">
                  <Send size={14} />
                  Bulk Actions
                </button>
                <button className="btn btn-secondary btn-sm">
                  <Download size={14} />
                  Export Selected
                </button>
              </div>
            )}
          </div>
          
          <div className="view-controls flex items-center gap-4">
            <div className="bulk-select">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedApplicants.size === paginatedApplicants.length && paginatedApplicants.length > 0}
                  onChange={handleSelectAll}
                  className="checkbox"
                />
                Select All
              </label>
            </div>
            
            <div className="view-toggle flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="btn-group">
                <button
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                  List
                </button>
                <button
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 size={16} />
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants List/Grid */}
      <div className="applicants-content">
        {isLoading ? (
          <div className="loading-state text-center py-12">
            <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Applicants...</h3>
            <p className="text-gray-600">Please wait while we fetch the applicant data</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="empty-state text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applicants Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') 
                ? 'Try adjusting your search criteria or filters'
                : 'No applications have been received for this job yet.'
              }
            </p>
            {(searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')) && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('')
                  setFilters({
                    status: 'all',
                    experience: 'all',
                    location: '',
                    skills: '',
                    education: 'all',
                    availability: 'all',
                    salaryRange: 'all',
                    rating: 'all',
                    source: 'all',
                    appliedDate: 'all'
                  })
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-section mt-8">
                <div className="flex justify-between items-center">
                  <div className="pagination-info text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredApplicants.length)} of {filteredApplicants.length} applicants
                  </div>
                  
                  <div className="pagination flex items-center gap-2">
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    <div className="pagination-pages flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        )
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="pagination-ellipsis">...</span>
                          <button
                            className={`pagination-page ${currentPage === totalPages ? 'active' : ''}`}
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .applicants-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 24px;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .applicant-card {
          position: relative;
          transition: all 0.2s ease;
        }

        .applicant-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }

        .applicant-selection {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
        }

        .applicant-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-left: 32px;
        }

        .applicant-name-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .applicant-badges {
          display: flex;
          gap: 6px;
        }

        .applicant-title-company {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .applicant-scores {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .match-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .score-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-value {
          color: white;
          font-weight: 600;
          font-size: 12px;
        }

        .score-label {
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 500;
        }

        .rating-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .rating-stars {
          display: flex;
          gap: 2px;
        }

        .rating-value {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .contact-info {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          background: #f8fafc;
        }

        .contact-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .contact-row:last-child {
          margin-bottom: 0;
        }

        .salary-availability {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          background: #f8fafc;
        }

        .salary-info,
        .availability-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ai-insights {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          background: linear-gradient(135deg, #faf5ff, #f3e8ff);
        }

        .ai-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .ai-recommendation {
          margin-bottom: 8px;
        }

        .ai-scores {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .ai-score {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .interview-status,
        .assessment-scores {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          background: #f8fafc;
        }

        .interview-header,
        .assessment-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .interview-item,
        .assessment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .interview-item:last-child,
        .assessment-item:last-child {
          margin-bottom: 0;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.blue {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.green {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.purple {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .status-badge.orange {
          background: #fed7aa;
          color: #c2410c;
        }

        .status-badge.red {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.gray {
          background: #f3f4f6;
          color: #374151;
        }

        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .input-sm {
          padding: 6px 8px;
          font-size: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #8b5cf6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #7c3aed;
        }

        .btn-secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f8fafc;
        }

        .btn-group {
          display: flex;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #d1d5db;
        }

        .btn-group .btn {
          border-radius: 0;
          border: none;
          border-right: 1px solid #d1d5db;
        }

        .btn-group .btn:last-child {
          border-right: none;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .skill-tag {
          font-size: 10px;
          padding: 2px 6px;
          text-transform: none;
        }

        .tag {
          font-size: 10px;
          padding: 2px 6px;
          text-transform: none;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
        }

        .checkbox:checked {
          background: #8b5cf6;
          border-color: #8b5cf6;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pagination-btn {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #64748b;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8fafc;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-page {
          width: 40px;
          height: 40px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #64748b;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pagination-page:hover {
          background: #f8fafc;
        }

        .pagination-page.active {
          background: #8b5cf6;
          color: white;
          border-color: #8b5cf6;
        }

        .pagination-ellipsis {
          padding: 8px 4px;
          color: #64748b;
        }

        .dropdown {
          position: relative;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .applicants-page {
            padding: 16px;
          }

          .applicant-header {
            flex-direction: column;
            gap: 12px;
          }

          .applicant-scores {
            flex-direction: row;
            justify-content: space-between;
          }

          .applicant-actions {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .primary-actions,
          .secondary-actions {
            justify-content: stretch;
          }

          .primary-actions .btn,
          .secondary-actions .btn {
            flex: 1;
            justify-content: center;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .pagination {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default ApplicantsPage


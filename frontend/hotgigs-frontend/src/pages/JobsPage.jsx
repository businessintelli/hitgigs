import React from 'react'
import { Briefcase, Search, MapPin, Filter, Star, Clock, DollarSign } from 'lucide-react'

const JobsPage = () => {
  const sampleJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $180k',
      posted: '2 days ago',
      description: 'Join our innovative team to build next-generation software solutions that impact millions of users worldwide.',
      skills: ['React', 'Node.js', 'Python', 'AWS']
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $150k',
      posted: '1 day ago',
      description: 'Lead product strategy and development for our cutting-edge AI platform.',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership']
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$80k - $120k',
      posted: '3 days ago',
      description: 'Create beautiful and intuitive user experiences for web and mobile applications.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
          <p className="text-gray-600 mt-2">Discover your next career opportunity</p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3" size={20} color="#9ca3af" />
              <input
                type="text"
                placeholder="Job title or keywords"
                className="input pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3" size={20} color="#9ca3af" />
              <input
                type="text"
                placeholder="Location"
                className="input pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3" size={20} color="#9ca3af" />
              <select className="input pl-10">
                <option>Job Type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>
            <button className="btn btn-primary">
              Search Jobs
            </button>
          </div>
        </div>

        {/* Job Results */}
        <div className="space-y-6">
          {sampleJobs.map((job) => (
            <div key={job.id} className="card transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="icon-container bg-blue-100" style={{width: '3rem', height: '3rem', marginRight: '1rem', marginBottom: '0'}}>
                    <Briefcase size={24} color="#2563eb" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {job.posted}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-success">{job.type}</span>
                  <div className="flex items-center gap-1 mt-2 text-lg font-semibold text-gray-900">
                    <DollarSign size={20} />
                    {job.salary}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, index) => (
                  <span key={index} className="badge" style={{backgroundColor: '#f3f4f6', color: '#374151'}}>
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <button className="btn btn-secondary flex items-center gap-2">
                  <Star size={16} />
                  Save Job
                </button>
                <button className="btn btn-primary">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JobsPage


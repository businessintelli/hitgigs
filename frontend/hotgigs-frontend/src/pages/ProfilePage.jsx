import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Edit3, 
  Save, 
  X,
  Camera,
  Building,
  Globe,
  FileText,
  Award,
  Star,
  Plus,
  Trash2
} from 'lucide-react'

const ProfilePage = () => {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    position: '',
    website: '',
    linkedin: '',
    github: '',
    skills: [],
    experience: [],
    education: []
  })
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        company: user.company || '',
        position: user.position || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        skills: user.skills || ['JavaScript', 'React', 'Node.js', 'Python'],
        experience: user.experience || [
          {
            id: 1,
            title: 'Senior Developer',
            company: 'Tech Corp',
            duration: '2022 - Present',
            description: 'Lead development of web applications using React and Node.js'
          }
        ],
        education: user.education || [
          {
            id: 1,
            degree: 'Bachelor of Computer Science',
            school: 'University of Technology',
            year: '2020'
          }
        ]
      })
      setLoading(false)
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      // In a real app, this would make an API call to update the profile
      console.log('Saving profile data:', profileData)
      
      // Update the user context with new data
      setUser(prev => ({
        ...prev,
        ...profileData
      }))
      
      setIsEditing(false)
      // Show success message
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        company: user.company || '',
        position: user.position || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || []
      })
    }
    setIsEditing(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Access Denied</h2>
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <User size={48} />
          </div>
          <button className="avatar-edit-btn">
            <Camera size={16} />
          </button>
        </div>
        
        <div className="profile-info">
          <h1>{profileData.first_name} {profileData.last_name}</h1>
          <p className="profile-title">{profileData.position || 'Professional'}</p>
          <div className="profile-meta">
            {profileData.location && (
              <div className="meta-item">
                <MapPin size={16} />
                <span>{profileData.location}</span>
              </div>
            )}
            {profileData.company && (
              <div className="meta-item">
                <Building size={16} />
                <span>{profileData.company}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-outline" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Basic Information */}
        <div className="profile-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="form-input"
                />
              ) : (
                <div className="form-display">{profileData.first_name || 'Not specified'}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="form-input"
                />
              ) : (
                <div className="form-display">{profileData.last_name || 'Not specified'}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <div className="form-display">
                <Mail size={16} />
                {profileData.email}
              </div>
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="form-input"
                />
              ) : (
                <div className="form-display">
                  <Phone size={16} />
                  {profileData.phone || 'Not specified'}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="form-input"
                  placeholder="City, Country"
                />
              ) : (
                <div className="form-display">
                  <MapPin size={16} />
                  {profileData.location || 'Not specified'}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Position</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="form-input"
                  placeholder="Your job title"
                />
              ) : (
                <div className="form-display">
                  <Briefcase size={16} />
                  {profileData.position || 'Not specified'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="profile-section">
          <h2>About Me</h2>
          {isEditing ? (
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="form-textarea"
              placeholder="Tell us about yourself..."
              rows="4"
            />
          ) : (
            <div className="bio-display">
              {profileData.bio || 'No bio provided yet.'}
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="profile-section">
          <h2>Skills</h2>
          <div className="skills-container">
            {profileData.skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                <span>{skill}</span>
                {isEditing && (
                  <button onClick={() => removeSkill(skill)} className="skill-remove">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="add-skill">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="skill-input"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} className="btn btn-sm">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Links Section */}
        <div className="profile-section">
          <h2>Links</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="form-input"
                  placeholder="https://your-website.com"
                />
              ) : (
                <div className="form-display">
                  <Globe size={16} />
                  {profileData.website ? (
                    <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                      {profileData.website}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>LinkedIn</label>
              {isEditing ? (
                <input
                  type="url"
                  value={profileData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                />
              ) : (
                <div className="form-display">
                  <FileText size={16} />
                  {profileData.linkedin ? (
                    <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 0;
        }

        .profile-loading, .profile-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #06b6d4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .profile-header {
          background: white;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .profile-avatar {
          position: relative;
        }

        .avatar-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #06b6d4;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
        }

        .avatar-edit-btn:hover {
          background: #f9fafb;
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .profile-title {
          font-size: 18px;
          color: #6b7280;
          margin: 0 0 16px 0;
        }

        .profile-meta {
          display: flex;
          gap: 24px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .profile-section h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-input, .form-textarea {
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .form-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 0;
          color: #1f2937;
          font-size: 14px;
        }

        .form-display a {
          color: #06b6d4;
          text-decoration: none;
        }

        .form-display a:hover {
          text-decoration: underline;
        }

        .bio-display {
          padding: 16px 0;
          color: #1f2937;
          line-height: 1.6;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .skill-tag {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .skill-remove {
          background: none;
          border: none;
          color: #1d4ed8;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-skill {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .skill-input {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          font-size: 14px;
          width: 150px;
        }

        .btn {
          padding: 10px 16px;
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

        .btn-primary {
          background: #06b6d4;
          color: white;
        }

        .btn-primary:hover {
          background: #0891b2;
        }

        .btn-outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f9fafb;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .profile-meta {
            justify-content: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .edit-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default ProfilePage


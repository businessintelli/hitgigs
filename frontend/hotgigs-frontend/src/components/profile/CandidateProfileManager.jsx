import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import DocumentManager from '../documents/DocumentManager';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  Edit3, 
  Save, 
  X,
  Plus,
  Trash2,
  Upload,
  Download
} from 'lucide-react';

const CandidateProfileManager = () => {
  const { user } = useAuth();
  const { apiCall } = useApi();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/users/${user.id}/profile`, 'GET');
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/users/${user.id}/profile`, 'PUT', formData);
      setProfile(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addWorkExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false
    };
    setFormData(prev => ({
      ...prev,
      work_experiences: [...(prev.work_experiences || []), newExperience]
    }));
  };

  const removeWorkExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      work_experiences: prev.work_experiences.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      gpa: ''
    };
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEducation]
    }));
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Certifications', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-gray-600">{profile?.title || 'Professional'}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                {profile?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && (
            <PersonalInfoTab 
              profile={profile} 
              formData={formData} 
              editing={editing} 
              onChange={handleInputChange} 
            />
          )}
          {activeTab === 'experience' && (
            <WorkExperienceTab 
              experiences={formData.work_experiences || []} 
              editing={editing} 
              onChange={handleInputChange}
              onAdd={addWorkExperience}
              onRemove={removeWorkExperience}
            />
          )}
          {activeTab === 'education' && (
            <EducationTab 
              education={formData.education || []} 
              editing={editing} 
              onChange={handleInputChange}
              onAdd={addEducation}
              onRemove={removeEducation}
            />
          )}
          {activeTab === 'skills' && (
            <SkillsTab 
              skills={formData.skills || []} 
              certifications={formData.certifications || []}
              editing={editing} 
              onChange={handleInputChange}
            />
          )}
          {activeTab === 'documents' && (
            <DocumentManager />
          )}
        </div>
      </div>
    </div>
  );
};

// Personal Info Tab Component
const PersonalInfoTab = ({ profile, formData, editing, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          {editing ? (
            <input
              type="text"
              value={formData.first_name || ''}
              onChange={(e) => onChange('first_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{profile?.first_name || 'Not provided'}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          {editing ? (
            <input
              type="text"
              value={formData.last_name || ''}
              onChange={(e) => onChange('last_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{profile?.last_name || 'Not provided'}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title
          </label>
          {editing ? (
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{profile?.title || 'Not provided'}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          {editing ? (
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          {editing ? (
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="City, State, Country"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{profile?.location || 'Not provided'}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary
          </label>
          {editing ? (
            <textarea
              value={formData.summary || ''}
              onChange={(e) => onChange('summary', e.target.value)}
              rows={4}
              placeholder="Brief description of your professional background and career objectives..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{profile?.summary || 'Not provided'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Work Experience Tab Component
const WorkExperienceTab = ({ experiences, editing, onChange, onAdd, onRemove }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
        {editing && (
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        )}
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No work experience added yet.</p>
          {editing && (
            <button
              onClick={onAdd}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first work experience
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={exp.id || index} className="border border-gray-200 rounded-lg p-4">
              {editing && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => onRemove(exp.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[index] = { ...exp, company: e.target.value };
                        onChange('work_experiences', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{exp.company}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={exp.position || ''}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[index] = { ...exp, position: e.target.value };
                        onChange('work_experiences', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{exp.position}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={exp.start_date || ''}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[index] = { ...exp, start_date: e.target.value };
                        onChange('work_experiences', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{exp.start_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={exp.end_date || ''}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index] = { ...exp, end_date: e.target.value };
                          onChange('work_experiences', updated);
                        }}
                        disabled={exp.is_current}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exp.is_current || false}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index] = { ...exp, is_current: e.target.checked, end_date: e.target.checked ? null : exp.end_date };
                            onChange('work_experiences', updated);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Current position</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-gray-900">{exp.is_current ? 'Present' : exp.end_date}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {editing ? (
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[index] = { ...exp, description: e.target.value };
                        onChange('work_experiences', updated);
                      }}
                      rows={3}
                      placeholder="Describe your responsibilities and achievements..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{exp.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Education Tab Component
const EducationTab = ({ education, editing, onChange, onAdd, onRemove }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
        {editing && (
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
        )}
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No education added yet.</p>
          {editing && (
            <button
              onClick={onAdd}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your education
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={edu.id || index} className="border border-gray-200 rounded-lg p-4">
              {editing && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => onRemove(edu.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index] = { ...edu, institution: e.target.value };
                        onChange('education', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{edu.institution}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index] = { ...edu, degree: e.target.value };
                        onChange('education', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{edu.degree}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={edu.field_of_study || ''}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index] = { ...edu, field_of_study: e.target.value };
                        onChange('education', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{edu.field_of_study}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index] = { ...edu, gpa: e.target.value };
                        onChange('education', updated);
                      }}
                      placeholder="e.g., 3.8/4.0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{edu.gpa}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={edu.start_date || ''}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index] = { ...edu, start_date: e.target.value };
                        onChange('education', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{edu.start_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={edu.end_date || ''}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index] = { ...edu, end_date: e.target.value };
                        onChange('education', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{edu.end_date}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Skills Tab Component
const SkillsTab = ({ skills, certifications, editing, onChange }) => {
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', date: '' });

  const addSkill = () => {
    if (newSkill.trim()) {
      onChange('skills', [...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange('skills', updated);
  };

  const addCertification = () => {
    if (newCertification.name.trim()) {
      onChange('certifications', [...certifications, { ...newCertification, id: Date.now() }]);
      setNewCertification({ name: '', issuer: '', date: '' });
    }
  };

  const removeCertification = (id) => {
    const updated = certifications.filter(cert => cert.id !== id);
    onChange('certifications', updated);
  };

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
        {editing && (
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              <span>{skill}</span>
              {editing && (
                <button
                  onClick={() => removeSkill(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications</h3>
        {editing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
            <input
              type="text"
              value={newCertification.name}
              onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Certification name..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newCertification.issuer}
              onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
              placeholder="Issuing organization..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              <input
                type="date"
                value={newCertification.date}
                onChange={(e) => setNewCertification(prev => ({ ...prev, date: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addCertification}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{cert.name}</h4>
                <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
              </div>
              {editing && (
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileManager;


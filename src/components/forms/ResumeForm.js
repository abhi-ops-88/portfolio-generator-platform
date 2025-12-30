import React, { useState } from 'react';
import { GraduationCap, Briefcase, Plus, X } from 'lucide-react';

const ResumeForm = ({ data, updateData }) => {
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: '',
    description: ''
  });

  const [newExperience, setNewExperience] = useState({
    position: '',
    company: '',
    duration: '',
    description: ''
  });

  const addEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      const updatedEducation = [...data.resume.education, { ...newEducation, id: Date.now() }];
      updateData('resume', {
        ...data.resume,
        education: updatedEducation
      });
      setNewEducation({ degree: '', institution: '', year: '', description: '' });
    }
  };

  const removeEducation = (index) => {
    const updatedEducation = data.resume.education.filter((_, i) => i !== index);
    updateData('resume', {
      ...data.resume,
      education: updatedEducation
    });
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = data.resume.education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    updateData('resume', {
      ...data.resume,
      education: updatedEducation
    });
  };

  const addExperience = () => {
    if (newExperience.position.trim() && newExperience.company.trim()) {
      const updatedExperience = [...data.resume.experience, { ...newExperience, id: Date.now() }];
      updateData('resume', {
        ...data.resume,
        experience: updatedExperience
      });
      setNewExperience({ position: '', company: '', duration: '', description: '' });
    }
  };

  const removeExperience = (index) => {
    const updatedExperience = data.resume.experience.filter((_, i) => i !== index);
    updateData('resume', {
      ...data.resume,
      experience: updatedExperience
    });
  };

  const updateExperience = (index, field, value) => {
    const updatedExperience = data.resume.experience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    updateData('resume', {
      ...data.resume,
      experience: updatedExperience
    });
  };

  return (
    <div className="resume-form">
      {/* Education Section */}
      <div className="form-section">
        <h3 className="section-title">
          <GraduationCap className="w-5 h-5" />
          Education
        </h3>
        
        <div className="education-input">
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Degree/Certification *</label>
              <input
                type="text"
                className="form-input"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                placeholder="Bachelor of Computer Science"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Institution *</label>
              <input
                type="text"
                className="form-input"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                placeholder="University of Technology"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Year/Duration</label>
            <input
              type="text"
              className="form-input"
              value={newEducation.year}
              onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
              placeholder="2020 - 2024"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={newEducation.description}
              onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
              placeholder="Relevant coursework, achievements, GPA, etc."
              rows="2"
            />
          </div>

          <button
            type="button"
            onClick={addEducation}
            className="btn btn-secondary"
            disabled={!newEducation.degree.trim() || !newEducation.institution.trim()}
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>

        {/* Education List */}
        {data.resume.education.length > 0 && (
          <div className="items-list">
            <h4>Education History</h4>
            {data.resume.education.map((edu, index) => (
              <div key={index} className="item-card">
                <div className="item-header">
                  <h5>{edu.degree} - {edu.institution}</h5>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="remove-item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="item-content">
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Degree</label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Institution</label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input
                      type="text"
                      className="form-input"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      value={edu.description}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="form-section">
        <h3 className="section-title">
          <Briefcase className="w-5 h-5" />
          Work Experience
        </h3>
        
        <div className="experience-input">
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Position/Role *</label>
              <input
                type="text"
                className="form-input"
                value={newExperience.position}
                onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                placeholder="Software Developer"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input
                type="text"
                className="form-input"
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                placeholder="Tech Solutions Inc."
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Duration</label>
            <input
              type="text"
              className="form-input"
              value={newExperience.duration}
              onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
              placeholder="Jan 2023 - Present"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              placeholder="Key responsibilities, achievements, technologies used..."
              rows="3"
            />
          </div>

          <button
            type="button"
            onClick={addExperience}
            className="btn btn-secondary"
            disabled={!newExperience.position.trim() || !newExperience.company.trim()}
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        {/* Experience List */}
        {data.resume.experience.length > 0 && (
          <div className="items-list">
            <h4>Work Experience</h4>
            {data.resume.experience.map((exp, index) => (
              <div key={index} className="item-card">
                <div className="item-header">
                  <h5>{exp.position} - {exp.company}</h5>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="remove-item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="item-content">
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Position</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-input"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .resume-form {
          space-y: 3rem;
        }

        .form-section {
          margin-bottom: 3rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #374151;
        }

        .education-input,
        .experience-input {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }

        .items-list {
          space-y: 1rem;
        }

        .items-list h4 {
          margin-bottom: 1rem;
          color: #374151;
          font-weight: 600;
        }

        .item-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .item-header h5 {
          margin: 0;
          color: #374151;
          font-weight: 600;
        }

        .remove-item {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 0.25rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .remove-item:hover {
          background: #fecaca;
        }

        .item-content {
          space-y: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ResumeForm;
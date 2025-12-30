import React, { useState } from 'react';
import { User, Plus, X, Star } from 'lucide-react';

const AboutForm = ({ data, updateData }) => {
  const [newSkill, setNewSkill] = useState({ name: '', level: 80 });

  const handleDescriptionChange = (value) => {
    updateData('about', {
      ...data.about,
      description: value
    });
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const updatedSkills = [...data.about.skills, { ...newSkill, id: Date.now() }];
      updateData('about', {
        ...data.about,
        skills: updatedSkills
      });
      setNewSkill({ name: '', level: 80 });
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = data.about.skills.filter((_, i) => i !== index);
    updateData('about', {
      ...data.about,
      skills: updatedSkills
    });
  };

  const updateSkill = (index, field, value) => {
    const updatedSkills = data.about.skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    );
    updateData('about', {
      ...data.about,
      skills: updatedSkills
    });
  };

  return (
    <div className="about-form">
      <div className="form-section">
        <h3 className="section-title">
          <User className="w-5 h-5" />
          About Me
        </h3>
        
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className="form-textarea"
            value={data.about.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Tell visitors about yourself, your background, interests, and what drives you..."
            rows="6"
            required
          />
          <small className="form-help">This will be displayed in your About section</small>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">
          <Star className="w-5 h-5" />
          Skills & Expertise
        </h3>
        
        {/* Add New Skill */}
        <div className="skill-input">
          <div className="grid grid-2">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Skill name (e.g., JavaScript, React, Python)"
              />
            </div>
            <div className="form-group">
              <div className="skill-level-input">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                  className="skill-slider"
                />
                <span className="skill-percentage">{newSkill.level}%</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={addSkill}
            className="btn btn-secondary"
            disabled={!newSkill.name.trim()}
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>

        {/* Skills List */}
        {data.about.skills.length > 0 && (
          <div className="skills-list">
            <h4>Your Skills</h4>
            {data.about.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-info">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    className="skill-name-input"
                  />
                  <div className="skill-level">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                      className="skill-slider"
                    />
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="remove-skill"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .about-form {
          space-y: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
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

        .form-help {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .skill-input {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }

        .skill-level-input {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .skill-slider {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .skill-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }

        .skill-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .skill-percentage {
          min-width: 40px;
          text-align: right;
          font-weight: 600;
          color: #374151;
        }

        .skills-list h4 {
          margin-bottom: 1rem;
          color: #374151;
          font-weight: 600;
        }

        .skill-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .skill-info {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1rem;
          align-items: center;
        }

        .skill-name-input {
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .skill-level {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .remove-skill {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 0.25rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .remove-skill:hover {
          background: #fecaca;
        }

        @media (max-width: 768px) {
          .skill-info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutForm;
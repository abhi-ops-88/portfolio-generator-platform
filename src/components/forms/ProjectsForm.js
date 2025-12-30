import React, { useState } from 'react';
import { FolderOpen, Plus, X, ExternalLink, Github } from 'lucide-react';
import ImageUpload from '../ImageUpload';

const ProjectsForm = ({ data, updateData, files, updateFiles }) => {
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: [],
    liveUrl: '',
    githubUrl: ''
  });
  const [newTech, setNewTech] = useState('');

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      const updatedProjects = [...data.projects, { ...newProject, id: Date.now() }];
      updateData('projects', updatedProjects);
      setNewProject({
        title: '',
        description: '',
        technologies: [],
        liveUrl: '',
        githubUrl: ''
      });
    }
  };

  const removeProject = (index) => {
    const updatedProjects = data.projects.filter((_, i) => i !== index);
    updateData('projects', updatedProjects);
    
    // Remove associated image
    const updatedImages = [...files.projectImages];
    updatedImages.splice(index, 1);
    updateFiles('projectImages', updatedImages);
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = data.projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    updateData('projects', updatedProjects);
  };

  const addTechToNewProject = () => {
    if (newTech.trim()) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTechFromNewProject = (techIndex) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((_, i) => i !== techIndex)
    });
  };

  const addTechToProject = (projectIndex, tech) => {
    if (tech.trim()) {
      const updatedProjects = data.projects.map((project, i) => 
        i === projectIndex 
          ? { ...project, technologies: [...project.technologies, tech.trim()] }
          : project
      );
      updateData('projects', updatedProjects);
    }
  };

  const removeTechFromProject = (projectIndex, techIndex) => {
    const updatedProjects = data.projects.map((project, i) => 
      i === projectIndex 
        ? { ...project, technologies: project.technologies.filter((_, ti) => ti !== techIndex) }
        : project
    );
    updateData('projects', updatedProjects);
  };

  const updateProjectImage = (projectIndex, file) => {
    const updatedImages = [...files.projectImages];
    updatedImages[projectIndex] = file;
    updateFiles('projectImages', updatedImages);
  };

  return (
    <div className="projects-form">
      <div className="form-section">
        <h3 className="section-title">
          <FolderOpen className="w-5 h-5" />
          Add New Project
        </h3>
        
        <div className="project-input">
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="My Awesome Project"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Project Image</label>
              <ImageUpload
                onImageSelect={(file) => {
                  const updatedImages = [...files.projectImages];
                  updatedImages[data.projects.length] = file;
                  updateFiles('projectImages', updatedImages);
                }}
                currentImage={files.projectImages?.[data.projects.length]}
                placeholder="Upload project screenshot"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Describe your project, what it does, and what makes it special..."
              rows="3"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Live URL</label>
              <input
                type="url"
                className="form-input"
                value={newProject.liveUrl}
                onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                placeholder="https://myproject.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                className="form-input"
                value={newProject.githubUrl}
                onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Technologies Used</label>
            <div className="tech-input">
              <input
                type="text"
                className="form-input"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="React, Node.js, MongoDB..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechToNewProject())}
              />
              <button
                type="button"
                onClick={addTechToNewProject}
                className="btn btn-secondary"
                disabled={!newTech.trim()}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {newProject.technologies.length > 0 && (
              <div className="tech-tags">
                {newProject.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechFromNewProject(index)}
                      className="tech-remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={addProject}
            className="btn btn-primary"
            disabled={!newProject.title.trim() || !newProject.description.trim()}
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Projects List */}
      {data.projects.length > 0 && (
        <div className="form-section">
          <h3 className="section-title">Your Projects ({data.projects.length})</h3>
          <div className="projects-list">
            {data.projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h4>{project.title}</h4>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="remove-project"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="project-content">
                  <div className="grid grid-2">
                    <div>
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Project Image</label>
                      <ImageUpload
                        onImageSelect={(file) => updateProjectImage(index, file)}
                        currentImage={files.projectImages?.[index]}
                        placeholder="Upload project image"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Live URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={project.liveUrl}
                        onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GitHub URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={project.githubUrl}
                        onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                      />
                    </div>
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="tech-tags">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechFromProject(index, techIndex)}
                            className="tech-remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .projects-form {
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

        .project-input {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }

        .tech-input {
          display: flex;
          gap: 0.5rem;
          align-items: end;
        }

        .tech-input .form-input {
          flex: 1;
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .tech-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
        }

        .tech-remove {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .projects-list {
          space-y: 1rem;
        }

        .project-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .project-header h4 {
          margin: 0;
          color: #374151;
          font-weight: 600;
        }

        .remove-project {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 0.25rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .remove-project:hover {
          background: #fecaca;
        }

        .project-content {
          space-y: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ProjectsForm;
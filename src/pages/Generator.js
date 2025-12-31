import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import AboutForm from '../components/forms/AboutForm';
import ResumeForm from '../components/forms/ResumeForm';
import ProjectsForm from '../components/forms/ProjectsForm';
import SocialForm from '../components/forms/SocialForm';
import ContactForm from '../components/forms/ContactForm';
import ThemeForm from '../components/forms/ThemeForm';
import { ChevronLeft, ChevronRight, Save, Eye } from 'lucide-react';
import autoDeployService from '../services/autoDeployService';

const Generator = () => {
  const navigate = useNavigate();
  const { portfolioId } = useParams();
  const { user, savePortfolio, getUserPortfolios } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {
      name: '',
      title: '',
      tagline: '',
      email: ''
    },
    about: {
      description: '',
      skills: []
    },
    resume: {
      education: [],
      experience: []
    },
    projects: [],
    social: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: ''
    },
    contact: {
      email: '',
      phone: '',
      location: ''
    },
    theme: {
      primaryColor: '#3b82f6',
      accentColor: '#ffd700',
      primaryColorDark: '#2563eb'
    }
  });

  const [files, setFiles] = useState({
    backgroundImage: null,
    profileImage: null,
    projectImages: []
  });

  const [loading, setLoading] = useState(false);

  // Load existing portfolio if editing
  useEffect(() => {
    if (portfolioId) {
      loadPortfolio();
    }
  }, [portfolioId]);

  const loadPortfolio = async () => {
    try {
      const portfolios = await getUserPortfolios();
      const portfolio = portfolios.find(p => p.id === portfolioId);
      
      if (portfolio) {
        setPortfolioData(portfolio.data);
        toast.success('Portfolio loaded successfully!');
      } else {
        toast.error('Portfolio not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      toast.error('Failed to load portfolio');
    }
  };

  const steps = [
    { title: 'Personal Info', component: PersonalInfoForm },
    { title: 'About Me', component: AboutForm },
    { title: 'Resume', component: ResumeForm },
    { title: 'Projects', component: ProjectsForm },
    { title: 'Social Links', component: SocialForm },
    { title: 'Contact', component: ContactForm },
    { title: 'Theme', component: ThemeForm }
  ];

  const updatePortfolioData = (section, data) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const updateFiles = (fileType, file) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const validateCurrentStep = () => {
    const { personalInfo, about, resume, projects, contact } = portfolioData;
    
    switch (currentStep) {
      case 0: // Personal Info
        if (!personalInfo.name.trim()) {
          toast.error('Full Name is required');
          return false;
        }
        if (!personalInfo.title.trim()) {
          toast.error('Professional Title is required');
          return false;
        }
        if (!personalInfo.email.trim()) {
          toast.error('Email Address is required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        break;
      
      case 1: // About Me
        if (!about.description.trim()) {
          toast.error('About description is required');
          return false;
        }
        if (!about.skills || about.skills.length === 0) {
          toast.error('At least one skill is required');
          return false;
        }
        break;
      
      case 2: // Resume
        if (!resume.experience || resume.experience.length === 0) {
          toast.error('At least one work experience is required');
          return false;
        }
        if (!resume.education || resume.education.length === 0) {
          toast.error('At least one education entry is required');
          return false;
        }
        break;
      
      case 3: // Projects
        if (!projects || projects.length === 0) {
          toast.error('At least one project is required');
          return false;
        }
        // Validate each project has required fields
        for (let i = 0; i < projects.length; i++) {
          const project = projects[i];
          if (!project.title.trim()) {
            toast.error(`Project ${i + 1}: Title is required`);
            return false;
          }
          if (!project.description.trim()) {
            toast.error(`Project ${i + 1}: Description is required`);
            return false;
          }
        }
        break;
      
      case 4: // Social Links - Optional, no validation needed
        break;
      
      case 5: // Contact
        if (!contact.email.trim()) {
          toast.error('Contact email is required');
          return false;
        }
        break;
      
      case 6: // Theme - No validation needed
        break;
      
      default:
        return true;
    }
    
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveProgress = async () => {
    try {
      setLoading(true);
      const savedPortfolioId = await savePortfolio(portfolioData, portfolioId);
      
      // If this is a new portfolio, update the URL
      if (!portfolioId && savedPortfolioId) {
        navigate(`/generator/${savedPortfolioId}`, { replace: true });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save portfolio');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
      setPortfolioData(JSON.parse(saved));
      toast.success('Progress loaded successfully!');
    }
  };

  const generatePortfolio = async () => {
    try {
      setLoading(true);
      
      // Validate all required fields before generating
      if (!validateAllSteps()) {
        toast.error('Please complete all required fields before generating');
        return;
      }
      
      // Save portfolio data first
      const savedPortfolioId = await savePortfolio(portfolioData, portfolioId);
      
      const formData = new FormData();
      formData.append('portfolioData', JSON.stringify(portfolioData));
      
      if (files.backgroundImage) {
        formData.append('backgroundImage', files.backgroundImage);
      }
      if (files.profileImage) {
        formData.append('profileImage', files.profileImage);
      }
      files.projectImages.forEach((image, index) => {
        if (image) {
          formData.append('projectImages', image);
        }
      });

      const response = await fetch('/api/portfolio/generate', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('generatedPortfolio', JSON.stringify(result.files));
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        localStorage.setItem('currentPortfolioId', savedPortfolioId || portfolioId || '');
        
        // Auto-deploy if tokens are configured
        try {
          const availablePlatforms = autoDeployService.getAvailablePlatforms();
          if (availablePlatforms.length > 0) {
            // Show deployment options instead of auto-deploying
            localStorage.setItem('generatedPortfolio', JSON.stringify(result.files));
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
            localStorage.setItem('currentPortfolioId', savedPortfolioId || portfolioId || '');
            
            toast.success('Portfolio generated successfully!');
            navigate('/deploy-options');
          } else {
            toast.success('Portfolio generated successfully!');
            toast.info('Configure deployment tokens to automatically deploy your portfolio');
            navigate('/preview');
          }
        } catch (deployError) {
          console.log('Auto-deployment setup failed:', deployError);
          toast.success('Portfolio generated successfully!');
          navigate('/preview');
        }
      } else {
        toast.error(result.message || 'Failed to generate portfolio');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate portfolio');
    } finally {
      setLoading(false);
    }
  };

  const validateAllSteps = () => {
    for (let i = 0; i < steps.length - 1; i++) { // Skip theme validation
      const originalStep = currentStep;
      setCurrentStep(i);
      const isValid = validateCurrentStep();
      setCurrentStep(originalStep);
      
      if (!isValid) {
        setCurrentStep(i); // Navigate to the invalid step
        return false;
      }
    }
    return true;
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="aws-section">
      <div className="aws-container">
        <div className="aws-section-header">
          <h1 className="aws-section-title">Stack Your Story</h1>
          <p className="aws-section-subtitle">Fill in your information step by step to generate your professional portfolio with DeckFolio</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`progress-step ${index <= currentStep ? 'active' : ''} ${
                  index === currentStep ? 'current' : ''
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-title">{step.title}</div>
              </div>
            ))}
          </div>
          <div className="progress-line">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="form-container">
          <div className="aws-card">
            <div className="aws-card-header">
              <h2 className="aws-card-title">{steps[currentStep].title}</h2>
            </div>
            <div className="card-content">
              <CurrentStepComponent
                data={portfolioData}
                updateData={updatePortfolioData}
                files={files}
                updateFiles={updateFiles}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="form-navigation">
          <div className="nav-buttons">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn btn-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="nav-actions">
              <button
                type="button"
                onClick={saveProgress}
                className="btn btn-outline"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Progress'}
              </button>
              <button
                type="button"
                onClick={loadProgress}
                className="btn btn-outline"
              >
                Load Progress
              </button>
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={generatePortfolio}
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="aws-spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Generate & Preview
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .progress-bar {
          position: relative;
          margin-bottom: 3rem;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: var(--transition-normal);
        }

        .progress-step.active .step-number {
          background: var(--aws-orange);
          color: var(--aws-white);
        }

        .progress-step.current .step-number {
          background: var(--aws-orange-dark);
          transform: scale(1.1);
          box-shadow: var(--shadow-md);
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--aws-gray-200);
          color: var(--aws-gray-600);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: var(--transition-normal);
        }

        .step-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--aws-gray-600);
          text-align: center;
        }

        .progress-line {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: var(--aws-gray-200);
          z-index: 1;
        }

        .progress-fill {
          height: 100%;
          background: var(--aws-orange);
          transition: var(--transition-normal);
        }

        .form-container {
          margin-bottom: 2rem;
        }

        .form-navigation {
          border-top: 1px solid var(--aws-gray-200);
          padding-top: 2rem;
        }

        .nav-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .progress-steps {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .progress-line {
            display: none;
          }

          .nav-buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-actions {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
};

export default Generator;
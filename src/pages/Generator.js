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

  const nextStep = () => {
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
        toast.success('Portfolio generated successfully!');
        navigate('/preview');
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

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="generator">
      <div className="container">
        <div className="generator-header">
          <h1>Create Your Portfolio</h1>
          <p>Fill in your information step by step to generate your professional portfolio</p>
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
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{steps[currentStep].title}</h2>
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
                className="btn btn-secondary"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Progress'}
              </button>
              <button
                type="button"
                onClick={loadProgress}
                className="btn btn-secondary"
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
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
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
        .generator {
          padding: 2rem 0;
          min-height: calc(100vh - 80px);
        }

        .generator-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .generator-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #111827;
        }

        .generator-header p {
          font-size: 1.125rem;
          color: #6b7280;
        }

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
          transition: all 0.3s ease;
        }

        .progress-step.active .step-number {
          background: #3b82f6;
          color: white;
        }

        .progress-step.current .step-number {
          background: #1d4ed8;
          transform: scale(1.1);
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e7eb;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .step-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          text-align: center;
        }

        .progress-line {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: #e5e7eb;
          z-index: 1;
        }

        .progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }

        .form-container {
          margin-bottom: 2rem;
        }

        .form-navigation {
          border-top: 1px solid #e5e7eb;
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
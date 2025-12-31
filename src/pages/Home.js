import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rocket, Github, Globe, Zap, Users, Star } from 'lucide-react';
import FirebaseStatus from '../components/FirebaseStatus';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Only redirect if Firebase is configured and user is authenticated
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Stack Instantly',
      description: 'Create a professional portfolio in minutes with our intuitive deck-based generator.'
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: 'GitHub Integration',
      description: 'Automatically create a GitHub repository and push your portfolio code with one click.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Multi-Platform Deploy',
      description: 'Deploy your portfolio to Netlify, Vercel, or GitHub Pages with enterprise-grade reliability.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Professional Ready',
      description: 'Perfect for developers, designers, and professionals looking to showcase their work professionally.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="aws-hero">
        <div className="aws-hero-content">
          <FirebaseStatus />
          <h1 className="aws-hero-title">
            Stack Your Story Instantly
            <span className="highlight"> with DeckFolio</span>
          </h1>
          <p className="aws-hero-subtitle">
            Generate stunning portfolio websites with GitHub integration and automatic deployment. 
            Built for enterprise-grade performance and reliability.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary btn-xl">
              <Rocket className="w-5 h-5" />
              Start Stacking
            </Link>
            <a href="#features" className="btn btn-secondary btn-xl">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="aws-section">
        <div className="aws-container">
          <div className="aws-section-header">
            <h2 className="aws-section-title">Why Choose DeckFolio?</h2>
            <p className="aws-section-subtitle">
              Everything you need to stack your story and deploy a professional portfolio with enterprise-grade tools
            </p>
          </div>
          <div className="aws-grid aws-grid-2">
            {features.map((feature, index) => (
              <div key={index} className="aws-card feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="aws-card-title">{feature.title}</h3>
                <p className="aws-card-subtitle">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="aws-section aws-section-alt">
        <div className="aws-container">
          <div className="aws-section-header">
            <h2 className="aws-section-title">How DeckFolio Works</h2>
            <p className="aws-section-subtitle">
              Simple 3-step process to stack your story and get your portfolio live with professional deployment
            </p>
          </div>
          <div className="aws-grid aws-grid-3">
            <div className="aws-card step-card">
              <div className="step-number">1</div>
              <h3 className="aws-card-title">Stack Your Information</h3>
              <p>Enter your personal details, skills, projects, and upload images through our intuitive deck-based interface.</p>
            </div>
            <div className="aws-card step-card">
              <div className="step-number">2</div>
              <h3 className="aws-card-title">Generate & Preview</h3>
              <p>DeckFolio generates a beautiful, responsive portfolio website that you can preview before deployment.</p>
            </div>
            <div className="aws-card step-card">
              <div className="step-number">3</div>
              <h3 className="aws-card-title">Deploy Instantly</h3>
              <p>With one click, create a GitHub repo and deploy to multiple platforms. Your story goes live instantly!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="aws-section cta-section">
        <div className="aws-container">
          <div className="cta-content text-center">
            <h2 className="aws-section-title">Ready to Stack Your Story?</h2>
            <p className="aws-section-subtitle">Join thousands of professionals who have stacked their stories with DeckFolio's enterprise-grade tools.</p>
            <Link to="/signup" className="btn btn-primary btn-xl">
              <Star className="w-5 h-5" />
              Start Stacking Now
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .highlight {
          color: var(--aws-orange);
        }

        [data-theme="blackwhite"] .highlight {
          color: var(--accent-silver);
          text-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: var(--spacing-2xl);
        }

        .feature-card {
          text-align: center;
          transition: var(--transition-normal);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .feature-icon {
          display: inline-flex;
          padding: var(--spacing-lg);
          background: rgba(255, 153, 0, 0.1);
          color: var(--aws-orange);
          border-radius: var(--radius-xl);
          margin-bottom: var(--spacing-lg);
        }

        [data-theme="blackwhite"] .feature-icon {
          background: var(--gray-100);
          color: var(--primary-black);
          border: 2px solid var(--gray-300);
        }

        [data-theme="blackwhite"] .feature-card:hover .feature-icon {
          background: var(--primary-black);
          color: var(--primary-white);
          border-color: var(--primary-black);
        }

        .step-card {
          text-align: center;
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: var(--aws-orange);
          color: var(--aws-white);
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--spacing-lg);
        }

        [data-theme="blackwhite"] .step-number {
          background: var(--primary-black);
          color: var(--primary-white);
          border: 3px solid var(--primary-white);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-section {
          background: linear-gradient(135deg, var(--aws-blue) 0%, var(--aws-blue-dark) 100%);
          color: var(--aws-white);
        }

        [data-theme="blackwhite"] .cta-section {
          background: linear-gradient(135deg, var(--primary-black) 0%, var(--charcoal) 100%);
          color: var(--primary-white);
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
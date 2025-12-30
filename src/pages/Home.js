import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Rocket, Github, Globe, Zap, Users, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Quick Setup',
      description: 'Create a professional portfolio in minutes with our intuitive form-based generator.'
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: 'GitHub Integration',
      description: 'Automatically create a GitHub repository and push your portfolio code.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Netlify Deployment',
      description: 'Deploy your portfolio to Netlify with one click and get a live URL.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Student Friendly',
      description: 'Perfect for students and professionals looking to showcase their work.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero section">
        <div className="container">
          <div className="text-center">
            <h1 className="hero-title">
              Create Your Professional Portfolio
              <span className="highlight"> In Minutes</span>
            </h1>
            <p className="hero-subtitle">
              Generate a stunning portfolio website with GitHub integration and automatic Netlify deployment. 
              Perfect for students, developers, and professionals.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">
                <Rocket className="w-5 h-5" />
                Start Creating
              </Link>
              <a href="#features" className="btn btn-secondary btn-large">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features section">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="section-title">Why Choose Our Platform?</h2>
            <p className="section-subtitle">
              Everything you need to create and deploy a professional portfolio
            </p>
          </div>
          <div className="grid grid-2">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works section">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple 3-step process to get your portfolio live
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Fill Your Information</h3>
              <p>Enter your personal details, skills, projects, and upload images through our easy-to-use form.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Generate & Preview</h3>
              <p>Our system generates a beautiful, responsive portfolio website that you can preview before deployment.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Deploy Automatically</h3>
              <p>With one click, create a GitHub repo and deploy to Netlify. Your portfolio will be live instantly!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Build Your Portfolio?</h2>
            <p>Join thousands of students and professionals who have created their portfolios with us.</p>
            <Link to="/signup" className="btn btn-primary btn-large">
              <Star className="w-5 h-5" />
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6rem 0;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .highlight {
          color: #ffd700;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #111827;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .features {
          background: white;
        }

        .feature-card {
          padding: 2rem;
          text-align: center;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          display: inline-flex;
          padding: 1rem;
          background: #eff6ff;
          color: #3b82f6;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #111827;
        }

        .feature-description {
          color: #6b7280;
          line-height: 1.6;
        }

        .how-it-works {
          background: #f8fafc;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin-top: 3rem;
        }

        .step {
          text-align: center;
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .step h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #111827;
        }

        .step p {
          color: #6b7280;
          line-height: 1.6;
        }

        .cta {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
          color: white;
        }

        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta p {
          font-size: 1.125rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .steps {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .cta h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
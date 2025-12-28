const fs = require('fs-extra');
const path = require('path');

const generatePortfolioFiles = async (portfolioData, files) => {
  const {
    personalInfo,
    about,
    resume,
    projects,
    social,
    contact,
    theme
  } = portfolioData;

  // Generate HTML
  const htmlContent = generateHTML(portfolioData, files);
  
  // Generate CSS
  const cssContent = generateCSS(theme, files);
  
  // Generate JavaScript
  const jsContent = generateJS();
  
  // Generate package.json for the portfolio
  const packageJson = generatePackageJson(personalInfo.name);

  return {
    'index.html': htmlContent,
    'styles.css': cssContent,
    'script.js': jsContent,
    'package.json': packageJson,
    'README.md': generateReadme(personalInfo)
  };
};

const generateHTML = (data, files) => {
  const { personalInfo, about, resume, projects, social, contact } = data;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.name} - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">${personalInfo.name}</div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#resume" class="nav-link">Resume</a></li>
                <li><a href="#projects" class="nav-link">Projects</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Home Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <h1>Hi, I'm <span class="highlight">${personalInfo.name}</span></h1>
                <h2>${personalInfo.title}</h2>
                <p>${personalInfo.tagline}</p>
                <div class="hero-buttons">
                    <a href="#contact" class="btn btn-primary">Get In Touch</a>
                    <a href="#projects" class="btn btn-secondary">View Work</a>
                </div>
            </div>
            ${files?.profileImage ? `<div class="hero-image">
                <img src="data:image/jpeg;base64,${files.profileImage[0].buffer.toString('base64')}" alt="${personalInfo.name}">
            </div>` : ''}
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${about.description}</p>
                    <div class="skills">
                        <h3>Skills</h3>
                        <div class="skills-grid">
                            ${about.skills.map(skill => `
                                <div class="skill-item">
                                    <span class="skill-name">${skill.name}</span>
                                    <div class="skill-bar">
                                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Resume Section -->
    <section id="resume" class="resume">
        <div class="container">
            <h2 class="section-title">Resume</h2>
            <div class="resume-content">
                <div class="resume-column">
                    <h3>Education</h3>
                    ${resume.education.map(edu => `
                        <div class="resume-item">
                            <h4>${edu.degree}</h4>
                            <p class="institution">${edu.institution}</p>
                            <p class="date">${edu.year}</p>
                            <p class="description">${edu.description}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="resume-column">
                    <h3>Experience</h3>
                    ${resume.experience.map(exp => `
                        <div class="resume-item">
                            <h4>${exp.position}</h4>
                            <p class="company">${exp.company}</p>
                            <p class="date">${exp.duration}</p>
                            <p class="description">${exp.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Projects</h2>
            <div class="projects-grid">
                ${projects.map((project, index) => `
                    <div class="project-card">
                        ${files?.projectImages?.[index] ? `
                            <img src="data:image/jpeg;base64,${files.projectImages[index].buffer.toString('base64')}" alt="${project.title}">
                        ` : '<div class="project-placeholder"></div>'}
                        <div class="project-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                            <div class="project-links">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn btn-small">Live Demo</a>` : ''}
                                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn btn-small">GitHub</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${contact.email}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${contact.phone}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${contact.location}</span>
                    </div>
                    <div class="social-links">
                        ${social.linkedin ? `<a href="${social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${social.github ? `<a href="${social.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                        ${social.twitter ? `<a href="${social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                        ${social.instagram ? `<a href="${social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                    </div>
                </div>
                <form class="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <textarea placeholder="Your Message" rows="5" required></textarea>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${personalInfo.name}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
};

const generateCSS = (theme, files) => {
  const backgroundImage = files?.backgroundImage ? 
    `data:image/jpeg;base64,${files.backgroundImage[0].buffer.toString('base64')}` : 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  return `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
    transition: all 0.3s ease;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${theme?.primaryColor || '#667eea'};
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: ${theme?.primaryColor || '#667eea'};
}

.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background: #333;
    margin: 3px 0;
    transition: 0.3s;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    background: url('${backgroundImage}') center/cover;
    display: flex;
    align-items: center;
    position: relative;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.hero-text {
    color: white;
}

.hero-text h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.hero-text h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.9;
}

.hero-text p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

.highlight {
    color: ${theme?.accentColor || '#ffd700'};
}

.hero-buttons {
    display: flex;
    gap: 1rem;
}

.btn {
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    display: inline-block;
}

.btn-primary {
    background: ${theme?.primaryColor || '#667eea'};
    color: white;
}

.btn-primary:hover {
    background: ${theme?.primaryColorDark || '#5a67d8'};
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: ${theme?.primaryColor || '#667eea'};
}

.hero-image {
    text-align: center;
}

.hero-image img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Sections */
section {
    padding: 80px 0;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
}

/* About Section */
.about {
    background: #f8f9fa;
}

.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about-text p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.8;
}

.skills {
    text-align: left;
}

.skills h3 {
    margin-bottom: 1.5rem;
    color: #333;
}

.skills-grid {
    display: grid;
    gap: 1rem;
}

.skill-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.skill-name {
    min-width: 120px;
    font-weight: 600;
}

.skill-bar {
    flex: 1;
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
}

.skill-progress {
    height: 100%;
    background: ${theme?.primaryColor || '#667eea'};
    border-radius: 4px;
    transition: width 2s ease;
}

/* Resume Section */
.resume-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
}

.resume-column h3 {
    margin-bottom: 2rem;
    color: ${theme?.primaryColor || '#667eea'};
    font-size: 1.5rem;
}

.resume-item {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e9ecef;
}

.resume-item:last-child {
    border-bottom: none;
}

.resume-item h4 {
    margin-bottom: 0.5rem;
    color: #333;
}

.institution, .company {
    font-weight: 600;
    color: ${theme?.primaryColor || '#667eea'};
    margin-bottom: 0.25rem;
}

.date {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.description {
    color: #555;
    line-height: 1.6;
}

/* Projects Section */
.projects {
    background: #f8f9fa;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.project-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.project-card:hover {
    transform: translateY(-5px);
}

.project-card img, .project-placeholder {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.project-placeholder {
    background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
}

.project-content {
    padding: 1.5rem;
}

.project-content h3 {
    margin-bottom: 1rem;
    color: #333;
}

.project-content p {
    margin-bottom: 1rem;
    color: #666;
    line-height: 1.6;
}

.project-tech {
    margin-bottom: 1rem;
}

.tech-tag {
    display: inline-block;
    background: ${theme?.primaryColor || '#667eea'};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    margin: 0.25rem 0.25rem 0.25rem 0;
}

.project-links {
    display: flex;
    gap: 0.5rem;
}

.btn-small {
    padding: 8px 16px;
    font-size: 0.9rem;
}

/* Contact Section */
.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 1000px;
    margin: 0 auto;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.contact-item i {
    width: 20px;
    color: ${theme?.primaryColor || '#667eea'};
}

.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: ${theme?.primaryColor || '#667eea'};
    color: white;
    border-radius: 50%;
    text-decoration: none;
    transition: transform 0.3s ease;
}

.social-links a:hover {
    transform: scale(1.1);
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: ${theme?.primaryColor || '#667eea'};
}

/* Footer */
.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }
    
    .nav-menu {
        display: none;
    }
    
    .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .hero-text h1 {
        font-size: 2.5rem;
    }
    
    .resume-content,
    .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
}`;
};

const generateJS = () => {
  return `// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Animate skill bars when in view
const observeSkills = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    });

    skillBars.forEach(bar => observer.observe(bar));
};

// Contact form handling
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name') || e.target[0].value;
    const email = formData.get('email') || e.target[1].value;
    const message = formData.get('message') || e.target[2].value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create mailto link
    const subject = encodeURIComponent(\`Message from \${name}\`);
    const body = encodeURIComponent(\`Name: \${name}\\nEmail: \${email}\\n\\nMessage:\\n\${message}\`);
    const mailtoLink = \`mailto:?subject=\${subject}&body=\${body}\`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset form
    contactForm.reset();
    alert('Thank you for your message! Your email client should open now.');
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    observeSkills();
    
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(section);
    });
});`;
};

const generatePackageJson = (name) => {
  return JSON.stringify({
    name: name.toLowerCase().replace(/\s+/g, '-') + '-portfolio',
    version: '1.0.0',
    description: `Portfolio website for ${name}`,
    main: 'index.html',
    scripts: {
      start: 'python -m http.server 8000',
      build: 'echo \"Static site - no build needed\"'
    },
    keywords: ['portfolio', 'website', 'personal'],
    author: name,
    license: 'MIT'
  }, null, 2);
};

const generateReadme = (personalInfo) => {
  return `# ${personalInfo.name} - Portfolio

Welcome to my personal portfolio website! This site showcases my work, skills, and experience.

## About

${personalInfo.tagline}

## Features

- Responsive design that works on all devices
- Modern and clean interface
- Smooth scrolling navigation
- Interactive contact form
- Social media integration

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome Icons

## Getting Started

To run this portfolio locally:

1. Clone this repository
2. Open \`index.html\` in your web browser
3. Or serve it using a local server:
   \`\`\`bash
   python -m http.server 8000
   \`\`\`

## Contact

Feel free to reach out to me:

- Email: ${personalInfo.email || 'your.email@example.com'}
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]

## License

This project is open source and available under the [MIT License](LICENSE).
`;
};

module.exports = {
  generatePortfolioFiles
};`;
</invoke>
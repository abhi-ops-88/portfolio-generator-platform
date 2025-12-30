// Portfolio Template Generator
// Generates static HTML/CSS/JS files from portfolio data

const generatePortfolioFiles = (portfolioData) => {
  const files = {};

  // Generate HTML file
  files['index.html'] = generateHTML(portfolioData);
  
  // Generate CSS file
  files['styles.css'] = generateCSS(portfolioData);
  
  // Generate JavaScript file
  files['script.js'] = generateJS(portfolioData);
  
  // Generate README
  files['README.md'] = generateREADME(portfolioData);

  return files;
};

const generateHTML = (data) => {
  const { personalInfo, about, resume, projects, contact, theme } = data;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo?.name || 'Portfolio'} - Professional Portfolio</title>
    <meta name="description" content="${about?.summary || 'Professional portfolio showcasing skills and projects'}">
    <meta name="keywords" content="portfolio, developer, ${resume?.skills?.join(', ') || 'web development'}">
    <meta name="author" content="${personalInfo?.name || 'Portfolio Owner'}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${personalInfo?.name || 'Portfolio'} - Professional Portfolio">
    <meta property="og:description" content="${about?.summary || 'Professional portfolio showcasing skills and projects'}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${personalInfo?.profileImage || './assets/profile.jpg'}">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${personalInfo?.name || 'Portfolio'} - Professional Portfolio">
    <meta name="twitter:description" content="${about?.summary || 'Professional portfolio showcasing skills and projects'}">
    
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="#home">${personalInfo?.name || 'Portfolio'}</a>
            </div>
            <ul class="nav-menu" id="nav-menu">
                <li class="nav-item">
                    <a href="#home" class="nav-link">Home</a>
                </li>
                <li class="nav-item">
                    <a href="#about" class="nav-link">About</a>
                </li>
                <li class="nav-item">
                    <a href="#resume" class="nav-link">Resume</a>
                </li>
                <li class="nav-item">
                    <a href="#projects" class="nav-link">Projects</a>
                </li>
                <li class="nav-item">
                    <a href="#contact" class="nav-link">Contact</a>
                </li>
            </ul>
            <div class="nav-toggle" id="nav-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title">
                        Hi, I'm <span class="highlight">${personalInfo?.name || 'Your Name'}</span>
                    </h1>
                    <h2 class="hero-subtitle">${personalInfo?.title || 'Professional Developer'}</h2>
                    <p class="hero-description">
                        ${about?.summary || 'Passionate developer creating innovative solutions and exceptional user experiences.'}
                    </p>
                    <div class="hero-buttons">
                        <a href="#projects" class="btn btn-primary">View My Work</a>
                        <a href="#contact" class="btn btn-secondary">Get In Touch</a>
                    </div>
                    <div class="hero-social">
                        ${personalInfo?.social?.linkedin ? `<a href="${personalInfo.social.linkedin}" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${personalInfo?.social?.github ? `<a href="${personalInfo.social.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
                        ${personalInfo?.social?.twitter ? `<a href="${personalInfo.social.twitter}" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>` : ''}
                        ${personalInfo?.social?.medium ? `<a href="${personalInfo.social.medium}" target="_blank" rel="noopener noreferrer"><i class="fab fa-medium"></i></a>` : ''}
                    </div>
                </div>
                <div class="hero-image">
                    <img src="${personalInfo?.profileImage || 'https://via.placeholder.com/400x400?text=Profile'}" alt="${personalInfo?.name || 'Profile'}" class="profile-img">
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${about?.summary || 'Professional summary goes here.'}</p>
                    ${about?.details ? `<p>${about.details}</p>` : ''}
                </div>
                <div class="about-stats">
                    <div class="stat">
                        <h3>${resume?.experience?.length || 0}+</h3>
                        <p>Years Experience</p>
                    </div>
                    <div class="stat">
                        <h3>${projects?.length || 0}+</h3>
                        <p>Projects Completed</p>
                    </div>
                    <div class="stat">
                        <h3>${resume?.skills?.length || 0}+</h3>
                        <p>Technologies</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Resume Section -->
    <section id="resume" class="resume">
        <div class="container">
            <h2 class="section-title">Resume</h2>
            
            <!-- Skills -->
            <div class="resume-section">
                <h3 class="resume-subtitle">Skills</h3>
                <div class="skills-grid">
                    ${resume?.skills?.map(skill => `
                        <div class="skill-item">
                            <span class="skill-name">${skill}</span>
                        </div>
                    `).join('') || '<p>No skills listed</p>'}
                </div>
            </div>

            <!-- Experience -->
            <div class="resume-section">
                <h3 class="resume-subtitle">Experience</h3>
                <div class="timeline">
                    ${resume?.experience?.map(exp => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h4>${exp.position}</h4>
                                <h5>${exp.company}</h5>
                                <span class="timeline-date">${exp.startDate} - ${exp.endDate || 'Present'}</span>
                                <p>${exp.description}</p>
                            </div>
                        </div>
                    `).join('') || '<p>No experience listed</p>'}
                </div>
            </div>

            <!-- Education -->
            <div class="resume-section">
                <h3 class="resume-subtitle">Education</h3>
                <div class="timeline">
                    ${resume?.education?.map(edu => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h4>${edu.degree}</h4>
                                <h5>${edu.institution}</h5>
                                <span class="timeline-date">${edu.startDate} - ${edu.endDate || 'Present'}</span>
                                ${edu.description ? `<p>${edu.description}</p>` : ''}
                            </div>
                        </div>
                    `).join('') || '<p>No education listed</p>'}
                </div>
            </div>

            <div class="resume-download">
                <button onclick="window.print()" class="btn btn-primary">
                    <i class="fas fa-download"></i> Download Resume
                </button>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Projects</h2>
            
            <div class="project-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="web">Web Development</button>
                <button class="filter-btn" data-filter="mobile">Mobile</button>
                <button class="filter-btn" data-filter="ai">AI/ML</button>
                <button class="filter-btn" data-filter="devops">DevOps</button>
            </div>

            <div class="projects-grid">
                ${projects?.map(project => `
                    <div class="project-card" data-category="${project.category || 'web'}">
                        <div class="project-image">
                            <img src="${project.image || 'https://via.placeholder.com/400x250?text=Project'}" alt="${project.title}">
                            <div class="project-overlay">
                                <div class="project-links">
                                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fab fa-github"></i></a>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="project-content">
                            <h3 class="project-title">${project.title}</h3>
                            <p class="project-description">${project.description}</p>
                            <div class="project-tech">
                                ${project.technologies?.map(tech => `<span class="tech-tag">${tech}</span>`).join('') || ''}
                            </div>
                        </div>
                    </div>
                `).join('') || '<p>No projects to display</p>'}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Let's work together</h3>
                    <p>I'm always interested in new opportunities and exciting projects.</p>
                    
                    <div class="contact-details">
                        ${contact?.email ? `
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <a href="mailto:${contact.email}">${contact.email}</a>
                            </div>
                        ` : ''}
                        ${contact?.phone ? `
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <a href="tel:${contact.phone}">${contact.phone}</a>
                            </div>
                        ` : ''}
                        ${contact?.location ? `
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${contact.location}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="social-links">
                        ${personalInfo?.social?.linkedin ? `<a href="${personalInfo.social.linkedin}" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${personalInfo?.social?.github ? `<a href="${personalInfo.social.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
                        ${personalInfo?.social?.twitter ? `<a href="${personalInfo.social.twitter}" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>` : ''}
                        ${personalInfo?.social?.medium ? `<a href="${personalInfo.social.medium}" target="_blank" rel="noopener noreferrer"><i class="fab fa-medium"></i></a>` : ''}
                    </div>
                </div>

                <form class="contact-form" id="contact-form">
                    <div class="form-group">
                        <input type="text" id="name" name="name" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="email" name="email" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <input type="text" id="subject" name="subject" placeholder="Subject" required>
                    </div>
                    <div class="form-group">
                        <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; ${new Date().getFullYear()} ${personalInfo?.name || 'Portfolio Owner'}. All rights reserved.</p>
                <p>Built with ❤️ using Portfolio Generator</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
};

const generateCSS = (data) => {
  const { theme } = data;
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const secondaryColor = theme?.secondaryColor || '#1f2937';
  const backgroundColor = theme?.backgroundColor || '#ffffff';
  
  return `/* Portfolio Styles */
:root {
    --primary-color: ${primaryColor};
    --secondary-color: ${secondaryColor};
    --background-color: ${backgroundColor};
    --text-color: #374151;
    --text-light: #6b7280;
    --border-color: #e5e7eb;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
    --border-radius: 0.5rem;
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    transition: var(--transition);
    border-bottom: 1px solid var(--border-color);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.nav-logo a {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    text-decoration: none;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
    position: relative;
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary-color);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: var(--transition);
}

.nav-link:hover::after,
.nav-link.active::after {
    width: 100%;
}

.nav-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.bar {
    width: 25px;
    height: 3px;
    background: var(--text-color);
    margin: 3px 0;
    transition: var(--transition);
}

/* Hero Section */
.hero {
    padding: 120px 0 80px;
    min-height: 100vh;
    display: flex;
    align-items: center;
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.highlight {
    color: var(--primary-color);
}

.hero-subtitle {
    font-size: 1.5rem;
    color: var(--text-light);
    margin-bottom: 1.5rem;
    font-weight: 400;
}

.hero-description {
    font-size: 1.125rem;
    color: var(--text-light);
    margin-bottom: 2rem;
    line-height: 1.7;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.btn-secondary {
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
}

.hero-social {
    display: flex;
    gap: 1rem;
}

.hero-social a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--border-color);
    color: var(--text-color);
    border-radius: 50%;
    text-decoration: none;
    transition: var(--transition);
}

.hero-social a:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
}

.hero-image {
    text-align: center;
}

.profile-img {
    width: 400px;
    height: 400px;
    border-radius: 50%;
    object-fit: cover;
    border: 8px solid var(--primary-color);
    box-shadow: var(--shadow-lg);
}

/* Section Styles */
.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--secondary-color);
}

/* About Section */
.about {
    padding: 80px 0;
    background: #f9fafb;
}

.about-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: center;
}

.about-text {
    font-size: 1.125rem;
    line-height: 1.8;
}

.about-stats {
    display: grid;
    gap: 2rem;
}

.stat {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
}

.stat h3 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.stat p {
    color: var(--text-light);
    font-weight: 500;
}

/* Resume Section */
.resume {
    padding: 80px 0;
}

.resume-section {
    margin-bottom: 4rem;
}

.resume-subtitle {
    font-size: 1.875rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: var(--secondary-color);
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.skill-item {
    background: var(--primary-color);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    text-align: center;
    font-weight: 500;
    transition: var(--transition);
}

.skill-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
}

.timeline {
    position: relative;
    padding-left: 2rem;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--primary-color);
}

.timeline-item {
    position: relative;
    margin-bottom: 2rem;
    padding-left: 2rem;
}

.timeline-marker {
    position: absolute;
    left: -2rem;
    top: 0;
    width: 12px;
    height: 12px;
    background: var(--primary-color);
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: var(--shadow);
}

.timeline-content h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--secondary-color);
}

.timeline-content h5 {
    font-size: 1rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.timeline-date {
    font-size: 0.875rem;
    color: var(--text-light);
    font-weight: 500;
}

.resume-download {
    text-align: center;
    margin-top: 3rem;
}

/* Projects Section */
.projects {
    padding: 80px 0;
    background: #f9fafb;
}

.project-filters {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.5rem 1rem;
    background: white;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
    cursor: pointer;
    transition: var(--transition);
    font-weight: 500;
}

.filter-btn:hover,
.filter-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.project-card {
    background: white;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

.project-image {
    position: relative;
    overflow: hidden;
    height: 250px;
}

.project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.project-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(59, 130, 246, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition);
}

.project-card:hover .project-overlay {
    opacity: 1;
}

.project-links {
    display: flex;
    gap: 1rem;
}

.project-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: white;
    color: var(--primary-color);
    border-radius: 50%;
    text-decoration: none;
    transition: var(--transition);
}

.project-link:hover {
    transform: scale(1.1);
}

.project-content {
    padding: 1.5rem;
}

.project-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--secondary-color);
}

.project-description {
    color: var(--text-light);
    margin-bottom: 1rem;
    line-height: 1.6;
}

.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tech-tag {
    background: var(--border-color);
    color: var(--text-color);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
}

/* Contact Section */
.contact {
    padding: 80px 0;
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
}

.contact-info h3 {
    font-size: 1.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--secondary-color);
}

.contact-details {
    margin: 2rem 0;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.contact-item i {
    width: 20px;
    color: var(--primary-color);
}

.contact-item a {
    color: var(--text-color);
    text-decoration: none;
    transition: var(--transition);
}

.contact-item a:hover {
    color: var(--primary-color);
}

.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    text-decoration: none;
    transition: var(--transition);
}

.social-links a:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.contact-form {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: var(--transition);
    font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
}

/* Footer */
.footer {
    background: var(--secondary-color);
    color: white;
    padding: 2rem 0;
    text-align: center;
}

.footer-content p {
    margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        left: -100%;
        top: 70px;
        flex-direction: column;
        background-color: white;
        width: 100%;
        text-align: center;
        transition: var(--transition);
        box-shadow: var(--shadow);
        padding: 2rem 0;
    }

    .nav-menu.active {
        left: 0;
    }

    .nav-toggle {
        display: flex;
    }

    .nav-toggle.active .bar:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }

    .nav-toggle.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }

    .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .profile-img {
        width: 300px;
        height: 300px;
    }

    .about-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }

    .project-filters {
        justify-content: center;
    }

    .projects-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 1rem;
    }

    .hero-title {
        font-size: 2rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .profile-img {
        width: 250px;
        height: 250px;
    }
}

/* Print Styles */
@media print {
    .navbar,
    .hero-buttons,
    .hero-social,
    .project-filters,
    .contact-form,
    .footer {
        display: none !important;
    }

    .hero {
        padding: 2rem 0;
        min-height: auto;
    }

    .section-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .hero-title {
        font-size: 2rem;
    }

    body {
        font-size: 12px;
        line-height: 1.4;
    }

    .container {
        max-width: none;
        padding: 0;
    }
}`;
};

const generateJS = (data) => {
  return `// Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(\`.nav-link[href="#\${sectionId}"]\`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const mailtoLink = \`mailto:${data.contact?.email || 'contact@example.com'}?subject=\${encodeURIComponent(subject)}&body=\${encodeURIComponent(\`Name: \${name}\\nEmail: \${email}\\n\\nMessage:\\n\${message}\`)}\`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            alert('Thank you for your message! Your email client should open now.');
            
            // Reset form
            this.reset();
        });
    }

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .timeline-item, .skill-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Navbar Background on Scroll
    const navbar = document.getElementById('navbar');
    
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', updateNavbarBackground);

    // Typing Animation for Hero Title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 500);
    }

    // Skill Animation
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((skill, index) => {
        skill.style.animationDelay = \`\${index * 0.1}s\`;
    });

    // Back to Top Button (Optional)
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = \`
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    \`;
    
    document.body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance Optimization
const debouncedScroll = debounce(() => {
    updateActiveNavLink();
    updateNavbarBackground();
    toggleBackToTop();
}, 10);

window.addEventListener('scroll', debouncedScroll);`;
};

const generateREADME = (data) => {
  const { personalInfo } = data;
  
  return `# ${personalInfo?.name || 'Portfolio'} - Professional Portfolio

This is a professional portfolio website showcasing skills, experience, and projects.

## 🚀 Features

- **Responsive Design**: Works perfectly on all devices
- **Modern UI/UX**: Clean and professional design
- **Interactive Elements**: Smooth animations and transitions
- **Project Filtering**: Filter projects by category
- **Contact Form**: Functional contact form with email integration
- **SEO Optimized**: Meta tags and structured data
- **Print Friendly**: Optimized for resume printing

## 🛠️ Technologies Used

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts (Inter)

## 📱 Sections

1. **Hero/Home**: Introduction and call-to-action
2. **About**: Personal summary and statistics
3. **Resume**: Skills, experience, and education
4. **Projects**: Portfolio of work with filtering
5. **Contact**: Contact information and form

## 🎨 Customization

The portfolio uses CSS custom properties for easy theming:

\`\`\`css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #1f2937;
    --background-color: #ffffff;
    /* ... other variables */
}
\`\`\`

## 📧 Contact Form

The contact form uses a mailto link to open the user's default email client. For a more advanced solution, consider integrating with:

- Netlify Forms
- Formspree
- EmailJS
- Custom backend API

## 🚀 Deployment

This portfolio is ready to be deployed on:

- **Netlify**: Drag and drop deployment
- **Vercel**: Git integration with automatic deployments
- **GitHub Pages**: Free hosting for static sites
- **Any static hosting service**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and customize it for your own use!

---

Built with ❤️ using [Portfolio Generator](https://github.com/your-username/portfolio-generator)`;
};

module.exports = {
  generatePortfolioFiles
};`;
import { toast } from 'react-toastify';

class AutoDeployService {
  constructor() {
    this.apiBaseUrl = process.env.NODE_ENV === 'production' 
      ? '/api' 
      : 'http://localhost:3001/api';
  }

  // Auto-create GitHub repository when user logs in
  async createUserRepository(user, portfolioData) {
    try {
      // Check if user has GitHub token stored
      const githubToken = localStorage.getItem('github_token');
      if (!githubToken) {
        console.log('No GitHub token found, skipping auto-repo creation');
        return null;
      }

      const username = this.extractGithubUsername(user.email) || user.displayName?.toLowerCase().replace(/\s+/g, '-');
      const repoName = `${username}-portfolio`;

      // Generate basic portfolio files
      const portfolioFiles = await this.generateBasicPortfolioFiles(portfolioData, user);

      const response = await fetch(`${this.apiBaseUrl}/github/create-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          repoName,
          portfolioFiles,
          githubToken
        })
      });

      const result = await response.json();

      if (result.success) {
        // Store repository info for later use
        localStorage.setItem('user_repo_info', JSON.stringify({
          repoUrl: result.repoUrl,
          cloneUrl: result.cloneUrl,
          siteUrl: result.siteUrl,
          username,
          repoName
        }));

        toast.success('GitHub repository created successfully!');
        return result;
      } else {
        console.error('Failed to create repository:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Error creating repository:', error);
      return null;
    }
  }

  // Auto-deploy to selected platform
  async autoDeployPortfolio(portfolioData, deploymentPlatform = 'github') {
    try {
      const repoInfo = JSON.parse(localStorage.getItem('user_repo_info') || '{}');
      
      if (!repoInfo.repoUrl) {
        throw new Error('No repository found. Please create a repository first.');
      }

      // Generate updated portfolio files
      const portfolioFiles = await this.generatePortfolioFiles(portfolioData);

      // Update repository with new files
      await this.updateRepository(repoInfo, portfolioFiles);

      // Deploy to selected platform
      let deployResult;
      switch (deploymentPlatform.toLowerCase()) {
        case 'vercel':
          deployResult = await this.deployToVercel(repoInfo, portfolioData);
          break;
        case 'netlify':
          deployResult = await this.deployToNetlify(repoInfo, portfolioData);
          break;
        case 'github':
        default:
          deployResult = await this.deployToGitHubPages(repoInfo);
          break;
      }

      if (deployResult.success) {
        toast.success(`Portfolio deployed successfully to ${deploymentPlatform}!`);
        return deployResult;
      } else {
        throw new Error(deployResult.message || 'Deployment failed');
      }
    } catch (error) {
      console.error('Auto-deploy error:', error);
      toast.error(`Deployment failed: ${error.message}`);
      throw error;
    }
  }

  // Generate basic portfolio files for initial repo creation
  async generateBasicPortfolioFiles(portfolioData, user) {
    const name = portfolioData?.personalInfo?.name || user.displayName || 'Your Name';
    const title = portfolioData?.personalInfo?.title || 'Professional';
    const email = portfolioData?.personalInfo?.email || user.email;

    return {
      'index.html': this.generateBasicHTML(name, title, email),
      'styles.css': this.generateBasicCSS(),
      'script.js': this.generateBasicJS(),
      'README.md': this.generateBasicReadme(name, title)
    };
  }

  // Generate complete portfolio files
  async generatePortfolioFiles(portfolioData) {
    // Import the portfolio generator
    const { generatePortfolioFiles } = await import('../utils/portfolioGenerator');
    return generatePortfolioFiles(portfolioData);
  }

  // Update repository with new files
  async updateRepository(repoInfo, portfolioFiles) {
    const githubToken = localStorage.getItem('github_token');
    
    const response = await fetch(`${this.apiBaseUrl}/github/update-files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: repoInfo.username,
        repoName: repoInfo.repoName,
        portfolioFiles,
        githubToken
      })
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to update repository');
    }

    return result;
  }

  // Deploy to GitHub Pages
  async deployToGitHubPages(repoInfo) {
    const githubToken = localStorage.getItem('github_token');
    
    const response = await fetch(`${this.apiBaseUrl}/github/setup-pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: repoInfo.username,
        repoName: repoInfo.repoName,
        githubToken
      })
    });

    return await response.json();
  }

  // Deploy to Vercel
  async deployToVercel(repoInfo, portfolioData) {
    const vercelToken = localStorage.getItem('vercel_token');
    if (!vercelToken) {
      throw new Error('Vercel token not found. Please configure Vercel integration.');
    }

    const projectName = `${repoInfo.username}-portfolio`;
    
    const response = await fetch(`${this.apiBaseUrl}/vercel/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repoUrl: repoInfo.repoUrl,
        projectName,
        vercelToken
      })
    });

    return await response.json();
  }

  // Deploy to Netlify
  async deployToNetlify(repoInfo, portfolioData) {
    const netlifyToken = localStorage.getItem('netlify_token');
    if (!netlifyToken) {
      throw new Error('Netlify token not found. Please configure Netlify integration.');
    }

    const siteName = `${repoInfo.username}-portfolio`;
    
    const response = await fetch(`${this.apiBaseUrl}/netlify/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repoUrl: repoInfo.repoUrl,
        siteName,
        netlifyToken
      })
    });

    return await response.json();
  }

  // Helper methods
  extractGithubUsername(email) {
    // Extract username from email (before @)
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }

  generateBasicHTML(name, title, email) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - ${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <h1>${name}</h1>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="hero">
            <h1>Hi, I'm ${name}</h1>
            <p>${title}</p>
            <p>Welcome to my portfolio! This is a work in progress.</p>
        </section>

        <section id="about">
            <h2>About Me</h2>
            <p>Professional ${title.toLowerCase()} passionate about creating amazing experiences.</p>
        </section>

        <section id="projects">
            <h2>Projects</h2>
            <p>Projects will be displayed here once you complete your portfolio.</p>
        </section>

        <section id="contact">
            <h2>Contact</h2>
            <p>Email: <a href="mailto:${email}">${email}</a></p>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 ${name}. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
  }

  generateBasicCSS() {
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #2c3e50;
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

nav a:hover {
    color: #3498db;
}

main {
    margin-top: 80px;
}

section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

#hero {
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #2c3e50;
}

footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem;
}

@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    #hero h1 {
        font-size: 2rem;
    }
}`;
  }

  generateBasicJS() {
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

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(44, 62, 80, 0.95)';
    } else {
        header.style.background = '#2c3e50';
    }
});

console.log('Portfolio loaded successfully!');`;
  }

  generateBasicReadme(name, title) {
    return `# ${name} - Portfolio

Welcome to my professional portfolio website!

## About
I'm a ${title} passionate about creating amazing digital experiences.

## Features
- Responsive design
- Modern UI/UX
- Fast loading
- SEO optimized

## Technologies Used
- HTML5
- CSS3
- JavaScript
- GitHub Pages

## Contact
Feel free to reach out for collaborations or opportunities!

---
*This portfolio was generated using Portfolio Generator Platform*`;
  }

  // Check if user has deployment tokens configured
  hasDeploymentTokens() {
    return {
      github: !!localStorage.getItem('github_token'),
      vercel: !!localStorage.getItem('vercel_token'),
      netlify: !!localStorage.getItem('netlify_token')
    };
  }

  // Set deployment tokens
  setDeploymentToken(platform, token) {
    localStorage.setItem(`${platform}_token`, token);
  }

  // Get available deployment platforms
  getAvailablePlatforms() {
    const tokens = this.hasDeploymentTokens();
    const platforms = [];
    
    if (tokens.github) platforms.push('github');
    if (tokens.vercel) platforms.push('vercel');
    if (tokens.netlify) platforms.push('netlify');
    
    return platforms;
  }
}

export default new AutoDeployService();
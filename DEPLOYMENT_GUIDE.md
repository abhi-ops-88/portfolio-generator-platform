# Portfolio Generator - Deployment Guide

This guide will help you set up and deploy your portfolio using the Portfolio Generator platform with support for Vercel, Netlify, and GitHub Pages.

## 🚀 Quick Start

1. **Generate Your Portfolio**: Use the Portfolio Generator to create your portfolio data
2. **Choose Deployment Platform**: Select from Vercel, Netlify, or GitHub Pages
3. **Configure Tokens**: Set up API tokens for your chosen platform
4. **Deploy**: Click deploy and your portfolio will be live!

## 🔧 Setup Instructions

### Prerequisites

- GitHub account
- Account on your chosen hosting platform (Vercel, Netlify, or GitHub Pages)

### 1. GitHub Setup

All deployment options require a GitHub repository to store your portfolio code.

#### Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Portfolio Generator"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows) - if using GitHub Actions
5. Click "Generate token"
6. **Important**: Copy the token immediately - you won't be able to see it again!

### 2. Platform-Specific Setup

#### Option A: Netlify Deployment

Netlify offers continuous deployment with automatic HTTPS and global CDN.

**Setup Steps:**
1. Create a [Netlify account](https://netlify.com)
2. Go to [User settings > Applications > Personal access tokens](https://app.netlify.com/user/applications#personal-access-tokens)
3. Click "New access token"
4. Give it a name like "Portfolio Generator"
5. Copy the token

**Features:**
- Automatic HTTPS
- Global CDN
- Form handling
- Instant rollbacks
- Custom domains

#### Option B: Vercel Deployment

Vercel provides edge functions and automatic optimizations.

**Setup Steps:**
1. Create a [Vercel account](https://vercel.com)
2. Go to [Account Settings > Tokens](https://vercel.com/account/tokens)
3. Click "Create Token"
4. Give it a name like "Portfolio Generator"
5. Set expiration as needed
6. Copy the token

**Features:**
- Edge Network
- Automatic optimizations
- Analytics
- Preview deployments
- Custom domains

#### Option C: GitHub Pages (Free)

GitHub Pages offers free hosting directly from your repository.

**Setup Steps:**
1. No additional tokens needed beyond GitHub token
2. Your site will be available at: `https://yourusername.github.io/repository-name`

**Features:**
- Free hosting
- Custom domains
- HTTPS
- Jekyll support
- Direct integration with GitHub

### 3. Backend API Setup (Optional)

If you want to run the deployment API locally or on your own server:

#### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-generator
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy environment files
   cp .env.example .env
   cd server
   cp .env.example .env
   ```

4. **Start the servers**
   ```bash
   # Start the API server (in server directory)
   npm run dev
   
   # Start the React app (in root directory)
   npm start
   ```

#### Production Deployment

Deploy the API server to platforms like:
- **Heroku**: Easy deployment with git integration
- **Railway**: Modern deployment platform
- **DigitalOcean App Platform**: Managed platform
- **AWS/GCP/Azure**: Cloud platforms

## 🎨 Customization Options

### Theme Customization

The generated portfolio supports theme customization through CSS variables:

```css
:root {
    --primary-color: #3b82f6;      /* Main brand color */
    --secondary-color: #1f2937;    /* Secondary color */
    --background-color: #ffffff;   /* Background color */
}
```

### Content Sections

The portfolio includes these customizable sections:
- **Hero/Home**: Personal introduction and call-to-action
- **About**: Professional summary and statistics
- **Resume**: Skills, experience, and education timeline
- **Projects**: Portfolio showcase with filtering
- **Contact**: Contact information and form

### Project Categories

Projects can be filtered by category:
- Web Development
- Mobile Development
- AI/ML
- DevOps
- Custom categories

## 📱 Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly navigation

### SEO Optimization
- Meta tags for social sharing
- Structured data
- Semantic HTML
- Fast loading performance

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader friendly
- High contrast support

### Performance
- Optimized images
- Minified CSS/JS
- Fast loading times
- Progressive enhancement

## 🔒 Security Best Practices

### Token Security
- Never commit tokens to version control
- Use environment variables for sensitive data
- Rotate tokens regularly
- Use minimal required permissions

### Repository Security
- Keep repositories public for GitHub Pages
- Use private repositories for sensitive projects
- Review code before deployment
- Enable branch protection rules

## 🐛 Troubleshooting

### Common Issues

#### "Repository already exists" Error
- The repository name is already taken
- Try a different name or add a suffix
- Check if you have an existing repository with the same name

#### "Invalid token" Error
- Token may be expired or incorrect
- Regenerate the token with proper permissions
- Ensure token has required scopes

#### "Deployment failed" Error
- Check API logs for detailed error messages
- Verify all required fields are filled
- Ensure tokens have proper permissions

#### Site not loading after deployment
- Wait a few minutes for DNS propagation
- Check deployment status in platform dashboard
- Verify repository files were uploaded correctly

### Getting Help

1. **Check the console**: Browser developer tools often show helpful error messages
2. **Review API responses**: Network tab shows detailed error responses
3. **Platform documentation**: Each platform has extensive documentation
4. **Community support**: GitHub issues, Discord, or platform-specific forums

## 📚 Additional Resources

### Documentation Links
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Netlify API Documentation](https://docs.netlify.com/api/get-started/)
- [Vercel API Documentation](https://vercel.com/docs/rest-api)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

### Tutorials
- [Setting up custom domains](https://docs.netlify.com/domains-https/custom-domains/)
- [Configuring HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Advanced deployment workflows](https://docs.github.com/en/actions/deployment/about-deployments/about-continuous-deployment)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Need help?** Open an issue on GitHub or contact our support team.
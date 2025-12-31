# DeckFolio - Stack Your Story Instantly

A comprehensive platform for generating and deploying professional portfolio websites with enterprise-grade deployment support for multiple hosting platforms including Vercel, Netlify, and GitHub Pages. Now featuring dual theme support with AWS-inspired and Black & White professional themes.

## 🚀 Features

### Portfolio Generation
- **Deck-Based Builder**: Stack your story with our intuitive step-by-step interface
- **Real-time Preview**: See changes as you build your professional narrative
- **Professional Templates**: Modern, responsive designs with enterprise-grade styling
- **Dual Theme System**: Choose between AWS-inspired or Black & White professional themes
- **Theme Customization**: Enterprise-grade colors, fonts, and layouts with instant switching
- **Content Management**: Easy editing and updates with professional polish
- **Portfolio Limits**: Smart 2-portfolio limit with clear management interface

### 🎨 Theme System
- **AWS Professional Theme**: Enterprise-grade orange and blue theme inspired by AWS design
  - AWS Orange (#FF9900) primary color
  - Professional blue (#232F3E) secondary color
  - Amazon Ember font family
  - Enterprise-grade shadows and animations
- **Black & White Theme**: Clean, minimalist professional theme
  - Pure black (#000000) and white (#FFFFFF) color scheme
  - High-contrast design for enhanced readability
  - Professional gray scale for subtle elements
  - Accessibility-focused with high contrast support
- **Instant Theme Switching**: Toggle between themes with smooth transitions
- **Persistent Preferences**: Theme choice saved automatically
- **Theme-Aware Components**: All UI elements adapt perfectly to selected theme

### Multi-Platform Deployment
- **Vercel**: Edge functions and automatic optimizations
- **Netlify**: Continuous deployment with global CDN
- **GitHub Pages**: Free hosting with custom domains
- **One-Click Deploy**: Automated setup and configuration with enterprise reliability
- **Token Management**: Secure API token storage and management
- **Deployment Status**: Real-time deployment tracking and status updates

### Generated Portfolio Features
- **Responsive Design**: Mobile-first, works on all devices
- **SEO Optimized**: Meta tags, structured data, fast loading
- **Interactive Elements**: Smooth animations, project filtering
- **Contact Forms**: Functional contact integration
- **Print-Friendly**: Optimized resume printing
- **Accessibility**: WCAG compliant, screen reader friendly
- **Theme Consistency**: Generated portfolios match selected theme

## 🛠️ Tech Stack

### Frontend (React App)
- **React 18**: Modern React with hooks and context API
- **React Router**: Client-side routing with protected routes
- **React Hook Form**: Advanced form management
- **React Toastify**: Theme-aware notifications
- **Lucide React**: Modern icon system
- **Firebase**: Authentication and data storage
- **Theme System**: Custom CSS variables with smooth transitions
- **AWS-Inspired Design**: Enterprise-grade UI components
- **Black & White Theme**: High-contrast professional alternative

### Backend (Node.js API)
- **Express.js**: Web framework with CORS support
- **Axios**: HTTP client for API calls
- **Multer**: File upload handling
- **Token Management**: Secure API token handling

### Generated Portfolio (Static)
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with custom properties and theme support
- **Vanilla JavaScript**: No framework dependencies for fast loading
- **Font Awesome**: Icon library
- **Google Fonts**: Professional typography
- **Theme Integration**: Matches user's selected theme

## 📋 Prerequisites

Before running DeckFolio, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- Accounts on hosting platforms (optional):
  - GitHub account (required for all deployments)
  - Netlify account (for Netlify deployment)
  - Vercel account (for Vercel deployment)

## 🚀 Quick Deployment to Vercel

To make your DeckFolio publicly available:

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/deckfolio)

### Option 2: Manual Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "DeckFolio app with dual theme support"
   git push origin main
   ```

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

3. **Configure Environment Variables** in Vercel dashboard:
   - Set up Firebase (see `FIREBASE_QUICK_SETUP.md`)
   - Add Firebase configuration to environment variables

### Option 3: Use Deployment Scripts

**For Unix/Mac/Linux**:
```bash
chmod +x deploy.sh
./deploy.sh
```

**For Windows**:
```cmd
deploy.bat
```

📖 **Detailed Instructions**: See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

---

## 🚀 Quick Start

### Local Development

#### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd deckfolio
\`\`\`

#### 2. Install Dependencies

\`\`\`bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
\`\`\`

#### 3. Environment Setup

\`\`\`bash
# Copy environment files
cp .env.example .env
cp server/.env.example server/.env
\`\`\`

#### 4. Configure Environment Variables

#### Client (.env)
\`\`\`env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
\`\`\`

#### Server (server/.env)
\`\`\`env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
\`\`\`

#### 5. Start Development Servers

\`\`\`bash
# Terminal 1: Start the API server
cd server
npm run dev

# Terminal 2: Start the React app
npm start
\`\`\`

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📁 Project Structure

\`\`\`
deckfolio/
├── public/                 # Static files and PWA manifest
├── src/                   # React application source
│   ├── components/        # Reusable components
│   │   ├── auth/         # Authentication components
│   │   ├── forms/        # Form components
│   │   └── ThemeToggle.js # Theme switching component
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.js # Authentication state
│   │   └── ThemeContext.js # Theme management
│   ├── pages/            # Page components
│   │   ├── Dashboard.js  # User dashboard with theme toggle
│   │   ├── Generator.js  # Portfolio builder
│   │   ├── Settings.js   # Theme and user preferences
│   │   └── Home.js       # Landing page with theme preview
│   ├── styles/           # Theme stylesheets
│   │   ├── aws-inspired-theme.css # AWS professional theme
│   │   └── black-white-theme.css  # Black & white theme
│   ├── utils/            # Utility functions
│   └── config/           # Configuration files
├── server/               # Backend API
│   ├── routes/          # API routes
│   ├── utils/           # Server utilities
│   └── server.js        # Main server file
├── DEPLOYMENT_GUIDE.md  # Detailed deployment guide
└── README.md           # This file
\`\`\`

## 🎯 Usage

### 1. Stack Your Story

1. **Sign Up/Login**: Create an account or sign in
2. **Choose Theme**: Select AWS Professional or Black & White theme
3. **Personal Information**: Add your basic details
4. **About Section**: Write your professional summary
5. **Resume**: Add skills, experience, and education
6. **Projects**: Showcase your work with images and descriptions
7. **Contact**: Add your contact information
8. **Theme Customization**: Fine-tune your selected theme

### 2. Theme Management

#### Theme Selection
- **AWS Professional**: Enterprise-grade orange and blue design
- **Black & White**: Clean, high-contrast minimalist design

#### Theme Toggle Locations
- **Header Navigation**: Quick access for all users
- **Dashboard Menu**: Integrated with user account settings
- **Settings Page**: Full theme management interface
- **Home Page**: Theme preview for new visitors

#### Theme Features
- **Instant Switching**: Themes change immediately with smooth transitions
- **Persistent Storage**: Your theme choice is remembered across sessions
- **Responsive Design**: Both themes work perfectly on all devices
- **Accessibility**: High contrast support and enhanced focus states

### 3. Portfolio Management

- **2-Portfolio Limit**: Create up to 2 professional portfolios
- **Story Management**: Edit, preview, and delete your stories
- **Deployment Tracking**: Monitor deployment status and URLs
- **Theme Consistency**: Generated portfolios match your selected theme

### 4. Deploy Instantly

1. **Choose Platform**: Select Vercel, Netlify, or GitHub Pages
2. **Configure Tokens**: Add your API tokens (see [Deployment Guide](DEPLOYMENT_GUIDE.md))
3. **Deploy**: Click deploy and wait for completion
4. **Access**: Your story goes live instantly at the provided URL

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Copy configuration to your `.env` file

### API Tokens Setup

See the detailed [Deployment Guide](DEPLOYMENT_GUIDE.md) for platform-specific token setup instructions.

### Theme Configuration

Themes are automatically configured and ready to use. No additional setup required.

## 🎨 Theme Customization

### AWS Professional Theme
- **Primary Color**: AWS Orange (#FF9900)
- **Secondary Color**: AWS Blue (#232F3E)
- **Typography**: Amazon Ember font family
- **Shadows**: Enterprise-grade depth and elevation
- **Animations**: Smooth, professional transitions
- **Components**: AWS-inspired buttons, cards, and layouts

### Black & White Theme
- **Primary Color**: Pure Black (#000000)
- **Secondary Color**: Pure White (#FFFFFF)
- **Accent Colors**: Professional gray scale
- **Typography**: High-contrast, readable fonts
- **Design**: Minimalist, clean aesthetic
- **Accessibility**: Enhanced contrast and focus states

### Theme Development
To create additional themes:

1. Create a new CSS file in `src/styles/`
2. Define theme variables using `[data-theme="your-theme"]` selector
3. Add theme option to `ThemeContext.js`
4. Update `ThemeToggle.js` component
5. Add theme preview to Settings page

## 🚀 Deployment Options

### Development
- Local development with hot reload
- Environment-specific configurations
- Debug mode with detailed logging
- Theme switching in development

### Production

#### Frontend Deployment
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag-and-drop or Git integration
- **GitHub Pages**: Direct deployment from repository

#### Backend Deployment
- **Heroku**: Easy deployment with git integration
- **Railway**: Modern deployment platform
- **DigitalOcean**: App platform deployment
- **AWS/GCP/Azure**: Cloud platform deployment

## 🧪 Testing

\`\`\`bash
# Run client tests
npm test

# Run server tests
cd server
npm test

# Test theme switching
# Themes are automatically tested during development
\`\`\`

## 📚 API Documentation

### Endpoints

#### GitHub Integration
- \`POST /api/github/create-repo\` - Create repository and upload files
- \`POST /api/github/setup-pages\` - Enable GitHub Pages

#### Netlify Integration
- \`POST /api/netlify/deploy\` - Deploy to Netlify
- \`GET /api/netlify/status/:siteId\` - Get deployment status

#### Vercel Integration
- \`POST /api/vercel/deploy\` - Deploy to Vercel
- \`GET /api/vercel/status/:projectId\` - Get deployment status

### Theme API
Themes are managed client-side through React Context:
- Theme selection persisted in localStorage
- Automatic CSS variable updates
- Smooth transition animations
- Component re-rendering with theme awareness

## 🎨 Theme System Architecture

### Context Management
- **ThemeContext**: Global theme state management
- **ThemeProvider**: Wraps entire application
- **useTheme**: Hook for accessing theme state

### CSS Architecture
- **CSS Variables**: Dynamic theme switching
- **Data Attributes**: Theme-specific selectors
- **Smooth Transitions**: All elements animate between themes
- **Component Isolation**: Each component handles its own theme styles

### Theme Components
- **ThemeToggle**: Interactive theme switcher
- **Settings Page**: Full theme management interface
- **Theme-Aware Notifications**: Toast messages match selected theme

## 🤝 Contributing

We welcome contributions to DeckFolio! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Maintain theme consistency across both themes
- Test theme switching functionality
- Ensure accessibility compliance

### Theme Development Guidelines
- Use CSS variables for dynamic theming
- Test both themes thoroughly
- Maintain professional appearance
- Ensure high contrast for accessibility
- Follow existing animation patterns

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in environment variables
2. **Firebase connection issues**: Verify configuration and network
3. **API token errors**: Check token permissions and expiration
4. **Build failures**: Ensure all dependencies are installed
5. **Theme not switching**: Clear browser cache and localStorage
6. **Theme persistence issues**: Check localStorage permissions

### Theme-Specific Issues
- **Theme not loading**: Ensure CSS files are properly imported
- **Transitions not smooth**: Check CSS transition properties
- **Components not updating**: Verify theme context is properly wrapped
- **Accessibility issues**: Test with screen readers and high contrast mode

See [Deployment Guide](DEPLOYMENT_GUIDE.md) for platform-specific troubleshooting.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for authentication and database services
- AWS for design inspiration and enterprise-grade patterns
- Vercel, Netlify, and GitHub for hosting platforms
- Accessibility community for high contrast design guidance
- All contributors and users of DeckFolio

## 📞 Support

- **Documentation**: Check this README and the Deployment Guide
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainers directly
- **Theme Issues**: Report theme-specific bugs with screenshots

## 🎨 Theme Gallery

### AWS Professional Theme
- Enterprise-grade orange and blue color scheme
- Professional shadows and depth
- AWS-inspired component design
- Smooth animations and transitions

### Black & White Theme
- High-contrast minimalist design
- Pure black and white color palette
- Enhanced accessibility features
- Clean, professional aesthetic

---

**Happy Story Stacking with DeckFolio! 📚✨**

*Now with dual theme support for every professional style preference.*
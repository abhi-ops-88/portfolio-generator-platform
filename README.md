# Portfolio Generator Platform

A comprehensive platform for generating and deploying professional portfolio websites with support for multiple hosting platforms including Vercel, Netlify, and GitHub Pages.

## 🚀 Features

### Portfolio Generation
- **Interactive Form Builder**: Step-by-step portfolio creation
- **Real-time Preview**: See changes as you build
- **Professional Templates**: Modern, responsive designs
- **Theme Customization**: Colors, fonts, and layouts
- **Content Management**: Easy editing and updates

### Multi-Platform Deployment
- **Vercel**: Edge functions and automatic optimizations
- **Netlify**: Continuous deployment with global CDN
- **GitHub Pages**: Free hosting with custom domains
- **One-Click Deploy**: Automated setup and configuration

### Generated Portfolio Features
- **Responsive Design**: Mobile-first, works on all devices
- **SEO Optimized**: Meta tags, structured data, fast loading
- **Interactive Elements**: Smooth animations, project filtering
- **Contact Forms**: Functional contact integration
- **Print-Friendly**: Optimized resume printing
- **Accessibility**: WCAG compliant, screen reader friendly

## 🛠️ Tech Stack

### Frontend (React App)
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **React Hook Form**: Form management
- **React Toastify**: Notifications
- **Lucide React**: Modern icons
- **Firebase**: Authentication and data storage

### Backend (Node.js API)
- **Express.js**: Web framework
- **Axios**: HTTP client for API calls
- **CORS**: Cross-origin resource sharing
- **Multer**: File upload handling

### Generated Portfolio (Static)
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties
- **Vanilla JavaScript**: No framework dependencies
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- Accounts on hosting platforms (optional):
  - GitHub account (required for all deployments)
  - Netlify account (for Netlify deployment)
  - Vercel account (for Vercel deployment)

## 🚀 Quick Deployment to Vercel

To make your Portfolio Generator publicly available:

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/portfolio-generator)

### Option 2: Manual Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Portfolio Generator app"
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
cd portfolio-generator-platform
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
portfolio-generator-platform/
├── public/                 # Static files
├── src/                   # React application source
│   ├── components/        # Reusable components
│   │   ├── auth/         # Authentication components
│   │   └── forms/        # Form components
│   ├── contexts/         # React contexts
│   ├── pages/            # Page components
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

### 1. Create Your Portfolio

1. **Sign Up/Login**: Create an account or sign in
2. **Personal Information**: Add your basic details
3. **About Section**: Write your professional summary
4. **Resume**: Add skills, experience, and education
5. **Projects**: Showcase your work with images and descriptions
6. **Contact**: Add your contact information
7. **Theme**: Customize colors and styling

### 2. Preview Your Portfolio

- Use the preview feature to see how your portfolio looks
- Make adjustments as needed
- Test on different screen sizes

### 3. Deploy Your Portfolio

1. **Choose Platform**: Select Vercel, Netlify, or GitHub Pages
2. **Configure Tokens**: Add your API tokens (see [Deployment Guide](DEPLOYMENT_GUIDE.md))
3. **Deploy**: Click deploy and wait for completion
4. **Access**: Your portfolio will be live at the provided URL

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Copy configuration to your `.env` file

### API Tokens Setup

See the detailed [Deployment Guide](DEPLOYMENT_GUIDE.md) for platform-specific token setup instructions.

## 🎨 Customization

### Theme Options
- **Primary Color**: Main brand color
- **Secondary Color**: Accent color
- **Background Color**: Page background
- **Typography**: Font selection
- **Layout**: Section arrangements

### Content Sections
- **Hero**: Personal introduction
- **About**: Professional summary
- **Resume**: Skills and experience
- **Projects**: Portfolio showcase
- **Contact**: Contact information

## 🚀 Deployment Options

### Development
- Local development with hot reload
- Environment-specific configurations
- Debug mode with detailed logging

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

## 🤝 Contributing

We welcome contributions! Please follow these steps:

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

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in environment variables
2. **Firebase connection issues**: Verify configuration and network
3. **API token errors**: Check token permissions and expiration
4. **Build failures**: Ensure all dependencies are installed

See [Deployment Guide](DEPLOYMENT_GUIDE.md) for platform-specific troubleshooting.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for authentication and database services
- Vercel, Netlify, and GitHub for hosting platforms
- All contributors and users of this project

## 📞 Support

- **Documentation**: Check this README and the Deployment Guide
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainers directly

---

**Happy Portfolio Building! 🎉**
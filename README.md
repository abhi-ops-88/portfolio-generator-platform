# Portfolio Generator Platform

A comprehensive platform that enables users to create professional portfolios with automatic GitHub integration and Netlify deployment. Perfect for students, developers, and professionals looking to showcase their work online.

## 🚀 Features

- **User Authentication**: Secure login with Gmail and custom email/password
- **User Dashboard**: Manage multiple portfolios from a central dashboard
- **Easy Portfolio Creation**: Step-by-step form-based portfolio generator
- **Professional Templates**: Modern, responsive design that works on all devices
- **GitHub Integration**: Automatically creates repositories and uploads portfolio code
- **Netlify Deployment**: One-click deployment with live URL generation
- **Image Upload**: Support for profile pictures, background images, and project screenshots
- **Customizable Themes**: Multiple color schemes and customization options
- **Responsive Design**: Portfolios work perfectly on desktop, tablet, and mobile
- **SEO Optimized**: Generated portfolios are search engine friendly
- **Data Persistence**: Portfolio data saved securely in Firebase Firestore

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **GitHub API** for repository management
- **Netlify API** for deployment
- **Multer** for file uploads
- **Axios** for HTTP requests

### Frontend
- **React 18** with modern hooks
- **Firebase Authentication** for user management
- **Firestore** for data persistence
- **React Router** for navigation
- **React Hook Form** for form management
- **React Dropzone** for file uploads
- **React Color** for theme customization
- **Lucide React** for icons
- **React Toastify** for notifications

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled
- GitHub Personal Access Token
- Netlify Access Token

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio-generator-platform.git
   cd portfolio-generator-platform
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up Firebase** (Required for authentication)
   
   Follow the detailed [Firebase Setup Guide](FIREBASE_SETUP.md) to:
   - Create a Firebase project
   - Enable Authentication (Email/Password and Google)
   - Set up Firestore database
   - Get your Firebase configuration

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   cd client
   cp .env.example .env
   ```
   
   Edit both `.env` files and add your configuration:
   
   **Root `.env`:**
   ```env
   PORT=3000
   GITHUB_TOKEN=your_github_personal_access_token
   NETLIFY_TOKEN=your_netlify_access_token
   NODE_ENV=development
   ```
   
   **Client `.env`:**
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Production Mode

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🔑 API Keys Setup

### GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `user` (Read user profile data)
4. Copy the generated token and add it to your `.env` file

### Netlify Access Token

1. Go to [Netlify User Settings > Applications](https://app.netlify.com/user/applications#personal-access-tokens)
2. Click "New access token"
3. Give it a descriptive name
4. Copy the generated token and add it to your `.env` file

## 📖 Usage

### Creating a Portfolio

1. **Sign Up / Sign In**
   - Create an account with email/password or sign in with Google
   - Access your personal dashboard

2. **Navigate to the Generator**
   - From your dashboard, click "Create New Portfolio"
   - Or go directly to `/generator`

3. **Fill in Your Information**
   - **Personal Info**: Name, title, email, tagline, and images
   - **About**: Description and skills with proficiency levels
   - **Resume**: Education and work experience
   - **Projects**: Project details with images and links
   - **Social**: Social media profile links
   - **Contact**: Contact information
   - **Theme**: Color customization and styling

4. **Save and Manage**
   - Save your progress at any time
   - Access all your portfolios from the dashboard
   - Edit existing portfolios anytime

5. **Preview Your Portfolio**
   - Review your generated portfolio
   - Test responsive design on different screen sizes
   - Make edits if needed

6. **Deploy Your Portfolio**
   - Enter your GitHub and Netlify tokens
   - Choose repository and site names
   - Click deploy to go live!

### Generated Portfolio Features

Each generated portfolio includes:

- **Responsive Navigation**: Smooth scrolling navigation bar
- **Hero Section**: Eye-catching introduction with your photo
- **About Section**: Personal description and skills visualization
- **Resume Section**: Education and experience timeline
- **Projects Section**: Project showcase with images and links
- **Contact Section**: Contact form and social media links
- **Modern Design**: Clean, professional appearance
- **SEO Optimization**: Meta tags and structured data

## 🎨 Customization

### Themes

The platform includes several preset themes:
- Ocean Blue
- Forest Green
- Purple Gradient
- Sunset Orange
- Deep Red
- Teal

You can also create custom themes by:
- Selecting custom colors for primary, accent, and dark variants
- Using the color picker for precise color selection
- Previewing changes in real-time

### Adding New Features

The codebase is modular and extensible:

1. **Backend Routes**: Add new API endpoints in the `routes/` directory
2. **Frontend Components**: Create new React components in `client/src/components/`
3. **Form Steps**: Add new form sections in `client/src/components/forms/`
4. **Services**: Add new integrations in the `services/` directory

## 🔒 Security Considerations

- API tokens are handled securely and not stored on the server
- File uploads are validated and size-limited
- Generated portfolios use static files for security
- CORS is properly configured for cross-origin requests

## 🐛 Troubleshooting

### Common Issues

1. **GitHub API Rate Limits**
   - Use authenticated requests with personal access tokens
   - Implement proper error handling for rate limit responses

2. **Netlify Deployment Failures**
   - Verify your Netlify token has the correct permissions
   - Check that the repository is accessible and contains valid files

3. **File Upload Issues**
   - Ensure uploaded images are under 10MB
   - Supported formats: PNG, JPG, GIF, WebP

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend framework
- [Express.js](https://expressjs.com/) for the robust backend framework
- [GitHub API](https://docs.github.com/en/rest) for repository management
- [Netlify API](https://docs.netlify.com/api/get-started/) for deployment services
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/portfolio-generator-platform/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ for developers, students, and professionals worldwide**
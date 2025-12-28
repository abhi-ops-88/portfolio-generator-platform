# Deployment Guide

This guide covers different deployment options for the Portfolio Generator Platform.

## 🚀 Deployment Options

### 1. Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- Git repository initialized

#### Steps

1. **Create a Heroku app**
   ```bash
   heroku create your-portfolio-generator
   ```

2. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set GITHUB_TOKEN=your_github_token
   heroku config:set NETLIFY_TOKEN=your_netlify_token
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### Heroku Configuration

Add this to your `package.json` (already included):
```json
{
  "scripts": {
    "heroku-postbuild": "npm run install:client && npm run build"
  }
}
```

### 2. Netlify Deployment

#### For Full-Stack App (Backend + Frontend)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `client/build`
   - Add environment variables in Netlify dashboard

#### For Frontend Only

If you want to deploy just the frontend and use external APIs:

1. **Modify API calls** in the React app to point to your backend URL
2. **Build and deploy** the `client` folder to Netlify

### 3. DigitalOcean App Platform

1. **Create a new app** on DigitalOcean
2. **Connect your repository**
3. **Configure build settings**:
   - Build command: `npm run build`
   - Run command: `npm start`
4. **Set environment variables**
5. **Deploy**

### 4. AWS EC2 Deployment

#### Using PM2 for Process Management

1. **Set up EC2 instance** with Node.js
2. **Clone your repository**
3. **Install dependencies**
   ```bash
   npm install
   npm run install:client
   npm run build
   ```
4. **Install PM2**
   ```bash
   npm install -g pm2
   ```
5. **Start the application**
   ```bash
   pm2 start server.js --name "portfolio-generator"
   pm2 startup
   pm2 save
   ```

### 5. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build client
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  portfolio-generator:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - NETLIFY_TOKEN=${NETLIFY_TOKEN}
    volumes:
      - ./uploads:/app/uploads
```

## 🔧 Environment Variables

Make sure to set these environment variables in your deployment platform:

```env
NODE_ENV=production
PORT=3000
GITHUB_TOKEN=your_github_personal_access_token
NETLIFY_TOKEN=your_netlify_access_token
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure headers (helmet.js)
- [ ] Validate and sanitize all inputs
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Implement proper error handling
- [ ] Use secure session management

### Recommended Security Middleware

Add these to your Express app:

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Add logging middleware**
   ```javascript
   const morgan = require('morgan');
   app.use(morgan('combined'));
   ```

2. **Error tracking** (Sentry, Bugsnag)
3. **Performance monitoring** (New Relic, DataDog)
4. **Uptime monitoring** (Pingdom, UptimeRobot)

### Health Check Endpoint

Add a health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🚀 Performance Optimization

### Backend Optimizations

1. **Enable gzip compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Implement caching**
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   ```

3. **Optimize file uploads**
   - Use cloud storage (AWS S3, Cloudinary)
   - Implement image compression
   - Add file type validation

### Frontend Optimizations

1. **Code splitting** (already implemented with React)
2. **Image optimization**
3. **Bundle analysis**
   ```bash
   cd client
   npm install --save-dev webpack-bundle-analyzer
   npm run build
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm install
        npm run install:client
        
    - name: Build application
      run: npm run build
      
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-portfolio-generator"
        heroku_email: "your-email@example.com"
```

## 📱 Mobile Considerations

- Ensure responsive design works on all devices
- Test touch interactions
- Optimize images for mobile networks
- Consider Progressive Web App (PWA) features

## 🌍 Internationalization

For global deployment:

1. **Add i18n support**
2. **Consider timezone handling**
3. **Implement proper date/time formatting**
4. **Add language selection**

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load balancing** (nginx, AWS ALB)
2. **Database clustering** (if you add a database)
3. **CDN integration** (CloudFlare, AWS CloudFront)
4. **Microservices architecture** (for large scale)

### Vertical Scaling

1. **Increase server resources**
2. **Optimize database queries**
3. **Implement caching strategies**
4. **Use connection pooling**

---

Choose the deployment method that best fits your needs and infrastructure requirements. For most use cases, Heroku or Netlify provide the easiest deployment experience.